/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import style from './layout.module.scss';
import { css } from '@emotion/react';
import ChatBox from '~/components/ChatBox';
import { useEffect, useRef } from 'react';
import generateBot from '~/utils/generateBot';
import { IChatBox } from '~/utils/types';

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
    const searchWrapper = useRef<HTMLDivElement>(null);
    const bodyDOM = useRef<HTMLDivElement>(null);
    const firstChatBox = useRef<IChatBox>();

    useEffect(() => {
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
                    <h6 className="mx-3 mb-1 text-sm font-medium">Máy ngẫu nhiên</h6>
                    {generateBot().map((bot, index) => {
                        if (index === 0) firstChatBox.current = bot;
                        return (
                            <ChatBox
                                name={bot.name}
                                newMsg={bot.newMsg}
                                avatar={bot.avatar}
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
