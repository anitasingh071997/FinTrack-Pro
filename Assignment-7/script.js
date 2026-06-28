const taskForm = document.querySelector("#taskForm");
const taskTitle = document.querySelector("#taskTitle");
const taskCategory = document.querySelector("#taskCategory");
const taskContainer = document.querySelector("#taskContainer");

const countQueued = document.querySelector("#countQueued");
const countCompleted = document.querySelector("#countCompleted");

const clearAllBtn = document.querySelector("#clearAllBtn");
const themeToggle = document.querySelector("#themeToggle");

let taskId = 1;

/* =========================
   UPDATE COUNTERS
========================= */

function updateCounts() {
  const queued = document.querySelectorAll(
    '.task-card[data-status="queued"]'
  ).length;

  const completed = document.querySelectorAll(
    '.task-card[data-status="completed"]'
  ).length;

  countQueued.textContent = queued;
  countCompleted.textContent = completed;
}

updateCounts();

/* -----------
   ADD TASK
--------------- */

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const category = taskCategory.value;

  if (!title) return;

  const card = document.createElement("div");

  card.classList.add("task-card");

  card.dataset.id = taskId;
  card.dataset.status = "queued";
  card.dataset.category = category;

  card.innerHTML = `
    <div class="card-top">
      <span class="task-name">${title}</span>
      <span class="task-id">#${String(taskId).padStart(4, "0")}</span>
    </div>

    <div class="tags">
      <span class="tag tag-${category}">
        ${category}
      </span>

      <span class="tag tag-queued">
        queued
      </span>
    </div>

    <div class="actions">
      <button class="edit-btn">Edit</button>
      <button class="complete-btn">Complete</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  taskContainer.prepend(card);

  taskId++;

  taskTitle.value = "";

  updateCounts();
});

/* ------------------
   EVENT DELEGATION
-------------------- */

taskContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".task-card");

  if (!card) return;

  /* DELETE */

  if (e.target.classList.contains("delete-btn")) {
    card.remove();
    updateCounts();
  }

  /* EDIT */

  if (e.target.classList.contains("edit-btn")) {
    const taskName =
      card.querySelector(".task-name");

    const newText = prompt(
      "Edit Task",
      taskName.textContent
    );

    if (
      newText &&
      newText.trim() !== ""
    ) {
      taskName.textContent = newText.trim();
    }
  }

  /* COMPLETE */

  if (e.target.classList.contains("complete-btn")) {
    card.dataset.status = "completed";

    const statusTag =
      card.querySelector(".tag-queued");

    if (statusTag) {
      statusTag.textContent = "completed";
      statusTag.classList.remove("tag-queued");
      statusTag.classList.add("tag-completed");
    }

    e.target.disabled = true;
    e.target.textContent = "Completed";

    updateCounts();
  }
});

/* ----------
   CLEAR ALL
--------------*/

clearAllBtn.addEventListener("click", () => {
  taskContainer.innerHTML = "";
  updateCounts();
});

/* -----------------
   DARK / LIGHT MODE
---------------------- */

themeToggle.addEventListener("click", () => {
  const currentTheme =
    themeToggle.dataset.theme;

  if (currentTheme === "dark") {
    document.body.setAttribute(
      "data-theme",
      "light"
    );

    themeToggle.dataset.theme =
      "light";

    themeToggle.innerHTML =
      '<i class="ri-sun-line"></i> Light';
  } else {
    document.body.setAttribute(
      "data-theme",
      "dark"
    );

    themeToggle.dataset.theme =
      "dark";

    themeToggle.innerHTML =
      '<i class="ri-moon-line"></i> Dark';
  }
});

const searchInput = document.querySelector("#searchInput");

searchInput.addEventListener("input", () => {

  const searchValue =
    searchInput.value.toLowerCase();

  const allTasks =
    document.querySelectorAll(".task-card");

  allTasks.forEach((task) => {

    const taskName =
      task.querySelector(".task-name")
      .textContent
      .toLowerCase();

    if (taskName.includes(searchValue)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }

  });

});

const categoryFilter = document.querySelector("#categoryFilter");

categoryFilter.addEventListener("change", () => {

  const selectedCategory =
    categoryFilter.value;

  const allTasks =
    document.querySelectorAll(".task-card");

  allTasks.forEach((task) => {

    const taskCategory =
      task.dataset.category;

    if (
      selectedCategory === "all" ||
      taskCategory === selectedCategory
    ) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }

  });

});