"use client";

import { useState } from "react";
import Link from "next/link";
import type { AppConfig } from "./page";
import PhoneMockup, { type MessageNotif, type AppNotif } from "@/components/PhoneMockup";

const WALLPAPERS = [
  { id: "couple-hands",  url: "/img/bg/couple-hands.jpg" },
  { id: "couple-cuddle", url: "/img/bg/couple-cuddle.webp" },
  { id: "couple-sky",    url: "/img/bg/couple-sky.jpg" },
  { id: "city",          url: "/img/bg/city.jpg" },
];

const PROFILE_PICS = [
  "/img/pp/man1.webp",
  "/img/pp/man2.webp",
  "/img/pp/man3.webp",
  "/img/pp/man4.webp",
  "/img/pp/man5.webp",
  "/img/pp/man6.webp",
  "/img/pp/women1.webp",
  "/img/pp/women2.webp",
  "/img/pp/women3.webp",
  "/img/pp/women4.webp",
  "/img/pp/woman5.webp",
];

const MESSAGE_PRESETS = [
  "hey... je sais que j'ai merdé. je suis vraiment désolé pour tout ce que je t'ai fait. j'ai changé je te jure",
  "tu me manques trop. j'ai arrêté les conneries promis. on peut se parler ?",
  "je pense à toi tous les jours. je suis clean maintenant, plus de mensonges. pardonne-moi s'il te plaît",
];

export default function Generator({ config }: { config: AppConfig }) {

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const defaultDate = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const [theme]                    = useState<"dark" | "light">("dark");
  const [time, setTime]            = useState(`${hh}:${mm}`);
  const [date, setDate]            = useState(defaultDate);
  const [carrier, setCarrier]      = useState("Orange F");
  const [wallpaperUrl, setWallpaperUrl]   = useState(WALLPAPERS[0].url);
  const [activeWallpaper, setActiveWallpaper] = useState(WALLPAPERS[0].id);
  const [capturing, setCapturing]  = useState(false);

  const [msgNotif, setMsgNotif] = useState<MessageNotif>({
    app: "whatsapp",
    sender: "Thomas",
    content: MESSAGE_PRESETS[0],
    time: "maintenant",
    profilePic: PROFILE_PICS[0],
  });

  const [appNotif, setAppNotif] = useState<AppNotif>({
    title: "Thomas vient de suivre @sofia_bts sur Instagram",
    time: "il y a 2 min",
  });

  function setSender(name: string) {
    setMsgNotif((n) => ({ ...n, sender: name }));
  }

  function pickWallpaper(w: typeof WALLPAPERS[0]) {
    setWallpaperUrl(w.url);
    setActiveWallpaper(w.id);
  }

  function handleCustomWallpaper(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setWallpaperUrl(URL.createObjectURL(file));
    setActiveWallpaper("custom");
  }

  async function handleScreenshot() {
    setCapturing(true);
    try {
      const { renderToCanvas } = await import("@/lib/renderToCanvas");
      const dataUrl = await renderToCanvas({
        bgUrl: wallpaperUrl,
        time,
        date,
        carrier,
        theme,
        messageNotif: msgNotif,
        appNotif,
        appIcon: config.icon,
        appName: config.name,
      });
      const link = document.createElement("a");
      link.download = `${config.id}-lockscreen.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a0a0a]">

      {/* ── Phone preview ── */}
      <div className="lg:flex-1 flex flex-col items-center justify-center py-10 px-4 gap-6 lg:sticky lg:top-0 lg:h-screen">
        <div id="phone-scale-wrapper" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
          <PhoneMockup
            theme={theme}
            bgUrl={wallpaperUrl}
            time={time}
            date={date}
            carrier={carrier}
            messageNotif={msgNotif}
            appNotif={appNotif}
            appIcon={config.icon}
            appName={config.name}
          />
        </div>
        <button
          onClick={handleScreenshot}
          disabled={capturing}
          className="bg-white text-black font-semibold text-sm px-7 py-3 rounded-full hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
        >
          {capturing ? "Génération…" : "↑ Télécharger le screenshot"}
        </button>
      </div>

      {/* ── Controls ── */}
      <div className="lg:w-[380px] lg:border-l border-t border-white/8 px-5 py-7 flex flex-col gap-7 overflow-y-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/30 hover:text-white/60 transition-colors text-sm">←</Link>
          <span className="text-sm font-semibold text-white/70">{config.name}</span>
        </div>

        {/* Wallpaper */}
        <Section label="Fond d'écran">
          <div className="grid grid-cols-4 gap-2">
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                onClick={() => pickWallpaper(w)}
                className="relative overflow-hidden rounded-xl border-2 transition-all"
                style={{
                  aspectRatio: "9/16",
                  borderColor: activeWallpaper === w.id ? "#fff" : "transparent",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <label
              className="relative overflow-hidden rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer bg-white/5 text-white/30 hover:text-white/60 transition-colors"
              style={{ aspectRatio: "9/16", borderColor: activeWallpaper === "custom" ? "#fff" : "rgba(255,255,255,0.15)" }}
            >
              <span className="text-2xl">+</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCustomWallpaper} />
            </label>
          </div>
        </Section>

        {/* Message */}
        <Section label="Message (ex)">
          <div className="flex gap-2 mb-1">
            {(["whatsapp", "imessage"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setMsgNotif((n) => ({ ...n, app: a }))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  msgNotif.app === a
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                }`}
              >
                {a === "whatsapp" ? "WhatsApp" : "iMessage"}
              </button>
            ))}
          </div>

          {/* Profile pic picker */}
          <div className="flex gap-2 flex-wrap py-1">
            {PROFILE_PICS.map((pp) => (
              <button
                key={pp}
                onClick={() => setMsgNotif((n) => ({ ...n, profilePic: pp }))}
                className="rounded-full overflow-hidden border-2 transition-all shrink-0"
                style={{
                  width: 36, height: 36,
                  borderColor: msgNotif.profilePic === pp ? "#fff" : "transparent",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pp} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <input
            value={msgNotif.sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Prénom"
            className="input"
          />
          <textarea
            value={msgNotif.content}
            onChange={(e) => setMsgNotif((n) => ({ ...n, content: e.target.value }))}
            placeholder="Contenu du message"
            rows={3}
            className="input resize-none"
          />
          <div className="flex flex-col gap-1">
            {MESSAGE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setMsgNotif((n) => ({ ...n, content: p }))}
                className="text-left text-xs text-white/35 hover:text-white/65 hover:bg-white/5 px-3 py-2 rounded-lg transition-all"
              >
                "{p.slice(0, 65)}…"
              </button>
            ))}
          </div>
        </Section>

        {/* App notification */}
        <Section label={`Notification ${config.name}`}>
          <input
            value={appNotif.title}
            onChange={(e) => setAppNotif((n) => ({ ...n, title: e.target.value }))}
            placeholder="Thomas vient de suivre @sofia_bts"
            className="input"
          />
        </Section>

        {/* Advanced collapse */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-[10px] font-bold uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors list-none select-none">
            <span>Détails avancés</span>
            <span className="text-white/20 group-open:rotate-180 transition-transform duration-200 text-base">⌄</span>
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            <LabeledInput label="Heure du message">
              <input
                value={msgNotif.time}
                onChange={(e) => setMsgNotif((n) => ({ ...n, time: e.target.value }))}
                placeholder="maintenant"
                className="input"
              />
            </LabeledInput>
            <LabeledInput label={`Heure notif ${config.name}`}>
              <input
                value={appNotif.time}
                onChange={(e) => setAppNotif((n) => ({ ...n, time: e.target.value }))}
                placeholder="il y a 2 min"
                className="input"
              />
            </LabeledInput>
            <LabeledInput label="Heure affichée">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input"
              />
            </LabeledInput>
            <LabeledInput label="Date affichée">
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Vendredi 26 juin"
                className="input"
              />
            </LabeledInput>
            <LabeledInput label="Opérateur">
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Orange F"
                className="input"
              />
            </LabeledInput>
          </div>
        </details>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</div>
      {children}
    </div>
  );
}

function LabeledInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] text-white/35 font-medium">{label}</span>
      {children}
    </div>
  );
}
