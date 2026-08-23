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

// First exercise/set that isn't marked done yet — where a session should
// resume after a refresh or a re-entered day.
export function findFirstIncomplete(day, done, week) {
  for (let exerciseIndex = 0; exerciseIndex < day.exercises.length; exerciseIndex += 1) {
    const exercise = day.exercises[exerciseIndex];
    for (let setIndex = 0; setIndex < exercise.sets; setIndex += 1) {
      if (!isSetDone(done, week, day.id, exerciseIndex, setIndex)) {
        return { exerciseIndex, setIndex };
      }
    }
  }
  return null;
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
