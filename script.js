// Load menu from localStorage or default items
const menuList = document.getElementById('menu-list');
let menu = JSON.parse(localStorage.getItem('menu')) || [
  { name: "Margherita Pizza", price: 8, img: "https://via.placeholder.com/300" },
  { name: "Pasta Alfredo", price: 10, img: "https://via.placeholder.com/300" },
  { name: "Veg Burger", price: 6, img: "https://via.placeholder.com/300" },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render menu
function renderMenu(filter = "") {
  menuList.innerHTML = "";
  menu
    .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((dish, i) => {
      const div = document.createElement('div');
      div.className = "menu-item";
      div.innerHTML = `
        <img src="${dish.img}" alt="${dish.name}" />
        <div class="info">
          <h4>${dish.name}</h4>
          <p>$${dish.price}</p>
          <button onclick="addToCart(${i})" class="btn-primary">Add to Cart</button>
          <button onclick="alert('Dish: ${dish.name}\\nPrice: $${dish.price}')"
            class="btn-ghost">View</button>
        </div>`;
      menuList.appendChild(div);
    });
}
renderMenu();

// Add to cart
function addToCart(index) {
  const dish = menu[index];
  const existing = cart.find(i => i.name === dish.name);
  if (existing) existing.qty++;
  else cart.push({ ...dish, qty: 1 });
  saveCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Render cart
function renderCart() {
  const ul = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  const count = document.getElementById('cart-count');
  ul.innerHTML = "";
  let sum = 0;
  cart.forEach((item, i) => {
    sum += item.price * item.qty;
    ul.innerHTML += `
      <li>${item.name} - $${item.price} x ${item.qty}
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">-</button>
        <button onclick="removeItem(${i})">x</button>
      </li>`;
  });
  total.textContent = sum.toFixed(2);
  count.textContent = cart.reduce((a,b) => a+b.qty,0);
}
function changeQty(i, delta) {
  cart[i].qty += delta;
  if (cart[i].qty <= 0) cart.splice(i,1);
  saveCart();
}
function removeItem(i){ cart.splice(i,1); saveCart(); }
renderCart();

// Place order
document.getElementById('place-order').onclick = () => {
  if (!cart.length) return alert("Cart is empty!");
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push({ date: new Date().toLocaleString(), items: cart });
  localStorage.setItem('orders', JSON.stringify(orders));
  cart = [];
  saveCart();
  alert("Order placed successfully!");
};

// Search
document.getElementById('search').oninput = e => renderMenu(e.target.value);
