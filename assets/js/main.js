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

function renderHeader(active) {
  const header = document.getElementById("site-header");
  if (!header) return;
  const lang = getLang();
  header.innerHTML =
    '<div class="topbar">' +
    '<span>' + t("tagline") + "</span>" +
    '<div class="topbar-actions">' +
    '<button class="lang-btn' + (lang === "en" ? " active" : "") + '" data-lang="en" type="button">EN</button>' +
    '<button class="lang-btn' + (lang === "fr" ? " active" : "") + '" data-lang="fr" type="button">FR</button>' +
    "</div></div>" +
    '<header class="header">' +
    '<div class="container nav-wrap">' +
    '<a class="brand" href="' + pageUrl("index.html") + '">' +
    '<img src="' + imgUrl("assets/images/logo.png") + '" alt="Smart Deals logo">' +
    "<div><strong>Smart Deals</strong><small>Cameroon</small></div>" +
    "</a>" +
    '<form class="search" action="' + pageUrl("shop.html") + '" method="get">' +
    '<input name="q" type="search" placeholder="' + t("search") + '" value="' + escapeHtml(queryParam("q") || "") + '">' +
    '<button type="submit" aria-label="Search">⌕</button>' +
    "</form>" +
    '<nav class="nav">' +
    navLink("index.html", "navHome", active) +
    navLink("shop.html", "navShop", active) +
    navLink("shop.html?cat=phones", "navPhones", active) +
    navLink("shop.html?cat=laptops", "navLaptops", active) +
    navLink("about.html", "navAbout", active) +
    navLink("contact.html", "navContact", active) +
    "</nav>" +
    '<a class="cart-link" href="' + pageUrl("cart.html") + '" aria-label="' + t("cart") + '">' +
    '<span class="cart-icon">🛍️</span><span data-cart-count hidden>0</span>' +
    "</a>" +
    '<button class="menu-btn" type="button" aria-label="Menu">☰</button>' +
    "</div></header>";

  header.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
      location.reload();
    });
  });

  const menuBtn = header.querySelector(".menu-btn");
  const nav = header.querySelector(".nav");
  menuBtn.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}

function navLink(file, key, active) {
  const href = pageUrl(file);
  const isActive = active && file.indexOf(active) === 0 ? " active" : "";
  return '<a class="' + isActive + '" href="' + href + '">' + t(key) + "</a>";
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
    '<img src="' + imgUrl("assets/images/logo.png") + '" alt="Smart Deals">' +
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
    '<img src="' + imgUrl(product.image) + '" alt="' + escapeHtml(product.name) + '">' +
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
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.SD_PAGE !== "undefined") {
    initPage(window.SD_PAGE);
  }
});
