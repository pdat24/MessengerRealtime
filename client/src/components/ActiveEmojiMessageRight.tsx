/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';

function ActiveEmojiMessageRight({ imgUri }: { imgUri: string }) {
    return (
        <img
            alt="picture"
            src={imgUri}
            className="ms-auto my-1"
            css={css`
                width: 40px;
            `}
        />
    );
}

export default ActiveEmojiMessageRight;
