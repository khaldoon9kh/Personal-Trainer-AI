import { T, weekKg } from "../theme";
import { buildBlocks, countDoneSets, formatClock, isBlockFullyDone, parseSetReps } from "../utils/workout";
import CollapsibleSection from "./CollapsibleSection";
import DailyFuelNotes from "./DailyFuelNotes";

function repsLabelFor(exercise, doneCount) {
  const lastReps = parseSetReps(exercise, Math.max(0, doneCount - 1));
  return /^\d+$/.test(lastReps) ? `${lastReps} reps` : lastReps;
}

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
  const blocks = buildBlocks(day);
  const doneBlocks = blocks.filter((block) => isBlockFullyDone(block, done, week, day.id)).length;

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
          <Stat value={`${doneBlocks}/${blocks.length}`} label="Blocks completed" />
          <Stat value={`${doneSets}/${totalSets}`} label="Sets completed" />
          <Stat value={`${volumeKg.toLocaleString()} kg`} label="Total volume" />
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: "6px 14px", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 0 2px" }}>
          Exercise summary
        </div>
        {blocks.map((block, blockIndex) => {
          if (!block.isSuperset) {
            const { exercise, flatIndex } = block.members[0];
            const doneCount = countDoneSets(exercise, done, week, day.id, flatIndex);
            const complete = doneCount === exercise.sets;
            const kg = weekKg(exercise, week);
            return (
              <div
                key={block.key}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: blockIndex === 0 ? "none" : `1px solid ${T.line}` }}
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
                  {complete ? "✓" : exercise.series}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>{exercise.name}</div>
                  <div style={{ fontSize: 12.5, color: T.sub, marginTop: 1 }}>
                    {doneCount}/{exercise.sets} sets · {repsLabelFor(exercise, doneCount)}
                    {exercise.startKg > 0 ? ` @ ${kg} kg` : ""}
                  </div>
                </div>
              </div>
            );
          }

          const complete = isBlockFullyDone(block, done, week, day.id);
          const doneRounds = Array.from({ length: block.rounds }).filter((_, round) =>
            block.members.every((member) => round < member.exercise.sets && countDoneSets(member.exercise, done, week, day.id, member.flatIndex) > round)
          ).length;

          return (
            <div key={block.key} style={{ padding: "10px 0", borderTop: blockIndex === 0 ? "none" : `1px solid ${T.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  {complete ? "✓" : block.label}
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 700, color: T.ink }}>
                  Superset ({block.members.map((m) => m.exercise.series).join(" + ")})
                </div>
                <div style={{ fontSize: 12.5, color: T.sub, flexShrink: 0 }}>{doneRounds}/{block.rounds} rounds</div>
              </div>
              <div style={{ paddingLeft: 36, marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                {block.members.map((member) => {
                  const doneCount = countDoneSets(member.exercise, done, week, day.id, member.flatIndex);
                  const kg = weekKg(member.exercise, week);
                  return (
                    <div key={member.flatIndex} style={{ fontSize: 13, color: T.ink }}>
                      <b>{member.exercise.series}</b> {member.exercise.name}
                      <div style={{ fontSize: 12, color: T.sub }}>
                        {doneCount}/{member.exercise.sets} sets · {repsLabelFor(member.exercise, doneCount)}
                        {member.exercise.startKg > 0 ? ` @ ${kg} kg` : ""}
                      </div>
                    </div>
                  );
                })}
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
