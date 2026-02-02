/**
 * config.js
 * Configuración centralizada del juego
 * 
 * Esta clase contiene todos los parámetros ajustables del juego.
 * Cambiar valores aquí afecta el comportamiento general del juego.
 */

class GameConfig {
    constructor() {
        // Dimensiones del canvas
        this.canvasWidth = 800;
        this.canvasHeight = 400;

        // Configuración de la pelota
        this.ball = {
            width: 10,
            height: 10,
            initialSpeedX: 4,
            initialSpeedY: 4,
            maxSpeed: 12,
            speedIncrement: 0.05,
            color: '#00ff00'
        };

        // Configuración de las paletas
        this.paddle = {
            width: 10,
            height: 80,
            speed: 6,
            marginFromEdge: 15,
            colors: {
                player1: '#ff00ff',
                player2: '#00ffff'
            }
        };
    }

    /**
     * Valida la configuración y asegura valores válidos
     */
    validate() {
        if (this.canvasWidth <= 0 || this.canvasHeight <= 0) {
            throw new Error('Canvas dimensions must be positive');
        }
        if (this.paddle.speed <= 0) {
            throw new Error('Paddle speed must be positive');
        }
    }

    /**
     * Obtiene un objeto de configuración seguro (copia)
     */
    getConfig() {
        return JSON.parse(JSON.stringify(this));
    }
}

// Exportar instancia singleton
const gameConfig = new GameConfig();
