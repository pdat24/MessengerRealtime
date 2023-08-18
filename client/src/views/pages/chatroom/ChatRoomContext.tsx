import { ReactElement, createContext } from 'react';
import { IChatBox } from '~/utils/types';

export const Context = createContext<IChatBox | null>(null);

interface IChatRoomContext {
    children: ReactElement;
    value: IChatBox;
}
function ChatRoomContext({ children, value }: IChatRoomContext) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default ChatRoomContext;
