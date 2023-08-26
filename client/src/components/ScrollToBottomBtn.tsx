/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SouthIcon from '@mui/icons-material/South';

export default function ScrollToBottomBtn() {
    const wrapperStyle = css`
        bottom: 10px;
        left: calc(50% - 18px);
        background: var(--secondary-color2);
        transition: all 200ms ease;
        transform: translateY(48px);
        border: 1px solid var(--secondary-color3);
        opacity: 0.7;
    `;
    const iconStyle = css`
        font-size: 20px;
    `;
    const handleClick = () => {
        window.dispatchEvent(new CustomEvent('scrollToBottom'));
    };
    return (
        <div
            id="scrollBtn"
            onClick={handleClick}
            className="rounded-full w-9 h-9 flex justify-center items-center absolute cursor-pointer"
            css={wrapperStyle}
        >
            <SouthIcon css={iconStyle} />
        </div>
    );
}
