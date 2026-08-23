import { T, weekKg } from "../theme";
import { countDoneSets, formatClock, parseSetReps } from "../utils/workout";
import CollapsibleSection from "./CollapsibleSection";
import DailyFuelNotes from "./DailyFuelNotes";

function Stat({ value, label }) {
  return (
    <div style={{ flex: "1 1 40%", textAlign: "center", padding: "10px 4px" }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 26 }}>{value}</div>
      <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
    </div>
  );
}

export default function WorkoutCompleteSummary({
  day,
  week,
  done,
  elapsedSeconds,
  volumeKg,
  weekNote,
  nextDay,
  open,
  onToggle,
  onGoToNextDay,
}) {
  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const doneSets = day.exercises.reduce((sum, ex, i) => sum + countDoneSets(ex, done, week, day.id, i), 0);

  return (
    <div>
      <div
        style={{
          background: T.ink,
          color: T.chalk,
          borderRadius: 18,
          padding: "22px 16px 10px",
          marginBottom: 14,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, lineHeight: 1 }}>🏆</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22, marginTop: 8 }}>Great job!</div>
        <div style={{ fontSize: 13.5, opacity: 0.75, marginTop: 2 }}>You crushed {day.label.toLowerCase()} day today.</div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 12, borderTop: "1px solid rgba(255,255,255,.14)" }}>
          <Stat value={formatClock(elapsedSeconds)} label="Total time" />
          <Stat value={`${doneSets}/${totalSets}`} label="Sets completed" />
          <Stat value={day.exercises.length} label="Exercises" />
          <Stat value={`${volumeKg.toLocaleString()} kg`} label="Total volume" />
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: "6px 14px", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 0 2px" }}>
          Exercise summary
        </div>
        {day.exercises.map((exercise, index) => {
          const doneCount = countDoneSets(exercise, done, week, day.id, index);
          const complete = doneCount === exercise.sets;
          const kg = weekKg(exercise, week);
          const lastReps = parseSetReps(exercise, Math.max(0, doneCount - 1));
          const repsLabel = /^\d+$/.test(lastReps) ? `${lastReps} reps` : lastReps;
          return (
            <div
              key={exercise.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderTop: index === 0 ? "none" : `1px solid ${T.line}`,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  background: complete ? T.good : T.line,
                  color: complete ? T.chalk : T.sub,
                }}
              >
                {complete ? "✓" : String(index + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>{exercise.name}</div>
                <div style={{ fontSize: 12.5, color: T.sub, marginTop: 1 }}>
                  {doneCount}/{exercise.sets} sets · {repsLabel}
                  {exercise.startKg > 0 ? ` @ ${kg} kg` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CollapsibleSection
        title="AI Coach summary"
        color={day.color}
        preview={weekNote}
        open={open.coach}
        onToggle={() => onToggle("coach")}
      >
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{weekNote}</div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Daily notes"
        color={day.color}
        preview="Nutrition & meal timing for today"
        open={open.notes}
        onToggle={() => onToggle("notes")}
      >
        <DailyFuelNotes />
      </CollapsibleSection>

      {nextDay && (
        <button
          onClick={onGoToNextDay}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: T.card,
            border: `1px solid ${T.line}`,
            borderRadius: 14,
            padding: "14px",
            marginBottom: 12,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Next workout</div>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: T.ink, marginTop: 2 }}>{nextDay.label} Day</div>
            <div style={{ fontSize: 12.5, color: T.sub }}>{nextDay.name}</div>
          </div>
          <div style={{ fontSize: 20, color: T.sub }}>›</div>
        </button>
      )}
    </div>
  );
}
