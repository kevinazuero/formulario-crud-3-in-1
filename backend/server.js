const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Crear/conectar base de datos
const db = new sqlite3.Database('./personas.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT NOT NULL UNIQUE,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero TEXT NOT NULL,
    ciudad TEXT NOT NULL
  )
`);

// RUTAS CRUD

// CREATE - Crear nueva persona
app.post('/api/personas', (req, res) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;
  
  // Validaciones
  if (!dni || !nombres || !apellidos || !fecha_nacimiento || !genero || !ciudad) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `INSERT INTO personas (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad], function(err) {
    if (err) {
      return res.status(400).json({ error: 'DNI ya existe o error en la base de datos' });
    }
    res.status(201).json({ id: this.lastID, message: 'Persona creada exitosamente' });
  });
});

// READ - Obtener todas las personas
app.get('/api/personas', (req, res) => {
  db.all('SELECT * FROM personas', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// READ - Obtener una persona por ID
app.get('/api/personas/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM personas WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(row);
  });
});

// UPDATE - Actualizar persona
app.put('/api/personas/:id', (req, res) => {
  const { id } = req.params;
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;

  const query = `UPDATE personas 
                 SET dni = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, genero = ?, ciudad = ?
                 WHERE id = ?`;

  db.run(query, [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, id], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona actualizada exitosamente' });
  });
});

// DELETE - Eliminar persona
app.delete('/api/personas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM personas WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona eliminada exitosamente' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});