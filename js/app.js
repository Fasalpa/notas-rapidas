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

let notes = JSON.parse(localStorage.getItem("notes")) || [];
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
        background = "var(--btn-lemon)";
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
        // cápsula de tiempo
        const validationDateCapsule = Boolean(nota.capsule);
        const unlockTime = new Date(nota.capsule).getTime();
        const now = Date.now();
        const isLocked = validationDateCapsule && unlockTime > now;

        const textToShow = isLocked
          ? `🔒 <b>Esta nota es para tu yo futuro.</b>`
          : nota.text;

        const capsuleStatusHTML = validationDateCapsule
          ? isLocked
            ? `<p class="capsule-badge locked">🔒 Se desbloquea: ${new Date(nota.capsule).toLocaleString()}</p>`
            : `<span class="capsule-badge unlocked">🔓 Cápsula Abierta</span>`
          : "";

        // autodestrucción

        const hasDestruction = Boolean(nota.destruction);

        const timeToShow = hasDestruction
          ? `<p class="destruction-badge"><b>Destrucción: <br> ${timeRemaining(nota.destruction)}</b></p>`
          : "";

        return `
          <article class="card-nota" style="background-color: ${nota.colorBackground || "var(--btn-lemon)"};">
            <h3 class="card-nota-title">${nota.title}</h3>
            <p class="card-nota-text">${textToShow}</p>
            
            <div class="card-nota-footer">
              <p class="card-nota-date">Creado: ${new Date(nota.date).toLocaleString()}</p>
              ${capsuleStatusHTML}
              ${timeToShow}
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const capsuleDate = capsule.checked ? timeCapsule.value : null;
  const destructionDate =
    destruction.checked && timeDestruction.value
      ? new Date(timeDestruction.value).getTime()
      : null;

  const newNote = {
    id: crypto.randomUUID(),
    title: inputTitle.value,
    text: textArea.value,
    colorBackground: background,
    mood: stateMind,
    destruction: destructionDate,
    capsule: capsuleDate,
    date: Date.now(),
  };
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes();
  resetValues();
});

function timeRemaining(timeStamp) {
  const difference = timeStamp - Date.now();

  if (difference <= 0) {
    return "🌋 Nota destruida";
  }
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function destroyExpiredNotes() {
  const now = Date.now();

  notes = notes.filter((nota) => {
    return !nota.destruction || nota.destruction > now;
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

function resetValues() {
inputTitle.value = "";
  textArea.value = "";
  moodSlider.value = 50;
  moodValue.textContent = "Neutral 😐";
  destruction.checked = false;
  timeDestruction.value = "";
  timeDestruction.disabled = true;
  capsule.checked = false;
  timeCapsule.value = "";
  timeCapsule.disabled = true;
  btnSave.disabled = true;
}
// refrescar para la cuenta regresiva
setInterval(() => {
  destroyExpiredNotes();
  renderNotes();
}, 1000);
