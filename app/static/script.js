const apiUrl = "http://localhost:8000";

async function fetchLabels() {
    const res = await fetch(`${apiUrl}/labels`);
    const labels = await res.json();
    const list = document.getElementById("label-list");
    list.innerHTML = "";
    labels.forEach(label => {
    const li = document.createElement("li");
    li.innerHTML = `
        <div><strong>ID: ${label.id}</strong> — ${label.name}</div>
        <div>Уверенность: ${label.confidence}</div>
        <div class="label-actions">
        <button class="edit-label" data-id="${label.id}" data-name="${label.name}" data-confidence="${label.confidence}">Редактировать</button>
        <button class="delete-label" data-id="${label.id}">Удалить</button>
        </div>
    `;
    list.appendChild(li);
    });

    document.querySelectorAll(".delete-label").forEach(btn => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`${apiUrl}/labels/${id}`, { method: "DELETE" });
        fetchLabels();
    });
    });

    document.querySelectorAll(".edit-label").forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const confidence = btn.dataset.confidence;
        const id = btn.dataset.id;
        document.getElementById("name").value = name;
        document.getElementById("confidence").value = confidence;
        document.getElementById("label-form").dataset.editId = id;
    });
    });
}

document.getElementById("label-form").addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const confidence = document.getElementById("confidence").value;
    const form = document.getElementById("label-form");
    const id = form.dataset.editId;

    if (id) {
    await fetch(`${apiUrl}/labels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, confidence }),
    });
    delete form.dataset.editId;
    } else {
    await fetch(`${apiUrl}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, confidence }),
    });
    }

    form.reset();
    fetchLabels();
});

const sidebar = document.getElementById("label-sidebar");
const toggleBtn = document.getElementById("toggle-sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    toggleBtn.classList.toggle("collapsed");

    if (sidebar.classList.contains("hidden")) {
    toggleBtn.innerHTML = "&raquo;";
    toggleBtn.style.left = "0";
    } else {
    toggleBtn.innerHTML = "&laquo;";
    toggleBtn.style.left = "300px";
    }
});

const jsonFileInput = document.getElementById("json-file");
const jsonFileButton = document.getElementById("json-file-button");

jsonFileButton.addEventListener("click", () => {
    jsonFileInput.click();
});

jsonFileInput.addEventListener("change", async () => {
    const file = jsonFileInput.files[0];
    if (!file) return;

    try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) {
        alert("JSON должен быть массивом объектов");
        return;
    }

    for (const label of data) {
        if (!label.name || !label.confidence) continue;
        await fetch(`${apiUrl}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: label.name,
            confidence: label.confidence,
        }),
        });
    }
    fetchLabels();
    } catch (e) {
    alert("Ошибка при обработке JSON файла");
    console.error(e);
    }
    jsonFileInput.value = "";
});

fetchLabels();