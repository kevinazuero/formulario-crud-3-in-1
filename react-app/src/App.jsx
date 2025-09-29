import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api/personas';

function App() {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    genero: '',
    ciudad: ''
  });

  const [personas, setPersonas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Cargar personas al iniciar
  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get(API_URL);
      setPersonas(response.data);
    } catch (error) {
      console.error('Error al cargar personas:', error);
    }
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.dni || formData.dni.length < 8) {
      newErrors.dni = 'DNI debe tener al menos 8 caracteres';
    }

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Nombres son obligatorios';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Apellidos son obligatorios';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'Fecha de nacimiento es obligatoria';
    }

    if (!formData.genero) {
      newErrors.genero = 'Seleccione un género';
    }

    if (!formData.ciudad) {
      newErrors.ciudad = 'Seleccione una ciudad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert('Persona actualizada exitosamente');
      } else {
        await axios.post(API_URL, formData);
        alert('Persona creada exitosamente');
      }

      resetForm();
      fetchPersonas();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  const handleEdit = (persona) => {
    setFormData(persona);
    setEditingId(persona.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta persona?')) {
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
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      genero: '',
      ciudad: ''
    });
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="container">
      <h1>Formulario CRUD - React + Vite</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>DNI:</label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
          />
          {errors.dni && <span className="error">{errors.dni}</span>}
        </div>

        <div className="form-group">
          <label>Nombres:</label>
          <input
            type="text"
            value={formData.nombres}
            onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
          />
          {errors.nombres && <span className="error">{errors.nombres}</span>}
        </div>

        <div className="form-group">
          <label>Apellidos:</label>
          <input
            type="text"
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
          />
          {errors.apellidos && <span className="error">{errors.apellidos}</span>}
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={formData.fecha_nacimiento}
            onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
          />
          {errors.fecha_nacimiento && <span className="error">{errors.fecha_nacimiento}</span>}
        </div>

        <div className="form-group">
          <label>Género:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="genero"
                value="Masculino"
                checked={formData.genero === 'Masculino'}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              />
              Masculino
            </label>
            <label>
              <input
                type="radio"
                name="genero"
                value="Femenino"
                checked={formData.genero === 'Femenino'}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              />
              Femenino
            </label>
          </div>
          {errors.genero && <span className="error">{errors.genero}</span>}
        </div>

        <div className="form-group">
          <label>Ciudad:</label>
          <select
            value={formData.ciudad}
            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          >
            <option value="">Seleccione una ciudad</option>
            <option value="Quito">Quito</option>
            <option value="Guayaquil">Guayaquil</option>
            <option value="Cuenca">Cuenca</option>
            <option value="Ambato">Ambato</option>
            <option value="Manta">Manta</option>
          </select>
          {errors.ciudad && <span className="error">{errors.ciudad}</span>}
        </div>

        <div className="button-group">
          <button type="submit" className="btn-submit">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-cancel">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2>Lista de Personas</h2>
      <table className="table">
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
          {personas.map((persona) => (
            <tr key={persona.id}>
              <td>{persona.dni}</td>
              <td>{persona.nombres}</td>
              <td>{persona.apellidos}</td>
              <td>{persona.fecha_nacimiento}</td>
              <td>{persona.genero}</td>
              <td>{persona.ciudad}</td>
              <td>
                <button onClick={() => handleEdit(persona)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(persona.id)} className="btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;