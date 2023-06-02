let tooltips = Array.from(document.querySelectorAll(".has-tooltip"));

const createTooltips = () => {
    tooltips.forEach((tooltip) => {
        let popup = tooltip.querySelector(".tooltip");
        if (!popup) {
            popup = document.createElement("div");
            popup.textContent = this.title;
            popup.className = "tooltip";
            tooltip.appendChild(popup);
        }
    })
}

const deactivateTooltips = () => {
    const tooltips = Array.from(document.querySelectorAll(".tooltip"));
    tooltips.forEach(tooltip => {
        tooltip.classList.remove("tooltip_active");
    })
}

// сначала добавим блоки подсказок в DOM
createTooltips();

tooltips.forEach((tooltip) => {
    // уберем ссылки 
    tooltip.removeAttribute("href");
    tooltip.addEventListener("click", function() {

        // убираем подсказки, которые уже есть на странице
        deactivateTooltips();

        // выясняем где находимся и свои габариты
        let top = this.getBoundingClientRect().top;
        let left = this.getBoundingClientRect().left;
        let width = this.getBoundingClientRect().width;
        let height = this.getBoundingClientRect().height;

        // создаем блок подсказки
        let popup = this.querySelector(".tooltip");
        popup.textContent = this.title;
        popup.classList.add("tooltip_active");

        // позиция блока подсказки по умолчанию
        let popupPosition = {
            left: left + width,
            top: top
        }

        // если есть атрибут позиции - меняем дислокацию
        switch(this.dataset.position) {
            case 'left': 
                popupPosition.left = left - popup.getBoundingClientRect().width;
            break
            case 'top': 
                popupPosition.left = left + width / 2 - popup.getBoundingClientRect().width / 2; // вычисляем серединку
                popupPosition.top = top - height - 10; // дополнительно вычитаем padding
            break
            case 'bottom': 
                popupPosition.left = left + width / 2 - popup.getBoundingClientRect().width / 2;
                popupPosition.top = top + height;
            break
        }

        popup.style.left = popupPosition.left + "px";
        popup.style.top = popupPosition.top + "px";
        
        // через 3 секунды уберем подсказку
        setTimeout(()=> {
            popup.classList.remove("tooltip_active");
        }, 3000);
    })
})