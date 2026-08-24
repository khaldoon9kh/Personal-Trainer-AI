import { T } from "../theme";

export default function NextUpCard({ exercise, kg }) {
  if (!exercise) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: T.bg,
        border: `1px solid ${T.line}`,
        borderRadius: 12,
        padding: "10px 12px",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 10.5, color: T.sub, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, flexShrink: 0 }}>
        Next up
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {exercise.series ? `${exercise.series} · ${exercise.name}` : exercise.name}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: T.sub, flexShrink: 0 }}>
        {exercise.sets} × {exercise.reps.split("·")[0]}
        {exercise.startKg > 0 ? ` @ ${kg} kg` : ""}
      </div>
    </div>
  );
}
