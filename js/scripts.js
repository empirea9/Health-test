document.addEventListener('DOMContentLoaded', () => {
    const shell = document.querySelector('.app-shell');
    const toggleButton = document.querySelector('.menu-toggle');

    if (!shell || !toggleButton) {
        return;
    }

    toggleButton.setAttribute('aria-expanded', 'false');
});

document.addEventListener('DOMContentLoaded', () => {
    const shell = document.querySelector('.app-shell');
    const toggleButton = document.querySelector('.menu-toggle');
    
    if (shell && toggleButton) {
        toggleButton.setAttribute('aria-expanded', 'false');
    }

    // Popover Logic
    const notifBtn = document.getElementById('notif-btn');
    const msgBtn = document.getElementById('msg-btn');
    const notifPanel = document.getElementById('notif-panel');
    const msgPanel = document.getElementById('msg-panel');

    function togglePanel(panelToShow, panelToHide) {
        // Hide the other panel if it's open
        if (panelToHide) {
            panelToHide.classList.remove('is-open');
            panelToHide.setAttribute('aria-hidden', 'true');
        }
        
        // Toggle the target panel
        const isOpen = panelToShow.classList.contains('is-open');
        if (isOpen) {
            panelToShow.classList.remove('is-open');
            panelToShow.setAttribute('aria-hidden', 'true');
        } else {
            panelToShow.classList.add('is-open');
            panelToShow.setAttribute('aria-hidden', 'false');
        }
    }

    if (notifBtn && notifPanel) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from firing
            togglePanel(notifPanel, msgPanel);
        });
    }

    if (msgBtn && msgPanel) {
        msgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel(msgPanel, notifPanel);
        });
    }

    // Prevent clicks inside the panel from closing it
    document.querySelectorAll('.popover-panel').forEach(panel => {
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Close panels when clicking outside
    document.addEventListener('click', () => {
        if (notifPanel) {
            notifPanel.classList.remove('is-open');
            notifPanel.setAttribute('aria-hidden', 'true');
        }
        if (msgPanel) {
            msgPanel.classList.remove('is-open');
            msgPanel.setAttribute('aria-hidden', 'true');
        }
    });
});

// Theme Toggle Logic
    const themeBtn = document.getElementById('theme-btn');
    
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('.material-symbols-rounded');
        
        themeBtn.addEventListener('click', () => {
            // Toggle the light-theme class on the body
            document.body.classList.toggle('light-theme');
            
            // Swap the icon based on the current theme
            if (document.body.classList.contains('light-theme')) {
                themeIcon.textContent = 'light_mode'; // Switch to sun icon
            } else {
                themeIcon.textContent = 'dark_mode'; // Switch to moon icon
            }
        });
    }

// SPA View Switching Logic
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const pageViews = document.querySelectorAll('.page-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active states from buttons
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide all views, then show the target
            pageViews.forEach(view => view.classList.remove('active'));
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if(targetView) {
                targetView.classList.add('active');
            }
        });
    });