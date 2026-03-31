const routes = [
    { id: '957', name: '957: Shivaji Stadium - Madipur', fare: { ac: 6, nonAc: 3 }, stops: ['Shivaji Stadium', 'Karol Bagh', 'Patel Nagar', 'Shadipur', 'Punjabi Bagh', 'Madipur'] },
    { id: '544', name: '544: SKK - R.K. Puram', fare: { ac: 7, nonAc: 4 }, stops: ['Sarai Kale Khan', 'Ashram', 'Lajpat Nagar', 'South Extension', 'AIIMS', 'R.K. Puram'] }
];

let pax = 12;

function show(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById(id);
    if(target) target.style.display = (id === 'login-page') ? 'flex' : 'block';
}

function alertMe(title, msg, icon = 'bi-info-circle') {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = msg;
    document.getElementById('modal-icon').className = `bi ${icon}`;
    document.getElementById('alert-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. MODAL CLOSE FIX
    document.getElementById('modal-close-btn').onclick = () => {
        document.getElementById('alert-modal').style.display = 'none';
    };

    // 2. LOGIN & NAV
    document.querySelectorAll('.login-trigger').forEach(b => b.onclick = () => {
        if(document.getElementById('email').checkValidity() && document.getElementById('name').value) {
            show(b.dataset.target);
        } else {
            alertMe("Login Required", "Please fill in your details correctly.", "bi-person-x");
        }
    });

    document.querySelectorAll('.logout-btn').forEach(b => b.onclick = () => show('login-page'));
    document.querySelectorAll('.back-btn').forEach(b => b.onclick = () => show(b.dataset.target));
    document.querySelectorAll('.nav-card').forEach(c => c.onclick = () => show(c.dataset.page));

    // 3. TICKET LOGIC
    const rs = document.getElementById('r-sel');
    const ss = document.getElementById('s-sel');
    const es = document.getElementById('e-sel');
    routes.forEach(r => rs.add(new Option(r.name, r.id)));

    rs.onchange = () => {
        const r = routes.find(x => x.id === rs.value);
        ss.innerHTML = es.innerHTML = '<option>-- Select Stop --</option>';
        if(r) {
            r.stops.forEach(s => { ss.add(new Option(s,s)); es.add(new Option(s,s)); });
            ss.disabled = es.disabled = false;
        }
    };

    const fareCalc = () => {
        const r = routes.find(x => x.id === rs.value);
        if(r && ss.value && es.value) {
            const d = Math.abs(r.stops.indexOf(es.value) - r.stops.indexOf(ss.value));
            const t = document.querySelector('input[name="bt"]:checked').value;
            document.getElementById('fare-txt').innerText = `Fare: ₹${d * r.fare[t] * document.getElementById('t-num').value}`;
        }
    };
    [rs, ss, es, document.getElementById('t-num')].forEach(e => e.onchange = fareCalc);
    document.getElementById('book-btn').onclick = () => alertMe("Success", "Digital Ticket Generated. Save this for inspection.", "bi-check-circle-fill");

    // 4. HELP & STATUS FEATURES (AS REQUESTED)
    document.getElementById('report-help').onclick = () => {
        alertMe("EMERGENCY", "Help is on the way! Rapid response unit dispatched to Bus DL1PC1234. Estimated arrival: 8 mins.", "bi-exclamation-triangle-fill");
    };

    document.getElementById('start-shift').onclick = () => alertMe("Shift Started", "GPS Tracking and e-Ticketing machine initialized.", "bi-play-fill");
    document.getElementById('end-shift').onclick = () => alertMe("Shift Ended", "Data synced to DTC Cloud. Logged out successfully.", "bi-cloud-check");
    
    document.getElementById('view-stats').onclick = () => alertMe("Admin Report", "Daily Revenue: ₹42,500 | Active Buses: 142", "bi-bar-chart");
    document.getElementById('manage-crew').onclick = () => alertMe("Crew Status", "All 284 staff members currently assigned and active.", "bi-people");

    document.getElementById('search-bus').onclick = () => {
        const results = routes.filter(r => r.stops.includes(document.getElementById('plan-s').value) && r.stops.includes(document.getElementById('plan-e').value));
        document.getElementById('plan-res').innerHTML = results.map(r => `<div class="card">${r.name}</div>`).join('') || "No buses found.";
    };

    // 5. TRACKING & CROWD
    const trackBtn = document.querySelector('[data-page="tracking-page"]');
    trackBtn.addEventListener('click', () => {
        setTimeout(() => { document.getElementById('track-msg').innerText = "Bus 957 currently at Patel Nagar (2 mins away)."; }, 1500);
    });

    const updatePax = (v) => { 
        pax = Math.max(0, pax + v); 
        document.getElementById('dr-pax').innerText = pax; 
    };
    document.getElementById('p-plus').onclick = () => updatePax(1);
    document.getElementById('p-min').onclick = () => updatePax(-1);

    document.getElementById('darkToggle').onclick = () => document.body.classList.toggle('dark');
    show('login-page');
});
