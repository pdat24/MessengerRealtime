/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import TextMessageRight from '~/components/TextMessageRight';
import TextMessageLeft from '~/components/TextMessageLeft';
import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from './RoomContext';
import { Conversation } from '~/utils/types';
import { useSelector } from 'react-redux';
import PictureMessageRight from '~/components/PictureMessageRight';
import FileMessageRight from '~/components/FileMessageRight';
import PictureMessageLeft from '~/components/PictureMessageLeft';
import FileMessageLeft from '~/components/FileMessageLeft';
import ActiveEmojiMessageRight from '~/components/ActiveEmojiMessageRight';
import ActiveEmojiMessageLeft from '~/components/ActiveEmojiMessageLeft';
import getFilename from '~/utils/functions/getFilename';
import ScrollToBottomBtn from '~/components/ScrollToBottomBtn';
import axios from 'axios';
import Header from './RoomHeader';
import Inputs from './Input';
import { CircularProgress } from '@mui/material';

function Room() {
    const userDbId = useSelector(({ root }) => root.userDbId);
    const groupAPIPath = useSelector(({ root }) => root.APIs.groups);
    const group = useContext(Context);
    const [messages, setMessages] = useState<Conversation>([]);
    const msgContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollTop = useRef(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleScrollToBottom = () => {
            setTimeout(() => {
                if (msgContainerRef.current) {
                    msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
                    prevScrollTop.current = msgContainerRef.current.scrollHeight;
                }
            }, 100);
        };
        window.addEventListener('scrollToBottom', handleScrollToBottom);

        msgContainerRef.current?.addEventListener('scroll', () => {
            if (msgContainerRef.current) {
                const scrollBtn = document.getElementById('scrollBtn');
                const scrollTop = msgContainerRef.current.scrollTop;

                if (scrollTop > prevScrollTop.current) {
                    scrollBtn!.style.transform = 'translateY(0)';
                } else if (scrollTop < prevScrollTop.current) {
                    scrollBtn!.style.transform = 'translateY(48px)';
                }
                setTimeout(() => {
                    prevScrollTop.current = scrollTop;
                }, 10);
                const scrolledToBottom =
                    msgContainerRef.current.scrollHeight -
                        Math.round(msgContainerRef.current.scrollTop) -
                        msgContainerRef.current.clientHeight <=
                    100;
                if (scrolledToBottom) {
                    scrollBtn!.style.transform = 'translateY(48px)';
                }
            }
        });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${groupAPIPath}/${group?.id}/messages`).then((res) => {
            setMessages(res.data);
            setIsLoading(false);
        });
    }, [group]);

    return (
        <div css={styles.container} className="border-r border-solid border-color">
            <Header />
            <div css={styles.body} className="relative">
                <div css={styles.msgWrapper} ref={msgContainerRef}>
                    {isLoading ? (
                        <div className="flex justify-center h-full items-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        messages.map((elem, index) => {
                            if (elem.senderId === userDbId) {
                                if (elem.message.type === 'text')
                                    return <TextMessageRight key={index}>{elem.message.content}</TextMessageRight>;
                                else if (elem.message.type === 'image')
                                    return <PictureMessageRight key={index} imgUri={elem.message.content} />;
                                else if (elem.message.type === 'icon')
                                    return <ActiveEmojiMessageRight key={index} imgUri={elem.message.content} />;
                                else if (elem.message.type === 'file')
                                    return (
                                        <FileMessageRight
                                            key={index}
                                            uri={elem.message.content}
                                            filename={getFilename(elem.message.content)}
                                        />
                                    );
                            } else {
                                if (elem.message.type === 'text')
                                    return (
                                        <TextMessageLeft
                                            senderName={group!.name}
                                            senderAvatar={group!.avatarUrl}
                                            key={index}
                                        >
                                            {elem.message.content}
                                        </TextMessageLeft>
                                    );
                                else if (elem.message.type === 'image')
                                    return (
                                        <PictureMessageLeft
                                            senderName={group!.name}
                                            senderAvatar={group!.avatarUrl}
                                            key={index}
                                            imgUri={elem.message.content}
                                        />
                                    );
                                else if (elem.message.type === 'icon')
                                    return (
                                        <ActiveEmojiMessageLeft
                                            senderName={group!.name}
                                            senderAvatar={group!.avatarUrl}
                                            key={index}
                                            imgUri={elem.message.content}
                                        />
                                    );
                                else if (elem.message.type === 'file')
                                    return (
                                        <FileMessageLeft
                                            senderName={group!.name}
                                            senderAvatar={group!.avatarUrl}
                                            key={index}
                                            uri={elem.message.content}
                                            filename={getFilename(elem.message.content)}
                                        />
                                    );
                            }
                        })
                    )}
                </div>
                <ScrollToBottomBtn />
            </div>
            <Inputs messages={messages} setMessages={setMessages} />
        </div>
    );
}

const styles = {
    container: css`
        flex: 2;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        position: relative;
    `,
    body: css`
        flex: 1;
        overflow: hidden;
        background-color: var(--bg-color);
    `,
    msgWrapper: css`
        padding: 12px;
        height: 100%;
        scroll-behavior: smooth;
        overflow: auto;
    `,
};

export default Room;
