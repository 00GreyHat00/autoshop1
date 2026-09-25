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
      id: "script-exemple-1",
      name: "Script Automation Pro",
      description: "Script d'automatisation clé en main, mises à jour incluses.",
      emoji: "⚙️",
      basePrice: 25,
      action: "buy",
      options: [
        {
          name: "Licence",
          choices: [
            { label: "1 mois",   price: 0 },   // 25 €
            { label: "3 mois",   price: 15 },  // 40 €
            { label: "Lifetime", price: 50 },  // 75 €
          ],
        },
      ],
    },
    {
      id: "script-exemple-2",
      name: "Bot Telegram Custom",
      description: "Code source complet d'un bot Telegram personnalisable.",
      emoji: "🤖",
      basePrice: 40,
      action: "buy",
      options: [
        {
          name: "Support",
          choices: [
            { label: "Sans support",     price: 0 },
            { label: "Support 30 jours", price: 10 },
          ],
        },
      ],
    },
    {
      // Exemple d'annonce qui OUVRE UNE AUTRE PAGE WEB au clic
      id: "script-exemple-3",
      name: "Documentation & Démo",
      description: "Voir la démo en ligne et la documentation complète.",
      emoji: "🔗",
      basePrice: 0,
      action: "link",
      link: "https://example.com/demo",   // ← MODIFIER : page ouverte au clic
    },
  ],

  /* ─────────────── ONGLET « LISTE » ─────────────── */
  /* Pour ces produits, 1 unité achetée = 1 ligne du fichier
     bot/stock/<id>.txt livrée au client. Le stock affiché =
     nombre de lignes restantes dans le fichier.               */
  liste: [
    {
      id: "liste-exemple-1",
      name: "Comptes Premium",
      description: "Format email:motdepasse — livraison instantanée par le bot.",
      emoji: "📄",
      basePrice: 3,
      action: "buy",
      maxQuantity: 10,
    },
    {
      id: "liste-exemple-2",
      name: "Clés de licence",
      description: "Clés d'activation uniques, vérifiées avant mise en stock.",
      emoji: "🔑",
      basePrice: 8,
      action: "buy",
      maxQuantity: 5,
      options: [
        {
          name: "Version",
          choices: [
            { label: "Standard", price: 0 },
            { label: "Pro",      price: 6 },
          ],
        },
      ],
    },
  ],
};
