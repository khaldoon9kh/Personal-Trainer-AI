import { T } from "../theme";

export default function CheckLine({ text, done, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        background: "transparent",
        border: "none",
        padding: "10px 0",
        minHeight: 44,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          flexShrink: 0,
          border: `2px solid ${done ? color : T.line}`,
          background: done ? color : T.chalk,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.chalk,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {done ? "✓" : ""}
      </span>
      <span
        style={{
          fontSize: 15,
          color: done ? T.sub : T.ink,
          textDecoration: done ? "line-through" : "none",
        }}
      >
        {text}
      </span>
    </button>
  );
}
