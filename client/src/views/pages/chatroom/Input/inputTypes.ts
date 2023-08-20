import { Dispatch, SetStateAction } from 'react';
import { Conversation } from '~/utils/types';

interface ITextInput {
    messages?: Conversation;
    setMessages: Dispatch<SetStateAction<Conversation>>;
}

export { type ITextInput };
