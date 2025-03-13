# PruebaMillacero

Este proyecto implementa un sistema de monitoreo de ping en tiempo real, utilizando WebSockets para la comunicación entre un servidor Python y un cliente React. El sistema permite monitorear la conectividad y latencia de direcciones IP específicas con actualizaciones en tiempo real.

## Características

- **Servidor WebSocket** que realiza ping a direcciones IP en intervalos regulares
- **Cliente React** con interfaz intuitiva para visualizar los resultados
- Monitoreo en tiempo real con actualizaciones cada segundo
- Visualización del estado de conexión (UP/DOWN) con indicadores de color
- Detección de hosts inalcanzables después de 3 intentos fallidos
- Medición de latencia en milisegundos
- Historial de resultados recientes

## Requisitos

### Backend (Python)
- Python 3.7 o superior
- Biblioteca `websockets` (versión 11.0 o superior)

### Frontend (React)
- Node.js y npm
- React.js (creado con Create React App)

## Instalación

### Servidor (Backend)

1. Crea una carpeta para el proyecto:
```bash
mkdir ping-monitor
cd ping-monitor
mkdir backend
cd backend
```

2. Crea un entorno virtual (opcional pero recomendado):
```bash
python -m venv venv
```

3. Activa el entorno virtual:
   - En Windows:
   ```bash
   venv\Scripts\activate
   ```
   - En macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. Instala las dependencias:
```bash
pip install websockets
```

5. Guarda el código del servidor en un archivo `ping_server.py`

### Cliente (Frontend)

1. Desde la carpeta principal del proyecto:
```bash
mkdir frontend
cd frontend
```

2. Crea una nueva aplicación React:
```bash
npx create-react-app client
cd client
```

3. Reemplaza el contenido de `src/App.js` con el código del cliente proporcionado
4. Reemplaza el contenido de `src/App.css` con los estilos CSS proporcionados

## Ejecución

### Iniciar el servidor

1. Navega hasta la carpeta del backend:
```bash
cd ping-monitor/backend
```

2. Activa el entorno virtual si lo creaste:
   - En Windows:
   ```bash
   venv\Scripts\activate
   ```
   - En macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

3. Ejecuta el servidor:
```bash
python ping_server.py
```

4. Deberías ver el mensaje: `Servidor WebSocket iniciado en ws://localhost:8765`

### Iniciar el cliente

1. Navega hasta la carpeta del frontend:
```bash
cd ping-monitor/frontend/client
```

2. Instala las dependencias si es la primera vez:
```bash
npm install
```

3. Inicia la aplicación React:
```bash
npm start
```

4. Tu navegador debería abrirse automáticamente en `http://localhost:3000`

## Uso

1. En la interfaz del cliente, ingresa una dirección IP para monitorear
2. Haz clic en "Conectar" para iniciar el monitoreo
3. Observa los resultados en tiempo real:
   - Timestamps de cada ping
   - Latencia en milisegundos
   - Estado (UP/DOWN) con código de colores
   - Mensajes de error cuando corresponda
4. Para detener el monitoreo, haz clic en "Desconectar"

