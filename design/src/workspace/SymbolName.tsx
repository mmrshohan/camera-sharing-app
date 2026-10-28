import { Fragment } from "react";

/** An SF Symbol name that may wrap only after a dot, never inside a word. */
export function SymbolName({ name }: { name: string }) {
  return name.split(".").map((part, i, all) => (
    <Fragment key={i}>
      {part}
      {i < all.length - 1 && (
        <>
          .<wbr />
        </>
      )}
    </Fragment>
  ));
}
