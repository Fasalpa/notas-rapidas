const bntSave = document.getElementById("btn-save-note");
const inputTitle = document.getElementById("input-title");
const textArea = document.getElementById("textarea-description");
const colors = document.querySelectorAll(".btn-color");

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


