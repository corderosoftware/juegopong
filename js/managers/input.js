/**
 * input.js
 * Gestor de entrada del teclado
 * 
 * Responsabilidades:
 * - Detectar pulsaciones de teclas
 * - Rastrear estado de las teclas
 * - Proporcionar métodos para consultar entrada
 */

class InputManager {
    constructor() {
        // Estado de las teclas
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            'a': false,
            'A': false,
            'z': false,
            'Z': false,
            ' ': false
        };

        this.setupListeners();
    }

    /**
     * Configura los escuchadores de eventos del teclado
     */
    setupListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }

    /**
     * Obtiene la dirección de movimiento del Jugador 1 (Flechas)
     * @returns {number} -1 (arriba), 0 (quieto), 1 (abajo)
     */
    getPlayer1Direction() {
        if (this.keys['ArrowUp']) return -1;
        if (this.keys['ArrowDown']) return 1;
        return 0;
    }

    /**
     * Obtiene la dirección de movimiento del Jugador 2 (A/Z)
     * @returns {number} -1 (arriba), 0 (quieto), 1 (abajo)
     */
    getPlayer2Direction() {
        if (this.keys['a'] || this.keys['A']) return -1;
        if (this.keys['z'] || this.keys['Z']) return 1;
        return 0;
    }

    /**
     * Verifica si se presionó la tecla de pausa (Espacio)
     * @returns {boolean}
     */
    isPausePressed() {
        return this.keys[' '];
    }

    /**
     * Limpia el estado de la tecla de pausa
     */
    clearPauseKey() {
        this.keys[' '] = false;
    }
}
