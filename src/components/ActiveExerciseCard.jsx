import { T } from "../theme";
import { Media } from "./Media";
import { GIFS } from "../gifMap";
import SetControls from "./SetControls";
import CollapsibleSection from "./CollapsibleSection";

export default function ActiveExerciseCard({
  index,
  exercise,
  color,
  setStates,
  currentSetIndex,
  weight,
  reps,
  onWeightDelta,
  onRepsDelta,
  previousLabel,
  targetLabel,
  techOpen,
  onToggleTech,
  coachOpen,
  onToggleCoach,
}) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: T.chalk,
            background: T.action,
            borderRadius: 7,
            minWidth: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div style={{ fontSize: 11, color: T.action, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
          Current Exercise
        </div>
      </div>

      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 23, textTransform: "uppercase", lineHeight: 1.15, color: T.ink }}>
        {exercise.series && (
          <span
            style={{
              background: exercise.ss ? color : T.sub,
              color: T.chalk,
              borderRadius: 5,
              padding: "1px 7px",
              fontSize: 13,
              marginRight: 7,
              verticalAlign: "middle",
            }}
          >
            {exercise.series}
          </span>
        )}
        {exercise.name}
      </div>

      <Media item={exercise} color={color} gifSrc={GIFS[exercise.name]} />

      <SetControls
        totalSets={exercise.sets}
        currentSetIndex={currentSetIndex}
        setStates={setStates}
        previousLabel={previousLabel}
        targetLabel={targetLabel}
        weight={weight}
        reps={reps}
        showWeight={exercise.startKg > 0}
        onWeightDelta={onWeightDelta}
        onRepsDelta={onRepsDelta}
        color={color}
      />

      <div style={{ marginTop: 14 }}>
        <CollapsibleSection title="Technique tips" color={color} open={techOpen} onToggle={onToggleTech}>
          <div style={{ fontSize: 14.5, lineHeight: 1.55 }}>
            <div>{exercise.desc}</div>
            <div style={{ marginTop: 6, color: T.sub }}>{exercise.machine}</div>
            <div style={{ color: T.sub }}>{exercise.alt}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 6, padding: "3px 9px", fontSize: 12.5 }}>
                ▶ YouTube: “{exercise.yt}”
              </span>
            </div>
            {exercise.tech && (
              <div style={{ marginTop: 10, background: T.ink, color: T.chalk, borderRadius: 8, padding: "9px 11px", fontSize: 13, lineHeight: 1.5 }}>
                {exercise.tech}
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="AI Coach note" color={color} open={coachOpen} onToggle={onToggleCoach}>
          <div style={{ fontSize: 14.5, lineHeight: 1.55, color: T.ink, fontWeight: 500 }}>{exercise.note}</div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
