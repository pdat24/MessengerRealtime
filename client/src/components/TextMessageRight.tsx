/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';

function TextMessageRight({ children }: { children: string }) {
    const topic = useSelector(({ root }) => root.topic);

    return (
        <div
            css={
                topic
                    ? [styles.container, { background: topic }]
                    : [styles.container, { backgroundColor: 'var(--purple-color)' }]
            }
        >
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
        margin-bottom: 3px;
        margin-left: auto;
        transition: all 500ms ease;
    `,
    text: css`
        color: #fff;
        font-size: 14px;
    `,
};

export default TextMessageRight;
