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
    selectionStock: null,
    choiceCounts: {},
    currentProduct: null,
    selectedOptions: {},  // { "nom option": index du choix }
    quantity: 1,
    selectedCrypto: null,
    language: "en",
    dashboard: { spent: 0, orders: [], licenses: [], clientId: "" },
  };

  const TEXT = {
    en: { script: "Script", list: "List", orders: "Orders", loading: "Loading shop…", buy: "Buy", quantity: "Quantity", stock: "in stock", soldOut: "Out of stock", from: "from", view: "View ↗", spent: "Spent", loyalty: "Loyalty discount", timeLeft: "Time left", noLicenses: "No active subscriptions", noOrders: "No orders yet", next: "until", lifetime: "Lifetime", trial: "Trial", idea: "Briefly describe your idea", delayed: "Delivery is not instant.", insufficient: "Insufficient balance — top up your wallet", success: "Purchase successful!", options: "Options", wallet: "💳 My wallet", topupWith: "Top up with:", amount: "Amount to deposit ($)", generate: "Generate deposit address", send: "Send", to: "to:", copy: "📋 Copy address", confirmation: "✅ Automatic confirmation — your balance will be credited after blockchain validation.", total: "Total", footer: "Instant delivery • Crypto payment" },
    fr: { script: "Script", list: "Liste", orders: "Commandes", loading: "Chargement de la boutique…", buy: "Acheter", quantity: "Quantité", stock: "en stock", soldOut: "Rupture de stock", from: "dès", view: "Voir ↗", spent: "Dépensé", loyalty: "Remise fidélité", timeLeft: "Temps restant", noLicenses: "Aucun abonnement actif", noOrders: "Aucune commande", next: "avant", lifetime: "Lifetime", trial: "Essai", idea: "Décrivez brièvement votre idée", delayed: "La livraison n'est pas instantanée.", insufficient: "Solde insuffisant — rechargez votre portefeuille", success: "Achat réussi !", options: "Options", wallet: "💳 Mon portefeuille", topupWith: "Recharger avec :", amount: "Montant à recharger ($)", generate: "Générer l'adresse de dépôt", send: "Envoyez", to: "à :", copy: "📋 Copier l'adresse", confirmation: "✅ Confirmation automatique — votre solde sera crédité dès validation sur la blockchain.", total: "Total", footer: "Livraison instantanée • Paiement crypto" },
    zh: { script: "脚本", list: "列表", orders: "订单", loading: "商店加载中…", buy: "购买", quantity: "数量", stock: "库存", soldOut: "缺货", from: "起价", view: "查看 ↗", spent: "已消费", loyalty: "忠诚度折扣", timeLeft: "剩余时间", noLicenses: "没有有效订阅", noOrders: "暂无订单", next: "距离", lifetime: "永久", trial: "试用", idea: "简要描述您的想法", delayed: "此商品不会即时交付。", insufficient: "余额不足，请充值", success: "购买成功！", options: "选项", wallet: "💳 我的钱包", topupWith: "充值方式：", amount: "充值金额 ($)", generate: "生成存款地址", send: "发送", to: "至：", copy: "📋 复制地址", confirmation: "✅ 自动确认 — 区块链验证后余额将自动到账。", total: "总计", footer: "即时交付 • 加密货币支付" },
    ru: { script: "Скрипты", list: "Списки", orders: "Заказы", loading: "Загрузка магазина…", buy: "Купить", quantity: "Количество", stock: "в наличии", soldOut: "Нет в наличии", from: "от", view: "Смотреть ↗", spent: "Потрачено", loyalty: "Скидка за лояльность", timeLeft: "Осталось времени", noLicenses: "Нет активных подписок", noOrders: "Заказов пока нет", next: "до", lifetime: "Навсегда", trial: "Пробный", idea: "Кратко опишите вашу идею", delayed: "Доставка не мгновенная.", insufficient: "Недостаточно средств — пополните кошелек", success: "Покупка завершена!", options: "Опции", wallet: "💳 Мой кошелек", topupWith: "Пополнить с помощью:", amount: "Сумма пополнения ($)", generate: "Создать адрес пополнения", send: "Отправьте", to: "на:", copy: "📋 Копировать адрес", confirmation: "✅ Автоподтверждение — баланс будет зачислен после проверки блокчейном.", total: "Итого", footer: "Мгновенная доставка • Оплата криптовалютой" },
  };

  const OPTION_TEXT = {
    en: { "Durée": "Duration", "Pays": "Country", "Domaine": "Domain", "Checked": "Checked", "7 jours": "7 days", "30 jours": "30 days", "France": "France", "Belgique": "Belgium", "Allemagne": "Germany", "Pologne": "Poland", "Portugal": "Portugal", "Luxembourg": "Luxembourg", "Suisse": "Switzerland", "Non checked": "Not checked", "Mix": "Mix (all domains)" },
    fr: { "Mix": "Mix (tous domaines)" },
    zh: { "Durée": "时长", "Pays": "国家/地区", "Domaine": "域名", "Checked": "检查状态", "7 jours": "7 天", "30 jours": "30 天", "France": "法国", "Belgique": "比利时", "Allemagne": "德国", "Pologne": "波兰", "Portugal": "葡萄牙", "Luxembourg": "卢森堡", "Suisse": "瑞士", "Non checked": "未检查", "Mix": "混合（所有域名）" },
    ru: { "Durée": "Срок", "Pays": "Страна", "Domaine": "Домен", "Checked": "Проверка", "7 jours": "7 дней", "30 jours": "30 дней", "France": "Франция", "Belgique": "Бельгия", "Allemagne": "Германия", "Pologne": "Польша", "Portugal": "Португалия", "Luxembourg": "Люксембург", "Suisse": "Швейцария", "Non checked": "Не проверено", "Mix": "Смесь (все домены)" },
  };

  // ---------- HELPERS ----------
  const $ = (sel) => document.querySelector(sel);
  const fmt = (n) => `${SHOP_CONFIG.currency}${n.toFixed(2)}`;
  const t = (key) => TEXT[state.language]?.[key] || TEXT.en[key] || key;
  const optionText = (value) => OPTION_TEXT[state.language]?.[value] || value;
  const compact = (n) => n >= 1000 ? `${Math.floor(n / 100) / 10}K` : String(n);
  const safe = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function localizedProduct(product) {
    return product.translations?.[state.language] || product;
  }

  function productVisual(product, className = "product-image") {
    return product.image
      ? `<img class="${className}" src="${safe(product.image)}" alt="" />`
      : safe(product.emoji || "📦");
  }

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
    if (product.action !== "buy") return "";
    if (stock === undefined) return `<span class="product-stock"><i></i>…</span>`;
    if (stock <= 0) return `<span class="product-stock out"><i></i>${t("soldOut")}</span>`;
    return `<span class="product-stock"><i></i>${stock.toLocaleString()} ${t("stock")}</span>`;
  }

  function renderProducts() {
    for (const [tab, products] of Object.entries(PRODUCTS)) {
      const panel = $(`#tab-${tab}`);
      panel.innerHTML = "";
      products.forEach((product, i) => {
        const localized = localizedProduct(product);
        const card = document.createElement("div");
        card.className = "product-card fade-item";
        card.style.animationDelay = `${i * 0.08}s`;
        card.innerHTML = `
          <div class="product-emoji">${productVisual(product)}</div>
          <div class="product-info">
            <div class="product-name">${safe(localized.name)}</div>
            <div class="product-desc">${safe(localized.description)}</div>
          </div>
          <div class="product-meta">
            <span class="product-price">${
              product.action !== "buy"
                ? t("view")
                : t("from") + " " + fmt(minPrice(product)) + priceSuffix(product)
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
    state.selectionStock = null;
    state.choiceCounts = {};
    state.quantity = product.minQuantity || 1;

    const localized = localizedProduct(product);
    $("#modal-emoji").innerHTML = productVisual(product, "modal-product-image");
    $("#modal-title").textContent = localized.name;
    $("#modal-description").textContent = localized.description;
    $("#custom-request").classList.toggle("hidden", !product.customText);
    $("#custom-request-text").value = "";
    $("#showcase-links").classList.toggle("hidden", product.action !== "showcase");
    $("#quantity-row").classList.toggle("hidden", product.action !== "buy" || product.customText);
    $(".modal-total").classList.toggle("hidden", product.action !== "buy");
    $("#buy-btn").classList.toggle("hidden", product.action !== "buy");
    $("#modal-stock").classList.toggle("hidden", product.action !== "buy");

    if (product.action === "showcase") {
      $("#showcase-links").innerHTML = product.links.map((link) =>
        `<a href="${safe(link.url)}" target="_blank" rel="noopener">${safe(link.label)}</a>`
      ).join("");
    }

    (product.options || []).forEach((opt) => {
      state.selectedOptions[opt.name] = 0; // premier choix par défaut
    });
    renderProductOptions();

    updateModalStock();
    updateSelectionStock();
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
      group.innerHTML = `<div class="option-label">${safe(optionText(option.name))}</div>`;
      const choices = document.createElement("div");
      choices.className = "option-choices";

      available.forEach(({ choice, index }) => {
        const btn = document.createElement("button");
        btn.className = "option-choice" +
          (index === state.selectedOptions[option.name] ? " selected" : "");
        const suffix = product.priceDivisor === 1000 ? " / K" : "";
        const label = optionText(choice.label);
        const count = state.choiceCounts[option.name]?.[index];
        const countSuffix = count === undefined ? "" : ` · ${compact(count)}`;
        btn.textContent = choice.price > 0
          ? `${label}${countSuffix} (+${fmt(choice.price)}${suffix})`
          : `${label}${countSuffix}`;
        btn.addEventListener("click", () => {
          state.selectedOptions[option.name] = index;
          renderProductOptions();
          updateModalPrice();
          updateSelectionStock();
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
    const subtotal = unitPrice() * state.quantity / divisor;
    const spent = state.dashboard.spent || 0;
    const discount = spent >= 1400 ? 0.2 : spent >= 800 ? 0.1 : spent >= 300 ? 0.05 : 0;
    return subtotal * (1 - discount);
  }

  function maxBuyable() {
    const p = state.currentProduct;
    const stock = state.selectionStock ?? state.stock[p.id] ?? 0;
    return Math.min(stock, p.maxQuantity || Infinity);
  }

  function updateModalStock() {
    const stock = state.selectionStock ?? state.stock[state.currentProduct.id] ?? 0;
    const el = $("#modal-stock");
    const minimum = state.currentProduct.minQuantity || 1;
    if (stock < minimum) {
      el.innerHTML = `<i></i>${t("soldOut")}`;
      el.classList.add("out");
      $("#buy-btn").disabled = true;
      $("#quantity-row").classList.add("hidden");
    } else {
      el.innerHTML = `<i></i>${stock.toLocaleString()} ${t("stock")}`;
      el.classList.remove("out");
      $("#buy-btn").disabled = false;
      $("#quantity-row").classList.toggle("hidden", state.currentProduct.customText);
    }
  }

  async function updateSelectionStock() {
    const product = state.currentProduct;
    if (!product || product.action !== "buy" || product.priceDivisor !== 1000) return;
    const requestedProduct = product;
    try {
      const result = await api("/api/stock/selection", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, options: state.selectedOptions }),
      });
      if (state.currentProduct !== requestedProduct) return;
      state.selectionStock = result.stock;
      state.choiceCounts = result.counts || {};
      renderProductOptions();
      updateModalStock();
      updateModalPrice();
    } catch { /* conserve le stock global en mode aperçu */ }
  }

  function updateModalPrice() {
    const product = state.currentProduct;
    const quantityInput = $("#qty-value");
    quantityInput.value = state.quantity;
    quantityInput.min = product.minQuantity || 1;
    quantityInput.max = maxBuyable();
    quantityInput.step = product.quantityStep || 1;
    $("#quantity-label").textContent = t("quantity");
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
      toast(t("insufficient"));
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
          customText: $("#custom-request-text").value.trim(),
        }),
      });
      state.balance = result.balance;
      state.stock[p.id] = result.stock;
      updateBalanceUI();
      renderProducts();
      await loadDashboard();
      closeModals();
      toast(`✅ ${t("success")}`);
      tg?.HapticFeedback?.notificationOccurred?.("success");
    } catch (err) {
      toast(`❌ ${err.message}`);
    } finally {
      $("#buy-btn").disabled = false;
      $("#buy-btn").textContent = t("buy");
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
    if (!amount || amount < 10) {
      toast("MINIMUM DEPOSIT: 10 USD");
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
        if (tab.dataset.tab === "orders") loadDashboard();
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
    await loadDashboard();
  }

  function formatRemaining(expiresAt) {
    if (!expiresAt) return t("lifetime");
    const seconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    return `${days}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function renderDashboard() {
    const { spent, clientId, licenses, orders } = state.dashboard;
    $("#orders-spent").textContent = fmt(spent);
    $("#client-id").textContent = clientId || "—";
    $("#spent-label").textContent = t("spent");
    $("#loyalty-title").textContent = t("loyalty");
    $("#licenses-title").textContent = t("timeLeft");
    $("#orders-title").textContent = t("orders");
    const target = spent < 300 ? 300 : spent < 800 ? 800 : spent < 1400 ? 1400 : 1400;
    const rate = spent >= 1400 ? 20 : spent >= 800 ? 10 : spent >= 300 ? 5 : 0;
    $("#loyalty-progress").style.width = `${Math.min(100, spent / target * 100)}%`;
    $("#loyalty-copy").textContent = rate === 20 ? "20%" : `${rate}% · ${fmt(Math.max(0, target - spent))} ${t("next")} ${target === 300 ? "5%" : target === 800 ? "10%" : "20%"}`;

    $("#licenses-list").innerHTML = licenses.length ? licenses.map((license) => {
      const product = Object.values(PRODUCTS).flat().find((item) => item.id === license.productId);
      const lifetime = license.status === "lifetime";
      return `<div class="license-row"><strong>${safe(localizedProduct(product || { name: license.productId }).name)}</strong><span class="status-pill ${lifetime ? "" : "trial"}"><i></i>${lifetime ? t("lifetime") : t("trial")}</span><time data-expires="${license.expiresAt || ""}">${formatRemaining(license.expiresAt)}</time></div>`;
    }).join("") : `<p class="empty-state">${t("noLicenses")}</p>`;

    $("#orders-list").innerHTML = orders.length ? orders.map((order) =>
      `<details class="order-row"><summary><span><strong>${safe(order.productName || order.productId)}</strong><small>${new Date(order.date).toLocaleString(state.language)}</small></span><span>${order.quantity} × · ${fmt(order.total)}</span><span class="status-pill"><i></i>bought</span><span class="info-button">•••</span></summary><div class="order-details"><code>${safe(order.transactionId || order.id)}</code><p>${safe((order.options || []).join(" · ") || t("options"))}</p></div></details>`
    ).join("") : `<p class="empty-state">${t("noOrders")}</p>`;
  }

  async function loadDashboard() {
    try {
      state.dashboard = await api("/api/dashboard");
      renderDashboard();
    } catch { renderDashboard(); }
  }

  function applyLanguage() {
    document.documentElement.lang = state.language;
    document.querySelector('[data-tab="script"]').textContent = `⚙️ ${t("script")}`;
    document.querySelector('[data-tab="liste"]').textContent = `📄 ${t("list")}`;
    document.querySelector('[data-tab="orders"]').textContent = `🧾 ${t("orders")}`;
    $(".loader-text").textContent = t("loading");
    $("#buy-btn").textContent = t("buy");
    $("#custom-request-label").textContent = t("idea");
    $("#custom-delivery-note").textContent = t("delayed");
    $("#wallet-title").textContent = t("wallet");
    $("#topup-method-title").textContent = t("topupWith");
    $("#topup-amount-label").textContent = t("amount");
    $("#topup-btn").textContent = t("generate");
    $("#send-label").textContent = t("send");
    $("#to-label").textContent = t("to");
    $("#copy-address-btn").textContent = t("copy");
    $("#deposit-note").textContent = t("confirmation");
    $("#total-label").textContent = t("total");
    $("#footer-text").textContent = t("footer");
  }

  function chooseLanguage() {
    return new Promise((resolve) => {
      document.querySelectorAll("[data-language]").forEach((button) => {
        button.addEventListener("click", () => {
          state.language = button.dataset.language;
          applyLanguage();
          $("#language-modal").classList.add("hidden");
          resolve();
        }, { once: true });
      });
    });
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

    await chooseLanguage();

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
    setInterval(() => {
      document.querySelectorAll("[data-expires]").forEach((element) => {
        element.textContent = formatRemaining(Number(element.dataset.expires));
      });
    }, 1000);
  }

  boot();
})();
