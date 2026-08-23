import { T } from "../theme";

export default function CheckLine({ text, done, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        background: "transparent",
        border: "none",
        padding: "5px 0",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          flexShrink: 0,
          border: `2px solid ${done ? color : T.line}`,
          background: done ? color : T.chalk,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.chalk,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {done ? "✓" : ""}
      </span>
      <span
        style={{
          fontSize: 13.5,
          color: done ? T.sub : T.ink,
          textDecoration: done ? "line-through" : "none",
        }}
      >
        {text}
      </span>
    </button>
  );
}
