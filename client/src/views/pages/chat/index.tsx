/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import style from '../../layouts/layout.module.scss';
import { css } from '@emotion/react';
import ChatBox from '~/components/ChatBox';
import { useEffect, useMemo, useRef, useState } from 'react';
import generateBot from '~/utils/functions/generateBot';
import { IChatBox, IFriendInfo } from '~/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setFefreshFriendList, setFriendList } from '~/utils/redux/rootSlice';
import { CircularProgress } from '@mui/material';

const title = css`
    font-weight: bold;
    margin: 10px;
    margin-left: 24px;
    font-size: 24px;
`;
const searchIcon = css`
    font-size: 20px;
`;

function Chat() {
    const dispatch = useDispatch();
    const searchWrapper = useRef<HTMLDivElement>(null);
    const bodyDOM = useRef<HTMLDivElement>(null);
    const firstChatBox = useRef<IChatBox>();
    const [friends, setFriends] = useState<IFriendInfo[]>([]);
    const friendAPI = useSelector(({ root }) => root.APIs.friends);
    const friendList = useSelector(({ root }) => root.friendList) as Array<IFriendInfo>;
    const conversationAPI = useSelector(({ root }) => root.APIs.conversation);
    const haveNewFriend = useSelector(({ root }) => root.haveNewFriend);
    const latestMessageAPIPath = useSelector(({ root }) => root.APIs.latestMessage);
    const userId = useSelector(({ root }) => root.userId);
    const userDbId = useSelector(({ root }) => root.userDbId);
    const [isLoading, setIsLoading] = useState(true);

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
        if (friendList.length === 0 || (haveNewFriend && userId)) {
            axios.get(`${friendAPI}/${userId}`).then((res) => {
                dispatch(setFriendList(res.data));
                setFriends(res.data);
                setIsLoading(false);
                dispatch(setFefreshFriendList(false));
            });
        } else {
            setFriends(friendList);
            setIsLoading(false);
        }
    }, []);

    const handleChooseConversion = async (friend: IFriendInfo) => {
        axios.put(`${latestMessageAPIPath}/${userDbId}/${friend.id}/read`);
        const res = await axios.get(`${conversationAPI}/${friend.conversationId}`);
        const chatRoomInfo: IChatBox = {
            username: friend.username,
            avatarUrl: friend.avatarUrl,
            conversation: res.data,
            conversionId: friend.conversationId,
            friendId: friend.id,
        };
        dispatch(
            setFriendList(
                friendList.map((f) => {
                    if (f.id === friend.id) {
                        return { ...f, read: true };
                    }
                    return f;
                })
            )
        );
        window.dispatchEvent(new CustomEvent('selectedAChat', { detail: chatRoomInfo }));
        window.dispatchEvent(new CustomEvent('scrollToBottom'));
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
                        {friends.length !== 0 || isLoading ? (
                            isLoading ? (
                                <div className="flex justify-center my-4">
                                    <CircularProgress />
                                </div>
                            ) : (
                                friends.map((friend, index) => (
                                    <div onClick={() => handleChooseConversion(friend)} key={index}>
                                        <ChatBox
                                            username={friend.username}
                                            latestMessage={friend.latestMessage}
                                            avatarUrl={friend.avatarUrl}
                                            read={friend.read}
                                            conversation={[]}
                                            friendId={friend.id}
                                        />
                                    </div>
                                ))
                            )
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
                                latestMessage={bot.latestMessage}
                                avatarUrl={bot.avatarUrl}
                                key={index}
                                read={Math.random() >= 0.5}
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
