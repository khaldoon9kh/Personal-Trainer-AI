import { DAYS } from "../data/days";
import { weekKg } from "../theme";

// Exercises like the deadlift encode a different rep target per set as
// "6·6·6·10·15". Others use one value ("20"), a qualifier ("to failure"),
// or a per-side note ("15 / side") that applies to every set.
export function parseSetReps(exercise, setIndex) {
  const parts = exercise.reps.split("·");
  if (parts.length === exercise.sets) return parts[setIndex];
  return exercise.reps;
}

export function parseRepsToInt(reps) {
  const match = String(reps).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Pulls "~60–70 min" (or similar) out of the free-text focus string so the
// overview card can show a duration without a dedicated data field.
export function extractDuration(focusText) {
  const match = focusText.match(/~[\d–—-]+\s*min/);
  return match ? match[0].replace("~", "") : focusText;
}

export function isSetDone(done, week, dayId, exerciseIndex, setIndex) {
  return !!done[`${week}-${dayId}-${exerciseIndex}-${setIndex}`];
}

export function countDoneSets(exercise, done, week, dayId, exerciseIndex) {
  let count = 0;
  for (let setIndex = 0; setIndex < exercise.sets; setIndex += 1) {
    if (isSetDone(done, week, dayId, exerciseIndex, setIndex)) count += 1;
  }
  return count;
}

// A "block" groups exercises that share the same superset id — the `ss`
// field already present on every exercise in src/data/*.js (e.g. "B" for
// both the B1 and B2 entries). A block with one member behaves like a plain
// exercise; a block with 2+ members is a superset worked as member 1,
// member 2, ... back to member 1 for the next round. No new data fields are
// needed — this just reads the grouping metadata that was already there.
export function buildBlocks(day) {
  const blocks = [];
  const blockByKey = new Map();

  day.exercises.forEach((exercise, flatIndex) => {
    const key = exercise.ss ?? `standalone-${flatIndex}`;
    let block = blockByKey.get(key);
    if (!block) {
      block = { key, label: exercise.ss ?? exercise.series, isSuperset: !!exercise.ss, members: [] };
      blockByKey.set(key, block);
      blocks.push(block);
    }
    block.members.push({ exercise, flatIndex });
  });

  blocks.forEach((block) => {
    block.rounds = Math.max(...block.members.map((member) => member.exercise.sets));
  });

  return blocks;
}

function stepPosition(blocks, pos) {
  const block = blocks[pos.blockIndex];
  if (pos.memberIndex + 1 < block.members.length) {
    return { blockIndex: pos.blockIndex, round: pos.round, memberIndex: pos.memberIndex + 1 };
  }
  if (pos.round + 1 < block.rounds) {
    return { blockIndex: pos.blockIndex, round: pos.round + 1, memberIndex: 0 };
  }
  if (pos.blockIndex + 1 < blocks.length) {
    return { blockIndex: pos.blockIndex + 1, round: 0, memberIndex: 0 };
  }
  return null;
}

function resolvePosition(blocks, pos) {
  if (!pos) return null;
  const block = blocks[pos.blockIndex];
  const member = block.members[pos.memberIndex];
  return { blockIndex: pos.blockIndex, round: pos.round, memberIndex: pos.memberIndex, block, member, exercise: member.exercise, flatIndex: member.flatIndex };
}

// The current step in the workout: which block, which round within it, and
// (inside a superset) which member is up next. For a standalone exercise
// `round` doubles as the plain set index and memberIndex is always 0, so
// the same position shape works for both cases.
export function findBlockPosition(day, done, week) {
  const blocks = buildBlocks(day);
  let pos = { blockIndex: 0, round: 0, memberIndex: 0 };
  while (pos) {
    const block = blocks[pos.blockIndex];
    const member = block.members[pos.memberIndex];
    if (pos.round < member.exercise.sets && !isSetDone(done, week, day.id, member.flatIndex, pos.round)) {
      return resolvePosition(blocks, pos);
    }
    pos = stepPosition(blocks, pos);
  }
  return null;
}

// Structural "what comes right after this slot" — used only for the Next
// Up preview label. It doesn't consult `done`, so it's not a substitute for
// findBlockPosition when resuming progress.
export function peekNextPosition(day, pos) {
  const blocks = buildBlocks(day);
  return resolvePosition(blocks, stepPosition(blocks, pos));
}

export function isBlockFullyDone(block, done, week, dayId) {
  return block.members.every((member) =>
    Array.from({ length: member.exercise.sets }).every((_, round) => isSetDone(done, week, dayId, member.flatIndex, round))
  );
}

// Bodyweight movements (startKg === 0) have no meaningful load, so they're
// left out of the volume total rather than guessed at.
export function computeVolume(day, week, done, logs) {
  let total = 0;
  day.exercises.forEach((exercise, exerciseIndex) => {
    if (exercise.startKg <= 0) return;
    for (let setIndex = 0; setIndex < exercise.sets; setIndex += 1) {
      if (!isSetDone(done, week, day.id, exerciseIndex, setIndex)) continue;
      const key = `${week}-${day.id}-${exerciseIndex}-${setIndex}`;
      const log = logs[key];
      const weight = log?.weight ?? weekKg(exercise, week);
      const reps = log?.reps ?? parseRepsToInt(parseSetReps(exercise, setIndex));
      const hands = exercise.perHand ? 2 : 1;
      total += weight * reps * hands;
    }
  });
  return Math.round(total);
}

export function getNextDay(dayId) {
  const index = DAYS.findIndex((entry) => entry.id === dayId);
  if (index === -1) return DAYS[0];
  return DAYS[(index + 1) % DAYS.length];
}
