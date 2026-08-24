import { T, weekKg } from "../theme";
import { WARMUP, COOLDOWN } from "../workoutContent";
import WorkoutOverviewCard from "./WorkoutOverviewCard";
import ChecklistCard from "./ChecklistCard";
import ExerciseListItem from "./ExerciseListItem";
import SupersetLineupCard from "./SupersetLineupCard";
import CollapsibleSection from "./CollapsibleSection";
import DailyFuelNotes from "./DailyFuelNotes";
import { buildBlocks, extractDuration } from "../utils/workout";

export default function IdleWorkoutScreen({ day, week, checks, onToggleCheck, open, onToggleOpen, weekNote, totalSets }) {
  const color = day.color;
  const blocks = buildBlocks(day);
  const kgFor = (exercise) => weekKg(exercise, week);

  return (
    <div>
      <WorkoutOverviewCard duration={extractDuration(day.focus)} exerciseCount={day.exercises.length} setCount={totalSets} />

      <ChecklistCard
        title="Warm-up"
        color={color}
        items={WARMUP}
        isChecked={(index) => !!checks[`wu-${index}`]}
        onToggleCheck={(index) => onToggleCheck("wu", index)}
        open={!!open.wu}
        onToggleSection={() => onToggleOpen("wu")}
        footnote="Right shoulder rule: dull burn is fine, sharp pain = stop the set."
      />

      <div style={{ margin: "18px 2px 10px" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, textTransform: "uppercase", letterSpacing: 0.6 }}>
          Today's lineup
        </div>
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: "2px 14px", marginBottom: 12 }}>
        {blocks.map((block) =>
          block.isSuperset ? (
            <SupersetLineupCard key={block.key} block={block} kgFor={kgFor} color={color} />
          ) : (
            <ExerciseListItem key={block.key} exercise={block.members[0].exercise} kg={kgFor(block.members[0].exercise)} color={color} />
          )
        )}
      </div>

      <CollapsibleSection title="AI Coach" color={color} preview={weekNote} open={!!open.coach} onToggle={() => onToggleOpen("coach")}>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{weekNote}</div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Daily notes"
        color={color}
        preview="Nutrition & meal timing for today"
        open={!!open.notes}
        onToggle={() => onToggleOpen("notes")}
      >
        <DailyFuelNotes />
      </CollapsibleSection>

      <ChecklistCard
        title="Cool-down"
        color={color}
        items={COOLDOWN}
        isChecked={(index) => !!checks[`cd-${index}`]}
        onToggleCheck={(index) => onToggleCheck("cd", index)}
        open={!!open.cd}
        onToggleSection={() => onToggleOpen("cd")}
      />
    </div>
  );
}
