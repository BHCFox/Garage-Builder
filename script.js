// =====================
// DATA
// =====================

// cars is our main array. Each car object also holds a `mods` array
// so the shape looks like: { make, model, year, category, mods: [] }
const cars = [];

// Track which car index is open in the modal (-1 = none open)
let activeCarIndex = -1;

// =====================
// DOM REFERENCES
// =====================
const form = document.getElementById("carForm");
const errorEl = document.getElementById("error-msg");
const successEl = document.getElementById("success-msg");
const garageEl = document.getElementById("my-garage");
const emptyStateEl = document.getElementById("emptyState");

// Dashboard counters
const totalVehiclesEl = document.getElementById("total-vehicles-num");
const totalModsEl = document.getElementById("total-mods-num");
const trackCarsEl = document.getElementById("track-cars-num");
const serviceDueEl = document.getElementById("service-due-num");

// Filter / sort controls
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const sortBy = document.getElementById("sortBy");

// Modal elements
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalBadge = document.getElementById("modalBadge");
const modInput = document.getElementById("modInput");
const modTypeSelect = document.getElementById("modType");
const addModBtn = document.getElementById("addModBtn");
const modList = document.getElementById("modList");
const modEmpty = document.getElementById("modEmpty");

// =====================
// MESSAGES
// =====================
function showError(message) {
  errorEl.textContent = message;
  successEl.textContent = "";
}

function showSuccess(message) {
  successEl.textContent = message;
  errorEl.textContent = "";
}

function clearMessages() {
  errorEl.textContent = "";
  successEl.textContent = "";
}

// Clear messages as soon as user starts editing any field
form.querySelectorAll("input, select").forEach(function (el) {
  el.addEventListener("input", clearMessages);
  el.addEventListener("change", clearMessages);
});

// =====================
// FORM SUBMIT
// =====================
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const make = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year = document.getElementById("year").value;
  const category = document.getElementById("category").value;

  // --- Validation ---
  if (make === "") {
    showError("Please enter a make.");
    return;
  }
  if (model === "") {
    showError("Please enter a model.");
    return;
  }
  if (year === "") {
    showError("Please enter a year.");
    return;
  }

  const currentYear = new Date().getFullYear();
  if (year < 1960 || year > currentYear + 1) {
    showError("Please enter a valid year (1960–" + (currentYear + 1) + ").");
    return;
  }
  if (category === "") {
    showError("Please choose a category.");
    return;
  }

  // --- Duplicate check ---
  const isDuplicate = cars.some(function (c) {
    return (
      c.make.toLowerCase() === make.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase() &&
      c.year == year
    );
  });

  if (isDuplicate) {
    showError("This car is already in your garage!");
    return;
  }

  // --- Add to array ---
  // Each new car gets an empty mods array built in
  const car = { make, model, year, category, mods: [] };
  cars.push(car);

  showSuccess(year + " " + make + " " + model + " added to your garage!");
  form.reset();

  updateDashboard();
  renderGarage();
});

// =====================
// DASHBOARD UPDATER
// =====================
function updateDashboard() {
  totalVehiclesEl.textContent = cars.length;

  // Count total mods across all cars
  const totalMods = cars.reduce(function (sum, car) {
    return (
      sum +
      car.mods.filter(function (m) {
        return m.type === "mod";
      }).length
    );
  }, 0);
  totalModsEl.textContent = totalMods;

  // Count track cars
  const trackCount = cars.filter(function (c) {
    return c.category === "track";
  }).length;
  trackCarsEl.textContent = trackCount;

  // Count service entries across all cars
  const serviceCount = cars.reduce(function (sum, car) {
    return (
      sum +
      car.mods.filter(function (m) {
        return m.type === "service";
      }).length
    );
  }, 0);
  serviceDueEl.textContent = serviceCount;
}

// =====================
// RENDER GARAGE
// =====================
function renderGarage() {
  // Get current filter/sort values
  const search = searchInput.value.trim().toLowerCase();
  const category = filterCategory.value;
  const sort = sortBy.value;

  // Filter
  let filtered = cars.filter(function (car) {
    const matchesSearch =
      car.make.toLowerCase().includes(search) ||
      car.model.toLowerCase().includes(search) ||
      car.year.toString().includes(search);

    const matchesCategory = category === "all" || car.category === category;

    return matchesSearch && matchesCategory;
  });

  // Sort
  if (sort === "newest") {
    filtered.sort(function (a, b) {
      return b.year - a.year;
    });
  } else if (sort === "oldest") {
    filtered.sort(function (a, b) {
      return a.year - b.year;
    });
  } else if (sort === "make") {
    filtered.sort(function (a, b) {
      return a.make.localeCompare(b.make);
    });
  }

  // Show/hide empty state
  if (cars.length === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  // Clear and re-render cards
  garageEl.innerHTML = "";

  filtered.forEach(function (car, filteredIndex) {
    // Find the real index in the original `cars` array (needed for delete/modal)
    const realIndex = cars.indexOf(car);

    const modCount = car.mods.filter(function (m) {
      return m.type === "mod";
    }).length;
    const serviceCount = car.mods.filter(function (m) {
      return m.type === "service";
    }).length;

    const badgeClass = "badge-" + car.category;
    const badgeLabel =
      {
        daily: "Daily Driver",
        weekend: "Weekender",
        track: "Track Car",
      }[car.category] || car.category;

    // Build the card HTML
    const card = document.createElement("div");
    card.className = "garage-card";
    card.innerHTML = `
      <div class="card-top">
        <span class="car-year">${car.year}</span>
        <span class="car-name">${car.make} ${car.model}</span>
        <span class="category-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="card-stats">
        <div class="card-stat"><span>${modCount}</span> Mods</div>
        <div class="card-stat"><span>${serviceCount}</span> Services</div>
      </div>
      <div class="card-actions">
        <button class="btn-mods" data-index="${realIndex}">View / Add Mods</button>
        <button class="btn-delete" data-index="${realIndex}" title="Remove vehicle">✕</button>
      </div>
    `;

    garageEl.appendChild(card);
  });

  // Wire up buttons — we do this AFTER rendering so the elements exist
  document.querySelectorAll(".btn-delete").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"));
      deleteCar(index);
    });
  });

  document.querySelectorAll(".btn-mods").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"));
      openModal(index);
    });
  });
}

// =====================
// DELETE CAR
// =====================
function deleteCar(index) {
  const car = cars[index];
  if (!car) return;

  // Remove from array using splice (removes 1 item at index)
  cars.splice(index, 1);

  updateDashboard();
  renderGarage();
}

// =====================
// FILTER / SORT — re-render on change
// =====================
searchInput.addEventListener("input", renderGarage);
filterCategory.addEventListener("change", renderGarage);
sortBy.addEventListener("change", renderGarage);

// =====================
// MODAL — OPEN
// =====================
function openModal(carIndex) {
  activeCarIndex = carIndex;
  const car = cars[carIndex];

  const badgeClass = "badge-" + car.category;
  const badgeLabel =
    {
      daily: "Daily Driver",
      weekend: "Weekender",
      track: "Track Car",
    }[car.category] || car.category;

  modalTitle.textContent = car.year + " " + car.make + " " + car.model;
  modalBadge.innerHTML = `<span class="category-badge ${badgeClass}">${badgeLabel}</span>`;

  renderModList();

  modalOverlay.classList.add("open");
  modInput.focus();
}

// =====================
// MODAL — CLOSE
// =====================
function closeModal() {
  modalOverlay.classList.remove("open");
  activeCarIndex = -1;
  modInput.value = "";
}

modalClose.addEventListener("click", closeModal);

// Close when clicking outside the modal box
modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

// Close on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// =====================
// ADD MOD
// =====================
addModBtn.addEventListener("click", function () {
  if (activeCarIndex === -1) return;

  const text = modInput.value.trim();
  if (text === "") return;

  const type = modTypeSelect.value; // "mod" or "service"

  cars[activeCarIndex].mods.push({ text, type });

  modInput.value = "";

  renderModList();
  updateDashboard();

  // Re-render the garage cards so mod/service counts update
  renderGarage();
});

// Allow pressing Enter in the mod input to submit
modInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addModBtn.click();
  }
});

// =====================
// RENDER MOD LIST (inside modal)
// =====================
function renderModList() {
  if (activeCarIndex === -1) return;

  const mods = cars[activeCarIndex].mods;

  modList.innerHTML = "";

  if (mods.length === 0) {
    modEmpty.classList.remove("hidden");
    return;
  }

  modEmpty.classList.add("hidden");

  mods.forEach(function (mod, modIndex) {
    const li = document.createElement("li");
    li.className = "mod-item";
    li.innerHTML = `
      <div class="mod-item-left">
        <div class="mod-dot ${mod.type === "service" ? "dot-service" : "dot-mod"}"></div>
        <div>
          <div class="mod-text">${mod.text}</div>
          <div class="mod-type-label">${mod.type === "service" ? "Service / Oil Change" : "Mod"}</div>
        </div>
      </div>
      <button class="btn-remove-mod" data-mod-index="${modIndex}" title="Remove">✕</button>
    `;
    modList.appendChild(li);
  });

  // Wire up remove buttons
  modList.querySelectorAll(".btn-remove-mod").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const modIndex = parseInt(btn.getAttribute("data-mod-index"));
      cars[activeCarIndex].mods.splice(modIndex, 1);
      renderModList();
      updateDashboard();
      renderGarage();
    });
  });
}
