export default function scrollToTop() {
    window.dispatchEvent(new CustomEvent('scrollToTop'));
}
