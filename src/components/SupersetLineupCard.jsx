import { useState } from "react";
import { T } from "../theme";
import ExerciseDetail from "./ExerciseDetail";

function MemberRow({ member, kg, color, isLast }) {
  const [open, setOpen] = useState(false);
  const { exercise } = member;

  return (
    <div style={{ position: "relative", paddingLeft: 18 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 5,
          top: 0,
          bottom: isLast ? "50%" : 0,
          width: 2,
          background: color,
          opacity: 0.35,
        }}
      />
      <div
        aria-hidden
        style={{ position: "absolute", left: 1, top: 18, width: 10, height: 10, borderRadius: "50%", background: color }}
      />
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          padding: "10px 2px",
          minHeight: 44,
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: T.chalk,
            background: color,
            borderRadius: 6,
            padding: "2px 7px",
            flexShrink: 0,
          }}
        >
          {exercise.series}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>{exercise.name}</div>
          <div style={{ fontSize: 13, color: T.sub, marginTop: 1 }}>
            {exercise.sets} × {exercise.reps.split("·").join("·")}
            {exercise.startKg > 0 ? ` @ ${kg} kg${exercise.perHand ? "/hand" : ""}` : " · bodyweight"}
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: "0 2px 14px 34px" }}>
          <ExerciseDetail exercise={exercise} color={color} kg={kg} />
        </div>
      )}
    </div>
  );
}

export default function SupersetLineupCard({ block, kgFor, color }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 12px", margin: "10px 0" }}>
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        {block.label} · Superset · {block.rounds} rounds
      </div>
      {block.members.map((member, memberIndex) => (
        <MemberRow key={member.flatIndex} member={member} kg={kgFor(member.exercise)} color={color} isLast={memberIndex === block.members.length - 1} />
      ))}
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}>
      <path d="M3 6 L8 11 L13 6" stroke={T.sub} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
