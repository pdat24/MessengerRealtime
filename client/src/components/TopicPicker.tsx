/**@jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { css } from '@emotion/react';
import { Dispatch, SetStateAction } from 'react';
import scss from '../views/layouts/ChatRoom/chatroom.module.scss';
import { topics } from '~/utils/vars';
import { useDispatch } from 'react-redux';
import { setTopic } from '~/utils/redux/rootSlice';

interface ITopicPicker {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function TopicPicker({ open, setOpen }: ITopicPicker) {
    const dispatch = useDispatch();
    const handlePick = (topic: string) => {
        dispatch(setTopic(topic));
        setOpen(false);
    };

    return (
        <div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box css={styles.container}>
                    <div css={styles.header} className="mb-3">
                        <h3 className="text-center font-medium flex-grow color-black">Chủ đề</h3>
                        <div className={scss.btn} onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        {topics.map((topic, index) => (
                            <div css={styles.topicCircleWrapper} key={index} onClick={() => handlePick(topic)}>
                                <div
                                    css={css`
                                        ${styles.topicCircle};
                                        background: ${topic};
                                    `}
                                ></div>
                            </div>
                        ))}
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

const styles = {
    container: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background-color: var(--bg-color);
        box-shadow: 24px;
        padding: 16px;
        border-radius: 8px;
        border: none;
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    topicCircle: css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
    `,
    topicCircleWrapper: css`
        border-radius: 16px;
        transition: all 0.15s ease;
        cursor: pointer;
        padding: 12px;

        &:hover {
            background-color: var(--bg-hover);
        }
    `,
};
