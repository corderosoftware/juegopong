# ⚡ GUÍA RÁPIDA - Ejecutar el Juego

## Opción 1: Versión Original (1 archivo - Más simple)
```bash
# Solo abre el archivo en el navegador
1. Navega a: c:\Varios\POOLM\JuegoPong\
2. Haz doble-click en: index.html
3. ¡Juega!
```

**Ventaja:** Cero setup, funciona inmediatamente

---

## Opción 2: Versión Refactorizada (Recomendado - Buenas prácticas)

### Windows (PowerShell)

```powershell
# 1. Navega a la carpeta
cd c:\Varios\POOLM\JuegoPong

# 2. Inicia servidor Python (port 8000)
python -m http.server 8000

# 3. Abre navegador y ve a:
http://localhost:8000/index-refactored.html
```

### Windows (CMD)

```cmd
cd c:\Varios\POOLM\JuegoPong
python -m http.server 8000
REM Luego abre: http://localhost:8000/index-refactored.html
```

### Mac / Linux

```bash
cd c/Varios/POOLM/JuegoPong
python3 -m http.server 8000
# Luego abre: http://localhost:8000/index-refactored.html
```

---

## ¿Por qué necesito un servidor?

```
❌ NO FUNCIONA: file:///C:/Varios/POOLM/JuegoPong/index-refactored.html
   Razón: Restricción CORS (seguridad del navegador)

✅ SÍ FUNCIONA: http://localhost:8000/index-refactored.html
   Razón: Servidor local permite cargar archivos externos
```

---

## Servidores Alternativos

### Opción: Node.js (http-server)

```bash
# Instalar (una sola vez)
npm install -g http-server

# Ejecutar
cd c:\Varios\POOLM\JuegoPong
http-server

# Abre: http://localhost:8080
```

### Opción: Live Server (VS Code Extension)

```
1. Instala extensión: "Live Server" en VS Code
2. Click derecho en index-refactored.html
3. Select "Open with Live Server"
4. Se abre automáticamente en navegador
```

### Opción: PHP (si tienes instalado)

```bash
cd c:\Varios\POOLM\JuegoPong
php -S localhost:8000
# Abre: http://localhost:8000/index-refactored.html
```

---

## Controles del Juego

### Jugador 1 (Izquierda - Magenta)
```
↑ Flecha Arriba  → Sube paleta
↓ Flecha Abajo   → Baja paleta
```

### Jugador 2 (Derecha - Cyan)
```
A → Sube paleta
Z → Baja paleta
```

### Controles Generales
```
ESPACIO → Pausa/Reanudar
[Botón] → Reiniciar Juego
[Botón] → Pausa/Reanudar
```

---

## Archivos Principales

```
index.html                 ← Versión ÚNICA (original, más simple)
│                              
index-refactored.html      ← Versión REFACTORIZADA (recomendada)
│
├── css/
│   ├── styles.css         ← Estilos globales
│   └── game.css           ← Estilos del canvas
│
├── js/
│   ├── config.js          ← Configuración
│   ├── main.js            ← Punto de entrada
│   ├── entities/
│   │   ├── ball.js        ← Lógica pelota
│   │   └── paddle.js      ← Lógica paletas
│   └── managers/
│       ├── game.js        ← Gestor principal
│       ├── input.js       ← Gestor entrada
│       └── renderer.js    ← Gestor visual
│
├── README.md              ← Documentación completa
├── ANALISIS.md            ← Análisis pros/contras
└── ARQUITECTURA.md        ← Diagrama de arquitectura
```

---

## Cambiar Parámetros del Juego

### En versión ÚNICA (index.html):
```javascript
// Busca esta sección en el archivo
const config = {
    canvasWidth: 800,           // Ancho
    canvasHeight: 400,          // Alto
    ball: {
        initialSpeedX: 4,       // ← Cambiar velocidad pelota
        initialSpeedY: 4,
        maxSpeed: 12,
        speedIncrement: 0.05
    },
    paddle: {
        speed: 6,               // ← Cambiar velocidad paleta
        height: 80              // ← Cambiar altura paleta
    }
};
```

### En versión REFACTORIZADA (recomendado):
```javascript
// Edita: js/config.js
// Solo 1 archivo, mucho más fácil
class GameConfig {
    constructor() {
        this.ball = {
            initialSpeedX: 4,   // ← Cambiar aquí
            // ...
        };
    }
}
```

---

## Solucionar Problemas

### ❌ "Archivo no se carga" o "Error de CORS"
```
PROBLEMA: No estás usando servidor
SOLUCIÓN: Usa python -m http.server como se explica arriba
```

### ❌ "Canción de fondo no se escucha"
```
PROBLEMA: Audio está desactivado en código (no implementado)
SOLUCIÓN: Abrir js/config.js y cambiar sound.enabled a true
         Nota: Requiere agregar archivos de audio
```

### ❌ "El juego va muy rápido/lento"
```
PROBLEMA: Parámetros de velocidad incorrectos
SOLUCIÓN: Abre js/config.js y ajusta:
  - ball.initialSpeedX
  - paddle.speed
```

### ❌ "Colisión no funciona bien"
```
PROBLEMA: Posiblemente diferencias de velocidad
SOLUCIÓN: Verifica js/entities/ball.js, método collideWithPaddle()
```

---

## Próximos Pasos para Aprender

1. **Lee README.md** - Documentación completa
2. **Lee ANALISIS.md** - Por qué la nueva estructura es mejor
3. **Lee ARQUITECTURA.md** - Cómo se conectan los componentes
4. **Abre index-refactored.html en VS Code** - Estudia cada archivo
5. **Modifica js/config.js** - Cambia parámetros y observa
6. **Agrega una característica nueva** - Ej: Power-ups
7. **Escribe tests** - Ej: unit tests para Ball

---

## Resumen

| Acción | Comando/Pasos |
|--------|---------------|
| **Jugar versión simple** | Abre `index.html` en navegador |
| **Jugar versión profesional** | `python -m http.server 8000` luego `http://localhost:8000/index-refactored.html` |
| **Cambiar velocidad** | Edita `js/config.js` |
| **Cambiar colores** | Edita `js/config.js` o `css/game.css` |
| **Agregar feature** | Crea archivo en `js/entities/` o `js/managers/` |
| **Leer documentación** | Abre `README.md`, `ANALISIS.md`, `ARQUITECTURA.md` |

---

## Videos Recomendados (Para Aprender)

1. Separación HTML/CSS/JS - 10 min
2. Clases en JavaScript - 15 min
3. Game Loop en JS - 20 min
4. Arquitectura de software - 30 min
5. Testing en JavaScript - 20 min

---

## Contacto / Preguntas

Si tienes preguntas sobre:
- **Código**: Revisa comentarios en los archivos
- **Arquitectura**: Lee ARQUITECTURA.md
- **Comparación**: Lee ANALISIS.md
- **Cómo empezar**: Lee README.md

---

**¡Diviértete jugando y aprendiendo!** 🎮✨
