/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import scss from './chatroom.module.scss';
import { Tooltip } from '@mui/material';
import TextMessageRight from '~/components/TextMessageRight';
import TextMessageLeft from '~/components/TextMessageLeft';
import PendingIcon from '@mui/icons-material/Pending';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Inputs from './Input';
import { Context } from './ChatRoomContext';
import { Conversation } from '~/utils/types';
import { useSelector } from 'react-redux';
import PictureMessageRight from '~/components/PictureMessageRight';
import FileMessageRight from '~/components/FileMessageRight';
import PictureMessageLeft from '~/components/PictureMessageLeft';
import FileMessageLeft from '~/components/FileMessageLeft';
import ActiveEmojiMessageRight from '~/components/ActiveEmojiMessageRight';
import ActiveEmojiMessageLeft from '~/components/ActiveEmojiMessageLeft';

const getFilename = (fileUrl: string) => {
    return fileUrl.split('_')[1];
};

function Header() {
    const [showProfile, setShowProfile] = useState(true);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const chatBox = useContext(Context);
    useMemo(() => {
        if (chatBox) {
            setName(chatBox.username);
            setAvatar(chatBox.avatarUrl);
        }
    }, [chatBox]);

    const handleToggleProfile = () => {
        window.dispatchEvent(new CustomEvent('toggleProfile'));
        setShowProfile(!showProfile);
    };

    return (
        <div css={styles.header} className="border-b border-solid border-color">
            <a className="flex items-center gap-2" href="#">
                <img src={avatar} alt="avatar" css={styles.avatar} />
                <div>
                    <div css={styles.name}>{name}</div>
                    <div css={styles.time}>Hoạt động 17 phút trước</div>
                </div>
            </a>
            <div className="flex items-center gap-1">
                <Tooltip placement="bottom" title="Bắt đầu gọi thoại" arrow>
                    <div className={scss.btn}>
                        <LocalPhoneIcon className={scss.icon} />
                    </div>
                </Tooltip>
                <Tooltip placement="bottom" title="Bắt đầu gọi video" arrow>
                    <div className={scss.btn}>
                        <VideocamRoundedIcon className={scss.icon} />
                    </div>
                </Tooltip>
                <div className={scss.btn} onClick={handleToggleProfile}>
                    {showProfile ? (
                        <PendingIcon className={scss.icon} />
                    ) : (
                        <MoreHorizRoundedIcon className={scss.icon} />
                    )}
                </div>
            </div>
        </div>
    );
}

function Room() {
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const chatBox = useContext(Context);
    const [messages, setMessages] = useState<Conversation>(chatBox!.conversation);
    const msgContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScrollToTop = () => {
            setTimeout(() => {
                msgContainerRef.current!.scrollTop = msgContainerRef.current!.scrollHeight;
            }, 100);
        };
        window.addEventListener('scrollToTop', handleScrollToTop);
        return () => {
            window.removeEventListener('scrollToTop', handleScrollToTop);
        };
    }, []);

    useMemo(() => {
        chatBox?.conversation && setMessages(chatBox.conversation);
    }, [chatBox]);

    return (
        <div css={styles.container} className="border-r border-solid border-color">
            <Header />
            <div css={styles.body}>
                <div css={styles.msgWrapper} ref={msgContainerRef}>
                    {messages.map((elem, index) => {
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
                                return <TextMessageLeft key={index}>{elem.message.content}</TextMessageLeft>;
                            else if (elem.message.type === 'image')
                                return <PictureMessageLeft key={index} imgUri={elem.message.content} />;
                            else if (elem.message.type === 'icon')
                                return <ActiveEmojiMessageLeft key={index} imgUri={elem.message.content} />;
                            else if (elem.message.type === 'file')
                                return (
                                    <FileMessageLeft
                                        key={index}
                                        uri={elem.message.content}
                                        filename={getFilename(elem.message.content)}
                                    />
                                );
                        }
                    })}
                </div>
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
    header: css`
        display: flex;
        justify-content: space-between;
        padding: 12px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        background-color: var(--bg-color);
        z-index: 1;
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
    avatar: css`
        border-radius: 50%;
        width: 36px;
        height: 36px;
        border: 1px solid #bbb;
    `,
    name: css`
        font-size: 15px;
        font-weight: bold;
        line-height: 20px;
    `,
    time: css`
        font-size: 13px;
        color: var(--secondary-color);
    `,
};

export default Room;
