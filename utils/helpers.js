// Función para generar códigos aleatorios únicos
function generarCodigoAleatorio(prefijo = '') {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = prefijo ? prefijo + '-' : '';
    
    for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    
    return codigo;
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return null;
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
}

// Función para validar formato de email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para capitalizar texto
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Función para generar respuesta estándar
function crearRespuesta(success, message, data = null, error = null) {
    const respuesta = { success, message };
    if (data) respuesta.data = data;
    if (error) respuesta.error = error;
    return respuesta;
}

module.exports = {
    generarCodigoAleatorio,
    formatearFecha,
    validarEmail,
    capitalize,
    crearRespuesta
};
