import { T } from "../theme";

function Stat({ value, label }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 26, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
    </div>
  );
}

export default function WorkoutOverviewCard({ duration, exerciseCount, setCount }) {
  return (
    <div
      style={{
        background: T.ink,
        color: T.chalk,
        borderRadius: 16,
        padding: "16px 12px",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stat value={duration} label="Duration" />
      <div style={{ width: 1, height: 34, background: "rgba(255,255,255,.18)" }} />
      <Stat value={exerciseCount} label="Exercises" />
      <div style={{ width: 1, height: 34, background: "rgba(255,255,255,.18)" }} />
      <Stat value={setCount} label="Sets" />
    </div>
  );
}
