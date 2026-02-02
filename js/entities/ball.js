/**
 * ball.js
 * Entidad de la pelota
 * 
 * Responsabilidades:
 * - Almacenar estado de la pelota (posición, velocidad)
 * - Actualizar posición basada en velocidad
 * - Manejar rebotes en bordes
 * - Manejar colisiones con paletas
 * - Resetear la pelota
 */

class Ball {
    constructor(config) {
        this.config = config;
        this.reset();
    }

    /**
     * Resetea la pelota a posición inicial con velocidad aleatoria
     */
    reset() {
        this.x = this.config.canvasWidth / 2;
        this.y = this.config.canvasHeight / 2;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * this.config.ball.initialSpeedX;
        this.speedY = (Math.random() > 0.5 ? 1 : -1) * this.config.ball.initialSpeedY;
    }

    /**
     * Actualiza la posición de la pelota
     * @returns {Object} Objeto con información de eventos (punto anotado, etc.)
     */
    update() {
        const events = {
            scored: null,  // 'player1' o 'player2' si hay punto
            bounced: false
        };

        // Aplicar velocidad
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote en borde superior
        if (this.y - this.config.ball.height / 2 < 0) {
            this.y = this.config.ball.height / 2;
            this.speedY = -this.speedY;
            events.bounced = true;
        }

        // Rebote en borde inferior
        if (this.y + this.config.ball.height / 2 > this.config.canvasHeight) {
            this.y = this.config.canvasHeight - this.config.ball.height / 2;
            this.speedY = -this.speedY;
            events.bounced = true;
        }

        // Punto para Jugador 2 (pelota sale por la izquierda)
        if (this.x < 0) {
            events.scored = 'player2';
            this.reset();
        }

        // Punto para Jugador 1 (pelota sale por la derecha)
        if (this.x > this.config.canvasWidth) {
            events.scored = 'player1';
            this.reset();
        }

        return events;
    }

    /**
     * Maneja colisión con una paleta
     * @param {Paddle} paddle - La paleta con la que colisiona
     */
    collideWithPaddle(paddle) {
        // Verificar si la pelota está dentro de los límites de la paleta
        const ballLeft = this.x - this.config.ball.width / 2;
        const ballRight = this.x + this.config.ball.width / 2;
        const ballTop = this.y - this.config.ball.height / 2;
        const ballBottom = this.y + this.config.ball.height / 2;

        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + paddle.width;
        const paddleTop = paddle.y;
        const paddleBottom = paddle.y + paddle.height;

        // Verificar colisión AABB (Axis-Aligned Bounding Box)
        if (ballLeft < paddleRight &&
            ballRight > paddleLeft &&
            ballTop < paddleBottom &&
            ballBottom > paddleTop) {

            // Invertir dirección horizontal
            this.speedX = -this.speedX;

            // Ajustar posición para evitar penetración
            if (this.speedX > 0) {
                this.x = paddleLeft - this.config.ball.width / 2;
            } else {
                this.x = paddleRight + this.config.ball.width / 2;
            }

            // Agregar spin basado en dónde golpea la pelota
            const paddleCenter = paddle.y + paddle.height / 2;
            const collisionPoint = this.y - paddleCenter;
            const normalizedCollision = collisionPoint / (paddle.height / 2);
            this.speedY = normalizedCollision * this.config.ball.initialSpeedY;

            // Aumentar velocidad gradualmente (sin exceder máximo)
            if (Math.abs(this.speedX) < this.config.ball.maxSpeed) {
                this.speedX += (this.speedX > 0 ? 1 : -1) * this.config.ball.speedIncrement;
            }

            return true;
        }

        return false;
    }

    /**
     * Obtiene la posición actual de la pelota
     */
    getPosition() {
        return {
            x: this.x,
            y: this.y,
            width: this.config.ball.width,
            height: this.config.ball.height
        };
    }

    /**
     * Obtiene la velocidad actual
     */
    getVelocity() {
        return {
            x: this.speedX,
            y: this.speedY,
            speed: Math.sqrt(this.speedX ** 2 + this.speedY ** 2)
        };
    }
}
