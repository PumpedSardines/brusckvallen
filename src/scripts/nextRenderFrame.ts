export function nextRenderFrame(cb: () => void) {
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        cb();
      }, 0);
    });
  }, 0);
}
