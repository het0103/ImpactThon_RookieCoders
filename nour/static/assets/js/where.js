// /* warehouse.js
//    Enhances the NourishNet-NGO UI:
//    - search filtering, slider auto-scroll, lazy loading, modals, donate form stub,
//    - mobile menu, smooth scrolling, navbar active-link on scroll
// */

// /* === Utility helpers === */
// const $ = (sel, root = document) => root.querySelector(sel);
// const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
// const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

// /* Wait until DOM loaded (script is deferred but safe) */
// (function init() {
//   /* Elements (may be missing on some pages) */
//   const header = $('.sticky-header') || $('header');
//   const navbar = $('.navbar');
//   const navLinks = navbar ? $$('.navbar a') : [];
//   const searchInput = $('.search-input');
//   const sliding = $('.sliding-container');
//   const cards = sliding ? $$('.grid-item', sliding) : [];
//   const rightCards = $$('.right-card');
//   const threeBoxes = $$('.three-box');
//   const donateButtons = $$('.cta, #donate-now');

//   /* ---------- 1) MOBILE MENU (if not present) ---------- */
//   (function createMobileMenu() {
//     if (!navbar) return;
//     // Create a hamburger if none exists
//     if (!$('.mobile-toggle')) {
//       const btn = document.createElement('button');
//       btn.className = 'mobile-toggle';
//       btn.setAttribute('aria-label', 'Open menu');
//       btn.innerHTML = '&#9776;'; // simple hamburger
//       btn.style.cssText = `
//         background: transparent; border: none; color: inherit; font-size: 1.4rem;
//         cursor: pointer; margin-right: 10px;
//       `;
//       // insert at the start of header
//       if (header) header.insertBefore(btn, header.firstChild);
//       btn.addEventListener('click', () => {
//         navbar.classList.toggle('open');
//         btn.setAttribute('aria-expanded', navbar.classList.contains('open'));
//       });

//       // Close menu on outside click
//       document.addEventListener('click', (e) => {
//         if (!navbar.contains(e.target) && !btn.contains(e.target)) {
//           navbar.classList.remove('open');
//           btn.setAttribute('aria-expanded', 'false');
//         }
//       });
//     }
//   })();

//   /* ---------- 2) SEARCH / FILTER CARDS ---------- */
//   (function enableSearch() {
//     if (!searchInput || !cards.length) return;
//     const normalized = (s) => s.trim().toLowerCase();

//     searchInput.addEventListener('input', (e) => {
//       const q = normalized(e.target.value);
//       cards.forEach(card => {
//         const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
//         const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
//         const matches = title.includes(q) || desc.includes(q);
//         card.style.display = q ? (matches ? '' : 'none') : '';
//       });
//     });
//   })();

//   /* ---------- 3) SLIDER AUTO-SCROLL (pause on hover) ---------- */
//   (function sliderAutoScroll() {
//     if (!sliding) return;
//     let speed = 0.6; // pixels per tick (~ms)
//     let rafId = null;
//     let paused = false;
//     const step = () => {
//       if (!paused) sliding.scrollLeft += speed;
//       // loop if at end
//       if (sliding.scrollLeft + sliding.clientWidth >= sliding.scrollWidth - 1) {
//         sliding.scrollLeft = 0;
//       }
//       rafId = requestAnimationFrame(step);
//     };
//     // Start
//     rafId = requestAnimationFrame(step);
//     // Pause on hover/focus
//     sliding.addEventListener('mouseenter', () => paused = true);
//     sliding.addEventListener('mouseleave', () => paused = false);
//     sliding.addEventListener('focusin', () => paused = true);
//     sliding.addEventListener('focusout', () => paused = false);

//     // Clean up on page unload
//     on(window, 'beforeunload', () => cancelAnimationFrame(rafId));
//   })();

//   /* ---------- 4) LAZY-LOAD IMAGES (IntersectionObserver) ---------- */
//   (function lazyLoadImages() {
//     const imgs = $$('img');
//     if (!imgs.length || !('IntersectionObserver' in window)) {
//       // fallback: nothing to do (images already load)
//       return;
//     }
//     const io = new IntersectionObserver((entries, obs) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           const img = entry.target;
//           if (img.dataset.src) {
//             img.src = img.dataset.src;
//             img.removeAttribute('data-src');
//           }
//           obs.unobserve(img);
//         }
//       });
//     }, { rootMargin: '200px 0px' });

//     imgs.forEach(img => {
//       // If we want to use lazy-load, move src->data-src in HTML or here:
//       if (!img.dataset.src && img.src) {
//         // leave as-is (already has src). But still observe to defer heavy images if needed.
//         // For demonstration we won't change existing src.
//       }
//       io.observe(img);
//     });
//   })();

//   /* ---------- 5) RIGHT-CARD MODAL ---------- */
//   (function rightCardModal() {
//     if (!rightCards.length) return;

//     // Create modal skeleton
//     const modal = document.createElement('div');
//     modal.className = 'nn-modal';
//     modal.style.cssText = `
//       position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
//       background: rgba(0,0,0,0.6); z-index: 12000; padding: 20px;
//     `;
//     modal.innerHTML = `
//       <div class="nn-modal-inner" role="dialog" aria-modal="true" style="
//          max-width: 900px; width: 100%; background: rgba(255,255,255,0.06);
//          border-radius: 12px; padding: 16px; color: #fff;
//       ">
//         <button class="nn-modal-close" aria-label="Close" style="
//           float:right; background:transparent; border:none; font-size:1.4rem; color:inherit; cursor:pointer;">✕</button>
//         <div class="nn-modal-content" style="display:flex; gap:16px; flex-wrap:wrap;"></div>
//       </div>
//     `;
//     document.body.appendChild(modal);
//     const modalContent = modal.querySelector('.nn-modal-content');
//     const modalClose = modal.querySelector('.nn-modal-close');

//     function openModalFromCard(card) {
//       const img = card.querySelector('img') ? card.querySelector('img').src : '';
//       const title = card.querySelector('h3')?.textContent || '';
//       const p = card.querySelector('p')?.textContent || '';
//       modalContent.innerHTML = `
//         <div style="flex:1 1 320px;">
//           <img src="${img}" alt="${title}" style="width:100%; border-radius:12px; object-fit:cover;">
//         </div>
//         <div style="flex:1 1 300px;">
//           <h2 style="margin-top:0">${title}</h2>
//           <p>${p}</p>
//           <div style="margin-top:12px;">
//             <button class="nn-action-donate" style="padding:10px 14px; border-radius:8px; border:none; cursor:pointer;">Donate to this cause</button>
//           </div>
//         </div>
//       `;
//       modal.style.display = 'flex';
//       // focus the close button for keyboard users
//       modalClose.focus();

//       // action button inside modal: open donate modal
//       const actionDonate = modalContent.querySelector('.nn-action-donate');
//       if (actionDonate) actionDonate.addEventListener('click', () => openDonateModal(card));
//     }

//     rightCards.forEach(card => {
//       card.style.cursor = 'pointer';
//       card.addEventListener('click', () => openModalFromCard(card));
//       // keyboard support
//       card.setAttribute('tabindex', '0');
//       card.addEventListener('keydown', (ev) => {
//         if (ev.key === 'Enter' || ev.key === ' ') openModalFromCard(card);
//       });
//     });

//     function closeModal() {
//       modal.style.display = 'none';
//     }
//     modalClose.addEventListener('click', closeModal);
//     modal.addEventListener('click', (ev) => {
//       if (ev.target === modal) closeModal();
//     });
//     document.addEventListener('keydown', (ev) => {
//       if (ev.key === 'Escape') closeModal();
//     });
//   })();

//   /* ---------- 6) DONATE MODAL (global) ---------- */
//   (function donateModal() {
//     // create a single donate modal and reuse
//     const donateModal = document.createElement('div');
//     donateModal.className = 'donate-modal';
//     donateModal.style.cssText = `
//       position:fixed; inset:0; display:none; align-items:center; justify-content:center;
//       background: rgba(0,0,0,0.6); z-index:13000; padding: 24px;
//     `;
//     donateModal.innerHTML = `
//       <div style="background: rgba(255,255,255,0.06); padding:18px; border-radius:12px; max-width:560px; width:100%;">
//         <button class="donate-close" aria-label="Close" style="float:right; background:transparent; border:none; font-size:1.3rem; color:inherit; cursor:pointer;">✕</button>
//         <h2>Support NourishNet</h2>
//         <p>Thanks for wanting to donate — this is a demo placeholder. Integrate your payment gateway here.</p>
//         <form class="donate-form" style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
//           <input name="name" placeholder="Your name" style="padding:10px; border-radius:8px; border:none; background:rgba(255,255,255,0.04); color:inherit;">
//           <input name="amount" placeholder="Amount (e.g. 500)" type="number" style="padding:10px; border-radius:8px; border:none; background:rgba(255,255,255,0.04); color:inherit;">
//           <div style="display:flex; gap:8px; margin-top:6px;">
//             <button type="submit" style="flex:1; padding:10px; border-radius:8px; border:none; cursor:pointer; background:#ffb300;">Donate (demo)</button>
//             <button type="button" class="donate-cancel" style="flex:1; padding:10px; border-radius:8px; border:none; cursor:pointer;">Cancel</button>
//           </div>
//         </form>
//       </div>
//     `;
//     document.body.appendChild(donateModal);

//     const openDonateModal = (sourceElement) => {
//       donateModal.style.display = 'flex';
//       donateModal.querySelector('input[name="name"]').focus();
//       // trap focus - simple trap
//       const focusable = donateModal.querySelectorAll('button, input, [tabindex]');
//       const first = focusable[0], last = focusable[focusable.length - 1];
//       const keyHandler = (e) => {
//         if (e.key === 'Tab') {
//           if (e.shiftKey && document.activeElement === first) {
//             e.preventDefault(); last.focus();
//           } else if (!e.shiftKey && document.activeElement === last) {
//             e.preventDefault(); first.focus();
//           }
//         }
//         if (e.key === 'Escape') closeDonate();
//       };
//       donateModal._keyHandler = keyHandler;
//       document.addEventListener('keydown', keyHandler);
//     };

//     const closeDonate = () => {
//       donateModal.style.display = 'none';
//       document.removeEventListener('keydown', donateModal._keyHandler);
//     };

//     on(donateModal.querySelector('.donate-close'), 'click', closeDonate);
//     on(donateModal.querySelector('.donate-cancel'), 'click', closeDonate);
//     donateModal.addEventListener('click', (ev) => {
//       if (ev.target === donateModal) closeDonate();
//     });
//     donateModal.querySelector('.donate-form')?.addEventListener('submit', (ev) => {
//       ev.preventDefault();
//       // placeholder action: show thanks message
//       const data = new FormData(ev.target);
//       closeDonate();
//       alert(`Thanks, ${data.get('name')}! (Demo donate: ₹${data.get('amount')})`);
//     });

//     // Connect any donate buttons on the page
//     donateButtons.forEach(btn => btn.addEventListener('click', (ev) => {
//       ev.preventDefault();
//       openDonateModal(btn);
//     }));

//     // expose a helper to other modules (like rightCardModal)
//     window.openDonateModal = openDonateModal;
//   })();

//   /* ---------- 7) THREE-BOX INTERACTIONS (expand/learn-more) ---------- */
//   (function threeBoxesBehavior() {
//     if (!threeBoxes.length) return;
//     threeBoxes.forEach(box => {
//       box.style.cursor = 'pointer';
//       const more = document.createElement('div');
//       more.className = 'three-more';
//       more.style.cssText = 'display:none; margin-top:10px; font-size:0.95rem; color:#ddd;';
//       more.innerHTML = '<p style="margin:0">More info: visit the page to see full list and pickup locations.</p>';
//       box.appendChild(more);
//       box.addEventListener('click', () => {
//         more.style.display = more.style.display === 'none' ? 'block' : 'none';
//       });
//     });
//   })();

//   /* ---------- 8) SMOOTH SCROLL FOR LINKS ---------- */
//   (function smoothScrollLinks() {
//     if (!navLinks.length) return;
//     navLinks.forEach(a => {
//       const href = a.getAttribute('href') || '';
//       if (href.startsWith('#')) {
//         a.addEventListener('click', (ev) => {
//           ev.preventDefault();
//           const t = $(href);
//           if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         });
//       }
//     });
//     // Also smooth scroll for any anchor links across page
//     document.addEventListener('click', (ev) => {
//       const a = ev.target.closest('a[href^="#"]');
//       if (a) {
//         const target = $(a.getAttribute('href'));
//         if (target) {
//           ev.preventDefault();
//           target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//       }
//     });
//   })();

//   /* ---------- 9) NAVBAR ACTIVE LINK HIGHLIGHT ON SCROLL ---------- */
//   (function navActiveOnScroll() {
//     if (!navLinks.length) return;
//     // Build sections map (links pointing to #id)
//     const sections = navLinks
//       .map(a => {
//         const href = a.getAttribute('href') || '';
//         if (!href.startsWith('#')) return null;
//         const id = href.slice(1);
//         const el = document.getElementById(id);
//         return el ? { link: a, section: el } : null;
//       })
//       .filter(Boolean);

//     if (!sections.length) return;

//     const onScroll = () => {
//       const top = window.scrollY + (window.innerHeight / 6);
//       let current = null;
//       sections.forEach(s => {
//         const rect = s.section.getBoundingClientRect();
//         const offsetTop = window.scrollY + rect.top;
//         if (offsetTop <= top) current = s;
//       });
//       navLinks.forEach(a => a.classList.remove('active'));
//       if (current) current.link.classList.add('active');
//     };
//     window.addEventListener('scroll', onScroll, { passive: true });
//     onScroll();
//   })();

//   /* ---------- 10) Small Accessibility tweak: add tabindex to clickable things ---------- */
//   (function a11yTweak() {
//     const clickable = $$('.grid-item').concat($$('.right-card'), $$('.three-box'));
//     clickable.forEach(el => {
//       if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
//     });
//   })();

//   /* ---------- END init ---------- */
//   // console.log('warehouse.js initialized');
// })();

// /* Optional: small CSS helper injection for modal styles and navbar open state.
//    This is just to avoid making user edit CSS if they haven't added the needed rules.
// */
// (function injectSmallStyles() {
//   const css = `
//     /* navbar open state (mobile) */
//     .navbar.open { display:flex !important; flex-direction:column; position:absolute; right:16px; top:60px; background: rgba(0,0,0,0.6); padding:12px; border-radius:10px; }
//     @media(min-width:900px) { .navbar.open { position:static; flex-direction:row; background:transparent; padding:0; } }

//     /* modal inner elements focus outline */
//     .nn-modal .nn-modal-inner:focus, .donate-modal :focus { outline: none; }
//   `;
//   const s = document.createElement('style');
//   s.textContent = css;
//   document.head.appendChild(s);
// })();
