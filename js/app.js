const form = document.getElementById("form");
const btnSave = document.getElementById("btn-save-note");
const inputTitle = document.getElementById("input-title");
const textArea = document.getElementById("textarea-description");
const colors = document.querySelectorAll(".btn-color");
const moodSlider = document.getElementById("mood");
const moodValue = document.getElementById("mood-value");
const destruction = document.getElementById("destruction");
const timeDestruction = document.getElementById("time-self-destruction");
const capsule = document.getElementById("check-capsule");
const timeCapsule = document.getElementById("unlock-date");
const containerNotes = document.querySelector(".container-notes");

const notes = JSON.parse(localStorage.getItem("notes")) || [];
let background = "#d0f0de";
let stateMind = "Neutral 😐";
let valueTimeDestruction = "";
colorBtnNote();
listenerDestruction();
listenerCapsule();
validationText();
renderNotes();

function colorBtnNote() {
  colors.forEach((c) => {
    c.addEventListener("click", () => {
      if (background === "") {
        background = getComputedStyle("background:red;");
      } else {
        background = getComputedStyle(c).backgroundColor;
      }
    });
  });
}

moodSlider.addEventListener("input", () => {
  const valueMood = moodSlider.value;

  if (valueMood < 14.28) {
    moodValue.textContent = "Muy mal 😫";
    stateMind = moodValue.textContent;
  } else if (valueMood < 28.56) {
    moodValue.textContent = "Mal 😔";
    stateMind = moodValue.textContent;
  } else if (valueMood < 42.82) {
    moodValue.textContent = "Ligeramente mal 😕";
    stateMind = moodValue.textContent;
  } else if (valueMood < 57.12) {
    moodValue.textContent = "Neutral 😐";
    stateMind = moodValue.textContent;
  } else if (valueMood < 71.4) {
    moodValue.textContent = "Ligeramente bien 🙂";
    stateMind = moodValue.textContent;
  } else if (valueMood < 85.68) {
    moodValue.textContent = "Bien 😊";
    stateMind = moodValue.textContent;
  } else {
    moodValue.textContent = "Muy bien 😁";
    stateMind = moodValue.textContent;
  }
});

function listenerDestruction() {
  destruction.addEventListener("change", () => {
    if (destruction.checked == true) {
      timeDestruction.disabled = false;
      capsule.disabled = true;
    } else {
      timeDestruction.disabled = true;
      capsule.disabled = false;
    }
  });
}

function listenerCapsule() {
  capsule.addEventListener("change", () => {
    if (capsule.checked == true) {
      timeCapsule.disabled = false;
      destruction.disabled = true;
    } else {
      timeCapsule.disabled = true;
      destruction.disabled = false;
    }
  });
}

function validationText() {
  inputTitle.addEventListener("input", () => {
    if (inputTitle.value !== "") {
      btnSave.disabled = false;
    } else {
      btnSave.disabled = true;
    }
  });
}

function renderNotes() {
  if (notes.length === 0) {
    containerNotes.innerHTML = `
            <img src="./assets/notes.png" alt="clean notes icon"/>
            <h4>Aún no tienes notas</h4>
            <p id="question">Escribimos la primer nota?</p>
            <p>Arriba encontrarás todo para agregar tu nota.</p>`;
  } else {
    containerNotes.innerHTML = notes
      .map((nota) => {
        return `
          <article class="card-nota" style="background-color: ${nota.colorBackground || "var(--btn-lemon)"};">
            <h3 class="card-nota-title">${nota.title}</h3>
            <p class="card-nota-text">${nota.text}</p>
            
            <div class="card-nota-footer">
              <p class="card-nota-date">Fecha: ${new Date(nota.date).toLocaleString()}</p>
            </div>
            
            <div class="card-nota-meta">
              <span class="card-nota-mood-label">Ánimo</span>
              <span class="card-nota-mood-badge">${nota.mood || "Neutral 😐"}</span>
            </div>
          </article>`;
      })
      .join("");
  }
}

form.addEventListener("submit", () => {
  const newNote = {
    id: crypto.randomUUID(),
    title: inputTitle.value,
    text: textArea.value,
    colorBackground: background,
    mood: stateMind,
    destruction: timeDestruction.value,
    capsule: timeCapsule.value,
    date: Date.now(),
  };
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  resetValues();
});

function resetValues() {
  inputTitle.value = "";
  textArea.value = "";
  moodSlider.value = 50;
  moodValue.textContent = "Neutral 😐";
  destruction.checked = false;
  timeDestruction.disabled = true;
  capsule.checked = false;
  timeCapsule.disabled = true;
}
