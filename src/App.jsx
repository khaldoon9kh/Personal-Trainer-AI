import { useEffect, useMemo, useState } from "react";
import { DAYS } from "./data/days";
import { COOLDOWN, WARMUP, WEEK_NOTES } from "./workoutContent";
import { lb, T, weekKg } from "./theme";
import Plate from "./components/Plate";
import Section from "./components/Section";
import CheckLine from "./components/CheckLine";
import { Media, MiniMedia } from "./components/Media";
import { GIFS } from "./gifMap";

const STORAGE_KEY = "personal-trainer-ai-workout-state-v1";

const TIMER_OPTIONS = [
  { label: "30s", seconds: 30 },
  { label: "60s", seconds: 60 },
  { label: "2:00", seconds: 120 },
];

function RestTimer() {
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) {
      if (remaining <= 0) setRunning(false);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, remaining]);

  const start = (seconds) => {
    setRemaining(seconds);
    setRunning(true);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const active = remaining > 0;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: T.ink,
        color: T.chalk,
        borderTop: `1px solid ${T.line}`,
        boxShadow: "0 -4px 16px rgba(34,38,43,.16)",
        padding: "8px max(16px, env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          aria-live="polite"
          style={{
            minWidth: 58,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: active ? "#F2C14E" : T.chalk,
          }}
        >
          {display}
        </div>
        <div style={{ fontSize: 11, opacity: 0.7, marginRight: "auto" }}>REST</div>
        {TIMER_OPTIONS.map((option) => (
          <button
            key={option.seconds}
            onClick={() => start(option.seconds)}
            aria-label={`Start ${option.label} rest timer`}
            style={{
              border: "1px solid rgba(255,255,255,.28)",
              borderRadius: 7,
              background: "rgba(255,255,255,.1)",
              color: T.chalk,
              padding: "7px 9px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        ))}
        <button
          onClick={() => setRunning((value) => !value)}
          disabled={!active}
          aria-label={running ? "Pause rest timer" : "Resume rest timer"}
          style={{
            border: "none",
            borderRadius: 7,
            background: active ? T.chalk : "rgba(255,255,255,.18)",
            color: active ? T.ink : "rgba(255,255,255,.45)",
            padding: "7px 9px",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: active ? "pointer" : "default",
          }}
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button
          onClick={() => {
            setRemaining(0);
            setRunning(false);
          }}
          disabled={!active}
          aria-label="Reset rest timer"
          style={{
            border: "none",
            background: "transparent",
            color: active ? T.chalk : "rgba(255,255,255,.45)",
            padding: "7px 2px",
            fontSize: 12,
            cursor: active ? "pointer" : "default",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [week, setWeek] = useState(1);
  const [activeDayId, setActiveDayId] = useState("PUSH");
  const [done, setDone] = useState({});
  const [checks, setChecks] = useState({});
  const [open, setOpen] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw);

      if ([1, 2, 3].includes(parsed.week)) {
        setWeek(parsed.week);
      }

      if (typeof parsed.activeDayId === "string" && DAYS.some((entry) => entry.id === parsed.activeDayId)) {
        setActiveDayId(parsed.activeDayId);
      }

      if (parsed.done && typeof parsed.done === "object") {
        setDone(parsed.done);
      }

      if (parsed.checks && typeof parsed.checks === "object") {
        setChecks(parsed.checks);
      }
    } catch {
      // Ignore invalid stored data and keep defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const payload = {
      week,
      activeDayId,
      done,
      checks,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, week, activeDayId, done, checks]);

  const day = useMemo(() => DAYS.find((entry) => entry.id === activeDayId) ?? DAYS[0], [activeDayId]);
  const c = day.color;

  const toggleSet = (exerciseIndex, setIndex) => {
    const key = `${week}-${day.id}-${exerciseIndex}-${setIndex}`;
    setDone((state) => ({ ...state, [key]: !state[key] }));
  };

  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const doneSets = day.exercises.reduce((sum, ex, exerciseIndex) => {
    let n = 0;
    for (let setIndex = 0; setIndex < ex.sets; setIndex += 1) {
      if (done[`${week}-${day.id}-${exerciseIndex}-${setIndex}`]) n += 1;
    }
    return sum + n;
  }, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.ink,
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        paddingBottom: 104,
      }}
    >
      <div style={{ padding: "20px 16px 12px", maxWidth: 560, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 1,
            textTransform: "uppercase",
            lineHeight: 1,
            color: c,
          }}
        >
          {day.label} DAY
        </div>
        <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>
          {day.name} · {day.focus}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {DAYS.map((entry) => {
            const selected = entry.id === day.id;
            return (
              <button
                key={entry.id}
                onClick={() => setActiveDayId(entry.id)}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  borderRadius: 8,
                  border: `2px solid ${selected ? c : T.line}`,
                  background: selected ? c : T.chalk,
                  color: selected ? T.chalk : T.ink,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {entry.label[0] + entry.label.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[1, 2, 3].map((wk) => (
            <button
              key={wk}
              onClick={() => setWeek(wk)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 8,
                border: `2px solid ${week === wk ? T.ink : T.line}`,
                background: week === wk ? T.ink : T.chalk,
                color: week === wk ? T.chalk : T.ink,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              WK {wk}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12.5, color: T.sub, marginTop: 8, lineHeight: 1.45 }}>{WEEK_NOTES[week - 1]}</div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "6px 2px 10px" }}>
          <div style={{ fontSize: 13, color: T.sub }}>
            {day.focus} · {day.schedule}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: c }}>
            {doneSets}/{totalSets} sets
          </div>
        </div>

        <div style={{ background: T.ink, color: T.chalk, borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              Today's lineup
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>read this BEFORE you leave home</div>
          </div>

          <div style={{ marginTop: 10 }}>
            {day.exercises.map((exercise, index) => {
              const kg = weekKg(exercise, week);
              const spot = exercise.machine.replace("Look for: ", "").split(" (")[0];
              return (
                <div
                  key={exercise.name}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "baseline",
                    padding: "5px 0",
                    borderBottom: index < day.exercises.length - 1 ? "1px solid rgba(255,255,255,.12)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: c,
                      minWidth: 18,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                      <span style={{ color: c, marginRight: 5 }}>{exercise.series}</span>
                      {exercise.name}
                      {exercise.ss && <span style={{ color: c, fontSize: 11, marginLeft: 6 }}>superset</span>}
                    </div>
                    <div style={{ fontSize: 11.5, opacity: 0.7 }}>{spot}</div>
                  </div>
                  <div style={{ fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}>
                    {exercise.sets}×{exercise.reps}
                    {exercise.startKg > 0 && (
                      <div style={{ opacity: 0.8 }}>
                        {kg} kg
                        {exercise.perHand ? "/hand" : ""}
                        {exercise.incKg < 0 ? " assist" : ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.6, opacity: 0.85, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 8 }}>
            <b>Cycle:</b> Push → Pull → REST → Legs → REST → repeat (≈4 sessions/week).<br />
            <b>B1+B2, C1+C2… = supersets:</b> one set of each back-to-back, then rest 90 s.<br />
            <b>Tempo 4/0/1/0</b> = 4 s lowering · 0 pause · 1 s lifting · 0 pause at top.<br />
            <b>Watch at home (~8 min), not at the gym</b> — YouTube each phrase, one video is enough:{" "}
            {[...new Set(day.exercises.map((entry) => entry.yt))].map((yt, index, all) => (
              <span key={yt}>
                “{yt}”{index < all.length - 1 ? " · " : ""}
              </span>
            ))}
          </div>
        </div>

        <Section title="Warm-up · 10 min" color={c}>
          {WARMUP.map((item, index) => (
            <div key={item.text}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <CheckLine
                    text={item.text}
                    color={c}
                    done={!!checks[`${week}-${day.id}-wu-${index}`]}
                    onClick={() =>
                      setChecks((state) => ({
                        ...state,
                        [`${week}-${day.id}-wu-${index}`]: !state[`${week}-${day.id}-wu-${index}`],
                      }))
                    }
                  />
                </div>
                {item.icon && (
                  <button
                    onClick={() => setOpen((state) => ({ ...state, [`wu-${index}`]: !state[`wu-${index}`] }))}
                    style={{
                      border: `1.5px solid ${T.line}`,
                      background: T.chalk,
                      borderRadius: 8,
                      padding: "3px 9px",
                      fontSize: 11.5,
                      cursor: "pointer",
                      color: T.ink,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {open[`wu-${index}`] ? "Hide" : "How?"}
                  </button>
                )}
              </div>

              {item.icon && open[`wu-${index}`] && (
                <div style={{ background: T.bg, borderRadius: 10, padding: "6px 10px", margin: "2px 0 8px 28px" }}>
                  <MiniMedia item={item} color={c} gifSrc={GIFS[item.text]} />
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 4 }}>
                    {item.desc}
                    <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>
                      {item.hold ? "hold this position" : "faded = start · solid = finish"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>
            Right shoulder rule: dull burn is fine, sharp pain = stop the set.
          </div>
        </Section>

        {day.exercises.map((exercise, exerciseIndex) => {
          const kg = weekKg(exercise, week);
          const isAssist = exercise.incKg < 0;
          const key = `${day.id}-${exerciseIndex}`;
          const expanded = !!open[key];

          return (
            <div
              key={exercise.name}
              style={{
                background: T.card,
                border: `1px solid ${T.line}`,
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 19,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      lineHeight: 1.1,
                    }}
                  >
                    {exercise.series && (
                      <span
                        style={{
                          background: exercise.ss ? c : T.sub,
                          color: T.chalk,
                          borderRadius: 5,
                          padding: "1px 6px",
                          fontSize: 12,
                          marginRight: 6,
                          verticalAlign: "middle",
                        }}
                      >
                        {exercise.series}
                      </span>
                    )}
                    {exercise.name}
                  </div>
                  <div style={{ fontSize: 13, color: T.sub, marginTop: 3 }}>
                    {exercise.sets} × {exercise.reps}
                    {exercise.startKg > 0 && (
                      <>
                        {" "}· <b style={{ color: T.ink }}>{kg} kg / {lb(kg)} lb{exercise.perHand ? " per hand" : ""}{isAssist ? " assist" : ""}</b>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setOpen((state) => ({ ...state, [key]: !expanded }))}
                  style={{
                    alignSelf: "flex-start",
                    border: `1.5px solid ${T.line}`,
                    background: T.chalk,
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: T.ink,
                    fontWeight: 600,
                  }}
                >
                  {expanded ? "Hide" : "How?"}
                </button>
              </div>

              {expanded && (
                <div style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.5, borderTop: `1px dashed ${T.line}`, paddingTop: 10 }}>
                  <Media item={exercise} color={c} gifSrc={GIFS[exercise.name]} />
                  <div>{exercise.desc}</div>
                  <div style={{ marginTop: 6, color: T.sub }}>{exercise.machine}</div>
                  <div style={{ color: T.sub }}>{exercise.alt}</div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>
                      ▶ YouTube: “{exercise.yt}”
                    </span>
                  </div>
                  {exercise.tech && (
                    <div style={{ marginTop: 8, background: T.ink, color: T.chalk, borderRadius: 8, padding: "6px 10px", fontSize: 12.5, lineHeight: 1.45 }}>
                      <b style={{ color: c }}>TECHNIQUE · </b>
                      {exercise.tech}
                    </div>
                  )}
                  <div style={{ marginTop: 8, fontSize: 12.5, color: c, fontWeight: 600 }}>{exercise.note}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: T.sub }}>
                    Self-test: last 2 reps hard, form clean. Too easy → {isAssist ? "lower the assist" : "add weight"} next session; form breaks → go lighter.
                  </div>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <div style={{ height: 5, flexShrink: 0, width: 18, background: T.line, borderRadius: 3 }} />
                {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                  <Plate
                    key={`${exercise.name}-${setIndex}`}
                    color={c}
                    done={!!done[`${week}-${day.id}-${exerciseIndex}-${setIndex}`]}
                    onClick={() => toggleSet(exerciseIndex, setIndex)}
                    label={`${exercise.name} set ${setIndex + 1}`}
                  />
                ))}
                <div style={{ height: 5, flex: 1, background: T.line, borderRadius: 3 }} />
                <span style={{ fontSize: 11, color: T.sub, whiteSpace: "nowrap" }}>tap = set done</span>
              </div>
            </div>
          );
        })}

        <Section title="Cool-down · 5 min" color={c}>
          {COOLDOWN.map((item, index) => (
            <div key={item.text}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <CheckLine
                    text={item.text}
                    color={c}
                    done={!!checks[`${week}-${day.id}-cd-${index}`]}
                    onClick={() =>
                      setChecks((state) => ({
                        ...state,
                        [`${week}-${day.id}-cd-${index}`]: !state[`${week}-${day.id}-cd-${index}`],
                      }))
                    }
                  />
                </div>
                {item.icon && (
                  <button
                    onClick={() => setOpen((state) => ({ ...state, [`cd-${index}`]: !state[`cd-${index}`] }))}
                    style={{
                      border: `1.5px solid ${T.line}`,
                      background: T.chalk,
                      borderRadius: 8,
                      padding: "3px 9px",
                      fontSize: 11.5,
                      cursor: "pointer",
                      color: T.ink,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {open[`cd-${index}`] ? "Hide" : "How?"}
                  </button>
                )}
              </div>

              {item.icon && open[`cd-${index}`] && (
                <div style={{ background: T.bg, borderRadius: 10, padding: "6px 10px", margin: "2px 0 8px 28px" }}>
                  <MiniMedia item={item} color={c} gifSrc={GIFS[item.text]} />
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 4 }}>
                    {item.desc}
                    <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>
                      {item.hold ? "hold this position" : "faded = start · solid = finish"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Section>

        <Section title="Daily fuel · 99 kg · fat loss + muscle" color={c}>
          <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
            <b>180 g protein every day</b> (2 scoops = 50 g, ~130 g from food).<br />
            <b>Training days ~2,700 kcal · Rest days ~2,300 kcal</b> — 4 sessions/week is more work than before, so training-day carbs go up.<br />
            <b>8:30</b> meds + 500 ml water<br />
            <b>9:30–10</b> Shake #1: scoop + banana + 2 kiwis<br />
            <b>10:30–11:45</b> train · sip ~750 ml water<br />
            <b>~12:15</b> Shake #2 within 60 min + carbs: rice/potato + chicken or fish<br />
            <b>15:30 alarm</b> Greek yogurt or cottage cheese<br />
            <b>Evening</b> dinner: protein + veg first, carbs after<br />
            <b>Bed</b> yogurt or cottage cheese (~20 g)<br />
            Leg days are the hungriest — put the biggest dinner there. Pace: ~0.5 kg/week down.
          </div>
        </Section>
      </div>
      <RestTimer />
    </div>
  );
}
