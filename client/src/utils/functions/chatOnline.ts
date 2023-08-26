import { HubConnectionBuilder } from '@microsoft/signalr';

export const connection = new HubConnectionBuilder().withUrl('http://localhost:3000/hub/chat').build();

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

connection.on('receivedGroupMessage', (senderId, groupId, conversationId, message, type) => {
    const userDbId = sessionStorage.getItem('user_DbId');
    if (userDbId !== senderId)
        window.dispatchEvent(
            new CustomEvent('haveNewMessageInGroup', {
                detail: {
                    data: {
                        senderId,
                        message: {
                            content: message,
                            type,
                        },
                    },
                    groupId,
                    conversationId,
                },
            })
        );
});

connection.start().then(() => {
    console.log('Hello developer \\(￣︶￣*\\))');
});
