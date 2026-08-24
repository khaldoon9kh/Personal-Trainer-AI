import { T, lb } from "../theme";
import { Media } from "./Media";
import { GIFS } from "../gifMap";

/**
 * Shared "inspect this exercise" body — image, description, equipment,
 * alternative, YouTube cue, technique box and coach note. Used both by the
 * before-workout lineup and by tapping an upcoming/completed row in the
 * during-workout progress list.
 */
export default function ExerciseDetail({ exercise, color, kg }) {
  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
      <Media item={exercise} color={color} gifSrc={GIFS[exercise.name]} />
      <div>{exercise.desc}</div>
      <div style={{ marginTop: 6, color: T.sub }}>{exercise.machine}</div>
      <div style={{ color: T.sub }}>{exercise.alt}</div>
      <div style={{ marginTop: 6 }}>
        <span style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>
          ▶ YouTube: “{exercise.yt}”
        </span>
      </div>
      {exercise.tech && (
        <div style={{ marginTop: 8, background: T.ink, color: T.chalk, borderRadius: 8, padding: "8px 10px", fontSize: 12.5, lineHeight: 1.45 }}>
          <b style={{ color }}>TECHNIQUE · </b>
          {exercise.tech}
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12.5, color, fontWeight: 600 }}>{exercise.note}</div>
      {exercise.startKg > 0 && typeof kg === "number" && (
        <div style={{ marginTop: 4, fontSize: 12, color: T.sub }}>
          {kg} kg / {lb(kg)} lb{exercise.perHand ? " per hand" : ""}
        </div>
      )}
    </div>
  );
}
