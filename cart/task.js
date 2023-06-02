const products = Array.from(document.getElementsByClassName("product"));
const cartProducts = document.querySelector(".cart__products");
const cart = document.querySelector(".cart");
const storage = window.localStorage;

const deleteProduct = (elem) => {
    const product = elem.parentElement.closest(".cart__product");
    product.remove();
    saveStorage();
}

const start = () => {
    const content = localStorage.getItem("cart");
    cartProducts.innerHTML = content
    visibleCart();
    const deleteButtons = Array.from(document.querySelectorAll(".cart__product-delete"));
    deleteButtons.forEach(del => {
        del.addEventListener("click", () => {
            deleteProduct(del);
            saveStorage();
            visibleCart();
        })
    })
}

// сохраннение корзины в хранилище
const saveStorage = () => {
    localStorage.setItem("cart", cartProducts.innerHTML);
}

// выводим корзину на экран, если в ней есть хоть 1 товар
const visibleCart = () => {
    const cartProductItems = Array.from(cart.querySelectorAll(".cart__product"));
    if (cartProductItems.length > 0 && !cart.classList.contains("cart_active")) {
        cart.classList.add("cart_active");
    } else if (cartProductItems.length == 0 && cart.classList.contains("cart_active")) {
        cart.classList.remove("cart_active")
    }
}

// случайное целое число в диапазоне от 0 до max
const randomInt = (max) => {
    return Math.floor(Math.random() * max);
}

start();

products.forEach(product => {
    const addCount = product.querySelector(".product__quantity-control_inc");
    const removeCount = product.querySelector(".product__quantity-control_dec");
    const countItem = product.querySelector(".product__quantity-value");
    const buyButton = product.querySelector(".product__add");

    let count = countItem.textContent;

    addCount.addEventListener("click", () => {
        count++;
        countItem.textContent = count;
    })

    removeCount.addEventListener("click", () => {
        if (count > 1) {
            count--;
            countItem.textContent = count;
        }
    })

    buyButton.addEventListener("click", function() {
        let cartProduct;
        let cartProductItems = Array.from(cart.querySelectorAll(".cart__product"));
        const productImage = product.querySelector("img");

        let addProduct = false; // будем ли добавлять новый товар в корзину

        if (cartProductItems.length > 0) {
            let serchProduct = false; // есть ли такой товар в корзине
            cartProductItems.forEach(cartProductItem => {
                if (cartProductItem.dataset.id == product.dataset.id) { // товар есть - изменяем количество
                    cartProduct = cartProductItem;
                    cartProductCountItem = cartProduct.querySelector(".cart__product-count");
                    cartProductCount = Number(cartProductCountItem.textContent) + Number(count);
                    cartProductCountItem.textContent = cartProductCount;
                    serchProduct = true;
                } 
            }) 
            if (!serchProduct){ // товара в корзине нет - добавляем
                addProduct = true;
            }
        } else {
            addProduct = true
        }
            
        // товара в корзине нет - добавляем сам товар и его количество
        if (addProduct) {
            cartProduct = document.createElement("div");
            cartProduct.className = "cart__product";
            cartProduct.dataset.id = product.dataset.id;

            const cpImage = document.createElement("img");
            cpImage.className = "cart__product-image";
            cpImage.src = productImage.src;

            const cpCount = document.createElement("div");
            cpCount.classList = "cart__product-count";
            cpCount.textContent = count;

            const cpDelete = document.createElement("div");
            cpDelete.className = "cart__product-delete";
            cpDelete.innerHTML = "&times;";
            cpDelete.addEventListener("click", () => {
                deleteProduct(cpDelete);
            })
            
            cartProduct.append(cpImage);
            cartProduct.append(cpCount);
            cartProduct.append(cpDelete);
            cartProducts.append(cartProduct);
        }
        visibleCart();

        //анимация добавления товара
        const flyImage = document.createElement("img");
        flyImage.className = "fly_image";
        flyImage.src = productImage.src;

        // начальная позция
        let startPosition = {
            left: productImage.getBoundingClientRect().x + window.scrollX,
            top: productImage.getBoundingClientRect().y + window.scrollY,
        }

        // конечная позиция
        let finishPosition = {
            left: cartProduct.getBoundingClientRect().x + window.scrollX,
            top: cartProduct.getBoundingClientRect().y + window.scrollY,
        }

        // изображение появилось
        flyImage.style.left = startPosition.left + "px";
        flyImage.style.top = startPosition.top + "px";
        flyImage.width = productImage.width;
        flyImage.height = productImage.height;
        document.querySelector("body").appendChild(flyImage); 

        // количество шагов, за которое картинка долетит до места назначения
        const steps = 4;
        const stepData = {
            left: (finishPosition.left - startPosition.left) / steps,
            top: (finishPosition.top - startPosition.top) / steps,
        }

        const reposition = (step) => {
            if (step <= steps) {
                // заведем пару переменных, при помощи которых
                // будем делать небольшой сдвиг при каждом движении картинки к цели
                let stepPositionLeft = stepData.left * step;
                let stepPositionTop = stepData.left * step;

                // начальная и конечная позиции неизменны
                if (step !== steps && step !== 0) {
                    stepPositionLeft = randomInt(20) > 10 ? (stepData.left * step - randomInt(20)) : (stepData.left * step + randomInt(20));
                    stepPositionTop = randomInt(20) > 10 ? (stepData.top * step - randomInt(20)) : (stepData.top * step + randomInt(20));
                }
                setTimeout(() => {
                    flyImage.style.left = startPosition.left + stepPositionLeft + "px";
                    flyImage.style.top = startPosition.top + stepPositionTop + "px";
                    reposition(++step);
                }, 100)

            } else {
                flyImage.remove()
            }
        }
        // изображение полетело
        reposition(0);

        saveStorage();
    })
})