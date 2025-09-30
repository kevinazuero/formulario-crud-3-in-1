import { useState, useEffect } from 'react';
import axios from 'axios';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta persona?')) {
        await axios.delete(`${API_URL}/${id}`);
        alert('Persona eliminada');
        fetchPersonas();
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
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <h1 className="text-center mb-4 text-primary fw-bold">
              Gestión de Personas
            </h1>

            {/* Formulario */}
            <div className="card shadow-sm mb-4">
              <div  className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  {editingId ? 'Editar Persona' : 'Registrar Nueva Persona'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* DNI */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">DNI</label>
                      <input
                        type="text"
                        className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        placeholder="Ingrese DNI"
                      />
                      {errors.dni && <div className="invalid-feedback">{errors.dni}</div>}
                    </div>

                    {/* Nombres */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Nombres</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                        value={formData.nombres}
                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                        placeholder="Ingrese nombres"
                      />
                      {errors.nombres && <div className="invalid-feedback">{errors.nombres}</div>}
                    </div>

                    {/* Apellidos */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Apellidos</label>
                      <input
                        type="text"
                        className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                        value={formData.apellidos}
                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                        placeholder="Ingrese apellidos"
                      />
                      {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className={`form-control ${errors.fecha_nacimiento ? 'is-invalid' : ''}`}
                        value={formData.fecha_nacimiento}
                        onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                      />
                      {errors.fecha_nacimiento && <div className="invalid-feedback">{errors.fecha_nacimiento}</div>}
                    </div>

                    {/* Género */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold d-block">Género</label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="genero"
                          id="masculino"
                          value="Masculino"
                          checked={formData.genero === 'Masculino'}
                          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                        />
                        <label className="form-check-label" htmlFor="masculino">
                          Masculino
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="genero"
                          id="femenino"
                          value="Femenino"
                          checked={formData.genero === 'Femenino'}
                          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                        />
                        <label className="form-check-label" htmlFor="femenino">
                          Femenino
                        </label>
                      </div>
                      {errors.genero && <div className="text-danger small">{errors.genero}</div>}
                    </div>

                    {/* Ciudad */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Ciudad</label>
                      <select
                        className={`form-select ${errors.ciudad ? 'is-invalid' : ''}`}
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
                      {errors.ciudad && <div className="invalid-feedback">{errors.ciudad}</div>}
                    </div>

                    {/* Botones */}
                    <div className="col-12">
                      <div className="d-flex gap-2 justify-content-end">
                        {editingId && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="btn btn-secondary"
                          >
                            Cancelar
                          </button>
                        )}
                        <button type="submit" className="btn btn-primary">
                          {editingId ? 'Actualizar' : 'Registrar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Tabla de Personas */}
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Lista de Personas Registradas</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>DNI</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>F. Nacimiento</th>
                        <th>Género</th>
                        <th>Ciudad</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center text-muted py-4">
                            No hay personas registradas
                          </td>
                        </tr>
                      ) : (
                        personas.map((persona) => (
                          <tr key={persona.id}>
                            <td>{persona.dni}</td>
                            <td>{persona.nombres}</td>
                            <td>{persona.apellidos}</td>
                            <td>{persona.fecha_nacimiento}</td>
                            <td>{persona.genero}</td>
                            <td>{persona.ciudad}</td>
                            <td className="text-center">
                              <button
                                onClick={() => handleEdit(persona)}
                                className="btn btn-sm btn-warning me-2"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(persona.id)}
                                className="btn btn-sm btn-danger"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;