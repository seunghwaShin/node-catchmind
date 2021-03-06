const express = require('express');
const http = require('http');
const socket = require('socket.io');
const port = 8080;

const app = express(); // express 객체 생성
const server = http.createServer(app);
const io = socket(server); // 생성된 서버를 socket.io에 바인딩

server.listen(port, () => {
    console.log('server start on ' + port);
});


app.use('/client', express.static('./client/public'));

let line_history = [];

app.get('/', (req, res) => {
    res.redirect(302, '/client');
});


let connectionList = [];

// 클라이어트가 접속 했을 때
io.on('connection', (socket) => {
    // socket : 커넥션이 성공했을때 커넥션에 대한 정보를 담고 있는 변수

    console.log('user connected:::: ', socket.client.id);
    connectionList.push(socket.client.id);
    console.log('clientsCount',socket.client.server.engine.clientsCount);

    socket.on('check_turn', (id) => {
        if(connectionList.indexOf(id) === 0){
            socket.emit('my_turn', true);
        }
    })

    // 새 클라이언트가 접속하면 이전의 히스토리를 보내준다
    for(let i in line_history){
        socket.emit('draw_line', {
            line: line_history[i]
        });
    }

    socket.on('draw_line', ({line}) => {
        line_history.push(line); // receive
        io.emit('draw_line', {line}); // send
    });

    //메세지를 받으면
    socket.on('chat-msg', ({name, msg, color}) => {
        console.log('name', name);
        console.log('msg', msg);
        io.emit('chat-msg', {name, msg, color});
    });


    // socket.on('redraw', () => {
    //     console.log('sever redraw');
    //     line_history = [];
    //     io.emit('redraw');
    // });    
    socket.on('disconnect', () => {
        const idx = connectionList.indexOf(socket.client.id);
        connectionList.splice(idx, 1);
        //console.log('connectionList::',connectionList.toString());
    });

    socket.on('clear_canvas', () => {
        io.emit('clear_canvas', true);
    })

});





