/* ================================
   CONFIG
================================ */
const experiments = [
  "Schmidth Hammer Test",
  "Determination of RQD",
  "Point Load Test",
  "Brazilian Test",
  "Protodyakonov strength index",
  "Impact Strength Index",
  "UCS",
  "experiment8",
  "experiment9",
  "experiment10",
  "experiment11",
  "experiment12"
];

/* ================================
   DOM ELEMENTS
================================ */
const list = document.getElementById("experimentList");
const content = document.getElementById("content");
const title = document.getElementById("title");

/* ================================
   INIT SIDEBAR
================================ */
function initSidebar() {
  experiments.forEach((exp, index) => {
    const li = document.createElement("li");
    li.textContent = exp.replace("experiment", "Experiment ");

    li.addEventListener("click", () => {
      setActive(li);
      loadExperiment(exp);
    });

    // First item active by default
    if (index === 0) li.classList.add("active");

    list.appendChild(li);
  });
}

/* ================================
   ACTIVE STATE
================================ */
function setActive(selectedLi) {
  document.querySelectorAll("#experimentList li").forEach(li => {
    li.classList.remove("active");
  });
  selectedLi.classList.add("active");
}

/* ================================
   LOAD EXPERIMENT
================================ */
async function loadExperiment(name) {
  showLoading();

  try {
    const res = await fetch(`data/${name}.json`);

    if (!res.ok) {
      throw new Error("JSON file not found");
    }

    const data = await res.json();

    renderExperiment(data);

  } catch (err) {
    showError(name, err);
  }
}

/* ================================
   RENDER UI
================================ */
function renderExperiment(data) {
  title.textContent = data.title || "Untitled Experiment";

  content.innerHTML = `
    ${createCard("Aim", data.aim)}
    ${createCard("Apparatus", data.apparatus)}
    ${createCard("Theory", data.theory)}
    ${createVideos(data.videos)}
    ${createCard("Principle", data.principle)}
    ${createDiagram(data.diagram)}
    ${createList("Procedure", data.procedure)}
    ${createRefTable(data.Reftables)}
    ${createTable(data.tables)}
    ${createCard("Calculation", data.calculation)}
    ${createCard("Precautions", data.precautions)}
    ${createCard("Result", data.result)}
  `;
}

/* ================================
   UI COMPONENTS
================================ */

function createCard(title, text) {
  if (!text) return "";
  return `
    <div class="card fade-in">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function createVideos(videos) {
  if (!videos || videos.length === 0) return "";

  return videos.map(v => `
    <div class="card fade-in">
      <iframe src="${v}" allowfullscreen></iframe>
    </div>
  `).join("");
}

function createDiagram(url) {
  if (!url) return "";

  return `
    <div class="card fade-in">
      <h3>Diagram</h3>
      <img src="${url}" style="width:100%; border-radius:10px;">
    </div>
  `;
}

function createList(title, items) {
  if (!items || items.length === 0) return "";

  return `
    <div class="card fade-in">
      <h3>${title}</h3>
      <ul>
        ${items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;
}

function createTable(rows) {
  if (!rows || rows.length === 0) return "";

  const keys = Object.keys(rows[0]);

  return `
    <div class="card fade-in">
      <h3>Observations</h3>
      <table>
        <thead>
          <tr>${keys.map(k => `<th>${k}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>${keys.map(k => `<td>${r[k]}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createRefTable(rows) {
  if (!rows || rows.length === 0) return "";

  const keys = Object.keys(rows[0]);

  return `
    <div class="card fade-in">
      <h3>Reference Tables</h3>
      <table>
        <thead>
          <tr>${keys.map(k => `<th>${k}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>${keys.map(k => `<td>${r[k]}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
/* ================================
   LOADING + ERROR STATES
================================ */

function showLoading() {
  content.innerHTML = `
    <div class="card">
      <p>Loading experiment...</p>
    </div>
  `;
}

function showError(name, err) {
  content.innerHTML = `
    <div class="card">
      <p style="color:red;">
        Failed to load <strong>${name}</strong><br>
        ${err.message}
      </p>
    </div>
  `;
  console.error(err);
}

/* ================================
   INIT APP
================================ */
initSidebar();
loadExperiment(experiments[0]); // ✅ AUTO LOAD FIRST