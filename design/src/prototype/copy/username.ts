// Choosing a username, right after signing in for the first time.

export const strings = {
  title: "Choose a username",
  body: "Friends type it to send you a request. Only your exact username finds you.",
  label: "Username",
  checking: "Checking…",
  available: (name: string) => `@${name} is available`,
  taken: "That username is taken",
  notAllowed:
    "Use 3 to 20 lowercase letters, numbers, dots or underscores, starting with a letter.",
  offline: "Connect to the internet to check usernames.",
  continue: "Continue",
} as const;

export const trust = ["body"] as const;
