let allProducts = [];

const fallbackImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error("Products could not be loaded:", error);
  }
}

function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");

  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <img 
          src="${product.image || fallbackImage}" 
          alt="${product.name}" 
          class="product-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        />

        <div class="product-copy">
          <p class="category">${product.category} • ${product.subcategory}</p>
          <h3>${product.name}</h3>
          <p>${product.description}</p>

          <a 
            href="${product.link}" 
            target="_blank" 
            rel="sponsored noopener noreferrer" 
            class="link-btn">
            View on Amazon
          </a>
        </div>
      </article>
    `
    )
    .join("");
}

function filterProducts(category) {
  const subcategoryBox = document.getElementById("subcategoryButtons");

  if (category === "All") {
    subcategoryBox.innerHTML = "";
    displayProducts(allProducts);
    return;
  }

  const categoryProducts = allProducts.filter(
    (product) => product.category === category
  );

  const subcategories = [
    ...new Set(categoryProducts.map((product) => product.subcategory)),
  ];

  subcategoryBox.innerHTML = `
    <button onclick="displayProducts(allProducts.filter(product => product.category === '${category}'))">
      All ${category}
    </button>
    ${subcategories
      .map(
        (sub) => `
        <button onclick="filterSubcategory('${category}', '${sub}')">
          ${sub}
        </button>
      `
      )
      .join("")}
  `;

  displayProducts(categoryProducts);
}

function filterSubcategory(category, subcategory) {
  const filtered = allProducts.filter(
    (product) =>
      product.category === category && product.subcategory === subcategory
  );

  displayProducts(filtered);
}

loadProducts();
