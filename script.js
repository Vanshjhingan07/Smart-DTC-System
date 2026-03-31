const busRoutes = [
    { id: '957', name: '957: Shivaji Stadium ↔ Madipur', farePerStop: { ac: 6, nonAc: 3 }, stops: ['Shivaji Stadium', 'Karol Bagh', 'Patel Nagar', 'Shadipur', 'Punjabi Bagh', 'Madipur'] },
    { id: '544', name: '544: Sarai Kale Khan ↔ R.K. Puram', farePerStop: { ac: 7, nonAc: 4 }, stops: ['Sarai Kale Khan', 'Ashram', 'Lajpat Nagar', 'South Extension', 'AIIMS', 'R.K. Puram'] },
    { id: '729', name: '729: Mori Gate ↔ Kapashera Border', farePerStop: { ac: 5, nonAc: 2.5 }, stops: ['Mori Gate', 'Azad Market', 'Karol Bagh', 'Naraina', 'Delhi Cantt', 'Palam', 'Kapashera Border'] }
];

let livePassengerCount = 12;

const pages = document.querySelectorAll('.page');
const modalOverlay = document.getElementById('alert-modal');

function showPage(pageId) {
    pages.forEach(page => page.style.display = 'none');
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.style.display = (pageId === 'login-page') ? 'flex' : 'block';
    }
}

function showModal(title, message, iconClass = 'bi-info-circle') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-icon').className = `bi ${iconClass}`;
    modalOverlay.style.display = 'flex';
}

function populateDropdown(selectElement, options) {
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">-- Select --</option>`;
    options.forEach(opt => selectElement.add(new Option(opt, opt)));
}

function updateStops() {
    const routeId = document.getElementById('route-select').value;
    const startSelect = document.getElementById('start-stop-select');
    const endSelect = document.getElementById('end-stop-select');
    const route = busRoutes.find(r => r.id === routeId);

    if (route) {
        populateDropdown(startSelect, route.stops);
        populateDropdown(endSelect, route.stops);
        startSelect.disabled = false;
        endSelect.disabled = false;
    } else {
        startSelect.disabled = true;
        endSelect.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const routeSelect = document.getElementById('route-select');
    if (routeSelect) {
        busRoutes.forEach(r => routeSelect.add(new Option(r.name, r.id)));
        routeSelect.addEventListener('change', updateStops);
    }

    const loginForm = document.getElementById('main-login-form');
    const loginTriggers = document.querySelectorAll('.login-trigger');

    loginTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');

            if (!name || !email.checkValidity() || !phone.checkValidity()) {
                showModal('Validation Error', 'Please enter a valid Name, Email, and 10-digit Phone number.', 'bi-exclamation-triangle');
                return;
            }

            const originalText = trigger.innerHTML;
            trigger.innerHTML = '<i class="bi bi-hourglass-split"></i> Authenticating...';
            
            setTimeout(() => {
                showPage(trigger.getAttribute('data-target'));
                trigger.innerHTML = originalText;
            }, 600);
        });
    });

    document.querySelectorAll('.logout-btn').forEach(btn => btn.addEventListener('click', () => showPage('login-page')));
    document.getElementById('modal-close-btn').addEventListener('click', () => modalOverlay.style.display = 'none');

    const paxDisplay = document.getElementById('passenger-count');
    document.getElementById('increase-pax-btn')?.addEventListener('click', () => {
        livePassengerCount++;
        if(paxDisplay) paxDisplay.textContent = livePassengerCount;
    });
    document.getElementById('decrease-pax-btn')?.addEventListener('click', () => {
        if(livePassengerCount > 0) livePassengerCount--;
        if(paxDisplay) paxDisplay.textContent = livePassengerCount;
    });

    const darkBtn = document.getElementById("darkToggle");
    if(darkBtn) {
        darkBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            darkBtn.innerHTML = document.body.classList.contains("dark") ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
        });
    }

    showPage('login-page');
});
