document.addEventListener('DOMContentLoaded', () => {
    const shell = document.querySelector('.app-shell');
    const toggleButton = document.querySelector('.menu-toggle');

    if (!shell || !toggleButton) {
        return;
    }

    toggleButton.setAttribute('aria-expanded', 'false');
});