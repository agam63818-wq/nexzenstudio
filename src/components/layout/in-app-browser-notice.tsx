import {
  IN_APP_BOOTSTRAP_SCRIPT,
  IN_APP_CRITICAL_CSS,
  IN_APP_NOTICE_HTML,
  IN_APP_WIREUP_SCRIPT,
} from '@/lib/in-app-browser';

/**
 * In-app WebView escape hatch (Instagram / Facebook / TikTok bio links).
 *
 * Rendered as the first children of <body> so the bootstrap script executes
 * before the rest of the document parses and before first paint.
 *
 * Intentionally a server component with zero client imports: the whole point
 * is that this keeps working when the React/framer-motion bundle does not.
 * The bar's markup, styling and button handler are all plain HTML, inline CSS
 * and ES5 — nothing here waits on hydration.
 *
 * Because detection happens in the browser (not from a server-side User-Agent
 * read) every page stays statically renderable and there is no UA-varying HTML
 * for a CDN to cache against the wrong audience.
 */
export function InAppBrowserNotice() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: IN_APP_CRITICAL_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: IN_APP_BOOTSTRAP_SCRIPT }} />
      <div dangerouslySetInnerHTML={{ __html: IN_APP_NOTICE_HTML }} />
      {/* Must come after the markup above: it wires the elements it reveals. */}
      <script dangerouslySetInnerHTML={{ __html: IN_APP_WIREUP_SCRIPT }} />
    </>
  );
}

/**
 * Disarms the hydration watchdog once React is actually running.
 *
 * Deliberately tiny and dependency-free so that it lives in the main client
 * chunk: if that chunk fails to execute, the watchdog is never disarmed and
 * `[data-js-stalled]` reveals the animation-gated content instead of leaving
 * the visitor staring at an empty page.
 */
export { HydrationBeacon } from './hydration-beacon';
