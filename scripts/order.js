//No me anda Toastify. Carga pero me sale una alerta de reemplazar el style{background} por style.background, al hacerlo de todas formas no carga, agregue alerts de libreria externa para compensar

document.addEventListener("DOMContentLoaded", function () {
    try {
        Toastify({
            text: "Initialized Toastify",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "bottom",
            position: 'center',
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)" //Esto no anda, no encontré la solución en internet
            },
            stopOnFocus: true,
        }).showToast();
    } catch (error) {
        console.error('An error occurred while initializing Toastify:', error);
    } finally {
        console.log('Toastify initialization completed.');
    }

    let menuItems;

    // Cargar los datos del menú desde el archivo JSON
    async function loadMenuItems() {
        try {
            const response = await fetch('../JSON/menuItems.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading menu items:', error);
        }
    }

    // Cargar los datos del menú al cargar la página
    loadMenuItems()
        .then(data => {
            menuItems = data;
            console.log('Menu items loaded successfully:', menuItems);
            const peopleForm = document.getElementById('peopleForm');
            const orderContainer = document.getElementById('orderContainer');
            const finishOrderButton = document.createElement('button');
            finishOrderButton.textContent = 'Finish Order';
            finishOrderButton.id = 'order';
            finishOrderButton.style.display = 'none';
            const summaryContent = document.createElement('div');
            summaryContent.id = 'summaryContent';
            const totalAmountSpan = document.createElement('span');
            totalAmountSpan.id = 'totalAmount';
            let numPeople = 0;
            let orderItems = [];

            //Evento submit para la cantidad de personas
            peopleForm.addEventListener('submit', function (event) {
                event.preventDefault();
                numPeople = parseInt(document.getElementById('numPeople').value);
                if (numPeople >= 1 && numPeople <= 4) {
                    displayOrderOptions();
                } else {
                    alert('Our tables are prepared for up to 4 customers. Please enter a number between 1 and 4.');
                }
            });


    //Mostrar las categorías de menú
    function displayOrderOptions() {
        peopleForm.style.display = 'none';
        orderContainer.style.display = 'block';
        finishOrderButton.style.display = 'block';

        for (let i = 1; i <= numPeople; i++) {
            const personMenu = document.createElement('div');
            const personMenuId = `personMenu-${i}`;
            personMenu.id = personMenuId;
            personMenu.classList.add('person-menu');
            personMenu.innerHTML = `<h2>Person ${i}: What do you wanna order?</h2>`;
            const categories = [
                { name: 'Anti Pasti', imageSrc: '../images/menu-antipasti.jpg' },
                { name: 'Pasta', imageSrc: '../images/menu-pasta.jpg' },
                { name: 'Sauce', imageSrc: '../images/menu-sauces.jpg' },
                { name: 'Cold Drink', imageSrc: '../images/menu-cold-drinks.jpg' },
                { name: 'Dessert', imageSrc: '../images/menu-dolce.jpg' },
                { name: 'Hot Drink', imageSrc: '../images/menu-hot-brevages.jpg' }
            ];
            categories.forEach(category => {
                const categoryButton = document.createElement('button');
                categoryButton.innerHTML = `
                    <img src="${category.imageSrc}" alt="${category.name}">
                    <br>
                    ${category.name}
                `;
                categoryButton.addEventListener('click', function () {
                    displayCategoryMenu(category.name, i);
                });
                personMenu.appendChild(categoryButton);
            });
            orderContainer.appendChild(personMenu);
        }
        const clearCartButton = document.createElement('button');
        clearCartButton.textContent = 'Clear Cart';
        clearCartButton.id = 'clearCartButton';
        clearCartButton.addEventListener('click', function () {
            clearCart();
            updateSummary();
        });
        orderContainer.appendChild(clearCartButton);
    }


    //Desplegar las opciones de menú por categoría
    function displayCategoryMenu(category, personNumber) {
        const categoryMenu = document.createElement('div');
        categoryMenu.classList.add('category-menu');

        const itemsContainerId = `items-container-${personNumber}-${category}`;
        const existingItemsContainer = document.getElementById(itemsContainerId);
        if (existingItemsContainer) {
            existingItemsContainer.remove();
        } else {
            const itemsContainer = document.createElement('div');
            itemsContainer.id = itemsContainerId;
            itemsContainer.classList.add('items-container');

            const categoryItems = menuItems.filter(item => item.category === category);
            categoryItems.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add('item-card');
                itemCard.innerHTML = `
                    <img src="${item.imageSrc}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>${item.ingredients}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                `;
                const addButton = document.createElement('button');
                addButton.textContent = 'Add to Order';
                addButton.addEventListener('click', () => {
                    addToOrder(item, personNumber);
                    updateSummary();
                });
                itemCard.appendChild(addButton);
                itemsContainer.appendChild(itemCard);
            });

            categoryMenu.appendChild(itemsContainer);

            const personMenu = document.querySelector(`.person-menu:nth-of-type(${personNumber})`);
            personMenu.appendChild(categoryMenu);

            const categoryTitle = personMenu.querySelector(`.category-menu h3`);
            if (categoryTitle) {
                categoryTitle.style.display = 'none';
            }
        }
    }


    // Agregar al pedido
    function addToOrder(item, personNumber) {
        const itemSummary = document.createElement('div');
        itemSummary.classList.add('item-summary');
        itemSummary.innerHTML = `
            <p>Person ${personNumber}: ${item.category} - ${item.name} - $${item.price.toFixed(2)}</p>
        `;
        summaryContent.appendChild(itemSummary);
        calculateTotal();

        const orderItem = { item, person: personNumber };
        orderItems.push(orderItem);

        // Guardar el pedido en el localStorage
        localStorage.setItem('orderItems', JSON.stringify(orderItems));

        // Mostrar un toast indicando que se ha agregado un elemento al pedido
        Toastify({
            text: `Added ${item.name} to your order!`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "bottom",
            position: 'center',
            style: {
                background: "#4CAF50" //Esto no anda, no encontré la solución en internet x2
            },
            stopOnFocus: true,
        }).showToast();
    }
    


    //Actualizar el resumen parcial
    function updateSummary() {
        summaryContent.innerHTML = '';

        orderItems.forEach(orderItem => {
            const itemSummary = document.createElement('div');
            itemSummary.classList.add('item-summary');
            itemSummary.innerHTML = `
                <p>Person ${orderItem.person}: ${orderItem.item.category} - ${orderItem.item.name} - $${orderItem.item.price.toFixed(2)}</p>
            `;
            summaryContent.appendChild(itemSummary);
        });

        calculateTotal();
    }


    //Calcular el precio total
    function calculateTotal() {
        let total = 0;
        orderItems.forEach(orderItem => {
            total += orderItem.item.price;
        });
        totalAmountSpan.textContent = `$${total.toFixed(2)}`;
    }


    //Vaciar carrito
    function clearCart() {
        orderItems = [];
        localStorage.removeItem('orderItems');
    }

    //Evento submit para completar la orden
    finishOrderButton.addEventListener('click', function () {
        if (orderItems.length > 0) {
            window.location.href = 'finishorder.html';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Empty Cart',
                text: 'Your cart is empty. Please add items before finishing your order.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#4CAF50'
            });
        }
    });


    document.body.appendChild(summaryContent);
    document.body.appendChild(totalAmountSpan);
    document.body.appendChild(finishOrderButton);
    });
});
