const loginPage = document.getElementById('login-page');
const adminPanel = document.getElementById('admin-panel');

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addDishBtn = document.getElementById('add-dish');
const menuAdminList = document.getElementById('menu-admin-list');
const orderList = document.getElementById('order-list');
const clearOrdersBtn = document.getElementById('clear-orders');

if (localStorage.getItem('adminLoggedIn')) showAdmin();

loginBtn.onclick = () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === "admin" && pass === "admin123") {
    localStorage.setItem('adminLoggedIn', true);
    showAdmin();
  } else alert("Invalid credentials!");
};

logoutBtn.onclick = () => {
  localStorage.removeItem('adminLoggedIn');
  loginPage.classList.remove('hidden');
  adminPanel.classList.add('hidden');
};

function showAdmin() {
  loginPage.classList.add('hidden');
  adminPanel.classList.remove('hidden');
  renderMenuAdmin();
  renderOrders();
}

function renderMenuAdmin() {
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  menuAdminList.innerHTML = "";
  menu.forEach((dish, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${dish.name} - $${dish.price}
      <button onclick="deleteDish(${i})">Delete</button>`;
    menuAdminList.appendChild(li);
  });
}

addDishBtn.onclick = () => {
  const name = document.getElementById('dish-name').value.trim();
  const price = parseFloat(document.getElementById('dish-price').value);
  const img = document.getElementById('dish-img').value || "https://via.placeholder.com/300";
  if (!name || !price) return alert("Please enter valid details");
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  menu.push({ name, price, img });
  localStorage.setItem('menu', JSON.stringify(menu));
  renderMenuAdmin();
};

function deleteDish(i) {
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  menu.splice(i, 1);
  localStorage.setItem('menu', JSON.stringify(menu));
  renderMenuAdmin();
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orderList.innerHTML = "";
  orders.forEach((order, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${order.date}</strong><br>${order.items.map(it => it.name + " x" + it.qty).join(", ")}`;
    orderList.appendChild(li);
  });
}

clearOrdersBtn.onclick = () => {
  if (confirm("Clear all orders?")) {
    localStorage.removeItem('orders');
    renderOrders();
  }
};
