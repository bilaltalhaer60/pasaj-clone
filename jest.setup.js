import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";

Object.defineProperty(globalThis, "TextEncoder", {
  writable: true,
  value: TextEncoder
});

Object.defineProperty(globalThis, "TextDecoder", {
  writable: true,
  value: TextDecoder
});

Object.defineProperty(globalThis, "fetch", {
  writable: true,
  value: () => Promise.reject(new Error("Network requests are disabled in tests."))
});

Object.defineProperty(globalThis, "Headers", {
  writable: true,
  value: class Headers {}
});

Object.defineProperty(globalThis, "Request", {
  writable: true,
  value: class Request {}
});

Object.defineProperty(globalThis, "Response", {
  writable: true,
  value: class Response {}
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  })
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => undefined
});
