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
  shopName: "AutoShop",                          // Nom affiché en haut
  currency: "€",                                 // Devise affichée
  footerText: "Livraison instantanée • Paiement crypto",
  defaultTheme: "dark",                          // "dark" ou "light"

  // ---------- BACKEND ----------
  // URL de ton serveur backend (voir README). Exemple : "https://mon-autoshop.onrender.com"
  frontendUrl: "https://00GreyHat00.github.io/MLSNIFFER---SHOP/",
  apiUrl: "https://00greyhat00.github.io/autoshop1",

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
      name: "Scraper Yahoo / DuckDuckGo",
      description: "Scraper mult moteur avec licence à durée configurable.",
      emoji: "🔎",
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
      name: "Checker Disney",
      description: "Checker Disney avec licence à durée configurable.",
      emoji: "✓",
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
      name: "Valid Numbers Mass Checker",
      description: "Vérification en masse de numéros avec licence flexible.",
      emoji: "📱",
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
  ],

  /* ─────────────── ONGLET « LISTE » ─────────────── */
  /* Pour ces produits, 1 unité achetée = 1 ligne du fichier
     bot/stock/<id>.txt livrée au client. Le stock affiché =
     nombre de lignes restantes dans le fichier.               */
  liste: [
    {
      id: "nl",
      name: "NL",
      description: "Listes NL par pays et domaine, tarifées au millier.",
      emoji: "✉️",
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
        {
          name: "Domaine",
          dependsOn: "Pays",
          choices: [
            { label: "outlook.com", price: 0, availableFor: ["France", "Belgique", "Allemagne", "Luxembourg", "Suisse"] },
            { label: "hotmail.com", price: 0, availableFor: ["France", "Belgique", "Portugal", "Luxembourg"] },
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
            { label: "gmail.com", price: 0, availableFor: ["Suisse"] },
            { label: "bluewin.ch", price: 0, availableFor: ["Suisse"] },
            { label: "gmx.ch", price: 0, availableFor: ["Suisse"] },
            { label: "sunrise.ch", price: 0, availableFor: ["Suisse"] },
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
    {
      id: "ml",
      name: "ML",
      description: "Listes ML par pays et domaine, tarifées au millier.",
      emoji: "📨",
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
            { label: "outlook.com", price: 0, availableFor: ["France", "Belgique", "Allemagne", "Luxembourg", "Suisse"] },
            { label: "hotmail.com", price: 0, availableFor: ["France", "Belgique", "Portugal", "Luxembourg"] },
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
            { label: "gmail.com", price: 0, availableFor: ["Suisse"] },
            { label: "bluewin.ch", price: 0, availableFor: ["Suisse"] },
            { label: "gmx.ch", price: 0, availableFor: ["Suisse"] },
            { label: "sunrise.ch", price: 0, availableFor: ["Suisse"] },
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
