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
    
    // Create a central function for switching views so buttons work from anywhere
    function switchView(targetId) {
        if (!targetId) return;

        // Hide all views
        document.querySelectorAll('.page-view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show the target view
        const targetView = document.getElementById(targetId);
        if (targetView) targetView.classList.add('active');

        // Sync Sidebar active states
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    // Attach to any element with a data-target attribute (Sidebar OR Action buttons)
    document.querySelectorAll('[data-target]').forEach(item => {
        item.addEventListener('click', () => {
            switchView(item.getAttribute('data-target'));
        });
    });
    
    // Specific logic for "Contact Doctor" button
    const contactDocBtn = document.getElementById('contact-doc-btn');
    if (contactDocBtn) {
        contactDocBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const msgBtn = document.getElementById('msg-btn');
            // Trigger the messaging popover toggle
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
                        <!-- Applications -->
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${appCount}</span>
                            <div class="chart-bar bg-app" style="height: ${appHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Apps Booked</span>
                                <span class="tooltip-details">${appDates.join('<br>')}</span>
                            </div>
                        </div>
                        
                        <!-- Tests -->
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${testCount}</span>
                            <div class="chart-bar bg-test" style="height: ${testHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Tests Taken</span>
                                <span class="tooltip-details">${testDates.join('<br>')}</span>
                            </div>
                        </div>
                        
                        <!-- Medicines -->
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

});