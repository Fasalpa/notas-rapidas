const API_URL = "http://localhost:8080/api/notes";

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
const btnFilter = document.querySelectorAll(".btn-filter");

// modal
const modalNote = document.getElementById("modal-note");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelEdit = document.getElementById("btn-cancel-edit");
const formEditNote = document.getElementById("form-edit-note");
const editTitle = document.getElementById("edit-title");
const editText = document.getElementById("edit-text");
const editDate = document.getElementById("edit-date");

let notes = [];
let background = "";
let stateMind = "Neutral 😐";
let valueTimeDestruction = "";
let filter = "";
let currentEditingNoteId = null;
fetchNotes();
colorBtnNote();
listenerDestruction();
listenerCapsule();
validationText();
renderNotes();
filterBtn();

async function fetchNotes() {
  try {
    const response = await fetch("http://localhost:8080/api/notes");
    notes = await response.json();
    renderNotes();
  } catch (error) {
    console.error("Error al traer las notas:", error);
  }
}

function colorBtnNote() {
  colors.forEach((c) => {
    c.addEventListener("click", () => {
      colors.forEach((btn) => btn.classList.remove("selected"));
      if (background === "") {
        background = "var(--btn-lemon)";
      } else {
        background = getComputedStyle(c).backgroundColor;
        c.classList.add("selected");
      }
    });
  });
}

function filterBtn() {
  btnFilter.forEach((b) => {
    b.addEventListener("click", () => {
      console.log(b);

      if (b.textContent === "Todas") {
        filter = "all";
        console.log("all");
        renderNotes();
      } else if (b.textContent === "Ánimo") {
        console.log("mood");
        filter = "mood";
        renderNotes();
      } else {
        console.log("capsule");
        filter = "capsule";
        renderNotes();
      }
    });
  });
}

moodSlider.addEventListener("input", () => {
  const valueMood = moodSlider.value;
  if (valueMood < 14.28) {
    moodValue.textContent = "Terrible 😫";
    stateMind = moodValue.textContent;
    moodSlider.style.setProperty("--mood-color", "var(--terrible)");
  } else if (valueMood < 28.56) {
    moodValue.textContent = "Mal 😔";
    stateMind = moodValue.textContent;
    moodSlider.style.setProperty("--mood-color", "var(--mal)");
  } else if (valueMood < 42.82) {
    moodValue.textContent = "Ligeramente mal 😕";
    stateMind = moodValue.textContent;

    moodSlider.style.setProperty("--mood-color", "var(--ligeramente-mal)");
  } else if (valueMood < 57.12) {
    moodValue.textContent = "Neutral 😐";
    stateMind = moodValue.textContent;

    moodSlider.style.setProperty("--mood-color", "var(--neutral)");
  } else if (valueMood < 71.4) {
    moodValue.textContent = "Ligeramente bien 🙂";
    stateMind = moodValue.textContent;

    moodSlider.style.setProperty("--mood-color", "var(--ligeramente-bien)");
  } else if (valueMood < 85.68) {
    moodValue.textContent = "Bien 😊";
    stateMind = moodValue.textContent;

    moodSlider.style.setProperty("--mood-color", "var(--bien)");
  } else {
    moodValue.textContent = "Increible 😁";
    stateMind = moodValue.textContent;

    moodSlider.style.setProperty("--mood-color", "var(--increible)");
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
      textArea.addEventListener("input", () => {
        if (textArea.value !== "") {
          btnSave.disabled = false;
        }
      });
    } else {
      btnSave.disabled = true;
    }
  });
}

function renderNotes() {
  let notesRender = notes;

  if (filter === "capsule") {
    notesRender = notes.filter((nota) => nota.capsule !== null);
  } else if (filter === "mood") {
    notesRender = notes.filter((nota) => nota.mood !== "Neutral 😐");
  } else {
    notesRender = notes;
  }

  if (notesRender.length === 0) {
    containerNotes.innerHTML = `
        <div class="empty-state">
          <img src="./assets/notes.png" alt="clean notes icon"/>
          <h5>Aún no tienes notas</h5>
          <p id="question">¿Escribimos la primera nota?</p>
          <p>Arriba encontrarás todo para agregar tu nota.</p>
        </div>`;
  } else {
    containerNotes.innerHTML = notesRender
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
          ? `<p class="destruction-badge">Destrucción: ${timeRemaining(nota.destruction)}</p>`
          : "";

        return `
          <article class="card-note" data-id="${nota.id}" style="background-color: ${nota.colorBackground || "var(--btn-lemon)"};">
            <div class="card-note-container">
              <h5 class="card-note-title">${nota.title}</h5>
              <button type="button" data-id="${nota.id}" class="btn-delete">🗑️</button>
            </div>
            <div class="card-container-text">
              <p class="card-note-text">${textToShow}</p>
            </div>
            <div class="card-note-footer">
              <p class="card-note-date">Creado: ${new Date(nota.date).toLocaleString()}</p>
              ${capsuleStatusHTML}
              ${timeToShow}
            </div>
            
            <div class="card-note-meta">
              <span class="card-note-mood-label">Ánimo</span>
              <span class="card-note-mood-badge">${nota.mood || "Neutral 😐"}</span>
            </div>
          </article>`;
      })
      .join("");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const capsuleDate = capsule.checked ? timeCapsule.value : null;
  const destructionDate =
    destruction.checked && timeDestruction.value
      ? new Date(timeDestruction.value).getTime()
      : null;

  const newNote = {
    // id: crypto.randomUUID(), esto ya lo genera el java
    title: inputTitle.value,
    text: textArea.value,
    colorBackground: background,
    mood: stateMind,
    destruction: destructionDate,
    capsule: capsuleDate,
    // date: Date.now(), esto ya lo genera el java
  };
  // notes.push(newNote);
  // localStorage.setItem("notes", JSON.stringify(notes));

  try {
    const response = await fetch("http://localhost:8080/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });
    if (response.ok) {
      await fetchNotes();

      const textoOriginal = btnSave.textContent;
      btnSave.textContent = "Guardada!";
      btnSave.classList.add("saved");

      setTimeout(() => {
        btnSave.textContent = textoOriginal;
        btnSave.classList.remove("saved");
        resetValues();
      }, 2000);
    }
  } catch (error) {
    console.log("Error ");
  }
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

containerNotes.addEventListener("click", async (e) => {
  //detectamos el botón de eliminar o su contenido
  const btnDelete = e.target.closest(".btn-delete");

  if (btnDelete) {
    // detenemos la propagación para que no active la tarjeta ni el modal
    e.stopPropagation();
    e.preventDefault();

    const id = btnDelete.dataset.id;

    try {
      const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchNotes(); // Recargamos las notas desde Spring Boot
      } else {
        console.error(
          "No se pudo eliminar la nota en el servidor. Status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }

    return;
  }

  //si el clic no fue en el botón de eliminar, abrimos el modal
  const card = e.target.closest(".card-note");
  if (card) {
    const noteId = card.dataset.id;
    openModal(noteId);
  }
});

function openModal(id) {
  const targetNote = notes.find((n) => n.id === id);
  if (!targetNote) {
    return;
  }
  const isLoked =
    targetNote.capsule && new Date(targetNote.capsule).getTime() > Date.now();
  if (isLoked) {
    alert(
      "🔒 Esta nota no se puede editar hasta que se abra la capsula del tiempo. (recuerda que es un regalo de ti para ti 😊)",
    );
    return;
  }

  currentEditingNoteId = id;

  editTitle.value = targetNote.title;
  editText.value = targetNote.text;
  editDate.textContent = `Creada: ${new Date(targetNote.date).toLocaleString()}`;

  modalNote.classList.remove("hidden");
}

function closeModal() {
  modalNote.classList.add("hidden");
  currentEditingNoteId = null;
}

btnCloseModal.addEventListener("click", closeModal);
btnCancelEdit.addEventListener("click", closeModal);

modalNote.addEventListener("click", (e) => {
  if (e.target === modalNote) {
    closeModal();
  }
});
formEditNote.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentEditingNoteId) {
    return;
  }
  notes = notes.map((nota) => {
    if (nota.id === currentEditingNoteId) {
      return { ...nota, title: editTitle.value, text: editText.value };
    }
    return nota;
  });
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();

  closeModal();
});

function deleteNote(id) {
  notes = notes.filter((nota) => nota.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

// refrescar para la cuenta regresiva
setInterval(() => {
  destroyExpiredNotes();
  renderNotes();
}, 1000);
