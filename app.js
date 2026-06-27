const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filters button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";


// ==========================
// SAVE TO LOCAL STORAGE
// ==========================
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}


// ==========================
// RENDER TODOS
// ==========================
function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === "active") {
      return !todo.completed;
    }

    if (currentFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");

    if (todo.completed) {
      li.classList.add("completed");
    }

    li.dataset.id = todo.id;

    li.innerHTML = `
      <span>${todo.text}</span>

      <div class="actions">
        <button class="toggle-btn">
          ${todo.completed ? "Undo" : "Done"}
        </button>

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>
      </div>
    `;

    todoList.appendChild(li);
  });
}


// ==========================
// ADD TODO
// ==========================
form.addEventListener("submit", e => {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);

  saveTodos();
  renderTodos();

  input.value = "";
});


// ==========================
// EVENT DELEGATION
// ==========================
todoList.addEventListener("click", e => {
  const li = e.target.closest("li");

  if (!li) return;

  const id = Number(li.dataset.id);

  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    todos = todos.filter(todo => todo.id !== id);
  }

  // TOGGLE COMPLETE
  if (e.target.classList.contains("toggle-btn")) {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed
        };
      }

      return todo;
    });
  }

  // EDIT
  if (e.target.classList.contains("edit-btn")) {
    const todo = todos.find(todo => todo.id === id);

    const updatedText = prompt("Edit task:", todo.text);

    if (updatedText !== null && updatedText.trim() !== "") {
      todo.text = updatedText.trim();
    }
  }

  saveTodos();
  renderTodos();
});


// ==========================
// FILTERING
// ==========================
filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTodos();
  });
});


// INITIAL RENDER
renderTodos();