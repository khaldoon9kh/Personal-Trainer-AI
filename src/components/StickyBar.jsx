import { T } from "../theme";

/**
 * Fixed bottom bar shared by the idle (Start Workout), active (rest timer +
 * Complete Set) and complete (Finish) screens.
 */
export default function StickyBar({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: T.chalk,
        borderTop: `1px solid ${T.line}`,
        boxShadow: "0 -4px 16px rgba(34,38,43,.08)",
        padding: "10px max(16px, env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

export function PrimaryButton({ children, onClick, color = T.action, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        border: "none",
        borderRadius: 14,
        background: disabled ? T.line : color,
        color: T.chalk,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        padding: "17px 0",
        minHeight: 56,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
