/** An earlier release beside today's build, each page embedded without the workspace chrome. */
export function CompareView({ previous, path }: { previous: string; path: string }) {
  const embed = (url: string) => `${url}${url.includes("?") ? "&" : "?"}embed=1`;
  return (
    <div className="ws-compare">
      <figure>
        <figcaption>v{previous}</figcaption>
        <iframe title={`v${previous}`} src={embed(`/__releases/${previous}${path}`)} />
      </figure>
      <figure>
        <figcaption>Now</figcaption>
        <iframe title="Now" src={embed(path)} />
      </figure>
    </div>
  );
}
