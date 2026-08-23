import { useState } from "react";
import { T } from "../theme";
import ExerciseDetail from "./ExerciseDetail";

function StatusIcon({ status, index }) {
  const base = {
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  };
  if (status === "done") return <div style={{ ...base, background: T.good, color: T.chalk }}>✓</div>;
  if (status === "current") return <div style={{ ...base, background: T.action, color: T.chalk }}>{index + 1}</div>;
  return <div style={{ ...base, border: `2px solid ${T.line}`, color: T.sub }}>{index + 1}</div>;
}

export default function WorkoutProgress({ exercises, statuses, doneCounts, currentSetIndex, color, kgFor }) {
  const [expanded, setExpanded] = useState({});

  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: "6px 14px", marginBottom: 12 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 0 2px" }}>
        Workout progress
      </div>
      {exercises.map((exercise, index) => {
        const status = statuses[index];
        const doneCount = doneCounts[index];
        const isOpen = !!expanded[index];
        let trailing = `${exercise.sets} sets`;
        if (status === "done") trailing = `${doneCount}/${exercise.sets} sets`;
        else if (status === "current") trailing = `${currentSetIndex + 1} of ${exercise.sets}`;

        return (
          <div key={exercise.name} style={{ borderTop: index === 0 ? "none" : `1px solid ${T.line}` }}>
            <button
              onClick={() => setExpanded((state) => ({ ...state, [index]: !state[index] }))}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                padding: "10px 0",
                minHeight: 46,
              }}
            >
              <StatusIcon status={status} index={index} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: status === "current" ? 700 : 500,
                    color: status === "upcoming" ? T.sub : T.ink,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exercise.name}
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: T.sub, flexShrink: 0 }}>{trailing}</div>
            </button>
            {isOpen && (
              <div style={{ padding: "0 2px 14px 36px" }}>
                <ExerciseDetail exercise={exercise} color={color} kg={kgFor(exercise)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
