import { useState } from "react";
import MoveIcon, { iconFor } from "./MoveIcon";
import { T } from "../theme";

export function Media({ item, color, gifSrc }) {
  const [failed, setFailed] = useState(false);
  const label = item.name;

  if (!gifSrc || failed) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
        <div style={{ textAlign: "center", background: T.bg, borderRadius: 10, padding: "6px 14px 2px" }}>
          <MoveIcon type={iconFor(label)} color={color} />
          <div style={{ fontSize: 11, color: T.sub, paddingBottom: 4 }}>faded = start · solid = finish</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
      <div style={{ background: T.bg, borderRadius: 10, padding: 6 }}>
        <img
          src={gifSrc}
          alt={label}
          onError={() => setFailed(true)}
          style={{ width: "100%", maxWidth: 250, borderRadius: 8, display: "block", background: T.chalk }}
        />
      </div>
    </div>
  );
}

export function MiniMedia({ item, color, gifSrc }) {
  const [failed, setFailed] = useState(false);
  const label = item.text;

  if (!gifSrc || failed) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <MoveIcon type={item.icon} color={color} />
      </div>
    );
  }

  return (
    <img
      src={gifSrc}
      alt={label}
      onError={() => setFailed(true)}
      style={{ width: "100%", maxWidth: 210, borderRadius: 8, display: "block", background: T.chalk }}
    />
  );
}
