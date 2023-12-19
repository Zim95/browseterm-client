import React, { useEffect } from 'react';
import './ContainerTerminal.css';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

function ContainerTerminal() {
  useEffect(() => {
    // create the terminal
    const terminalContainer = document.getElementById('terminal-container');
    const term = new Terminal({cursorBlink: true});
    term.open(terminalContainer);
    
    const socket = new WebSocket('ws://localhost:8000');

    socket.addEventListener('open', function(event) {
      term.write("\r\n*** Connected to backend***\r\n");
      // As soon as we connect we send a ssh_config message
      var dataToSend = {
          event: 'ssh_connect',  // Event name or identifier
          ssh_hash: 'asdf',
          ssh_host: '172.26.0.3',
          ssh_port: 22,
          ssh_username: 'ubuntu',
          ssh_password: '1234'
      };

      // Convert data to a JSON string (if it's not already a string)
      var dataString = JSON.stringify(dataToSend);

      // Send the data to the backend
      socket.send(dataString);
    });

    // Browser -> Backend
    term.onData(function(data) { 
        const msg = JSON.stringify(
            {
                event: "data",
                ssh_hash: "asdf",
                message: data
            }
        )
        socket.send(msg);
    });

    // Backend -> Browser
    socket.addEventListener('message', function(event) {
        term.write(event.data);
    });

    socket.addEventListener('close', function(event) {
        term.write("\r\n*** Disconnected from backend***\r\n");
    });

    socket.addEventListener('error', function(error) {
        console.error("WebSocket error:", error);
    });
  }, []);
  
  return (
    <div id="terminal-container"></div>
  );
}

export default ContainerTerminal;