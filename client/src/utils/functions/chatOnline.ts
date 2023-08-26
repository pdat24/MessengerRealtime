import { HubConnectionBuilder } from '@microsoft/signalr';

export const connection = new HubConnectionBuilder().withUrl('https://localhost:7101/hub/chat').build();

connection.on('sentAPrivateMessage', (senderId, receiverId, message, type) => {
    const userDbId = sessionStorage.getItem('user_DbId');
    if (receiverId === userDbId) {
        window.dispatchEvent(
            new CustomEvent('haveNewOnlineMessage', {
                detail: {
                    senderId,
                    message: {
                        content: message,
                        type,
                    },
                },
            })
        );
    }
});

connection.start().then(() => {
    console.log('Hello developer \\(￣︶￣*\\))');
});
