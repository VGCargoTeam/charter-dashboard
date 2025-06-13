
let requestData = [];

async function loadData() {
  const res = await fetch('/api/data');
  requestData = await res.json();
  populateRows();
}

async function saveData() {
  await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
}

function populateRows() {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";
  requestData.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><button onclick="openDetails('${r.Ref}')">${r.Ref}</button></td>
      <td>${r.Airline || "-"}</td>
      <td>${r["Flight Date"] || "-"}</td>
      <td>${r.Tonnage || "-"}</td>
      <td><button onclick="deleteRequest('${r.Ref}')">Löschen</button></td>`;
    table.appendChild(row);
  });
}

function openDetails(ref) {
  const item = requestData.find(x => x.Ref === ref);
  if (!item) return alert("Nicht gefunden");
  document.getElementById("detailRef").innerText = item.Ref;
  document.getElementById("detailAirline").value = item.Airline || "";
  document.getElementById("detailFlightDate").value = item["Flight Date"] || "";
  document.getElementById("detailTonnage").value = item.Tonnage || "";
  document.getElementById("detailModal").style.display = "block";
}

function closeModal() {
  document.getElementById("detailModal").style.display = "none";
}

function saveDetails() {
  const ref = document.getElementById("detailRef").innerText;
  const entry = requestData.find(x => x.Ref === ref);
  if (entry) {
    entry.Airline = document.getElementById("detailAirline").value;
    entry["Flight Date"] = document.getElementById("detailFlightDate").value;
    entry.Tonnage = document.getElementById("detailTonnage").value;
  }
  saveData();
  closeModal();
  loadData();
}

function deleteRequest(ref) {
  if (!confirm("Möchtest du wirklich löschen?")) return;
  requestData = requestData.filter(x => x.Ref !== ref);
  saveData();
  loadData();
}

function createNewRequest() {
  const newRef = `CC-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
  requestData.push({ Ref: newRef });
  saveData();
  loadData();
  openDetails(newRef);
}

window.onload = loadData;
