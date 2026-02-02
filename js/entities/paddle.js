/**
 * paddle.js
 * Entidad de la paleta
 * 
 * Responsabilidades:
 * - Almacenar estado de la paleta (posición)
 * - Actualizar posición según entrada
 * - Validar límites del canvas
 * - Gestionar puntuación
 */

class Paddle {
    constructor(config, isPlayer1 = true) {
        this.config = config;
        this.isPlayer1 = isPlayer1;
        this.score = 0;
        this.inputDirection = 0; // -1 = arriba, 0 = sin movimiento, 1 = abajo

        // Configurar posición según jugador
        if (isPlayer1) {
            this.x = config.paddle.marginFromEdge;
            this.color = config.paddle.colors.player1;
        } else {
            this.x = config.canvasWidth - config.paddle.marginFromEdge - config.paddle.width;
            this.color = config.paddle.colors.player2;
        }

        // Posición vertical centrada
        this.y = config.canvasHeight / 2 - (config.paddle.height / 2);
    }

    /**
     * Establece la dirección de movimiento
     * @param {number} direction - -1 (arriba), 0 (quieto), 1 (abajo)
     */
    setMovementDirection(direction) {
        this.inputDirection = Math.max(-1, Math.min(1, direction));
    }

    /**
     * Actualiza la posición de la paleta
     */
    update() {
        if (this.inputDirection !== 0) {
            const newY = this.y + (this.inputDirection * this.config.paddle.speed);

            // Limitar movimiento dentro del canvas
            this.y = Math.max(0, Math.min(
                newY,
                this.config.canvasHeight - this.config.paddle.height
            ));
        }
    }

    /**
     * Incrementa la puntuación
     */
    addScore() {
        this.score++;
    }

    /**
     * Reinicia la puntuación
     */
    resetScore() {
        this.score = 0;
    }

    /**
     * Obtiene la posición actual de la paleta
     */
    getPosition() {
        return {
            x: this.x,
            y: this.y,
            width: this.config.paddle.width,
            height: this.config.paddle.height
        };
    }

    /**
     * Reinicia la posición de la paleta al centro
     */
    resetPosition() {
        this.y = this.config.canvasHeight / 2 - (this.config.paddle.height / 2);
        this.inputDirection = 0;
    }
}
