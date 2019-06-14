import React from 'react';
import socketio from 'socket.io-client';
import Chat from './Chat';
import Paint from './Paint';
import Door from './Door';

class App extends React.Component {

  socket = socketio.connect('http://localhost:8080');

  state = {
    user: null
  }

  createUser = ({name, color}) => {
    this.setState({
      user: {name, color}
    });
  }

  render(){
    return (
      <div style={{padding: '10px 0 0 10px'}}>
        {
          this.state.user === null ? <Door createUser={this.createUser}/> : 
          <>
            <Paint socket={this.socket}/>
            <Chat socket={this.socket} user={this.state.user}/>
          </>          
        }        
      </div>      
    );
  }  
}

export default App;
