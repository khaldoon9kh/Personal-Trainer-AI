import { T } from "../theme";

export default function Plate({ done, color, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: `3px solid ${done ? color : T.line}`,
        background: done ? color : T.chalk,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .15s ease",
        padding: 0,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: done ? T.chalk : T.line,
        }}
      />
    </button>
  );
}
