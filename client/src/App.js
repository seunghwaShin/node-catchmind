import React from 'react';
import socketio from 'socket.io-client';
import Chat from './Chat';
import Paint from './Paint';

function App() {

  const socket = socketio.connect('http://localhost:8080');

  return (
    <div style={{padding: '10px 0 0 10px'}}>
      <Paint socket={socket}/>
      <Chat socket={socket}/>
    </div>
    
  );
}

export default App;
