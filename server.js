const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');
const port = 8080;


const app = express(); // express 객체 생성
const server = http.createServer(app);
const io = socket(server); // 생성된 서버를 socket.io에 바인딩

server.listen(port, () => {
    console.log('server start on ' + port);
});


app.use('/client', express.static('./client/public'));

app.get('/', (req, res) => {
    res.redirect(302, '/client');
});

// 클라이어트가 접속 했을 때
io.on('connection', (socket) => {
    console.log('user connected:::: ', socket.client.id);

    // socket.on('disconnect', () => {
    //     console.log('user disconnected:::: ', socket.client.id);
    // });

    //메세지를 받으면
    socket.on('chat-msg', ({name, msg}) => {
        console.log('name', name);
        console.log('msg', msg);
        io.emit('chat-msg', name, msg);
    });
})



