/* Smart DTC Core Logic v2.5
   Copyright (c) 2026 Vansh Jhingan (VanshJhingan07)
*/

const routes = [
    { id: '957', name: '957: Shivaji Stadium - Madipur', fare: 5, stops: ['Shivaji Stadium', 'Karol Bagh', 'Patel Nagar', 'Shadipur', 'Punjabi Bagh', 'Madipur'] },
    { id: '544', name: '544: SKK - R.K. Puram', fare: 7, stops: ['Sarai Kale Khan', 'Ashram', 'Lajpat Nagar', 'South Extension', 'AIIMS', 'R.K. Puram'] }
];

let state = { user: "Vansh", pax: 12, mapInit: false };
let map, marker;

function vanshSystemCheck() {
    console.log("%c VJ-CORE-v2: Full Stack Prototype Active.", "color: #007bff; font-weight: bold; font-size: 14px;");
    show('login-page');
}

function show(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const el = document.getElementById(id);
    if(el) el.style.display = (id === 'login-page') ? 'flex' : 'block';
    
    // Professor's Map Init
    if(id === 'passenger-dashboard' && !state.mapInit) {
        setTimeout(initMap, 500);
        state.mapInit = true;
    }
}

function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([28.6139, 77.2090]).addTo(map);
    
    // Simulate Bus Movement
    setInterval(() => {
        let lat = marker.getLatLng().lat + (Math.random() - 0.5) * 0.005;
        let lng = marker.getLatLng().lng + (Math.random() - 0.5) * 0.005;
        marker.setLatLng([lat, lng]);
    }, 4000);
}

function notify(title, msg, icon = 'bi-shield-check') {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = msg;
    document.getElementById('modal-icon').className = `bi ${icon}`;
    document.getElementById('alert-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    vanshSystemCheck();
    document.getElementById('modal-close-btn').onclick = () => document.getElementById('alert-modal').style.display = 'none';

    // LOGIN LOGIC
    document.querySelectorAll('.login-trigger').forEach(btn => {
        btn.onclick = () => {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            if(name.length > 2 && phone.length === 10) {
                state.user = name;
                document.getElementById('user-display').innerText = name;
                show(btn.dataset.target);
            } else {
                notify("Auth Error", "Please provide valid 10-digit mobile number.", "bi-exclamation-octagon");
            }
        };
    });

    document.querySelectorAll('.logout-btn').forEach(b => b.onclick = () => { state.mapInit = false; show('login-page'); });
    document.querySelectorAll('.back-btn').forEach(b => b.onclick = () => show(b.dataset.target));
    document.querySelectorAll('.nav-card').forEach(c => c.onclick = () => show(c.dataset.page));

    // PROFESSOR'S QR TICKET LOGIC
    const rs = document.getElementById('r-sel');
    const ss = document.getElementById('s-sel');
    const es = document.getElementById('end-sel'); // Professor's mapping fix
    routes.forEach(r => rs.add(new Option(r.name, r.id)));

    rs.onchange = () => {
        const r = routes.find(x => x.id === rs.value);
        document.getElementById('s-sel').innerHTML = document.getElementById('e-sel').innerHTML = '<option>-- Select --</option>';
        if(r) {
            r.stops.forEach(s => { 
                document.getElementById('s-sel').add(new Option(s,s)); 
                document.getElementById('e-sel').add(new Option(s,s)); 
            });
            document.getElementById('s-sel').disabled = document.getElementById('e-sel').disabled = false;
        }
    };

    document.getElementById('book-btn').onclick = () => {
        if(rs.value && document.getElementById('s-sel').value) {
            const hash = `VJ-DTC-${Math.floor(1000 + Math.random() * 9000)}`;
            document.getElementById('vj-hash').innerText = hash;
            
            // Generate REAL QR Code
            const qrData = JSON.stringify({ ticket: hash, user: state.user, route: rs.value });
            QRCode.toCanvas(document.getElementById('qr-canvas'), qrData, { width: 150 });
            
            document.getElementById('ticket-result').style.display = 'block';
            notify("Ticket Issued", `QR Code generated for ID ${hash}`, "bi-qr-code");
        }
    };

    // SYSTEM UTILS
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }, 1000);
    document.getElementById('p-plus').onclick = () => { state.pax++; document.getElementById('dr-pax').innerText = state.pax; };
    document.getElementById('p-min').onclick = () => { if(state.pax > 0) state.pax--; document.getElementById('dr-pax').innerText = state.pax; };
});
