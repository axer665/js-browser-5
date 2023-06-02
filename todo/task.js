const form = document.getElementById("tasks__form");
const taskName = document.getElementById("task__input");
const takList = document.getElementById("tasks__list");
const storage = window.localStorage;

/*
    При загрузке страницы добавляем все задачи, которые есть в хранилище
    и убираем у них иконку "удалить"... она все равно не работает =) (по условию задачи)
*/
let start = () => {
    const content = localStorage.getItem("tasks");
    takList.innerHTML = content
    const deleteItems = Array.from(document.querySelectorAll(".task__remove"));
    deleteItems.forEach(item => {
        item.remove();
    });
}

const saveStorage = () => {
    localStorage.setItem("tasks", takList.innerHTML);
}

start();

form.addEventListener("submit", function(e) {
    // никуда не переходим
    e.preventDefault();

    // очищаем хранилище
    storage.clear();

    // если пользователь ввел название задачи - начинаем действо
    if (taskName.value != "") {
        const task = document.createElement("div");
        task.className = "task";
        const taksTitle = document.createElement("div");
        taksTitle.className = "task__title";
        taksTitle.textContent = taskName.value;
        const taskLink = document.createElement("a");
        taskLink.className = "task__remove";
        taskLink.href = "#";
        taskLink.innerHTML = "&times;";

        taskLink.addEventListener("click", function() {
            this.removeAttribute("href");
            task.remove();
            saveStorage();
        });

        task.appendChild(taksTitle);
        task.appendChild(taskLink);
        takList.appendChild(task);

        // после действа очищаем поле ввода для новой задачи
        taskName.value = "";

        saveStorage();
    }
})