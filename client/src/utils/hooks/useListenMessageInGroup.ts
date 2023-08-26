/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useMemo } from 'react';
import { IGroupBox, Message } from '../types';
import scrollToBottom from '~/views/layouts/ChatRoom/Input/scrollToBottom';
import { useSelector } from 'react-redux';

interface IType {
    type: 'text' | 'image' | 'file' | 'icon';
    updateMessages: Dispatch<SetStateAction<Message[]>>;
    conversationId: string;
}

function useListenMessageInGroup({ conversationId, type, updateMessages }: IType) {
    const groupList = useSelector(({ root }) => root.groupList) as IGroupBox[];

    useMemo(() => {
        window.addEventListener('haveNewMessageInGroup', (e: CustomEventInit) => {
            const detail = e.detail as {
                data: Message;
                groupId: string;
                conversationId: string;
            };
            // make sure user in group
            let userInGroup = false;
            groupList.forEach((g) => {
                if (g.id === detail.groupId) userInGroup = true;
            });
            // make sure conversation is opening
            if (userInGroup && conversationId === detail.conversationId) {
                if (detail.data.message.type === type) {
                    updateMessages((messages) => [...messages, detail.data]);
                    scrollToBottom();
                }
            }
        });
    }, []);
}

export default useListenMessageInGroup;
