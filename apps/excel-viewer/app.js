let data = [];
let products = [];
let clients = [];
let viewMode = "products";
let selectedItem = "";

const fileInput = document.getElementById("fileInput");
const uploadView = document.getElementById("uploadView");
const dashboard = document.getElementById("dashboard");
const list = document.getElementById("list");
const results = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const resetBtn = document.getElementById("resetBtn");

document.getElementById("productsTab").onclick = () => switchMode("products");
document.getElementById("clientsTab").onclick = () => switchMode("clients");

fileInput.addEventListener("change", handleFile);

function handleFile(e) {
  const reader = new FileReader();
  reader.onload = evt => {
    const workbook = XLSX.read(evt.target.result, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    processData(raw);
  };
  reader.readAsBinaryString(e.target.files[0]);
}

function processData(raw) {
  const headerIndex = raw.findIndex(r => r[0]?.toUpperCase() === "PRODUCTOS");
  const headers = raw[headerIndex];
  
  clients = [];
  let i = 1;
  while (headers[i] && headers[i].toUpperCase() !== "TOTAL") {
    clients.push(headers[i]);
    i++;
  }

  data = [];

  for (let r = headerIndex + 1; r < raw.length; r++) {
    if (!raw[r][0]) continue;
    const orders = {};
    let total = 0;

    clients.forEach((c, idx) => {
      const qty = raw[r][idx + 1];
      if (qty > 0) {
        orders[c] = qty;
        total += qty;
      }
    });

    data.push({ name: raw[r][0], orders, total });
  }

  products = data.map(p => p.name);

  uploadView.classList.add("hidden");
  dashboard.classList.remove("hidden");
  resetBtn.classList.remove("hidden");

  renderList();
}

function switchMode(mode) {
  viewMode = mode;
  selectedItem = "";
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  document.getElementById(mode + "Tab").classList.add("active");
  renderList();
  results.innerHTML = `<p class="muted center">Selecciona un elemento</p>`;
}

function renderList() {
  const items = viewMode === "products" ? products : clients;
  const filter = searchInput.value.toLowerCase();

  list.innerHTML = "";
  items
    .filter(i => i.toLowerCase().includes(filter))
    .forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = item;
      btn.onclick = () => selectItem(item);
      list.appendChild(btn);
    });
}

searchInput.oninput = renderList;

function selectItem(item) {
  selectedItem = item;
  renderResults();
}

function renderResults() {
  if (viewMode === "products") {
    const product = data.find(p => p.name === selectedItem);
    let rows = Object.entries(product.orders)
      .map(([c, q]) => `<tr><td>${c}</td><td>${q}</td></tr>`)
      .join("");

    results.innerHTML = `
      <h3>${product.name} (Total: ${product.total})</h3>
      <table>
        <tr><th>Cliente</th><th>Cantidad</th></tr>
        ${rows || "<tr><td colspan='2'>Sin pedidos</td></tr>"}
      </table>
    `;
  } else {
    const rows = data
      .filter(p => p.orders[selectedItem])
      .map(p => `<tr><td>${p.name}</td><td>${p.orders[selectedItem]}</td></tr>`)
      .join("");

    results.innerHTML = `
      <h3>Cliente: ${selectedItem}</h3>
      <table>
        <tr><th>Producto</th><th>Cantidad</th></tr>
        ${rows || "<tr><td colspan='2'>Sin pedidos</td></tr>"}
      </table>
    `;
  }
}

resetBtn.onclick = () => location.reload();
