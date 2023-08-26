/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import scss from '../../layouts/layout.module.scss';
import { css } from '@emotion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import GroupBox from '~/components/GroupBox';
import CreateGroupBtn from './CreateGroupBtn';
import { setActiveGroupRoom, setGroupList } from '~/utils/redux/rootSlice';
import { CircularProgress } from '@mui/material';
import { IGroupBox } from '~/utils/types';
import JoinGroup from './JoinGroup';

function Groups() {
    const dispatch = useDispatch();
    const searchWrapper = useRef<HTMLDivElement>(null);
    const bodyDOM = useRef<HTMLDivElement>(null);
    const groupsAPIPath = useSelector(({ root }) => root.APIs.groups);
    const groupList = useSelector(({ root }) => root.groupList);
    const userDbId = useSelector(({ root }) => root.userDbId);
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState<IGroupBox[]>([]);
    const activeGroupRoom = useSelector(({ root }) => root.activeGroupRoom);

    const handleOpenGroupChatRoom = (group: IGroupBox) => {
        dispatch(setActiveGroupRoom(group.id));
        window.dispatchEvent(
            new CustomEvent('openGroupChatRoom', {
                detail: group,
            })
        );
    };

    useEffect(() => {
        // handle scroll
        bodyDOM.current!.onscroll = () => {
            if (bodyDOM.current!.scrollTop > 0) {
                searchWrapper.current?.classList.add('border-b', 'border-solid', 'border-color');
            } else {
                searchWrapper.current?.classList.remove('border-b', 'border-solid', 'border-color');
            }
        };
        if (groups.length) {
            handleOpenGroupChatRoom(groups[0]);
        }
    }, [groups]);

    useMemo(() => {
        // data fetching
        (async () => {
            if (groupList.length === 0) {
                const groupsId = (await axios.get(`${groupsAPIPath}/of/${userDbId}`)).data;
                const groupsData = (
                    await axios.post(`${groupsAPIPath}/data`, {
                        groupsId,
                    })
                ).data;
                dispatch(setGroupList(groupsData));
                setGroups(groupsData);
                setIsLoading(false);
            } else {
                setGroups(groupList);
                setIsLoading(false);
            }
        })();
    }, [groupList]);

    return (
        <div className={clsx(scss.chatContainer, 'border-r border-solid border-color')}>
            <div className={scss.header} ref={searchWrapper}>
                <h3 css={styles.title}>Groups</h3>
                <div className="mx-3 pb-3 flex items-center">
                    <div className={clsx(scss.searchBar, 'flex-grow me-3')}>
                        <SearchIcon css={styles.searchIcon} />
                        <input
                            className="bg-transparent px-2 border-0 outline-0 flex-grow text-sm"
                            type="search"
                            placeholder="Tìm kiếm trên Messenger"
                        />
                    </div>
                    <CreateGroupBtn />
                </div>
                <JoinGroup />
            </div>
            <div className={scss.body} ref={bodyDOM}>
                <div className="p-1.5">
                    <h5 className="mx-3 mb-2 mt-1 text-lg font-medium">Nhóm</h5>
                    <div>
                        {isLoading ? (
                            <div className="flex justify-center my-4">
                                <CircularProgress />
                            </div>
                        ) : groups.length !== 0 ? (
                            groups.map((group, index) => (
                                <GroupBox
                                    handleOpenGroupChatRoom={() => handleOpenGroupChatRoom(group)}
                                    conversationId={group.conversationId}
                                    members={group.members}
                                    key={index}
                                    avatarUrl={group.avatarUrl}
                                    id={group.id}
                                    name={group.name}
                                    activeGroupRoom={activeGroupRoom === group.id}
                                />
                            ))
                        ) : (
                            <p className="text-center text-sm italic mt-5">Bạn chưa tham gia nhóm chat!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    title: css`
        font-weight: bold;
        margin: 10px;
        margin-left: 24px;
        font-size: 24px;
    `,
    searchIcon: css`
        font-size: 20px;
    `,
};

export default Groups;
