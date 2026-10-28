import { layers, platformRows } from "./platform-rows";

export function Platforms() {
  return (
    <section id="platforms" className="g-section" data-testid="guideline-platforms">
      <h2>One brand, two native apps</h2>
      <p className="g-lede">
        The brand layer is shared: tokens, the ring, labels, copy and motion intent. The system
        layer follows each platform, so the app feels at home on both. iOS leads.
      </p>
      <div className="g-cards g-cards--two">
        {layers.map((layer) => (
          <article key={layer.title} className="g-card">
            <h3>{layer.title}</h3>
            <p>{layer.summary}</p>
            <ul className="g-tags">
              {layer.components.map((component) => (
                <li key={component}>
                  <code>{component}</code>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th scope="col">Element</th>
              <th scope="col">iOS</th>
              <th scope="col">Android</th>
            </tr>
          </thead>
          <tbody>
            {platformRows.map((row) => (
              <tr key={row.element}>
                <th scope="row">{row.element}</th>
                <td>{row.ios}</td>
                <td>{row.android}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
