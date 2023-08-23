/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import style from '../../layouts/layout.module.scss';
import { useEffect, useState } from 'react';
import UserProposed from '~/components/UserProposed';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IUsers } from '~/utils/types';
import { CircularProgress } from '@mui/material';
import UserSentRequest from '~/components/UserSentRequest';

function EmptyList() {
    return (
        <div className="mb-7">
            <p className="text-center text-sm italic mt-5">Danh sách trống!</p>
        </div>
    );
}

function FriendRequests() {
    const friendRequestsAPIPath = useSelector(({ root }) => root.APIs.friendRequests);
    const userId = useSelector(({ root }) => root.userId);
    const [requestsSent, setRequestsSent] = useState<IUsers[]>([]);
    const [requestsReceived, setRequestsReceived] = useState<IUsers[]>([]);
    const [topIsLoading, setTopIsLoading] = useState(true);
    const [belowIsLoading, setBelowIsLoading] = useState(true);

    useEffect(() => {
        // user fetching
        axios.get(`${friendRequestsAPIPath}/${userId}/sent`).then((res) => {
            setTopIsLoading(false);
            setRequestsSent(res.data);
        });
        axios.get(`${friendRequestsAPIPath}/${userId}/received`).then((res) => {
            setBelowIsLoading(false);
            setRequestsReceived(res.data);
        });
    }, []);

    return (
        <div className={clsx(style.chatContainer, 'border-r border-solid border-color')}>
            <div className={style.body + ' p-1.5 pt-5'}>
                <div className="mb-12 mt-1">
                    <h5 className="mx-3 mb-2 text-lg font-medium">Yêu cầu đã gửi</h5>
                    {requestsSent.length !== 0 || topIsLoading ? (
                        <div>
                            {topIsLoading ? (
                                <div className="flex justify-center my-4">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div>
                                    {requestsSent.map((matchedUser, index) => (
                                        <UserProposed
                                            key={index}
                                            userDbId={matchedUser.userDbId}
                                            username={matchedUser.username}
                                            avatarUrl={matchedUser.avatarUrl}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyList />
                    )}
                </div>
                <div>
                    <h5 className="mx-3 mb-2 mt-1 text-lg font-medium">Yêu cầu đã nhận</h5>
                    {requestsReceived.length !== 0 || belowIsLoading ? (
                        <div>
                            {belowIsLoading ? (
                                <div className="flex justify-center my-4">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div>
                                    {requestsReceived.map((matchedUser, index) => (
                                        <UserSentRequest
                                            key={index}
                                            userDbId={matchedUser.userDbId}
                                            username={matchedUser.username}
                                            avatarUrl={matchedUser.avatarUrl}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyList />
                    )}
                </div>
            </div>
        </div>
    );
}

export default FriendRequests;
