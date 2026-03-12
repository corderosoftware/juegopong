/* ============================================================
   JUEGO DE PONG - CÓDIGO JAVASCRIPT
   Implementación completa de un juego Pong con dos jugadores
   ============================================================ */

/* ============================================================
   VARIABLES GLOBALES - CONFIGURACIÓN DEL JUEGO
   ============================================================ */

// Obtener referencia al elemento canvas (área de dibujo)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Objeto para almacenar el estado de las teclas presionadas
const keys = {};

// Variable para controlar si el juego está en ejecución
let gameRunning = false;

// Puntuación máxima para ganar
const MAX_SCORE = 11;

/* ============================================================
   CONFIGURACIÓN DE LA PELOTA
   ============================================================ */

// Objeto que representa la pelota del juego
const ball = {
    // Propiedades iniciales
    x: canvas.width / 2,              // Posición X (centro del canvas)
    y: canvas.height / 2,             // Posición Y (centro del canvas)
    radius: 8,                        // Radio de la pelota
    speedX: 5,                        // Velocidad en eje X
    speedY: 5,                        // Velocidad en eje Y
    maxSpeed: 8,                      // Velocidad máxima permitida
    
    // Método para reiniciar la posición de la pelota
    reset: function() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        // Dirección aleatoria al reiniciar
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.speedY = (Math.random() > 0.5 ? 1 : -1) * 5;
    },
    
    // Método para dibujar la pelota en el canvas
    draw: function() {
        ctx.fillStyle = '#00d4ff';     // Color cyan
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Método para actualizar la posición de la pelota
    update: function() {
        // Actualizar posición basada en velocidad
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Colisión con los bordes superior e inferior
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            // Invertir velocidad Y y ajustar posición para evitar salida
            this.speedY = -this.speedY;
            this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        }
        
        // Detectar si la pelota salió por los lados (gol)
        if (this.x - this.radius < 0) {
            // Gol para el jugador 2 (derecha)
            player2.score++;
            this.reset();
            updateScoreboard();
            checkGameOver();
        } else if (this.x + this.radius > canvas.width) {
            // Gol para el jugador 1 (izquierda)
            player1.score++;
            this.reset();
            updateScoreboard();
            checkGameOver();
        }
    }
};

/* ============================================================
   CONFIGURACIÓN DE LOS JUGADORES
   ============================================================ */

// Objeto que representa un jugador (paleta)
function createPlayer(x, color, keyUp, keyDown) {
    return {
        // Propiedades del jugador
        x: x,                         // Posición X
        y: canvas.height / 2 - 50,    // Posición Y (centrado verticalmente)
        width: 15,                    // Ancho de la paleta
        height: 100,                  // Alto de la paleta
        speed: 6,                     // Velocidad de movimiento
        color: color,                 // Color de la paleta
        keyUp: keyUp,                 // Tecla para subir
        keyDown: keyDown,             // Tecla para bajar
        score: 0,                     // Puntuación del jugador
        
        // Método para dibujar la paleta en el canvas
        draw: function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        
        // Método para actualizar la posición del jugador
        update: function() {
            // Movimiento hacia arriba
            if (keys[this.keyUp] && this.y > 0) {
                this.y -= this.speed;
            }
            
            // Movimiento hacia abajo
            if (keys[this.keyDown] && this.y < canvas.height - this.height) {
                this.y += this.speed;
            }
        }
    };
}

// Crear los dos jugadores
// Jugador 1: Izquierda, color azul, teclas de cursor (ArrowUp/ArrowDown)
const player1 = createPlayer(20, '#0066ff', 'ArrowUp', 'ArrowDown');

// Jugador 2: Derecha, color rojo, teclas A/Z
const player2 = createPlayer(canvas.width - 35, '#ff3333', 'a', 'z');

/* ============================================================
   DETECCIÓN DE COLISIONES PELOTA-PALETA
   ============================================================ */

/**
 * Función para detectar colisión entre la pelota y una paleta
 * @param {Object} player - El objeto jugador (paleta)
 * @returns {boolean} true si hay colisión, false en caso contrario
 */
function checkCollision(player) {
    // Verificar si la pelota entra en el rectángulo de la paleta
    return (ball.x - ball.radius < player.x + player.width &&
            ball.x + ball.radius > player.x &&
            ball.y - ball.radius < player.y + player.height &&
            ball.y + ball.radius > player.y);
}

/**
 * Función para manejar la colisión pelota-paleta
 * @param {Object} player - El objeto jugador (paleta)
 */
function handlePaddleCollision(player) {
    // Invertir velocidad X (cambiar dirección horizontal)
    ball.speedX = -ball.speedX;
    
    // Ajustar posición para evitar que la pelota se quede atrapada
    if (player === player1) {
        ball.x = player.x + player.width + ball.radius;
    } else {
        ball.x = player.x - ball.radius;
    }
    
    // Calcular ángulo de rebote basado en dónde golpea la paleta
    // Si golpea la parte superior, ángulo más pronunciado hacia arriba
    // Si golpea la parte inferior, ángulo más pronunciado hacia abajo
    const collidePoint = ball.y - (player.y + player.height / 2);
    const collidePointNormalized = collidePoint / (player.height / 2);
    const angleRad = collidePointNormalized * (Math.PI / 4); // 45 grados máximo
    
    // Calcular la magnitud de la velocidad
    const speed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
    
    // Aplicar nueva velocidad con el ángulo calculado
    ball.speedY = speed * Math.sin(angleRad);
    
    // Aumentar levemente la velocidad con cada rebote (máximo permitido)
    const currentSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
    if (currentSpeed < ball.maxSpeed) {
        ball.speedX *= 1.05; // Aumento del 5%
    }
}

/* ============================================================
   FUNCIONES DE CONTROL DEL JUEGO
   ============================================================ */

/**
 * Función para actualizar el marcador en la pantalla
 */
function updateScoreboard() {
    document.getElementById('player1Score').textContent = player1.score;
    document.getElementById('player2Score').textContent = player2.score;
}

/**
 * Función para verificar si el juego ha terminado (alguien alcanzó MAX_SCORE)
 */
function checkGameOver() {
    const statusDiv = document.getElementById('statusMessage');
    
    if (player1.score >= MAX_SCORE) {
        gameRunning = false;
        statusDiv.textContent = '¡Jugador 1 gana! Presiona Reiniciar para jugar de nuevo';
        statusDiv.style.color = '#0066ff';
    } else if (player2.score >= MAX_SCORE) {
        gameRunning = false;
        statusDiv.textContent = '¡Jugador 2 gana! Presiona Reiniciar para jugar de nuevo';
        statusDiv.style.color = '#ff3333';
    }
}

/**
 * Función principal de actualización del juego
 * Se ejecuta en cada frame (fotograma) del juego
 */
function update() {
    if (gameRunning) {
        // Actualizar posiciones de jugadores y pelota
        player1.update();
        player2.update();
        ball.update();
        
        // Detectar colisiones con las paletas
        if (checkCollision(player1)) {
            handlePaddleCollision(player1);
        }
        if (checkCollision(player2)) {
            handlePaddleCollision(player2);
        }
    }
}

/**
 * Función principal de dibujo del juego
 * Se ejecuta en cada frame y dibuja todos los elementos
 */
function draw() {
    // Limpiar el canvas con color negro
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar línea punteada en el centro del canvas
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Dibujar todos los elementos del juego
    player1.draw();
    player2.draw();
    ball.draw();
}

/**
 * Función del bucle principal del juego (Game Loop)
 * Se ejecuta repetidamente para animar el juego
 */
function gameLoop() {
    update();   // Actualizar posiciones y lógica
    draw();     // Dibujar todos los elementos
    requestAnimationFrame(gameLoop); // Programar siguiente frame
}

/* ============================================================
   MANEJO DE EVENTOS DE TECLADO
   ============================================================ */

/**
 * Evento: Tecla presionada
 * Se dispara cuando el usuario presiona una tecla
 */
document.addEventListener('keydown', (event) => {
    // Convertir tecla a minúsculas para detectar 'a' y 'z'
    const key = event.key.toLowerCase();
    keys[key] = true;
    keys[event.key] = true; // También registrar la tecla original
    
    // Iniciar juego con ESPACIO
    if (event.key === ' ') {
        event.preventDefault(); // Evitar scroll de la página
        if (!gameRunning && player1.score < MAX_SCORE && player2.score < MAX_SCORE) {
            gameRunning = true;
            document.getElementById('statusMessage').textContent = '¡Juego en progreso!';
            document.getElementById('statusMessage').style.color = '#00d4ff';
        }
    }
});

/**
 * Evento: Tecla liberada
 * Se dispara cuando el usuario suelta una tecla
 */
document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    keys[key] = false;
    keys[event.key] = false; // También desregistrar la tecla original
});

/* ============================================================
   MANEJO DE BOTONES
   ============================================================ */

/**
 * Botón: Iniciar Juego
 * Inicia una nueva partida
 */
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameRunning && player1.score < MAX_SCORE && player2.score < MAX_SCORE) {
        gameRunning = true;
        document.getElementById('statusMessage').textContent = '¡Juego en progreso!';
        document.getElementById('statusMessage').style.color = '#00d4ff';
    }
});

/**
 * Botón: Reiniciar Marcador
 * Reinicia completamente el juego (puntuaciones y posiciones)
 */
document.getElementById('resetBtn').addEventListener('click', () => {
    // Resetear puntuaciones
    player1.score = 0;
    player2.score = 0;
    
    // Resetear posiciones
    player1.y = canvas.height / 2 - 50;
    player2.y = canvas.height / 2 - 50;
    ball.reset();
    
    // Resetear estado del juego
    gameRunning = false;
    updateScoreboard();
    
    // Actualizar mensaje de estado
    document.getElementById('statusMessage').textContent = 'Presiona ESPACIO para comenzar';
    document.getElementById('statusMessage').style.color = '#00d4ff';
});

/* ============================================================
   INICIALIZACIÓN DEL JUEGO
   ============================================================ */

/**
 * Función de inicialización
 * Se ejecuta cuando la página carga completamente
 */
function init() {
    // Actualizar marcador inicial
    updateScoreboard();
    
    // Iniciar el bucle principal del juego
    gameLoop();
}

// Esperar a que el DOM esté completamente cargado antes de inicializar
document.addEventListener('DOMContentLoaded', init);

// Alternativa: si el script se carga al final del HTML, inicio directo
// init();