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

    // Read hash from url
    const pathSections = window.location.href.split("/");
    const termhash = pathSections[pathSections.length - 1];
    const terminalData = JSON.parse(localStorage.getItem(termhash));
    console.log("Terminal Data", terminalData);

    socket.addEventListener('open', function(event) {
      term.write("\r\n*** Connected to backend***\r\n");
      // As soon as we connect we send a ssh_config message
      var dataToSend = {
          event: 'ssh_connect',  // Event name or identifier
          ssh_hash: termhash,
          ssh_host: terminalData.containerValue.ips[0], // Any one of the ips will work.
          ssh_port: 22,
          ssh_username: terminalData.socketSSHUserMapping[
            terminalData.containerValue.name].username,
          ssh_password: terminalData.socketSSHUserMapping[
            terminalData.containerValue.name].password,
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
                ssh_hash: termhash,
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