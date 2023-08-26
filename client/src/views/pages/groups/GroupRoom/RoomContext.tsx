import { ReactElement, createContext } from 'react';
import { IGroupBox } from '~/utils/types';

export const Context = createContext<IGroupBox | null>(null);

interface IGroupRoomContext {
    children: ReactElement;
    value: IGroupBox;
}
function ChatRoomContext({ children, value }: IGroupRoomContext) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default ChatRoomContext;
