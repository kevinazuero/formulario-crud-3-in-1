<template>
  <div class="min-vh-100 bg-light py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <h1 class="text-center mb-4 text-success fw-bold">
            Gestión de Personas
          </h1>

          <!-- Formulario -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">
                {{ editingId ? 'Editar Persona' : 'Registrar Nueva Persona' }}
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <!-- DNI -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">DNI</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.dni }"
                        v-model="formData.dni"
                        placeholder="Ingrese DNI"
                    />
                    <div v-if="errors.dni" class="invalid-feedback">
                      {{ errors.dni }}
                    </div>
                  </div>

                  <!-- Nombres -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Nombres</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.nombres }"
                        v-model="formData.nombres"
                        placeholder="Ingrese nombres"
                    />
                    <div v-if="errors.nombres" class="invalid-feedback">
                      {{ errors.nombres }}
                    </div>
                  </div>

                  <!-- Apellidos -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Apellidos</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.apellidos }"
                        v-model="formData.apellidos"
                        placeholder="Ingrese apellidos"
                    />
                    <div v-if="errors.apellidos" class="invalid-feedback">
                      {{ errors.apellidos }}
                    </div>
                  </div>

                  <!-- Fecha de Nacimiento -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': errors.fecha_nacimiento }"
                        v-model="formData.fecha_nacimiento"
                    />
                    <div v-if="errors.fecha_nacimiento" class="invalid-feedback">
                      {{ errors.fecha_nacimiento }}
                    </div>
                  </div>

                  <!-- Género -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold d-block">Género</label>
                    <div class="form-check form-check-inline">
                      <input
                          class="form-check-input"
                          type="radio"
                          id="masculino"
                          value="Masculino"
                          v-model="formData.genero"
                      />
                      <label class="form-check-label" for="masculino">
                        Masculino
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                          class="form-check-input"
                          type="radio"
                          id="femenino"
                          value="Femenino"
                          v-model="formData.genero"
                      />
                      <label class="form-check-label" for="femenino">
                        Femenino
                      </label>
                    </div>
                    <div v-if="errors.genero" class="text-danger small">
                      {{ errors.genero }}
                    </div>
                  </div>

                  <!-- Ciudad -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Ciudad</label>
                    <select
                        class="form-select"
                        :class="{ 'is-invalid': errors.ciudad }"
                        v-model="formData.ciudad"
                    >
                      <option value="">Seleccione una ciudad</option>
                      <option value="Quito">Quito</option>
                      <option value="Guayaquil">Guayaquil</option>
                      <option value="Cuenca">Cuenca</option>
                      <option value="Ambato">Ambato</option>
                      <option value="Manta">Manta</option>
                    </select>
                    <div v-if="errors.ciudad" class="invalid-feedback">
                      {{ errors.ciudad }}
                    </div>
                  </div>

                  <!-- Botones -->
                  <div class="col-12">
                    <div class="d-flex gap-2 justify-content-end">
                      <button
                          v-if="editingId"
                          type="button"
                          @click="resetForm"
                          class="btn btn-secondary"
                      >
                        Cancelar
                      </button>
                      <button type="submit" class="btn btn-success">
                        {{ editingId ? 'Actualizar' : 'Registrar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Tabla de Personas -->
          <div class="card shadow-sm">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Lista de Personas Registradas</h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
                  <thead class="table-dark">
                  <tr>
                    <th>DNI</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>F. Nacimiento</th>
                    <th>Género</th>
                    <th>Ciudad</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="personas.length === 0">
                    <td colspan="7" class="text-center text-muted py-4">
                      No hay personas registradas
                    </td>
                  </tr>
                  <tr v-for="persona in personas" :key="persona.id">
                    <td>{{ persona.dni }}</td>
                    <td>{{ persona.nombres }}</td>
                    <td>{{ persona.apellidos }}</td>
                    <td>{{ persona.fecha_nacimiento }}</td>
                    <td>{{ persona.genero }}</td>
                    <td>{{ persona.ciudad }}</td>
                    <td class="text-center">
                      <button
                          @click="handleEdit(persona)"
                          class="btn btn-sm btn-warning me-2"
                      >
                        Editar
                      </button>
                      <button
                          @click="handleDelete(persona.id)"
                          class="btn btn-sm btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
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
      formData.value = {...persona};
      editingId.value = persona.id;
      window.scrollTo({top: 0, behavior: 'smooth'});
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
/* Estilos mínimos adicionales si son necesarios */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.table td,
.table th {
  vertical-align: middle;
}
</style>