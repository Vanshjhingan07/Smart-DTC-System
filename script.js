const busRoutes = [
    { id: '957', name: '957: Shivaji Stadium ↔ Madipur', fare: { ac: 6, nonAc: 3 }, stops: ['Shivaji Stadium', 'Karol Bagh', 'Patel Nagar', 'Shadipur', 'Punjabi Bagh', 'Madipur'] },
    { id: '544', name: '544: Sarai Kale Khan ↔ R.K. Puram', fare: { ac: 7, nonAc: 4 }, stops: ['Sarai Kale Khan', 'Ashram', 'Lajpat Nagar', 'South Extension', 'AIIMS', 'R.K. Puram'] },
    { id: '729', name: '729: Mori Gate ↔ Kapashera Border', fare: { ac: 5, nonAc: 2.5 }, stops: ['Mori Gate', 'Azad Market', 'Karol Bagh', 'Naraina', 'Delhi Cantt', 'Palam', 'Kapashera Border'] }
];

function show(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const el = document.getElementById(id);
    if(el) el.style.display = (id === 'login-page') ? 'flex' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    // Nav Logic
    document.querySelectorAll('.login-trigger').forEach(b => b.onclick = () => {
        if(document.getElementById('email').checkValidity()) show(b.dataset.target);
        else alert("Enter valid details");
    });
    document.querySelectorAll('.logout-btn').forEach(b => b.onclick = () => show('login-page'));
    document.querySelectorAll('.back-btn').forEach(b => b.onclick = () => show(b.dataset.target));
    document.querySelectorAll('.nav-card').forEach(c => c.onclick = () => show(c.dataset.page));

    // Ticket Logic
    const rSel = document.getElementById('route-sel');
    const sSel = document.getElementById('start-sel');
    const eSel = document.getElementById('end-sel');
    busRoutes.forEach(r => rSel.add(new Option(r.name, r.id)));

    rSel.onchange = () => {
        const r = busRoutes.find(x => x.id === rSel.value);
        sSel.innerHTML = eSel.innerHTML = '<option>-- Select --</option>';
        if(r) {
            r.stops.forEach(s => { sSel.add(new Option(s,s)); eSel.add(new Option(s,s)); });
            sSel.disabled = eSel.disabled = false;
        }
    };

    const updateFare = () => {
        const r = busRoutes.find(x => x.id === rSel.value);
        if(r && sSel.value && eSel.value) {
            const dist = Math.abs(r.stops.indexOf(eSel.value) - r.stops.indexOf(sSel.value));
            const type = document.querySelector('input[name="btype"]:checked').value;
            document.getElementById('fare-res').innerText = `Fare: ₹${dist * r.fare[type] * document.getElementById('t-count').value}`;
        }
    };
    [rSel, sSel, eSel, document.getElementById('t-count')].forEach(el => el.onchange = updateFare);
    document.getElementById('buy-btn').onclick = () => alert("Ticket Booked!");

    // Planner Logic
    const pS = document.getElementById('p-start');
    const pE = document.getElementById('p-end');
    [...new Set(busRoutes.flatMap(r => r.stops))].sort().forEach(s => { pS.add(new Option(s,s)); pE.add(new Option(s,s)); });
    document.getElementById('search-btn').onclick = () => {
        const res = busRoutes.filter(r => r.stops.includes(pS.value) && r.stops.includes(pE.value));
        document.getElementById('p-results').innerHTML = res.map(r => `<div class="card">${r.name}</div>`).join('') || "No buses found.";
    };

    document.getElementById('darkToggle').onclick = () => document.body.classList.toggle('dark');
    show('login-page');
});
