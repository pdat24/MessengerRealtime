/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import style from './layout.module.scss';
import { css } from '@emotion/react';
import ChatBox from '~/components/ChatBox';
import { useEffect, useMemo, useRef, useState } from 'react';
import generateBot from '~/utils/generateBot';
import { IChatBox } from '~/utils/types';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const title = css`
    font-weight: bold;
    margin: 10px;
    margin-left: 24px;
    font-size: 24px;
`;
const searchIcon = css`
    font-size: 20px;
`;
interface IFriend {
    username: string;
    avatarUrl: string;
    conversationId: string;
}

function Chat() {
    const searchWrapper = useRef<HTMLDivElement>(null);
    const bodyDOM = useRef<HTMLDivElement>(null);
    const firstChatBox = useRef<IChatBox>();
    const [friends, setFriends] = useState<IFriend[]>([]);
    const friendAPI = useSelector(({ root }) => root.APIs.friends);
    const conversionAPI = useSelector(({ root }) => root.APIs.conversation);
    const userId = useSelector(({ root }) => root.userId);

    useEffect(() => {
        // handle scroll
        bodyDOM.current!.onscroll = () => {
            if (bodyDOM.current!.scrollTop > 0) {
                searchWrapper.current?.classList.add('border-b', 'border-solid', 'border-color');
            } else {
                searchWrapper.current?.classList.remove('border-b', 'border-solid', 'border-color');
            }
        };
        window.onload = () => {
            window.dispatchEvent(new CustomEvent('selectedAChat', { detail: firstChatBox.current }));
        };
    }, []);

    useMemo(() => {
        // data fetching
        axios.get(`${friendAPI}/${userId}`).then((res) => {
            setFriends(res.data);
        });
    }, []);

    const handleChooseConversion = async (friend: IFriend) => {
        const res = await axios.get(`${conversionAPI}/${friend.conversationId}`);
        const chatRoomInfo: IChatBox = {
            username: friend.username,
            avatarUrl: friend.avatarUrl,
            conversation: res.data,
            newMessage: 'Fucking',
            unread: false,
            conversionId: friend.conversationId,
        };
        window.dispatchEvent(new CustomEvent('selectedAChat', { detail: chatRoomInfo }));
    };

    return (
        <div className={clsx(style.chatContainer, 'border-r border-solid border-color')}>
            <div className={style.header}>
                <h3 css={title}>Chat</h3>
                <div className="mx-3 pb-3" ref={searchWrapper}>
                    <div className={style.searchBar}>
                        <SearchIcon css={searchIcon} />
                        <input
                            className="bg-transparent px-2 border-0 outline-0 flex-grow text-sm"
                            type="search"
                            placeholder="Tìm kiếm trên Messenger"
                        />
                    </div>
                </div>
            </div>
            <div className={style.body} ref={bodyDOM}>
                <div className="p-1.5">
                    <h5 className="mx-3 mb-2 mt-1 text-lg font-medium">Bạn bè</h5>
                    <div className="mb-7">
                        {friends.length ? (
                            friends.map((friend, index) => (
                                <div onClick={() => handleChooseConversion(friend)} key={index}>
                                    <ChatBox
                                        username={friend.username}
                                        newMessage={'Hello World'}
                                        avatarUrl={friend.avatarUrl}
                                        unread
                                        conversation={[]}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm italic mt-5">
                                Bạn chưa có người bạn nào!{' '}
                                <Link className="font-bold underline text-blue-600" to="/make-friend">
                                    Kết bạn?
                                </Link>
                            </p>
                        )}
                    </div>
                    <h5 className="mx-3 mb-2 mt-3 text-base font-medium">Máy ngẫu nhiên</h5>
                    {generateBot().map((bot, index) => {
                        if (index === 0) firstChatBox.current = bot;
                        return (
                            <ChatBox
                                username={bot.username}
                                newMessage={bot.newMessage}
                                avatarUrl={bot.avatarUrl}
                                key={index}
                                unread={Math.random() >= 0.5}
                                conversation={bot.conversation}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Chat;
