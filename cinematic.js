(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    if (!nav) return;
    nav.classList.toggle("solid", window.scrollY > 40);
  }, { passive: true });
  var notifs = document.querySelectorAll("[data-notif]");
  var deskBg = document.querySelector("[data-desk-bg]");
  var hero = document.getElementById("hero-copy");
  function playOpening() {
    if (reduce) {
      notifs.forEach(function (n) { n.classList.add("in"); });
      if (deskBg) deskBg.classList.add("show");
      if (hero) hero.classList.add("rise");
      return;
    }
    notifs.forEach(function (n, i) {
      setTimeout(function () { n.classList.add("in"); }, 350 + i * 700);
    });
    setTimeout(function () { if (deskBg) deskBg.classList.add("show"); }, 1400);
    setTimeout(function () { if (hero) hero.classList.add("rise"); }, 2800);
    setTimeout(function () {
      notifs.forEach(function (n, i) { if (i < 3) n.style.opacity = "0.35"; });
    }, 4200);
  }
  playOpening();
})();
