import { useState } from "react";
import { T } from "../theme";
import CollapsibleSection from "./CollapsibleSection";
import CheckLine from "./CheckLine";
import { MiniMedia } from "./Media";
import { GIFS } from "../gifMap";

/**
 * Shared renderer for the warm-up and cool-down phases — same checklist +
 * per-item "How?" media toggle, wrapped in a collapsible card that shows a
 * compact "done" state once every item is checked.
 */
export default function ChecklistCard({ title, color, items, isChecked, onToggleCheck, open, onToggleSection, footnote }) {
  const [detail, setDetail] = useState({});
  const doneCount = items.filter((_, index) => isChecked(index)).length;
  const allDone = doneCount === items.length;

  return (
    <CollapsibleSection
      title={title}
      color={color}
      completed={allDone}
      meta={`${doneCount}/${items.length}`}
      preview={allDone ? "All done" : items[items.findIndex((_, index) => !isChecked(index))]?.text}
      open={open}
      onToggle={onToggleSection}
    >
      {items.map((item, index) => (
        <div key={item.text}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <CheckLine text={item.text} done={isChecked(index)} color={color} onClick={() => onToggleCheck(index)} />
            </div>
            {item.icon && (
              <button
                onClick={() => setDetail((state) => ({ ...state, [index]: !state[index] }))}
                style={{
                  border: `1.5px solid ${T.line}`,
                  background: T.chalk,
                  borderRadius: 8,
                  padding: "6px 11px",
                  minHeight: 36,
                  fontSize: 12.5,
                  cursor: "pointer",
                  color: T.ink,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {detail[index] ? "Hide" : "How?"}
              </button>
            )}
          </div>

          {item.icon && detail[index] && (
            <div style={{ background: T.bg, borderRadius: 10, padding: "8px 10px", margin: "2px 0 10px 38px" }}>
              <MiniMedia item={item} color={color} gifSrc={GIFS[item.text]} />
              <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>
                {item.desc}
                <div style={{ fontSize: 11.5, color: T.sub, marginTop: 4 }}>
                  {item.hold ? "hold this position" : "faded = start · solid = finish"}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {footnote && <div style={{ fontSize: 13, color: T.sub, marginTop: 6 }}>{footnote}</div>}
    </CollapsibleSection>
  );
}
