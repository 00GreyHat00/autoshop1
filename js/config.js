/* ============================================================
   ⚙️ CONFIGURATION DE LA BOUTIQUE — TOUT SE RÈGLE ICI
   ============================================================
   C'est LE fichier à modifier pour personnaliser :
   - Le nom de la boutique, la devise, le texte du footer
   - L'URL de ton backend (API)
   - Les cryptos acceptées et leurs délais
   - Les PRODUITS des onglets "Script" et "Liste"
   ============================================================ */

const SHOP_CONFIG = {

  // ---------- GÉNÉRAL ----------
  shopName: "MLSNIFFER - GAS STATION",           // Nom affiché en haut
  currency: "$",                                 // Devise affichée
  footerText: "Livraison instantanée • Paiement crypto",
  defaultTheme: "dark",                          // "dark" ou "light"

  // ---------- BACKEND ----------
  // URL de ton serveur backend (voir README). Exemple : "https://mon-autoshop.onrender.com"
  frontendUrl: "https://00GreyHat00.github.io/MLSNIFFER---SHOP/",
  apiUrl: "https://mlsniffer-shop.onrender.com",

  // ---------- CRYPTOS ACCEPTÉES ----------
  // "eta" = fourchette de temps de confirmation affichée au client
  cryptos: [
    { symbol: "SOL", name: "Solana",   emoji: "◎",  eta: "≈ 1 à 2 minutes" },
    { symbol: "ETH", name: "Ethereum", emoji: "Ξ",  eta: "≈ 2 à 5 minutes" },
    { symbol: "BTC", name: "Bitcoin",  emoji: "₿",  eta: "≈ 10 à 60 minutes" },
    { symbol: "LTC", name: "Litecoin", emoji: "Ł",  eta: "≈ 5 à 30 minutes" },
  ],
};

/* ============================================================
   📦 PRODUITS — TEMPLATE D'ANNONCE
   ============================================================
   Chaque produit est un objet. Champs disponibles :

   id           : identifiant UNIQUE (doit correspondre au backend)
   name         : nom du produit
   description  : courte description
   emoji        : icône affichée (ou une URL d'image via "image")
   basePrice    : prix de base en devise (nombre)
   action       : ce qui se passe au clic sur l'annonce :
                   - "buy"  → ouvre la fiche produit (achat via le solde)
                   - "link" → ouvre une autre page web (champ "link")
   link         : URL ouverte si action = "link"
   options      : (facultatif) options qui influencent le prix.
                   Chaque choix a un "label" et un "price" (supplément
                   ajouté au basePrice ; 0 = pas de supplément)
   maxQuantity  : (facultatif) quantité max par commande

   ⚠️ Le STOCK n'est PAS défini ici : il est tracé automatiquement
   par le backend (nombre de lignes des fichiers dans bot/stock/).
   ============================================================ */

const PRODUCTS = {

  /* ─────────────── ONGLET « SCRIPT » ─────────────── */
  script: [
    {
      id: "scraper-yahoo-duckduckgo",
      name: "Screaper, Mail and phone number scraper",
      description: "Powerful dorks powered mail and phone scraper works in any country.\n🚨 Updates will be provided in real time ONLY for LifeTime clients",
      image: "https://logo-icons.com/cdn/shop/files/1977-logo-1781903878.709-00a3e4-color.png?v=1781903881&width=1946",
      translations: {
        fr: { name: "Screaper, extracteur d'e-mails et numéros", description: "Puissant scraper alimenté par des dorks, utilisable dans tous les pays.\n🚨 Mises à jour en temps réel UNIQUEMENT pour les clients Lifetime" },
        zh: { name: "Screaper 邮箱和电话号码抓取器", description: "由 dorks 驱动的强大邮箱和电话号码抓取器，适用于任何国家。\n🚨 仅向 Lifetime 客户实时提供更新" },
        ru: { name: "Screaper, сборщик почты и телефонов", description: "Мощный сборщик почты и телефонов на основе дорков для любой страны.\n🚨 Обновления в реальном времени ТОЛЬКО для клиентов Lifetime" },
      },
      basePrice: 60,
      action: "buy",
      options: [
        {
          name: "Durée",
          choices: [
            { label: "7 jours",  price: 0 },
            { label: "30 jours", price: 90 },
            { label: "Lifetime", price: 240 },
          ],
        },
      ],
    },
    {
      id: "checker-disney",
      name: "Disney+ Mail checker",
      description: "Standard Disney+ checker runs at ~2.4 check/s at full throttle.\n🚨 Updates will be provided in real time ONLY for LifeTime clients",
      image: "https://static.vecteezy.com/system/resources/thumbnails/073/495/217/small_2x/disney-plus-logo-circular-glossy-icon-with-transparent-background-free-png.png",
      translations: {
        fr: { name: "Vérificateur d'e-mails Disney+", description: "Checker Disney+ standard à environ 2,4 vérifications/s.\n🚨 Mises à jour en temps réel UNIQUEMENT pour les clients Lifetime" },
        zh: { name: "Disney+ 邮箱检查器", description: "标准 Disney+ 检查器全速约 2.4 次/秒。\n🚨 仅向 Lifetime 客户实时提供更新" },
        ru: { name: "Проверка почты Disney+", description: "Стандартная проверка Disney+ со скоростью около 2,4 проверок/с.\n🚨 Обновления в реальном времени ТОЛЬКО для клиентов Lifetime" },
      },
      basePrice: 20,
      action: "buy",
      options: [
        {
          name: "Durée",
          choices: [
            { label: "7 jours",  price: 0 },
            { label: "30 jours", price: 25 },
            { label: "Lifetime", price: 60 },
          ],
        },
      ],
    },
    {
      id: "valid-numbers-mass-checker",
      name: "Easy Phone Checker",
      description: "Great phone number checker, detects landline/mobile phone numbers and runs at ~10.4 check/s.\n🚨 Updates will be provided in real time ONLY for LifeTime clients",
      image: "https://cdn-icons-png.flaticon.com/512/5328/5328057.png",
      translations: {
        fr: { name: "Easy Phone Checker", description: "Détecte les numéros fixes et mobiles à environ 10,4 vérifications/s.\n🚨 Mises à jour en temps réel UNIQUEMENT pour les clients Lifetime" },
        zh: { name: "简易电话号码检查器", description: "检测固定电话和手机号码，速度约为 10.4 次/秒。\n🚨 仅向 Lifetime 客户实时提供更新" },
        ru: { name: "Easy Phone Checker", description: "Определяет стационарные и мобильные номера со скоростью около 10,4 проверок/с.\n🚨 Обновления в реальном времени ТОЛЬКО для клиентов Lifetime" },
      },
      basePrice: 15,
      action: "buy",
      options: [
        {
          name: "Durée",
          choices: [
            { label: "7 jours",  price: 0 },
            { label: "30 jours", price: 15 },
            { label: "Lifetime", price: 35 },
          ],
        },
      ],
    },
    {
      id: "custom-telegram-mini-app",
      name: "Custom Telegram Mini App",
      description: "Describe your idea and receive a tailored quote. Delivery is not instant.",
      emoji: "🧩",
      basePrice: 40,
      action: "buy",
      maxQuantity: 1,
      customText: true,
      translations: {
        fr: { name: "Mini App Telegram sur mesure", description: "Décrivez votre idée et recevez une réalisation personnalisée. La livraison n'est pas instantanée." },
        zh: { name: "定制 Telegram Mini App", description: "描述您的想法并获得定制服务。此商品不会即时交付。" },
        ru: { name: "Telegram Mini App на заказ", description: "Опишите свою идею и получите индивидуальное решение. Доставка не мгновенная." },
      },
    },
    {
      id: "showcase",
      name: "Showcase",
      description: "Watch the tools in action.",
      image: "https://static.vecteezy.com/system/resources/thumbnails/009/350/658/small/play-button-sign-png.png",
      basePrice: 0,
      action: "showcase",
      translations: {
        fr: { name: "Démonstrations", description: "Découvrez les outils en vidéo." },
        zh: { name: "产品演示", description: "观看工具的实际运行效果。" },
        ru: { name: "Демонстрации", description: "Посмотрите инструменты в действии." },
      },
      links: [
        { label: "Screaper, Mail and phone number scraper 🎬", url: "https://t.me/mlsniffer" },
        { label: "Disney+ Mail checker 🎬", url: "https://t.me/mlsniffer" },
        { label: "Easy Phone Checker 🎬", url: "https://t.me/mlsniffer" },
      ],
    },
  ],

  /* ─────────────── ONGLET « LISTE » ─────────────── */
  /* Pour ces produits, 1 unité achetée = 1 ligne du fichier
     bot/stock/<id>.txt livrée au client. Le stock affiché =
     nombre de lignes restantes dans le fichier.               */
  liste: [
    {
      id: "nl",
      name: "NumList",
      description: "Phone number lists by country, priced per thousand.",
      emoji: "📱",
      translations: {
        fr: { name: "NumList", description: "Listes de numéros par pays, tarifées au millier." },
        zh: { name: "号码列表", description: "按国家/地区提供的电话号码列表，每千条计价。" },
        ru: { name: "Списки номеров", description: "Списки телефонных номеров по странам, цена за тысячу." },
      },
      basePrice: 2,
      action: "buy",
      minQuantity: 1000,
      quantityStep: 1000,
      priceDivisor: 1000,
      quantityLabel: "Quantité (adresses)",
      options: [
        {
          name: "Pays",
          choices: [
            { label: "France", price: 0 },
            { label: "Belgique", price: 0 },
            { label: "Allemagne", price: 0 },
            { label: "Pologne", price: 0 },
            { label: "Portugal", price: 0 },
            { label: "Luxembourg", price: 0 },
            { label: "Suisse", price: 1 },
          ],
        },
      ],
    },
    {
      id: "ml",
      name: "MailList",
      description: "Email lists by country and domain, priced per thousand.",
      emoji: "📨",
      translations: {
        fr: { name: "MailList", description: "Listes d'e-mails par pays et domaine, tarifées au millier." },
        zh: { name: "邮箱列表", description: "按国家和域名提供的邮箱列表，每千条计价。" },
        ru: { name: "Списки почты", description: "Списки электронной почты по странам и доменам, цена за тысячу." },
      },
      basePrice: 2.5,
      action: "buy",
      minQuantity: 1000,
      quantityStep: 1000,
      priceDivisor: 1000,
      quantityLabel: "Quantité (adresses)",
      options: [
        {
          name: "Pays",
          choices: [
            { label: "France", price: 0 },
            { label: "Belgique", price: 0 },
            { label: "Allemagne", price: 0 },
            { label: "Pologne", price: 0 },
            { label: "Portugal", price: 0 },
            { label: "Luxembourg", price: 0 },
            { label: "Suisse", price: 1 },
          ],
        },
        {
          name: "Domaine",
          dependsOn: "Pays",
          choices: [
            { label: "Mix", price: 0, availableFor: ["France", "Belgique", "Allemagne", "Pologne", "Portugal", "Luxembourg", "Suisse"] },
            { label: "orange.fr", price: 0, availableFor: ["France"] },
            { label: "yahoo.fr", price: 0, availableFor: ["France"] },
            { label: "free.fr", price: 0, availableFor: ["France"] },
            { label: "sfr.fr", price: 0, availableFor: ["France"] },
            { label: "laposte.net", price: 0, availableFor: ["France"] },
            { label: "mailfence.com", price: 0, availableFor: ["Belgique"] },
            { label: "web.de", price: 0, availableFor: ["Allemagne"] },
            { label: "gmx.de", price: 0, availableFor: ["Allemagne"] },
            { label: "t-online.de", price: 0, availableFor: ["Allemagne"] },
            { label: "wp.pl", price: 0, availableFor: ["Pologne"] },
            { label: "onet.pl", price: 0, availableFor: ["Pologne"] },
            { label: "interia.pl", price: 0, availableFor: ["Pologne"] },
            { label: "o2.pl", price: 0, availableFor: ["Pologne"] },
            { label: "gazeta.pl", price: 0, availableFor: ["Pologne"] },
            { label: "poczta.onet.pl", price: 0, availableFor: ["Pologne"] },
            { label: "live.com", price: 0, availableFor: ["Portugal"] },
            { label: "sapo.pt", price: 0, availableFor: ["Portugal"] },
            { label: "tutanota.com", price: 0, availableFor: ["Portugal"] },
            { label: "post.lu", price: 0, availableFor: ["Luxembourg"] },
            { label: "visualonline.lu", price: 0, availableFor: ["Luxembourg"] },
            { label: "net2000.ch", price: 0, availableFor: ["Suisse"] },
            { label: "bluewin.ch", price: 0, availableFor: ["Suisse"] },
            { label: "gmx.ch", price: 0, availableFor: ["Suisse"] },
            { label: "sunrise.ch", price: 0, availableFor: ["Suisse"] },
            { label: "teleport.ch", price: 0, availableFor: ["Suisse"] },
            { label: "zapp.ch", price: 0, availableFor: ["Suisse"] },
          ],
        },
        {
          name: "Checked",
          choices: [
            { label: "Non checked", price: 0 },
            { label: "Disney", price: 10 },
          ],
        },
      ],
    },
  ],
};
