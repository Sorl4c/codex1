let editingId = null;

async function loadTable() {
  const res = await fetch('/api/vehicles');
  const vehicles = await res.json();
  const tbody = document.querySelector('#vehicleTable tbody');
  tbody.innerHTML = '';
  vehicles.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.title}</td>
      <td>${v.price}</td>
      <td>
        <button class="btn btn-sm btn-secondary me-2" onclick="editVehicle(${v.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${v.id})">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function editVehicle(id) {
  const res = await fetch('/api/vehicles');
  const vehicles = await res.json();
  const v = vehicles.find(x => x.id === id);
  if (!v) return;
  document.getElementById('vehicleId').value = v.id;
  document.getElementById('title').value = v.title;
  document.getElementById('subtitle').value = v.subtitle;
  document.getElementById('price').value = v.price;
  document.getElementById('mainImage').value = v.mainImage;
  document.getElementById('thumb1').value = v.thumbnails[0] || '';
  document.getElementById('thumb2').value = v.thumbnails[1] || '';
  document.getElementById('thumb3').value = v.thumbnails[2] || '';
  document.getElementById('brandLogo').value = v.brandLogo;
  document.getElementById('year').value = v.year;
  document.getElementById('mileage').value = v.mileage;
  document.getElementById('transmission').value = v.transmission;
  document.getElementById('fuel').value = v.fuel;
  document.getElementById('description').value = v.description;
  editingId = id;
}

async function deleteVehicle(id) {
  await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
  loadTable();
}

document.getElementById('cancelBtn').addEventListener('click', () => {
  editingId = null;
  document.getElementById('vehicleForm').reset();
});

document.getElementById('vehicleForm').addEventListener('submit', async e => {
  e.preventDefault();
  const vehicle = {
    title: document.getElementById('title').value,
    subtitle: document.getElementById('subtitle').value,
    price: document.getElementById('price').value,
    mainImage: document.getElementById('mainImage').value,
    thumbnails: [
      document.getElementById('thumb1').value,
      document.getElementById('thumb2').value,
      document.getElementById('thumb3').value
    ],
    brandLogo: document.getElementById('brandLogo').value,
    year: document.getElementById('year').value,
    mileage: document.getElementById('mileage').value,
    transmission: document.getElementById('transmission').value,
    fuel: document.getElementById('fuel').value,
    description: document.getElementById('description').value
  };

  if (editingId) {
    await fetch(`/api/vehicles/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
  } else {
    await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
  }
  editingId = null;
  document.getElementById('vehicleForm').reset();
  loadTable();
});

document.addEventListener('DOMContentLoaded', loadTable);
