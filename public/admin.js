import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, orderBy, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const els = {
    loginScreen: document.getElementById('login-screen'),
    mainApp: document.getElementById('main-app'),
    loginForm: document.getElementById('login-form'),
    loginErr: document.getElementById('login-error'),
    userEmail: document.getElementById('user-email-display'),
    settingsEmail: document.getElementById('settings-email'),
    logoutBtn: document.getElementById('logout-btn'),
    // Nav
    navItems: document.querySelectorAll('.nav-item'),
    pages: document.querySelectorAll('.page-content'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    // slideout
    slideover: document.getElementById('promo-slideover'),
    slideoverBackdrop: document.getElementById('promo-slideover-backdrop'),
    // forms
    promoForm: document.getElementById('promo-form'),
    promoSaveBtn: document.getElementById('promo-save-btn'),
    annForm: document.getElementById('announcement-form'),
    pwForm: document.getElementById('password-form'),
    // dialog
    confirmDialog: document.getElementById('confirm-dialog'),
    // dash
    dashTable: document.getElementById('dash-promo-table'),
    promoList: document.getElementById('promo-list')
};

let rawPromos = [];
let applyToItemsData = [];
let confirmCallback = null;

// UI Utils
function showToast(title, msg, type = 'info') {
    const cont = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const icons = { success: '✓', error: '✕', info: 'i' };
    
    toast.className = `flex items-start gap-3 bg-white p-4 rounded-xl shadow-lg border border-gray-100 pointer-events-auto ${window.innerWidth >= 768 ? 'toast-desktop' : 'toast-mobile'}`;
    toast.innerHTML = `
        <div class="w-6 h-6 rounded-full ${colors[type]} text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">${icons[type]}</div>
        <div class="flex-1 text-left"><h4 class="text-sm font-bold text-gray-900">${title}</h4><p class="text-xs text-gray-500 mt-0.5">${msg}</p></div>
        <button class="text-gray-400 hover:text-gray-600">✕</button>
    `;
    
    cont.appendChild(toast);
    if(cont.children.length > 4) cont.removeChild(cont.firstChild);
    
    const closeBtn = toast.querySelector('button');
    let tOut = setTimeout(() => hideToast(toast), type === 'error' ? 6000 : 4000);
    closeBtn.onclick = () => { clearTimeout(tOut); hideToast(toast); };
}
function hideToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = window.innerWidth >= 768 ? 'translateX(20px)' : 'translateY(-20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
}

function transErr(code) {
    if(code.includes('wrong-password') || code.includes('invalid-credential')) return "Email atau password salah.";
    if(code.includes('user-not-found')) return "Akun tidak ditemukan.";
    if(code.includes('too-many-requests')) return "Terlalu banyak percobaan. Coba beberapa menit lagi.";
    return "Terjadi kesalahan. Silakan coba lagi. " + code;
}

// Auth Logic
onAuthStateChanged(auth, user => {
    if (user) {
        els.userEmail.textContent = user.email;
        els.settingsEmail.textContent = user.email;
        els.loginScreen.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => els.loginScreen.classList.add('hidden'), 300);
        els.mainApp.classList.remove('hidden');
        setTimeout(() => els.mainApp.classList.remove('opacity-0'), 50);
        initData();
    } else {
        els.mainApp.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => els.mainApp.classList.add('hidden'), 300);
        els.loginScreen.classList.remove('hidden');
        setTimeout(() => els.loginScreen.classList.remove('opacity-0', 'pointer-events-none'), 50);
    }
});

els.loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Masuk...';
    els.loginErr.classList.add('hidden');
    try {
        await signInWithEmailAndPassword(auth, document.getElementById('login-email').value, document.getElementById('login-password').value);
    } catch(err) {
        els.loginErr.textContent = transErr(err.code);
        els.loginErr.classList.remove('hidden');
    }
    btn.disabled = false; btn.textContent = 'Masuk';
}
document.getElementById('toggle-password').onclick = (e) => {
    const i = document.getElementById('login-password');
    if(i.type === 'password') { i.type = 'text'; e.target.textContent = '🔒'; }
    else { i.type = 'password'; e.target.textContent = '👁'; }
}
els.logoutBtn.onclick = () => signOut(auth);

// Sidebar Logic
function navTo(pageId) {
    els.pages.forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    els.navItems.forEach(i => {
        i.classList.remove('bg-[#F0F0F5]', 'border-l-4', 'border-[#00001A]', 'font-semibold');
        if(i.dataset.target === pageId) i.classList.add('bg-[#F0F0F5]', 'border-l-4', 'border-[#00001A]', 'font-semibold');
    });
    if(window.innerWidth < 768) closeSidebar();
}
els.navItems.forEach(i => i.onclick = () => navTo(i.dataset.target));
els.mobileMenuBtn.onclick = () => {
    els.sidebar.classList.remove('-translate-x-full');
    els.sidebarBackdrop.classList.remove('hidden');
};
function closeSidebar() {
    els.sidebar.classList.add('-translate-x-full');
    els.sidebarBackdrop.classList.add('hidden');
}
els.sidebarBackdrop.onclick = closeSidebar;

// Format Utils
function fmtDate(ts) {
    if(!ts) return '-';
    // ts is firestore Timestamp
    return ts.toDate().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
}
function isoDateString(ts) {
    if(!ts) return '';
    const d = ts.toDate();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
}

// Data Fetching
function initData() {
    // Promos
    onSnapshot(query(collection(db, "promos"), orderBy("priority", "asc")), (snap) => {
        rawPromos = [];
        snap.forEach(d => rawPromos.push({ id: d.id, ...d.data() }));
        renderDashboard();
        renderPromoList();
    });

    // Announcement
    onSnapshot(doc(db, "announcement", "current"), (d) => {
        if(d.exists()) renderAnnouncement(d.data());
    });
}

function getPromoStatus(p) {
    const now = new Date().getTime();
    const start = p.startDate ? p.startDate.toMillis() : 0;
    const end = p.endDate ? p.endDate.toMillis() : Infinity;
    if(!p.isActive) return { s:'Nonaktif', c:'bg-gray-100 text-gray-600', val:'inactive' };
    if(now < start) return { s:'Mendatang', c:'bg-yellow-100 text-yellow-800', val:'upcoming' };
    if(now > end) return { s:'Berakhir', c:'bg-gray-100 text-gray-500', val:'expired' };
    return { s:'Aktif', c:'bg-green-100 text-green-800', val:'active' };
}

function renderDashboard() {
    const statuses = rawPromos.map(p => getPromoStatus(p).val);
    document.getElementById('stat-active').textContent = statuses.filter(s=>s==='active').length;
    document.getElementById('stat-upcoming').textContent = statuses.filter(s=>s==='upcoming').length;
    document.getElementById('stat-expired').textContent = statuses.filter(s=>s==='expired').length; // simple, not strictly 30 days

    const sortedByDate = [...rawPromos].sort((a,b) => (b.createdAt?.toMillis()||0) - (a.createdAt?.toMillis()||0)).slice(0,5);
    if(sortedByDate.length===0) {
        els.dashTable.innerHTML = '<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">Belum ada promo.</td></tr>';
    } else {
        els.dashTable.innerHTML = sortedByDate.map(p => {
            const st = getPromoStatus(p);
            return `<tr class="hover:bg-gray-50">
                <td class="px-5 py-4 font-medium">${p.title}</td>
                <td class="px-5 py-4 text-gray-500 capitalize">${p.type}</td>
                <td class="px-5 py-4"><span class="px-2 py-1 rounded text-xs font-medium ${st.c}">${st.s}</span></td>
                <td class="px-5 py-4 text-right flex gap-3 justify-end items-center text-gray-400">
                    <button onclick="editPromo('${p.id}')" class="hover:text-[#00001A]">✏️</button>
                    <button onclick="prepDelete('${p.id}')" class="hover:text-red-500">🗑️</button>
                </td>
            </tr>`;
        }).join('');
    }
}

function renderPromoList() {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const statF = document.getElementById('filter-status').value;
    
    const filtered = rawPromos.filter(p => {
        const matchS = p.title.toLowerCase().includes(search);
        const st = getPromoStatus(p).val;
        if(statF === 'all') return matchS;
        if(statF === 'active') return matchS && st==='active';
        return matchS && st===statF;
    });

    if(filtered.length === 0) {
        els.promoList.innerHTML = '<div class="text-center py-12 text-gray-400">Tidak ada promo ditemukan.</div>';
        return;
    }

    els.promoList.innerHTML = filtered.map(p => {
        const st = getPromoStatus(p);
        const tag = p.applyToItems?.length ? ` · Berlaku untuk: ${p.applyToItems.length} menu` : '';
        return `
        <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white tracking-widest" style="background-color: ${p.badgeColor||'#333'}">${p.type}</span>
                    <h4 class="font-bold text-gray-900">${p.title}</h4>
                </div>
                <p class="text-sm text-gray-500 mb-2 truncate max-w-[300px] md:max-w-md">${p.subtitle || p.discountLabel}</p>
                <div class="text-[11px] text-gray-400 font-medium">
                    📅 ${fmtDate(p.startDate)} – ${fmtDate(p.endDate)}${tag} · Prioritas: ${p.priority || 1}
                </div>
            </div>
            <div class="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                <div class="flex items-center gap-2">
                    <span class="text-xs ${st.c} px-2 py-1 rounded font-medium">${st.s}</span>
                </div>
                <div class="flex items-center gap-4">
                    <label class="relative inline-block w-10 h-5 cursor-pointer">
                        <input type="checkbox" ${p.isActive?'checked':''} onchange="togglePromoActive('${p.id}', this.checked)" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border appearance-none cursor-pointer"/>
                        <div class="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></div>
                    </label>
                    <button onclick="editPromo('${p.id}')" class="text-sm text-gray-500 hover:text-[#00001A]">Edit</button>
                    <button onclick="prepDelete('${p.id}')" class="text-sm text-red-400 hover:text-red-600">Hapus</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

document.getElementById('filter-search').addEventListener('input', renderPromoList);
document.getElementById('filter-status').addEventListener('change', renderPromoList);

window.togglePromoActive = async (id, val) => {
    try {
        await updateDoc(doc(db, "promos", id), { isActive: val });
        showToast("Disimpan ✓", `Promo ${val?'diaktifkan':'dinonaktifkan'}.`, "success");
    } catch(e) {
        showToast("Error", "Gagal update status", "error");
    }
}

// ------ PROMO FORM SLIDE OVER ------
function openSlide() {
    els.slideoverBackdrop.classList.remove('hidden');
    setTimeout(() => els.slideoverBackdrop.classList.remove('opacity-0'), 10);
    els.slideover.classList.remove('slide-closed');
    els.slideover.classList.add('slide-open');
}
function closeSlide() {
    els.slideover.classList.remove('slide-open');
    els.slideover.classList.add('slide-closed');
    els.slideoverBackdrop.classList.add('opacity-0');
    setTimeout(() => els.slideoverBackdrop.classList.add('hidden'), 300);
}
document.getElementById('close-slideover-btn').onclick = closeSlide;
document.getElementById('promo-cancel-btn').onclick = closeSlide;
document.getElementById('add-promo-btn').onclick = () => {
    document.getElementById('promo-form-title').textContent = "Tambah Promo Baru";
    els.promoForm.reset();
    document.getElementById('p-id').value = '';
    applyToItemsData = [];
    renderTags();
    togglePromoTypeFields();
    openSlide();
}

// Tags
const tagInput = document.getElementById('p-tag-input');
const tagCont = document.getElementById('p-tags-container');
tagInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const v = tagInput.value.trim().replace(',','');
        if(v && !applyToItemsData.includes(v)) {
            applyToItemsData.push(v);
            renderTags();
        }
        tagInput.value = '';
    }
});
function renderTags() {
    const existing = tagCont.querySelectorAll('.p-tag-item');
    existing.forEach(e => e.remove());
    applyToItemsData.forEach(t => {
        const el = document.createElement('div');
        el.className = 'p-tag-item bg-[#00001A]/10 text-[#00001A] text-xs px-2 py-1 rounded-md flex items-center gap-1';
        el.innerHTML = `<span>${t}</span><button type="button" class="text-gray-500 hover:text-red-500 font-bold" onclick="removeTag('${t}')">✕</button>`;
        tagCont.insertBefore(el, tagInput);
    });
}
window.removeTag = (t) => { applyToItemsData = applyToItemsData.filter(x => x!==t); renderTags(); }

// logic form dynamic
function togglePromoTypeFields() {
    const t = document.getElementById('p-type').value;
    document.getElementById('p-flash-note').classList.toggle('hidden', t !== 'flash');
    document.getElementById('p-loyalty-wrap').classList.toggle('hidden', t !== 'loyalty');
}
document.getElementById('p-type').addEventListener('change', togglePromoTypeFields);
document.getElementById('p-loyalty').addEventListener('input', e => document.getElementById('p-loyalty-val').textContent = e.target.value+'/10');
document.getElementById('p-badge').addEventListener('input', e => document.getElementById('p-badge-preview').style.backgroundColor = e.target.value);

// Save Promo
els.promoSaveBtn.onclick = async () => {
    if(!els.promoForm.checkValidity()) return els.promoForm.reportValidity();
    
    const id = document.getElementById('p-id').value;
    const startObj = document.getElementById('p-start').value;
    const endObj = document.getElementById('p-end').value;
    if(new Date(endObj) <= new Date(startObj)) {
        showToast("Error", "Tanggal selesai harus setelah tanggal mulai.", "error"); return;
    }

    els.promoSaveBtn.innerHTML = '<span class="loader"></span> Menyimpan...';
    els.promoSaveBtn.disabled = true;

    const data = {
        title: document.getElementById('p-title').value,
        subtitle: document.getElementById('p-subtitle').value,
        description: document.getElementById('p-desc').value,
        discountLabel: document.getElementById('p-discount').value,
        badgeColor: document.getElementById('p-badge').value,
        startDate: Timestamp.fromDate(new Date(startObj)),
        endDate: Timestamp.fromDate(new Date(endObj)),
        applyToItems: applyToItemsData,
        promoCode: document.getElementById('p-code').value,
        ctaLabel: document.getElementById('p-cta').value,
        ctaUrl: document.getElementById('p-url').value,
        type: document.getElementById('p-type').value,
        loyaltyProgress: parseInt(document.getElementById('p-loyalty').value),
        priority: parseInt(document.getElementById('p-priority').value)
    };

    try {
        if(id) {
            await updateDoc(doc(db, "promos", id), data);
            showToast("Disimpan ✓", "Promo berhasil diperbarui", "success");
        } else {
            data.isActive = true; // default on add
            data.createdAt = serverTimestamp();
            await addDoc(collection(db, "promos"), data);
            showToast("Berhasil ✓", "Promo baru sudah tayang di website", "success");
        }
        closeSlide();
    } catch(err) {
        showToast("Error", "Gagal menyimpan promo", "error");
    }
    els.promoSaveBtn.textContent = 'Simpan Promo';
    els.promoSaveBtn.disabled = false;
}

window.editPromo = (id) => {
    const p = rawPromos.find(x => x.id === id);
    if(!p) return;
    document.getElementById('promo-form-title').textContent = "Edit Promo";
    document.getElementById('p-id').value = p.id;
    document.getElementById('p-title').value = p.title;
    document.getElementById('p-subtitle').value = p.subtitle || '';
    document.getElementById('p-desc').value = p.description;
    
    document.getElementById('p-type').value = p.type || 'event';
    document.getElementById('p-priority').value = p.priority || 1;
    document.getElementById('p-loyalty').value = p.loyaltyProgress || 0;
    document.getElementById('p-loyalty-val').textContent = (p.loyaltyProgress || 0)+'/10';
    
    document.getElementById('p-discount').value = p.discountLabel;
    document.getElementById('p-badge').value = p.badgeColor || '#D4A843';
    document.getElementById('p-badge-preview').style.backgroundColor = p.badgeColor || '#D4A843';
    
    document.getElementById('p-start').value = isoDateString(p.startDate);
    document.getElementById('p-end').value = isoDateString(p.endDate);
    document.getElementById('p-code').value = p.promoCode || '';
    
    applyToItemsData = p.applyToItems || [];
    renderTags();
    
    document.getElementById('p-cta').value = p.ctaLabel || 'Klaim via WhatsApp';
    document.getElementById('p-url').value = p.ctaUrl || '';
    
    togglePromoTypeFields();
    openSlide();
}

// Dialog
function showDialog(cb) {
    confirmCallback = cb;
    els.confirmDialog.classList.remove('hidden');
    els.confirmDialog.classList.add('flex');
    setTimeout(() => {
        els.confirmDialog.classList.remove('opacity-0');
        els.confirmDialog.querySelector('div').classList.remove('scale-95');
    }, 10);
}
function hideDialog() {
    els.confirmDialog.classList.add('opacity-0');
    els.confirmDialog.querySelector('div').classList.add('scale-95');
    setTimeout(() => {
        els.confirmDialog.classList.add('hidden');
        els.confirmDialog.classList.remove('flex');
    }, 200);
}
document.getElementById('confirm-cancel').onclick = hideDialog;
document.getElementById('confirm-yes').onclick = () => { if(confirmCallback) confirmCallback(); hideDialog(); }

window.prepDelete = (id) => {
    showDialog(async () => {
        try {
            await deleteDoc(doc(db, "promos", id));
            showToast("Dihapus", "Promo telah dihapus permanen", "success");
        } catch(e) { showToast("Error", "Gagal hapus promo", "error"); }
    });
}

// ------ PENGUMUMAN ------
function renderAnnouncement(d) {
    const isAct = d.isActive && (d.expiresAt ? d.expiresAt.toMillis() > new Date().getTime() : false);
    document.getElementById('ann-status-desc').textContent = isAct 
        ? 'Aktif tayang di website.' : 'Tidak ada pengumuman tayang saat ini.';
    document.getElementById('dash-announcement-badge').className = isAct ? 'px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800' : 'px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600';
    document.getElementById('dash-announcement-badge').textContent = isAct ? 'Aktif' : 'Tidak Aktif';
    document.getElementById('dash-announcement-text').textContent = d.message || 'Kosong';
    
    const tog = document.createElement('button');
    tog.className = `px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isAct ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-[#00001A] text-white border-transparent hover:bg-black'}`;
    tog.textContent = isAct ? 'Matikan Sekarang' : 'Aktifkan';
    tog.onclick = async () => {
        try { await updateDoc(doc(db, "announcement", "current"), { isActive: !d.isActive });
        } catch(e){ showToast("Error", "Gagal ubah status", "error"); }
    };
    const c = document.getElementById('ann-toggle-container'); c.innerHTML=''; c.appendChild(tog);

    document.getElementById('ann-message').value = d.message || '';
    document.getElementById('ann-bg').value = d.bgColor || '#D4A843';
    document.getElementById('ann-color').value = d.textColor || '#00001A';
    document.getElementById('ann-bg-hex').textContent = d.bgColor || '#D4A843';
    document.getElementById('ann-color-hex').textContent = d.textColor || '#00001A';
    if(d.expiresAt) document.getElementById('ann-expires').value = isoDateString(d.expiresAt);
    
    livePreviewAnn();
}

function livePreviewAnn() {
    const b = document.getElementById('ann-preview-bar');
    b.style.backgroundColor = document.getElementById('ann-bg').value;
    b.style.color = document.getElementById('ann-color').value;
    document.getElementById('ann-preview-text').textContent = document.getElementById('ann-message').value || 'Pesan kosong...';
}
document.getElementById('ann-message').oninput = livePreviewAnn;
document.getElementById('ann-bg').oninput = (e) => { document.getElementById('ann-bg-hex').textContent = e.target.value; livePreviewAnn(); }
document.getElementById('ann-color').oninput = (e) => { document.getElementById('ann-color-hex').textContent = e.target.value; livePreviewAnn(); }

els.annForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('ann-submit-btn');
    btn.innerHTML = '<span class="loader"></span> Menyimpan...'; btn.disabled = true;
    
    try {
        await setDoc(doc(db, "announcement", "current"), {
            message: document.getElementById('ann-message').value,
            bgColor: document.getElementById('ann-bg').value,
            textColor: document.getElementById('ann-color').value,
            expiresAt: Timestamp.fromDate(new Date(document.getElementById('ann-expires').value)),
            isActive: true
        });
        showToast("Disimpan ✓", "Pengumuman tayang di website", "success");
    } catch(err) {
        showToast("Error", "Gagal simpan pengumuman", "error");
    }
    btn.textContent = 'Simpan Pengumuman'; btn.disabled = false;
}

// ------ SETTINGS (PW CHANGE) ------
els.pwForm.onsubmit = async (e) => {
    e.preventDefault();
    const o = document.getElementById('pw-old').value;
    const n = document.getElementById('pw-new').value;
    const c = document.getElementById('pw-confirm').value;
    
    if(n !== c) { showToast("Gagal", "Konfirmasi password tidak cocok", "error"); return; }
    
    const btn = document.getElementById('pw-submit-btn');
    btn.innerHTML = '<span class="loader loader-dark"></span> Menyimpan...'; btn.disabled = true;

    try {
        const u = auth.currentUser;
        const cred = EmailAuthProvider.credential(u.email, o);
        await reauthenticateWithCredential(u, cred);
        await updatePassword(u, n);
        showToast("Sukses", "Password berhasil diubah", "success");
        els.pwForm.reset();
    } catch(err) {
        showToast("Gagal", transErr(err.code), "error");
    }
    btn.textContent = 'Simpan Password Baru'; btn.disabled = false;
}

// Start
navTo('page-dashboard');

