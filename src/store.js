import { proxy } from "valtio";

const MOBILE_BREAKPOINT = 768;

const state = proxy({
  isMobile: window.innerWidth < MOBILE_BREAKPOINT,
  loaded: false,
  hovered: false,
  showSettings: false,
  background: "video2",
  reflectivity: 0.45,
  isDragging: false,
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    state.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  }, 150);
});

export { state };
