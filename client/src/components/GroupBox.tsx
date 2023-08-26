/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { IGroupBox } from '~/utils/types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupList } from '~/utils/redux/rootSlice';

interface IType extends IGroupBox {
    handleOpenGroupChatRoom: () => void;
    activeGroupRoom?: boolean;
}

function GroupBox({ avatarUrl, name, id, handleOpenGroupChatRoom, activeGroupRoom }: IType) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('Sao chép');
    const [avatar, setAvatar] = useState(avatarUrl);
    const [groupName, setGroupName] = useState(name);
    const groupList = useSelector(({ root }) => root.groupList) as IGroupBox[];

    const handleCopyId = () => {
        navigator.clipboard.writeText(id);
        setTitle('Đã sao chép');
        setTimeout(() => setTitle('Sao chép'), 1000);
    };
    useEffect(() => {
        window.addEventListener('changeGroupAvatar', (e: CustomEventInit) => {
            const data = e.detail as {
                newAvatar: string;
                groupId: string;
            };
            if (id === data.groupId) {
                setAvatar(data.newAvatar);
                const newGroups: IGroupBox[] = groupList.map((g) => {
                    if (g.id === data.groupId) {
                        return { ...g, avatarUrl: data.newAvatar };
                    } else return g;
                });
                dispatch(setGroupList(newGroups));
            }
        });
        window.addEventListener('changeGroupName', (e: CustomEventInit) => {
            const data = e.detail as {
                newName: string;
                groupId: string;
            };
            if (id === data.groupId) {
                setGroupName(data.newName);
                const newGroups: IGroupBox[] = groupList.map((g) => {
                    if (g.id === data.groupId) {
                        return { ...g, name: data.newName };
                    } else return g;
                });
                dispatch(setGroupList(newGroups));
            }
        });
    }, []);

    return (
        <div
            css={styles.container}
            onClick={handleOpenGroupChatRoom}
            style={
                activeGroupRoom
                    ? {
                          backgroundColor: 'var(--bg-hover)',
                          outline: '1px solid var(--secondary-color2)',
                      }
                    : {}
            }
        >
            <div className="flex gap-2 items-center w-full">
                <img src={avatar} alt="avatar" css={styles.avatar} className="shrink-0" />
                <div className="overflow-hidden flex-grow">
                    <h6 css={styles.name} className="mb-1">
                        {groupName}
                    </h6>
                    <div className="flex items-baseline">
                        <span css={styles.id}>ID: {id}</span>
                        <Tooltip title={title}>
                            <span role="button" onClick={handleCopyId}>
                                <ContentCopyIcon css={styles.copyIcon} />
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: css`
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 8px;
        justify-content: space-between;
        cursor: pointer;
        margin-bottom: 4px;
        &:hover {
            background-color: var(--bg-hover);
        }
    `,
    avatar: css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid #bbbbbb;
    `,
    name: css`
        font-size: 15px;
        line-height: 20px;
    `,
    id: css`
        white-space: nowrap;
        margin-right: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        color: #a3a3a3;
    `,
    copyIcon: css`
        font-size: 18px;
        path {
            color: #a3a3a3;
        }
    `,
};

export default GroupBox;
