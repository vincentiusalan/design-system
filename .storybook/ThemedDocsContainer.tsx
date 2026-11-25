import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { docsDark, docsLight } from './themes';

type Theme = 'light' | 'dark';
type GlobalsEvent = { globals?: { theme?: Theme } };

type PreviewWindow = Window & {
  __STORYBOOK_PREVIEW__?: { storyStoreValue?: { userGlobals?: { get?: () => { theme?: Theme } } } };
};

/**
 * The theme currently selected in the toolbar. Storybook remounts this container
 * when globals change, so this must read the live value, not the iframe URL
 * (which keeps whatever `globals=` the page was first opened with).
 */
function currentTheme(): Theme {
  const live = (window as PreviewWindow).__STORYBOOK_PREVIEW__?.storyStoreValue?.userGlobals?.get?.();
  if (live?.theme) return live.theme;
  // Fallback if that internal API ever changes: the URL the page was opened with.
  const params = new URLSearchParams(window.location.search).get('globals') ?? '';
  return /(?:^|;)theme:dark(?:;|$)/.test(params) ? 'dark' : 'light';
}

/**
 * Docs pages normally ignore the toolbar theme. This container listens for
 * globals changes and swaps the docs theme, so Light / Dark covers docs too.
 */
export function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    const onGlobals = ({ globals }: GlobalsEvent) => {
      if (globals?.theme) setTheme(globals.theme);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobals);
    context.channel.on(SET_GLOBALS, onGlobals);
    context.channel.on(UPDATE_GLOBALS, onGlobals); // toolbar change, sent by the manager
    return () => {
      context.channel.off(GLOBALS_UPDATED, onGlobals);
      context.channel.off(SET_GLOBALS, onGlobals);
      context.channel.off(UPDATE_GLOBALS, onGlobals);
    };
  }, [context.channel]);

  return (
    <div data-theme={theme}>
      <DocsContainer context={context} theme={theme === 'dark' ? docsDark : docsLight}>
        {children}
      </DocsContainer>
    </div>
  );
}
