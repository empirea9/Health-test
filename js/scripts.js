document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
   1. Theme Management (Dark/Light Toggle)
   ========================================================================== */
const themeBtn = document.getElementById('theme-btn');
const themeIcon = themeBtn ? themeBtn.querySelector('.material-symbols-rounded') : null;

if (themeBtn && themeIcon) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeIcon.textContent = isLight ? 'light_mode' : 'dark_mode';

        // Update Map Tiles if map is loaded
        if (window.mapTileLayer) {
            const lightTiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
            const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
            window.mapTileLayer.setUrl(isLight ? lightTiles : darkTiles);
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
        document.body.classList.toggle('store-view-active', targetId === 'view-meds');
        
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

        // TRIGGER MAP INITIALIZATION / RESIZE FIX HERE
        if (targetId === 'view-maps') {
            initMap();
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
       4. Clustered Column Chart Generator (Static Data)
       ========================================================================== */
    const chartTrack = document.getElementById('home-main-chart');
    if (chartTrack) {
        // Hardcoded, realistic health data points to replace randomness
        const staticData = [
            { month: 'Jan', app: [5, 12], test: [15], meds: ['Paracetamol x1', 'Amoxicillin x1'] },
            { month: 'Feb', app: [10], test: [], meds: ['Ibuprofen x1'] },
            { month: 'Mar', app: [2, 22], test: [3], meds: ['Metformin x2'] },
            { month: 'Apr', app: [], test: [], meds: ['Omeprazole x1'] },
            { month: 'May', app: [14], test: [14], meds: ['Aspirin x1'] },
            { month: 'Jun', app: [8], test: [], meds: ['Insulin x2'] },
            { month: 'Jul', app: [4], test: [5], meds: ['Paracetamol x1', 'Ibuprofen x1'] },
            { month: 'Aug', app: [15, 25], test: [12, 16], meds: ['Amoxicillin x1'] },
            { month: 'Sep', app: [2], test: [], meds: ['Saline x2'] },
            { month: 'Oct', app: [11], test: [11], meds: ['Metformin x1', 'Insulin x1'] },
            { month: 'Nov', app: [7], test: [8], meds: ['Aspirin x1'] },
            { month: 'Dec', app: [1, 15], test: [1], meds: ['Ibuprofen x1', 'Paracetamol x1'] }
        ];
        
        let chartHTML = '';
        staticData.forEach(data => {
            const appCount = data.app.length;
            const testCount = data.test.length;
            const medCount = data.meds.length;
            
            // Map the height percentages logically based on low numerical counts
            const appHeight = appCount === 0 ? 5 : (appCount * 30) + 15;
            const testHeight = testCount === 0 ? 5 : (testCount * 30) + 15;
            const medHeight = medCount === 0 ? 5 : (medCount * 30) + 15;
            
            // Generate clean tooltip lists
            const appDates = appCount > 0 ? data.app.map(d => `${data.month} ${d}`).join('<br>') : 'None';
            const testDates = testCount > 0 ? data.test.map(d => `${data.month} ${d}`).join('<br>') : 'None';
            const medList = medCount > 0 ? data.meds.join('<br>') : 'None';
            
            chartHTML += `
                <div class="chart-month-group">
                    <div class="month-bars">
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${appCount}</span>
                            <div class="chart-bar bg-app" style="height: ${appHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Apps Booked</span>
                                <span class="tooltip-details">${appDates}</span>
                            </div>
                        </div>
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${testCount}</span>
                            <div class="chart-bar bg-test" style="height: ${testHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Tests Taken</span>
                                <span class="tooltip-details">${testDates}</span>
                            </div>
                        </div>
                        <div class="chart-bar-wrapper">
                            <span class="bar-value">${medCount}</span>
                            <div class="chart-bar bg-med" style="height: ${medHeight}%"></div>
                            <div class="tooltip">
                                <span class="tooltip-title">Purchased</span>
                                <span class="tooltip-details">${medList}</span>
                            </div>
                        </div>
                    </div>
                    <span class="month-label">${data.month}</span>
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
       6. Notification Bar Minimize Animation & Session Storage
       ========================================================================== */
    const closeBtn = document.getElementById('close-notification');
    const notificationBar = document.getElementById('urgency-notification');
    const targetIcon = document.getElementById('notif-btn');
    
    if (notificationBar) {
        // 1. Check local session on load
        if (sessionStorage.getItem('urgencyNotifClosed') === 'true') {
            notificationBar.style.display = 'none';
        } 
        // 2. Always bind the close button if it exists
        else if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Store the dismissed state in the current session
                sessionStorage.setItem('urgencyNotifClosed', 'true');
                
                // If the bell icon exists, animate into it
                if (targetIcon) {
                    const barRect = notificationBar.getBoundingClientRect();
                    const targetRect = targetIcon.getBoundingClientRect();
                    const targetCenterX = targetRect.left + targetRect.width / 2;
                    const targetCenterY = targetRect.top + targetRect.height / 2;
                    
                    const originX = targetCenterX - barRect.left;
                    const originY = targetCenterY - barRect.top;
                    
                    notificationBar.style.transformOrigin = `${originX}px ${originY}px`;
                    notificationBar.style.transform = 'scale(0)';
                    notificationBar.style.opacity = '0';
                    notificationBar.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        notificationBar.style.display = 'none';
                    }, 400); 
                } else {
                    // Fallback: Just fade out if the bell icon is missing
                    notificationBar.style.opacity = '0';
                    setTimeout(() => {
                        notificationBar.style.display = 'none';
                    }, 300);
                }
            });
        }
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
                left: -chartViewport.clientWidth * 0.9,
                behavior: 'smooth' 
            });
        };
        
        nextBtn.onclick = () => {
            chartViewport.scrollBy({ 
                left: chartViewport.clientWidth * 0.9,
                behavior: 'smooth' 
            });
        };
        
        chartViewport.removeEventListener('scroll', updateArrowStates);
        chartViewport.addEventListener('scroll', updateArrowStates);
        updateArrowStates();
    }
    
    setTimeout(initChartPagination, 100);

    /* ==========================================================================
       8. OpenStreetMap & Overpass Integration (MUJ - Instant Load + Cache)
       ========================================================================== */
    let mapInitialized = false;
    let leafletMap = null;
    const CACHE_KEY = 'muj_medical_places_cache';
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours

    // Known fallback facilities near MUJ
    const INSTANT_MUJ_FACILITIES = [
        { lat: 26.8425, lon: 75.5645, name: "MUJ Campus Medical Center / Infirmary", type: "Clinic", address: "Dome Building, MUJ Campus, Dahmi Kalan, Jaipur", status: { text: "Open 24/7 (On-Campus)", isOpen: true } },
        { lat: 26.8216987, lon: 75.5439261, name: "Bharadwaj Hospital", type: "Hospital", address: "Link Road, Bagru, Jaipur", status: { text: "Open 24/7 (Emergency Service)", isOpen: true } },
        { lat: 26.8189556, lon: 75.5427620, name: "Agrawal Heart and General Hospital", type: "Hospital", address: "H-158, Old RIICO, Link Road, Behind BSNL Tower, Bagru, Jaipur", status: { text: "Open 24/7 (Emergency Service)", isOpen: true } },
        { lat: 26.8186809, lon: 75.5431388, name: "Bagru Nursing Home", type: "Clinic", address: "Link Road, Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } },
        { lat: 26.8151992, lon: 75.5428853, name: "Government Hospital, Bagru", type: "Hospital", address: "Link Road, Near GSSS, Bagru, Jaipur", status: { text: "Open 24/7 (Emergency Service)", isOpen: true } },
        { lat: 26.8111712, lon: 75.5430211, name: "Baby Lon Hospital", type: "Hospital", address: "Ajmer Road, Bagru, Jaipur", status: { text: "Open 24/7 (Emergency Service)", isOpen: true } },
        { lat: 26.8155027, lon: 75.5433039, name: "Shree Balaji Clinic", type: "Clinic", address: "Adarsh Colony, Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } },
        { lat: 26.8092438, lon: 75.5558792, name: "ESI Dispensary", type: "Clinic", address: "Bagru Industrial Area, Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 17:00)", isOpen: true } },
        { lat: 26.8080340, lon: 75.5423741, name: "Sharma Homeopathic Clinic", type: "Clinic", address: "Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } },
        { lat: 26.8085604, lon: 75.5538166, name: "Namo Clinic", type: "Clinic", address: "Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } },
        { lat: 26.8241018, lon: 75.5440801, name: "Shri Shidhi Clinic", type: "Clinic", address: "Begus Road, Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } },
        { lat: 26.8087639, lon: 75.5539884, name: "Khushi Homoeopathic Clinic", type: "Clinic", address: "Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } },
        { lat: 26.8166904, lon: 75.5441492, name: "Balaji Homoeopathic Clinic", type: "Clinic", address: "Adarsh Colony, Bagru, Jaipur", status: { text: "Open Today (Est. 09:00 - 20:00)", isOpen: true } }
    ];

    function buildAddress(tags) {
        if (tags['addr:full']) return tags['addr:full'];
        const parts = [];
        if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:suburb'] || tags['suburb']) parts.push(tags['addr:suburb'] || tags['suburb']);
        if (tags['addr:city']) parts.push(tags['addr:city']);
        return parts.length > 0 ? parts.join(', ') : 'Dahmi Kalan / MUJ Area, Jaipur';
    }

    function evaluateOpeningHours(openingHoursStr, facilityType = '') {
        const typeLower = facilityType.toLowerCase();
        if (openingHoursStr) {
            const clean = openingHoursStr.trim();
            if (clean === '24/7') return { text: 'Open (24/7)', isOpen: true };
            const match = clean.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
            if (match) {
                const now = new Date();
                const currentMins = now.getHours() * 60 + now.getMinutes();
                const startMins = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
                const endMins = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
                const isOpen = currentMins >= startMins && currentMins <= endMins;
                return {
                    text: isOpen ? `Open Now (${clean})` : `Closed Now (${clean})`,
                    isOpen
                };
            }
            return { text: `${clean}`, isOpen: true };
        }
        if (typeLower.includes('hospital')) {
            return { text: 'Open 24/7 (Emergency Service)', isOpen: true };
        } else if (typeLower.includes('pharmacy')) {
            return { text: 'Open Today (Est. 08:00 - 22:00)', isOpen: true };
        } else {
            return { text: 'Open Today (Est. 09:00 - 20:00)', isOpen: true };
        }
    }

    function initMap() {
        const mapContainer = document.getElementById('osm-map');
        if (!mapContainer) return;
        
        if (mapInitialized && leafletMap) {
            setTimeout(() => leafletMap.invalidateSize(), 200);
            return;
        }

        const centerLat = 26.8439;
        const centerLng = 75.5652;
        leafletMap = L.map('osm-map').setView([centerLat, centerLng], 13);
        
        const isLightTheme = document.body.classList.contains('light-theme');
        const lightTiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        
        window.mapTileLayer = L.tileLayer(isLightTheme ? lightTiles : darkTiles, {
            maxZoom: 19,
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
        }).addTo(leafletMap);

        L.circle([centerLat, centerLng], {
            color: '#6D28D9',
            fillColor: '#6D28D9',
            fillOpacity: 0.05,
            radius: 8000
        }).addTo(leafletMap);

        const setSafeText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        // Facility Click Handler for Details Cards
        let currentFacilityCoords = { lat: 26.8425, lon: 75.5645 };

        const selectFacility = (name, type, address, statusInfo, lat = 26.8425, lon = 75.5645) => {
            currentFacilityCoords = { lat, lon };

            setSafeText('facility-name', name);
            setSafeText('facility-type', type);
            setSafeText('facility-status', statusInfo.text.replace(/^[^\w]+/, '').trim());
            setSafeText('facility-address', address);

            // Update Box Icon Wrapper with Dynamic Colors and Icons
            const iconWrapper = document.getElementById('facility-icon-wrapper');
            const iconSpan = document.getElementById('facility-icon');
            if (iconWrapper && iconSpan) {
                const typeLower = type.toLowerCase();
                iconWrapper.className = 'box-icon-wrapper'; // Reset class
                iconSpan.className = 'dynamic-facility-icon'; // Reset class
                
                if (typeLower.includes('hospital')) {
                    iconSpan.textContent = '+'; // Geometric bold plus
                    iconSpan.classList.add('hospital-plus-icon');
                    iconWrapper.classList.add('icon-type-hospital');
                } else if (typeLower.includes('clinic') || typeLower.includes('pharmacy') || typeLower.includes('dispensary')) {
                    iconSpan.textContent = 'pill'; // Material pill
                    iconSpan.classList.add('material-symbols-rounded');
                    iconWrapper.classList.add('icon-type-clinic');
                } else {
                    iconSpan.textContent = 'medical_services'; // Material suitcase
                    iconSpan.classList.add('material-symbols-rounded');
                    iconWrapper.classList.add('icon-type-default');
                }
            }

            // Update Timing Box and Dot
            const timingWrapper = document.getElementById('timing-wrapper');
            const statusDot = document.getElementById('facility-status-dot');
            
            if (timingWrapper && statusDot) {
                if (statusInfo.isOpen) {
                    statusDot.className = 'status-dot glowing open';
                    timingWrapper.className = 'box-icon-wrapper timing-open';
                } else {
                    statusDot.className = 'status-dot glowing closed';
                    timingWrapper.className = 'box-icon-wrapper timing-closed';
                }
            }

            // Map Buttons Interactivity
            const callBtn = document.getElementById('call-now-btn');
            if (callBtn) callBtn.onclick = () => alert(`Calling ${name}...`);

            const openMapsBtn = document.getElementById('open-maps-btn');
            if (openMapsBtn) {
                openMapsBtn.onclick = () => {
                    window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
                };
            }

            const bookBtn = document.getElementById('book-appointment-btn');
            if (bookBtn) {
                bookBtn.disabled = false;
                bookBtn.style.opacity = '1';
                bookBtn.onclick = () => alert(`Appointment request sent to ${name}!`);
            }
        };

        const addedMarkers = new Set();
        
        const addFastMarker = (lat, lon, name, type, address, statusInfo) => {
            const key = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
            if (addedMarkers.has(key)) return; 
            addedMarkers.add(key);
            
            const markerColor = type.toLowerCase().includes('hospital') ? '#DC2626' : 
                                 type.toLowerCase().includes('pharmacy') ? '#16A34A' : '#6D28D9';
                                 
            const marker = L.circleMarker([lat, lon], {
                radius: 8,
                fillColor: markerColor,
                color: '#FFFFFF',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(leafletMap);
            
            marker.bindPopup(`
                <div style="padding: 4px; font-family: inherit;">
                    <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${name}</h4>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${type}</p>
                    <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600;">${statusInfo.text}</p>
                    <button type="button" class="popup-book-btn"
                        style="background-color: ${markerColor}; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Book Appointment
                    </button>
                </div>
            `);
            
            marker.on('click', () => selectFacility(name, type, address, statusInfo, lat, lon));
            
            marker.on('popupopen', () => {
                const popupBtn = document.querySelector('.popup-book-btn');
                if (popupBtn) popupBtn.onclick = () => alert(`Appointment request sent to ${name}!`);
            });
        };

        // 1. Render Local Data Instantly
        INSTANT_MUJ_FACILITIES.forEach(item => {
            addFastMarker(item.lat, item.lon, item.name, item.type, item.address, item.status);
        });

        // 2. Check LocalStorage Cache
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        if (cachedDataStr) {
            try {
                const cached = JSON.parse(cachedDataStr);
                if (Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
                    cached.elements.forEach(item => addFastMarker(item.lat, item.lon, item.name, item.type, item.address, item.status));
                    mapInitialized = true;
                    setTimeout(() => leafletMap.invalidateSize(), 300);
                    return;
                }
            } catch (e) {
                localStorage.removeItem(CACHE_KEY);
            }
        }

        // 3. Optimized Fast Overpass Query
        const radiusMeters = 8000;
        const overpassQuery = `[out:json][timeout:5];node["amenity"~"hospital|clinic|doctors|pharmacy"](around:${radiusMeters},${centerLat},${centerLng});out center qt;`;
        
        const apiEndpoints = [
            'https://overpass.kumi.systems/api/interpreter',
            'https://overpass-api.de/api/interpreter',
            'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
        ];

        const fetchMarkersWithTimeout = async (endpointIndex = 0) => {
            if (endpointIndex >= apiEndpoints.length) return;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                const url = `${apiEndpoints[endpointIndex]}?data=${encodeURIComponent(overpassQuery)}`;
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error('Network error');
                
                const data = await response.json();
                if (data.elements && data.elements.length > 0) {
                    const cacheItems = [];
                    data.elements.forEach(place => {
                        const lat = place.lat || (place.center && place.center.lat);
                        const lon = place.lon || (place.center && place.center.lon);
                        if (!lat || !lon) return;
                        
                        const rawType = place.tags.amenity || 'Medical Center';
                        const formattedType = rawType.charAt(0).toUpperCase() + rawType.slice(1);
                        const name = place.tags.name || place.tags['name:en'] || `${formattedType} (MUJ Area)`;
                        const address = buildAddress(place.tags);
                        const statusInfo = evaluateOpeningHours(place.tags.opening_hours, formattedType);
                        
                        addFastMarker(lat, lon, name, formattedType, address, statusInfo);
                        cacheItems.push({ lat, lon, name, type: formattedType, address, status: statusInfo });
                    });
                    
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        timestamp: Date.now(),
                        elements: cacheItems
                    }));
                }
            } catch (err) {
                fetchMarkersWithTimeout(endpointIndex + 1);
            }
        };
        
        fetchMarkersWithTimeout(0);
        mapInitialized = true;
        setTimeout(() => leafletMap.invalidateSize(), 300);
    }

    if (document.getElementById('view-maps')?.classList.contains('active')) {
        initMap();
    }

    /* ==========================================================================
       15. ABDM Drug Registry Medicine Search
       ========================================================================== */
    const medicineSearchForm = document.getElementById("medicine-search-form");
    const medicineSearchInput = document.getElementById("medicine-search-input");
    const medicineSearchStatus = document.getElementById("medicine-search-status");
    const medicineResults = document.getElementById("medicine-results");
    const topbarMedicineSearch = document.querySelector(".topbar-search");
    const topbarMedicineSearchInput = topbarMedicineSearch?.querySelector("input[name=search]");
    const storeCartToggle = document.getElementById("store-cart-toggle");
    const storeCartCount = document.getElementById("store-cart-count");
    const storeCartPanel = document.getElementById("store-cart-panel");
    const storeCartBackdrop = document.getElementById("store-cart-backdrop");
    const storeCartClose = document.getElementById("store-cart-close");
    const storeCartItems = document.getElementById("store-cart-items");
    const storeCartClear = document.getElementById("store-cart-clear");
    let medicineSearchController = null;
    let hasUserSearchedMedicines = false;
    let currentMedicineResults = new Map();
    let storeCart = [];

    try {
        const savedCart = JSON.parse(localStorage.getItem("medic-store-cart") || "[]");
        if (Array.isArray(savedCart)) storeCart = savedCart;
    } catch {
        localStorage.removeItem("medic-store-cart");
    }

    const escapeMedicineText = (value) => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("\x27", "&#039;");

    const renderMedicineSearchState = (icon, title, message) => {
        medicineResults.innerHTML = `
            <div class="store-empty-state">
                <span class="material-symbols-rounded" aria-hidden="true">${icon}</span>
                <h3>${escapeMedicineText(title)}</h3>
                <p class="subtle">${escapeMedicineText(message)}</p>
            </div>
        `;
    };

    const renderMedicineSkeletons = () => {
        medicineResults.innerHTML = Array.from({ length: 6 }, () => `
            <article class="medicine-card medicine-card-skeleton" aria-hidden="true">
                <div class="skeleton-line wide"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
            </article>
        `).join("");
    };

    const firstListValue = (value, fallback = "Not specified") => {
        if (Array.isArray(value)) return value.filter(Boolean).join(", ") || fallback;
        return value || fallback;
    };

    const getMedicineVisual = (doseForm) => {
        const normalized = String(doseForm || "").toLowerCase();
        if (normalized.includes("inject") || normalized.includes("vial")) {
            return { icon: "vaccines", variant: "injection", label: "Injection" };
        }
        if (normalized.includes("syrup") || normalized.includes("liquid") || normalized.includes("solution")) {
            return { icon: "medication_liquid", variant: "liquid", label: "Liquid" };
        }
        if (normalized.includes("cream") || normalized.includes("ointment") || normalized.includes("gel")) {
            return { icon: "dermatology", variant: "topical", label: "Topical" };
        }
        if (normalized.includes("inhal") || normalized.includes("spray")) {
            return { icon: "air", variant: "inhaler", label: "Inhaler" };
        }
        return { icon: "pill", variant: "tablet", label: "Tablet / capsule" };
    };

    const renderMedicineCardCartControl = (medicineId) => {
        const id = String(medicineId || "");
        const safeId = escapeMedicineText(id);
        const cartItem = storeCart.find((item) => item.id === id);
        if (!cartItem) {
            return `
                <button class="medicine-add-cart" type="button" data-medicine-id="${safeId}">
                    <span class="material-symbols-rounded" aria-hidden="true">add_shopping_cart</span>
                    Add to cart
                </button>
            `;
        }
        const quantity = Math.min(99, Math.max(1, Number(cartItem.quantity) || 1));
        return `
            <div class="medicine-card-stepper" aria-label="Cart quantity">
                <button type="button" data-card-cart-action="decrease" data-medicine-id="${safeId}" aria-label="Decrease quantity">
                    <span class="material-symbols-rounded" aria-hidden="true">remove</span>
                </button>
                <strong><span>${quantity}</span> in cart</strong>
                <button type="button" data-card-cart-action="increase" data-medicine-id="${safeId}" aria-label="Increase quantity">
                    <span class="material-symbols-rounded" aria-hidden="true">add</span>
                </button>
            </div>
        `;
    };

    const renderMedicineCard = (medicine) => {
        const brandName = escapeMedicineText(medicine.brandName || "Unnamed medicine");
        const genericName = escapeMedicineText(medicine.genericName || "Generic name unavailable");
        const manufacturer = escapeMedicineText(medicine.supplierName || "Manufacturer unavailable");
        const substance = escapeMedicineText(firstListValue(medicine.substanceName));
        const route = escapeMedicineText(firstListValue(medicine.routeOfAdministrationName));
        const rawDoseForm = medicine.doseForm || "Dose form unavailable";
        const doseForm = escapeMedicineText(rawDoseForm);
        const visual = getMedicineVisual(rawDoseForm);
        const registryId = escapeMedicineText(medicine.brandIdentifier || "Unavailable");

        return `
            <article class="medicine-card">
                <div class="medicine-card-visual medicine-visual-${visual.variant}" aria-hidden="true">
                    <span class="medicine-visual-orb"></span>
                    <span class="material-symbols-rounded medicine-visual-icon">${visual.icon}</span>
                    <span class="medicine-visual-label">${visual.label}</span>
                </div>
                <div class="medicine-card-header">
                    <div class="medicine-card-title">
                        <h3 title="${brandName}">${brandName}</h3>
                        <p title="${genericName}">${genericName}</p>
                    </div>
                </div>
                <div class="medicine-tags">
                    <span class="medicine-tag">${doseForm}</span>
                    <span class="medicine-tag secondary">${substance}</span>
                </div>
                <div class="medicine-details">
                    <div class="medicine-detail">
                        <span class="material-symbols-rounded" aria-hidden="true">factory</span>
                        <span title="${manufacturer}">${manufacturer}</span>
                    </div>
                    <div class="medicine-detail">
                        <span class="material-symbols-rounded" aria-hidden="true">route</span>
                        <span title="${route}">${route}</span>
                    </div>
                </div>
                <div class="medicine-card-actions">
                    <p class="medicine-registry-id">ABDM Brand ID: ${registryId}</p>
                    <div class="medicine-card-cart-control" data-cart-control-id="${registryId}">
                        ${renderMedicineCardCartControl(medicine.brandIdentifier)}
                    </div>
                </div>
            </article>
        `;
    };

    const syncMedicineCardControls = () => {
        currentMedicineResults.forEach((medicine, id) => {
            const control = medicineResults?.querySelector(`[data-cart-control-id="${CSS.escape(id)}"]`);
            if (control) control.innerHTML = renderMedicineCardCartControl(id);
        });
    };

    const persistStoreCart = () => {
        localStorage.setItem("medic-store-cart", JSON.stringify(storeCart));
    };

    const renderStoreCart = () => {
        if (!storeCartItems || !storeCartCount) return;
        const totalQuantity = storeCart.reduce((total, item) => total + Math.max(1, Number(item.quantity) || 1), 0);
        storeCartCount.textContent = String(totalQuantity);
        storeCartCount.classList.toggle("has-items", totalQuantity > 0);
        if (storeCartClear) storeCartClear.disabled = storeCart.length === 0;

        if (storeCart.length === 0) {
            storeCartItems.innerHTML = `
                <div class="store-cart-empty">
                    <span class="material-symbols-rounded" aria-hidden="true">shopping_cart</span>
                    <h3>Your cart is empty</h3>
                    <p>Add medicines from the search results to see them here.</p>
                </div>
            `;
            return;
        }

        storeCartItems.innerHTML = storeCart.map((item) => {
            const visual = getMedicineVisual(item.doseForm);
            const id = escapeMedicineText(item.id);
            const name = escapeMedicineText(item.name);
            const genericName = escapeMedicineText(item.genericName);
            const manufacturer = escapeMedicineText(item.manufacturer);
            const quantity = Math.max(1, Number(item.quantity) || 1);
            return `
                <article class="store-cart-item">
                    <div class="store-cart-item-icon medicine-visual-${visual.variant}">
                        <span class="material-symbols-rounded" aria-hidden="true">${visual.icon}</span>
                    </div>
                    <div class="store-cart-item-copy">
                        <h3 title="${name}">${name}</h3>
                        <p title="${genericName}">${genericName}</p>
                        <span>${manufacturer}</span>
                        <div class="store-cart-item-controls">
                            <div class="store-cart-quantity" aria-label="Quantity controls">
                                <button type="button" data-cart-action="decrease" data-cart-id="${id}" aria-label="Decrease quantity">−</button>
                                <strong>${quantity}</strong>
                                <button type="button" data-cart-action="increase" data-cart-id="${id}" aria-label="Increase quantity">+</button>
                            </div>
                            <button class="store-cart-remove" type="button" data-cart-action="remove" data-cart-id="${id}">Remove</button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    };

    let cartCloseTimer = null;
    const openStoreCart = () => {
        if (!storeCartPanel || !storeCartBackdrop || !storeCartToggle) return;
        clearTimeout(cartCloseTimer);
        storeCartPanel.hidden = false;
        storeCartBackdrop.hidden = false;
        requestAnimationFrame(() => {
            storeCartPanel.classList.add("is-open");
            storeCartBackdrop.classList.add("is-open");
        });
        storeCartToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("cart-open");
        storeCartClose?.focus();
    };

    const closeStoreCart = () => {
        if (!storeCartPanel || !storeCartBackdrop || !storeCartToggle) return;
        storeCartPanel.classList.remove("is-open");
        storeCartBackdrop.classList.remove("is-open");
        storeCartToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("cart-open");
        cartCloseTimer = setTimeout(() => {
            storeCartPanel.hidden = true;
            storeCartBackdrop.hidden = true;
        }, 240);
    };

    const addMedicineToCart = (medicine) => {
        const id = String(medicine.brandIdentifier || "");
        if (!id) return;
        const existingItem = storeCart.find((item) => item.id === id);
        if (existingItem) {
            existingItem.quantity = Math.min(99, (Number(existingItem.quantity) || 1) + 1);
        } else {
            storeCart.push({
                id,
                name: medicine.brandName || "Unnamed medicine",
                genericName: medicine.genericName || "Generic name unavailable",
                manufacturer: medicine.supplierName || "Manufacturer unavailable",
                doseForm: medicine.doseForm || "",
                quantity: 1
            });
        }
        persistStoreCart();
        renderStoreCart();
        syncMedicineCardControls();
    };

    medicineResults?.addEventListener("click", (event) => {
        const addButton = event.target.closest(".medicine-add-cart");
        if (addButton) {
            const medicine = currentMedicineResults.get(addButton.dataset.medicineId);
            if (medicine) addMedicineToCart(medicine);
            return;
        }

        const quantityButton = event.target.closest("[data-card-cart-action]");
        if (!quantityButton) return;
        const itemIndex = storeCart.findIndex((item) => item.id === quantityButton.dataset.medicineId);
        if (itemIndex < 0) return;
        if (quantityButton.dataset.cardCartAction === "increase") {
            storeCart[itemIndex].quantity = Math.min(99, (Number(storeCart[itemIndex].quantity) || 1) + 1);
        } else {
            const nextQuantity = (Number(storeCart[itemIndex].quantity) || 1) - 1;
            if (nextQuantity <= 0) storeCart.splice(itemIndex, 1);
            else storeCart[itemIndex].quantity = nextQuantity;
        }
        persistStoreCart();
        renderStoreCart();
        syncMedicineCardControls();
    });

    storeCartItems?.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-cart-action]");
        if (!actionButton) return;
        const itemIndex = storeCart.findIndex((item) => item.id === actionButton.dataset.cartId);
        if (itemIndex < 0) return;
        const action = actionButton.dataset.cartAction;
        if (action === "increase") {
            storeCart[itemIndex].quantity = Math.min(99, (Number(storeCart[itemIndex].quantity) || 1) + 1);
        } else if (action === "decrease") {
            const nextQuantity = (Number(storeCart[itemIndex].quantity) || 1) - 1;
            if (nextQuantity <= 0) storeCart.splice(itemIndex, 1);
            else storeCart[itemIndex].quantity = nextQuantity;
        } else if (action === "remove") {
            storeCart.splice(itemIndex, 1);
        }
        persistStoreCart();
        renderStoreCart();
        syncMedicineCardControls();
    });

    storeCartToggle?.addEventListener("click", openStoreCart);
    storeCartClose?.addEventListener("click", closeStoreCart);
    storeCartBackdrop?.addEventListener("click", closeStoreCart);
    storeCartClear?.addEventListener("click", () => {
        storeCart = [];
        persistStoreCart();
        renderStoreCart();
        syncMedicineCardControls();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && storeCartPanel?.classList.contains("is-open")) closeStoreCart();
    });
    renderStoreCart();

    if (medicineSearchForm && medicineSearchInput && medicineSearchStatus && medicineResults) {
        medicineSearchForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            hasUserSearchedMedicines = true;
            const query = medicineSearchInput.value.trim();
            const searchButton = medicineSearchForm.querySelector("button[type=submit]");
            const searchMeta = medicineSearchStatus.parentElement;

            if (query.length < 2) {
                medicineSearchStatus.textContent = "Enter at least two characters to search.";
                searchMeta.classList.add("is-error");
                medicineSearchInput.focus();
                return;
            }

            if (medicineSearchController) medicineSearchController.abort();
            medicineSearchController = new AbortController();
            searchButton.disabled = true;
            searchMeta.classList.remove("is-error");
            medicineSearchStatus.textContent = `Searching ABDM for “${query}”…`;
            renderMedicineSkeletons();

            try {
                const response = await fetch(`/api/medicines?q=${encodeURIComponent(query)}`, {
                    signal: medicineSearchController.signal,
                    headers: { Accept: "application/json" }
                });
                const payload = await response.json();

                if (!response.ok) {
                    const error = new Error(payload.message || "The ABDM search could not be completed.");
                    error.code = payload.code;
                    throw error;
                }

                const medicines = Array.isArray(payload.results) ? payload.results : [];
                if (medicines.length === 0) {
                    medicineSearchStatus.textContent = `No ABDM medicines found for “${query}”.`;
                    renderMedicineSearchState("search_off", "No medicines found", "Check the spelling or try a generic name such as Paracetamol.");
                    return;
                }

                medicineSearchStatus.textContent = `${medicines.length} ABDM medicine${medicines.length === 1 ? "" : "s"} found for “${query}”.`;
                currentMedicineResults = new Map(medicines.map((medicine) => [String(medicine.brandIdentifier), medicine]));
                medicineResults.innerHTML = medicines.map(renderMedicineCard).join("");
            } catch (error) {
                if (error.name === "AbortError") return;
                searchMeta.classList.add("is-error");
                const needsKey = error.code === "ABDM_API_KEY_MISSING";
                medicineSearchStatus.textContent = needsKey
                    ? "ABDM API access needs to be configured on the server."
                    : "Unable to reach the ABDM Drug Registry.";
                renderMedicineSearchState(
                    needsKey ? "key" : "cloud_off",
                    needsKey ? "ABDM API key required" : "Registry unavailable",
                    needsKey
                        ? "Set ABDM_API_KEY when starting the server, then try again."
                        : "Please wait a moment and retry your search."
                );
            } finally {
                searchButton.disabled = false;
            }
        });

        topbarMedicineSearch?.addEventListener("submit", (event) => {
            event.preventDefault();
            const query = topbarMedicineSearchInput?.value.trim() || "";
            if (query.length < 2) {
                topbarMedicineSearchInput?.focus();
                return;
            }

            switchView("view-meds");
            medicineSearchInput.value = query;
            medicineSearchForm.requestSubmit();
        });

        const loadCommonMedicines = async () => {
            const commonSearches = [
                "paracetamol",
                "ibuprofen",
                "cetirizine",
                "metformin",
                "omeprazole",
                "amoxicillin"
            ];

            medicineSearchStatus.parentElement.classList.remove("is-error");
            medicineSearchStatus.textContent = "Loading common medicines from ABDM…";
            renderMedicineSkeletons();

            const requests = await Promise.allSettled(commonSearches.map(async (term) => {
                const response = await fetch(`/api/medicines?q=${encodeURIComponent(term)}`, {
                    headers: { Accept: "application/json" }
                });
                const payload = await response.json();
                if (!response.ok) {
                    const error = new Error(payload.message || "ABDM request failed.");
                    error.code = payload.code;
                    throw error;
                }
                return Array.isArray(payload.results) ? payload.results[0] : null;
            }));

            if (hasUserSearchedMedicines) return;

            const medicines = requests
                .filter((request) => request.status === "fulfilled" && request.value)
                .map((request) => request.value)
                .filter((medicine, index, list) => list.findIndex((item) => item.brandIdentifier === medicine.brandIdentifier) === index);

            if (medicines.length === 0) {
                const firstError = requests.find((request) => request.status === "rejected")?.reason;
                const needsKey = firstError?.code === "ABDM_API_KEY_MISSING";
                medicineSearchStatus.parentElement.classList.add("is-error");
                medicineSearchStatus.textContent = needsKey
                    ? "ABDM API access needs to be configured on the server."
                    : "Common medicines could not be loaded from ABDM.";
                renderMedicineSearchState(
                    needsKey ? "key" : "cloud_off",
                    needsKey ? "ABDM API key required" : "Registry unavailable",
                    needsKey
                        ? "Set ABDM_API_KEY when starting the server, then refresh this page."
                        : "Use the search box above to retry."
                );
                return;
            }

            currentMedicineResults = new Map(medicines.map((medicine) => [String(medicine.brandIdentifier), medicine]));
            medicineSearchStatus.textContent = `${medicines.length} common medicines loaded from the ABDM Drug Registry.`;
            medicineResults.innerHTML = medicines.map(renderMedicineCard).join("");
        };

        loadCommonMedicines();
    }
});

/* ==========================================================================
       9. Docs View Dynamic Folders
       ========================================================================== */
    const folderData = {
        rx: [
            { name: "General Checkup - Dr. Carter", type: "PDF", size: "800 KB", icon: "prescriptions", color: "bg-app-alpha" },
            { name: "Dermatologist Rx", type: "PDF", size: "1.1 MB", icon: "prescriptions", color: "bg-app-alpha" },
            { name: "Refill Authorization", type: "JPG", size: "450 KB", icon: "image", color: "bg-med-alpha" }
        ],
        labs: [
            { name: "Complete Blood Count", type: "PDF", size: "1.2 MB", icon: "science", color: "bg-test-alpha" },
            { name: "Lipid Panel", type: "PDF", size: "900 KB", icon: "science", color: "bg-test-alpha" },
            { name: "Thyroid Test", type: "PDF", size: "1.5 MB", icon: "science", color: "bg-test-alpha" },
            { name: "Metabolic Panel", type: "PDF", size: "1.1 MB", icon: "science", color: "bg-test-alpha" }
        ],
        bills: [
            { name: "Pharmacy Bill - Aug", type: "JPG", size: "300 KB", icon: "receipt_long", color: "bg-med-alpha" },
            { name: "Hospital Copay", type: "PDF", size: "1.4 MB", icon: "receipt_long", color: "bg-med-alpha" },
            { name: "Insurance Claim #9082", type: "PDF", size: "2.1 MB", icon: "health_and_safety", color: "bg-neutral-alpha" },
            { name: "Dental Out-of-pocket", type: "JPG", size: "550 KB", icon: "receipt_long", color: "bg-med-alpha" }
        ],
        scans: [
            { name: "Chest X-Ray", type: "PNG", size: "4.5 MB", icon: "radiology", color: "bg-test-alpha" },
            { name: "Dental Scan", type: "JPG", size: "2.2 MB", icon: "dentistry", color: "bg-test-alpha" }
        ],
        // ADDED MISSING ID DATA
        id: [
            { name: "Domestic Help Medical Clearance", type: "PDF", size: "2.1 MB", icon: "badge", color: "bg-neutral-alpha" },
            { name: "Insurance ID Card", type: "PDF", size: "600 KB", icon: "health_and_safety", color: "bg-app-alpha" }
        ]
    };

    window.openFolder = function(folderKey, folderTitle) {
        const titleEl = document.getElementById('current-folder-title');
        const gridEl = document.getElementById('folder-contents-grid');
        
        if (!titleEl || !gridEl) return;
        
        titleEl.textContent = folderTitle;
        
        // Toggle active visual state
        document.querySelectorAll('.folder-card').forEach(card => {
            if (card.getAttribute('data-folder') === folderKey) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Clear and populate files
        gridEl.innerHTML = '';
        
        folderData[folderKey].forEach(file => {
            gridEl.innerHTML += `
                <button class="document-link-btn" type="button" onclick="alert('Downloading ${file.name}...')">
                    <div class="doc-btn-left">
                        <div class="btn-icon ${file.color}"><span class="material-symbols-rounded">${file.icon}</span></div>
                        <div class="doc-text-wrapper">
                            <span class="doc-name">${file.name}</span>
                            <span class="subtle" style="font-size: 0.75rem;">${file.type} • ${file.size}</span>
                        </div>
                    </div>
                    <span class="material-symbols-rounded link-arrow">download</span>
                </button>
            `;
        });
    };
    
    // Initialize default folder on page load
    setTimeout(() => {
        if (document.getElementById('folder-contents-grid')) {
            window.openFolder('rx', 'Prescriptions');
        }
    }, 100);
