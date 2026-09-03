const bntSave = document.getElementById("btn-save-note");
const inputTitle = document.getElementById("input-title");
const textArea = document.getElementById("textarea-description");
const colors = document.querySelectorAll(".btn-color");
const moodSlider = document.getElementById("mood");
const moodValue = document.getElementById("mood-value");
const destruction = document.getElementById("destruction");
const timeDestruction = document.getElementById("time-self-destruction");

const notes = [];
let background = "";
let stateMind = "";
let valueTimeDestruction = "";
colorBtnNote();

function colorBtnNote() {
  colors.forEach((c) => {
    c.addEventListener("click", () => {
      background = getComputedStyle(c).backgroundColor;
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
  } else if (valueMood < 42.82) {
    moodValue.textContent = "Bien 😊";
  } else {
    moodValue.textContent = "Muy bien 😁";
  }
});

destruction.addEventListener("change", () => {
  if (destruction.checked == true) {
    timeDestruction.disabled = false;
  } else {
    timeDestruction.disabled = true;
  }
});



bntSave.addEventListener("click", (e) => {
  e.preventDefault();

  const newNote = {
    title: inputTitle.value,
    text: textArea.value,
    colorBackground: background,
    mood: stateMind,
    destruction: timeDestruction.value,
  };
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  const notaGuardada = JSON.parse(localStorage.getItem("notes"));
  console.log(notaGuardada);
});
