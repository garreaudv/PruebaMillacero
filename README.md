# PruebaMillacero# Monitor de Ping en Tiempo Real

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

## Direcciones IP de prueba recomendadas

- **Servicios públicos confiables:**
  - `8.8.8.8` o `8.8.4.4` (Servidores DNS de Google)
  - `1.1.1.1` (Servidor DNS de Cloudflare)
  - `208.67.222.222` (OpenDNS)

- **Direcciones locales:**
  - `127.0.0.1` (localhost - tu propia computadora)
  - La dirección IP de tu router (generalmente `192.168.0.1` o `192.168.1.1`)

- **Para probar el estado "down":**
  - Una dirección IP inexistente, como `192.168.123.234`

## Cómo funciona

### Servidor (Backend)

1. **Conexión WebSocket**: El servidor crea un punto de conexión WebSocket en el puerto 8765.
   
2. **Monitoreo de hosts**: Cuando un cliente solicita el monitoreo de una IP:
   - Se inicia una tarea asíncrona que ejecuta comandos de ping
   - Se verifica la latencia y el estado de conexión
   - Se envían los resultados al cliente en tiempo real
   
3. **Detección de fallos**: El servidor lleva un registro de intentos fallidos:
   - Si un host no responde 3 veces consecutivas, se marca como "down"
   - Se envía un mensaje "Host inalcanzable" al cliente

### Cliente (Frontend)

1. **Interfaz de usuario**: Proporciona campos para ingresar una IP y botones para controlar la conexión.
   
2. **Conexión WebSocket**: Establece una conexión WebSocket con el servidor.
   
3. **Visualización de datos**: Muestra los resultados en tiempo real:
   - Lista de pings recientes con timestamps
   - Valores de latencia
   - Indicadores de estado (verde = UP, rojo = DOWN)
   
4. **Manejo de errores**: Muestra mensajes de error cuando hay problemas de conexión.

## Solución de problemas

- **El servidor no inicia**: Verifica que no haya otro servicio usando el puerto 8765.
  
- **Error de conexión en el cliente**: Asegúrate de que el servidor esté en ejecución antes de conectar.
  
- **Errores de WebSocket**: Si ves errores relacionados con WebSocket, verifica la versión de la biblioteca:
  ```bash
  pip show websockets
  ```
  
  Si tienes problemas con versiones recientes, puedes instalar una versión específica:
  ```bash
  pip uninstall websockets
  pip install websockets==10.4
  ```

- **El ping siempre muestra "down"**: Algunos sistemas requieren permisos elevados para ejecutar comandos ping. Intenta ejecutar el servidor como administrador.