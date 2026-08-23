export const T = {
  bg: "#ECEDEE",
  ink: "#22262B",
  sub: "#6B7178",
  card: "#FBFAF7",
  line: "#D8DADC",
  chalk: "#FFFFFF",
  // Universal primary-action color (Start Workout / Complete Set / Finish,
  // current-set markers) — separate from `day.color`, which keeps
  // color-coding each day (push/pull/legs) the way the app already did.
  action: "#D22730",
  actionDark: "#A81E24",
  good: "#1E8A4C",
  goodBg: "#E4F3EA",
};

export const KG2LB = 2.20462;

export const lb = (kg) => Math.round(kg * KG2LB);

export const weekKg = (exercise, week) => {
  if (exercise.startKg === 0) return 0;
  const value = exercise.startKg + exercise.incKg * (week - 1);
  return Math.round(value * 2) / 2;
};
