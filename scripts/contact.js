function submitForm() {
    try { //control de errores
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let message = document.getElementById("message").value.trim();

        // Hacer todos los inputs del form obligatorios
        if (name === '' || email === '' || phone === '' || message === '') {
            throw new Error('Please fill in all fields.');
        }


        let formData = {
            name: name,
            email: email,
            phone: phone,
            message: message
        };

        localStorage.setItem("formData", JSON.stringify(formData));

        document.getElementById("contactForm").reset();

        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: "Your message has been sent! We'll get back to you soon.",
            confirmButtonText: 'OK',
            confirmButtonColor: '#4CAF50'
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#d63131'
        });
    } finally {
        console.log('Form submission completed.');
    }
}

// Evento click para envio del formulario
document.getElementById("submitButton").addEventListener("click", submitForm);
