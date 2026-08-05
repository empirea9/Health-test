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
/* ==========================================================================
   8. OpenStreetMap & Overpass Integration (MUJ - Instant Load + Cache)
   ========================================================================== */
let mapInitialized = false;
let leafletMap = null;
const CACHE_KEY = 'muj_medical_places_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours

// Known fallback facilities near MUJ (Renders in < 10ms if network is slow)
const INSTANT_MUJ_FACILITIES = [
    {
        lat: 26.8425,
        lon: 75.5645,
        name: "MUJ Campus Medical Center / Infirmary",
        type: "Clinic",
        address: "Dome Building, MUJ Campus, Dahmi Kalan, Jaipur",
        status: { text: "🟢 Open 24/7 (On-Campus)", isOpen: true }
    },
    {
        lat: 26.8216987,
        lon: 75.5439261,
        name: "Bharadwaj Hospital",
        type: "Hospital",
        address: "Link Road, Bagru, Jaipur",
        status: { text: "🟢 Open 24/7 (Emergency Service)", isOpen: true }
    },
    {
        lat: 26.8189556,
        lon: 75.5427620,
        name: "Agrawal Heart and General Hospital",
        type: "Hospital",
        address: "H-158, Old RIICO, Link Road, Behind BSNL Tower, Bagru, Jaipur",
        status: { text: "🟢 Open 24/7 (Emergency Service)", isOpen: true }
    },
    {
        lat: 26.8186809,
        lon: 75.5431388,
        name: "Bagru Nursing Home",
        type: "Clinic",
        address: "Link Road, Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    },
    {
        lat: 26.8151992,
        lon: 75.5428853,
        name: "Government Hospital, Bagru",
        type: "Hospital",
        address: "Link Road, Near GSSS, Bagru, Jaipur",
        status: { text: "🟢 Open 24/7 (Emergency Service)", isOpen: true }
    },
    {
        lat: 26.8111712,
        lon: 75.5430211,
        name: "Baby Lon Hospital",
        type: "Hospital",
        address: "Ajmer Road, Bagru, Jaipur",
        status: { text: "🟢 Open 24/7 (Emergency Service)", isOpen: true }
    },
    {
        lat: 26.8155027,
        lon: 75.5433039,
        name: "Shree Balaji Clinic",
        type: "Clinic",
        address: "Adarsh Colony, Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    },
    {
        lat: 26.8092438,
        lon: 75.5558792,
        name: "ESI Dispensary",
        type: "Clinic",
        address: "Bagru Industrial Area, Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 17:00)", isOpen: true }
    },
    {
        lat: 26.8080340,
        lon: 75.5423741,
        name: "Sharma Homeopathic Clinic",
        type: "Clinic",
        address: "Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    },
    {
        lat: 26.8085604,
        lon: 75.5538166,
        name: "Namo Clinic",
        type: "Clinic",
        address: "Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    },
    {
        lat: 26.8241018,
        lon: 75.5440801,
        name: "Shri Shidhi Clinic",
        type: "Clinic",
        address: "Begus Road, Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    },
    {
        lat: 26.8087639,
        lon: 75.5539884,
        name: "Khushi Homoeopathic Clinic",
        type: "Clinic",
        address: "Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    },
    {
        lat: 26.8166904,
        lon: 75.5441492,
        name: "Balaji Homoeopathic Clinic",
        type: "Clinic",
        address: "Adarsh Colony, Bagru, Jaipur",
        status: { text: "🟢 Open Today (Est. 09:00 - 20:00)", isOpen: true }
    }
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
        if (clean === '24/7') return { text: '🟢 Open (24/7)', isOpen: true };

        const match = clean.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        if (match) {
            const now = new Date();
            const currentMins = now.getHours() * 60 + now.getMinutes();
            const startMins = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
            const endMins = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);

            const isOpen = currentMins >= startMins && currentMins <= endMins;
            return {
                text: isOpen ? `🟢 Open Now (${clean})` : `🔴 Closed Now (${clean})`,
                isOpen
            };
        }
        return { text: `ℹ️ ${clean}`, isOpen: true };
    }

    if (typeLower.includes('hospital')) {
        return { text: '🟢 Open 24/7 (Emergency Service)', isOpen: true };
    } else if (typeLower.includes('pharmacy')) {
        return { text: '🟢 Open Today (Est. 08:00 - 22:00)', isOpen: true };
    } else {
        return { text: '🟢 Open Today (Est. 09:00 - 20:00)', isOpen: true };
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

    // Determine initial tile URL based on active theme
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

    const selectFacility = (name, type, address, statusInfo) => {
        setSafeText('facility-name', name);
        setSafeText('facility-type', `Type: ${type}`);
        setSafeText('facility-status', statusInfo.text);
        setSafeText('facility-address', address);

        const bookBtn = document.getElementById('book-appointment-btn');
        if (bookBtn) {
            bookBtn.disabled = false;
            bookBtn.style.opacity = '1';
            bookBtn.style.cursor = 'pointer';
            bookBtn.onclick = () => alert(`Appointment request sent to ${name}!`);
        }
    };

    const addedMarkers = new Set();

    const addFastMarker = (lat, lon, name, type, address, statusInfo) => {
        const key = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
        if (addedMarkers.has(key)) return; // Prevent duplicates
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

        marker.on('click', () => selectFacility(name, type, address, statusInfo));
        marker.on('popupopen', () => {
            const popupBtn = document.querySelector('.popup-book-btn');
            if (popupBtn) popupBtn.onclick = () => alert(`Appointment request sent to ${name}!`);
        });
    };

    // 1. STEP 1: Render Local Pre-bundled Data Instantly (< 10ms)
    INSTANT_MUJ_FACILITIES.forEach(item => {
        addFastMarker(item.lat, item.lon, item.name, item.type, item.address, item.status);
    });

    // 2. STEP 2: Check LocalStorage Cache
    const cachedDataStr = localStorage.getItem(CACHE_KEY);
    if (cachedDataStr) {
        try {
            const cached = JSON.parse(cachedDataStr);
            if (Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
                cached.elements.forEach(item => addFastMarker(item.lat, item.lon, item.name, item.type, item.address, item.status));
                mapInitialized = true;
                setTimeout(() => leafletMap.invalidateSize(), 300);
                return; // Loaded instantly from cache!
            }
        } catch (e) {
            localStorage.removeItem(CACHE_KEY);
        }
    }

    // 3. STEP 3: Optimized Fast Overpass Query with 5s Abort Controller
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
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec max timeout

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

                // Save to localStorage for instant load next time
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    elements: cacheItems
                }));
            }
        } catch (err) {
            fetchMarkersWithTimeout(endpointIndex + 1); // Fast failover to next mirror
        }
    };

    fetchMarkersWithTimeout(0);
    mapInitialized = true;
    setTimeout(() => leafletMap.invalidateSize(), 300);
}

if (document.getElementById('view-maps')?.classList.contains('active')) {
    initMap();
}
});