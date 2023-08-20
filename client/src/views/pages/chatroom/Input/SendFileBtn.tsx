/** @jsxImportSource @emotion/react */
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import scss from '../chatroom.module.scss';
import clsx from 'clsx';
import { Tooltip } from '@mui/material';
import { useContext, useRef } from 'react';
// import FileMessage from '~/components/FileMessage';
import scrollToTop from './scrollToTop';
import { v4 } from 'uuid';
import { Message } from '~/utils/types';
import { Context } from '../ChatRoomContext';
import { useSelector } from 'react-redux';
import { ITextInput } from './inputTypes';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import storage from '~/firebase/storage';
import axios from 'axios';

export default function SendFileBtn({ setMessages }: ITextInput) {
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const conversationAPI: string = useSelector(({ root }) => root.APIs.conversation);
    const chatRoomInfo = useContext(Context);
    const fileInput = useRef<HTMLInputElement>(null);
    const handleSendFile = async () => {
        if (fileInput.current?.files) {
            const newPicture = fileInput.current.files[0];
            const fileUrlTail = `_${newPicture.name}_${v4()}`;

            // upload to firebase
            await uploadBytes(ref(storage, 'files/' + fileUrlTail), newPicture);
            const files = await listAll(ref(storage, 'files'));

            for (const file of files.items) {
                const fileUrl = await getDownloadURL(file);
                if (fileUrl.includes(fileUrlTail)) {
                    const newMessage: Message = {
                        senderId: userDbId,
                        message: {
                            content: fileUrl,
                            type: 'file',
                        },
                    };

                    // update UI
                    setMessages((messages) => [...messages, newMessage]);
                    scrollToTop();
                    fileInput.current.value = '';

                    // upload to database
                    await axios.post(`${conversationAPI}/${chatRoomInfo?.conversionId}`, newMessage, {
                        headers: { 'Content-Type': 'Application/json' },
                    });
                }
            }
        }
    };
    return (
        <Tooltip placement="top" title="Đính kèm file" arrow>
            <label className={scss.btn}>
                <AttachFileOutlinedIcon className={clsx(scss.icon, 'fs-22')} />
                <input
                    ref={fileInput}
                    onChange={handleSendFile}
                    type="file"
                    name="AttachedFile"
                    id="AttachedFile"
                    className="hidden"
                />
            </label>
        </Tooltip>
    );
}
