// Datos del mundo
const mundo = {
    nombre: "Custom Chat System",
    archivo: "CustomChatSystem.rbxl",
    descripcion: "Sistema de chat personalizado para Roblox con características avanzadas.",
    tamano: "4.2 MB",
    descargas: localStorage.getItem('descargas') ? parseInt(localStorage.getItem('descargas')) : 0,
    fecha: "2024-01-15"
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar menú
    configurarMenu();
    
    // Mostrar datos iniciales
    actualizarDatos();
    
    // Mostrar fecha actual
    mostrarFechaActual();
    
    // Mostrar sección inicial
    mostrarSeccion('inicio');
});

// Configurar menú de navegación
function configurarMenu() {
    const itemsMenu = document.querySelectorAll('.menu-item');
    
    itemsMenu.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Quitar active de todos
            itemsMenu.forEach(i => i.classList.remove('active'));
            
            // Añadir active al clickeado
            this.classList.add('active');
            
            // Obtener la sección a mostrar
            const texto = this.textContent.toLowerCase().trim();
            let seccionId = 'inicio';
            
            if (texto.includes('descargar')) seccionId = 'descargar';
            if (texto.includes('información') || texto.includes('info')) seccionId = 'info';
            
            // Mostrar la sección
            mostrarSeccion(seccionId);
        });
    });
}

// Mostrar sección específica
function mostrarSeccion(id) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(id);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
}

// Actualizar datos en la página
function actualizarDatos() {
    // Actualizar contador de descargas
    document.getElementById('contador-descargas').textContent = mundo.descargas;
    
    // Guardar en localStorage
    localStorage.setItem('descargas', mundo.descargas);
}

// Mostrar fecha actual
function mostrarFechaActual() {
    const hoy = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones);
    
    document.getElementById('fecha-actual').textContent = fechaFormateada;
}

// Función para descargar
function descargarMundo() {
    // Cambiar a sección de descarga
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.menu-item')[1].classList.add('active');
    mostrarSeccion('descargar');
    
    // Mostrar mensaje
    mostrarNotificacion('Redirigiendo a la sección de descarga...');
}

// Registrar descarga
function registrarDescarga() {
    // Aumentar contador
    mundo.descargas++;
    
    // Actualizar en la página
    actualizarDatos();
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
        mostrarNotificacion('¡Descarga iniciada! Abre el archivo con Roblox Studio.');
    }, 100);
    
    // También puedes añadir tracking aquí si quieres
    console.log(`Descarga registrada: ${mundo.nombre} - Total: ${mundo.descargas}`);
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #00adb5;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
}

// Añadir animaciones CSS para notificaciones
const estilosNotificacion = document.createElement('style');
estilosNotificacion.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(estilosNotificacion);
