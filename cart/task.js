const products = Array.from(document.getElementsByClassName("product"));
const cartProducts = document.querySelector(".cart__products");
const cart = document.querySelector(".cart");
const storage = window.localStorage;

// массив товараов для хранилища
let productArray = [];

// удаление товара из корзины
const deleteProduct = (elem) => {
    const product = elem.parentElement.closest(".cart__product");
    //обновляем массив для хранилища
    let updatedProducts = productArray.filter(productInStorage => productInStorage.id != product.dataset.id)
    //удаляем товар из корзины
    product.remove(); 
    saveStorage(JSON.stringify(updatedProducts));
}

// функция создания товара в корзине 
const createProductDOM = (id, image, count) => {
    cartProduct = document.createElement("div");
    cartProduct.className = "cart__product";
    cartProduct.dataset.id = id;

    const cpImage = document.createElement("img");
    cpImage.className = "cart__product-image";
    cpImage.src = image;

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
    return cartProduct;
} 

const start = () => {
    const content = localStorage.getItem("cart");
    if (content !== "undefined") {
        productArray = JSON.parse(content);
        if (productArray) {
            productArray.forEach(product => {
                createProductDOM(product.id, product.image, product.count)
            })
        } else {
            productArray = [];
        }
    }
    
    // обновляем видимость корзины
    visibleCart();
}

// сохраннение корзины в хранилище
const saveStorage = (data) => {
    localStorage.setItem("cart", data);
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

    let count = Number(countItem.textContent);

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
        const productImage = product.querySelector("img");
        
        // Проверяем, есть ли в корзине выбранный товар
        let cartProduct = Array.from(cart.querySelectorAll(".cart__product")).find(pic => pic.dataset.id == product.dataset.id);

        let productObject = {
            id: product.dataset.id,
            image: productImage.src,
            count: count
        }

        // если в корзине товара нет - создаем его
        if (!cartProduct) {
            cartProduct = createProductDOM(product.dataset.id, productImage.src, count);
            productObject.count = count;
            productArray.push(productObject);
        } else { // иначе - увеличиваем количество выбранного товара
            cartProductCountItem = cartProduct.querySelector(".cart__product-count");
            cartProductCount = Number(cartProductCountItem.textContent) + Number(count);
            cartProductCountItem.textContent = cartProductCount;
            productObject.count = cartProductCount;
            productArray.find(productInStorage => productInStorage.id == product.dataset.id).count = cartProductCount;
        }

        // делаем корзину ввидимой (если до этогов ней не было товаров)
        visibleCart();
        // сохраняем корзину в хранилище
        saveStorage(JSON.stringify(productArray));

        /*
            Анимация добавления товара в корзину
        */
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
    })
})