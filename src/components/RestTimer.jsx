import { T } from "../theme";
import { formatClock } from "../utils/workout";

export default function RestTimer({ remaining, running, onAdjust, onToggleRun }) {
  const active = remaining > 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: T.ink,
        color: T.chalk,
        borderRadius: 14,
        padding: "10px 12px",
        marginBottom: 10,
      }}
    >
      <div style={{ minWidth: 30, fontSize: 10.5, opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: 1.2 }}>
        Rest
      </div>
      <div
        aria-live="polite"
        style={{
          minWidth: 74,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: active ? "#F2C14E" : T.chalk,
        }}
      >
        {formatClock(remaining)}
      </div>
      <div style={{ flex: 1 }} />
      <button
        onClick={() => onAdjust(-15)}
        disabled={!active}
        aria-label="Subtract 15 seconds"
        style={{
          minWidth: 48,
          minHeight: 44,
          border: "1px solid rgba(255,255,255,.28)",
          borderRadius: 10,
          background: "rgba(255,255,255,.1)",
          color: active ? T.chalk : "rgba(255,255,255,.4)",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          cursor: active ? "pointer" : "default",
        }}
      >
        −15s
      </button>
      <button
        onClick={onToggleRun}
        disabled={!active}
        aria-label={running ? "Pause rest timer" : "Resume rest timer"}
        style={{
          minWidth: 48,
          minHeight: 44,
          border: "none",
          borderRadius: 10,
          background: active ? T.chalk : "rgba(255,255,255,.18)",
          color: active ? T.ink : "rgba(255,255,255,.45)",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          cursor: active ? "pointer" : "default",
        }}
      >
        {running ? "Pause" : "Resume"}
      </button>
      <button
        onClick={() => onAdjust(15)}
        disabled={!active}
        aria-label="Add 15 seconds"
        style={{
          minWidth: 48,
          minHeight: 44,
          border: "1px solid rgba(255,255,255,.28)",
          borderRadius: 10,
          background: "rgba(255,255,255,.1)",
          color: active ? T.chalk : "rgba(255,255,255,.4)",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          cursor: active ? "pointer" : "default",
        }}
      >
        +15s
      </button>
    </div>
  );
}
