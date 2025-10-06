// ========== ADMIN PANEL SCRIPT ========== //
// This script handles login, menu management, and order tracking for Tasty Bites Admin.

// ====== DOM ELEMENTS ======
const loginPage = document.getElementById("login-page");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const dishNameInput = document.getElementById("dish-name");
const dishPriceInput = document.getElementById("dish-price");
const dishImageInput = document.getElementById("dish-image");
const addDishBtn = document.getElementById("add-dish");

const menuList = document.getElementById("menu-list");
const ordersList = document.getElementById("orders-list");
const clearOrdersBtn = document.getElementById("clear-orders");

// ====== LOCAL STORAGE KEYS ======
const MENU_KEY = "tastyBitesMenu";
const ORDERS_KEY = "tastyBitesOrders";
const ADMIN_LOGGED_IN = "tastyBitesAdminLogin";

// ====== TOAST ALERT FUNCTION ======
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `toast ${type}`;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    background: type === "error" ? "#e63946" : "#28a745",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "25px",
    fontWeight: "500",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    zIndex: 9999,
    opacity: "0",
    transition: "opacity 0.5s ease",
  });
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 50);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// ====== LOAD DATA FROM STORAGE ======
function getMenu() {
  return JSON.parse(localStorage.getItem(MENU_KEY)) || [];
}
function saveMenu(menu) {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
}
function getOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}
function clearOrders() {
  localStorage.removeItem(ORDERS_KEY);
}

// ====== RENDER MENU ======
function renderMenu() {
  const menu = getMenu();
  menuList.innerHTML = "";
  if (menu.length === 0) {
    menuList.innerHTML = "<p style='color:#777;'>No dishes added yet.</p>";
    return;
  }
  menu.forEach((dish, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${dish.name}</strong> - $${dish.price.toFixed(2)}<br>
          <small>${dish.image ? "🖼️ Custom Image" : "📸 Default Image"}</small>
        </div>
        <div>
          <button class="btn-ghost" onclick="editDish(${index})">Edit</button>
          <button class="btn-danger" onclick="deleteDish(${index})">Delete</button>
        </div>
      </div>
    `;
    menuList.appendChild(li);
  });
}

// ====== RENDER ORDERS ======
function renderOrders() {
  const orders = getOrders();
  ordersList.innerHTML = "";
  if (orders.length === 0) {
    ordersList.innerHTML = "<p style='color:#777;'>No orders placed yet.</p>";
    return;
  }
  orders.forEach((order, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="background:#f9f9f9;border-radius:8px;padding:10px;">
        <strong>Order #${index + 1}</strong><br>
        ${order.map(item => `${item.name} x${item.quantity} ($${item.price})`).join("<br>")}
      </div>
    `;
    ordersList.appendChild(li);
  });
}

// ====== ADD DISH ======
addDishBtn.addEventListener("click", () => {
  const name = dishNameInput.value.trim();
  const price = parseFloat(dishPriceInput.value);
  const image = dishImageInput.value.trim();

  if (!name || isNaN(price)) {
    showToast("Please enter a valid dish name and price.", "error");
    return;
  }

  const menu = getMenu();
  menu.push({ name, price, image });
  saveMenu(menu);
  renderMenu();

  dishNameInput.value = "";
  dishPriceInput.value = "";
  dishImageInput.value = "";
  showToast("Dish added successfully!");
});

// ====== EDIT DISH ======
window.editDish = function (index) {
  const menu = getMenu();
  const dish = menu[index];

  const newName = prompt("Edit Dish Name:", dish.name);
  const newPrice = prompt("Edit Price:", dish.price);
  const newImage = prompt("Edit Image URL:", dish.image);

  if (newName && newPrice) {
    menu[index] = { name: newName, price: parseFloat(newPrice), image: newImage };
    saveMenu(menu);
    renderMenu();
    showToast("Dish updated!");
  }
};

// ====== DELETE DISH ======
window.deleteDish = function (index) {
  if (confirm("Are you sure you want to delete this dish?")) {
    const menu = getMenu();
    menu.splice(index, 1);
    saveMenu(menu);
    renderMenu();
    showToast("Dish deleted!", "error");
  }
};

// ====== CLEAR ORDERS ======
clearOrdersBtn.addEventListener("click", () => {
  if (confirm("Clear all orders?")) {
    clearOrders();
    renderOrders();
    showToast("All orders cleared!", "error");
  }
});

// ====== LOGIN / LOGOUT ======
loginBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === "admin" && pass === "admin123") {
    localStorage.setItem(ADMIN_LOGGED_IN, "true");
    showToast("Login successful!");
    showAdminPanel();
  } else {
    showToast("Invalid credentials!", "error");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(ADMIN_LOGGED_IN);
  adminPanel.style.display = "none";
  loginPage.style.display = "block";
  showToast("Logged out successfully!", "error");
});

// ====== PANEL DISPLAY CONTROL ======
function showAdminPanel() {
  loginPage.style.display = "none";
  adminPanel.style.display = "block";
  renderMenu();
  renderOrders();
}

// ====== INIT ON LOAD ======
window.onload = function () {
  const isLoggedIn = localStorage.getItem(ADMIN_LOGGED_IN);
  if (isLoggedIn) showAdminPanel();
};
