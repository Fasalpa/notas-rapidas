const bntSave = document.getElementById("btn-save-note");
const inputTitle = document.getElementById("input-title");
const textArea = document.getElementById("textarea-description");
const colors = document.querySelectorAll(".btn-color");
const moodSlider = document.getElementById("mood");
const moodValue = document.getElementById("mood-value");

const notes = [];
let background = "";
colorBtnNote();

bntSave.addEventListener("click", (e) => {
  e.preventDefault();

  const newNote = {
    title: inputTitle.value,
    text: textArea.value,
    colorBackground: background,
  };

  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  const notaGuardada = JSON.parse(localStorage.getItem("notes"));

  console.log(notaGuardada);
});

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
  } else if (valueMood < 28.56) {
    moodValue.textContent = "Mal 😔";
  } else if (valueMood < 42.82) {
    moodValue.textContent = "Ligeramente mal 😕";
  } else if (valueMood < 57.12) {
    moodValue.textContent = "Neutral 😐";
  } else if (valueMood < 71.40) {
    moodValue.textContent = "Ligeramente bien 😕";
  } else if (valueMood < 42.82) {
    moodValue.textContent = "Bien 😕";
  } else {
    moodValue.textContent = "Muy bien 😕";
  }
});
