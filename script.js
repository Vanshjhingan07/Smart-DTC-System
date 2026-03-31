const routes = [
    { id: '957', name: '957: Shivaji Stadium - Madipur', fare: 5, stops: ['Shivaji Stadium', 'Karol Bagh', 'Patel Nagar', 'Shadipur', 'Punjabi Bagh', 'Madipur'] },
    { id: '544', name: '544: SKK - R.K. Puram', fare: 7, stops: ['Sarai Kale Khan', 'Ashram', 'Lajpat Nagar', 'South Extension', 'AIIMS', 'R.K. Puram'] }
];

let paxCount = 12;

function show(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById(id);
    if(target) target.style.display = (id === 'login-page') ? 'flex' : 'block';
}

function notify(title, msg, icon = 'bi-info-circle') {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = msg;
    document.getElementById('modal-icon').className = `bi ${icon}`;
    document.getElementById('alert-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    // MODAL CLOSE
    document.getElementById('modal-close-btn').onclick = () => {
        document.getElementById('alert-modal').style.display = 'none';
    };

    // LOGIN
    document.querySelectorAll('.login-trigger').forEach(b => b.onclick = () => {
        if(document.getElementById('email').checkValidity() && document.getElementById('name').value) {
            show(b.dataset.target);
        } else {
            notify("Login", "Please fill valid details.", "bi-person-x");
        }
    });

    // NAV
    document.querySelectorAll('.logout-btn').forEach(b => b.onclick = () => show('login-page'));
    document.querySelectorAll('.back-btn').forEach(b => b.onclick = () => show(b.dataset.target));
    document.querySelectorAll('.nav-card').forEach(c => c.onclick = () => show(c.dataset.page));

    // DYNAMIC ACTIONS
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.type;
            if(type === 'emergency') notify("EMERGENCY", "Help Dispatched to Bus DL1PC1234. Arrival: 5 mins.", "bi-exclamation-triangle-fill");
            if(type === 'shift-start') notify("Shift Active", "Tracking System Online.", "bi-play-fill");
            if(type === 'shift-end') notify("Shift Over", "Duty Log Saved.", "bi-cloud-check");
            if(type === 'stats') notify("Report", "Revenue today: ₹48,200", "bi-bar-chart");
            if(type === 'crew') notify("Crew", "24 Drivers Online.", "bi-people");
            if(type === 'routes') notify("GIS", "System Map Updating...", "bi-map");
        };
    });

    // TICKETS
    const rs = document.getElementById('r-sel');
    const ss = document.getElementById('s-sel');
    const es = document.getElementById('e-sel');
    routes.forEach(r => rs.add(new Option(r.name, r.id)));

    rs.onchange = () => {
        const r = routes.find(x => x.id === rs.value);
        ss.innerHTML = es.innerHTML = '<option>-- Select --</option>';
        if(r) {
            r.stops.forEach(s => { ss.add(new Option(s,s)); es.add(new Option(s,s)); });
            ss.disabled = es.disabled = false;
        }
    };
    document.getElementById('book-btn').onclick = () => notify("Ticket", "Booking Confirmed!", "bi-check-circle");

    // PASSENGER COUNT
    const updatePax = (v) => { 
        paxCount = Math.max(0, paxCount + v); 
        document.getElementById('dr-pax').innerText = paxCount; 
        document.getElementById('pax-val').innerText = paxCount;
    };
    document.getElementById('p-plus').onclick = () => updatePax(1);
    document.getElementById('p-min').onclick = () => updatePax(-1);

    document.getElementById('darkToggle').onclick = () => document.body.classList.toggle('dark');

    // START PAGE
    show('login-page');
});
