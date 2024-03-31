let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

function submitForm(event, form) {
    event.preventDefault();
    
    // Obtener inputs
    let nameInput = form.querySelector('input[name="name"]');
    let emailInput = form.querySelector('input[name="email"]');
    let phoneInput = form.querySelector('input[name="phone"]');
    let dateInput = form.querySelector('input[name="date"]');
    let timeInput = form.querySelector('input[name="time"]');
    let numGuestsInput = form.querySelector('input[name="numGuests"]');

    // Corroborar que haya informacion
    if (!nameInput || !emailInput || !phoneInput || !dateInput || !timeInput || !numGuestsInput) {
        console.error("One or more form input elements are not found.");
        return;
    }

    // Obtener valores del formulario
    let name = nameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;
    let date = dateInput.value;
    let time = timeInput.value;
    let numGuests = numGuestsInput.value;

    // Crear objeto reservacion
    let reservation = {
        name: name,
        email: email,
        phone: phone,
        date: date,
        time: time,
        numGuests: numGuests
    };

    // Pushear la reserva al array en el localStorage
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Redirigir a la thankYouPage
    let thankYouUrl = './pages/thankyou.html';
    window.location.href = thankYouUrl + '?reservation=' + JSON.stringify(reservation);
}

// Evento submit del formulario
document.addEventListener('DOMContentLoaded', function() {
    let form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            submitForm(event, form);
        });
    }

    // Obtener informacion de reserva desde el JSON
    let urlParams = new URLSearchParams(window.location.search);
    let reservationData = urlParams.get('reservation');
    let reservation = JSON.parse(reservationData);

    // Imprimir informacion de la reserva x DOM
    if (reservation) {
        document.getElementById('name').innerText = reservation.name;
        document.getElementById('email').innerText = reservation.email;
        document.getElementById('phone').innerText = reservation.phone;
        document.getElementById('date').innerText = reservation.date;
        document.getElementById('time').innerText = reservation.time;
        document.getElementById('numGuests').innerText = reservation.numGuests;
    }

    // "Descargar" PDF (simulacion, sacado de internet)
    function downloadReservationAsPDF(reservation) {
        console.log('Downloading PDF...');
        
        // Crear PDF
        const pdf = new jsPDF();
        
        // Propiedades del PDF
        pdf.setProperties({
            title: 'Reservation Details',
            author: 'Mama PLANTA',
        });

        // Agregar contenido del PDF
        pdf.text(20, 20, 'Reservation Details:');
        pdf.text(20, 30, `Name: ${reservation.name}`);
        pdf.text(20, 40, `Email: ${reservation.email}`);
        pdf.text(20, 50, `Phone: ${reservation.phone}`);
        pdf.text(20, 60, `Date: ${reservation.date}`);
        pdf.text(20, 70, `Time: ${reservation.time}`);
        pdf.text(20, 80, `Number of Guests: ${reservation.numGuests}`);

        // Guardar PDF
        pdf.save('reservation_details.pdf');
    }

        // Ejemplo para impresion
    const myReservation = {
        name: 'Example Name',
        email: 'name@example.com',
        phone: '123-456-7890',
        date: '2024-03-20',
        time: '12:00 PM',
        numGuests: 4
    };

    downloadReservationAsPDF(myReservation);

        // Evento Click para descargar PDF (simulacion)
        let downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.addEventListener('click', downloadReservationAsPDF);
        }
    });