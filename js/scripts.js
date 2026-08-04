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
       3. View Routing
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
        
        if (targetId === 'view-home') {
            setTimeout(initChartPagination, 50);
        }
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
    if (chartTrack) {
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
        
        const formattedTotal = '₹' + totalAmount.toLocaleString('en-IN');
        
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
       6. Notification Bar Minimize Animation
       ========================================================================== */
    const closeBtn = document.getElementById('close-notification');
    const notificationBar = document.getElementById('urgency-notification');
    const targetIcon = document.getElementById('notif-btn');
    
    if (closeBtn && notificationBar && targetIcon) {
        closeBtn.addEventListener('click', () => {
            const barRect = notificationBar.getBoundingClientRect();
            const targetRect = targetIcon.getBoundingClientRect();
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            
            const originX = targetCenterX - barRect.left;
            const originY = targetCenterY - barRect.top;
            
            notificationBar.style.transformOrigin = `${originX}px ${originY}px`;
            notificationBar.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease';
            notificationBar.style.transform = 'scale(0)';
            notificationBar.style.opacity = '0';
            notificationBar.style.pointerEvents = 'none';
            
            setTimeout(() => {
                notificationBar.style.transition = 'height 0.4s ease, margin 0.4s ease, padding 0.4s ease';
                notificationBar.style.height = '0px';
                notificationBar.style.margin = '0px';
                notificationBar.style.padding = '0px';
                notificationBar.style.border = 'none';
                notificationBar.style.overflow = 'hidden';
                
                setTimeout(() => {
                    notificationBar.remove();
                }, 400);
            }, 300);
        });
    }

    /* ==========================================================================
       7. Chart Pagination Logic (Updated for CSS Grid)
       ========================================================================== */
    function initChartPagination() {
        const chartViewport = document.querySelector('.clustered-chart-viewport');
        const prevBtn = document.getElementById('chart-prev');
        const nextBtn = document.getElementById('chart-next');
        
        if (!chartViewport || !prevBtn || !nextBtn) return;
        
        const updateArrowStates = () => {
            const maxScrollLeft = chartViewport.scrollWidth - chartViewport.clientWidth;
            prevBtn.disabled = chartViewport.scrollLeft <= 5;
            nextBtn.disabled = chartViewport.scrollLeft >= maxScrollLeft - 10;
        };
        
        prevBtn.onclick = () => {
            chartViewport.scrollBy({ 
                left: -chartViewport.clientWidth * 0.9, /* 90% scroll ensures safe snapping */
                behavior: 'smooth' 
            });
        };
        
        nextBtn.onclick = () => {
            chartViewport.scrollBy({ 
                left: chartViewport.clientWidth * 0.9, /* 90% scroll ensures safe snapping */
                behavior: 'smooth' 
            });
        };
        
        chartViewport.removeEventListener('scroll', updateArrowStates);
        chartViewport.addEventListener('scroll', updateArrowStates);
        updateArrowStates();
    }
    
    setTimeout(initChartPagination, 100);
});