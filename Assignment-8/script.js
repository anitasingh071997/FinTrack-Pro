/* ================= AUTH SYSTEM ================= */

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

// Register User
function registerUser() {

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirm) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const alreadyExists = users.find(user => user.email === email);

  if (alreadyExists) {
    alert("Email already registered.");
    return;
  }

  users.push({
    id: Date.now(),
    name,
    email,
    password
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration Successful!");

  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  showLogin();

}

// Login User

function loginUser() {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(user =>
    user.email === email &&
    user.password === password
  );

  if (!user) {
    alert("Invalid Email or Password.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  document.getElementById("authPage").style.display = "none";

  document.querySelector(".sidebar").style.display = "flex";
  document.querySelector(".main").style.display = "flex";

  document.getElementById("userName-display").innerText =
    "Hello, " + user.name + " 👋";

}

// Check Login

function checkLogin() {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {

    document.getElementById("authPage").style.display = "none";

    document.querySelector(".sidebar").style.display = "flex";
    document.querySelector(".main").style.display = "flex";

    document.getElementById("userName-display").innerText =
      "Hello, " + currentUser.name + " 👋";

  } else {

    document.getElementById("authPage").style.display = "flex";

    document.querySelector(".sidebar").style.display = "none";
    document.querySelector(".main").style.display = "none";

  }

}

let currencySymbol = "₹";
let currentFilter = "all";
let myChart;

// window.onload = function () {
//   loadSettings();
//   refreshAll();
// };

window.onload = function () {

  checkLogin();

  loadSettings();

  refreshAll();

};
// ---------- STORAGE ----------
function getTransactions() {
  let data = localStorage.getItem("transactions");
  return data ? JSON.parse(data) : [];
}

function saveTransactions(list) {
  localStorage.setItem("transactions", JSON.stringify(list));
}

// ---------- SIDEBAR (mobile) ----------
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

// ---------- PAGE SWITCH ----------
function showPage(pageName, clickedLink) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById(pageName).style.display = "block";

  // update topbar heading
  if (pageName === "dashboard") {
    document.getElementById("pageHeading").innerText = "Dashboard";
    document.getElementById("pageSubtitle").innerText = "Welcome back! Here's your finance overview.";
  } else {
    document.getElementById("pageHeading").innerText = "Settings";
    document.getElementById("pageSubtitle").innerText = "Manage your profile and preferences.";
  }

  // active nav link
  document.querySelectorAll(".nav-item").forEach(function (el) {
    el.classList.remove("active");
  });
  if (clickedLink) clickedLink.classList.add("active");

  closeSidebar();
}

// ---------- MODAL ----------
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ---------- TYPE TOGGLE ----------
function setType(type) {
  document.getElementById("type").value = type;

  let incomeBtn  = document.getElementById("btn-income");
  let expenseBtn = document.getElementById("btn-expense");

  incomeBtn.className  = "type-btn";
  expenseBtn.className = "type-btn";

  if (type === "income") {
    incomeBtn.classList.add("active-income");
  } else {
    expenseBtn.classList.add("active-expense");
  }
}

// ---------- ADD TRANSACTION ----------
function addTransaction() {
  let type     = document.getElementById("type").value;
  let desc     = document.getElementById("desc").value.trim();
  let amount   = document.getElementById("amount").value;
  let date     = document.getElementById("date").value;
  let category = document.getElementById("category").value;

  if (!desc || !amount || !date) {
    alert("Please fill all the fields!");
    return;
  }

  let newTransaction = {
    id: Date.now(),
    type, desc,
    amount: Number(amount),
    date, category
  };

  let all = getTransactions();
  all.push(newTransaction);
  saveTransactions(all);

  // clear form
  document.getElementById("desc").value   = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value   = "";
  setType("income");

  closeModal();
  refreshAll();
}

// ---------- DELETE ----------
function deleteTransaction(id) {
  let updated = getTransactions().filter(t => t.id !== id);
  saveTransactions(updated);
  refreshAll();
}

// ---------- FILTER ----------
function filterTransactions(type, btn) {
  currentFilter = type;
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderTable();
}

// ---------- TOTALS ----------
function calculateTotals() {
  let all = getTransactions();
  let income = 0, expense = 0;
  all.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  return { income, expense, balance: income - expense, count: all.length };
}

// ---------- UPDATE CARDS ----------
function updateCards() {
  let t = calculateTotals();
  document.getElementById("balance").innerText      = currencySymbol + t.balance.toLocaleString();
  document.getElementById("totalIncome").innerText  = currencySymbol + t.income.toLocaleString();
  document.getElementById("totalExpense").innerText = currencySymbol + t.expense.toLocaleString();
  document.getElementById("totalCount").innerText   = t.count;
}

// ---------- RENDER TABLE ----------
function renderTable() {
  let all  = getTransactions();
  let list = currentFilter === "all" ? all : all.filter(t => t.type === currentFilter);
  let body = document.getElementById("transactionList");
  body.innerHTML = "";

  if (list.length === 0) {
    body.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:28px; color:var(--subtext); font-size:13px;">No transactions found</td></tr>`;
    return;
  }

  list.forEach(function (t) {
    let row = document.createElement("tr");
    let amtClass = t.type === "income" ? "amount-positive" : "amount-negative";
    let sign     = t.type === "income" ? "+" : "-";
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td><span style="background:var(--bg);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;">${t.category}</span></td>
      <td class="${amtClass}">${sign}${currencySymbol}${t.amount.toLocaleString()}</td>
      <td><button onclick="deleteTransaction(${t.id})">Delete</button></td>
    `;
    body.appendChild(row);
  });
}

// ---------- CHART ----------
function renderChart() {
  let all = getTransactions();
  let labels      = all.map(t => t.date);
  let incomeData  = all.map(t => t.type === "income"  ? t.amount : 0);
  let expenseData = all.map(t => t.type === "expense" ? t.amount : 0);

  if (myChart) myChart.destroy();

  let ctx = document.getElementById("chart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Income",  data: incomeData,  backgroundColor: "rgba(16,185,129,0.7)", borderRadius: 6 },
        { label: "Expense", data: expenseData, backgroundColor: "rgba(244,63,94,0.7)",  borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ---------- MASTER REFRESH ----------
function refreshAll() {
  updateCards();
  renderTable();
  renderChart();
}

// ---------- SETTINGS ----------
function saveSettings() {
  let name     = document.getElementById("userName").value;
  let currency = document.getElementById("currency").value;
  localStorage.setItem("userName", name);
  localStorage.setItem("currency", currency);
  currencySymbol = currency;
  if (name) {
    document.getElementById("userName-display").innerText = "Hello, " + name + " 👋";
  }
  refreshAll();
  alert("Settings saved!");
}

function loadSettings() {
  let name     = localStorage.getItem("userName");
  let currency = localStorage.getItem("currency");
  let dark     = localStorage.getItem("darkMode");

  if (name) {
    document.getElementById("userName").value = name;
    document.getElementById("userName-display").innerText = "Hello, " + name + " 👋";
  }

  if (currency) {
    document.getElementById("currency").value = currency;
    currencySymbol = currency;
  }

  if (dark === "true") {
    document.body.classList.add("dark");
    document.getElementById("darkMode").checked = true;
  }
}

// ---------- DARK MODE ----------
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// ---------- RESET ----------
function resetAllData() {
  if (confirm("Are you sure? This will delete everything!")) {
    localStorage.clear();
    
    location.reload();
  }
}
function logoutUser(){

    if(confirm("Are you sure you want to logout?")){

        localStorage.removeItem("currentUser");

        location.reload();

    }

}