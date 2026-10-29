// Alex's scanner. The viewfinder writes its own scanning, invalid, access-off and in-use text.

export const strings = {
  close: "Close",
  openSettings: "Open Settings",
  typeUsername: "Type a username instead",
  scanInstead: "Scan a code instead",
  usernameLabel: "Exact username",
  send: "Send request",
  noMatch: "No account with that exact username",
  tooManyRequests: "Too many requests. Try again in a few minutes",
  notAvailable: "That account isn’t available",
} as const;

export const trust = [] as const;
