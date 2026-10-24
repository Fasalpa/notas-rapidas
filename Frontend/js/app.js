const API_BASE_URL = "https://notas-rapidas-api.onrender.com/api";
const API_NOTES = `${API_BASE_URL}/notes`;
const API_AUTH = `${API_BASE_URL}/auth`;

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
const search = document.getElementById("input-search");
const btnFilter = document.querySelectorAll(".btn-filter");

// Modal de edición de notas
const modalNote = document.getElementById("modal-note");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelEdit = document.getElementById("btn-cancel-edit");
const formEditNote = document.getElementById("form-edit-note");
const editTitle = document.getElementById("edit-title");
const editText = document.getElementById("edit-text");
const editDate = document.getElementById("edit-date");

// Contenedor de notificaciones toast
let container = document.getElementById("toast-container");

let notes = [];
let background = "";
let stateMind = "Neutral 😐";
let filter = "";
let currentEditingNoteId = null;
let searchQuery = "";

// INICIALIZACIÓN PRINCIPAL DE LA APLICACIÓN
document.addEventListener("DOMContentLoaded", () => {
  // Listeners para los formularios de autenticación
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  if (formLogin) {
    formLogin.addEventListener("submit", handleLogin);
  }

  if (formRegister) {
    formRegister.addEventListener("submit", handleRegister);
  }

  // Inicializar componentes UI de creación y filtros
  colorBtnNote();
  listenerDestruction();
  listenerCapsule();
  validationText();
  filterBtn();

  // Verificar si hay sesión activa para mostrar u ocultar el modal
  checkAuthState();
});

// GESTIÓN DE TOKENS JWT

function getToken() {
  return localStorage.getItem("jwt_token");
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// LÓGICA DE AUTENTICACIÓN (LOGIN, REGISTRO, LOGOUT)

function switchTab(tab) {
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const errorMsg = document.getElementById("auth-error");

  if (errorMsg) errorMsg.style.display = "none";

  if (tab === "login") {
    if (formLogin) formLogin.style.display = "flex";
    if (formRegister) formRegister.style.display = "none";
    if (tabLogin) tabLogin.classList.add("active");
    if (tabRegister) tabRegister.classList.remove("active");
  } else {
    if (formLogin) formLogin.style.display = "none";
    if (formRegister) formRegister.style.display = "flex";
    if (tabRegister) tabRegister.classList.add("active");
    if (tabLogin) tabLogin.classList.remove("active");
  }
}
window.switchTab = switchTab; // Disponible globalmente para los onclick

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showAuthError("Por favor ingresa tu correo y contraseña.");
    return;
  }

  await login(email, password);
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!name || !email || !password) {
    showAuthError("Por favor completa todos los campos del registro.");
    return;
  }

  await register(name, email, password);
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();
    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("user_email", data.email);

    checkAuthState();
  } catch (error) {
    showAuthError("Correo o contraseña incorrectos.");
  }
}

async function register(name, email, password) {
  try {
    const response = await fetch(`${API_AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const data = await response.json();
    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("user_email", data.email);

    checkAuthState();
  } catch (error) {
    showAuthError(error.message || "Error al registrar la cuenta.");
  }
}

function logout() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_email");
  notes = [];
  renderNotes();
  document.getElementById("form-login").reset();
  checkAuthState();
}

function checkAuthState() {
  const token = getToken();
  const authModal = document.getElementById("auth-modal");
  const userBar = document.getElementById("user-bar");
  const userEmailDisplay = document.getElementById("user-email-display");

  if (token) {
    if (authModal) authModal.style.display = "none";
    if (userBar) userBar.style.display = "flex";
    if (userEmailDisplay)
      userEmailDisplay.textContent = localStorage.getItem("user_email");
    fetchNotes();
  } else {
    if (authModal) authModal.style.display = "flex";
    if (userBar) userBar.style.display = "none";
  }
}

function showAuthError(msg) {
  const errorMsg = document.getElementById("auth-error");
  if (errorMsg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "block";
  }
}

// PETICIONES HTTP A SPRING BOOT (NOTAS)

async function fetchNotes() {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(API_NOTES, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    if (!response.ok) {
      console.error("Respuesta no válida del servidor:", response.status);
      return;
    }

    notes = await response.json();
    renderNotes();
  } catch (error) {
    console.error("Error al traer las notas:", error);
  }
}

async function createNote(noteData) {
  try {
    const response = await fetch(API_NOTES, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData),
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
      showNotification("✨ ¡Nota guardada con éxito!", "success");
    } else {
      showNotification("Error al guardar la nota.", "error");
    }
  } catch (error) {
    console.error("Error al crear la nota: ", error);
  }
}

async function deleteNote(id) {
  try {
    const response = await fetch(`${API_NOTES}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      await fetchNotes();
      showNotification("💥 Mensaje eliminado con éxito.");
    } else {
      console.error("No se pudo eliminar la nota. Status:", response.status);
    }
  } catch (error) {
    console.error("Error al eliminar la nota:", error);
  }
}

async function updateNote(id, updatedData) {
  try {
    const response = await fetch(`${API_NOTES}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      await fetchNotes();
      closeModal();
      showNotification("✏️ Se ha editado con éxito.");
    } else {
      console.error("Error al actualizar la nota. Status:", response.status);
    }
  } catch (error) {
    console.error("Error en la petición PUT de edición:", error);
  }
}

// MANIPULACIÓN DEL DOM Y EVENTOS DE CREACIÓN / FILTROS

function colorBtnNote() {
  colors.forEach((c) => {
    c.addEventListener("click", () => {
      colors.forEach((btn) => btn.classList.remove("selected"));
      c.classList.add("selected");
      background = getComputedStyle(c).backgroundColor;
    });
  });
}

search.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderNotes();
});

function filterBtn() {
  btnFilter.forEach((b) => {
    b.addEventListener("click", () => {
      if (b.textContent === "Todas") {
        filter = "all";
      } else if (b.textContent === "Ánimo") {
        filter = "mood";
      } else {
        filter = "capsule";
      }
      renderNotes();
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
    if (destruction.checked) {
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
    if (capsule.checked) {
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
    btnSave.disabled = !(
      inputTitle.value.trim() !== "" && textArea.value.trim() !== ""
    );
  });
  textArea.addEventListener("input", () => {
    btnSave.disabled = !(
      inputTitle.value.trim() !== "" && textArea.value.trim() !== ""
    );
  });
}

function getDestructionBadge(destructionTime) {
  if (!destructionTime) return "";
  const diffSeconds = Math.max(
    0,
    Math.floor((destructionTime - Date.now()) / 1000),
  );
  const minutes = Math.floor(diffSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (diffSeconds % 60).toString().padStart(2, "0");

  return `<span class="badge destruction-badge">🔥 Autodestrucción en ${minutes}:${seconds}</span>`;
}

function renderNotes() {
  let notesRender = notes;

  if (filter === "capsule") {
    notesRender = notes.filter((nota) => nota.capsule !== null);
  } else if (filter === "mood") {
    notesRender = notes.filter((nota) => nota.mood !== "Neutral 😐");
  }

  if (searchQuery !== "") {
    notesRender = notesRender.filter((nota) => {
      const titleMatch = nota.title
        ? nota.title.toLowerCase().includes(searchQuery)
        : false;
      const textMatch = nota.text
        ? nota.text.toLowerCase().includes(searchQuery)
        : false;
      return titleMatch || textMatch;
    });
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

        const hasDestruction = Boolean(nota.destruction);
        const timeToShow = hasDestruction
          ? `<p class="destruction-badge">Destrucción: ${getDestructionBadge(nota.destruction)}</p>`
          : "";

        return `
          <article class="card-note" data-id="${nota.id}" style="background-color: ${nota.colorBackground || nota.color_background || "var(--btn-lemon)"};">
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

// FORMULARIO DE CREACIÓN DE NOTA
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const capsuleDate = capsule.checked ? timeCapsule.value : null;
  const destructionDate =
    destruction.checked && timeDestruction.value
      ? new Date(timeDestruction.value).getTime()
      : null;

  const newNote = {
    title: inputTitle.value,
    text: textArea.value,
    colorBackground: background || "var(--btn-lemon)",
    mood: stateMind,
    destruction: destructionDate,
    capsule: capsuleDate,
  };

  await createNote(newNote);
});

// CLIC EN CARDS (ELIMINAR / EDITAR)
containerNotes.addEventListener("click", async (e) => {
  const btnDelete = e.target.closest(".btn-delete");

  if (btnDelete) {
    e.stopPropagation();
    e.preventDefault();
    const id = btnDelete.dataset.id;
    await deleteNote(id);
    return;
  }

  const card = e.target.closest(".card-note");
  if (card) {
    const noteId = card.dataset.id;
    openModal(noteId);
  }
});

// MODAL DE EDICIÓN DE NOTAS
function openModal(id) {
  const targetNote = notes.find((n) => n.id == id);
  if (!targetNote) return;

  const isLocked =
    targetNote.capsule && new Date(targetNote.capsule).getTime() > Date.now();
  if (isLocked) {
    showNotification(
      "🔒 Recuerda que solo se abrirá hasta que se cumpla el tiempo.",
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

if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
if (btnCancelEdit) btnCancelEdit.addEventListener("click", closeModal);

if (modalNote) {
  modalNote.addEventListener("click", (e) => {
    if (e.target === modalNote) closeModal();
  });
}

if (formEditNote) {
  formEditNote.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditingNoteId) return;

    const targetNote = notes.find((n) => n.id == currentEditingNoteId);
    if (!targetNote) return;

    const updatedNote = {
      id: currentEditingNoteId,
      title: editTitle.value,
      text: editText.value,
      colorBackground: targetNote.colorBackground,
      mood: targetNote.mood,
      destruction: targetNote.destruction,
      capsule: targetNote.capsule,
      date: targetNote.date,
    };

    await updateNote(currentEditingNoteId, updatedNote);
  });
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
  background = "";
  colors.forEach((btn) => btn.classList.remove("selected"));
}

function showNotification(message, type = "success") {
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "position-fixed top-0 end-0 p-3";
    container.style.zIndex = "1100";
    document.body.appendChild(container);
  }

  const alertType = type === "error" ? "danger" : type;
  const alertElement = document.createElement("div");
  alertElement.className = `alert alert-${alertType} alert-dismissible fade show shadow-sm`;
  alertElement.role = "alert";
  alertElement.innerHTML = `
    <span>${message}</span>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  container.appendChild(alertElement);
  setTimeout(() => {
    alertElement.classList.remove("show");
    setTimeout(() => alertElement.remove(), 150);
  }, 3000);
}

// PURGA AUTOMÁTICA Y ACTUALIZACIÓN EN TIEMPO REAL
function destroyExpiredNotes() {
  const now = Date.now();
  const expiredNotes = notes.filter(
    (nota) => nota.destruction && nota.destruction <= now,
  );

  expiredNotes.forEach((nota) => {
    deleteNote(nota.id);
  });
}

setInterval(() => {
  destroyExpiredNotes();
  renderNotes();
}, 1000);
