export const T = {
  bg: "#ECEDEE",
  ink: "#22262B",
  sub: "#6B7178",
  card: "#FBFAF7",
  line: "#D8DADC",
  chalk: "#FFFFFF",
};

export const KG2LB = 2.20462;

export const lb = (kg) => Math.round(kg * KG2LB);

export const weekKg = (exercise, week) => {
  if (exercise.startKg === 0) return 0;
  const value = exercise.startKg + exercise.incKg * (week - 1);
  return Math.round(value * 2) / 2;
};
