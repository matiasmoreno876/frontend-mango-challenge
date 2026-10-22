import '@testing-library/jest-dom/vitest';

// jsdom implements PointerEvent but not pointer capture.
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
  HTMLElement.prototype.releasePointerCapture = () => {};
}
