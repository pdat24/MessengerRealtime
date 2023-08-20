/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';

function ActiveEmojiMessageLeft({ imgUri }: { imgUri: string }) {
    return (
        <img
            alt="picture"
            src={imgUri}
            className="me-auto my-1"
            css={css`
                width: 40px;
            `}
        />
    );
}

export default ActiveEmojiMessageLeft;
