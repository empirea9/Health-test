document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Theme Management (Dark/Light Toggle)
       ========================================================================== */
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn ? themeBtn.querySelector('.material-symbols-rounded') : null;

    if (themeBtn && themeIcon) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            if (document.body.classList.contains('light-theme')) {
                themeIcon.textContent = 'light_mode';
            } else {
                themeIcon.textContent = 'dark_mode';
            }
        });
    }

    /* ==========================================================================
       2. Popovers (Notifications & Messages)
       ========================================================================== */
    const popoverToggles = document.querySelectorAll('.popover-toggle');

    popoverToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const panel = toggle.nextElementSibling;
            const isActive = panel.classList.contains('active');

            document.querySelectorAll('.popover-panel.active').forEach(p => {
                if (p !== panel) p.classList.remove('active');
            });

            if (isActive) panel.classList.remove('active');
            else panel.classList.add('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.popover-container')) {
            document.querySelectorAll('.popover-panel.active').forEach(p => p.classList.remove('active'));
        }
    });

    /* ==========================================================================
       3. View Routing (Sidebar Navigation & Dashboard Action Buttons)
       ========================================================================== */
    function switchView(targetId) {
        if (!targetId) return;

        document.querySelectorAll('.page-view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(targetId);
        if (targetView) targetView.classList.add('active');

        document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('[data-target]').forEach(item => {
        item.addEventListener('click', () => {
            switchView(item.getAttribute('data-target'));
        });
    });

    const contactDocBtn = document.getElementById('contact-doc-btn');
    if (contactDocBtn) {
        contactDocBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const msgBtn = document.getElementById('msg-btn');
            if (msgBtn) msgBtn.click();
        });
    }

    /* ==========================================================================
       4. Clustered Column Chart Generator
       ========================================================================== */
    const chartTrack = document.getElementById('home-main-chart');
    const prevBtn = document.getElementById('chart-prev');
    const nextBtn = document.getElementById('chart-next');

    if (chartTrack && prevBtn && nextBtn) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const medsDatabase = ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 'Saline', 'Aspirin', 'Insulin', 'Omeprazole'];
        let chartHTML = '';

        months.forEach(month => {
            const appCount = Math.floor(Math.random() * 5) + 2;
            const testCount = Math.floor(Math.random() * 4) + 1;
            const medCount = Math.floor(Math.random() * 5) + 2;

            const appHeight = (appCount / 7) * 75 + 10;
            const testHeight = (testCount / 7) * 75 + 10;
            const medHeight = (medCount / 7) * 75 + 10;

            let appDates = [];
            for (let i = 0; i < appCount; i++) {
                appDates.push(`${month} ${Math.floor(Math.random() * 28) + 1}`);
            }
            appDates.sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]));

            let testDates = [];
            for (let i = 0; i < testCount; i++) {
                testDates.push(`${month} ${Math.floor(Math.random() * 28) + 1}`);
            }
            testDates.sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]));

            let medList = [];
            for (let i = 0; i < medCount; i++) {
                let randomMed = medsDatabase[Math.floor(Math.random() * medsDatabase.length)];
                let randomQty = Math.floor(Math.random() * 40) + 5;
                medList.push(`${randomMed} x${randomQty}`);
            }

            chartHTML += `
                <div class="chart-month-group">
                    <div class="month-bars">
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${appCount}</span>
                            <div class="chart-bar bg-app" style="height: ${appHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Apps Booked</span>
                                <span class="tooltip-details">${appDates.join('<br>')}</span>
                            </div>
                        </div>
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${testCount}</span>
                            <div class="chart-bar bg-test" style="height: ${testHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Tests Taken</span>
                                <span class="tooltip-details">${testDates.join('<br>')}</span>
                            </div>
                        </div>
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${medCount}</span>
                            <div class="chart-bar bg-med" style="height: ${medHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Purchased</span>
                                <span class="tooltip-details">${medList.join('<br>')}</span>
                            </div>
                        </div>
                    </div>
                    <span class="month-label">${month}</span>
                </div>
            `;
        });

        chartTrack.innerHTML = chartHTML;

        let currentPage = 0;

        function updateChartPagination() {
            if (currentPage === 0) {
                chartTrack.style.transform = 'translateX(0)';
                prevBtn.disabled = true;
                nextBtn.disabled = false;
            } else {
                chartTrack.style.transform = 'translateX(-50%)';
                prevBtn.disabled = false;
                nextBtn.disabled = true;
            }
        }

        prevBtn.addEventListener('click', () => {
            currentPage = 0;
            updateChartPagination();
        });

        nextBtn.addEventListener('click', () => {
            currentPage = 1;
            updateChartPagination();
        });
    }

    /* ==========================================================================
       5. Interactive Donut Chart
       ========================================================================== */
    const donutSegments = document.querySelectorAll('.donut-segment');
    const donutHoverTitle = document.getElementById('donut-hover-title');
    const donutHoverAmount = document.getElementById('donut-hover-amount');
    const donutContainer = document.querySelector('.interactive-donut-container');

    if (donutSegments.length > 0 && donutHoverTitle && donutHoverAmount) {
        let totalAmount = 0;
        donutSegments.forEach(segment => {
            const rawAmount = segment.getAttribute('data-amount').replace(/[^\d]/g, '');
            if (rawAmount) totalAmount += parseInt(rawAmount, 10);
        });

        const formattedTotal = ' ' + totalAmount.toLocaleString('en-IN');
        const resetDonut = () => {
            donutHoverTitle.textContent = 'Total Spent';
            donutHoverAmount.textContent = formattedTotal;
            donutHoverTitle.parentElement.style.opacity = '1';
        };

        resetDonut();

        donutSegments.forEach(segment => {
            segment.addEventListener('mouseover', () => {
                donutHoverTitle.textContent = segment.getAttribute('data-title');
                donutHoverAmount.textContent = segment.getAttribute('data-amount');
            });
        });

        if (donutContainer) {
            donutContainer.addEventListener('mouseleave', resetDonut);
        }
    }

   /* ==========================================================================
       6. Notification Bar Minimize Animation (Refined)
       ========================================================================== */
    const closeBtn = document.getElementById('close-notification');
    const notificationBar = document.getElementById('urgency-notification');
    const targetIcon = document.getElementById('notif-btn'); 

    if (closeBtn && notificationBar && targetIcon) {
        closeBtn.addEventListener('click', () => {
            // 1. Get positions
            const barRect = notificationBar.getBoundingClientRect();
            const targetRect = targetIcon.getBoundingClientRect();

            // 2. Find the exact center of the target icon
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;

            // 3. Calculate where that target is relative to the notification bar
            const originX = targetCenterX - barRect.left;
            const originY = targetCenterY - barRect.top;

            // 4. Set the transform origin to the target icon's relative position
            notificationBar.style.transformOrigin = `${originX}px ${originY}px`;
            
            // 5. Apply the iOS bezier curve and scale to 0 to "suck it in"
            notificationBar.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease';
            notificationBar.style.transform = 'scale(0)';
            notificationBar.style.opacity = '0';
            notificationBar.style.pointerEvents = 'none'; 

            // 6. Smoothly collapse the empty space left behind
            setTimeout(() => {
                notificationBar.style.transition = 'height 0.4s ease, margin 0.4s ease, padding 0.4s ease';
                notificationBar.style.height = '0px';
                notificationBar.style.margin = '0px';
                notificationBar.style.padding = '0px';
                notificationBar.style.border = 'none';
                notificationBar.style.overflow = 'hidden';
                
                // Remove from DOM once collapsed
                setTimeout(() => {
                    notificationBar.remove();
                }, 400);
                
            }, 300); // Trigger collapse slightly before scale animation fully finishes
        });
    }
});