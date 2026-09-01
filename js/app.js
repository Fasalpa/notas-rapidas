const bntSave = document.getElementById("btn-save-note");
const inputTitle = document.getElementById("input-title");
const textArea = document.getElementById("textarea-description");
const colors = document.querySelectorAll(".btn-color");

const notas = [];

bntSave.addEventListener("click", (e) => {
  e.preventDefault();

  const nuevaNota = {
    title: inputTitle.value,
    textArea: textArea.value,
  };

  notas.push(nuevaNota);

  localStorage.setItem("notas", JSON.stringify(notas));
  const notasGuardadas = JSON.parse(localStorage.getItem(notas)) || [];

  console.log(notasGuardadas);
});

colors.forEach((c) => {
  c.addEventListener("click", function () {
    const background = getComputedStyle(c).backgroundColor;
    console.log(background);
  });
});
