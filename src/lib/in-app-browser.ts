/**
 * In-app browser (WebView) detection + escape hatches.
 *
 * Instagram / Facebook / TikTok open bio links inside an embedded WebView
 * rather than the system browser. Those WebViews:
 *   - run older Chromium (Android) or WKWebView (iOS) engines,
 *   - frequently block or throttle WebGL,
 *   - cache aggressively and ignore normal revalidation,
 *   - and sometimes fail to execute the modern client bundle at all.
 *
 * Everything in this module is dependency-free so it can be used from server
 * components, client components, or serialised into a blocking inline script.
 */

/** Matches Instagram's WebView UA, e.g. "... Instagram 123.0.0.0.0 Android ...". */
export const INSTAGRAM_UA = /Instagram/i;

/** Broader in-app WebView match (Instagram, Facebook, TikTok, Snapchat, LinkedIn). */
export const IN_APP_UA = /Instagram|FBAN|FBAV|FB_IAB|Messenger|TikTok|musical_ly|Snapchat|LinkedInApp/i;

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

/** Height reserved for the notice bar, in px. Shared by CSS + script. */
export const NOTICE_HEIGHT = 52;

/** sessionStorage key guarding the one-shot Android redirect. */
export const REDIRECT_GUARD_KEY = 'nz:inapp-redirect';

/**
 * Blocking, ES5-only script injected into <head>.
 *
 * It must run before first paint and must not depend on the React bundle,
 * Tailwind, or any npm package — that is the whole point: it is the one piece
 * of JS guaranteed to execute inside a hostile WebView.
 *
 * Responsibilities:
 *   1. Detect the in-app WebView from navigator.userAgent.
 *   2. Reveal the pre-rendered notice bar and reserve layout space for it.
 *   3. On Android, attempt a one-shot redirect into Chrome via an intent: URL,
 *      carrying S.browser_fallback_url so devices without Chrome degrade to
 *      simply reloading the same page instead of showing an error.
 *   4. Arm a hydration watchdog that un-hides animation-gated content if the
 *      client bundle never boots (see `[data-js-stalled]` in globals.css).
 */
export const IN_APP_BOOTSTRAP_SCRIPT = `
(function(){
  var d=document.documentElement;

  function chromeIntent(){
    return 'intent://'+location.host+location.pathname+location.search+
      '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+
      encodeURIComponent(location.href)+';end';
  }

  window.__nzOpenBrowser=function(btn){
    try{
      if(/Android/i.test(navigator.userAgent||'')){
        location.replace(chromeIntent());
        return;
      }
      var url=location.href;
      var done=function(){ if(btn){btn.textContent='Link copied \\u2014 paste in Safari';} };
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(done,function(){});
      }else{
        var t=document.createElement('textarea');
        t.value=url;t.setAttribute('readonly','');
        t.style.position='fixed';t.style.opacity='0';
        document.body.appendChild(t);t.select();
        try{document.execCommand('copy');done();}catch(e){}
        document.body.removeChild(t);
      }
    }catch(e){}
  };

  try{
    var ua=navigator.userAgent||'';
    var inApp=/${IN_APP_UA.source}/i.test(ua);

    if(inApp){
      d.setAttribute('data-in-app','1');
      d.style.setProperty('--nz-inapp-offset','${NOTICE_HEIGHT}px');

      if(/Android/i.test(ua)){
        var attempted=false;
        try{attempted=!!sessionStorage.getItem('${REDIRECT_GUARD_KEY}');}catch(e){}
        if(!attempted){
          try{sessionStorage.setItem('${REDIRECT_GUARD_KEY}','1');}catch(e){}
          location.replace(chromeIntent());
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
 * Critical CSS inlined into <head>.
 *
 * Deliberately NOT in globals.css: if the Tailwind bundle is slow or blocked
 * inside the WebView these rules must still apply. Plain CSS, no @layer, no
 * custom properties that Tailwind has to resolve.
 *
 * The `[data-js-stalled]` block is the actual cure for the "blank page in
 * Instagram" report: framer-motion server-renders `initial={{ opacity: 0 }}`
 * as a literal `style="opacity:0;..."`, so if the client bundle never boots,
 * the headline, buttons, cards and every SectionReveal stay invisible forever.
 *
 * Selectors are anchored on `opacity:0;` / end-of-attribute rather than a bare
 * `*="opacity:0"` so that genuine partial opacities (e.g. the hero fallback's
 * `opacity:0.22` wireframe) are not blown up to full opacity.
 */
export const IN_APP_CRITICAL_CSS = `
#nz-inapp-bar{display:none}
html[data-in-app] #nz-inapp-bar{display:flex}
html[data-in-app] body{padding-top:${NOTICE_HEIGHT}px}
html[data-in-app] [data-nz-sticky]{top:${NOTICE_HEIGHT}px}
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
 * The notice bar, as a raw HTML string with fully inline styles and an inline
 * onclick handler.
 *
 * Rendered via dangerouslySetInnerHTML so it is real DOM the instant the body
 * parses — it does not wait for React to hydrate, does not import
 * framer-motion or lucide, and does not need a single Tailwind class.
 */
export const IN_APP_NOTICE_HTML = `
<div id="nz-inapp-bar" role="region" aria-label="Open in browser recommendation"
  style="position:fixed;top:0;left:0;right:0;z-index:2147483000;box-sizing:border-box;
         min-height:${NOTICE_HEIGHT}px;display:flex;align-items:center;gap:10px;
         padding:8px 12px;background:#12081f;border-bottom:1px solid rgba(255,255,255,.14);
         box-shadow:0 2px 14px rgba(0,0,0,.5);
         font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
  <span style="flex:1 1 auto;min-width:0;color:#f1eaff;font-size:12.5px;line-height:1.35;">
    For the best experience, tap <strong style="color:#fff;">&#8942;</strong> and choose &#39;Open in Browser&#39;
  </span>
  <button type="button" onclick="window.__nzOpenBrowser&amp;&amp;window.__nzOpenBrowser(this)"
    style="flex:0 0 auto;cursor:pointer;border:0;border-radius:999px;padding:9px 14px;
           min-height:38px;color:#fff;font-size:12.5px;font-weight:700;white-space:nowrap;
           background:linear-gradient(90deg,#4f8ef7,#9b6dff,#e040fb);
           -webkit-appearance:none;appearance:none;">
    Open in Browser
  </button>
</div>
`.trim();
