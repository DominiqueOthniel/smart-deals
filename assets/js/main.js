const WHATSAPP = "237670000000";

function assetPrefix() {
  return window.SD_ROOT || "";
}

function pageUrl(file) {
  return assetPrefix() + file;
}

function imgUrl(path) {
  if (path.indexOf("assets/") === 0) return assetPrefix() + path;
  return path;
}

function searchIcon() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

function cartIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6h15l-1.4 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.5L5.2 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>';
}

function searchForm(extraClass) {
  return (
    '<form class="search ' + extraClass + '" action="' + pageUrl("shop.html") + '" method="get">' +
    '<input name="q" type="search" placeholder="' + t("search") + '" value="' + escapeHtml(queryParam("q") || "") + '" aria-label="' + t("search") + '">' +
    '<button type="submit" aria-label="Search">' + searchIcon() + "</button>" +
    "</form>"
  );
}

function closeMenu() {
  const nav = document.getElementById("site-nav");
  const btn = document.querySelector(".menu-btn");
  if (nav) nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const nav = document.getElementById("site-nav");
  const btn = document.querySelector(".menu-btn");
  const open = nav && !nav.classList.contains("open");
  if (!nav) return;
  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
}

function renderHeader(active) {
  const header = document.getElementById("site-header");
  if (!header) return;
  const lang = getLang();
  const country = lang === "fr" ? "Cameroun" : "Cameroon";
  header.innerHTML =
    '<header class="header">' +
    '<div class="container header-bar">' +
    '<a class="brand" href="' + pageUrl("index.html") + '">' +
    '<img src="' + imgUrl("assets/images/logo.webp") + '" alt="Smart Deals logo" width="52" height="52">' +
    "<div><strong>Smart Deals</strong><small>" + country + "</small></div>" +
    "</a>" +
    searchForm("search-bar") +
    '<div class="header-actions">' +
    '<div class="lang-switch" role="group" aria-label="Langue">' +
    '<button class="lang-btn' + (lang === "fr" ? " active" : "") + '" data-lang="fr" type="button">FR</button>' +
    '<button class="lang-btn' + (lang === "en" ? " active" : "") + '" data-lang="en" type="button">EN</button>' +
    "</div>" +
    '<a class="cart-link" href="' + pageUrl("cart.html") + '" aria-label="' + t("cart") + '">' +
    cartIcon() + '<span data-cart-count hidden>0</span></a>' +
    '<button class="menu-btn" type="button" aria-label="' + t("menu") + '" aria-controls="site-nav" aria-expanded="false"><span></span></button>' +
    "</div></div>" +
    '<button class="nav-backdrop" type="button" aria-label="Close menu"></button>' +
    '<nav class="nav" id="site-nav">' +
    '<div class="nav-panel">' +
    '<button class="nav-close" type="button">' + t("close") + "</button>" +
    searchForm("search-drawer") +
    navLink("index.html", "navHome", active) +
    navLink("shop.html", "navShop", active) +
    navLink("shop.html?cat=phones", "navPhones", active) +
    navLink("shop.html?cat=laptops", "navLaptops", active) +
    navLink("about.html", "navAbout", active) +
    navLink("contact.html", "navContact", active) +
    "</div></nav></header>";

  header.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
      location.reload();
    });
  });

  header.querySelector(".menu-btn").addEventListener("click", toggleMenu);
  header.querySelector(".nav-backdrop").addEventListener("click", closeMenu);
  header.querySelector(".nav-close").addEventListener("click", closeMenu);
  header.querySelectorAll(".nav a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
}

function navLink(file, key, active) {
  const href = pageUrl(file);
  const cat = queryParam("cat");
  let on = false;
  if (file === "index.html" && active === "index.html") on = true;
  else if (file === "about.html" && active === "about.html") on = true;
  else if (file === "contact.html" && active === "contact.html") on = true;
  else if (file === "shop.html" && active === "shop.html" && !cat) on = true;
  else if (file.indexOf("cat=phones") !== -1 && cat === "phones") on = true;
  else if (file.indexOf("cat=laptops") !== -1 && cat === "laptops") on = true;
  return '<a class="' + (on ? "active" : "") + '" href="' + href + '">' + t(key) + "</a>";
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  const cityNames = CITIES.filter(function (city) {
    return city.id !== "other";
  })
    .map(function (city) {
      return city.name;
    })
    .join(" · ");

  footer.innerHTML =
    '<footer class="footer">' +
    '<div class="container footer-grid">' +
    '<div><a class="brand brand-foot" href="' + pageUrl("index.html") + '">' +
    '<img src="' + imgUrl("assets/images/logo.webp") + '" alt="Smart Deals" width="44" height="44">' +
    "<div><strong>Smart Deals</strong><small>Cameroon</small></div></a>" +
    "<p>" + t("footerTag") + "</p></div>" +
    "<div><h4>" + t("navShop") + "</h4>" +
    '<a href="' + pageUrl("shop.html?cat=phones") + '">' + t("phones") + "</a>" +
    '<a href="' + pageUrl("shop.html?cat=laptops") + '">' + t("laptops") + "</a>" +
    '<a href="' + pageUrl("about.html") + '">' + t("navAbout") + "</a>" +
    '<a href="' + pageUrl("contact.html") + '">' + t("navContact") + "</a></div>" +
    "<div><h4>" + t("cities") + "</h4><p class='city-list'>" + cityNames + "</p></div>" +
    "<div><h4>" + t("navContact") + "</h4>" +
    "<p>+237 670 000 000</p><p>hello@smartdeals.cm</p><p>" + t("address") + "</p>" +
    '<a class="btn btn-gold" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP + '">' + t("whatsapp") + "</a>" +
    "</div></div>" +
    '<div class="legal"><p>© 2026 ' + t("rights") + "</p></div>" +
    "</footer>" +
    '<a class="wa-float" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP + '" aria-label="WhatsApp">WhatsApp</a>';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function queryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function productCard(product) {
  const off = discountPercent(product);
  const badge = product.badge
    ? '<span class="badge badge-' + product.badge + '">' + product.badge + "</span>"
    : "";
  return (
    '<article class="card">' +
    '<a class="card-media" href="' + pageUrl("product.html?id=" + product.id) + '">' +
    badge +
    (off ? '<span class="off">-' + off + "%</span>" : "") +
    '<img src="' + imgUrl(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy" decoding="async" width="400" height="400">' +
    "</a>" +
    '<div class="card-body">' +
    '<p class="muted">' + escapeHtml(product.brand) + "</p>" +
    '<h3><a href="' + pageUrl("product.html?id=" + product.id) + '">' + escapeHtml(product.name) + "</a></h3>" +
    '<p class="stars">' + stars(product.rating) + " " + product.rating + "</p>" +
    '<div class="price-row"><strong>' + formatFcfa(product.price) + "</strong>" +
    (product.oldPrice ? "<s>" + formatFcfa(product.oldPrice) + "</s>" : "") +
    "</div>" +
    '<button class="btn btn-navy" type="button" data-add="' + product.id + '">' + t("addCart") + "</button>" +
    "</div></article>"
  );
}

function stars(rating) {
  const full = Math.round(rating);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}

function bindAddButtons(root) {
  (root || document).querySelectorAll("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(btn.getAttribute("data-add"), 1);
    });
  });
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(function (node) {
    node.textContent = t(node.getAttribute("data-i18n"));
  });
}

function initPage(active) {
  document.documentElement.lang = getLang();
  renderHeader(active);
  renderFooter();
  applyI18n();
  updateCartCount();
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1100) closeMenu();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.SD_PAGE !== "undefined") {
    initPage(window.SD_PAGE);
  }
});
