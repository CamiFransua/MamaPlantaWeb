document.addEventListener("DOMContentLoaded", function () {
    // Obtener el contenido del resumen del pedido y el temporizador
    const summaryContent = document.getElementById('summaryContent');
    const timerElement = document.getElementById('timer');

    // Obtener el pedido almacenado en localStorage
    const orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];

    // Mostrar el resumen del pedido
    orderItems.forEach(orderItem => {
        const itemSummary = document.createElement('div');
        itemSummary.classList.add('item-summary');
        itemSummary.innerHTML = `
            <p>Person ${orderItem.person}: ${orderItem.item.category} - ${orderItem.item.name} - $${orderItem.item.price.toFixed(2)}</p>
        `;
        summaryContent.appendChild(itemSummary);
    });

    // Calcular el precio total del pedido
    const totalPrice = orderItems.reduce((total, orderItem) => total + orderItem.item.price, 0);

    // Mostrar el precio total
    const totalPriceElement = document.createElement('div');
    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    summaryContent.appendChild(totalPriceElement);

    // Temporizador de 15 minutos
    let timeLeft = 900;
    const countdownTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerElement.textContent = `Time Remaining: ${minutes}:${seconds}`;
        if (timeLeft === 0) {
            clearInterval(countdownTimer);

            window.location.href = 'timeout.html';
        } else {
            timeLeft--;
        }
    }, 1000);
});