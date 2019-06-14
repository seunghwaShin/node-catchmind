import React from 'react';
import socketio from 'socket.io-client';
import { Input, List, Form, Button, Tag} from 'antd';
//import 'antd/dist/antd.css';

const socket = socketio.connect('http://localhost:8080');

const colorPool = ['','orange', 'green', 'cyan', 'blue'];


class Chat extends React.Component {

    state = {
        name: '',
        msg: '',
        chatlog: [],
        mouse : {
            click: false,
            move: false,
            pos: {x: 0, y: 0},
            pos_prev: false
        }
    }

    onMouseDown = (e) => {
        
        this.setState({
            mouse: {
                ...this.state.mouse,
                click: true
            }
        });
    }

    onMouseUp = (e) =>{
        this.setState({
            mouse: {
                ...this.state.mouse,
                click: false
            }
        });
    }

    onMouseMove = (e) => {
        const canvas = document.getElementById('canvasDiv');

        this.setState({
            mouse: {
                ...this.state.mouse,
                pos: {x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop},
                move: true
            }
        });
    }

    

    onSend = (e) => {
        const { name, msg } = this.state;
        e.preventDefault();
        if(name.length < 1 || msg.length < 1){
            return;
        }
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
        socket.on('chat-msg', (name, msg, num) => {
            const chatlog = this.state.chatlog;
            chatlog.push({name, msg, num});
            this.setState({
                chatlog
            });
        });

        socket.on('draw_line', (data) => {
            const line = data.line;
            const canvas = document.getElementById('canvasDiv');
            const context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = '#df4b26';
            context.lineJoin = 'round';
            context.lineWidth = 3;
            context.moveTo(line[0].x, line[0].y);
            context.lineTo(line[1].x , line[1].y);
            context.stroke();
        });

        this.mainLoop();
    }

    mainLoop = () => {
        const { click, move, pos_prev, pos } = this.state.mouse;
        if(click && move && pos_prev){
            socket.emit('draw_line', {line: [pos, pos_prev]});
            this.setState({
                mouse: {
                    ...this.state.mouse,
                    move: false
                }
            });
        }

        this.setState({
            mouse: {
                ...this.state.mouse,
                pos_prev: {
                    x: pos.x,
                    y: pos.y
                }
            }
        });
        setTimeout(this.mainLoop, 25);
    }

    render(){

        return (
            <div style={{padding: '10px 0 0 10px'}}>
                <canvas
                    id="canvasDiv" 
                    width="560px"
                    height="300px"
                    style={{border: '1px solid black'}} 
                    onMouseDown={this.onMouseDown}
                    onMouseLeave={this.onMouseLeave}
                    onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                />
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
            </div>
            
        );
    }
};

export default Chat;