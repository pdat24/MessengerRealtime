type Conversation = Array<{ isOwner: boolean; content: string; type: 'text' | 'picture' | 'file' }>;
interface IChatBox {
    name: string;
    avatar: string;
    newMsg: string;
    conversation: Conversation;
    unread?: boolean;
}

export { type IChatBox, type Conversation };
