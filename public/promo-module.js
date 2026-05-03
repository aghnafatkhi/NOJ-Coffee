/* 
  FIREBASE CONFIGURATION
*/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/*
  FIRESTORE SECURITY RULES REQUIREMENT:
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /promos/{promoId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
      match /announcement/{docId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

(() => {
  let db;
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (err) {
    console.warn("[NOJ Promo] Firebase error. Check configuration.");
    return;
  }

  const elements = {
    announcementBar: document.getElementById('noj-promo-announcement'),
    announcementText: document.getElementById('noj-promo-announcement-text'),
    announcementClose: document.getElementById('noj-promo-announcement-close'),
    promoSection: document.getElementById('noj-promo-section'),
    promoSkeletonGrid: document.getElementById('noj-promo-skeleton-grid'),
    promoGrid: document.getElementById('noj-promo-grid'),
    flashOverlay: document.getElementById('noj-promo-flash'),
    flashContent: document.getElementById('noj-promo-flash-content'),
    flashClose: document.getElementById('noj-promo-flash-close'),
    flashDismiss: document.getElementById('noj-promo-flash-dismiss'),
    toastContainer: document.getElementById('noj-promo-toast-container'),
  };

  let activeTimers = [];

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bg-[#00001A] text-white text-[13px] py-3 px-6 rounded-full border border-white/10 shadow-xl';
    toast.style.animation = 'nojSlideUpToast 0.3s ease-out forwards';
    toast.textContent = message;
    if(elements.toastContainer) {
      elements.toastContainer.appendChild(toast);
      while(elements.toastContainer.children.length > 3) {
        elements.toastContainer.removeChild(elements.toastContainer.firstChild);
      }
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  window.nojCopyText = function(text, el) {
    navigator.clipboard.writeText(text).then(()=>{ 
      el.classList.add('copied'); 
      setTimeout(()=>el.classList.remove('copied'), 1500); 
    });
  }

  function createCountdownText(toDate) {
    const now = new Date().getTime();
    const distance = toDate - now;
    if (distance < 0) return { text: "Promo Berakhir", isImpending: false, expired: true };
    const h = Math.floor(distance / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    return {
      text: `${String(h).padStart(2, '0')} J · ${String(m).padStart(2, '0')} M · ${String(s).padStart(2, '0')} D`,
      isImpending: distance < (1000 * 60 * 60),
      expired: false
    };
  }

  function renderCardContent(promo, isFlash = false) {
    const { id, title, subtitle, description, discountLabel, badgeColor, endDate, applyToItems, promoCode, ctaLabel, ctaUrl, type, loyaltyProgress } = promo;
    
    let timerHtml = '';
    if (endDate) {
       timerHtml = `
        <div class="absolute top-8 right-8 text-right flex flex-col items-end">
            <span class="text-[10px] opacity-50 uppercase tracking-widest mb-1">Berakhir dalam</span>
            <div class="noj-promo-timer font-mono text-xs font-semibold px-2 py-1 rounded bg-[#00001A]/50 border border-white/5 backdrop-blur-sm" data-end="${endDate.toMillis()}" style="color: ${badgeColor || '#fff'}">Memuat...</div>
        </div>
       `;
    }

    let loyaltyHtml = '';
    if (type === 'loyalty') {
      let cups = '';
      const progress = loyaltyProgress || 0;
      for(let i=1; i<=10; i++) cups += `<span class="text-xl ${i <= progress ? 'opacity-100' : 'opacity-20'}">☕</span>`;
      loyaltyHtml = `
        <div class="mt-6 bg-[#00001A] rounded-xl p-4 border border-white/5">
            <div class="grid grid-cols-5 gap-y-3 gap-x-2 text-center mb-3">${cups}</div>
            <div class="text-center text-[10px] uppercase tracking-widest opacity-50">Kumpulkan 10 stamp, gratis 1 minuman!</div>
        </div>
      `;
    }

    let promoCodeHtml = '';
    if (promoCode) {
        promoCodeHtml = `<div class="mt-4"><span class="noj-promo-code" onclick="nojCopyText('${promoCode}', this)">${promoCode}</span></div>`;
    }

    let appliesToHtml = '';
    if (applyToItems && applyToItems.length > 0) {
        appliesToHtml = `<div class="mt-3 text-[11px] bg-white/5 inline-block px-2 py-1 rounded text-white/70">Berlaku untuk: ${applyToItems.join(', ')}</div>`;
    }

    return `
        ${isFlash && timerHtml ? '' : timerHtml} 
        <div class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 text-[#00001A]" style="background-color: ${badgeColor || '#D4A843'}">${discountLabel}</div>
        <h3 id="noj-promo-flash-title" class="noj-promo-font-display text-2xl md:text-3xl text-white mb-2 leading-tight">${title}</h3>
        ${subtitle ? `<p class="text-[13px] opacity-60 mb-4 font-medium">${subtitle}</p>` : ''}
        <p class="text-sm opacity-80 leading-relaxed overflow-hidden text-ellipsis" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${description}</p>
        ${appliesToHtml}
        ${promoCodeHtml}
        ${loyaltyHtml}
        <div class="mt-8 flex gap-3">
            <a href="${ctaUrl}" target="_blank" class="flex-1 bg-white text-[#00001A] text-center font-medium py-3 rounded-lg hover:bg-opacity-90 transition-opacity text-sm">${ctaLabel || 'Klaim Promo'}</a>
            <button class="noj-promo-share-btn w-12 flex-shrink-0 flex items-center justify-center border border-white/10 rounded-lg hover:bg-white/5 transition-colors" data-id="${id}">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
        </div>
    `;
  }

  function setupPromosShareListeners(promosData) {
    document.querySelectorAll('.noj-promo-share-btn').forEach(btn => {
       btn.addEventListener('click', async (e) => {
           const pId = e.currentTarget.getAttribute('data-id');
           const promo = promosData.find(p => p.id === pId);
           if(!promo) return;
           const text = `🌊 Promo NOJ Coffee: ${promo.title}\n${promo.discountLabel} — ${promo.description}\n📍 Cileungsi, Bogor\nOrder: wa.me/6285179769148`;
           try {
               if (navigator.share) await navigator.share({ title: 'Promo NOJ Coffee', text });
               else { await navigator.clipboard.writeText(text); showToast("Link promo disalin! Yuk share ke teman kamu ☕"); }
           } catch (err) {
               if (err.name !== 'AbortError') { navigator.clipboard.writeText(text); showToast("Link promo disalin! Yuk share ke teman kamu ☕"); }
           }
       });
    });
  }

  function setupTimers() {
     activeTimers.forEach(clearInterval); activeTimers = [];
     document.querySelectorAll('.noj-promo-timer').forEach(el => {
        const endMillis = parseInt(el.getAttribute('data-end'));
        const tick = () => {
            const info = createCountdownText(endMillis);
            el.innerText = info.text;
            if(info.isImpending && !info.expired) {
                el.classList.add('noj-promo-pulse', 'text-[#FF4444]');
                el.style.color = '#FF4444'; el.style.borderColor = '#FF4444';
            } else if (!info.expired) { el.classList.remove('noj-promo-pulse', 'text-[#FF4444]'); }
            if(info.expired) {
                el.classList.remove('noj-promo-pulse', 'text-[#FF4444]');
                el.style.color = 'inherit'; el.style.opacity = '0.5';
            }
        };
        tick();
        activeTimers.push(setInterval(tick, 1000));
     });
  }

  function handleMenuBadgeInjection(promosData) {
    document.querySelectorAll('.noj-promo-menu-badge').forEach(el => el.remove());
    document.querySelectorAll('[data-item-name]').forEach(card => {
         const itemName = card.getAttribute('data-item-name');
         if(!itemName) return;
         const matchedPromo = promosData.find(p => p.applyToItems && p.applyToItems.includes(itemName));
         if (matchedPromo) {
             const badge = document.createElement('div');
             badge.className = 'noj-promo-menu-badge absolute -top-3 -right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold text-[#00001A] shadow-lg';
             badge.style.backgroundColor = matchedPromo.badgeColor || '#D4A843';
             badge.textContent = matchedPromo.discountLabel;
             card.appendChild(badge);
             const pos = window.getComputedStyle(card).position;
             if (pos !== 'relative' && pos !== 'absolute') card.style.position = 'relative';
         }
    });
  }

  function triggerFlashSale(flashPromo) {
      if(!elements.flashOverlay || !elements.flashContent) return;
      const shownKey = `noj-flash-shown-${flashPromo.id}`;
      if (sessionStorage.getItem(shownKey) || sessionStorage.getItem('noj-announcement-dismissed')) return;
      sessionStorage.setItem(shownKey, '1');
      setTimeout(() => {
          elements.flashContent.innerHTML = renderCardContent(flashPromo, true);
          elements.flashOverlay.classList.remove('hidden'); elements.flashOverlay.classList.add('flex');
          const box = elements.flashOverlay.querySelector('div[role="dialog"]');
          box.style.animation = 'nojFadeScale 0.25s ease-out forwards';
          setupPromosShareListeners([flashPromo]);
      }, window.innerWidth >= 1024 ? 8000 : 0);
  }

  function loadPromosData() {
    onSnapshot(query(collection(db, "promos"), orderBy("priority", "asc")), (snapshot) => {
        const now = new Date().getTime();
        let activePromos = [], flashPromos = [];
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (!data.isActive) return;
            const start = data.startDate ? data.startDate.toMillis() : 0;
            const end = data.endDate ? data.endDate.toMillis() : Infinity;
            if (now >= start && now <= end) {
                activePromos.push({ id: docSnap.id, ...data });
                if (data.type === 'flash') flashPromos.push({ id: docSnap.id, ...data });
            }
        });

        if(elements.promoSkeletonGrid) elements.promoSkeletonGrid.classList.add('hidden');
        if(!elements.promoSection || !elements.promoGrid) return;
        
        if (activePromos.length === 0) {
            elements.promoSection.classList.add('hidden');
        } else {
            elements.promoSection.classList.remove('hidden');
            elements.promoGrid.classList.remove('hidden');
            elements.promoGrid.innerHTML = activePromos.slice(0, 4).map(promo => `
                <div class="noj-promo-card relative bg-[#0D0D2B] border border-white/10 rounded-[16px] p-6 md:p-8 flex-shrink-0 w-[85vw] md:w-auto overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    ${renderCardContent(promo)}
                </div>
            `).join('');
            setupTimers();
            setupPromosShareListeners(activePromos);
            handleMenuBadgeInjection(activePromos);
            if (flashPromos.length > 0) triggerFlashSale(flashPromos[0]);
        }
    }, (error) => {
        console.error("[NOJ Promo] Error: ", error);
        if(elements.promoSection) elements.promoSection.classList.add('hidden');
    });
  }

  function loadAnnouncementData() {
    if(!elements.announcementBar) return;
    onSnapshot(doc(db, "announcement", "current"), (docSnap) => {
        if (!docSnap.exists()) return;
        const data = docSnap.data();
        const now = new Date().getTime();
        const end = data.expiresAt ? data.expiresAt.toMillis() : Infinity;
        if (data.isActive && now <= end && !sessionStorage.getItem('noj-announcement-dismissed')) {
            elements.announcementText.textContent = data.message || '';
            elements.announcementBar.style.backgroundColor = data.bgColor || '#D4A843';
            elements.announcementBar.style.color = data.textColor || '#00001A';
            elements.announcementBar.classList.remove('hidden'); elements.announcementBar.classList.add('flex');
            elements.announcementBar.style.animation = 'nojSlideDown 0.3s ease-out forwards';
        } else {
            elements.announcementBar.classList.add('hidden'); elements.announcementBar.classList.remove('flex');
        }
    });

    elements.announcementClose.addEventListener('click', () => {
        elements.announcementBar.classList.add('hidden'); elements.announcementBar.classList.remove('flex');
        sessionStorage.setItem('noj-announcement-dismissed', '1');
    });
  }

  function closeFlash() {
      if(!elements.flashOverlay) return;
      const box = elements.flashOverlay.querySelector('div[role="dialog"]');
      box.style.transform = 'scale(0.9)'; box.style.opacity = '0';
      setTimeout(() => { elements.flashOverlay.classList.remove('flex'); elements.flashOverlay.classList.add('hidden'); }, 250);
  }

  if(elements.flashClose) elements.flashClose.addEventListener('click', closeFlash);
  if(elements.flashDismiss) elements.flashDismiss.addEventListener('click', closeFlash);
  if(elements.flashOverlay) elements.flashOverlay.addEventListener('click', (e) => { if(e.target === elements.flashOverlay) closeFlash(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && elements.flashOverlay && !elements.flashOverlay.classList.contains('hidden')) closeFlash(); });

  loadAnnouncementData();
  loadPromosData();
})();
