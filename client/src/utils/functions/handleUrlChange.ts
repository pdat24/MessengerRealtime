function onUrlChange() {
    const slug = location.href.split('/').at(-1);
    if (slug === 'groups') window.dispatchEvent(new CustomEvent('openGroupChat'));
    else if (slug === 'chat' || slug === '') window.dispatchEvent(new CustomEvent('openPrivateChat'));
}

function handleUrlChange() {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, { subtree: true, childList: true });
}

export default handleUrlChange;
