import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { SignInButton, signInTitle } from "@components/SignInButton";
import { tokens } from "@tokens";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);

describe("SignInButton (group 5)", () => {
  test("uses only the titles Apple and Google allow", () => {
    expect(signInTitle("apple", "continue")).toBe("Continue with Apple");
    expect(signInTitle("apple", "signIn")).toBe("Sign in with Apple");
    expect(signInTitle("apple", "signUp")).toBe("Sign up with Apple");
    expect(signInTitle("google", "continue")).toBe("Continue with Google");
    expect(signInTitle("google", "signIn")).toBe("Sign in with Google");
    expect(signInTitle("google", "signUp")).toBe("Sign up with Google");
  });

  test("is a button named by its title, and its mark is decoration", () => {
    const out = html(<SignInButton provider="apple" action="continue" />);
    expect(out).toMatch(/^<button type="button"/);
    expect(out).toContain(">Continue with Apple<");
    expect(out).toMatch(/<span class="sign-in-button__mark[^"]*" aria-hidden="true"/);
  });

  test("draws no logo of its own: Apple's comes from Apple's system font, Google's is a placeholder", () => {
    const apple = html(<SignInButton provider="apple" action="continue" />);
    const google = html(<SignInButton provider="google" action="continue" />);
    for (const out of [apple, google]) {
      expect(out).not.toContain("<svg");
      expect(out).not.toContain("<img");
    }
    expect(apple).toContain("");
    expect(google).toContain("sign-in-button__mark--placeholder");
  });

  test("each brand's colors, in both themes", () => {
    const { light, dark } = tokens.color;
    expect([light.signInAppleFill, light.signInAppleInk]).toEqual(["#000000", "#FFFFFF"]);
    expect([dark.signInAppleFill, dark.signInAppleInk]).toEqual(["#FFFFFF", "#000000"]);
    expect([light.signInGoogleFill, light.signInGoogleStroke, light.signInGoogleInk]).toEqual([
      "#FFFFFF",
      "#747775",
      "#1F1F1F",
    ]);
    expect([dark.signInGoogleFill, dark.signInGoogleStroke, dark.signInGoogleInk]).toEqual([
      "#131314",
      "#8E918F",
      "#E3E3E3",
    ]);
  });

  test("an unavailable button is shown, ignores presses and stays focusable", () => {
    const out = html(<SignInButton provider="google" action="continue" disabled />);
    expect(out).toContain('aria-disabled="true"');
    expect(out).not.toMatch(/\sdisabled=""/);
  });
});
