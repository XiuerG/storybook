"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";
import kdramaScene from "../assets/kdrama-scene.png";
import youtubeScene from "../assets/youtube-scene.png";
import varietyScene from "../assets/variety-scene.png";

/* ════════════════════════════════════════════════════════════
   PAGE 2 —The Language That Stayed
   ────────────────────────────────────────────────────────────
   A dark room with a soft glowing screen. The reader drags a
   tuning bar through five Korean channels — variety show,
   YouTube, drama, podcast, K-pop. The screen and the room shift
   to match each channel. Variety, Korean YouTube, and K-drama use
   still photos inside the monitor; the variety preset adds looping
   한글 danmaku (ㅋㅋㅋ) on top of its image. K-pop uses a mini player on
   the left page and scrolling lyrics on the right.
================================================================ */

const TITLE = "The Language That Stayed";
const KO_SUB = "머물러 준 언어";
const NARR_BOT_1 = "The screen was not an escape.";
const NARR_BOT_2 = "It was a language that arrived already warm.";
/** Right-page bottom lines when K-pop (Spring Day) channel is active */
const KPOP_PAGE_LINE_1 = "A song for someone far away.";
const KPOP_PAGE_LINE_2 = "A rhythm that stayed.";
const HINT = "Drag to tune the room";

/* ════════════════════════════════════════════════════════════
   CHANNELS
================================================================ */
type ChannelId = "variety" | "youtube" | "drama" | "podcast" | "kpop";
type Channel = {
  id: ChannelId;
  name: string;
  ko: string;
  /** target slider position 0..1 */
  t: number;
  caption: string;
};
const CHANNELS: Channel[] = [
  { id: "variety", name: "Variety Show",   ko: "예능",   t: 0.08, caption: "The joke did not need translating.The room laughed with me." },
  { id: "youtube", name: "Korean YouTube", ko: "유튜브", t: 0.30, caption: "Korean YouTube as Everyday Companionship." },
  { id: "drama",   name: "K-drama",        ko: "드라마", t: 0.52, caption: "A feeling I recognized before the subtitle ended." },
  { id: "podcast", name: "Podcast",        ko: "팟캐스트", t: 0.74, caption: "Two voices I did not know. But their way of speaking felt familiar." },
  {
    id: "kpop",
    name: "BTS — Spring Day",
    ko: "봄날",
    t: 0.94,
    caption: "A song for someone far away. A rhythm that stayed.",
  },
];

/** Right-page lyrics when K-pop channel is active — BTS 「봄날」(Spring Day) */
const KPOP_LYRIC_LINES = [
  "보고 싶다",
  "이렇게 말하니까",
  "더 보고 싶다",
  "너희 사진을 보고 있어도",
  "보고 싶다",
  "너무 야속한 시간",
  "나는 우리가 밉다",
  "이젠 얼굴 한 번 보는 것 조차",
  "힘들어진 우리가",
  "여긴 온통 겨울 뿐이야",
  "8월에도 겨울이 와",
  "마음은 시간을 달려가네",
  "홀로 남은 설국열차",
  "니 손 잡고 지구",
  "반대편까지 가",
  "겨울을 끝내고파",
  "그리움들이 얼마나",
  "눈처럼 내려야",
  "그 봄날이 올까",
  "Friend",
  "허공을 떠도는",
  "작은 먼지처럼",
  "날리는 눈이 나라면",
  "조금 더 빨리 네게",
  "닿을 수 있을 텐데",
  "눈꽃이 떨어져요",
  "또 조금씩 멀어져요",
  "보고 싶다 (보고 싶다)",
  "보고 싶다 (보고 싶다)",
  "얼마나 기다려야",
  "또 몇 밤을 더 새워야",
  "널 보게 될까 (널 보게 될까)",
  "만나게 될까 (만나게 될까)",
  "추운 겨울 끝을 지나",
  "다시 봄날이 올 때까지",
  "꽃 피울 때까지",
  "그곳에 좀 더",
  "머물러줘",
  "머물러줘",
  "니가 변한 건지",
  "(니가 변한 건지)",
  "아니면 내가 변한 건지",
  "(아니면 내가 변한 건지)",
  "이 순간 흐르는",
  "시간조차 미워",
  "우리가 변한 거지 뭐",
  "모두가 그런 거지 뭐",
  "그래 밉다 니가",
  "넌 떠났지만",
  "단 하루도 너를",
  "잊은 적이 없었지 난",
  "솔직히 보고 싶은데",
  "이만 너를 지울게",
  "그게 널 원망하기보단",
  "덜 아프니까",
  "시린 널 불어내 본다",
  "연기처럼",
  "하얀 연기처럼",
  "말로는 지운다 해도",
  "사실 난 아직",
  "널 보내지 못하는데",
  "눈꽃이 떨어져요",
  "또 조금씩 멀어져요",
  "보고 싶다 (보고 싶다)",
  "보고 싶다 (보고 싶다)",
  "얼마나 기다려야",
  "또 몇 밤을 더 새워야",
  "널 보게 될까 (널 보게 될까)",
  "만나게 될까 (만나게 될까)",
  "추운 겨울 끝을 지나",
  "다시 봄날이 올 때까지",
  "꽃 피울 때까지",
  "그곳에 좀 더",
  "머물러줘",
  "머물러줘",
  "You know it all",
  "You're my best friend",
  "아침은 다시 올 거야",
  "어떤 어둠도",
  "어떤 계절도",
  "영원할 순 없으니까",
  "벚꽃이 피나봐요",
  "이 겨울도 끝이 나요",
  "보고 싶다 (보고 싶다)",
  "보고 싶다 (보고 싶다)",
  "조금만 기다리면 (기다리면)",
  "며칠 밤만 더 새우면",
  "만나러 갈게 (만나러 갈게)",
  "데리러 갈게 (데리러 갈게)",
  "추운 겨울 끝을 지나",
  "다시 봄날이 올 때까지",
  "꽃 피울 때까지",
  "그곳에 좀 더",
  "머물러줘",
  "머물러줘",
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE — shared slider position 0..1
================================================================ */
let _t = 0.50;
let _touched = false;
const _subs = new Set<() => void>();
function _notify() { _subs.forEach(fn => fn()); }
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _t = 0.50;
    _touched = false;
    _notify();
  });
}
function _setT(v: number) {
  _t = Math.max(0, Math.min(1, v));
  _touched = true;
  _notify();
}
function useTuner() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return { t: _t, touched: _touched };
}

function activeChannel(t: number): Channel {
  return CHANNELS.reduce((best, c) =>
    Math.abs(c.t - t) < Math.abs(best.t - t) ? c : best
  );
}

/* ════════════════════════════════════════════════════════════
   K-POP — right page: vertical scrolling lyrics (player on left)
================================================================ */
const KPOP_LYRIC_ROW = 36;
const KPOP_LYRIC_VISIBLE = 7;

function KpopLyricsPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(n => (n + 1) % KPOP_LYRIC_LINES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  const parentH = KPOP_LYRIC_VISIBLE * KPOP_LYRIC_ROW;
  const innerH = KPOP_LYRIC_LINES.length * KPOP_LYRIC_ROW;
  const rawY = parentH / 2 - (active + 0.5) * KPOP_LYRIC_ROW;
  const minY = parentH - innerH;
  const y = Math.max(minY, Math.min(0, rawY));

  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        bottom: "26%",
        left: "10%",
        right: "10%",
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 14,
          background:
            "repeating-linear-gradient(180deg, rgba(200,180,140,0.35) 0 3px, transparent 3px 6px)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 14,
          background:
            "repeating-linear-gradient(180deg, rgba(200,180,140,0.35) 0 3px, transparent 3px 6px)",
        }}
      />

      <div
        style={{
          position: "relative",
          height: parentH,
          marginTop: "0.5rem",
          overflow: "hidden",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{ y: y }}
          transition={{ type: "spring", stiffness: 140, damping: 24 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            width: "100%",
          }}
        >
          {KPOP_LYRIC_LINES.map((line, idx) => {
            const on = idx === active;
            return (
              <div
                key={idx}
                style={{
                  height: KPOP_LYRIC_ROW,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {on ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      maxWidth: "28ch",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        maxWidth: 72,
                        background:
                          "linear-gradient(to right, transparent, rgba(230,190,130,0.85))",
                      }}
                    />
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "rgba(230,200,140,0.95)",
                        boxShadow: "0 0 8px rgba(255,200,120,0.65)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "0.88rem",
                        letterSpacing: "0.06em",
                        color: "rgba(255,248,235,0.98)",
                        textShadow:
                          "0 0 18px rgba(255,200,140,0.45), 0 0 4px rgba(0,0,0,0.9)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {line}
                    </span>
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "rgba(230,200,140,0.95)",
                        boxShadow: "0 0 8px rgba(255,200,120,0.65)",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        maxWidth: 72,
                        background:
                          "linear-gradient(to left, transparent, rgba(230,190,130,0.85))",
                      }}
                    />
                  </div>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "0.62rem",
                      letterSpacing: "0.04em",
                      color:
                        Math.abs(idx - active) === 1
                          ? "rgba(210,200,230,0.52)"
                          : "rgba(180,170,210,0.32)",
                      textShadow: "0 0 8px rgba(0,0,0,0.75)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {line}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div
        style={{
          marginTop: "0.85rem",
          textAlign: "center",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.62rem",
          letterSpacing: "0.14em",
          color: "rgba(220,200,235,0.45)",
          textTransform: "uppercase",
        }}
      >
        BTS · 봄날
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const NoTranslationPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <NTLeft forwardedRef={ref} />;
    return <NTRight forwardedRef={ref} />;
  }
);
NoTranslationPage.displayName = "NoTranslationPage";
export default NoTranslationPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + glowing screen + tuning slider
================================================================ */
function NTLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { t, touched } = useTuner();
  const channel = activeChannel(t);

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={3}
      style={{ background: "#080714" }}
    >
      <RoomBackdrop side="left" channel={channel} />

      {/* Title block */}
      <div
        style={{
          position: "absolute",
          top: "2.6rem",
          left: "2.5rem",
          right: "2.5rem",
          zIndex: 9,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "0.66rem",
            letterSpacing: "0.32em",
            color: "rgba(210,200,235,0.55)",
            marginBottom: "0.7rem",
          }}
        >
          {KO_SUB}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.5, ease: "easeOut" }}
          className="page-title-spread"
          style={{
            color: "rgba(235,230,250,0.92)",
            textShadow: "0 0 22px rgba(0,0,0,0.7)",
            margin: 0,
          }}
        >
          {TITLE}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.55, scaleX: 1 }}
          transition={{ duration: 1.3, delay: 1.2 }}
          style={{
            width: "2rem",
            height: 1,
            background: "rgba(220,200,170,0.5)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* The glowing screen */}
      <Screen channel={channel} side="left" />

      {/* Tuning slider — at the bottom of the left page */}
      <Tuner />

      {!touched && (
        <InteractionHint
          emphasis
          style={{
            bottom: "1.6rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(220,210,235,0.85)",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — ambient channel haze + caption + main copy
================================================================ */
function NTRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { t, touched } = useTuner();
  const channel = activeChannel(t);

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={4}
      style={{ background: "#080714" }}
    >
      <RoomBackdrop side="right" channel={channel} />

      {channel.id !== "kpop" && <SubtitleDrift channel={channel} />}

      {channel.id === "kpop" ? (
        <KpopLyricsPanel />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 9,
            pointerEvents: "none",
            opacity: touched ? 1 : 0.5,
            transition: "opacity 0.8s ease",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: "1.2rem",
                  letterSpacing: "0.32em",
                  color: "rgba(245,230,210,0.94)",
                  textShadow:
                    "0 0 18px rgba(255,180,120,0.45), 0 0 4px rgba(0,0,0,0.85)",
                  marginBottom: "0.6rem",
                }}
              >
                {channel.ko}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "0.7rem",
                  letterSpacing: "0.16em",
                  color: "rgba(220,210,235,0.7)",
                  textTransform: "uppercase",
                }}
              >
                {channel.name}
              </div>
              <div
                style={{
                  marginTop: "1.0rem",
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "0.74rem",
                  lineHeight: 1.6,
                  color: "rgba(225,215,200,0.85)",
                  textShadow: "0 0 12px rgba(0,0,0,0.85)",
                  maxWidth: "22ch",
                  margin: "1.0rem auto 0",
                }}
              >
                {channel.caption}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom narrative */}
      <div
        style={{
          position: "absolute",
          bottom: "5rem",
          right: "2.5rem",
          left: "2.5rem",
          textAlign: "right",
          zIndex: 9,
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: "rgba(245,225,200,0.92)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {channel.id === "kpop" ? KPOP_PAGE_LINE_1 : NARR_BOT_1}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.0 }}
          style={{
            margin: "0.5rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            lineHeight: 1.7,
            color: "rgba(220,200,170,0.78)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {channel.id === "kpop" ? KPOP_PAGE_LINE_2 : NARR_BOT_2}
        </motion.p>
      </div>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOM BACKDROP — color shifts by channel
================================================================ */
function RoomBackdrop({
  side,
  channel,
}: {
  side: "left" | "right";
  channel: Channel;
}) {
  // Channel tint
  const tint =
    channel.id === "variety"
      ? "rgba(255,200,140,0.20)"
      : channel.id === "youtube"
      ? "rgba(220,150,160,0.18)"
      : channel.id === "drama"
      ? "rgba(255,170,120,0.20)"
      : channel.id === "podcast"
      ? "rgba(150,180,220,0.18)"
      : "rgba(190,140,235,0.22)";
  const cx = side === "left" ? "70%" : "30%";

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at ${cx} 50%, ${tint} 0%, transparent 70%)`,
          transition: "background 0.9s ease",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #06060f 0%, #08071a 60%, #07061a 100%)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Faint scanlines for the screen-room atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, rgba(180,200,240,0.02) 0 1px, transparent 1px 4px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 50%, rgba(2,3,10,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   SCREEN — the central glowing monitor on the left page
================================================================ */
function Screen({ channel, side }: { channel: Channel; side: "left" | "right" }) {
  if (side !== "left") return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "32%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "84%",
        height: "36%",
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      {/* Outer halo */}
      <div
        style={{
          position: "absolute",
          inset: -24,
          borderRadius: 12,
          background:
            "radial-gradient(ellipse, rgba(180,180,235,0.16) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      {/* Bezel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          background:
            "linear-gradient(180deg, rgba(40,42,58,0.92) 0%, rgba(20,22,34,0.92) 100%)",
          border: "1px solid rgba(170,180,210,0.28)",
          boxShadow:
            "0 18px 36px rgba(0,0,0,0.7), inset 0 0 18px rgba(0,0,0,0.6)",
        }}
      />
      {/* Glass */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: 4,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(15,18,30,0.95) 0%, rgba(10,12,22,0.95) 100%)",
        }}
      >
        {/* Channel-specific visualization */}
        <AnimatePresence mode="wait">
          <motion.div
            key={channel.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <ChannelViz id={channel.id} />
          </motion.div>
        </AnimatePresence>
        {/* Scan glow sweeping */}
        <motion.div
          animate={{ y: [-30, 220, -30] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 24,
            background:
              "linear-gradient(180deg, transparent, rgba(180,200,240,0.10), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>
      {/* Stand */}
      <div
        style={{
          position: "absolute",
          bottom: -14,
          left: "40%",
          width: "20%",
          height: 14,
          background:
            "linear-gradient(180deg, rgba(40,42,58,0.92) 0%, rgba(20,22,34,0.92) 100%)",
          borderRadius: "2px 2px 6px 6px",
        }}
      />
    </div>
  );
}

/* ─── Channel-specific visualizations ────────────────────── */
function ChannelViz({ id }: { id: ChannelId }) {
  if (id === "variety") return <VarietyViz />;
  if (id === "youtube") return <YouTubeViz />;
  if (id === "drama") return <DramaViz />;
  if (id === "podcast") return <PodcastViz />;
  return <KpopViz />;
}

function VarietyViz() {
  const dmText: React.CSSProperties = {
    fontFamily: "var(--font-serif)",
    fontWeight: 600,
    letterSpacing: "0.14em",
    color: "rgba(255,238,200,0.98)",
    textShadow:
      "0 0 10px rgba(255,190,100,0.95), 0 0 22px rgba(255,160,60,0.45), 0 0 2px rgba(0,0,0,0.95)",
  };

  const rows: {
    text: string;
    top: string;
    duration: number;
    delay: number;
    fontSize: string;
    weight?: number;
  }[] = [
    { text: "ㅋㅋㅋ ㅋㅋㅋ ㅋㅋㅋ ㅋㅋㅋ ", top: "7%", duration: 12, delay: 0, fontSize: "0.7rem", weight: 700 },
    { text: "ㅋㅋㅋㅋ 헐 ㅋㅋㅋ 대박 ", top: "22%", duration: 16, delay: 0.8, fontSize: "0.58rem" },
    { text: "ㅋㅋ ㅋㅋㅋ ㅋㅋ ㅋㅋㅋ ㅋㅋ ", top: "36%", duration: 14, delay: 2.2, fontSize: "0.64rem" },
    { text: "진짜? ㅋㅋㅋ 아니 ㅋㅋㅋ ", top: "50%", duration: 18, delay: 0.3, fontSize: "0.56rem" },
    { text: "ㅋㅋㅋㅋㅋ ㅋㅋㅋㅋㅋ ", top: "64%", duration: 11, delay: 1.5, fontSize: "0.62rem", weight: 700 },
    { text: "ㅋㅋㅋ ~~~~ ㅋㅋㅋ ㅋㅋㅋ ", top: "78%", duration: 15, delay: 3, fontSize: "0.6rem" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#0a0608",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-12px",
          backgroundImage: `url(${varietyScene.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(8,4,6,0.3) 0%, transparent 42%, rgba(4,2,6,0.52) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {rows.map((r, i) => (
          <div key={i} className="book3-variety-dm-track" style={{ top: r.top }}>
            <div
              className="book3-variety-marquee"
              style={
                {
                  "--book3-dm-duration": `${r.duration}s`,
                  "--book3-dm-delay": `${r.delay}s`,
                } as React.CSSProperties
              }
            >
              <span
                style={{
                  ...dmText,
                  fontSize: r.fontSize,
                  fontWeight: r.weight ?? 600,
                }}
              >
                {r.text}
              </span>
              <span
                style={{
                  ...dmText,
                  fontSize: r.fontSize,
                  fontWeight: r.weight ?? 600,
                }}
              >
                {r.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function YouTubeViz() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#0a080e",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-12px",
          backgroundImage: `url(${youtubeScene.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,4,12,0.28) 0%, transparent 38%, rgba(4,3,10,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function DramaViz() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#060410",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-12px",
          backgroundImage: `url(${kdramaScene.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,4,14,0.35) 0%, transparent 40%, rgba(2,2,10,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ opacity: [0, 0.92, 0.92, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: 14,
          left: "10%",
          right: "10%",
          textAlign: "center",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "0.62rem",
          color: "rgba(255,255,255,0.95)",
          textShadow: "0 0 10px rgba(0,0,0,0.9)",
          letterSpacing: "0.08em",
        }}
      >
        진심이야...
      </motion.div>
    </div>
  );
}

function PodcastViz() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(150,180,220,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Two speaker avatars */}
      {[
        { x: 28, color: "rgba(180,200,235,0.72)" },
        { x: 72, color: "rgba(220,180,200,0.72)" },
      ].map((s, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
          transition={{
            duration: 1.4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
          style={{
            position: "absolute",
            top: "26%",
            left: `${s.x}%`,
            transform: "translate(-50%, -50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: s.color,
            boxShadow: `0 0 14px ${s.color}`,
          }}
        />
      ))}
      {/* Waveform bars */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: "10%",
          right: "10%",
          height: 28,
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [4, 10 + (i % 4) * 5, 4] }}
            transition={{
              duration: 0.9 + (i % 5) * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.04,
            }}
            style={{
              width: 2,
              background: "rgba(180,200,235,0.78)",
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function KpopViz() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 95% 90% at 50% 42%, rgba(160,110,210,0.38) 0%, rgba(40,22,58,0.55) 55%, rgba(8,4,14,0.92) 100%)",
        }}
      />
      {/* Concentric “visualizer” rings */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.06 + i * 0.02, 1],
            opacity: [0.22 + i * 0.08, 0.45 + i * 0.05, 0.22 + i * 0.08],
          }}
          transition={{
            duration: 2.4 + i * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            width: 44 + i * 18,
            height: 44 + i * 18,
            marginLeft: -(22 + i * 9),
            marginTop: -(22 + i * 9),
            borderRadius: "50%",
            border: `1px solid rgba(220,180,255,${0.2 + i * 0.06})`,
            boxShadow: `inset 0 0 12px rgba(200,160,255,${0.08 + i * 0.03})`,
          }}
        />
      ))}
      <motion.div
        animate={{ opacity: [0.5, 0.95, 0.5], scale: [0.9, 1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          background: "rgba(255,220,200,0.95)",
          boxShadow: "0 0 14px rgba(255,200,160,0.85), 0 0 28px rgba(200,140,255,0.45)",
        }}
      />

      {/* Track meta */}
      <div
        style={{
          position: "absolute",
          top: "58%",
          left: "8%",
          right: "8%",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "0.56rem",
            letterSpacing: "0.12em",
            color: "rgba(245,235,255,0.95)",
            textShadow: "0 0 10px rgba(200,160,255,0.35)",
          }}
        >
          봄날
        </div>
        <div
          style={{
            marginTop: 2,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.42rem",
            letterSpacing: "0.2em",
            color: "rgba(200,190,225,0.55)",
            textTransform: "uppercase",
          }}
        >
          BTS · Spring Day
        </div>
      </div>

      {/* Progress */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "10%",
          right: "10%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.38rem",
            letterSpacing: "0.12em",
            color: "rgba(200,190,220,0.5)",
            marginBottom: 4,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
          }}
        >
          <span>02:18</span>
          <span>04:34</span>
        </div>
        <div
          style={{
            height: 2,
            borderRadius: 1,
            background: "rgba(80,70,110,0.6)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "51%",
              borderRadius: 1,
              background:
                "linear-gradient(90deg, rgba(230,190,140,0.85), rgba(200,160,240,0.75))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "51%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,235,210,1) 0%, rgba(220,170,130,0.95) 70%)",
              boxShadow: "0 0 8px rgba(255,200,140,0.7)",
            }}
          />
        </div>
      </div>

      {/* Transport row */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "8%",
          right: "8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          pointerEvents: "none",
          color: "rgba(230,200,160,0.75)",
          fontSize: "0.52rem",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ opacity: 0.55 }}>⟲</span>
        <span style={{ opacity: 0.65 }}>‹</span>
        <span
          style={{
            display: "inline-flex",
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px solid rgba(230,200,160,0.5)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.45rem",
            paddingLeft: 1,
            boxShadow: "0 0 12px rgba(200,160,255,0.25)",
          }}
        >
          ❚❚
        </span>
        <span style={{ opacity: 0.65 }}>›</span>
        <span style={{ opacity: 0.55 }}>↻</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TUNER — horizontal slider with 5 channel ticks
================================================================ */
function Tuner() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const setFromEvent = useCallback((cx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    _setT(t);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setActive(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setFromEvent(e.clientX);
    },
    [setFromEvent]
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!active) return;
      setFromEvent(e.clientX);
    },
    [active, setFromEvent]
  );
  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setActive(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  const { t } = useTuner();

  return (
    <div
      style={{
        position: "absolute",
        bottom: "5.5rem",
        left: "2.5rem",
        right: "2.5rem",
        zIndex: 8,
      }}
    >
      {/* Channel ticks above track */}
      <div
        style={{
          position: "relative",
          height: 18,
          marginBottom: 10,
        }}
      >
        {CHANNELS.map(c => {
          const isActive = Math.abs(c.t - t) < 0.10;
          return (
            <div
              key={c.id}
              style={{
                position: "absolute",
                left: `${c.t * 100}%`,
                bottom: 0,
                transform: "translateX(-50%)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.5rem",
                letterSpacing: "0.16em",
                color: isActive
                  ? "rgba(245,225,200,0.96)"
                  : "rgba(180,180,210,0.42)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textShadow: isActive
                  ? "0 0 8px rgba(255,180,100,0.6)"
                  : "none",
                transition: "color 0.3s ease, text-shadow 0.3s ease",
              }}
            >
              {c.name}
            </div>
          );
        })}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        data-book-interactive
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "relative",
          width: "100%",
          height: 22,
          cursor: active ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        {/* Track line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            transform: "translateY(-50%)",
            background:
              "linear-gradient(to right, rgba(140,160,210,0.2) 0%, rgba(220,170,140,0.4) 50%, rgba(220,170,210,0.3) 100%)",
          }}
        />
        {/* Tick marks */}
        {CHANNELS.map(c => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              top: "50%",
              left: `${c.t * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 1,
              height: 8,
              background: "rgba(180,180,210,0.45)",
            }}
          />
        ))}
        {/* Handle */}
        <motion.div
          animate={{ left: `${t * 100}%` }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,225,200,0.96) 0%, rgba(220,170,140,0.95) 60%, rgba(160,110,80,0.95) 100%)",
            boxShadow:
              "0 0 14px rgba(255,180,120,0.6), 0 0 28px rgba(255,160,100,0.32)",
            border: "1px solid rgba(255,210,170,0.85)",
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SUBTITLE DRIFT — Korean speech fragments drifting on right page
================================================================ */
function SubtitleDrift({ channel }: { channel: Channel }) {
  // Different fragments per channel
  const pools: Record<ChannelId, string[]> = {
    variety: ["ㅋㅋㅋ", "헐", "대박", "아진짜", "잠깐만요"],
    youtube: ["오늘은요", "여러분", "구독", "안녕", "그래서"],
    drama:   ["진심이야", "보고싶어", "왜그래", "괜찮아", "기다릴게"],
    podcast: ["근데 있잖아", "그래서요", "맞아맞아", "저도요", "음..."],
    kpop:    ["보고 싶다", "Friend", "눈꽃", "그 봄날이 올까", "설국열차"],
  };
  const fragments = pools[channel.id];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="popLayout">
        {fragments.map((frag, i) => (
          <motion.div
            key={`${channel.id}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: [0, 0.55, 0.55, 0],
              y: [16, 0, -8, -28],
            }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              delay: i * 1.2,
              repeat: Infinity,
              times: [0, 0.18, 0.78, 1],
            }}
            style={{
              position: "absolute",
              left: `${10 + ((i * 19) % 75)}%`,
              top: `${60 + (i % 3) * 8}%`,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.7rem",
              color: "rgba(225,215,200,0.65)",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              textShadow: "0 0 10px rgba(0,0,0,0.85)",
            }}
          >
            {frag}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
