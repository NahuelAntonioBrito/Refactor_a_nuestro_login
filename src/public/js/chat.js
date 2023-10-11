
Swal.fire({
    title: ' Auntentication ',
    input: 'text',
    text: ' Set a username for the chat',
    inputValidator: value => {
        return !value.trim() && 'Please, write a valid user name'
    },
    allowOutsideClick: false
}).then( result => {
    let user = result.value
    document.getElementById('userName').innerHTML = user
    let socket = io()
    let chatBox = document.getElementById('chatbox')
    chatBox.addEventListener('keyup', e => {
        if( e.key === 'Enter') {
            if(chatBox.value.trim().length > 0){

                socket.emit('message', {
                    user,
                    message: chatBox.value
                })
            }
        }
    })
    
    socket.on('logs', (data) => {
        const divlogs = document.getElementById('log');
        let messages = '';
    
        data.forEach(message => {
            messages += `<p><i>${message.user}</i>: ${message.message}</p>`;
        });
    
        divlogs.innerHTML = messages;
    });
})