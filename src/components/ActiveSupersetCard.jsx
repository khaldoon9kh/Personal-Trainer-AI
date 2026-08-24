import { useEffect, useState } from "react";
import { T } from "../theme";
import { Media } from "./Media";
import { GIFS } from "../gifMap";
import SetControls from "./SetControls";
import CollapsibleSection from "./CollapsibleSection";

function MemberTab({ label, name, status, active, onClick }) {
  const icon = status === "done" ? "✓" : active ? "●" : "○";
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minHeight: 46,
        padding: "8px 8px",
        borderRadius: 10,
        border: `1.5px solid ${active ? T.action : T.line}`,
        background: active ? T.action : T.chalk,
        color: active ? T.chalk : T.ink,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <span>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label} {name}
      </span>
    </button>
  );
}

export default function ActiveSupersetCard({ blockIndex, blockLabel, members, round, rounds, roundStates, currentMemberIndex, color, memberData }) {
  const [viewedMemberIndex, setViewedMemberIndex] = useState(currentMemberIndex);

  // Follow the active member automatically (B1 -> B2, next round -> B1
  // again); a manual tap below can still look at the other one.
  useEffect(() => {
    setViewedMemberIndex(currentMemberIndex);
  }, [currentMemberIndex, round, blockLabel]);

  const viewed = members[viewedMemberIndex];
  const viewedData = memberData[viewedMemberIndex];
  const isActingMember = viewedMemberIndex === currentMemberIndex;
  const memberStatuses = members.map((_, memberIndex) =>
    memberIndex === currentMemberIndex ? "current" : memberIndex < currentMemberIndex ? "done" : "upcoming"
  );

  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: T.chalk,
            background: T.action,
            borderRadius: 7,
            minWidth: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {String(blockIndex + 1).padStart(2, "0")}
        </span>
        <div style={{ fontSize: 11, color: T.action, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
          Superset {blockLabel}
        </div>
      </div>

      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: T.sub, marginBottom: 10 }}>
        {members.map((m) => m.exercise.series).join(" + ")}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {members.map((member, memberIndex) => (
          <MemberTab
            key={member.flatIndex}
            label={member.exercise.series}
            name={member.exercise.name}
            status={memberStatuses[memberIndex]}
            active={viewedMemberIndex === memberIndex}
            onClick={() => setViewedMemberIndex(memberIndex)}
          />
        ))}
      </div>

      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 19, textTransform: "uppercase", lineHeight: 1.15, color: T.ink }}>
        {viewed.exercise.name}
      </div>

      <Media item={viewed.exercise} color={color} gifSrc={GIFS[viewed.exercise.name]} />

      {isActingMember ? (
        <SetControls
          unitLabel="ROUND"
          totalSets={rounds}
          currentSetIndex={round}
          setStates={roundStates}
          previousLabel={viewedData.previousLabel}
          targetLabel={viewedData.targetLabel}
          weight={viewedData.weight}
          reps={viewedData.reps}
          showWeight={viewed.exercise.startKg > 0}
          onWeightDelta={viewedData.onWeightDelta}
          onRepsDelta={viewedData.onRepsDelta}
          color={color}
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: T.ink }}>
            ROUND {round + 1} OF {rounds}
          </div>
          <div style={{ fontSize: 12.5, color: T.sub, fontWeight: 600 }}>
            {memberStatuses[viewedMemberIndex] === "done" ? "Done this round" : `Up after ${members[currentMemberIndex].exercise.series}`}
          </div>
        </div>
      )}
      {!isActingMember && (
        <div style={{ background: T.bg, borderRadius: 10, padding: "10px 12px", marginBottom: 4, fontSize: 14.5, fontWeight: 600, color: T.ink }}>
          Target: {viewedData.targetLabel}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <CollapsibleSection title="Technique tips" color={color} open={viewedData.techOpen} onToggle={viewedData.onToggleTech}>
          <div style={{ fontSize: 14.5, lineHeight: 1.55 }}>
            <div>{viewed.exercise.desc}</div>
            <div style={{ marginTop: 6, color: T.sub }}>{viewed.exercise.machine}</div>
            <div style={{ color: T.sub }}>{viewed.exercise.alt}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 6, padding: "3px 9px", fontSize: 12.5 }}>
                ▶ YouTube: “{viewed.exercise.yt}”
              </span>
            </div>
            {viewed.exercise.tech && (
              <div style={{ marginTop: 10, background: T.ink, color: T.chalk, borderRadius: 8, padding: "9px 11px", fontSize: 13, lineHeight: 1.5 }}>
                {viewed.exercise.tech}
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="AI Coach note" color={color} open={viewedData.coachOpen} onToggle={viewedData.onToggleCoach}>
          <div style={{ fontSize: 14.5, lineHeight: 1.55, color: T.ink, fontWeight: 500 }}>{viewed.exercise.note}</div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
