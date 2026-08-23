import { T } from "../theme";

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M12.5 4 L6 10 L12.5 16" stroke={T.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Idle mode: the big title + the Push/Pull/Legs and week selectors.
 * Active/complete mode: a compact single-line header with a back control
 * and a progress readout, per the "hide the navigation during a workout"
 * requirement.
 */
export default function WorkoutHeader({ mode, day, week, days, onSelectDay, onSelectWeek, onBack, progressLabel, progressFraction }) {
  if (mode !== "idle") {
    return (
      <div style={{ padding: "16px 16px 10px", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onBack}
            aria-label="Back to overview"
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 10,
              border: `1px solid ${T.line}`,
              background: T.chalk,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <BackArrow />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: T.action,
                lineHeight: 1.1,
              }}
            >
              {mode === "complete" ? "Workout Complete" : `${day.label} Day · W${week}`}
            </div>
          </div>
          {progressLabel && (
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: T.ink,
                flexShrink: 0,
              }}
            >
              {progressLabel}
            </div>
          )}
        </div>

        {typeof progressFraction === "number" && (
          <div style={{ height: 5, background: T.line, borderRadius: 3, marginTop: 12, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.round(progressFraction * 100)}%`,
                background: T.action,
                borderRadius: 3,
                transition: "width .25s ease",
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 12px", maxWidth: 560, margin: "0 auto" }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 1,
          textTransform: "uppercase",
          lineHeight: 1,
          color: T.action,
        }}
      >
        {day.label} DAY
      </div>
      <div style={{ fontSize: 14, color: T.sub, marginTop: 5 }}>
        {day.name} · Week {week} · {day.schedule}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {days.map((entry) => {
          const selected = entry.id === day.id;
          return (
            <button
              key={entry.id}
              onClick={() => onSelectDay(entry.id)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                minHeight: 44,
                borderRadius: 9,
                border: `2px solid ${selected ? entry.color : T.line}`,
                background: selected ? entry.color : T.chalk,
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

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {[1, 2, 3].map((wk) => (
          <button
            key={wk}
            onClick={() => onSelectWeek(wk)}
            style={{
              flex: 1,
              padding: "9px 0",
              minHeight: 40,
              borderRadius: 9,
              border: `2px solid ${week === wk ? T.ink : T.line}`,
              background: week === wk ? T.ink : T.chalk,
              color: week === wk ? T.chalk : T.ink,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            WK {wk}
          </button>
        ))}
      </div>
    </div>
  );
}
