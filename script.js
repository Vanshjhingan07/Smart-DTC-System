// --- DATA: Real Bus Routes, Fares, and Crew ---
const busRoutes = [
    { id: '957', name: '957: Shivaji Stadium ↔ Madipur', farePerStop: { ac: 6, nonAc: 3 }, stops: ['Shivaji Stadium', 'Karol Bagh', 'Patel Nagar', 'Shadipur', 'Punjabi Bagh', 'Madipur'] },
    { id: '544', name: '544: Sarai Kale Khan ↔ R.K. Puram', farePerStop: { ac: 7, nonAc: 4 }, stops: ['Sarai Kale Khan', 'Ashram', 'Lajpat Nagar', 'South Extension', 'AIIMS', 'R.K. Puram'] },
    { id: '729', name: '729: Mori Gate ↔ Kapashera Border', farePerStop: { ac: 5, nonAc: 2.5 }, stops: ['Mori Gate', 'Azad Market', 'Karol Bagh', 'Naraina', 'Delhi Cantt', 'Palam', 'Kapashera Border'] }
];

const crewData = [
    { driver: 'Ramesh Kumar', conductor: 'Suresh Singh', routeId: '957' },
    { driver: 'Anil Yadav', conductor: 'Priya Sharma', routeId: '544' },
    { driver: 'Sunita Devi', conductor: 'Manoj Gupta', routeId: '729' }
];

// --- Global State ---
let livePassengerCount = 12; // Initial dummy count

// --- Selectors ---
const pages = document.querySelectorAll('.page');
const loginTriggers = document.querySelectorAll('.login-trigger');
const logoutBtns = document.querySelectorAll('.logout-btn');
const backBtns = document.querySelectorAll('.back-btn');
const modalOverlay = document.getElementById('alert-modal');

// Ticket Form Selectors
const routeSelect = document.getElementById('route-select');
const startStopSelect = document.getElementById('start-stop-select');
const endStopSelect = document.getElementById('end-stop-select');
const ticketCountInput = document.getElementById('ticket-count');
const busTypeRadios = document.querySelectorAll('input[name="bus-type"]');
const ticketForm = document.getElementById('ticket-form');

// --- Core Functionality ---
function showPage(pageId) {
    pages.forEach(page => page.style.display = 'none');
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.style.display = (pageId === 'login-page') ? 'flex' : 'block';
}

function showModal(title, message, iconClass = 'bi-info-circle') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-icon').className = `bi ${iconClass}`;
    modalOverlay.style.display = 'flex';
}

// --- Reusable Navigation Setup ---
function setupNavigation(buttonId, pageId) {
    const button = document.getElementById(buttonId);
    if (button) button.addEventListener('click', (e) => { e.preventDefault(); showPage(pageId); });
}

// --- Ticket Page Logic ---
function populateDropdownWithOptions(selectElement, options) {
    selectElement.innerHTML = `<option value="">-- Select --</option>`;
    options.forEach(opt => selectElement.add(new Option(opt, opt)));
}

function updateStopsDropdowns() {
    const routeId = routeSelect.value;
    const route = busRoutes.find(r => r.id === routeId);
    if (route) {
        populateDropdownWithOptions(startStopSelect, route.stops);
        populateDropdownWithOptions(endStopSelect, route.stops);
        startStopSelect.disabled = false;
        endStopSelect.disabled = false;
    } else {
        startStopSelect.innerHTML = '<option>-- Select Start Stop --</option>';
        endStopSelect.innerHTML = '<option>-- Select End Stop --</option>';
        startStopSelect.disabled = true;
        endStopSelect.disabled = true;
    }
    calculateAndDisplayFare();
}

function calculateAndDisplayFare() {
    const routeId = routeSelect.value;
    const startStop = startStopSelect.value;
    const endStop = endStopSelect.value;
    const ticketCount = parseInt(ticketCountInput.value, 10);
    const busType = document.querySelector('input[name="bus-type"]:checked').value;
    
    const fareDisplay = document.getElementById('fare-display');
    if (!routeId || !startStop || !endStop || startStop === endStop) {
        fareDisplay.textContent = 'Total Fare: ₹0';
        return;
    }
    const route = busRoutes.find(r => r.id === routeId);
    const stopsTraveled = Math.abs(route.stops.indexOf(endStop) - route.stops.indexOf(startStop));
    const totalFare = stopsTraveled * route.farePerStop[busType] * ticketCount;
    fareDisplay.textContent = `Total Fare: ₹${totalFare.toFixed(2)}`;
}

// --- Route Planner Logic ---
function findRoutes() {
    const start = document.getElementById('planner-start-stop').value;
    const end = document.getElementById('planner-end-stop').value;
    const resultsDiv = document.getElementById('route-results');
    if (!start || !end || start === end) {
        resultsDiv.innerHTML = '<p>Please select a valid start and destination.</p>';
        return;
    }
    const validRoutes = busRoutes.filter(r => r.stops.includes(start) && r.stops.includes(end));
    if (validRoutes.length > 0) {
        resultsDiv.innerHTML = '<p>Available Buses:</p>' + validRoutes.map(r => `<span><i class="bi bi-bus-front"></i> ${r.name}</span>`).join('<br>');
    } else {
        resultsDiv.innerHTML = '<p>No direct buses found for this route.</p>';
    }
}

// --- Crowd Capacity Logic ---
function updatePassengerCount(change) {
    livePassengerCount += change;
    if (livePassengerCount < 0) livePassengerCount = 0;
    document.getElementById('passenger-count').textContent = livePassengerCount;
    document.getElementById('live-passenger-count-display').textContent = livePassengerCount;
}

// --- Initial Data Population ---
function initializeApp() {
    const allStops = [...new Set(busRoutes.flatMap(r => r.stops))].sort();
    populateDropdownWithOptions(document.getElementById('planner-start-stop'), allStops);
    populateDropdownWithOptions(document.getElementById('planner-end-stop'), allStops);

    document.getElementById('current-duty-route').innerHTML = `<b>Route:</b> ${busRoutes[1].name}`;
    document.getElementById('next-duty-route').innerHTML = `<b>Route:</b> ${busRoutes[2].name}`;

    const crewTable = `<table><thead><tr><th>Driver</th><th>Conductor</th><th>Assigned Route</th></tr></thead><tbody>${crewData.map(c => `<tr><td>${c.driver}</td><td>${c.conductor}</td><td>${busRoutes.find(r=>r.id===c.routeId).name}</td></tr>`).join('')}</tbody></table>`;
    document.getElementById('crew-table-container').innerHTML = crewTable;
    
    if (routeSelect) {
      routeSelect.innerHTML = '<option value="">-- Select a Route --</option>';
      busRoutes.forEach(route => routeSelect.add(new Option(route.name, route.id)));
    }
}

// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    loginTriggers.forEach(btn => btn.addEventListener('click', () => {
        if (!document.getElementById('name').value.trim() || !document.getElementById('email').value.trim()) {
            showModal('Login Error', 'Please fill in all your details before logging in.', 'bi-exclamation-triangle-fill');
            return;
        }
        showPage(btn.getAttribute('data-target'));
    }));

    logoutBtns.forEach(btn => btn.addEventListener('click', () => showPage('login-page')));
    backBtns.forEach(btn => btn.addEventListener('click', () => showPage(btn.getAttribute('data-target'))));
    document.getElementById('modal-close-btn').addEventListener('click', () => modalOverlay.style.display = 'none');

    // Navigation Buttons
    setupNavigation('admin-scheduling-btn', 'scheduling-page');
    setupNavigation('admin-crew-btn', 'crew-page');
    setupNavigation('admin-route-btn', 'route-page');
    setupNavigation('admin-reports-btn', 'reports-page');
    setupNavigation('purchase-ticket-btn', 'ticket-page');
    setupNavigation('passenger-tracking-btn', 'tracking-page');
    setupNavigation('passenger-crowd-btn', 'crowd-page');
    setupNavigation('passenger-route-planner-btn', 'route-planner-page');

    // Driver/Conductor Actions
    document.getElementById('start-duty-btn').addEventListener('click', () => showModal('Duty Status', 'Duty started. System has been notified.', 'bi-play-circle-fill'));
    document.getElementById('end-duty-btn').addEventListener('click', () => showModal('Duty Status', 'Duty ended. Finalizing shift details.', 'bi-stop-circle-fill'));
    document.getElementById('report-issue-btn').addEventListener('click', () => showModal('Report Issue', 'Maintenance team has been notified of a breakdown. Help is on the way.', 'bi-exclamation-triangle-fill'));
    document.getElementById('increase-pax-btn').addEventListener('click', () => updatePassengerCount(1));
    document.getElementById('decrease-pax-btn').addEventListener('click', () => updatePassengerCount(-1));

    // Ticket Page Event Listeners
    if (ticketForm) {
        routeSelect.addEventListener('change', updateStopsDropdowns);
        startStopSelect.addEventListener('change', calculateAndDisplayFare);
        endStopSelect.addEventListener('change', calculateAndDisplayFare);
        ticketCountInput.addEventListener('input', calculateAndDisplayFare);
        busTypeRadios.forEach(radio => radio.addEventListener('change', calculateAndDisplayFare));
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const finalFare = document.getElementById('fare-display').textContent;
            showModal('Payment', `Thank you for your purchase! ${finalFare}. Redirecting to payment gateway...`, 'bi-credit-card-fill');
        });
    }
    
    // Route Planner Form
    const plannerForm = document.getElementById('route-planner-form');
    if(plannerForm) plannerForm.addEventListener('submit', (e) => { e.preventDefault(); findRoutes(); });

    // Dark Mode & Menu
    const darkBtn = document.getElementById("darkToggle");
    if(darkBtn) darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        darkBtn.innerHTML = document.body.classList.contains("dark") ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    });
    
    showPage('login-page');
});