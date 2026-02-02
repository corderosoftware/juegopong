/**
 * main.js
 * Punto de entrada del juego
 * 
 * Este archivo inicializa todos los componentes y arranca el juego
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    const config = gameConfig;
    const inputManager = new InputManager();
    const renderer = new Renderer('gameCanvas', config);
    const game = new GameManager(config, inputManager, renderer);

    // Configurar botones
    setupButtonHandlers(game, renderer);

    // Iniciar el juego
    game.start();
});

/**
 * Configura los manejadores de eventos de los botones
 * @param {GameManager} game - Instancia del gestor del juego
 * @param {Renderer} renderer - Instancia del renderizador
 */
function setupButtonHandlers(game, renderer) {
    const resetBtn = document.getElementById('resetBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            game.reset();
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            game.togglePause();
        });
    }
}
