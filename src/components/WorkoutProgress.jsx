import { useState } from "react";
import { T, weekKg } from "../theme";
import { countDoneSets, isSetDone } from "../utils/workout";
import ExerciseDetail from "./ExerciseDetail";

function StatusIcon({ status, index, size = 26 }) {
  const base = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size > 22 ? 12 : 11,
    fontWeight: 700,
    flexShrink: 0,
  };
  if (status === "done") return <div style={{ ...base, background: T.good, color: T.chalk }}>✓</div>;
  if (status === "current") return <div style={{ ...base, background: T.action, color: T.chalk }}>{index + 1}</div>;
  return <div style={{ ...base, border: `2px solid ${T.line}`, color: T.sub }}>{index + 1}</div>;
}

function Row({ icon, title, titleWeight, trailing, onClick, indent }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "transparent",
        border: "none",
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
        padding: indent ? "7px 0 7px 8px" : "10px 0",
        minHeight: indent ? 38 : 46,
      }}
    >
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: indent ? 13.5 : 14.5,
            fontWeight: titleWeight ?? 500,
            color: T.ink,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ fontSize: indent ? 12 : 12.5, color: T.sub, flexShrink: 0 }}>{trailing}</div>
    </button>
  );
}

export default function WorkoutProgress({ day, week, blocks, blockStatuses, currentRound, currentMemberIndex, done, color }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (key) => setExpanded((state) => ({ ...state, [key]: !state[key] }));

  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: "6px 14px", marginBottom: 12 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 0 2px" }}>
        Workout progress
      </div>
      {blocks.map((block, blockIndex) => {
        const status = blockStatuses[blockIndex];
        const blockKey = `block-${blockIndex}`;

        if (!block.isSuperset) {
          const member = block.members[0];
          const doneCount = countDoneSets(member.exercise, done, week, day.id, member.flatIndex);
          let trailing = `${member.exercise.sets} sets`;
          if (status === "done") trailing = `${doneCount}/${member.exercise.sets} sets`;
          else if (status === "current") trailing = `${currentRound + 1} of ${member.exercise.sets}`;

          return (
            <div key={block.key} style={{ borderTop: blockIndex === 0 ? "none" : `1px solid ${T.line}` }}>
              <Row
                icon={<StatusIcon status={status} index={blockIndex} />}
                title={member.exercise.name}
                titleWeight={status === "current" ? 700 : 500}
                trailing={trailing}
                onClick={() => toggle(blockKey)}
              />
              {expanded[blockKey] && (
                <div style={{ padding: "0 2px 14px 36px" }}>
                  <ExerciseDetail exercise={member.exercise} color={color} kg={weekKg(member.exercise, week)} />
                </div>
              )}
            </div>
          );
        }

        const doneRounds = Array.from({ length: block.rounds }).filter((_, round) =>
          block.members.every((member) => round < member.exercise.sets && isSetDone(done, week, day.id, member.flatIndex, round))
        ).length;
        let trailing = `${block.rounds} rounds`;
        if (status === "done") trailing = `${doneRounds}/${block.rounds} rounds`;
        else if (status === "current") trailing = `Round ${currentRound + 1} of ${block.rounds}`;

        return (
          <div key={block.key} style={{ borderTop: blockIndex === 0 ? "none" : `1px solid ${T.line}` }}>
            <Row
              icon={<StatusIcon status={status} index={blockIndex} />}
              title={`${block.label} · SUPERSET`}
              titleWeight={700}
              trailing={trailing}
              onClick={status === "current" ? undefined : () => toggle(blockKey)}
            />

            {status === "current" &&
              block.members.map((member, memberIndex) => {
                const memberStatus = memberIndex === currentMemberIndex ? "current" : memberIndex < currentMemberIndex ? "done" : "upcoming";
                const memberKey = `member-${blockIndex}-${memberIndex}`;
                return (
                  <div key={member.flatIndex}>
                    <Row
                      indent
                      icon={
                        <span style={{ width: 18, textAlign: "center", flexShrink: 0, fontSize: 13, color: memberStatus === "done" ? T.good : memberStatus === "current" ? T.action : T.sub }}>
                          {memberStatus === "done" ? "✓" : memberStatus === "current" ? "●" : "○"}
                        </span>
                      }
                      title={`${member.exercise.series} ${member.exercise.name}`}
                      titleWeight={memberStatus === "current" ? 700 : 500}
                      trailing={memberStatus === "current" ? "current" : memberStatus === "done" ? "done" : "up next"}
                      onClick={() => toggle(memberKey)}
                    />
                    {expanded[memberKey] && (
                      <div style={{ padding: "0 2px 12px 46px" }}>
                        <ExerciseDetail exercise={member.exercise} color={color} kg={weekKg(member.exercise, week)} />
                      </div>
                    )}
                  </div>
                );
              })}

            {status !== "current" && expanded[blockKey] && (
              <div style={{ padding: "0 2px 14px 36px", display: "flex", flexDirection: "column", gap: 12 }}>
                {block.members.map((member) => (
                  <div key={member.flatIndex}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: T.sub, marginBottom: 4 }}>{member.exercise.series}</div>
                    <ExerciseDetail exercise={member.exercise} color={color} kg={weekKg(member.exercise, week)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
