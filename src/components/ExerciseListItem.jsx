import { useState } from "react";
import { T } from "../theme";
import ExerciseDetail from "./ExerciseDetail";

export default function ExerciseListItem({ index, exercise, kg, color }) {
  const [open, setOpen] = useState(false);
  const isAdded = exercise.series === "+";

  return (
    <div style={{ borderBottom: `1px solid ${T.line}` }}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          padding: "12px 2px",
          minHeight: 48,
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: T.chalk,
            background: isAdded ? T.sub : color,
            borderRadius: 7,
            minWidth: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>
            {exercise.name}
            {isAdded && (
              <span style={{ fontSize: 11, color: color, marginLeft: 6, fontWeight: 700, textTransform: "uppercase" }}>added</span>
            )}
          </div>
          <div style={{ fontSize: 13.5, color: T.sub, marginTop: 2 }}>
            {exercise.sets} × {parseReps(exercise.reps)}
            {exercise.startKg > 0 ? ` @ ${kg} kg${exercise.perHand ? "/hand" : ""}` : " · bodyweight"}
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: "0 2px 16px 42px" }}>
          <ExerciseDetail exercise={exercise} color={color} kg={kg} />
        </div>
      )}
    </div>
  );
}

function parseReps(reps) {
  const parts = reps.split("·");
  return parts.length > 1 ? parts.join("·") : reps;
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}>
      <path d="M3 6 L8 11 L13 6" stroke={T.sub} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
