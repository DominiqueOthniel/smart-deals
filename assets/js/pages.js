function featuredProducts() {
  return PRODUCTS.filter(function (item) {
    return item.badge === "hot" || item.badge === "sale";
  }).slice(0, 8);
}

function renderHome() {
  const featured = document.getElementById("featured-grid");
  if (featured) {
    featured.innerHTML = featuredProducts()
      .map(productCard)
      .join("");
    bindAddButtons(featured);
  }
}

function uniqueBrands(list) {
  return list
    .map(function (item) {
      return item.brand;
    })
    .filter(function (brand, index, arr) {
      return arr.indexOf(brand) === index;
    })
    .sort();
}

function renderShop() {
  const grid = document.getElementById("shop-grid");
  const brandSelect = document.getElementById("brand-filter");
  const catSelect = document.getElementById("cat-filter");
  const sortSelect = document.getElementById("sort-filter");
  const countNode = document.getElementById("result-count");
  if (!grid) return;

  const initialCat = queryParam("cat") || "all";
  const initialQ = (queryParam("q") || "").toLowerCase();
  catSelect.options[0].textContent = getLang() === "fr" ? "Tout" : "All";
  catSelect.options[1].textContent = t("phones");
  catSelect.options[2].textContent = t("laptops");

  uniqueBrands(PRODUCTS).forEach(function (brand) {
    const opt = document.createElement("option");
    opt.value = brand;
    opt.textContent = brand;
    brandSelect.appendChild(opt);
  });

  if (initialCat !== "all") catSelect.value = initialCat;

  function apply() {
    let list = PRODUCTS.slice();
    const cat = catSelect.value;
    const brand = brandSelect.value;
    const sort = sortSelect.value;
    const q = initialQ;

    if (cat !== "all") {
      list = list.filter(function (item) {
        return item.category === cat;
      });
    }
    if (brand !== "all") {
      list = list.filter(function (item) {
        return item.brand === brand;
      });
    }
    if (q) {
      list = list.filter(function (item) {
        return (item.name + " " + item.brand).toLowerCase().indexOf(q) !== -1;
      });
    }
    if (sort === "low") {
      list.sort(function (a, b) {
        return a.price - b.price;
      });
    }
    if (sort === "high") {
      list.sort(function (a, b) {
        return b.price - a.price;
      });
    }

    countNode.textContent = list.length + " " + t("items");
    if (!list.length) {
      grid.innerHTML = '<p class="empty">' + t("noResults") + "</p>";
      return;
    }
    grid.innerHTML = list.map(productCard).join("");
    bindAddButtons(grid);
  }

  catSelect.addEventListener("change", apply);
  brandSelect.addEventListener("change", apply);
  sortSelect.addEventListener("change", apply);
  apply();
}

function renderProduct() {
  const root = document.getElementById("product-root");
  if (!root) return;
  const product = getProduct(queryParam("id"));
  if (!product) {
    root.innerHTML = '<div class="empty"><h2>' + t("noResults") + "</h2></div>";
    return;
  }
  const off = discountPercent(product);
  root.innerHTML =
    '<div class="product-layout">' +
    '<div class="product-media"><img src="' + imgUrl(product.image) + '" alt="' + escapeHtml(product.name) + '"></div>' +
    '<div class="product-info">' +
    '<p class="brand-name">' + escapeHtml(product.brand) + "</p>" +
    "<h1>" + escapeHtml(product.name) + "</h1>" +
    '<p class="stars">' + stars(product.rating) + " " + product.rating + "</p>" +
    '<div class="price-row"><strong>' + formatFcfa(product.price) + "</strong>" +
    (product.oldPrice ? "<s>" + formatFcfa(product.oldPrice) + "</s>" : "") +
    (off ? '<span class="off" style="position:static">-' + off + "%</span>" : "") +
    "</div>" +
    "<p>" + escapeHtml(productDesc(product)) + "</p>" +
    '<div class="specs"><span>' + t("storage") + ": " + product.storage + "</span>" +
    "<span>" + t("color") + ": " + product.color + "</span>" +
    "<span>" + t("inStock") + ": " + product.stock + "</span></div>" +
    "<p class='muted'>" + t("warranty") + "</p>" +
    '<div class="qty-row"><label>' + t("qty") + '</label><input id="qty" type="number" min="1" max="' + product.stock + '" value="1"></div>' +
    '<div class="actions">' +
    '<button class="btn btn-gold" id="add-btn" type="button">' + t("addCart") + "</button>" +
    '<button class="btn btn-navy" id="buy-btn" type="button">' + t("buyNow") + "</button>" +
    "</div></div></div>";

  document.getElementById("add-btn").addEventListener("click", function () {
    addToCart(product.id, Number(document.getElementById("qty").value) || 1);
  });
  document.getElementById("buy-btn").addEventListener("click", function () {
    addToCart(product.id, Number(document.getElementById("qty").value) || 1);
    location.href = pageUrl("checkout.html");
  });

  const related = PRODUCTS.filter(function (item) {
    return item.category === product.category && item.id !== product.id;
  }).slice(0, 4);
  const relatedGrid = document.getElementById("related-grid");
  if (relatedGrid) {
    relatedGrid.innerHTML = related.map(productCard).join("");
    bindAddButtons(relatedGrid);
  }
}

function renderCartPage() {
  const root = document.getElementById("cart-root");
  if (!root) return;
  const lines = cartLines();
  if (!lines.length) {
    root.innerHTML =
      '<div class="empty"><h2>' + t("emptyCart") + "</h2><p>" + t("emptyCartT") + "</p>" +
      '<a class="btn btn-gold" href="' + pageUrl("shop.html") + '">' + t("continueShop") + "</a></div>";
    return;
  }

  root.innerHTML =
    '<div class="checkout-grid">' +
    '<div class="cart-table" id="cart-lines"></div>' +
    '<aside class="summary"><h3>' + t("cart") + "</h3>" +
    "<p><span>" + t("subtotal") + "</span><strong>" + formatFcfa(cartSubtotal()) + "</strong></p>" +
    "<p><span>" + t("delivery") + "</span><span>" + t("free") + " Douala / Yaounde</span></p>" +
    '<a class="btn btn-gold" href="' + pageUrl("checkout.html") + '">' + t("checkout") + "</a>" +
    "</aside></div>";

  const box = document.getElementById("cart-lines");
  box.innerHTML = lines
    .map(function (line) {
      return (
        '<div class="cart-line" data-id="' + line.product.id + '">' +
        '<img src="' + imgUrl(line.product.image) + '" alt="">' +
        "<div><strong>" + escapeHtml(line.product.name) + "</strong><p class='muted'>" + line.product.brand + "</p></div>" +
        '<input type="number" min="1" value="' + line.qty + '">' +
        "<div>" + formatFcfa(line.lineTotal) + "</div>" +
        '<button class="btn btn-outline" type="button" data-remove="' + line.product.id + '">' + t("remove") + "</button>" +
        "</div>"
      );
    })
    .join("");

  box.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("change", function () {
      const id = input.closest(".cart-line").getAttribute("data-id");
      setQty(id, Number(input.value) || 1);
      renderCartPage();
    });
  });
  box.querySelectorAll("[data-remove]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      removeFromCart(btn.getAttribute("data-remove"));
      renderCartPage();
    });
  });
}

function renderCheckout() {
  const form = document.getElementById("checkout-form");
  const citySelect = document.getElementById("city");
  const subNode = document.getElementById("co-sub");
  const feeNode = document.getElementById("co-fee");
  const totalNode = document.getElementById("co-total");
  const success = document.getElementById("order-success");
  if (!form) return;

  if (!cartLines().length) {
    location.href = pageUrl("cart.html");
    return;
  }

  CITIES.forEach(function (city) {
    const opt = document.createElement("option");
    opt.value = city.id;
    opt.textContent = city.name;
    citySelect.appendChild(opt);
  });

  function refreshTotals() {
    const sub = cartSubtotal();
    const fee = cityFee(citySelect.value);
    subNode.textContent = formatFcfa(sub);
    feeNode.textContent = fee === 0 ? t("free") : formatFcfa(fee);
    totalNode.textContent = formatFcfa(sub + fee);
  }

  citySelect.addEventListener("change", refreshTotals);
  refreshTotals();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = form.fullName.value.trim();
    const phone = form.phone.value.trim();
    const quarter = form.quarter.value.trim();
    if (!name || !phone || !quarter) {
      showToast(t("required"));
      return;
    }
    writeCart([]);
    form.hidden = true;
    document.getElementById("checkout-summary").hidden = true;
    success.hidden = false;
  });
}

function renderContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showToast(t("orderOk"));
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const page = window.SD_PAGE;
  if (page === "index.html") renderHome();
  if (page === "shop.html") renderShop();
  if (page === "product.html") renderProduct();
  if (page === "cart.html") renderCartPage();
  if (page === "checkout.html") renderCheckout();
  if (page === "contact.html") renderContact();
});
