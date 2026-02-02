# 🏗️ ARQUITECTURA DEL PROYECTO REFACTORIZADO

## Diagrama de Dependencias

```
index-refactored.html
│
├─── css/styles.css
├─── css/game.css
│
└─── js/ (scripts en orden)
     ├─── config.js (GameConfig)
     │    │
     │    ├─── ball.js (Ball)
     │    │    └─ Accede a: gameConfig
     │    │
     │    ├─── entities/paddle.js (Paddle)
     │    │    └─ Accede a: gameConfig
     │    │
     │    ├─── managers/input.js (InputManager)
     │    │    └─ Escucha: eventos teclado
     │    │
     │    ├─── managers/renderer.js (Renderer)
     │    │    └─ Accede a: canvas, DOM
     │    │
     │    ├─── managers/game.js (GameManager)
     │    │    ├─ Orquesta: Ball, Paddle, InputManager, Renderer
     │    │    └─ Ejecuta: Game Loop
     │    │
     │    └─── main.js (Inicializador)
     │         └─ Crea: instancias y comienza game.start()
     │
     └─── Botones HTML
          ├─ resetBtn → game.reset()
          └─ pauseBtn → game.togglePause()
```

---

## Flujo de Ejecución

```
1. Navegador carga index-refactored.html
   └─> Se cargan CSS y scripts en orden

2. document.addEventListener('DOMContentLoaded')
   └─> Se ejecuta main.js
       ├─ new GameConfig()
       ├─ new InputManager()
       ├─ new Renderer('gameCanvas', config)
       ├─ new GameManager(config, input, renderer)
       └─ game.start()

3. game.start()
   └─> requestAnimationFrame(gameLoop)

4. En cada frame:
   ┌─────────────────────────────────┐
   │ gameLoop()                      │
   ├─────────────────────────────────┤
   │ 1. update()                     │
   │    ├─ inputManager.getDirections()
   │    ├─ paddle1.update()          │
   │    ├─ paddle2.update()          │
   │    ├─ ball.update()             │
   │    ├─ ball.collideWithPaddle()  │
   │    └─ Actualizar puntuación     │
   │                                  │
   │ 2. render()                     │
   │    ├─ renderer.drawBackground() │
   │    ├─ renderer.drawPaddle(p1)   │
   │    ├─ renderer.drawPaddle(p2)   │
   │    └─ renderer.drawBall()       │
   │                                  │
   │ 3. requestAnimationFrame()      │
   │    (siguiente frame)             │
   └─────────────────────────────────┘

5. Bucle continúa a 60 FPS
```

---

## Responsabilidades por Clase

```
┌─────────────────────────────────────────────────────────────┐
│                     GameConfig                              │
├─────────────────────────────────────────────────────────────┤
│ • Almacena parámetros del juego                             │
│ • Ancho/alto canvas                                         │
│ • Velocidad pelota                                          │
│ • Tamaño/velocidad paletas                                  │
│                                                              │
│ SIN: Lógica, renderizado, entrada                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Ball                                 │
├─────────────────────────────────────────────────────────────┤
│ • Posición (x, y)                                           │
│ • Velocidad (speedX, speedY)                                │
│ • update() - Mover y detectar rebotes/puntos                │
│ • collideWithPaddle() - Detectar colisiones                 │
│ • reset() - Volver al centro                                │
│                                                              │
│ ACCEDE A: gameConfig                                        │
│ NO SABE: Quién la renderiza, quién la controla             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Paddle                                │
├─────────────────────────────────────────────────────────────┤
│ • Posición (x, y)                                           │
│ • Puntuación                                                │
│ • Dirección de movimiento                                   │
│ • update() - Mover paleta                                   │
│ • addScore() / resetScore()                                 │
│ • setMovementDirection()                                    │
│                                                              │
│ ACCEDE A: gameConfig                                        │
│ NO SABE: Cómo se renderiza, entrada del usuario            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    InputManager                             │
├─────────────────────────────────────────────────────────────┤
│ • Escucha eventos de teclado                                │
│ • getPlayer1Direction()                                     │
│ • getPlayer2Direction()                                     │
│ • isPausePressed()                                          │
│                                                              │
│ RESPONSABLE DE: Entrada del usuario                         │
│ NO SABE: Lógica del juego, renderizado                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Renderer                               │
├─────────────────────────────────────────────────────────────┤
│ • Canvas y contexto 2D                                      │
│ • render() - Dibujar frame completo                         │
│ • drawBackground() / drawBall() / drawPaddle()              │
│ • updateScoreboard() - Actualizar UI                        │
│ • showStatusMessage() - Mostrar mensajes                    │
│                                                              │
│ RESPONSABLE DE: Visualización y UI                          │
│ NO SABE: Lógica del juego, entrada del usuario             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   GameManager                               │
├─────────────────────────────────────────────────────────────┤
│ • ORQUESTA TODO                                             │
│ • Contiene: Ball, Paddle1, Paddle2                          │
│ • update() - Coordinador de actualizaciones                 │
│ • render() - Coordinador de renderizado                     │
│ • togglePause() / reset() - Control del juego               │
│ • gameLoop() - Bucle principal                              │
│                                                              │
│ CONECTA: input → game logic → renderer                      │
│ ES EL CENTRO: Todo pasa por aquí                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       main.js                               │
├─────────────────────────────────────────────────────────────┤
│ • Inicializa todos los componentes                          │
│ • Conecta botones HTML a funciones de juego                 │
│ • Inicia el bucle del juego                                 │
│                                                              │
│ PUNTO DE ENTRADA: Aquí empieza todo                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

```
ENTRADA (INPUT)
     │
     ├─> InputManager.getPlayer1Direction()
     ├─> InputManager.getPlayer2Direction()
     │
     └─> GameManager.update()
         │
         ├─> paddle1.setMovementDirection()
         ├─> paddle2.setMovementDirection()
         │
         ├─> paddle1.update()  → Cambio posición
         ├─> paddle2.update()  → Cambio posición
         │
         ├─> ball.update()  → Cambio posición, detecta puntos
         │
         ├─> ball.collideWithPaddle(paddle1)  → Rebote
         ├─> ball.collideWithPaddle(paddle2)  → Rebote
         │
         └─> paddle1.addScore()  /  paddle2.addScore()

SALIDA (OUTPUT)
     │
     ├─> Renderer.render()
     │   ├─> drawBackground()
     │   ├─> drawPaddle(paddle1)
     │   ├─> drawPaddle(paddle2)
     │   └─> drawBall()
     │
     └─> Renderer.updateScoreboard()
         └─> Actualizar elementos HTML
```

---

## Patrones de Diseño Implementados

### 1. **Manager Pattern**
```
Concepto: Una clase que gestiona un aspecto del sistema
│
├─ InputManager: Gestiona ENTRADA
├─ Renderer: Gestiona SALIDA VISUAL
├─ GameManager: Gestiona LÓGICA
└─ Beneficio: Separación clara de responsabilidades
```

### 2. **Entity Pattern**
```
Concepto: Objetos independientes que representan entidades en el juego
│
├─ Ball: Entidad de la pelota
├─ Paddle: Entidad de la paleta
└─ Beneficio: Fácil agregar nuevas entidades (Power-ups, enemigos)
```

### 3. **Singleton Pattern**
```
Concepto: Una única instancia compartida en toda la aplicación
│
└─ gameConfig: Una única configuración global
   Beneficio: Fácil acceso desde cualquier clase
```

### 4. **Dependency Injection**
```
Concepto: Pasar dependencias como parámetros, no crearlas internamente
│
Ejemplo:
  // ❌ Malo
  class GameManager {
    constructor() {
      this.config = new GameConfig();  // Crea su propia instancia
    }
  }

  // ✅ Bueno
  class GameManager {
    constructor(config) {  // Recibe como parámetro
      this.config = config;
    }
  }

  Beneficio: Fácil de testear, flexible
```

### 5. **MVC (Model-View-Controller)**
```
MODEL: Ball, Paddle (datos y lógica)
  │
  ├─ Independientes del renderizado
  └─ Contienen lógica de negocio

VIEW: Renderer (visualización)
  │
  ├─ Solo dibuja
  └─ No contiene lógica del juego

CONTROLLER: GameManager (coordinación)
  │
  ├─ Recibe entrada (InputManager)
  ├─ Actualiza modelo (Ball, Paddle)
  └─ Solicita vista (Renderer)
```

---

## Cómo Agregar una Nueva Característica

### Ejemplo: Agregar "Power-ups"

**Paso 1:** Crear nueva entidad
```javascript
// js/entities/powerup.js
class PowerUp {
  constructor(config, x, y) {
    this.config = config;
    this.x = x;
    this.y = y;
    // ... lógica
  }

  update() { /* ... */ }
  collidesWith(ball) { /* ... */ }
}
```

**Paso 2:** Importar en HTML
```html
<script src="js/entities/powerup.js"></script>
```

**Paso 3:** Usar en GameManager
```javascript
class GameManager {
  constructor(...) {
    // ... código existente
    this.powerUps = [new PowerUp(config, 400, 200)];
  }

  update() {
    // ... código existente
    this.powerUps.forEach(powerUp => {
      powerUp.update();
      if (powerUp.collidesWith(this.ball)) {
        this.applyPowerUpEffect();
      }
    });
  }

  render() {
    // ... código existente
    this.powerUps.forEach(powerUp => {
      this.renderer.drawPowerUp(powerUp);
    });
  }
}
```

**Paso 4:** Agregar método en Renderer
```javascript
class Renderer {
  drawPowerUp(powerUp) {
    // Dibujar power-up
  }
}
```

**Beneficio:** Agregamos una característica sin quebrar nada existente

---

## Testeo (Ejemplo)

```javascript
// test/ball.test.js
describe('Ball', () => {
  let ball, config;

  beforeEach(() => {
    config = new GameConfig();
    ball = new Ball(config);
  });

  test('Ball should reset to center', () => {
    ball.x = 100;
    ball.y = 100;
    ball.reset();
    
    assert.equal(ball.x, config.canvasWidth / 2);
    assert.equal(ball.y, config.canvasHeight / 2);
  });

  test('Ball should bounce off paddle', () => {
    const paddle = new Paddle(config);
    const originalSpeedX = ball.speedX;

    ball.collideWithPaddle(paddle);

    assert.equal(ball.speedX, -originalSpeedX);
  });

  test('Paddle should not go out of bounds', () => {
    const paddle = new Paddle(config);
    paddle.y = -100;
    paddle.update();

    assert(paddle.y >= 0);
    assert(paddle.y <= config.canvasHeight - paddle.height);
  });
});
```

---

## Conclusión

```
Estructura antigua:
- 1 archivo grande
- Difícil de entender
- Difícil de mantener
- Difícil de testear

           ↓

Estructura refactorizada:
✅ 8 archivos, cada uno pequeño
✅ Fácil de entender
✅ Fácil de mantener
✅ Fácil de testear
✅ Fácil de extender
✅ Listo para producción
✅ Sigue mejores prácticas
✅ Preparado para equipo
```

---

**Este es el camino hacia código profesional y mantenible.** 🚀
