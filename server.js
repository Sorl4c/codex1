const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'vehicles.json');

app.use(express.json());
app.use(express.static(__dirname));

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const json = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(json);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/vehicles', (req, res) => {
  res.json(readData());
});

app.post('/api/vehicles', (req, res) => {
  const vehicles = readData();
  const newVehicle = req.body;
  newVehicle.id = Date.now();
  vehicles.push(newVehicle);
  writeData(vehicles);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', (req, res) => {
  const vehicles = readData();
  const id = parseInt(req.params.id, 10);
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).end();
  vehicles[index] = { ...vehicles[index], ...req.body, id };
  writeData(vehicles);
  res.json(vehicles[index]);
});

app.delete('/api/vehicles/:id', (req, res) => {
  const vehicles = readData();
  const id = parseInt(req.params.id, 10);
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).end();
  vehicles.splice(index, 1);
  writeData(vehicles);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
