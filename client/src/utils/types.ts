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
    conversation?: Conversation;
    read?: boolean;
    conversionId?: string;
    friendId?: string;
}
interface IGroupBox {
    id: string;
    name: string;
    avatarUrl: string;
    conversationId: string;
    members: string[];
}

export { type IChatBox, type Conversation, type Message, type IFriendInfo, type IUsers, type IGroupBox };
