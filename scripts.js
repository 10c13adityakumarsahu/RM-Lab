const experiments = [
  "experiment1",
  "experiment2",
  "experiment3",
  "experiment4",
  "experiment5",
  "experiment6",
  "experiment7",
  "experiment8",
  "experiment9",
  "experiment10",
  "experiment11",
  "experiment12"
];

const list = document.getElementById("experimentList");
const content = document.getElementById("content");
const title = document.getElementById("title");

/* Load sidebar */
experiments.forEach(exp => {
  const li = document.createElement("li");
  li.textContent = exp.replace("experiment", "Experiment ");
  li.onclick = () => loadExperiment(exp);
  list.appendChild(li);
});

/* Fetch JSON */
async function loadExperiment(name) {
  const res = await fetch(`data/${name}.json`);
  const data = await res.json();

  title.textContent = data.title;

  content.innerHTML = `
    ${createVideos(data.videos)}
    ${createCard("Aim", data.aim)}
    ${createCard("Apparatus", data.apparatus)}
    ${createCard("Theory", data.theory)}
    ${createCard("Principle", data.principle)}
    ${createDiagram(data.diagram)}
    ${createList("Procedure", data.procedure)}
    ${createTable(data.tables)}
    ${createCard("Calculation", data.calculation)}
    ${createCard("Precautions", data.precautions)}
    ${createCard("Result", data.result)}
  `;
}

/* UI Components */

function createCard(title, text) {
  if (!text) return "";
  return `
    <div class="card">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function createVideos(videos) {
  if (!videos) return "";
  return videos.map(v => `
    <div class="card">
      <iframe src="${v}" allowfullscreen></iframe>
    </div>
  `).join("");
}

function createDiagram(url) {
  if (!url) return "";
  return `
    <div class="card">
      <h3>Diagram</h3>
      <img src="${url}" style="width:100%; border-radius:10px;">
    </div>
  `;
}

function createList(title, items) {
  if (!items) return "";
  return `
    <div class="card">
      <h3>${title}</h3>
      <ul>
        ${items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;
}

function createTable(rows) {
  if (!rows) return "";
  const keys = Object.keys(rows[0]);

  return `
    <div class="card">
      <h3>Observations</h3>
      <table>
        <tr>${keys.map(k => `<th>${k}</th>`).join("")}</tr>
        ${rows.map(r => `
          <tr>${keys.map(k => `<td>${r[k]}</td>`).join("")}</tr>
        `).join("")}
      </table>
    </div>
  `;
}