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
            <div class="card-nota" style="display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                border-radius:16px;
                background-color:${nota.colorBackground};
                height:100%;width:90%;">
              <h3>${nota.title}</h3>
              <p>${nota.text}</p>
              <div style="display:flex;
                            flex-direction:row;
                            justify-content:center;
                            width:100%;">
                <p style="margin:0;">
                  Fecha: ${new Date(nota.date).toLocaleString()}</p>
              </div>
              <div style="display:flex;
                          flex-direction:row;
                          width:80%;
                          height:100px;
                          justify-content:space-around;
                          align-items: center;
                          gap:15%;
                          margin-bottom:4%;
                          ">
                <p style="margin:0;"><span>ánimo</span></p>
                <span class="mood-value-note" 
                      style="border:2px dotted white;
                      border-radius:16px;
                      padding:4px;">${nota.mood || "Neutral"}</span>
              </div>
          </div>`;
      })
      .join("");
  }
}

btnSave.addEventListener("submit", () => {

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
