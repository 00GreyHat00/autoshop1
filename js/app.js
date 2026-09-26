/* ============================================================
   AUTOSHOP — LOGIQUE FRONTEND
   En principe tu n'as PAS besoin de modifier ce fichier :
   tout se règle dans js/config.js
   ============================================================ */

(() => {
  "use strict";

  // ---------- TELEGRAM MINI APP ----------
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
  }

  // initData = preuve d'identité Telegram, vérifiée côté backend
  const initData = tg?.initData || "";

  // ---------- ÉTAT ----------
  const state = {
    balance: 0,
    stock: {},            // { "id-produit": nombre } — récupéré du backend
    currentProduct: null,
    selectedOptions: {},  // { "nom option": index du choix }
    quantity: 1,
    selectedCrypto: null,
  };

  // ---------- HELPERS ----------
  const $ = (sel) => document.querySelector(sel);
  const fmt = (n) => `${n.toFixed(2)} ${SHOP_CONFIG.currency}`;

  function toast(message, duration = 2600) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.remove("hidden");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.add("hidden"), duration);
  }

  async function api(path, options = {}) {
    const res = await fetch(`${SHOP_CONFIG.apiUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData,
      },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Erreur serveur");
    return data;
  }

  // ============================================================
  // THÈME SOMBRE / CLAIR
  // ============================================================
  function applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
    $("#theme-toggle .theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("autoshop-theme", theme);
    if (tg) {
      tg.setHeaderColor?.(theme === "dark" ? "#101116" : "#f4f5f7");
      tg.setBackgroundColor?.(theme === "dark" ? "#101116" : "#f4f5f7");
    }
  }

  function initTheme() {
    const saved =
      localStorage.getItem("autoshop-theme") ||
      (tg?.colorScheme === "dark" ? "dark" : SHOP_CONFIG.defaultTheme);
    applyTheme(saved);
    $("#theme-toggle").addEventListener("click", () => {
      const next = document.body.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
    });
  }

  // ============================================================
  // RENDU DES PRODUITS
  // ============================================================
  function minPrice(product) {
    // Prix minimum en tenant compte des options
    let price = product.basePrice;
    (product.options || []).forEach((opt) => {
      price += Math.min(...opt.choices.map((c) => c.price));
    });
    return price;
  }

  function priceSuffix(product) {
    return product.priceDivisor === 1000 ? " / K" : "";
  }

  function stockLabel(product) {
    const stock = state.stock[product.id];
    if (product.action === "link") return "";
    if (stock === undefined) return `<span class="product-stock">Stock : …</span>`;
    if (stock <= 0) return `<span class="product-stock out">Rupture</span>`;
    return `<span class="product-stock">Stock : ${stock}</span>`;
  }

  function renderProducts() {
    for (const [tab, products] of Object.entries(PRODUCTS)) {
      const panel = $(`#tab-${tab}`);
      panel.innerHTML = "";
      products.forEach((product, i) => {
        const card = document.createElement("div");
        card.className = "product-card fade-item";
        card.style.animationDelay = `${i * 0.08}s`;
        card.innerHTML = `
          <div class="product-emoji">${product.emoji || "📦"}</div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-desc">${product.description}</div>
          </div>
          <div class="product-meta">
            <span class="product-price">${
              product.action === "link"
                ? "Voir ↗"
                : "dès " + fmt(minPrice(product)) + priceSuffix(product)
            }</span>
            ${stockLabel(product)}
          </div>`;
        card.addEventListener("click", () => onProductClick(product));
        panel.appendChild(card);
      });
    }
  }

  function onProductClick(product) {
    if (product.action === "link" && product.link) {
      // Ouvre une autre page web
      if (tg) tg.openLink(product.link);
      else window.open(product.link, "_blank");
      return;
    }
    openProductModal(product);
  }

  // ============================================================
  // MODALE PRODUIT
  // ============================================================
  function openProductModal(product) {
    state.currentProduct = product;
    state.selectedOptions = {};
    state.quantity = product.minQuantity || 1;

    $("#modal-emoji").textContent = product.emoji || "📦";
    $("#modal-title").textContent = product.name;
    $("#modal-description").textContent = product.description;

    (product.options || []).forEach((opt) => {
      state.selectedOptions[opt.name] = 0; // premier choix par défaut
    });
    renderProductOptions();

    updateModalStock();
    updateModalPrice();
    $("#product-modal").classList.remove("hidden");
  }

  function availableChoices(option) {
    if (!option.dependsOn) return option.choices.map((choice, index) => ({ choice, index }));

    const dependency = state.currentProduct.options.find((opt) => opt.name === option.dependsOn);
    const dependencyChoice = dependency?.choices[state.selectedOptions[option.dependsOn]];
    return option.choices
      .map((choice, index) => ({ choice, index }))
      .filter(({ choice }) => choice.availableFor?.includes(dependencyChoice?.label));
  }

  function renderProductOptions() {
    const product = state.currentProduct;
    const optsEl = $("#modal-options");
    optsEl.innerHTML = "";

    (product.options || []).forEach((option) => {
      const available = availableChoices(option);
      if (!available.some(({ index }) => index === state.selectedOptions[option.name])) {
        state.selectedOptions[option.name] = available[0]?.index ?? 0;
      }

      const group = document.createElement("div");
      group.className = "option-group";
      group.innerHTML = `<div class="option-label">${option.name}</div>`;
      const choices = document.createElement("div");
      choices.className = "option-choices";

      available.forEach(({ choice, index }) => {
        const btn = document.createElement("button");
        btn.className = "option-choice" +
          (index === state.selectedOptions[option.name] ? " selected" : "");
        const suffix = product.priceDivisor === 1000 ? " / K" : "";
        btn.textContent = choice.price > 0
          ? `${choice.label} (+${fmt(choice.price)}${suffix})`
          : choice.label;
        btn.addEventListener("click", () => {
          state.selectedOptions[option.name] = index;
          renderProductOptions();
          updateModalPrice();
        });
        choices.appendChild(btn);
      });

      group.appendChild(choices);
      optsEl.appendChild(group);
    });
  }

  function unitPrice() {
    const p = state.currentProduct;
    let price = p.basePrice;
    (p.options || []).forEach((opt) => {
      price += opt.choices[state.selectedOptions[opt.name]].price;
    });
    return price;
  }

  function totalPrice() {
    const divisor = state.currentProduct.priceDivisor || 1;
    return unitPrice() * state.quantity / divisor;
  }

  function maxBuyable() {
    const p = state.currentProduct;
    const stock = state.stock[p.id] ?? 0;
    return Math.min(stock, p.maxQuantity || Infinity);
  }

  function updateModalStock() {
    const stock = state.stock[state.currentProduct.id] ?? 0;
    const el = $("#modal-stock");
    const minimum = state.currentProduct.minQuantity || 1;
    if (stock < minimum) {
      el.textContent = "❌ Rupture de stock";
      el.classList.add("out");
      $("#buy-btn").disabled = true;
      $("#quantity-row").classList.add("hidden");
    } else {
      el.textContent = `✅ ${stock} en stock`;
      el.classList.remove("out");
      $("#buy-btn").disabled = false;
      $("#quantity-row").classList.remove("hidden");
    }
  }

  function updateModalPrice() {
    const product = state.currentProduct;
    const quantityInput = $("#qty-value");
    quantityInput.value = state.quantity;
    quantityInput.min = product.minQuantity || 1;
    quantityInput.max = maxBuyable();
    quantityInput.step = product.quantityStep || 1;
    $("#quantity-label").textContent = product.quantityLabel || "Quantité";
    $("#modal-total-price").textContent = fmt(totalPrice());
  }

  function initQuantityControls() {
    $("#qty-minus").addEventListener("click", () => {
      const minimum = state.currentProduct.minQuantity || 1;
      const step = state.currentProduct.quantityStep || 1;
      if (state.quantity > minimum) {
        state.quantity = Math.max(minimum, state.quantity - step);
        updateModalPrice();
      }
    });
    $("#qty-plus").addEventListener("click", () => {
      const step = state.currentProduct.quantityStep || 1;
      if (state.quantity + step <= maxBuyable()) {
        state.quantity += step;
        updateModalPrice();
      } else {
        toast("Stock maximum atteint");
      }
    });
    $("#qty-value").addEventListener("change", (event) => {
      const minimum = state.currentProduct.minQuantity || 1;
      const maximum = maxBuyable();
      const requested = Math.floor(Number(event.target.value));
      state.quantity = Number.isFinite(requested)
        ? Math.min(maximum, Math.max(minimum, requested))
        : minimum;
      updateModalPrice();
    });
  }

  // ============================================================
  // ACHAT
  // ============================================================
  async function buy() {
    const p = state.currentProduct;
    const total = totalPrice();

    if (total > state.balance) {
      toast("Solde insuffisant — rechargez votre portefeuille 💳");
      return;
    }

    $("#buy-btn").disabled = true;
    $("#buy-btn").textContent = "Achat en cours…";

    try {
      const result = await api("/api/buy", {
        method: "POST",
        body: JSON.stringify({
          productId: p.id,
          quantity: state.quantity,
          options: state.selectedOptions,
        }),
      });
      state.balance = result.balance;
      state.stock[p.id] = result.stock;
      updateBalanceUI();
      renderProducts();
      closeModals();
      toast("✅ Achat réussi ! Le bot vous envoie votre article.");
      tg?.HapticFeedback?.notificationOccurred?.("success");
    } catch (err) {
      toast(`❌ ${err.message}`);
    } finally {
      $("#buy-btn").disabled = false;
      $("#buy-btn").textContent = "Acheter";
    }
  }

  // ============================================================
  // PORTEFEUILLE / RECHARGE CRYPTO
  // ============================================================
  function updateBalanceUI() {
    $("#wallet-balance").textContent = state.balance.toFixed(2);
    $("#wallet-currency").textContent = SHOP_CONFIG.currency;
    $("#wallet-modal-balance").textContent = state.balance.toFixed(2);
    $("#wallet-modal-currency").textContent = SHOP_CONFIG.currency;
  }

  function renderCryptoButtons() {
    const grid = $("#crypto-grid");
    grid.innerHTML = "";
    SHOP_CONFIG.cryptos.forEach((crypto) => {
      const btn = document.createElement("button");
      btn.className = "crypto-btn";
      btn.innerHTML = `
        <span class="crypto-symbol">${crypto.emoji} ${crypto.symbol}</span>
        <span class="crypto-time">${crypto.eta}</span>`;
      btn.addEventListener("click", () => {
        state.selectedCrypto = crypto;
        grid.querySelectorAll(".crypto-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        $("#topup-step").classList.remove("hidden");
        $("#deposit-step").classList.add("hidden");
        $("#crypto-eta").textContent =
          `⏱ Temps de confirmation ${crypto.name} : ${crypto.eta}`;
      });
      grid.appendChild(btn);
    });
  }

  async function requestTopup() {
    const amount = parseFloat($("#topup-amount").value);
    if (!amount || amount <= 0) {
      toast("Entrez un montant valide");
      return;
    }
    if (!state.selectedCrypto) {
      toast("Choisissez une crypto");
      return;
    }

    $("#topup-btn").disabled = true;
    $("#topup-btn").textContent = "Génération…";

    try {
      const result = await api("/api/topup", {
        method: "POST",
        body: JSON.stringify({
          amount,
          crypto: state.selectedCrypto.symbol,
        }),
      });
      $("#deposit-amount").textContent =
        `${result.payAmount} ${state.selectedCrypto.symbol}`;
      $("#deposit-address").textContent = result.address;
      $("#deposit-step").classList.remove("hidden");
    } catch (err) {
      toast(`❌ ${err.message}`);
    } finally {
      $("#topup-btn").disabled = false;
      $("#topup-btn").textContent = "Générer l'adresse de dépôt";
    }
  }

  function copyAddress() {
    navigator.clipboard
      .writeText($("#deposit-address").textContent)
      .then(() => toast("📋 Adresse copiée"))
      .catch(() => toast("Copie impossible — copiez manuellement"));
  }

  // ============================================================
  // MODALES (ouverture / fermeture)
  // ============================================================
  function closeModals() {
    document.querySelectorAll(".modal").forEach((m) => m.classList.add("hidden"));
  }

  function initModals() {
    document.querySelectorAll("[data-close-modal]").forEach((el) =>
      el.addEventListener("click", closeModals)
    );
    $("#wallet-btn").addEventListener("click", () => {
      $("#topup-step").classList.add("hidden");
      $("#deposit-step").classList.add("hidden");
      document.querySelectorAll(".crypto-btn").forEach((b) => b.classList.remove("selected"));
      $("#wallet-modal").classList.remove("hidden");
    });
    $("#buy-btn").addEventListener("click", buy);
    $("#topup-btn").addEventListener("click", requestTopup);
    $("#copy-address-btn").addEventListener("click", copyAddress);
  }

  // ============================================================
  // ONGLETS
  // ============================================================
  function initTabs() {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        $(`#tab-${tab.dataset.tab}`).classList.add("active");
        // Ré-anime l'apparition des cartes de l'onglet
        $(`#tab-${tab.dataset.tab}`)
          .querySelectorAll(".fade-item")
          .forEach((el) => {
            el.classList.remove("visible");
            void el.offsetWidth; // force le redémarrage de l'animation
            el.classList.add("visible");
          });
      });
    });
  }

  // ============================================================
  // DONNÉES BACKEND (solde + stock)
  // ============================================================
  async function loadData() {
    try {
      const [me, stock] = await Promise.all([api("/api/me"), api("/api/stock")]);
      state.balance = me.balance;
      state.stock = stock;
    } catch {
      // Backend injoignable → mode démo (stock fictif pour prévisualiser)
      console.warn("Backend injoignable — mode démo activé");
      Object.values(PRODUCTS).flat().forEach((p) => {
        state.stock[p.id] = p.priceDivisor === 1000 ? 100000 : 12;
      });
    }
    updateBalanceUI();
    renderProducts();
  }

  // Rafraîchit le solde régulièrement (détecte les dépôts confirmés)
  function startBalancePolling() {
    setInterval(async () => {
      try {
        const me = await api("/api/me");
        if (me.balance !== state.balance) {
          const gained = me.balance > state.balance;
          state.balance = me.balance;
          updateBalanceUI();
          if (gained) toast("💰 Dépôt confirmé — solde crédité !");
        }
      } catch { /* silencieux */ }
    }, 15000); // toutes les 15 secondes
  }

  // ============================================================
  // DÉMARRAGE : loader → apparition progressive
  // ============================================================
  async function boot() {
    $("#shop-name").textContent = SHOP_CONFIG.shopName;
    $("#footer-text").textContent = SHOP_CONFIG.footerText;
    document.title = SHOP_CONFIG.shopName;

    initTheme();
    initTabs();
    initModals();
    initQuantityControls();
    renderCryptoButtons();

    await loadData();

    // Durée minimale du loader (réglable)
    await new Promise((r) => setTimeout(r, 900));

    // Masque le loader
    $("#loader").classList.add("fade-out");
    $("#app").classList.remove("hidden");
    setTimeout(() => $("#loader").remove(), 500);

    // ✨ Apparition progressive : chaque élément apparaît l'un après l'autre
    document.querySelectorAll(".fade-item").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 120);
    });

    startBalancePolling();
  }

  boot();
})();
