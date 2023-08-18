/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';

function TextMessageLeft({ children }: { children: string }) {
    return (
        <div css={styles.container}>
            <span css={styles.text}>{children}</span>
        </div>
    );
}

const styles = {
    container: css`
        padding: 4px 12px;
        border-radius: 20px;
        width: fit-content;
        max-width: 90%;
        margin-bottom: 2px;
        margin-right: auto;
        background-color: var(--leftmsg-bg);
    `,
    text: css`
        color: var(--text-color);
        font-size: 14px;
    `,
};

export default TextMessageLeft;
