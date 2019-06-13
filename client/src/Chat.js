import React from 'react';
import socketio from 'socket.io-client';
import { Input, List, Avatar, Form, Button } from 'antd';
import 'antd/dist/antd.css';

const socket = socketio.connect('http://localhost:8080');


class Chat extends React.Component {

    state = {
        name: '',
        msg: '',
        chatlog: []
    }

    onSend = (e) => {
        e.preventDefault();
        socket.emit('chat-msg', {
            name: this.state.name,
            msg: this.state.msg
        });
        this.setState({
            msg: ''
        });
    };

    changeInput = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    componentDidMount(){
        socket.on('chat-msg', (name, msg) => {
            const chatlog = this.state.chatlog;
            chatlog.push({name, msg});
            this.setState({
                chatlog
            });
        });
    }


    render(){

        return (
            <>
                <List 
                    itemLayout="horizontal" 
                    dataSource={this.state.chatlog}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta 
                                avatar={<Avatar>{item.name[0]}</Avatar>}
                                title={item.name}
                                description={item.msg}
                            />
                        </List.Item>
                    )}
                    />
                <Form id="chat" onSubmit={this.onSend}>
                    <Input style={{width: '160px'}} id="name" name="name" type="text" placeholder="name.." onChange={this.changeInput} value={this.state.name}/>
                    <Input style={{width: '400px'}} id="msg" name="msg" type="text" placeholder="message.." onChange={this.changeInput} value={this.state.msg}/>
                    <Button type="primary" htmlType="submit">전송</Button>
                </Form>
            </>
            
        );
    }
};

export default Chat;