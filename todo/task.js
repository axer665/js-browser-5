const form = document.getElementById("tasks__form");
const taskName = document.getElementById("task__input");
const takList = document.getElementById("tasks__list");
const storage = window.localStorage;
// массив задач для хранилища
let tasksInStorage = [];

/*
    При загрузке страницы добавляем все задачи, которые есть в хранилище
    и убираем у них иконку "удалить"... она все равно не работает =) (по условию задачи)
*/
let start = () => {
    const content = localStorage.getItem("tasks");
    console.log(content);
    tasksInStorage = content ? JSON.parse(content) : [];

    console.log(tasksInStorage);

    // создаем задачи из того, что есть в хранилище
    if (tasksInStorage.length > 0){
        tasksInStorage.forEach(task => {
            createTaskDOM(task, false);
        });
    } 
}

// обновление хранилища
const updateStorage = (command, task) => {
    switch (command) {
        case "add" :
            tasksInStorage.push(task);
            break;
        case "remove" :
            tasksInStorage.splice(tasksInStorage.indexOf(task), 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasksInStorage));
}

const createTaskDOM = (taskValue, taskDelete=true) => {
    const task = document.createElement("div");
    task.className = "task";
    const taksTitle = document.createElement("div");
    taksTitle.className = "task__title";
    taksTitle.textContent = taskValue;
    task.appendChild(taksTitle);
    takList.appendChild(task);
    // Добавляем (или не добавляем) кнопку удаления задачи
    if (taskDelete === true) { 
        const taskLink = document.createElement("a");
        taskLink.className = "task__remove";
        taskLink.href = "#";
        taskLink.innerHTML = "&times;";
        taskLink.addEventListener("click", function() {
            this.removeAttribute("href");
            updateStorage("remove", taskValue)
            task.remove();
        });
        task.appendChild(taskLink);
    }
}

start();

form.addEventListener("submit", function(e) {
    // никуда не переходим
    e.preventDefault();
    // если пользователь ввел название - создаем задачу в списке
    if (taskName.value.trim() != "") {
        createTaskDOM(taskName.value);
    }
    // Добавляем задачу в хранилище
    updateStorage("add", taskName.value);
    // очищаем поле ввода для новой задачи
    taskName.value = "";
})