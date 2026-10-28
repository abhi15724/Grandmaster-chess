'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Globe, X, Search } from 'lucide-react';
import {
  GROUP_LABELS,
  SOURCE_LANGUAGE,
  UNAVAILABLE_LANGUAGES,
  findLanguage,
  searchLanguages,
  type LanguageGroup,
} from '@/lib/languages';
import { getSelectedLanguage, loadTranslator, reloadPage, setSelectedLanguage } from '@/lib/translate';

const subscribeNever = () => () => {};
const getServerLanguage = (): string | null => null;

const GROUP_ORDER: LanguageGroup[] = ['india-scheduled', 'india-other', 'world'];

export const LanguageSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // Cookie is read on the client only; the server render always shows the English state.
  const current = useSyncExternalStore(subscribeNever, getSelectedLanguage, getServerLanguage);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Google's script is loaded only if a language was chosen.
  useEffect(() => {
    if (current) loadTranslator();
  }, [current]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const results = useMemo(() => searchLanguages(query), [query]);
  const currentLang = findLanguage(current);

  const choose = (code: string) => {
    setSelectedLanguage(code === SOURCE_LANGUAGE ? null : code);
    reloadPage();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id="nav-language-btn"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={currentLang ? `Language: ${currentLang.name}. Change language` : 'Choose language'}
        title="Translate this website"
        className="notranslate flex h-8 items-center gap-1 rounded-md border border-[#3c3934] bg-[#211f1c] px-2 text-xs font-semibold text-zinc-300 hover:border-[#81b64c]/60 hover:text-zinc-100 transition-colors"
        translate="no"
      >
        <Globe className="h-3.5 w-3.5 text-[#81b64c]" />
        <span className="hidden sm:inline">{currentLang ? currentLang.native : 'EN'}</span>
      </button>

      {/* Target element Google's translator attaches to. Hidden; our own picker is the visible UI. */}
      <div id="google_translate_element" className="notranslate hidden" aria-hidden="true" translate="no" />

      {/* Rendered in document.body: the navbar's backdrop-blur would otherwise become the containing block for
          this fixed overlay and clip it to the header bar. */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lang-dialog-title"
            className="w-full max-w-lg rounded-xl border border-[#3c3934] bg-[#1e1c19] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#3c3934] px-4 py-3">
              <h2 id="lang-dialog-title" className="text-sm font-bold text-zinc-100">
                Translate this website
              </h2>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close language picker"
                className="rounded p-1 text-zinc-400 hover:bg-[#3c3934]/60 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 pt-3">
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Machine translation by Google, added on request. English is the original, and chess terms or
                numbers may be translated imperfectly. The board, clocks and move list stay as they are.
              </p>
              <label className="relative mt-3 block">
                <span className="sr-only">Search languages</span>
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a language, e.g. Hindi or हिन्दी"
                  className="w-full rounded-lg border border-[#3c3934] bg-[#262421] py-2 pl-8 pr-3 text-sm text-zinc-100 focus:border-[#81b64c] focus:outline-none"
                />
              </label>
            </div>

            <div className="notranslate max-h-[55vh] overflow-y-auto px-4 py-3" translate="no">
              <button
                type="button"
                onClick={() => choose(SOURCE_LANGUAGE)}
                className={`mb-3 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                  !current ? 'border-[#81b64c] bg-[#81b64c]/10 text-zinc-100' : 'border-[#3c3934] text-zinc-300 hover:border-[#81b64c]/50'
                }`}
              >
                <span>English (original)</span>
                {!current && <span className="text-[11px] font-bold text-[#81b64c]">Current</span>}
              </button>

              {results.length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-500">
                  No match. See the list of languages that are not available below.
                </p>
              )}

              {GROUP_ORDER.map((group) => {
                const items = results.filter((l) => l.group === group);
                if (items.length === 0) return null;
                return (
                  <section key={group} className="mb-3">
                    <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      {GROUP_LABELS[group]}
                    </h3>
                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {items.map((l) => (
                        <li key={l.code}>
                          <button
                            type="button"
                            lang={l.code}
                            onClick={() => choose(l.code)}
                            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                              current === l.code
                                ? 'border-[#81b64c] bg-[#81b64c]/10 text-zinc-100'
                                : 'border-[#3c3934] text-zinc-300 hover:border-[#81b64c]/50'
                            }`}
                          >
                            <span className="font-semibold">{l.native}</span>
                            <span className="ml-2 truncate text-[11px] text-zinc-500">{l.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>

            <details className="border-t border-[#3c3934] px-4 py-3 text-xs text-zinc-400">
              <summary className="cursor-pointer font-semibold text-zinc-300">
                Languages with no machine translation yet
              </summary>
              <p className="mt-2 leading-relaxed">
                Google does not currently translate these, so the site stays in English for them. A related language
                above, such as Hindi, Marathi, Bengali or Nepali, is often the closest option.
              </p>
              <ul className="mt-2 space-y-1.5">
                {UNAVAILABLE_LANGUAGES.map((u) => (
                  <li key={u.group}>
                    <span className="font-semibold text-zinc-300">{u.group}:</span> {u.names}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
