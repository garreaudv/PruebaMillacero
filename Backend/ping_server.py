import asyncio
import websockets
import json
import subprocess
import platform
import time
from datetime import datetime

# Clase para rastrear el estado de un host
class HostTracker:
    def __init__(self):
        self.consecutive_failures = 0
        self.is_reachable = True

# Diccionario para rastrear hosts
host_trackers = {}

# Función para realizar ping según el sistema operativo
async def ping_host(ip):
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    command = ['ping', param, '1', ip]
    
    try:
        # Iniciar el tiempo para medir la latencia
        start_time = time.time()
        
        # Ejecutar el comando ping
        process = await asyncio.create_subprocess_exec(
            *command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        # Calcular el tiempo transcurrido
        elapsed_time = time.time() - start_time
        
        # Verificar si el ping fue exitoso
        if process.returncode == 0:
            # Extraer la latencia del resultado
            latency = int(elapsed_time * 1000)  # Convertir a milisegundos
            return True, latency
        else:
            return False, 0
            
    except Exception as e:
        print(f"Error al hacer ping a {ip}: {str(e)}")
        return False, 0

# Función principal para manejar la conexión WebSocket
async def handle_connection(websocket):
    try:
        async for message in websocket:
            data = json.loads(message)
            command = data.get('command')
            
            if command == 'start_ping':
                ip = data.get('ip')
                if ip not in host_trackers:
                    host_trackers[ip] = HostTracker()
                
                # Iniciar el monitoreo continuo
                asyncio.create_task(monitor_host(websocket, ip))
                
            elif command == 'stop_ping':
                ip = data.get('ip')
                if ip in host_trackers:
                    del host_trackers[ip]
    
    except websockets.exceptions.ConnectionClosed:
        print("Conexión cerrada")
    except Exception as e:
        print(f"Error en la conexión: {str(e)}")

# Función para monitorear un host continuamente
async def monitor_host(websocket, ip):
    tracker = host_trackers.get(ip)
    
    while ip in host_trackers:
        is_reachable, latency = await ping_host(ip)
        
        if is_reachable:
            tracker.consecutive_failures = 0
            tracker.is_reachable = True
            status = "up"
        else:
            tracker.consecutive_failures += 1
            
            if tracker.consecutive_failures >= 3:
                tracker.is_reachable = False
                status = "down"
            else:
                status = "up"  # Todavía consideramos que está up hasta 3 fallos consecutivos
        
        # Preparar el mensaje para enviar al cliente
        result = {
            "ip": ip,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "latency": latency if is_reachable else 0,
            "status": status,
            "message": "Host inalcanzable" if tracker.consecutive_failures >= 3 else ""
        }
        
        # Enviar resultado al cliente
        try:
            await websocket.send(json.dumps(result))
        except:
            # Si hay error al enviar, salir del bucle
            break
            
        # Esperar 1 segundo antes del próximo ping
        await asyncio.sleep(1)

# Iniciar el servidor WebSocket
async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        print("Servidor WebSocket iniciado en ws://localhost:8765")
        await asyncio.Future()  # Corre indefinidamente

if __name__ == "__main__":
    asyncio.run(main())