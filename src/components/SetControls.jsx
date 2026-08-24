import { T } from "../theme";

function SetPip({ state }) {
  const base = {
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  };
  if (state === "done") {
    return <div style={{ ...base, background: T.good, color: T.chalk }}>✓</div>;
  }
  if (state === "current") {
    return <div style={{ ...base, background: T.action, color: T.chalk, boxShadow: `0 0 0 4px ${T.action}26` }} />;
  }
  return <div style={{ ...base, border: `2px solid ${T.line}`, background: T.chalk }} />;
}

function Stepper({ label, value, unit, onDecrement, onIncrement, accent }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: T.sub, textTransform: "uppercase", letterSpacing: 0.4, textAlign: "center", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <button
          onClick={onDecrement}
          aria-label={`Decrease ${label.toLowerCase()}`}
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 12,
            border: `1.5px solid ${T.line}`,
            background: T.chalk,
            fontSize: 22,
            fontWeight: 700,
            color: T.ink,
            cursor: "pointer",
          }}
        >
          −
        </button>
        <div style={{ minWidth: 56, textAlign: "center" }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 30, color: accent }}>{value}</span>
          {unit && <span style={{ fontSize: 14, color: T.sub, marginLeft: 4 }}>{unit}</span>}
        </div>
        <button
          onClick={onIncrement}
          aria-label={`Increase ${label.toLowerCase()}`}
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 12,
            border: `1.5px solid ${T.line}`,
            background: T.chalk,
            fontSize: 22,
            fontWeight: 700,
            color: T.ink,
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function SetControls({
  totalSets,
  currentSetIndex,
  setStates,
  targetLabel,
  previousLabel,
  weight,
  reps,
  showWeight,
  onWeightDelta,
  onRepsDelta,
  color,
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: T.ink }}>
          SET {currentSetIndex + 1} OF {totalSets}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {setStates.map((state, index) => (
            <SetPip key={index} state={state} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, background: T.bg, borderRadius: 10, padding: "8px 10px" }}>
          <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", letterSpacing: 0.4 }}>Previous</div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, marginTop: 2 }}>{previousLabel}</div>
        </div>
        <div style={{ flex: 1, background: T.bg, borderRadius: 10, padding: "8px 10px" }}>
          <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", letterSpacing: 0.4 }}>Target</div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, marginTop: 2 }}>{targetLabel}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
        {showWeight && <Stepper label="Weight" value={weight} unit="kg" onDecrement={() => onWeightDelta(-1)} onIncrement={() => onWeightDelta(1)} accent={color} />}
        <Stepper label="Reps" value={reps} unit="" onDecrement={() => onRepsDelta(-1)} onIncrement={() => onRepsDelta(1)} accent={color} />
      </div>
    </div>
  );
}
