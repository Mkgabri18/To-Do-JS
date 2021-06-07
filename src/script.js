const modal = document.getElementById("modal");
const form = document.querySelector(".task__form");
const title = document.querySelector(".task__title");
const description = document.querySelector(".task__description");
const date = document.querySelector(".task__date");
const btnClean = document.querySelector(".task__cta--clean");
const btnAddTask = document.querySelector(".task__cta--add");
// template block
const taskTodo = document.querySelector(".todo__list");
const taskDone = document.querySelector(".done__list");
// inner component
const template = document.querySelector("template").content;
const fragmentToDo = document.createDocumentFragment();
const fragmentDone = document.createDocumentFragment();

// VARIABLES
//MOCK
let taskList = [];

let completedList = [];

// SET INPUT DATE TODAY AS MIN-DATE
date.min = new Date().toISOString().split("T")[0];

// OPEN MODAL
function openModal() {
  modal.setAttribute("open", true);
  title.focus();
}

// CLOSE MODAL
function closeModal() {
  modal.removeAttribute("open");
}

// CLEAN FORMULARIO
function cleanForm() {
  form.reset(); // alternativa con even listener
  btnClean.disabled = true;
  btnAddTask.disabled = true;
  title.focus();
}

function addTask(e) {
  e.preventDefault();
  let newTask = {};
  newTask.id = JSON.stringify(+new Date());
  newTask.title = title.value.trim() !== "" ? title.value : "NO TITLE";
  newTask.description =
    description.value.trim() !== "" ? description.value : "NO DESCRIPTION";
  newTask.date = date.value ? date.value : "NO DATE";
  newTask.isDone = false;

  taskList.push(newTask);

  cleanForm();
  closeModal();
  renderTask();
}

// LOGIC ENABLED/DISABLED BUTTONS
modal.addEventListener("keyup", (event) => {
  // catch keyup in modal and abilitate clear button
  btnClean.disabled =
    title.value !== "" || description.value !== "" ? false : true;

  // abilitate addtask button
  btnAddTask.disabled = title.value !== "" ? false : true;
});

// RENDER TASKS LIST
function renderTask() {
  taskTodo.innerHTML = "";
  taskDone.innerHTML = "";
  // SAVE TASKS IN LOCAL STORAGE
  localStorage.setItem("dataTask", JSON.stringify(taskList));
  localStorage.setItem("dataTaskDone", JSON.stringify(completedList));
  for (let i in taskList) {
    fragmentToDo.appendChild(paintItemTask(taskList[i]));
  }
  taskTodo.appendChild(fragmentToDo);

  for (let i in completedList) {
    fragmentDone.appendChild(paintItemTask(completedList[i]));
  }
  taskDone.appendChild(fragmentDone);
}

function paintItemTask(ar) {
  const clone = template.cloneNode(true);
  clone.querySelector(".row__Item").setAttribute("id", ar.id); // set id each task
  clone.querySelector(".item__title").textContent = ar.title;
  clone.querySelector(".item__description").textContent = ar.description;
  clone.querySelector(".item__deadline").textContent = ar.date;
  clone.querySelector(".fa-circle").setAttribute("name", ar.id);
  clone.querySelector(".fa-check-circle").setAttribute("name", ar.id);
  clone.querySelector(".fa-trash-alt").setAttribute("name", ar.id);

  if (!ar.isDone) {
    clone.querySelector(".fa-circle").classList.remove("isHidden");
    clone.querySelector(".fa-check-circle").classList.add("isHidden");
  } else {
    clone.querySelector(".fa-circle").classList.add("isHidden");
    clone.querySelector(".fa-check-circle").classList.remove("isHidden");
    clone.querySelector(".item__title").style.textDecoration = "line-through";
  }

  return clone;
}

function completeTask(e) {
  console.log("task completed", e);
  console.log("task array", taskList);
  for (let i in taskList) {
    if (taskList[i].id === e.attributes.name.value) {
      taskList[i].isDone = true;
      completedList.push(taskList[i]);
      taskList.splice(i, 1);
      // todo break for cicle
    }
  }
  renderTask();
}

function undoneTask(e) {
  for (let i in completedList) {
    if (completedList[i].id === e.attributes.name.value) {
      completedList[i].isDone = false;
      taskList.push(completedList[i]);
      completedList.splice(i, 1);
    }
  }
  renderTask();
}

function deleteTask(e) {
  for (let i in taskList) {
    if (taskList[i].id === e.attributes.name.value) {
      taskList.splice(i, 1);
    }
  }
  for (let i in completedList) {
    if (completedList[i].id === e.attributes.name.value) {
      completedList.splice(i, 1);
    }
  }

  renderTask();
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM completamente caricato e analizzato dal LOCAL STORAGE");
  if (
    !!localStorage.getItem("dataTask") ||
    !!localStorage.getItem("dataTaskDone")
  ) {
    console.log(JSON.parse(localStorage.getItem("dataTask")));
    taskList = JSON.parse(localStorage.getItem("dataTask"));
    completedList = JSON.parse(localStorage.getItem("dataTaskDone")) || [];
  }
  renderTask();
});

// function init() {
//   // if (localStorage.getItem("dataTask")) {
//   //   taskList = JSON.parse(localStorage.getItem("dataTask"));
//   // }
//   renderTask();
// }

// init();
