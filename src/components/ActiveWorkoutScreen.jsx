import { weekKg } from "../theme";
import { countDoneSets, isSetDone, parseRepsToInt, parseSetReps } from "../utils/workout";
import ActiveExerciseCard from "./ActiveExerciseCard";
import NextUpCard from "./NextUpCard";
import WorkoutProgress from "./WorkoutProgress";

export default function ActiveWorkoutScreen({ day, week, pos, done, logs, open, onToggleOpen, onWeightDelta, onRepsDelta }) {
  const color = day.color;
  const exercise = day.exercises[pos.exerciseIndex];
  const kg = weekKg(exercise, week);
  const key = `${week}-${day.id}-${pos.exerciseIndex}-${pos.setIndex}`;
  const log = logs[key];
  const targetReps = parseSetReps(exercise, pos.setIndex);
  const weight = log?.weight ?? kg;
  const reps = log?.reps ?? parseRepsToInt(targetReps);

  const prevKey = `${week}-${day.id}-${pos.exerciseIndex}-${pos.setIndex - 1}`;
  const prevLog = pos.setIndex > 0 ? logs[prevKey] : null;
  const previousLabel = prevLog
    ? `${prevLog.weight} kg × ${prevLog.reps}`
    : pos.setIndex > 0
      ? `${kg} kg × ${parseSetReps(exercise, pos.setIndex - 1)}`
      : "—";
  const targetLabel = exercise.startKg > 0 ? `${kg} kg × ${targetReps}` : `${targetReps} reps`;

  const setStates = Array.from({ length: exercise.sets }, (_, setIndex) => {
    if (isSetDone(done, week, day.id, pos.exerciseIndex, setIndex)) return "done";
    if (setIndex === pos.setIndex) return "current";
    return "upcoming";
  });

  const nextExercise = day.exercises[pos.exerciseIndex + 1] ?? null;

  const statuses = day.exercises.map((_, index) => {
    if (index === pos.exerciseIndex) return "current";
    return index < pos.exerciseIndex ? "done" : "upcoming";
  });
  const doneCounts = day.exercises.map((ex, index) => countDoneSets(ex, done, week, day.id, index));

  return (
    <div>
      <ActiveExerciseCard
        index={pos.exerciseIndex}
        exercise={exercise}
        color={color}
        setStates={setStates}
        currentSetIndex={pos.setIndex}
        weight={weight}
        reps={reps}
        onWeightDelta={onWeightDelta}
        onRepsDelta={onRepsDelta}
        previousLabel={previousLabel}
        targetLabel={targetLabel}
        techOpen={!!open[`tech-${pos.exerciseIndex}`]}
        onToggleTech={() => onToggleOpen(`tech-${pos.exerciseIndex}`)}
        coachOpen={!!open[`note-${pos.exerciseIndex}`]}
        onToggleCoach={() => onToggleOpen(`note-${pos.exerciseIndex}`)}
      />

      <NextUpCard exercise={nextExercise} kg={nextExercise ? weekKg(nextExercise, week) : null} />

      <WorkoutProgress
        exercises={day.exercises}
        statuses={statuses}
        doneCounts={doneCounts}
        currentSetIndex={pos.setIndex}
        color={color}
        kgFor={(ex) => weekKg(ex, week)}
      />
    </div>
  );
}
