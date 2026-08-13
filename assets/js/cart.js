const CART_KEY = "sd-cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}

function cartCount() {
  return readCart().reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
}

function updateCartCount() {
  const nodes = document.querySelectorAll("[data-cart-count]");
  const count = cartCount();
  nodes.forEach(function (node) {
    node.textContent = String(count);
    node.hidden = count === 0;
  });
}

function addToCart(productId, qty) {
  const amount = qty || 1;
  const items = readCart();
  const found = items.find(function (item) {
    return item.id === productId;
  });
  if (found) {
    found.qty += amount;
  } else {
    items.push({ id: productId, qty: amount });
  }
  writeCart(items);
  showToast(t("added"));
}

function setQty(productId, qty) {
  const next = Math.max(1, qty);
  const items = readCart().map(function (item) {
    if (item.id === productId) item.qty = next;
    return item;
  });
  writeCart(items);
}

function removeFromCart(productId) {
  writeCart(
    readCart().filter(function (item) {
      return item.id !== productId;
    })
  );
}

function cartLines() {
  return readCart()
    .map(function (item) {
      const product = getProduct(item.id);
      if (!product) return null;
      return {
        product: product,
        qty: item.qty,
        lineTotal: product.price * item.qty
      };
    })
    .filter(Boolean);
}

function cartSubtotal() {
  return cartLines().reduce(function (sum, line) {
    return sum + line.lineTotal;
  }, 0);
}

function cityFee(cityId) {
  const city = CITIES.find(function (item) {
    return item.id === cityId;
  });
  return city ? city.fee : 0;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}
