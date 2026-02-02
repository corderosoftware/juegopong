/**
 * renderer.js
 * Gestor de renderizado
 * 
 * Responsabilidades:
 * - Dibujar en el canvas
 * - Actualizar UI (puntuación, mensajes)
 * - Gestionar animaciones visuales
 */

class Renderer {
    constructor(canvasId, config) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.config = config;
        
        // Actualizar dimensiones del canvas
        this.canvas.width = config.canvasWidth;
        this.canvas.height = config.canvasHeight;
    }

    /**
     * Dibuja el fondo del juego
     */
    drawBackground() {
        // Fondo oscuro
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);

        // Línea discontinua en el centro
        this.ctx.strokeStyle = '#333333';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.config.canvasWidth / 2, 0);
        this.ctx.lineTo(this.config.canvasWidth / 2, this.config.canvasHeight);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Bordes del canvas
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
    }

    /**
     * Dibuja la pelota
     * @param {Ball} ball - Objeto Ball con posición actual
     */
    drawBall(ball) {
        const pos = ball.getPosition();

        // Cuerpo de la pelota
        this.ctx.fillStyle = this.config.ball.color;
        this.ctx.fillRect(
            pos.x - pos.width / 2,
            pos.y - pos.height / 2,
            pos.width,
            pos.height
        );

        // Brillo alrededor de la pelota
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            pos.x - pos.width / 2,
            pos.y - pos.height / 2,
            pos.width,
            pos.height
        );
    }

    /**
     * Dibuja una paleta
     * @param {Paddle} paddle - Objeto Paddle
     */
    drawPaddle(paddle) {
        const pos = paddle.getPosition();

        // Cuerpo de la paleta
        this.ctx.fillStyle = paddle.color;
        this.ctx.fillRect(pos.x, pos.y, pos.width, pos.height);

        // Brillo de la paleta
        this.ctx.strokeStyle = paddle.color.replace(')', ', 0.7)').replace('rgb', 'rgba');
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(pos.x, pos.y, pos.width, pos.height);
    }

    /**
     * Renderiza un frame completo del juego
     * @param {Ball} ball - Objeto Ball
     * @param {Paddle} paddle1 - Paleta 1
     * @param {Paddle} paddle2 - Paleta 2
     */
    render(ball, paddle1, paddle2) {
        this.drawBackground();
        this.drawPaddle(paddle1);
        this.drawPaddle(paddle2);
        this.drawBall(ball);
    }

    /**
     * Actualiza la puntuación en la UI
     * @param {number} score1 - Puntuación del Jugador 1
     * @param {number} score2 - Puntuación del Jugador 2
     */
    updateScoreboard(score1, score2) {
        const score1Element = document.getElementById('score1');
        const score2Element = document.getElementById('score2');

        if (score1Element) score1Element.textContent = score1;
        if (score2Element) score2Element.textContent = score2;
    }

    /**
     * Muestra un mensaje de estado
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en milisegundos (0 = permanente)
     */
    showStatusMessage(message, duration = 0) {
        const statusElement = document.getElementById('statusMessage');
        if (statusElement) {
            statusElement.textContent = message;

            if (duration > 0) {
                setTimeout(() => {
                    statusElement.textContent = '';
                }, duration);
            }
        }
    }

    /**
     * Limpia el mensaje de estado
     */
    clearStatusMessage() {
        const statusElement = document.getElementById('statusMessage');
        if (statusElement) {
            statusElement.textContent = '';
        }
    }

    /**
     * Actualiza el botón de pausa
     * @param {boolean} isPaused - Si el juego está en pausa
     */
    updatePauseButton(isPaused) {
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = isPaused ? '▶️ Reanudar' : '⏸️ Pausa';
        }
    }
}
