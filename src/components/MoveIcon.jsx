import { T } from "../theme";

export const iconFor = (name) => {
  if (name.includes("Deadlift")) return "rdl";
  if (name.includes("Leg Curl")) return "legcurl";
  if (name.includes("Calf")) return "calf";
  if (name.includes("Hanging Leg Raise")) return "hanging";
  if (name.includes("Pullover")) return "sapulldown";
  if (name.includes("Trap 3")) return "trap3";
  if (name.includes("Squat")) return "squat";
  if (name.includes("Leg Press")) return "legpress";
  if (name.includes("Bench Press")) return "benchpress";
  if (name.includes("Chest Fly")) return "fly";
  if (name.includes("Skull")) return "skull";
  if (name.includes("Row")) return "row";
  if (name.includes("Pulldown")) return "pulldown";
  if (name.includes("Face Pull")) return "facepull";
  if (name.includes("Arnold")) return "press";
  if (name.includes("Lateral")) return "lateral";
  if (name.includes("Curl")) return "curl";
  if (name.includes("Triceps Extension")) return "overhead";
  if (name.includes("Skull Crusher")) return "skull";
  if (name.includes("Romanian")) return "rdl";
  if (name.includes("Straight-Arm")) return "sapulldown";
  if (name.includes("EZ-Bar Curl")) return "curl";
  if (name.includes("Close-Grip Bench")) return "benchpress";
  if (name.includes("Back Extension")) return "backext";
  if (name.includes("Bird Dog")) return "birddog";
  if (name.includes("Fly")) return "fly";
  if (name.includes("Shrug")) return "shrug";
  if (name.includes("Crunch")) return "crunch";
  if (name.includes("Incline Dumbbell Press")) return "chestpress";
  if (name.includes("Lat Pulldown")) return "pulldown";
  if (name.includes("Chest Press")) return "chestpress";
  if (name.includes("Shoulder Press")) return "press";
  if (name.includes("Pushdown")) return "pushdown";
  if (name.includes("Overhead")) return "overhead";
  if (name.includes("Pec-Deck")) return "reversefly";
  if (name.includes("Carry")) return "carry";
  if (name.includes("Dip")) return "dip";
  if (name.includes("Plank")) return "plank";
  return "press";
};

export default function MoveIcon({ type, color }) {
  const P = {
    fill: "none",
    stroke: T.ink,
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const M = { ...P, stroke: color };
  const D = (cx, cy) => <circle cx={cx} cy={cy} r={3.5} fill={color} stroke="none" />;
  const wrap = (stat, a, b) => (
    <svg
      className="mv"
      viewBox="0 0 120 100"
      width="132"
      height="110"
      role="img"
      aria-label="movement diagram: faded pose is the start, solid pose is the finish"
    >
      {stat}
      {a && <g className="pA">{a}</g>}
      {b && <g className="pB">{b}</g>}
    </svg>
  );

  switch (type) {
    case "press":
      return wrap(
        <>
          <circle cx="60" cy="26" r="7" {...P} />
          <path d="M60 34 V66 M46 66 H74 M54 66 L50 84 M66 66 L70 84" {...P} />
        </>,
        <>
          <path d="M60 40 L47 52 L45 40 M60 40 L73 52 L75 40" {...M} />
          {D(45, 38)}
          {D(75, 38)}
        </>,
        <>
          <path d="M60 40 L51 25 L49 11 M60 40 L69 25 L71 11" {...M} />
          {D(49, 9)}
          {D(71, 9)}
        </>
      );
    case "lateral":
      return wrap(
        <>
          <circle cx="60" cy="22" r="7" {...P} />
          <path d="M60 29 V62 M60 62 L52 86 M60 62 L68 86" {...P} />
        </>,
        <>
          <path d="M60 36 L52 58 M60 36 L68 58" {...M} />
          {D(52, 60)}
          {D(68, 60)}
        </>,
        <>
          <path d="M60 36 L32 38 M60 36 L88 38" {...M} />
          {D(30, 38)}
          {D(90, 38)}
        </>
      );
    case "facepull":
      return wrap(
        <>
          <rect x="104" y="28" width="6" height="22" fill={T.ink} />
          <circle cx="46" cy="30" r="7" {...P} />
          <path d="M46 37 V68 M46 68 L38 90 M46 68 L56 90" {...P} />
        </>,
        <>
          <path d="M46 44 L66 46 L86 42" {...M} />
          {D(86, 42)}
          <path d="M86 42 L104 38" {...P} strokeWidth={2} />
        </>,
        <>
          <path d="M46 44 L62 54 L54 38" {...M} />
          {D(54, 38)}
          <path d="M54 38 C 78 30, 92 34, 104 38" {...P} strokeWidth={2} />
        </>
      );
    case "chestpress":
      return wrap(
        <>
          <path d="M38 30 V72 M44 34 V70 M38 70 H58 M44 70 L60 86" {...P} />
          <circle cx="45" cy="26" r="7" {...P} />
        </>,
        <>
          <path d="M44 44 L54 56 L60 44" {...M} />
          {D(61, 43)}
        </>,
        <>
          <path d="M44 44 L66 44 L88 44" {...M} />
          {D(89, 43)}
        </>
      );
    case "pushdown":
      return wrap(
        <>
          <rect x="94" y="6" width="10" height="8" fill={T.ink} />
          <circle cx="48" cy="24" r="7" {...P} />
          <path d="M48 31 V66 M48 66 L40 88 M48 66 L56 88" {...P} />
        </>,
        <>
          <path d="M48 40 L56 52 L64 40" {...M} />
          {D(64, 40)}
          <path d="M64 40 L98 14" {...P} strokeWidth={2} />
        </>,
        <>
          <path d="M48 40 L56 52 L62 74" {...M} />
          {D(62, 74)}
          <path d="M62 74 L98 14" {...P} strokeWidth={2} />
        </>
      );
    case "overhead":
      return wrap(
        <>
          <circle cx="52" cy="30" r="7" {...P} />
          <path d="M52 37 V70 M52 70 L44 90 M52 70 L60 90" {...P} />
        </>,
        <>
          <path d="M52 42 L58 22 L42 16" {...M} />
          {D(40, 16)}
        </>,
        <>
          <path d="M52 42 L58 22 L62 4" {...M} />
          {D(63, 3)}
        </>
      );
    case "pulldown":
      return wrap(
        <>
          <circle cx="60" cy="34" r="7" {...P} />
          <path d="M60 41 V70 M48 70 H72 M52 70 L48 86 M68 70 L72 86" {...P} />
        </>,
        <>
          <path d="M28 12 H92" {...M} />
          <path d="M60 45 L42 14 M60 45 L78 14" {...M} />
        </>,
        <>
          <path d="M34 52 H86" {...M} />
          <path d="M60 45 L48 58 L40 53 M60 45 L72 58 L80 53" {...M} />
        </>
      );
    case "row":
      return wrap(
        <>
          <circle cx="42" cy="28" r="7" {...P} />
          <path d="M42 35 V66 M42 66 L68 70 M74 58 V78" {...P} />
          <rect x="100" y="56" width="6" height="16" fill={T.ink} />
        </>,
        <>
          <path d="M42 44 L64 52 L86 56" {...M} />
          {D(86, 56)}
          <path d="M86 56 L100 62" {...P} strokeWidth={2} />
        </>,
        <>
          <path d="M42 44 L60 60 L48 56" {...M} />
          {D(48, 56)}
          <path d="M48 56 L100 62" {...P} strokeWidth={2} />
        </>
      );
    case "reversefly":
      return wrap(
        <>
          <circle cx="60" cy="24" r="7" {...P} />
          <path d="M60 31 V64 M60 64 L52 86 M60 64 L68 86" {...P} />
        </>,
        <>
          <path d="M60 38 L52 52 M60 38 L68 52" {...M} />
          {D(52, 54)}
          {D(68, 54)}
        </>,
        <>
          <path d="M60 38 L30 36 M60 38 L90 36" {...M} />
          {D(28, 36)}
          {D(92, 36)}
        </>
      );
    case "curl":
      return wrap(
        <>
          <circle cx="48" cy="26" r="7" {...P} />
          <path d="M48 33 V68 M48 68 L42 88 M48 68 L56 88" {...P} />
        </>,
        <>
          <path d="M48 42 L52 70" {...M} />
          {D(53, 72)}
        </>,
        <>
          <path d="M48 42 L52 58 L58 44" {...M} />
          {D(59, 42)}
        </>
      );
    case "legpress":
      return wrap(
        <>
          <path d="M20 80 H60 M78 22 L96 54" {...P} />
          <circle cx="26" cy="68" r="7" {...P} />
          <path d="M32 66 L46 54" {...P} />
        </>,
        <path d="M46 54 L60 48 L78 34" {...M} />,
        <path d="M46 54 L66 42 L86 26" {...M} />
      );
    case "carry":
      return wrap(
        <>
          <circle cx="50" cy="22" r="7" {...P} />
          <path d="M50 29 V60 M50 36 L47 66 M50 36 L55 66" {...P} />
          {D(47, 70)}
          {D(55, 70)}
          <path d="M76 50 H94 M89 45 L95 50 L89 55" {...M} strokeWidth={2} />
        </>,
        <path d="M50 60 L42 84 M50 60 L58 84" {...M} />,
        <path d="M50 60 L40 82 M50 60 L62 82" {...M} />
      );
    case "dip":
      return wrap(
        <path d="M36 30 V90 M84 30 V90 M30 44 H46 M74 44 H90" {...P} />,
        <>
          <circle cx="60" cy="42" r="7" {...P} />
          <path d="M60 49 V72 M60 72 L52 84" {...P} />
          <path d="M60 52 L46 44 M60 52 L74 44" {...M} />
        </>,
        <>
          <circle cx="60" cy="28" r="7" {...P} />
          <path d="M60 35 V60 M60 60 L52 76" {...P} />
          <path d="M60 40 L44 44 M60 40 L76 44" {...M} />
        </>
      );
    case "squat":
      return wrap(
        null,
        <>
          <circle cx="52" cy="22" r="7" {...P} />
          <path d="M52 29 V58 M52 58 V72 M52 72 V84 M52 84 H62" {...P} />
          <path d="M52 36 L60 40" {...M} />
          {D(62, 41)}
        </>,
        <>
          <circle cx="44" cy="40" r="7" {...P} />
          <path d="M46 47 L58 66 M58 66 L46 76 L50 86 M50 86 H62" {...P} />
          <path d="M48 52 L58 56" {...M} />
          {D(60, 57)}
        </>
      );
    case "fly":
      return wrap(
        <>
          <circle cx="60" cy="24" r="7" {...P} />
          <path d="M60 31 V64 M60 64 L52 86 M60 64 L68 86" {...P} />
        </>,
        <>
          <path d="M60 38 L30 36 M60 38 L90 36" {...M} />
          {D(28, 36)}
          {D(92, 36)}
        </>,
        <>
          <path d="M60 38 L52 54 M60 38 L68 54" {...M} />
          {D(54, 56)}
          {D(66, 56)}
        </>
      );
    case "shrug":
      return wrap(
        <>
          <circle cx="60" cy="20" r="7" {...P} />
          <path d="M60 27 V62 M60 62 L52 86 M60 62 L68 86" {...P} />
        </>,
        <>
          <path d="M52 34 H68 M60 34 L54 64 M60 34 L66 64" {...M} />
          {D(54, 68)}
          {D(66, 68)}
        </>,
        <>
          <path d="M52 30 H68 M60 30 L54 59 M60 30 L66 59" {...M} />
          {D(54, 63)}
          {D(66, 63)}
          <path d="M84 54 V40 M80 45 L84 39 L88 45" {...M} strokeWidth={2} />
        </>
      );
    case "crunch":
      return wrap(
        <>
          <path d="M14 84 H106" {...P} strokeWidth={2} />
          <path d="M64 80 L76 62 L90 80" {...P} />
        </>,
        <>
          <circle cx="26" cy="74" r="6" {...P} />
          <path d="M32 77 L64 80" {...M} />
        </>,
        <>
          <circle cx="36" cy="60" r="6" {...P} />
          <path d="M40 65 Q52 70 64 80" {...M} />
        </>
      );
    case "armcircle":
      return wrap(
        <>
          <circle cx="60" cy="20" r="7" {...P} />
          <path d="M60 27 V60 M60 60 L52 84 M60 60 L68 84" {...P} />
          <path d="M96 40 A11 11 0 1 1 98 26 M94 22 L99 27 L92 30" {...M} strokeWidth={2} />
        </>,
        <path d="M60 34 L34 34 M60 34 L86 34" {...M} />,
        <path d="M60 34 L40 16 M60 34 L80 16" {...M} />
      );
    case "pullapart":
      return wrap(
        <>
          <circle cx="60" cy="20" r="7" {...P} />
          <path d="M60 27 V60 M60 60 L52 84 M60 60 L68 84" {...P} />
        </>,
        <>
          <path d="M60 36 L50 48 M60 36 L70 48" {...M} />
          <path d="M50 48 H70" {...P} strokeWidth={2} />
          {D(50, 48)}
          {D(70, 48)}
        </>,
        <>
          <path d="M60 36 L30 40 M60 36 L90 40" {...M} />
          <path d="M30 40 L90 40" {...P} strokeWidth={2} />
          {D(30, 40)}
          {D(90, 40)}
        </>
      );
    case "extrot":
      return wrap(
        <>
          <rect x="8" y="44" width="6" height="16" fill={T.ink} />
          <circle cx="52" cy="20" r="7" {...P} />
          <path d="M52 27 V60 M52 60 L44 84 M52 60 L60 84" {...P} />
          <path d="M52 36 L52 54" {...P} />
        </>,
        <>
          <path d="M52 54 L36 50" {...M} />
          {D(34, 50)}
          <path d="M34 50 L14 50" {...P} strokeWidth={2} />
        </>,
        <>
          <path d="M52 54 L70 48" {...M} />
          {D(72, 48)}
          <path d="M72 48 C 50 62, 30 58, 14 50" {...P} strokeWidth={2} />
        </>
      );
    case "crossbody":
      return wrap(
        <>
          <circle cx="60" cy="20" r="7" {...P} />
          <path d="M60 27 V60 M60 60 L52 84 M60 60 L68 84" {...P} />
          <path d="M66 34 L38 44" {...M} />
          <circle cx="36" cy="44" r="3.5" fill={T.ink} stroke="none" />
          <path d="M52 36 L58 42" {...P} />
        </>,
        null,
        null
      );
    case "doorway":
      return wrap(
        <>
          <path d="M84 16 V90" {...P} />
          <circle cx="48" cy="26" r="7" {...P} />
          <path d="M50 33 L58 62 M58 62 L50 86 M58 62 L68 84" {...P} />
          <path d="M54 38 L76 34 L80 20" {...M} />
          {D(80, 18)}
        </>,
        null,
        null
      );
    case "tristretch":
      return wrap(
        <>
          <circle cx="60" cy="24" r="7" {...P} />
          <path d="M60 31 V64 M60 64 L52 86 M60 64 L68 86" {...P} />
          <path d="M66 36 L70 14 L52 12" {...M} />
          {D(50, 12)}
          <path d="M52 34 L68 16" {...P} />
        </>,
        null,
        null
      );
    case "benchpress":
      return wrap(
        <>
          <path d="M28 70 H92 M36 70 V86 M84 70 V86" {...P} />
          <circle cx="34" cy="62" r="6" {...P} />
          <path d="M42 64 H80 M80 64 L90 78" {...P} />
        </>,
        <>
          <path d="M48 62 L58 52" {...M} />
          <path d="M46 48 H70" {...M} strokeWidth={4} />
        </>,
        <>
          <path d="M48 62 L52 38" {...M} />
          <path d="M40 34 H64" {...M} strokeWidth={4} />
        </>
      );
    case "backext":
      return wrap(
        <>
          <path d="M40 84 L72 56" {...P} strokeWidth={4} />
          <path d="M68 58 L88 70" {...P} />
          <rect x="86" y="68" width="9" height="7" fill={T.ink} />
        </>,
        <>
          <circle cx="44" cy="84" r="6" {...P} />
          <path d="M68 58 L48 80" {...M} />
        </>,
        <>
          <circle cx="36" cy="50" r="6" {...P} />
          <path d="M68 58 L42 52" {...M} />
        </>
      );
    case "birddog":
      return wrap(
        <>
          <path d="M14 88 H106" {...P} strokeWidth={2} />
          <circle cx="38" cy="56" r="6" {...P} />
          <path d="M46 60 H72 M46 60 V86 M72 60 L78 84 M78 84 L92 84" {...P} />
        </>,
        <path d="M50 60 L46 84 M70 60 L66 84" {...M} />,
        <path d="M46 60 L20 52 M72 60 L100 52" {...M} />
      );
    case "catcow":
      return wrap(
        <>
          <path d="M14 88 H106" {...P} strokeWidth={2} />
          <path d="M44 62 V86 M74 62 L78 86 M78 86 L92 86" {...P} />
        </>,
        <>
          <circle cx="36" cy="54" r="6" {...M} />
          <path d="M44 62 Q60 72 74 62" {...M} />
        </>,
        <>
          <circle cx="38" cy="66" r="6" {...M} />
          <path d="M44 62 Q60 46 74 62" {...M} />
        </>
      );
    case "kneechest":
      return wrap(
        <>
          <path d="M14 84 H106" {...P} strokeWidth={2} />
          <circle cx="24" cy="74" r="6" {...P} />
          <path d="M30 78 L58 80 M58 80 L92 80" {...P} />
          <path d="M58 80 L64 62 M64 62 L52 58" {...P} />
          <path d="M40 74 L60 64" {...M} />
        </>,
        null,
        null
      );
    case "skull":
      return wrap(
        <>
          <path d="M28 70 H92 M36 70 V86 M84 70 V86" {...P} />
          <circle cx="34" cy="62" r="6" {...P} />
          <path d="M42 64 H80 M80 64 L90 78" {...P} />
          <path d="M50 62 L56 40" {...M} />
        </>,
        <>
          <path d="M56 40 L62 24" {...M} />
          <path d="M56 20 H68" {...M} strokeWidth={4} />
        </>,
        <>
          <path d="M56 40 L40 32" {...M} />
          <path d="M36 26 H44" {...M} strokeWidth={4} />
        </>
      );
    case "rdl":
      return wrap(
        <>
          <path d="M14 88 H106" {...P} strokeWidth={2} />
        </>,
        <>
          <circle cx="60" cy="20" r="7" {...P} />
          <path d="M60 27 V60 M60 60 L54 86 M60 60 L66 86" {...P} />
          <path d="M60 36 L58 62" {...M} />
          {D(58, 64)}
        </>,
        <>
          <circle cx="40" cy="42" r="7" {...P} />
          <path d="M46 47 L64 58 M64 58 L60 86 M64 58 L70 86" {...P} />
          <path d="M48 50 L52 74" {...M} />
          {D(52, 76)}
        </>
      );
    case "sapulldown":
      return wrap(
        <>
          <rect x="96" y="6" width="10" height="8" fill={T.ink} />
          <circle cx="44" cy="28" r="7" {...P} />
          <path d="M46 35 L50 66 M50 66 L42 88 M50 66 L58 88" {...P} />
        </>,
        <>
          <path d="M48 42 L80 28" {...M} />
          {D(82, 27)}
          <path d="M82 27 L100 12" {...P} strokeWidth={2} />
        </>,
        <>
          <path d="M48 42 L62 70" {...M} />
          {D(63, 72)}
          <path d="M63 72 C 90 60, 100 40, 100 12" {...P} strokeWidth={2} />
        </>
      );
    case "childpose":
      return wrap(
        <>
          <path d="M14 88 H106" {...P} strokeWidth={2} />
          <circle cx="30" cy="78" r="6" {...P} />
          <path d="M36 80 L62 68 L80 72 L90 86 M62 68 L74 86" {...P} />
          <path d="M34 76 L12 84" {...M} />
        </>,
        null,
        null
      );
    case "legcurl":
      return wrap(
        <>
          <path d="M16 78 H96" {...P} strokeWidth={3} />
          <circle cx="26" cy="70" r="6" {...P} />
          <path d="M32 72 H72" {...P} />
        </>,
        <>
          <path d="M72 72 L96 74" {...M} />
          {D(98, 74)}
        </>,
        <>
          <path d="M72 72 L82 48" {...M} />
          {D(83, 45)}
        </>
      );
    case "calf":
      return wrap(
        <>
          <path d="M20 84 H70" {...P} strokeWidth={3} />
        </>,
        <>
          <circle cx="52" cy="26" r="6" {...P} />
          <path d="M52 32 V56 M52 56 L46 82 M52 56 L60 82" {...P} />
          <path d="M40 84 H70" {...M} strokeWidth={3} />
        </>,
        <>
          <circle cx="52" cy="16" r="6" {...P} />
          <path d="M52 22 V48 M52 48 L46 74 M52 48 L60 74" {...P} />
          <path d="M44 74 L54 84 M60 74 L66 84" {...M} />
        </>
      );
    case "hanging":
      return wrap(
        <>
          <path d="M20 12 H100" {...P} strokeWidth={3} />
          <circle cx="60" cy="34" r="6" {...P} />
          <path d="M60 26 L52 14 M60 26 L68 14" {...P} />
          <path d="M60 40 V62" {...P} />
        </>,
        <path d="M60 62 L54 88 M60 62 L66 88" {...M} />,
        <path d="M60 62 L74 60 L96 56 M60 62 L76 68 L96 62" {...M} />
      );
    case "trap3":
      return wrap(
        <>
          <rect x="8" y="76" width="6" height="14" fill={T.ink} />
          <circle cx="56" cy="26" r="7" {...P} />
          <path d="M56 33 V64 M56 64 L48 88 M56 64 L64 88" {...P} />
        </>,
        <>
          <path d="M56 40 L38 62" {...M} />
          {D(36, 64)}
          <path d="M36 64 L14 80" {...P} strokeWidth={2} />
        </>,
        <>
          <path d="M56 40 L78 14" {...M} />
          {D(80, 12)}
          <path d="M80 12 C 50 30, 26 56, 14 80" {...P} strokeWidth={2} />
        </>
      );
    case "plank":
      return wrap(
        <>
          <path d="M16 82 H104" {...P} strokeWidth={2} />
          <circle cx="28" cy="58" r="6" {...P} />
          <path d="M34 62 L90 76 M34 62 L30 76 M24 78 H40 M90 76 L96 82" {...P} />
        </>,
        null,
        null
      );
    default:
      return null;
  }
}
