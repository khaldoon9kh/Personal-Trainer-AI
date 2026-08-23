import { T } from "../theme";

function Chevron({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{
        flexShrink: 0,
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .15s ease",
      }}
    >
      <path d="M3 6 L8 11 L13 6" stroke={T.sub} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Generic collapsible card used for Warm-up, Cool-down, AI Coach and Daily
 * Notes. `open` is controlled by the parent so it can share one `open`
 * state map with the rest of the workout screen (same pattern the app
 * already used for exercise "How?" toggles).
 */
export default function CollapsibleSection({
  title,
  meta,
  preview,
  color = T.ink,
  completed = false,
  open,
  onToggle,
  children,
}) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.line}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 14,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "14px 14px",
          minHeight: 48,
        }}
      >
        {completed && (
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: T.good,
              color: T.chalk,
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ✓
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: T.ink,
            }}
          >
            {title}
          </div>
          {preview && !open && (
            <div
              style={{
                fontSize: 12.5,
                color: T.sub,
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {preview}
            </div>
          )}
        </div>
        {meta && <div style={{ fontSize: 12, color: T.sub, flexShrink: 0 }}>{meta}</div>}
        <Chevron open={open} />
      </button>

      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${T.line}` }}>
          <div style={{ paddingTop: 12 }}>{children}</div>
        </div>
      )}
    </div>
  );
}
