import { SOURCE_LANGUAGE, widgetLanguageList } from './languages';

/**
 * Optional, user-triggered machine translation using Google's website translator.
 *
 * Design rules (kept on purpose):
 *  - Nothing from Google loads until a visitor picks a language, so normal visits, crawlers and the
 *    AdSense review always see the original English page and make no third-party translation request.
 *  - No new URLs are created, so there are no machine-translated pages for search engines to index.
 *  - The choice is stored in Google's own `googtrans` cookie, which the widget reads on load.
 */

export const TRANSLATE_COOKIE = 'googtrans';
const SCRIPT_ID = 'gmc-google-translate';
const ELEMENT_ID = 'google_translate_element';

/** Extract the target language from a cookie string such as "a=1; googtrans=/en/hi". */
export function parseSelectedLanguage(cookieString: string): string | null {
  const match = cookieString.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${TRANSLATE_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(TRANSLATE_COOKIE.length + 1));
  const parts = value.split('/').filter(Boolean); // ["en", "hi"]
  const target = parts[1];
  if (!target || target === SOURCE_LANGUAGE || !/^[A-Za-z]{2,3}(-[A-Za-z]{2,4})?$/.test(target)) return null;
  return target;
}

export function getSelectedLanguage(): string | null {
  if (typeof document === 'undefined') return null;
  return parseSelectedLanguage(document.cookie);
}

/** Cookie attribute variants that cover the host, and the parent domain Google also writes to. */
export function cookieDomains(hostname: string): (string | null)[] {
  const domains: (string | null)[] = [null, hostname];
  const parts = hostname.split('.');
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join('.')}`);
  if (parts.length > 1) domains.push(`.${hostname}`);
  return domains;
}

export function setSelectedLanguage(code: string | null): void {
  if (typeof document === 'undefined') return;
  const host = window.location.hostname;
  for (const domain of cookieDomains(host)) {
    const domainPart = domain ? `; domain=${domain}` : '';
    if (code && code !== SOURCE_LANGUAGE) {
      document.cookie = `${TRANSLATE_COOKIE}=/${SOURCE_LANGUAGE}/${code}; path=/${domainPart}; max-age=31536000; SameSite=Lax`;
    } else {
      document.cookie = `${TRANSLATE_COOKIE}=; path=/${domainPart}; max-age=0; SameSite=Lax`;
    }
  }
}

/**
 * Google's translator rewrites text nodes; React can then throw when it removes or re-orders nodes that
 * Google has replaced. These guards make those two DOM calls tolerant. Installed only after a language is chosen.
 */
export function installDomGuards(): void {
  if (typeof Node === 'undefined' || (Node.prototype as unknown as { __gmcGuard?: boolean }).__gmcGuard) return;
  const originalRemove = Node.prototype.removeChild;
  const originalInsert = Node.prototype.insertBefore;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemove.call(this, child) as T;
  };
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return newNode;
    return originalInsert.call(this, newNode, ref) as T;
  };
  (Node.prototype as unknown as { __gmcGuard?: boolean }).__gmcGuard = true;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (opts: Record<string, unknown>, id: string) => unknown } };
  }
}

/** Loads Google's translator once. Safe to call repeatedly. */
export function loadTranslator(): void {
  if (typeof document === 'undefined' || document.getElementById(SCRIPT_ID)) return;
  installDomGuards();
  window.googleTranslateElementInit = () => {
    const Ctor = window.google?.translate?.TranslateElement;
    if (!Ctor) return;
    new Ctor(
      { pageLanguage: SOURCE_LANGUAGE, includedLanguages: widgetLanguageList(), autoDisplay: false },
      ELEMENT_ID
    );
  };
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);
}
