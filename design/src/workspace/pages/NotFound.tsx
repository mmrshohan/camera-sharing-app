import { Link } from "react-router";

export function NotFound() {
  return (
    <section>
      <h1 className="ws-title">Not found</h1>
      <p className="ws-lede">There's nothing at this address in the design system.</p>
      <Link to="/">Go to the overview</Link>
    </section>
  );
}
