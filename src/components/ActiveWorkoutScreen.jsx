import { weekKg } from "../theme";
import { buildBlocks, isSetDone, parseRepsToInt, parseSetReps, peekNextPosition } from "../utils/workout";
import ActiveExerciseCard from "./ActiveExerciseCard";
import ActiveSupersetCard from "./ActiveSupersetCard";
import NextUpCard from "./NextUpCard";
import WorkoutProgress from "./WorkoutProgress";

function memberFields(day, week, logs, member, round) {
  const { exercise, flatIndex } = member;
  const kg = weekKg(exercise, week);
  const key = `${week}-${day.id}-${flatIndex}-${round}`;
  const log = logs[key];
  const targetReps = parseSetReps(exercise, round);
  const weight = log?.weight ?? kg;
  const reps = log?.reps ?? parseRepsToInt(targetReps);

  const prevKey = `${week}-${day.id}-${flatIndex}-${round - 1}`;
  const prevLog = round > 0 ? logs[prevKey] : null;
  const previousLabel = prevLog
    ? `${prevLog.weight} kg × ${prevLog.reps}`
    : round > 0
      ? `${kg} kg × ${parseSetReps(exercise, round - 1)}`
      : "—";
  const targetLabel = exercise.startKg > 0 ? `${kg} kg × ${targetReps}` : `${targetReps} reps`;

  return { weight, reps, previousLabel, targetLabel };
}

export default function ActiveWorkoutScreen({ day, week, pos, done, logs, open, onToggleOpen, onWeightDelta, onRepsDelta }) {
  const color = day.color;
  const blocks = buildBlocks(day);
  const block = pos.block;

  // Round pips are block-level: a round only counts as "done" once every
  // member of the superset has completed it (both B1 and B2), not just one.
  const roundStates = Array.from({ length: block.rounds }, (_, round) => {
    const allMembersDone = block.members.every(
      (member) => round < member.exercise.sets && isSetDone(done, week, day.id, member.flatIndex, round)
    );
    if (allMembersDone) return "done";
    if (round === pos.round) return "current";
    return "upcoming";
  });

  let body;
  if (block.isSuperset) {
    const memberData = block.members.map((member, memberIndex) => {
      const fields = memberFields(day, week, logs, member, pos.round);
      const isActing = memberIndex === pos.memberIndex;
      return {
        ...fields,
        onWeightDelta: isActing ? onWeightDelta : undefined,
        onRepsDelta: isActing ? onRepsDelta : undefined,
        techOpen: !!open[`tech-${member.flatIndex}`],
        onToggleTech: () => onToggleOpen(`tech-${member.flatIndex}`),
        coachOpen: !!open[`note-${member.flatIndex}`],
        onToggleCoach: () => onToggleOpen(`note-${member.flatIndex}`),
      };
    });

    body = (
      <ActiveSupersetCard
        blockIndex={pos.blockIndex}
        blockLabel={block.label}
        members={block.members}
        round={pos.round}
        rounds={block.rounds}
        roundStates={roundStates}
        currentMemberIndex={pos.memberIndex}
        color={color}
        memberData={memberData}
      />
    );
  } else {
    const member = block.members[0];
    const fields = memberFields(day, week, logs, member, pos.round);
    body = (
      <ActiveExerciseCard
        index={pos.blockIndex}
        exercise={member.exercise}
        color={color}
        setStates={roundStates}
        currentSetIndex={pos.round}
        weight={fields.weight}
        reps={fields.reps}
        onWeightDelta={onWeightDelta}
        onRepsDelta={onRepsDelta}
        previousLabel={fields.previousLabel}
        targetLabel={fields.targetLabel}
        techOpen={!!open[`tech-${member.flatIndex}`]}
        onToggleTech={() => onToggleOpen(`tech-${member.flatIndex}`)}
        coachOpen={!!open[`note-${member.flatIndex}`]}
        onToggleCoach={() => onToggleOpen(`note-${member.flatIndex}`)}
      />
    );
  }

  const next = peekNextPosition(day, pos);
  const nextExercise = next ? next.exercise : null;
  const nextKg = nextExercise ? weekKg(nextExercise, week) : null;

  const blockStatuses = blocks.map((_, index) => {
    if (index === pos.blockIndex) return "current";
    return index < pos.blockIndex ? "done" : "upcoming";
  });

  return (
    <div>
      {body}
      <NextUpCard exercise={nextExercise} kg={nextKg} />
      <WorkoutProgress
        day={day}
        week={week}
        blocks={blocks}
        blockStatuses={blockStatuses}
        currentRound={pos.round}
        currentMemberIndex={pos.memberIndex}
        done={done}
        color={color}
      />
    </div>
  );
}
