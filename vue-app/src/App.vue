<template>
  <div class="container">
    <h1>Formulario CRUD - Vue + Vite</h1>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label>DNI:</label>
        <input type="text" v-model="formData.dni" />
        <span v-if="errors.dni" class="error">{{ errors.dni }}</span>
      </div>

      <div class="form-group">
        <label>Nombres:</label>
        <input type="text" v-model="formData.nombres" />
        <span v-if="errors.nombres" class="error">{{ errors.nombres }}</span>
      </div>

      <div class="form-group">
        <label>Apellidos:</label>
        <input type="text" v-model="formData.apellidos" />
        <span v-if="errors.apellidos" class="error">{{ errors.apellidos }}</span>
      </div>

      <div class="form-group">
        <label>Fecha de Nacimiento:</label>
        <input type="date" v-model="formData.fecha_nacimiento" />
        <span v-if="errors.fecha_nacimiento" class="error">{{ errors.fecha_nacimiento }}</span>
      </div>

      <div class="form-group">
        <label>Género:</label>
        <div class="radio-group">
          <label>
            <input type="radio" value="Masculino" v-model="formData.genero" />
            Masculino
          </label>
          <label>
            <input type="radio" value="Femenino" v-model="formData.genero" />
            Femenino
          </label>
        </div>
        <span v-if="errors.genero" class="error">{{ errors.genero }}</span>
      </div>

      <div class="form-group">
        <label>Ciudad:</label>
        <select v-model="formData.ciudad">
          <option value="">Seleccione una ciudad</option>
          <option value="Quito">Quito</option>
          <option value="Guayaquil">Guayaquil</option>
          <option value="Cuenca">Cuenca</option>
          <option value="Ambato">Ambato</option>
          <option value="Manta">Manta</option>
        </select>
        <span v-if="errors.ciudad" class="error">{{ errors.ciudad }}</span>
      </div>

      <div class="button-group">
        <button type="submit" class="btn-submit">
          {{ editingId ? 'Actualizar' : 'Crear' }}
        </button>
        <button v-if="editingId" type="button" @click="resetForm" class="btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <h2>Lista de Personas</h2>
    <table class="table">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>F. Nacimiento</th>
          <th>Género</th>
          <th>Ciudad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="persona in personas" :key="persona.id">
          <td>{{ persona.dni }}</td>
          <td>{{ persona.nombres }}</td>
          <td>{{ persona.apellidos }}</td>
          <td>{{ persona.fecha_nacimiento }}</td>
          <td>{{ persona.genero }}</td>
          <td>{{ persona.ciudad }}</td>
          <td>
            <button @click="handleEdit(persona)" class="btn-edit">Editar</button>
            <button @click="handleDelete(persona.id)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const API_URL = 'http://localhost:3000/api/personas';

    const formData = ref({
      dni: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      genero: '',
      ciudad: ''
    });

    const personas = ref([]);
    const editingId = ref(null);
    const errors = ref({});

    const fetchPersonas = async () => {
      try {
        const response = await axios.get(API_URL);
        personas.value = response.data;
      } catch (error) {
        console.error('Error al cargar personas:', error);
      }
    };

    const validateForm = () => {
      const newErrors = {};

      if (!formData.value.dni || formData.value.dni.length < 8) {
        newErrors.dni = 'DNI debe tener al menos 8 caracteres';
      }

      if (!formData.value.nombres.trim()) {
        newErrors.nombres = 'Nombres son obligatorios';
      }

      if (!formData.value.apellidos.trim()) {
        newErrors.apellidos = 'Apellidos son obligatorios';
      }

      if (!formData.value.fecha_nacimiento) {
        newErrors.fecha_nacimiento = 'Fecha de nacimiento es obligatoria';
      }

      if (!formData.value.genero) {
        newErrors.genero = 'Seleccione un género';
      }

      if (!formData.value.ciudad) {
        newErrors.ciudad = 'Seleccione una ciudad';
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        if (editingId.value) {
          await axios.put(`${API_URL}/${editingId.value}`, formData.value);
          alert('Persona actualizada exitosamente');
        } else {
          await axios.post(API_URL, formData.value);
          alert('Persona creada exitosamente');
        }

        resetForm();
        fetchPersonas();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || 'Error desconocido'));
      }
    };

    const handleEdit = (persona) => {
      formData.value = { ...persona };
      editingId.value = persona.id;
    };

    const handleDelete = async (id) => {
      if (confirm('¿Está seguro de eliminar esta persona?')) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          alert('Persona eliminada');
          fetchPersonas();
        } catch (error) {
          alert('Error al eliminar');
        }
      }
    };

    const resetForm = () => {
      formData.value = {
        dni: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        genero: '',
        ciudad: ''
      };
      editingId.value = null;
      errors.value = {};
    };

    onMounted(() => {
      fetchPersonas();
    });

    return {
      formData,
      personas,
      editingId,
      errors,
      handleSubmit,
      handleEdit,
      handleDelete,
      resetForm
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
  color: #42b883;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

h2 {
  color: #35495e;
  margin: 30px 0 20px;
}

.form {
  display: grid;
  gap: 20px;
  margin-bottom: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #42b883;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit {
  background: #42b883;
  color: white;
  flex: 1;
}

.btn-submit:hover {
  background: #35a372;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background: #42b883;
  color: white;
  font-weight: 600
  }
.table tr:hover {
  background: #f5f5f5;
}
.btn-edit,
.btn-delete {
  padding: 6px 12px;
  margin-right: 5px;
  font-size: 14px;
}
.btn-edit {
  background: #3498db;
  color: white;
}
.btn-edit:hover {
  background: #2980b9;
}
.btn-delete {
  background: #e74c3c;
  color: white;
}
.btn-delete:hover {
  background: #c0392b;
}
</style>