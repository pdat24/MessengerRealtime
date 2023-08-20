type Message = {
    senderId: string;
    message: {
        content: string;
        type: 'text' | 'image' | 'file' | 'icon';
    };
};

type Conversation = Array<Message>;

interface IChatBox {
    username: string;
    avatarUrl: string;
    newMessage: string;
    conversation: Conversation;
    unread?: boolean;
    conversionId?: string;
}

export { type IChatBox, type Conversation, type Message };
