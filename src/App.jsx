import { useEffect, useMemo, useState } from "react";
import { DAYS } from "./data/days";
import { WEEK_NOTES } from "./workoutContent";
import { T } from "./theme";
import WorkoutHeader from "./components/WorkoutHeader";
import IdleWorkoutScreen from "./components/IdleWorkoutScreen";
import ActiveWorkoutScreen from "./components/ActiveWorkoutScreen";
import WorkoutCompleteSummary from "./components/WorkoutCompleteSummary";
import RestTimer from "./components/RestTimer";
import StickyBar, { GhostButton, PrimaryButton } from "./components/StickyBar";
import { buildBlocks, computeVolume, findBlockPosition, findLastCompletedPosition, getNextDay, peekPrevPosition } from "./utils/workout";
import { playRestEndAlarm, primeAudio } from "./utils/sound";

const STORAGE_KEY = "personal-trainer-ai-workout-state-v1";
const REST_SECONDS_DEFAULT = 90;

export default function App() {
  const [week, setWeek] = useState(1);
  const [activeDayId, setActiveDayId] = useState("PUSH");
  const [done, setDone] = useState({});
  const [checks, setChecks] = useState({});
  const [logs, setLogs] = useState({});
  const [open, setOpen] = useState({});
  // session: { dayId, week, phase: 'active'|'complete', startedAt, finishedAt } | null
  const [session, setSession] = useState(null);
  // rest: { remaining, running, endAt }
  const [rest, setRest] = useState({ remaining: 0, running: false, endAt: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw);

      if ([1, 2, 3].includes(parsed.week)) setWeek(parsed.week);
      if (typeof parsed.activeDayId === "string" && DAYS.some((entry) => entry.id === parsed.activeDayId)) {
        setActiveDayId(parsed.activeDayId);
      }
      if (parsed.done && typeof parsed.done === "object") setDone(parsed.done);
      if (parsed.checks && typeof parsed.checks === "object") setChecks(parsed.checks);
      if (parsed.logs && typeof parsed.logs === "object") setLogs(parsed.logs);
      if (parsed.session && typeof parsed.session === "object") setSession(parsed.session);

      if (parsed.rest && typeof parsed.rest === "object") {
        const { remaining, running, endAt } = parsed.rest;
        if (running && endAt) {
          const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
          setRest(left > 0 ? { remaining: left, running: true, endAt } : { remaining: 0, running: false, endAt: null });
        } else if (typeof remaining === "number") {
          setRest({ remaining, running: false, endAt: null });
        }
      }
    } catch {
      // Ignore invalid stored data and keep defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = { week, activeDayId, done, checks, logs, session, rest };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, week, activeDayId, done, checks, logs, session, rest]);

  // Rest timer ticks off `endAt` (a timestamp) rather than counting down in
  // memory, so it stays correct across refreshes and background tabs. The
  // alarm fires exactly once, when this specific countdown reaches zero —
  // not on every render, and not when the user cancels it via undo.
  useEffect(() => {
    if (!rest.running || !rest.endAt) return undefined;
    const endAt = rest.endAt;
    const interval = window.setInterval(() => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      if (left <= 0) {
        window.clearInterval(interval);
        setRest({ remaining: 0, running: false, endAt: null });
        playRestEndAlarm();
      } else {
        setRest((state) => (state.endAt === endAt ? { ...state, remaining: left } : state));
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, [rest.running, rest.endAt]);

  const locked = session && session.phase !== "idle";
  const viewDayId = locked ? session.dayId : activeDayId;
  const viewWeek = locked ? session.week : week;
  const day = useMemo(() => DAYS.find((entry) => entry.id === viewDayId) ?? DAYS[0], [viewDayId]);

  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const blocks = useMemo(() => buildBlocks(day), [day]);
  const pos = useMemo(() => findBlockPosition(day, done, viewWeek), [day, done, viewWeek]);

  const toggleOpen = (key) => setOpen((state) => ({ ...state, [key]: !state[key] }));
  const toggleCheck = (section, index) => {
    const key = `${section}-${index}`;
    setChecks((state) => ({ ...state, [key]: !state[key] }));
  };

  const startRest = (seconds) => {
    primeAudio();
    setRest({ remaining: seconds, running: true, endAt: Date.now() + seconds * 1000 });
  };
  const adjustRest = (delta) => {
    setRest((state) => {
      if (state.running && state.endAt) {
        const newLeft = Math.max(0, Math.round((state.endAt - Date.now()) / 1000) + delta);
        return newLeft > 0 ? { remaining: newLeft, running: true, endAt: Date.now() + newLeft * 1000 } : { remaining: 0, running: false, endAt: null };
      }
      const newLeft = Math.max(0, state.remaining + delta);
      return { ...state, remaining: newLeft };
    });
  };
  const toggleRestRun = () => {
    setRest((state) => {
      if (state.remaining <= 0) return state;
      if (state.running) {
        const left = state.endAt ? Math.max(0, Math.round((state.endAt - Date.now()) / 1000)) : state.remaining;
        return { remaining: left, running: false, endAt: null };
      }
      return { remaining: state.remaining, running: true, endAt: Date.now() + state.remaining * 1000 };
    });
  };

  // Idle-screen primary CTA: matches the session to the currently browsed
  // day/week so switching tabs never shows another workout's Resume state.
  const matchesSession = session && session.dayId === activeDayId && session.week === week;
  const browsedPos = useMemo(() => {
    const browsedDay = DAYS.find((entry) => entry.id === activeDayId) ?? DAYS[0];
    return findBlockPosition(browsedDay, done, week);
  }, [activeDayId, week, done]);

  let ctaLabel = "Start Workout";
  if (matchesSession && session.phase === "active") ctaLabel = "Resume Workout";
  else if (matchesSession && session.phase === "complete") ctaLabel = "View Summary";
  else if (!browsedPos) ctaLabel = "View Summary";

  const handlePrimaryCta = () => {
    if (ctaLabel === "View Summary") {
      setSession({
        dayId: activeDayId,
        week,
        phase: "complete",
        startedAt: matchesSession ? session.startedAt : Date.now(),
        finishedAt: matchesSession ? session.finishedAt ?? Date.now() : Date.now(),
      });
      return;
    }
    setSession({
      dayId: activeDayId,
      week,
      phase: "active",
      startedAt: matchesSession ? session.startedAt : Date.now(),
      finishedAt: null,
    });
  };

  const handleBack = () => {
    if (!session) return;
    setActiveDayId(session.dayId);
    setWeek(session.week);
    setSession((state) => ({ ...state, phase: "idle" }));
  };

  const handleFinish = () => setSession(null);

  const handleGoToNextDay = () => {
    const nextDay = getNextDay(day.id);
    setActiveDayId(nextDay.id);
    setSession(null);
  };

  const handleWeightDelta = (delta) => {
    if (!pos) return;
    const key = `${viewWeek}-${day.id}-${pos.flatIndex}-${pos.round}`;
    const step = Math.abs(pos.exercise.incKg) || 1;
    setLogs((state) => {
      const current = state[key] ?? {};
      const base = current.weight ?? pos.exercise.startKg;
      return { ...state, [key]: { ...current, weight: Math.max(0, Math.round((base + delta * step) * 2) / 2) } };
    });
  };

  const handleRepsDelta = (delta) => {
    if (!pos) return;
    const key = `${viewWeek}-${day.id}-${pos.flatIndex}-${pos.round}`;
    setLogs((state) => {
      const current = state[key] ?? {};
      const base = current.reps ?? 0;
      return { ...state, [key]: { ...current, reps: Math.max(0, base + delta) } };
    });
  };

  // Completing a set/round advances to the next slot in the workout. Inside
  // a superset, finishing one member (B1) jumps straight to the next member
  // (B2) with no rest — only finishing the LAST member of a round (or a
  // standalone exercise's set) starts the between-round rest timer.
  const handleCompleteSet = () => {
    if (!pos) return;
    const key = `${viewWeek}-${day.id}-${pos.flatIndex}-${pos.round}`;
    const updatedDone = { ...done, [key]: true };
    setDone(updatedDone);

    const isLastMemberOfRound = pos.memberIndex === pos.block.members.length - 1;
    const next = findBlockPosition(day, updatedDone, viewWeek);

    if (!next) {
      setRest({ remaining: 0, running: false, endAt: null });
      setSession((state) => ({ ...state, phase: "complete", finishedAt: Date.now() }));
    } else if (!isLastMemberOfRound) {
      setRest({ remaining: 0, running: false, endAt: null });
    } else {
      startRest(REST_SECONDS_DEFAULT);
    }
  };

  const mode = !session || session.phase === "idle" ? "idle" : session.phase;

  // Lets a mis-tap on "Complete Set" be undone instead of forcing a refresh
  // or a localStorage wipe. Works from mid-workout (steps back to whatever
  // was just marked done) and from the complete screen (reopens the last
  // block so the workout goes back to active).
  const undoTarget =
    mode === "complete" ? findLastCompletedPosition(day, done, viewWeek) : mode === "active" && pos ? peekPrevPosition(day, pos) : null;

  const handleUndoLast = () => {
    if (!undoTarget) return;
    const key = `${viewWeek}-${day.id}-${undoTarget.flatIndex}-${undoTarget.round}`;
    setDone((state) => {
      const next = { ...state };
      delete next[key];
      return next;
    });
    setRest({ remaining: 0, running: false, endAt: null });
    if (mode === "complete") {
      setSession((state) => ({ ...state, phase: "active", finishedAt: null }));
    }
  };

  const undoLabel = undoTarget?.block.isSuperset ? `Undo last set (${undoTarget.exercise.series})` : "Undo last set";

  const weekNote = WEEK_NOTES[viewWeek - 1];
  const volumeKg = useMemo(() => computeVolume(day, viewWeek, done, logs), [day, viewWeek, done, logs]);
  const elapsedSeconds = session?.startedAt ? Math.max(0, Math.round(((session.finishedAt ?? Date.now()) - session.startedAt) / 1000)) : 0;

  const contentPaddingBottom = 130 + (mode === "active" && rest.remaining > 0 ? 80 : 0) + (undoTarget ? 48 : 0);

  const blockStatuses =
    mode === "active" && pos
      ? blocks.map((_, index) => (index === pos.blockIndex ? "current" : index < pos.blockIndex ? "done" : "upcoming"))
      : undefined;

  let completeLabel = "Complete Set";
  if (mode === "active" && pos && pos.block.isSuperset) {
    const isLastMemberOfRound = pos.memberIndex === pos.block.members.length - 1;
    completeLabel = isLastMemberOfRound ? `Complete ${pos.exercise.series} & Finish Round` : `Complete ${pos.exercise.series}`;
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <WorkoutHeader
        mode={mode}
        day={day}
        week={viewWeek}
        days={DAYS}
        onSelectDay={setActiveDayId}
        onSelectWeek={setWeek}
        onBack={handleBack}
        progressLabel={mode === "active" && pos ? `${pos.blockIndex + 1} / ${blocks.length} blocks` : undefined}
        blockStatuses={blockStatuses}
      />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: `0 16px ${contentPaddingBottom}px` }}>
        {mode === "idle" && (
          <IdleWorkoutScreen
            day={day}
            week={viewWeek}
            checks={checks}
            onToggleCheck={toggleCheck}
            open={open}
            onToggleOpen={toggleOpen}
            weekNote={weekNote}
            totalSets={totalSets}
          />
        )}

        {mode === "active" && pos && (
          <ActiveWorkoutScreen
            day={day}
            week={viewWeek}
            pos={pos}
            done={done}
            logs={logs}
            open={open}
            onToggleOpen={toggleOpen}
            onWeightDelta={handleWeightDelta}
            onRepsDelta={handleRepsDelta}
          />
        )}

        {mode === "complete" && (
          <WorkoutCompleteSummary
            day={day}
            week={viewWeek}
            done={done}
            elapsedSeconds={elapsedSeconds}
            volumeKg={volumeKg}
            weekNote={weekNote}
            nextDay={getNextDay(day.id)}
            open={open}
            onToggle={toggleOpen}
            onGoToNextDay={handleGoToNextDay}
          />
        )}
      </div>

      <StickyBar>
        {mode === "idle" && <PrimaryButton onClick={handlePrimaryCta}>{ctaLabel}</PrimaryButton>}
        {mode === "active" && (
          <div>
            {undoTarget && <GhostButton onClick={handleUndoLast}>↺ {undoLabel}</GhostButton>}
            {rest.remaining > 0 && <RestTimer remaining={rest.remaining} running={rest.running} onAdjust={adjustRest} onToggleRun={toggleRestRun} />}
            <PrimaryButton onClick={handleCompleteSet}>{completeLabel}</PrimaryButton>
          </div>
        )}
        {mode === "complete" && (
          <div>
            {undoTarget && <GhostButton onClick={handleUndoLast}>↺ {undoLabel}</GhostButton>}
            <PrimaryButton onClick={handleFinish}>Finish</PrimaryButton>
          </div>
        )}
      </StickyBar>
    </div>
  );
}
