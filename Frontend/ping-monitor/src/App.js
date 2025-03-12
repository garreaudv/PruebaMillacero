import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [ip, setIp] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [pingResults, setPingResults] = useState([]);
  const [status, setStatus] = useState('Desconectado');
  const [error, setError] = useState('');
  
  const socketRef = useRef(null);
  const maxResults = 20; // Número máximo de resultados a mostrar
  
  // Conectar al WebSocket
  const connectWebSocket = () => {
    if (ip.trim() === '') {
      setError('Por favor ingrese una dirección IP');
      return;
    }
    
    setError('');
    
    try {
      // Crear conexión WebSocket
      socketRef.current = new WebSocket('ws://localhost:8765');
      
      // Manejar eventos del WebSocket
      socketRef.current.onopen = () => {
        setIsConnected(true);
        setStatus('Conectado');
        
        // Enviar comando para iniciar el ping
        const command = {
          command: 'start_ping',
          ip: ip
        };
        socketRef.current.send(JSON.stringify(command));
      };
      
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Actualizar los resultados de ping
        setPingResults(prevResults => {
          const newResults = [...prevResults, data];
          
          // Limitar el número de resultados mostrados
          if (newResults.length > maxResults) {
            return newResults.slice(newResults.length - maxResults);
          }
          return newResults;
        });
      };
      
      socketRef.current.onclose = () => {
        setIsConnected(false);
        setStatus('Desconectado');
      };
      
      socketRef.current.onerror = (error) => {
        setError('Error de conexión: ' + error.message);
        setIsConnected(false);
        setStatus('Error');
      };
      
    } catch (err) {
      setError('Error al conectar: ' + err.message);
    }
  };
  
  // Desconectar del WebSocket
  const disconnectWebSocket = () => {
    if (socketRef.current && isConnected) {
      // Enviar comando para detener el ping
      const command = {
        command: 'stop_ping',
        ip: ip
      };
      socketRef.current.send(JSON.stringify(command));
      
      // Cerrar la conexión
      socketRef.current.close();
      setIsConnected(false);
      setStatus('Desconectado');
      setPingResults([]);
    }
  };
  
  // Limpiar conexión al desmontar el componente
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Monitor de Ping en Tiempo Real</h1>
      </header>
      
      <div className="connection-panel">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Introduce una dirección IP"
          disabled={isConnected}
        />
        
        {!isConnected ? (
          <button className="connect-btn" onClick={connectWebSocket}>Conectar</button>
        ) : (
          <button className="disconnect-btn" onClick={disconnectWebSocket}>Desconectar</button>
        )}
        
        <div className="status">
          Estado: <span className={`status-${status.toLowerCase()}`}>{status}</span>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {isConnected && (
        <div className="results-panel">
          <h2>Resultados para {ip}</h2>
          
          <div className="results-header">
            <span className="timestamp">Timestamp</span>
            <span className="latency">Latencia (ms)</span>
            <span className="status">Estado</span>
          </div>
          
          <div className="results-list">
            {pingResults.map((result, index) => (
              <div key={index} className="result-item">
                <span className="timestamp">{result.timestamp}</span>
                <span className="latency">{result.status === 'up' ? result.latency : '-'}</span>
                <span className={`status status-${result.status}`}>
                  {result.status.toUpperCase()}
                  {result.message && <span className="message"> ({result.message})</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;