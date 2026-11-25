import { setProjectAnnotations } from '@storybook/react-vite';
import * as preview from '../../.storybook/preview';

// Apply the same decorators and globals as Storybook (theme wrapper, tokens CSS).
setProjectAnnotations([preview]);

// Let React's act() flush renders in this test environment.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Screenshots must be deterministic: stop looping animations (Badge pulse) and transitions.
const freeze = document.createElement('style');
freeze.textContent = `*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}`;
document.head.append(freeze);
