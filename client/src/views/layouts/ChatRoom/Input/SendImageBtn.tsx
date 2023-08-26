/** @jsxImportSource @emotion/react */
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import scss from '../chatroom.module.scss';
import clsx from 'clsx';
import { Tooltip } from '@mui/material';
import scrollToBottom from './scrollToBottom';
import { useContext, useMemo, useRef } from 'react';
import { Context } from '../ChatRoomContext';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Message } from '~/utils/types';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import storage from '~/firebase/storage';
import { v4 } from 'uuid';
import { ITextInput } from './inputTypes';
import { useUpdateLatestMessage } from '~/utils/hooks';
import receiveOnlineMessage from '~/utils/functions/receiveOnlineMessage';
import { connection } from '~/utils/functions/chatOnline';

function SendImageBtn({ setMessages }: ITextInput) {
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const conversationAPI: string = useSelector(({ root }) => root.APIs.conversation);
    const chatRoomInfo = useContext(Context);
    const pictureInput = useRef<HTMLInputElement>(null);
    const updateLatestMessage = useUpdateLatestMessage();

    useMemo(() => {
        receiveOnlineMessage({
            type: 'image',
            onSetMessages: setMessages,
            onUpdateLatestMessage: updateLatestMessage,
        });
    }, []);

    const handleSendPicture = async () => {
        if (pictureInput.current?.files) {
            const newPicture = pictureInput.current.files[0];
            const pictureUrlTail = newPicture.name + v4();

            // update UI
            const newMessage: Message = {
                senderId: userDbId,
                message: {
                    content: URL.createObjectURL(newPicture),
                    type: 'image',
                },
            };
            setMessages((messages) => [...messages, newMessage]);
            scrollToBottom();
            pictureInput.current.value = '';
            if (chatRoomInfo?.friendId) {
                // update new message
                updateLatestMessage(newMessage, chatRoomInfo.friendId);
                // upload to firebase
                await uploadBytes(ref(storage, 'images/' + pictureUrlTail), newPicture);
                const pictures = await listAll(ref(storage, 'images'));

                for (const picture of pictures.items) {
                    const pictureUrl = await getDownloadURL(picture);
                    if (pictureUrl.includes(pictureUrlTail)) {
                        const newMessage: Message = {
                            senderId: userDbId,
                            message: {
                                content: pictureUrl,
                                type: 'image',
                            },
                        };
                        await axios.post(`${conversationAPI}/${chatRoomInfo?.conversionId}`, newMessage, {
                            headers: { 'Content-Type': 'Application/json' },
                        });
                        connection.send('SendPrivateMessage', userDbId, chatRoomInfo?.friendId, pictureUrl, 'image');
                    }
                }
            }
        }
    };
    return (
        <Tooltip placement="top" title="Chọn ảnh" arrow>
            <label htmlFor="PictureMessage" className={scss.btn}>
                <InsertPhotoOutlinedIcon className={clsx(scss.icon, 'fs-22')} />
                <input
                    ref={pictureInput}
                    onChange={handleSendPicture}
                    type="file"
                    name="PictureMessage"
                    id="PictureMessage"
                    className="hidden"
                    accept="image/*"
                />
            </label>
        </Tooltip>
    );
}

export default SendImageBtn;
