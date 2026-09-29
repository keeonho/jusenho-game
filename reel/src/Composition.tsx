import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadPirata } from "@remotion/google-fonts/PirataOne";
import { loadFont as loadRuqaa } from "@remotion/google-fonts/ArefRuqaa";

const { fontFamily: pirata } = loadPirata();
const { fontFamily: ruqaa } = loadRuqaa("normal", { weights: ["700"] });

const ORANGE = "#cf4f00";
const HOT = "#ff6a13";
const YELLOW = "#f7c948";
const INK = "#141210";
const WHITE = "#fbfaf7";

const FPS = 24;
const HOLD = 3; // 24fps / 3 = 8 drawings per second, the classic "on threes" hand-animation rate
const FRAMES = [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((i) => [`k${i}.webp`, `k${i}-sk.webp`]);

const JSH = ["j1", "s4", "k2", "trio1", "j3", "s1", "k4", "trio2", "j2", "s3", "k7"].flatMap((n) => [`${n}.webp`, `${n}-sk.webp`]);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// every drawing gets its own tiny offset, so lines "boil" like redrawn frames
const wob = (step: number, key: string, amt: number) => (random(`${key}-${step}`) - 0.5) * amt;

const Draw: React.FC<{ d: string; from: number; len?: number; color: string; width: number; step: number }> = ({
  d,
  from,
  len = 18,
  color,
  width,
  step,
}) => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [from, from + len], [1, 0], { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const fade = interpolate(frame, [176, 190], [1, 0], clamp);
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={1}
      strokeDashoffset={drawn}
      opacity={fade}
      transform={`translate(${wob(step, d.slice(0, 6), 5)} ${wob(step, d.slice(-6), 5)})`}
    />
  );
};

type ReelProps = { frames: string[]; word: string; arabic: string };

export const KeonhoReel: React.FC<ReelProps> = ({ frames, word, arabic }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / HOLD);
  const src = frames[step % frames.length];

  const box = (key: string, base: React.CSSProperties, color: string, w = 5): React.ReactNode => (
    <div
      style={{
        position: "absolute",
        border: `${w}px solid ${color}`,
        ...base,
        translate: `${wob(step, key + "x", 8)}px ${wob(step, key + "y", 8)}px`,
        rotate: `${wob(step, key + "r", 1.2)}deg`,
      }}
    />
  );

  const wordIn = interpolate(frame, [6, 18], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <AbsoluteFill style={{ backgroundColor: ORANGE, overflow: "hidden" }}>
      {box("a", { left: 90, top: 90, width: 520, height: 640 }, YELLOW)}
      {box("b", { left: 470, top: 700, width: 520, height: 520 }, WHITE)}
      {box("c", { left: 40, top: 820, width: 260, height: 330 }, INK, 7)}
      <div style={{ position: "absolute", left: 600, top: 150, width: 380, height: 120, background: HOT, boxShadow: "8px 10px 18px rgba(60,18,0,.3)" }} />

      {/* the photo, swapped every 3 frames between Keonho photos and pencil versions */}
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 200,
          width: 740,
          height: 925,
          border: `8px solid ${INK}`,
          boxShadow: "14px 20px 34px rgba(60,18,0,.45)",
          overflow: "hidden",
          background: "#777",
          rotate: `${-1.5 + wob(step, "photo", 2.4)}deg`,
          translate: `${wob(step, "px", 6)}px ${wob(step, "py", 6)}px`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* tape */}
      <div style={{ position: "absolute", left: 440, top: 172, width: 200, height: 56, background: "rgba(244,239,230,.75)", rotate: `${-5 + wob(step, "tape", 1.5)}deg` }} />

      <div
        style={{
          position: "absolute",
          right: 110,
          top: 150,
          height: 120,
          display: "flex",
          alignItems: "center",
          fontFamily: ruqaa,
          fontWeight: 700,
          fontSize: 88,
          color: WHITE,
          WebkitTextStroke: `3px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: `5px 6px 0 ${INK}`,
          direction: "rtl",
        }}
      >
        {arabic}
      </div>

      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
        {/* hearts, stars and an arrow, drawn in one after another */}
        <Draw step={step} from={10} color={YELLOW} width={9} d="M880 470 C 850 420, 790 440, 810 490 C 825 530, 880 560, 880 560 C 880 560, 940 530, 950 490 C 965 440, 905 420, 880 470" />
        <Draw step={step} from={26} color={WHITE} width={7} d="M110 330 L 125 365 L 162 368 L 133 390 L 143 427 L 110 405 L 78 427 L 88 390 L 60 368 L 96 365 Z" />
        <Draw step={step} from={40} color={INK} width={8} len={22} d="M960 700 C 1010 780, 1000 880, 930 960 M 915 925 L 928 965 L 970 952" />
        <Draw step={step} from={58} color={YELLOW} width={7} d="M140 1000 C 110 975, 70 995, 85 1030 C 95 1052, 140 1072, 140 1072 C 140 1072, 185 1050, 192 1028 C 202 995, 165 975, 140 1000" />
        <Draw step={step} from={70} color={WHITE} width={6} d="M920 1080 L 930 1102 L 954 1104 L 936 1118 L 942 1142 L 920 1128 L 898 1142 L 904 1118 L 886 1104 L 910 1102 Z" />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1080,
          padding: "0 34px",
          height: 150,
          background: HOT,
          boxShadow: "8px 10px 18px rgba(60,18,0,.3)",
          display: "flex",
          alignItems: "center",
          fontFamily: pirata,
          fontSize: 190,
          lineHeight: 1,
          color: WHITE,
          WebkitTextStroke: `6px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: `8px 10px 0 ${INK}`,
          opacity: wordIn,
          translate: `${wob(step, "wm", 4)}px ${interpolate(wordIn, [0, 1], [60, 0]) + wob(step, "wm2", 4)}px`,
          rotate: `${-3 + wob(step, "wmr", 1)}deg`,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <>
      <Composition id="KeonhoReel" component={KeonhoReel} durationInFrames={8 * FPS} fps={FPS} width={1080} height={1350}
        defaultProps={{ frames: FRAMES, word: "keonho", arabic: "ملهمي" }} />
      <Composition id="JusenhoReel" component={KeonhoReel} durationInFrames={8 * FPS} fps={FPS} width={1080} height={1350}
        defaultProps={{ frames: JSH, word: "jusenho", arabic: "معًا" }} />
    </>
  );
};
