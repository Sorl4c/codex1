async function loadVehicles() {
  const res = await fetch('/api/vehicles');
  const vehicles = await res.json();
  const container = document.getElementById('vehicleContainer');
  container.innerHTML = '';
  vehicles.forEach(v => container.appendChild(createCard(v)));
}

function createCard(v) {
  const col = document.createElement('div');
  col.className = 'card vehicle-card position-relative mb-4';
  col.innerHTML = `
    <div class="row g-0">
      <div class="col-lg-5">
        <div class="vehicle-image">
          <img src="${v.mainImage}" loading="lazy" alt="${v.title}" id="main-${v.id}" />
          <div class="image-overlay">${v.price}</div>
        </div>
        <div class="thumbnails">
          ${v.thumbnails.map((t,i)=>`<img class="thumb" src="${t}" alt="t${i}">`).join('')}
        </div>
      </div>
      <div class="col-lg-7">
        <div class="vehicle-info">
          <div class="vehicle-header">
            <img class="brand-logo" src="${v.brandLogo}" alt="logo">
            <div class="header-content">
              <h3 class="vehicle-title">${v.title}</h3>
              <div class="vehicle-subtitle">${v.subtitle}</div>
            </div>
          </div>
          <div class="specs-grid">
            <div class="spec-item">
              <div class="spec-content"><div class="spec-label">Año</div><div class="spec-value">${v.year}</div></div>
            </div>
            <div class="spec-item">
              <div class="spec-content"><div class="spec-label">Kilometraje</div><div class="spec-value">${v.mileage}</div></div>
            </div>
            <div class="spec-item">
              <div class="spec-content"><div class="spec-label">Transmisión</div><div class="spec-value">${v.transmission}</div></div>
            </div>
            <div class="spec-item">
              <div class="spec-content"><div class="spec-label">Combustible</div><div class="spec-value">${v.fuel}</div></div>
            </div>
          </div>
          <div class="vehicle-description">${v.description}</div>
        </div>
      </div>
    </div>
  `;
  const imgs = col.querySelectorAll('.thumb');
  const mainImg = col.querySelector(`#main-${v.id}`);
  imgs.forEach(img => {
    img.addEventListener('click', () => {
      mainImg.src = img.src;
      imgs.forEach(i => i.classList.remove('selected'));
      img.classList.add('selected');
    });
  });
  imgs[0] && imgs[0].classList.add('selected');
  return col;
}

document.addEventListener('DOMContentLoaded', loadVehicles);
