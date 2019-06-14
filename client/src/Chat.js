import React from 'react';
import socketio from 'socket.io-client';
import { Input, List, Form, Button, Tag} from 'antd';

const colorPool = ['','orange', 'green', 'cyan', 'blue'];


class Chat extends React.Component {

    state = {
        name: '',
        msg: '',
        chatlog: [],
    }

    onSend = (e) => {
        const { name, msg } = this.state;
        e.preventDefault();
        if(name.length < 1 || msg.length < 1){
            return;
        }
        this.props.socket.emit('chat-msg', {
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
        this.props.socket.on('chat-msg', (name, msg, num) => {
            const chatlog = this.state.chatlog;
            chatlog.push({name, msg, num});
            this.setState({
                chatlog
            });
        });
        
    }


    render(){

        return (
            <>
                <List
                    split={false}
                    itemLayout="horizontal" 
                    dataSource={this.state.chatlog}
                    renderItem={item => (
                        <List.Item style={{marginBottom:'5px', padding: 0}}>
                            <Tag color={colorPool[item.num]}>{item.name}</Tag><Tag>{item.msg}</Tag>
                        </List.Item>
                    )}
                    />
                <Form id="chat" onSubmit={this.onSend}>
                    <Input maxLength={10} style={{width: '160px', marginRight: '5px'}} id="name" name="name" type="text" placeholder="name" onChange={this.changeInput} value={this.state.name}/>
                    <Input style={{width: '400px', marginRight: '5px'}} id="msg" name="msg" type="text" placeholder="message.." onChange={this.changeInput} value={this.state.msg}/>
                    <Button type="primary" htmlType="submit">전송</Button>
                </Form>
            </>
            
        );
    }
};

export default Chat;