import { T, weekKg } from "../theme";
import { WARMUP, COOLDOWN } from "../workoutContent";
import WorkoutOverviewCard from "./WorkoutOverviewCard";
import ChecklistCard from "./ChecklistCard";
import ExerciseListItem from "./ExerciseListItem";
import CollapsibleSection from "./CollapsibleSection";
import DailyFuelNotes from "./DailyFuelNotes";
import { extractDuration } from "../utils/workout";

export default function IdleWorkoutScreen({ day, week, checks, onToggleCheck, open, onToggleOpen, weekNote, totalSets }) {
  const color = day.color;

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
        {day.exercises.map((exercise, index) => (
          <ExerciseListItem key={exercise.name} index={index} exercise={exercise} kg={weekKg(exercise, week)} color={color} />
        ))}
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
