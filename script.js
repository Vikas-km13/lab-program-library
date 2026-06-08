const password = "lab123";

const entered = prompt("Enter Password");

if (entered !== password) {
    document.body.innerHTML =
        "<h1>Access Denied</h1><p>Wrong Password</p>";
    throw new Error("Unauthorized");
}
const STORAGE_KEY = "labPrograms_v2";
const THEME_KEY = "labPrograms_theme";

let programs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let selectedIndex = null;

const programList = document.getElementById("programList");
const searchInput = document.getElementById("search");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const codeTextarea = document.getElementById("code");
const themeToggle = document.getElementById("themeToggle");

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
}

function renderPrograms(filter = "") {
  programList.innerHTML = "";

  programs
    .filter(p => p.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((p, index) => {
      const item = document.createElement("div");
      item.className = "program-item" + (index === selectedIndex ? " active" : "");
      item.innerHTML = `
        <div class="program-title">${escapeHtml(p.title)}</div>
        <div class="program-meta">${escapeHtml(p.category)}</div>
      `;
      item.onclick = () => loadProgram(index);
      programList.appendChild(item);
    });
}

function loadProgram(index) {
  selectedIndex = index;
  const p = programs[index];

  titleInput.value = p.title;
  categorySelect.value = p.category;
  codeTextarea.value = p.code;

  renderPrograms(searchInput.value);
}

function newProgram() {
  selectedIndex = null;
  titleInput.value = "";
  categorySelect.value = "C Program";
  codeTextarea.value = "";
  titleInput.focus();
  renderPrograms(searchInput.value);
}

function saveProgram() {
  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const code = codeTextarea.value;

  if (!title) {
    alert("Please enter a program title.");
    return;
  }

  const program = { title, category, code };

  if (selectedIndex === null) {
    programs.unshift(program);
    selectedIndex = 0;
  } else {
    programs[selectedIndex] = program;
  }

  persist();
  renderPrograms(searchInput.value);
  alert("Program saved.");
}

function deleteProgram() {
  if (selectedIndex === null) {
    alert("No program selected.");
    return;
  }

  if (!confirm("Delete this program?")) return;

  programs.splice(selectedIndex, 1);
  persist();
  newProgram();
  renderPrograms(searchInput.value);
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(codeTextarea.value);
    alert("Code copied to clipboard.");
  } catch (err) {
    alert("Copy failed.");
  }
}

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Seed with a sample program if empty
if (programs.length === 0) {
  programs = [
    {
      title: "Hello World in C",
      category: "C Program",
      code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
    }
  ];
  persist();
}

// Events
searchInput.addEventListener("input", e => renderPrograms(e.target.value));
document.getElementById("newBtn").addEventListener("click", newProgram);
document.getElementById("saveBtn").addEventListener("click", saveProgram);
document.getElementById("deleteBtn").addEventListener("click", deleteProgram);
document.getElementById("copyBtn").addEventListener("click", copyCode);
themeToggle.addEventListener("click", toggleTheme);

// Init
applyTheme(localStorage.getItem(THEME_KEY) || "dark");
renderPrograms();
loadProgram(0);
