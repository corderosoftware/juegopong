/**
 * game.js
 * Gestor principal del juego
 * 
 * Responsabilidades:
 * - Orquestar la lógica del juego
 * - Manejar el bucle principal
 * - Gestionar estado del juego (pausa, reinicio)
 * - Coordinar actualizaciones entre componentes
 */

class GameManager {
    constructor(config, inputManager, renderer) {
        this.config = config;
        this.inputManager = inputManager;
        this.renderer = renderer;

        // Crear entidades del juego
        this.ball = new Ball(config);
        this.paddle1 = new Paddle(config, true);
        this.paddle2 = new Paddle(config, false);

        // Estado del juego
        this.isRunning = true;
        this.isPaused = false;
        this.lastPauseKeyState = false;

        // Estadísticas
        this.frameCount = 0;
    }

    /**
     * Alterna el estado de pausa del juego
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        this.renderer.updatePauseButton(this.isPaused);

        if (this.isPaused) {
            this.renderer.showStatusMessage('⏸️ JUEGO EN PAUSA');
        } else {
            this.renderer.clearStatusMessage();
        }
    }

    /**
     * Reinicia el juego completamente
     */
    reset() {
        this.ball.reset();
        this.paddle1.resetScore();
        this.paddle2.resetScore();
        this.paddle1.resetPosition();
        this.paddle2.resetPosition();

        this.renderer.updateScoreboard(0, 0);
        this.renderer.showStatusMessage('🎮 Juego reiniciado', 2000);

        if (this.isPaused) {
            this.togglePause();
        }

        this.isRunning = true;
    }

    /**
     * Actualiza la lógica del juego
     */
    update() {
        if (!this.isRunning || this.isPaused) {
            return;
        }

        // Actualizar entrada
        const dir1 = this.inputManager.getPlayer1Direction();
        const dir2 = this.inputManager.getPlayer2Direction();

        this.paddle1.setMovementDirection(dir1);
        this.paddle2.setMovementDirection(dir2);

        // Actualizar entidades
        this.paddle1.update();
        this.paddle2.update();

        const ballEvents = this.ball.update();

        // Manejar colisiones
        this.ball.collideWithPaddle(this.paddle1);
        this.ball.collideWithPaddle(this.paddle2);

        // Manejar eventos de la pelota
        if (ballEvents.scored === 'player1') {
            this.paddle1.addScore();
            this.renderer.updateScoreboard(this.paddle1.score, this.paddle2.score);
        } else if (ballEvents.scored === 'player2') {
            this.paddle2.addScore();
            this.renderer.updateScoreboard(this.paddle1.score, this.paddle2.score);
        }

        // Detectar pausa (con debounce para evitar múltiples toggles)
        const pausePressed = this.inputManager.isPausePressed();
        if (pausePressed && !this.lastPauseKeyState) {
            this.togglePause();
        }
        this.lastPauseKeyState = pausePressed;

        this.frameCount++;
    }

    /**
     * Renderiza el juego
     */
    render() {
        this.renderer.render(this.ball, this.paddle1, this.paddle2);
    }

    /**
     * Bucle principal del juego
     */
    gameLoop() {
        this.update();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Inicia el juego
     */
    start() {
        console.log('🎮 Juego de Pong iniciado');
        console.log('Jugador 1 (Izquierda): Flechas arriba/abajo');
        console.log('Jugador 2 (Derecha): Teclas A (arriba) y Z (abajo)');
        console.log('Presiona ESPACIO para pausar/reanudar');

        this.gameLoop();
    }

    /**
     * Obtiene las estadísticas del juego
     */
    getStats() {
        return {
            frameCount: this.frameCount,
            player1Score: this.paddle1.score,
            player2Score: this.paddle2.score,
            ballVelocity: this.ball.getVelocity(),
            isPaused: this.isPaused
        };
    }
}
