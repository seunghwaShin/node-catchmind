import React from 'react';
import { Input, Radio, Form, Button } from 'antd';


class Paint extends React.Component {

    state = {
        click: false,
        move: false,
        pos: {x: 0, y: 0},
        pos_prev: false,
        myturn: false
    }
    

    onMouseDown = (e) => {
        if(!this.state.myturn) return;
        this.setState({
            click: true
        });
    }

    onMouseUp = (e) =>{
        if(!this.state.myturn) return;
        this.setState({
            click: false
        });
    }

    onMouseMove = (e) => {
        if(!this.state.myturn) return;
        const canvas = document.getElementById('canvasDiv');

        this.setState({
            pos: {
                x: e.pageX - canvas.offsetLeft,
                y: e.pageY - canvas.offsetTop
            },
            move: true
        });
    }

    mainLoop = () => {
        const { click, move, pos_prev, pos } = this.state;
        if(click && move && pos_prev){
            // 서버로 draw_line 이벤트 보냄
            this.props.socket.emit('draw_line', {line: [pos, pos_prev]});
            this.setState({
                move: false
            });
        }

        this.setState({
            pos_prev: {
                x: pos.x,
                y: pos.y
            }
        });
        setTimeout(this.mainLoop, 25);
    }


    componentDidMount(){
        // 서버에서 draw_line 이벤트 받음
        this.props.socket.on('draw_line', ({line}) => {
            //const line = data.line;
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

        // socket.on('get_answer', (answer) => {
        //     this.setState({answer});
        // });

        this.mainLoop();
        
        
        this.props.socket.on('clear_canvas', () => {
            const canvas = document.getElementById('canvasDiv');
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        });

        this.props.socket.emit('check_turn', this.props.socket.id);

        this.props.socket.on('my_turn', (turn) => {
            if(turn){
                this.setState({myturn: turn});
            }            
        })
    }


    clearCanvas = () => {
        this.props.socket.emit('clear_canvas', true);
    }

    render(){

        return(
            <>
                <div>
                    { this.state.myturn && <Button onClick={this.clearCanvas}>지우기</Button> }   
                </div>                             
                <canvas
                    id="canvasDiv" 
                    width="660px"
                    height="300px"
                    style={{border: '1px solid black'}} 
                    onMouseDown={this.onMouseDown}
                    onMouseLeave={this.onMouseLeave}
                    onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                />
            </>
            
        );
    }

}

export default Paint;