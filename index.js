const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const { disconnect } = require('process');
const app=express();
const format=require('./utilities/messages');

const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utilities/users');




const bot='MyBot'

const server=http.createServer(app);

const io=socketio(server);

const port=5000||process.env.PORT;
//module used for dealing with web socket


//deals with static files

app.use(express.static(path.join(__dirname,'asset')))

//triggers when client gets connected
io.on("connection",socket=>{

    socket.on("join",({username,room})=>{
        const user=userJoin(socket.id,username,room);

        socket.join(user.room)//joins the user in the specified room

        //bidrectional communication ,server emits a message after the client gets connected
    //for current user
    
    server.emit('message',format(bot,`Welcome to my app ${username}`));
    
    
    //  The above method emits to single client who is connecting
    //broadcasting mssg when someone connects
    //the below method will emit to everybody except the user who is getting connected
    
    socket.broadcast.to(user.room).emit('message',format(bot,`A new user named ${username} has  joined the chat`));
        //send user and room info

        io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })

        //listen for chat message
    
    

        socket.on('chatMessage',(msg)=>{
            const user=getCurrentUser(socket.id);
        
            io.to(user.room).emit('message',format(user.username,msg));
        
        });


        //when client is disconnected
        socket.on("disconnect",()=>{

            const user=userLeave(socket.id);
            if(user){
            io.to(user.room).emit('message',format(bot,`A user ${user.username} has left`));
            }

            io.to(user.room).emit('roomusers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        });
        

});


})
//console.log("NEW CONNECTION......");



server.listen(port,()=>{
    console.log(`Server Started At Port No ${port}`);
});
