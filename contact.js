/* ============================================================
   FORMULARIO DE CONTACTO - CÓDIGO JAVASCRIPT
   Script para manejar la validación y envío del formulario
   ============================================================ */

/**
 * Evento: Envío del formulario de contacto
 * Se dispara cuando el usuario hace clic en "Enviar Mensaje"
 */
document.getElementById('contactForm').addEventListener('submit', (event) => {
    // Prevenir el envío por defecto del formulario
    event.preventDefault();
    
    // Obtener los valores del formulario
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const category = document.getElementById('category').value;
    const message = document.getElementById('message').value.trim();
    const agreement = document.getElementById('agreement').checked;
    
    // Referencia al elemento de mensaje de estado
    const formMessage = document.getElementById('formMessage');
    
    // Validar que los campos requeridos no estén vacíos
    if (!name || !email || !subject || !message) {
        showMessage(
            '❌ Por favor, rellena todos los campos requeridos',
            'error'
        );
        return;
    }
    
    // Validar que el nombre tenga al menos 3 caracteres
    if (name.length < 3) {
        showMessage(
            '❌ El nombre debe tener al menos 3 caracteres',
            'error'
        );
        return;
    }
    
    // Validar formato de email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage(
            '❌ Por favor, ingresa un email válido',
            'error'
        );
        return;
    }
    
    // Validar que el asunto tenga al menos 5 caracteres
    if (subject.length < 5) {
        showMessage(
            '❌ El asunto debe tener al menos 5 caracteres',
            'error'
        );
        return;
    }
    
    // Validar que el mensaje tenga al menos 10 caracteres
    if (message.length < 10) {
        showMessage(
            '❌ El mensaje debe tener al menos 10 caracteres',
            'error'
        );
        return;
    }
    
    // Si hay un checkbox de acuerdo, validar que esté marcado (opcional)
    // En este caso, no es requerido, pero puedes uncommentar si lo deseas
    // if (!agreement) {
    //     showMessage('❌ Debes aceptar los términos para enviar el mensaje', 'error');
    //     return;
    // }
    
    // Preparar los datos del formulario
    const formData = {
        name: name,
        email: email,
        subject: subject,
        category: category || 'no especificado',
        message: message,
        agreement: agreement,
        timestamp: new Date().toLocaleString('es-ES')
    };
    
    // Registrar los datos en la consola (en producción, esto se enviaría a un servidor)
    console.log('📨 Formulario de contacto enviado:', formData);
    
    // Simular envío a servidor (aquí podrías hacer fetch a un backend)
    // Mostrar mensaje de éxito
    showMessage(
        '✅ ¡Mensaje enviado exitosamente! Gracias por tu contacto. Nos pondremos en contacto pronto.',
        'success'
    );
    
    // Limpiar el formulario
    document.getElementById('contactForm').reset();
    
    // Limpiar el mensaje de éxito después de 5 segundos
    setTimeout(() => {
        document.getElementById('formMessage').style.display = 'none';
    }, 5000);
});

/**
 * Función auxiliar para mostrar mensajes de éxito o error
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de mensaje ('success' o 'error')
 */
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.classList.add(type);
    formMessage.classList.remove(type === 'success' ? 'error' : 'success');
    formMessage.style.display = 'block';
}