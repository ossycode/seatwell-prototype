export interface StaticRoute {
  label: string;
  path: string;
}

// A route that takes parameters (here we only ever need one, a single string id)
export interface DynamicRoute<P extends readonly unknown[]> {
  label: string;
  path: (...params: P) => string;
}

export const Routes = {
  // Admin
  ADMIN: { label: "Admin Home", path: "/admin" } as StaticRoute,
  ADMIN_ANALYTICS: {
    label: "Analytics",
    path: "/admin/analytics",
  } as StaticRoute,
  ADMIN_GAMES: { label: "Manage Games", path: "/admin/games" } as StaticRoute,
  ADMIN_TICKETS: {
    label: "Manage Tickets",
    path: "/admin/tickets",
  } as StaticRoute,
  ADMIN_TRANSACTIONS: {
    label: "View Purchases",
    path: "/admin/transactions",
  } as StaticRoute,
  ADMIN_USERS: {
    label: "User Management",
    path: "/admin/users",
  } as StaticRoute,
  ADMIN_PAYOUTS: { label: "Payouts", path: "/admin/payouts" } as StaticRoute,

  // Buyer
  BUYER: { label: "Buy a Ticket", path: "/buyer" } as StaticRoute,
  BUYER_BUY: {
    label: "Browse Tickets",
    path: "/buyer/buy-ticket",
  } as StaticRoute,
  BUYER_BUY_GAME: {
    label: "Purchase Tickets",
    path: (gameId: string) => `/buyer/buy-ticket/${encodeURIComponent(gameId)}`,
  } as DynamicRoute<[string]>,
  BUYER_CONFIRM: {
    label: "Purchase Confirmation",
    path: (gameId: string) =>
      `/buyer/buy-ticket/${encodeURIComponent(gameId)}/confirmation`,
  } as DynamicRoute<[string]>,

  // Seller
  SELLER: { label: "Sell your Ticket", path: "/seller" } as StaticRoute,
  SELLER_RELEASE: {
    label: "Release Tickets",
    path: "/seller/release",
  } as StaticRoute,
  SELLER_CONFIRM: {
    label: "Release Confirm",
    path: "/seller/release/confirmation",
  } as StaticRoute,

  SELLER_LISTING: {
    label: "Your Ticket Listings",
    path: "/seller/listings",
  } as StaticRoute,

  SELLER_PAYOUT: {
    label: "Your Payouts",
    path: "/seller/payouts",
  } as StaticRoute,
  // Auth
  ADMIN_LOGIN: {
    label: "Admin Sign-In",
    path: "/auth/admin-login",
  } as StaticRoute,
  SELLER_LOGIN: {
    label: "Seller Sign-In",
    path: "/auth/seller-login",
  } as StaticRoute,
  BUYER_LOGIN: {
    label: "Buyer Sign-In",
    path: "/auth/buyer-login",
  } as StaticRoute,

  BUYER_PURCHASED: {
    label: "Purchached Tickets",
    path: "/buyer/tickets-purchased",
  } as StaticRoute,

  BUYER_GAMES: {
    label: "Upcoming Games",
    path: "/buyer/games",
  } as StaticRoute,

  // Public
  HOME: { label: "Home page", path: "/" } as StaticRoute,
  CONTACT: { label: "Contact", path: "/contact" } as StaticRoute,

  // API base (if you need it)
  API: { label: "API root", path: "/api" } as StaticRoute,
};

// static link
// <Link href={Routes.ADMIN_GAMES.path}>
//   {Routes.ADMIN_GAMES.label}
// </Link>

// // dynamic link
// <Link href={Routes.BUYER_BUY_GAME.path(game.id)}>
//   {Routes.BUYER_BUY_GAME.label}
// </Link>
