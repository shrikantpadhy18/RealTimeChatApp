
const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
//accessing username and room type from url

const {username,room}=Qs.parse(location.search,
    {ignoreQueryPrefix: true}//This will ignore the special characters
    );







//message recieved from server
const socket=io();

//get room and user

socket.on("roomusers",({room,users})=>{
    outputroom(room);
    outputuser(users);
})


socket.emit("join",{username,room})
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit',(e)=>{
    //when you submit the form it get submitted to a file and refreshed to prevent this we do
    e.preventDefault();
    //get the message value
    const mssg=e.target.elements.msg.value;
    //console.log(mssg);
    //emit mssg to server
    socket.emit('chatMessage',mssg);


    //after sending hte message clear it
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}


//add room name to dom
function outputroom(rooms){
roomName.innerHTML=rooms;
}
function outputuser(user){
    userList.innerHTML=`
    ${user.map(data=>`<li> ${data.username}</li>`).join('')} 
    `;
}