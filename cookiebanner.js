/* ============================================================
   COOKIE BANNER (GDPR) — L'Olio del Poeta
   Mostra il banner finché l'utente non sceglie. Salva la scelta
   in localStorage 'odp-cookie-consent' = accepted | rejected.
   Su "accetta" emette l'evento 'odp-consent-accepted' che fa
   partire tracking.js. Se non ci sono ID di tracking configurati,
   il banner NON appare (non servono consensi per i soli cookie tecnici).
   ============================================================ */
(function () {
  'use strict';

  function trackingConfigured() {
    var C = window.ODP_TRACKING || {};
    return !!(C.META_PIXEL_ID || C.GA4_ID || C.GOOGLE_ADS_ID);
  }
  function stored() { try { return localStorage.getItem('odp-cookie-consent'); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem('odp-cookie-consent', v); } catch (e) {} }

  function isEN() { return /(-EN\.dc\.html|\/en\/)/.test(location.pathname); }

  var T = isEN() ? {
    text: 'We use technical cookies and, with your consent, analytics and advertising cookies to improve the site and measure our campaigns.',
    accept: 'Accept', reject: 'Only essential', more: 'Privacy policy', href: 'Legali-EN.dc.html#cookie'
  } : {
    text: 'Usiamo cookie tecnici e, con il tuo consenso, cookie di analisi e pubblicit\u00e0 per migliorare il sito e misurare le campagne.',
    accept: 'Accetta', reject: 'Solo essenziali', more: 'Cookie policy', href: 'Legali.dc.html#cookie'
  };

  function build() {
    var bar = document.createElement('div');
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie');
    bar.style.cssText = [
      'position:fixed', 'left:16px', 'right:16px', 'bottom:16px', 'z-index:550',
      'max-width:560px', 'margin:0 auto', 'box-sizing:border-box',
      'background:#11160C', 'color:#F1EADB', 'border:1px solid rgba(215,201,164,0.25)',
      'border-radius:8px', 'padding:18px 20px', 'box-shadow:0 20px 50px rgba(0,0,0,0.45)',
      "font-family:'Space Grotesk',system-ui,sans-serif",
      'transform:translateY(160%)', 'transition:transform .45s cubic-bezier(.16,1,.3,1)'
    ].join(';');

    var p = document.createElement('p');
    p.style.cssText = 'margin:0 0 14px;font-size:12.5px;line-height:1.55;color:rgba(241,234,219,0.82);';
    p.innerHTML = T.text + ' <a href="' + T.href + '" style="color:#D7C9A4;text-decoration:underline;">' + T.more + '</a>.';

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;';

    var accept = document.createElement('button');
    accept.textContent = T.accept;
    accept.style.cssText = 'flex:1;min-width:130px;background:#7E2E33;color:#F7F1E4;border:none;cursor:pointer;padding:12px 18px;font-family:inherit;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;border-radius:2px;';

    var reject = document.createElement('button');
    reject.textContent = T.reject;
    reject.style.cssText = 'flex:1;min-width:130px;background:none;color:#D7C9A4;border:1px solid rgba(215,201,164,0.4);cursor:pointer;padding:12px 18px;font-family:inherit;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;border-radius:2px;';

    accept.addEventListener('click', function () { save('accepted'); close(); window.dispatchEvent(new Event('odp-consent-accepted')); });
    reject.addEventListener('click', function () { save('rejected'); close(); });

    row.appendChild(reject); row.appendChild(accept);
    bar.appendChild(p); bar.appendChild(row);
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.style.transform = 'translateY(0)'; });

    function close() { bar.style.transform = 'translateY(160%)'; setTimeout(function () { bar.remove(); }, 450); }
  }

  function boot() {
    if (!trackingConfigured()) return;     // no pixels => no consent needed
    if (stored()) return;                  // already chose
    build();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
