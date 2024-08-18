runOnDomLoaded(() => {
  initNav();
  initImages();
  initNoTransitionElements();
});

function initNav() {
  const navElement = document.querySelector("nav.nav");

  if (navElement != null) {
    // Nav isn't used on this page
    const updateScroll = () => {
      console.log(scrollY);
      if (scrollY <= 50) {
        navElement.setAttribute("data-expanded", "");
      } else {
        navElement.removeAttribute("data-expanded");
      }
    };

    window.addEventListener("scroll", updateScroll);
    updateScroll();
  }
}

function initImages() {
  const elements = document.querySelectorAll("div[data-img-faded]");

  for (const element of elements) {
    const img = element.querySelector("img");

    if (img.complete) {
      element.setAttribute("data-img-faded", "already-loaded");
    } else {
      img.addEventListener("load", () => {
        element.setAttribute("data-img-faded", "loaded");
      });
    }
  }
}

function initNoTransitionElements() {
  const noTransitionElements = document.querySelectorAll(
    "[data-no-initial-transition]",
  );
  for (const element of noTransitionElements) {
    element.removeAttribute("data-no-initial-transition");
  }
}
