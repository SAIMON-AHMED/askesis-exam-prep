"use client";

interface TriangleVisual {
  type: "triangle";
  triangle_kind: string;
  vertices: string[];
  side_labels: Record<string, string>;
  angle_labels: Record<string, string>;
}

interface CircleVisual {
  type: "circle";
  center_label: string;
  radius_label: string;
}

interface RectangleVisual {
  type: "rectangle";
  width_label: string;
  height_label: string;
}

interface TableVisual {
  type: "table";
  headers: string[];
  rows: (string | number)[][];
}

export type VisualAidData = TriangleVisual | CircleVisual | RectangleVisual | TableVisual;

function TriangleDiagram({ vertices, side_labels, angle_labels, triangle_kind }: TriangleVisual) {
  const isRight = triangle_kind === "right";

  // Find which vertex is actually the right angle (per angle_labels), so the square
  // right-angle marker and its "90°" label always line up on the same vertex.
  const rightAngleVertex = Object.keys(angle_labels || {}).find((v) => (angle_labels[v] || "").includes("90"));
  const orderedVertices =
    isRight && rightAngleVertex && vertices.includes(rightAngleVertex)
      ? [rightAngleVertex, ...vertices.filter((v) => v !== rightAngleVertex)]
      : vertices;

  // Fixed layout: right-angle vertex goes bottom-left when triangle_kind is "right", otherwise a generic triangle.
  const points: [number, number][] = isRight
    ? [
        [40, 160], // right-angle vertex - bottom left
        [220, 160], // bottom right
        [40, 30], // top
      ]
    : [
        [40, 160],
        [220, 160],
        [130, 30],
      ];
  const [a, b, c] = points;
  const [va, vb, vc] = orderedVertices;
  const sideAB = side_labels?.[`${va}${vb}`] || side_labels?.[`${vb}${va}`];
  const sideBC = side_labels?.[`${vb}${vc}`] || side_labels?.[`${vc}${vb}`];
  const sideAC = side_labels?.[`${va}${vc}`] || side_labels?.[`${vc}${va}`];

  return (
    <svg viewBox="0 0 260 190" width="100%" height="200" role="img" aria-label="Triangle diagram">
      <polygon
        points={points.map((p) => p.join(",")).join(" ")}
        fill="var(--color-primary-light)"
        stroke="var(--color-primary)"
        strokeWidth={2}
      />
      {isRight && (
        <rect x={a[0]} y={a[1] - 14} width={14} height={14} fill="none" stroke="var(--color-primary)" strokeWidth={1.5} />
      )}
      <text x={a[0] - 12} y={a[1] + 14} fontSize={13} fontWeight={700}>{va}</text>
      <text x={b[0] + 4} y={b[1] + 14} fontSize={13} fontWeight={700}>{vb}</text>
      <text x={c[0] - 4} y={c[1] - 8} fontSize={13} fontWeight={700}>{vc}</text>
      {sideAB && (
        <text x={(a[0] + b[0]) / 2 - 10} y={a[1] + 22} fontSize={12}>{sideAB}</text>
      )}
      {sideBC && (
        <text x={(b[0] + c[0]) / 2 + 8} y={(b[1] + c[1]) / 2} fontSize={12}>{sideBC}</text>
      )}
      {sideAC && (
        <text x={(a[0] + c[0]) / 2 - 24} y={(a[1] + c[1]) / 2} fontSize={12}>{sideAC}</text>
      )}
      {angle_labels?.[va] && <text x={a[0] + 14} y={a[1] - 14} fontSize={11}>{angle_labels[va]}</text>}
      {angle_labels?.[vb] && <text x={b[0] - 30} y={b[1] - 10} fontSize={11}>{angle_labels[vb]}</text>}
      {angle_labels?.[vc] && <text x={c[0] + 8} y={c[1] + 16} fontSize={11}>{angle_labels[vc]}</text>}
    </svg>
  );
}

function CircleDiagram({ center_label, radius_label }: CircleVisual) {
  return (
    <svg viewBox="0 0 220 190" width="100%" height="200" role="img" aria-label="Circle diagram">
      <circle cx={110} cy={95} r={75} fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth={2} />
      <line x1={110} y1={95} x2={185} y2={95} stroke="var(--color-primary)" strokeWidth={2} />
      <circle cx={110} cy={95} r={3} fill="var(--color-primary)" />
      <text x={100} y={88} fontSize={13} fontWeight={700}>{center_label}</text>
      {radius_label && <text x={130} y={88} fontSize={12}>{radius_label}</text>}
    </svg>
  );
}

function RectangleDiagram({ width_label, height_label }: RectangleVisual) {
  return (
    <svg viewBox="0 0 260 190" width="100%" height="200" role="img" aria-label="Rectangle diagram">
      <rect x={40} y={35} width={180} height={110} fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth={2} />
      {width_label && <text x={110} y={162} fontSize={12}>{width_label}</text>}
      {height_label && <text x={228} y={95} fontSize={12}>{height_label}</text>}
    </svg>
  );
}

function TableDiagram({ headers, rows }: TableVisual) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "6px 12px",
                  borderBottom: "2px solid var(--color-border)",
                  fontSize: "0.85rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "6px 12px", borderBottom: "1px solid var(--color-border)" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VisualAid({ data }: { data: VisualAidData | null | undefined }) {
  if (!data) return null;

  return (
    <div className="card" style={{ background: "var(--color-surface-alt, #f7f9fc)", marginTop: 12, marginBottom: 12 }}>
      {data.type === "triangle" && <TriangleDiagram {...data} />}
      {data.type === "circle" && <CircleDiagram {...data} />}
      {data.type === "rectangle" && <RectangleDiagram {...data} />}
      {data.type === "table" && <TableDiagram {...data} />}
    </div>
  );
}
