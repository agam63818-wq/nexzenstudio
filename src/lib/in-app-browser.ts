/**
 * In-app browser (WebView) detection + escape hatches.
 *
 * Instagram and Facebook open bio links inside an embedded WebView rather than
 * the system browser. Those WebViews:
 *   - run older Chromium (Android) or WKWebView (iOS) engines,
 *   - frequently block or throttle WebGL,
 *   - cache aggressively and ignore normal revalidation,
 *   - and sometimes fail to execute the modern client bundle at all.
 *
 * Everything in this module is dependency-free so it can be used from server
 * components, client components, or serialised into a blocking inline script.
 */

/** Matches Instagram's WebView UA, e.g. "... Instagram 302.0.0.23.113 Android". */
export const INSTAGRAM_UA = /Instagram/i;

/**
 * In-app WebViews we offer an escape hatch for.
 *
 * Deliberately narrow: Instagram plus Facebook's WebView tokens (FBAN = app
 * name, FBAV = app version, FB_IAB = in-app browser). Nothing here can appear
 * in a stock Chrome or Safari UA, so regular visitors never match.
 */
export const IN_APP_UA = /Instagram|FBAN|FBAV|FB_IAB/i;

export const ANDROID_UA = /Android/i;
export const IOS_UA = /iPhone|iPad|iPod/i;

export function isInstagramUA(ua: string | null | undefined): boolean {
  return !!ua && INSTAGRAM_UA.test(ua);
}

export function isInAppBrowserUA(ua: string | null | undefined): boolean {
  return !!ua && IN_APP_UA.test(ua);
}

export function isAndroidUA(ua: string | null | undefined): boolean {
  return !!ua && ANDROID_UA.test(ua);
}

export function isIOSUA(ua: string | null | undefined): boolean {
  return !!ua && IOS_UA.test(ua);
}

/** sessionStorage key guarding the one-shot Android redirect. */
export const REDIRECT_GUARD_KEY = 'nz:inapp-redirect';

/** sessionStorage key remembering that the visitor dismissed the bar. */
export const DISMISS_KEY = 'nz:inapp-dismissed';

/**
 * Blocking, ES5-only script rendered *before* the notice bar markup.
 *
 * Must run before first paint and must not depend on the React bundle,
 * Tailwind, or any npm package — it is the one piece of JS guaranteed to
 * execute inside a hostile WebView.
 *
 * Responsibilities:
 *   1. Detect the in-app WebView from navigator.userAgent.
 *   2. Mark <html data-in-app> so the wire-up script knows to reveal the bar.
 *   3. On Android, attempt a one-shot redirect into Chrome via an intent: URL,
 *      carrying S.browser_fallback_url so devices without Chrome degrade to
 *      simply reloading the same page instead of showing an error.
 *   4. Arm a hydration watchdog that un-hides animation-gated content if the
 *      client bundle never boots (see `[data-js-stalled]` below).
 */
export const IN_APP_BOOTSTRAP_SCRIPT = `
(function(){
  var d=document.documentElement;
  try{
    var ua=navigator.userAgent||'';
    if(/${IN_APP_UA.source}/i.test(ua)){
      d.setAttribute('data-in-app','1');
      if(/Android/i.test(ua)){
        d.setAttribute('data-in-app-os','android');
        var attempted=false;
        try{attempted=!!sessionStorage.getItem('${REDIRECT_GUARD_KEY}');}catch(e){}
        if(!attempted){
          try{sessionStorage.setItem('${REDIRECT_GUARD_KEY}','1');}catch(e){}
          location.replace('intent://'+location.host+location.pathname+location.search+
            '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+
            encodeURIComponent(location.href)+';end');
          return;
        }
      }
    }
  }catch(e){}

  try{
    window.__nzHydrated=false;
    window.setTimeout(function(){
      if(!window.__nzHydrated){d.setAttribute('data-js-stalled','1');}
    },3500);
  }catch(e){}
})();
`.trim();

/**
 * Runs immediately *after* the bar markup, so the elements exist.
 *
 * Reveals the bar only for a genuine in-app WebView, then wires the two
 * controls:
 *
 *   - "Open in Browser": on Android it becomes a real <a href="intent://...">,
 *     so the tap navigates natively and keeps the user-activation that some
 *     WebViews require. Elsewhere (notably iOS, where no API can launch an
 *     external browser) it copies the URL and *always* renders visible
 *     feedback — layered execCommand -> async clipboard -> manual instruction,
 *     so the button can never look dead.
 *   - Dismiss: hides the bar and remembers the choice for the session.
 */
export const IN_APP_WIREUP_SCRIPT = `
(function(){
  var d=document.documentElement;
  var bar=document.getElementById('nz-inapp-bar');
  if(!bar){return;}
  if(d.getAttribute('data-in-app')!=='1'){return;}

  var dismissed=false;
  try{dismissed=!!sessionStorage.getItem('${DISMISS_KEY}');}catch(e){}
  if(dismissed){return;}

  bar.removeAttribute('hidden');

  var open=document.getElementById('nz-inapp-open');
  var toast=document.getElementById('nz-inapp-toast');
  var isAndroid=d.getAttribute('data-in-app-os')==='android';

  function say(msg){
    if(!toast){return;}
    toast.textContent=msg;
    toast.removeAttribute('hidden');
  }

  function selectAndCopy(el){
    try{
      el.focus();
      el.setSelectionRange(0,el.value.length);
      var sel=window.getSelection();
      if(sel){
        var range=document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return document.execCommand('copy');
    }catch(e){return false;}
  }

  function copyUrl(){
    var url=location.href;
    var copied=false;
    try{
      var ta=document.createElement('textarea');
      ta.value=url;
      ta.contentEditable='true';
      ta.style.position='fixed';
      ta.style.top='0';
      ta.style.left='0';
      ta.style.width='1px';
      ta.style.height='1px';
      ta.style.padding='0';
      ta.style.border='0';
      ta.style.opacity='0.01';
      ta.style.fontSize='16px';
      document.body.appendChild(ta);
      copied=selectAndCopy(ta);
      document.body.removeChild(ta);
      var sel=window.getSelection();
      if(sel&&sel.removeAllRanges){sel.removeAllRanges();}
    }catch(e){}

    if(copied){say('Link copied \\u2014 paste it in Chrome or Safari');return;}

    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){
        say('Link copied \\u2014 paste it in Chrome or Safari');
      },function(){
        say('Couldn\\u2019t copy \\u2014 long-press the address bar to copy this link');
      });
      return;
    }
    say('Long-press the address bar to copy this link');
  }

  if(open){
    if(isAndroid){
      // A real link: works on tap without any JS, preserving user activation.
      open.setAttribute('href','intent://'+location.host+location.pathname+location.search+
        '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+
        encodeURIComponent(location.href)+';end');
    }else{
      // Fallback href keeps the control meaningful if the handler ever fails.
      open.setAttribute('href',location.href);
      open.onclick=function(ev){
        if(ev&&ev.preventDefault){ev.preventDefault();}
        copyUrl();
        return false;
      };
    }
  }

  var close=document.getElementById('nz-inapp-dismiss');
  if(close){
    close.onclick=function(ev){
      if(ev&&ev.preventDefault){ev.preventDefault();}
      bar.setAttribute('hidden','');
      try{sessionStorage.setItem('${DISMISS_KEY}','1');}catch(e){}
      return false;
    };
  }
})();
`.trim();

/**
 * Critical CSS inlined into the document.
 *
 * Deliberately NOT in globals.css: if the Tailwind bundle is slow or blocked
 * inside the WebView these rules must still apply. Plain CSS, no @layer, no
 * custom properties that Tailwind has to resolve.
 *
 * Visibility contract: the bar ships with the HTML `hidden` attribute and is
 * revealed only by the wire-up script. Every rule is scoped with
 * `:not([hidden])` so `hidden` always wins — the previous version put
 * `display:flex` in an inline style attribute, which beat the stylesheet's
 * `display:none` on specificity and leaked the bar into every browser.
 *
 * Layout contract: the bar is in normal flow (`position:static`), so it pushes
 * the sticky navbar and page content down instead of floating over them. That
 * makes it structurally impossible for it to cover the navbar's menu button.
 *
 * The `[data-js-stalled]` block is the cure for the "blank page in Instagram"
 * report: framer-motion server-renders `initial={{ opacity: 0 }}` as a literal
 * `style="opacity:0;..."`, so if the client bundle never boots the headline,
 * buttons, cards and every SectionReveal stay invisible forever. Selectors are
 * anchored on `opacity:0;` / end-of-attribute rather than a bare
 * `*="opacity:0"` so genuine partial opacities (e.g. the hero fallback's
 * `opacity:0.22` wireframe) are not blown up to full opacity.
 */
export const IN_APP_CRITICAL_CSS = `
#nz-inapp-bar[hidden],#nz-inapp-toast[hidden]{display:none !important}
#nz-inapp-bar:not([hidden]){
  position:static;
  display:block;
  box-sizing:border-box;
  width:100%;
  padding:8px 12px;
  background:#12081f;
  border-bottom:1px solid rgba(255,255,255,.14);
  font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
}
#nz-inapp-row{display:flex;align-items:center;gap:10px}
#nz-inapp-text{flex:1 1 auto;min-width:0;color:#f1eaff;font-size:12.5px;line-height:1.35}
#nz-inapp-open{
  flex:0 0 auto;display:inline-block;cursor:pointer;border:0;border-radius:999px;
  padding:9px 14px;color:#fff;font-size:12.5px;font-weight:700;white-space:nowrap;
  text-decoration:none;background:linear-gradient(90deg,#4f8ef7,#9b6dff,#e040fb);
}
#nz-inapp-dismiss{
  flex:0 0 auto;cursor:pointer;background:transparent;border:0;color:#b9a8d8;
  font-size:20px;line-height:1;padding:6px 8px;min-width:34px;min-height:34px;
  -webkit-appearance:none;appearance:none;
}
#nz-inapp-toast:not([hidden]){
  display:block;margin-top:6px;color:#c8f7d4;font-size:11.5px;line-height:1.35;
}
html[data-js-stalled] [style*="opacity:0;"],
html[data-js-stalled] [style*="opacity: 0;"],
html[data-js-stalled] [style$="opacity:0"],
html[data-js-stalled] [style$="opacity: 0"]{
  opacity:1 !important;
  transform:none !important;
  filter:none !important;
  visibility:visible !important;
}
`.trim();

/**
 * The notice bar, as raw HTML.
 *
 * Ships `hidden` so it is invisible in every normal browser even before any
 * script runs, and carries no inline `style` attribute at all — that attribute
 * is what previously overrode the stylesheet and leaked the bar into Chrome.
 */
export const IN_APP_NOTICE_HTML = `
<div id="nz-inapp-bar" role="region" aria-label="Open in browser recommendation" hidden>
  <div id="nz-inapp-row">
    <span id="nz-inapp-text">
      For the best experience, tap <strong style="color:#fff">&#8942;</strong> and choose &#39;Open in Browser&#39;
    </span>
    <a id="nz-inapp-open" role="button">Open in Browser</a>
    <button id="nz-inapp-dismiss" type="button" data-nz-dismiss aria-label="Dismiss">&#215;</button>
  </div>
  <p id="nz-inapp-toast" role="status" aria-live="polite" hidden></p>
</div>
`.trim();
