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
    
    
  }, []);
  
  return (
    <div id="terminal-container"></div>
  );
}

export default ContainerTerminal;