import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar0,
    avatar9,
    avatar10,
    avatar11,
    avatar7,
    avatar8,
} from '~/assets/imgs/avatars';
import noAvatar from '~/assets/imgs/no-avatar.png';
import botName from './botname.json';
import { IChatBox } from './types';

const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar0,
    avatar9,
    avatar10,
    noAvatar,
    avatar11,
    avatar7,
    avatar8,
];

function generateBot() {
    const bots: IChatBox[] = [];
    for (let i = 1; i <= 15; i++) {
        bots.push({
            username: botName[Math.round(Math.random() * (botName.length - 1))],
            avatarUrl: avatars[Math.round(Math.random() * (avatars.length - 1))],
            newMessage: "Hi developer! I'm a bot.",
            conversation: [],
        });
    }
    return bots;
}

export default generateBot;
