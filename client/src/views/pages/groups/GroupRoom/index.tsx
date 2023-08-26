/**@jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import Room from './room';
import { IGroupBox } from '~/utils/types';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { css } from '@emotion/react';
import RoomContext from './RoomContext';
import Profile from './profile';

function GroupRoom() {
    const [open, setOpen] = useState(false);
    const [group, setGroup] = useState<IGroupBox>({
        name: '',
        avatarUrl: '',
        id: '',
        conversationId: '',
        members: [],
    });

    useEffect(() => {
        window.addEventListener('openGroupChatRoom', (e: CustomEventInit) => {
            setOpen(true);
            setGroup(e.detail as IGroupBox);
        });
    }, []);

    return open ? (
        <RoomContext value={group}>
            <div className="flex overflow-hidden">
                <Room />
                <Profile />
            </div>
        </RoomContext>
    ) : (
        <div className="h-full w-full flex justify-center items-center">
            <div className="flex items-center flex-col">
                <QuestionAnswerOutlinedIcon css={styles.icon} />
                <div className="mt-2" css={styles.text}>
                    Chọn một hội thoại để tiếp tục
                </div>
            </div>
        </div>
    );
}

const styles = {
    text: css`
        color: var(--secondary-color);
        font-size: 20px;
        font-weight: 500;
    `,
    icon: css`
        font-size: 100px;
        path {
            color: var(--secondary-color);
        }
    `,
};

export default GroupRoom;
