runOnDomLoaded(() => {
  initNav();
  initNoTransitionElements();
})

function initNav() {
  const navElement = document.querySelector("nav.nav");

  if (navElement != null) {
    // Nav isn't used on this page
    const updateScroll = () => {
      console.log(scrollY)
      if (scrollY <= 50) {
        navElement.setAttribute("data-expanded", "")
      } else {
        navElement.removeAttribute("data-expanded")
      }
    }

    window.addEventListener("scroll", updateScroll);
    updateScroll()
  }
}

function initNoTransitionElements() {
  const noTransitionElements = document.querySelectorAll("[data-no-initial-transition]");
  for (const element of noTransitionElements) {
    element.removeAttribute("data-no-initial-transition");
  }
}
