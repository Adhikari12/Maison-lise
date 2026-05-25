let allProducts = [];
let selectedCategory = null;
let selectedSubcategory = "All";
window.currentVisibleCollections = [];

const fallbackImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();

    renderCategoryButtons();
    showStartMessage();
  } catch (error) {
    console.error("Products could not be loaded:", error);
    document.getElementById("productGrid").innerHTML =
      "<p>Products are being updated. Please check again soon.</p>";
  }
}

function renderCategoryButtons() {
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const categoryBox = document.getElementById("categoryButtons");

  categoryBox.innerHTML = categories
    .map(
      (category) => `
      <button class="${selectedCategory === category ? "active" : ""}" onclick="selectCategory('${category}')">
        ${category}
      </button>
    `
    )
    .join("");
}

function selectCategory(category) {
  selectedCategory = category;
  selectedSubcategory = "All";
  renderCategoryButtons();
  renderSubcategoryButtons();
  updateProducts();
  scrollToProducts();
}

function renderSubcategoryButtons() {
  const box = document.getElementById("subcategoryButtons");

  const productsInCategory = allProducts.filter(
    (product) => product.category === selectedCategory
  );

  const subcategories = [
    "All",
    ...new Set(productsInCategory.map((product) => product.subcategory)),
  ];

  box.innerHTML = subcategories
    .map(
      (sub) => `
      <button class="${selectedSubcategory === sub ? "active" : ""}" onclick="selectSubcategory('${sub}')">
        ${sub === "All" ? "All Collections" : sub}
      </button>
    `
    )
    .join("");
}

function selectSubcategory(subcategory) {
  selectedSubcategory = subcategory;
  renderSubcategoryButtons();
  updateProducts();
  scrollToProducts();
}

function updateProducts() {
  let filtered = allProducts.filter(
    (product) => product.category === selectedCategory
  );

  if (selectedSubcategory !== "All") {
    filtered = filtered.filter(
      (product) => product.subcategory === selectedSubcategory
    );
  }

  document.getElementById("productHeading").textContent =
    `${selectedCategory} Collections`;

  document.getElementById("activeFilters").innerHTML = `
    <span>Category: ${selectedCategory}</span>
    <span>Collection: ${selectedSubcategory}</span>
    <button onclick="clearCategoryFilters()">Clear Filters</button>
  `;

  displayCollections(filtered);
}

function clearCategoryFilters() {
  selectedSubcategory = "All";
  renderSubcategoryButtons();
  updateProducts();
}

function showStartMessage() {
  document.getElementById("activeFilters").innerHTML = "";
  document.getElementById("subcategoryButtons").innerHTML = "";
  document.getElementById("productGrid").innerHTML = `
    <div class="empty-state">
      <h3>Choose a category above</h3>
      <p>After selecting a category, its collections will appear here.</p>
    </div>
  `;
}

function displayCollections(collections) {
  const productGrid = document.getElementById("productGrid");

  if (!collections.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>No matching collections found</h3>
        <p>Try another collection type.</p>
      </div>
    `;
    return;
  }

  window.currentVisibleCollections = collections;

  productGrid.innerHTML = collections
    .map(
      (collection, index) => `
      <article class="product-card">
        <img 
          src="${collection.image || fallbackImage}" 
          alt="${collection.name}" 
          class="product-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        />

        <div class="product-copy">
          <p class="category">Maison Élise • ${collection.subcategory}</p>
          <h3>${collection.name}</h3>
          <p>${collection.description}</p>

          <button class="link-btn" onclick="openCollection(${index})">
            View Collection
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

function openCollection(index) {
  const collection = window.currentVisibleCollections[index];
  const productGrid = document.getElementById("productGrid");

  document.getElementById("productHeading").textContent = collection.name;

  productGrid.innerHTML = `
    <div class="collection-detail">
      <button class="back-btn" onclick="updateProducts()">← Back to ${selectedCategory}</button>
      <p class="eyebrow">${collection.category} • ${collection.subcategory}</p>
      <h2>${collection.name}</h2>
      <p>${collection.description}</p>
    </div>

    ${collection.products
      .map(
        (item) => `
        <article class="product-card">
          <img 
            src="${item.image || fallbackImage}" 
            alt="${item.name}" 
            class="product-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          />

          <div class="product-copy">
            <p class="category">Curated Pick</p>
            <h3>${item.name}</h3>

            <a 
              href="${item.link}" 
              target="_blank" 
              rel="sponsored noopener noreferrer" 
              class="link-btn">
              Shop This Piece
            </a>
          </div>
        </article>
      `
      )
      .join("")}
  `;

  scrollToProducts();
}

function scrollToProducts() {
  document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
}

loadProducts();
