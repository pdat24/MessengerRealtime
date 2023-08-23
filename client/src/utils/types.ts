type Message = {
    senderId: string;
    message: {
        content: string;
        type: 'text' | 'image' | 'file' | 'icon';
    };
};

type Conversation = Array<Message>;
interface IFriendInfo {
    username: string;
    avatarUrl: string;
    conversationId: string;
    latestMessage: Message;
    id: string;
    read: boolean;
}
interface IUsers {
    username: string;
    avatarUrl: string;
    userDbId: string;
}

interface IChatBox {
    username: string;
    avatarUrl: string;
    latestMessage?: Message;
    conversation: Conversation;
    read?: boolean;
    conversionId?: string;
    friendId?: string;
}

export { type IChatBox, type Conversation, type Message, type IFriendInfo, type IUsers };
