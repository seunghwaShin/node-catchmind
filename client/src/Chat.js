import React from 'react';
import { Input, List, Form, Button, Tag} from 'antd';

class Chat extends React.Component {

    state = {
        msg: '',
        chatlog: [],
    }

    onSend = (e) => {
        const { msg } = this.state;
        e.preventDefault();
        if(msg.length < 1){
            return;
        }
        this.props.socket.emit('chat-msg', {
            name: this.props.user.name,
            msg: this.state.msg,
            color: this.props.user.color
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
        this.props.socket.on('chat-msg', (name, msg, color) => {
            const chatlog = this.state.chatlog;
            chatlog.push({name, msg, color});
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
                            <Tag color={item.color}>{item.name}</Tag><Tag>{item.msg}</Tag>
                        </List.Item>
                    )}
                    />
                <Form id="chat" onSubmit={this.onSend}>
                    <Input style={{width: '160px', marginRight: '5px', backgroundColor: this.props.user.color, color: 'white'}} id="name" name="name" type="text" value={this.props.user.name} readOnly/>
                    <Input style={{width: '400px', marginRight: '5px'}} id="msg" name="msg" type="text" placeholder="message.." onChange={this.changeInput} value={this.state.msg}/>
                    <Button type="primary" htmlType="submit">전송</Button>
                </Form>
            </>
            
        );
    }
};

export default Chat;