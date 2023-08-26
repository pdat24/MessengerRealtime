export default function scrollToBottom() {
    window.dispatchEvent(new CustomEvent('scrollToBottom'));
}
