let editingId = null;

async function loadTable() {
  const res = await fetch('api.php');
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
  const res = await fetch('api.php');
  const vehicles = await res.json();
  const v = vehicles.find(x => x.id === id);
  if (!v) return;
  document.getElementById('vehicleId').value = v.id;
  document.getElementById('title').value = v.title;
  document.getElementById('subtitle').value = v.subtitle;
  document.getElementById('price').value = v.price;
  document.getElementById('mainImage').value = '';
  document.getElementById('thumb1').value = '';
  document.getElementById('thumb2').value = '';
  document.getElementById('thumb3').value = '';
  document.getElementById('brandLogo').value = '';
  document.getElementById('year').value = v.year;
  document.getElementById('mileage').value = v.mileage;
  document.getElementById('transmission').value = v.transmission;
  document.getElementById('fuel').value = v.fuel;
  document.getElementById('description').value = v.description;
  editingId = id;
}

async function deleteVehicle(id) {
  const form = new FormData();
  form.append('id', id);
  form.append('_method', 'DELETE');
  await fetch('api.php', { method: 'POST', body: form });
  loadTable();
}

document.getElementById('cancelBtn').addEventListener('click', () => {
  editingId = null;
  document.getElementById('vehicleForm').reset();
});

document.getElementById('vehicleForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = new FormData(e.target);
  if (editingId) {
    form.append('_method', 'PUT');
  }
  await fetch('api.php', {
    method: 'POST',
    body: form
  });
  editingId = null;
  document.getElementById('vehicleForm').reset();
  loadTable();
});

document.addEventListener('DOMContentLoaded', loadTable);
