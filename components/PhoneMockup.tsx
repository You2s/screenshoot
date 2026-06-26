"use client";

import { forwardRef } from "react";

export type MessageNotif = {
  app: "imessage" | "whatsapp";
  sender: string;
  content: string;
  time: string;
  profilePic: string;
};

export type AppNotif = {
  title: string;
  time: string;
};

type Props = {
  theme: "dark" | "light";
  bgUrl: string;
  time: string;
  date: string;
  carrier: string;
  messageNotif: MessageNotif;
  appNotif: AppNotif;
  appIcon: string;
  appName: string;
};

// Generates SVG mask URL for the backdrop-blur-through-text effect
function timeMaskUrl(time: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="140"><text x="0" y="0" dominant-baseline="text-before-edge" font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" font-size="105" font-weight="700" letter-spacing="-5.25" fill="white">${time}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const PhoneMockup = forwardRef<HTMLDivElement, Props>(function PhoneMockup(
  { theme, bgUrl, time, date, carrier, messageNotif, appNotif, appIcon, appName },
  ref
) {
  const isDark = theme === "dark";
  const iconSuffix = isDark ? "light" : "dark";
  // ∶ is U+2236 RATIO — the iOS time separator (not a colon)
  const displayTime = time.replace(":", "∶");
  const maskUrl = timeMaskUrl(displayTime);

  const cardBg = "rgba(30,30,30,0.55)";
  const cardBorder = "1px solid rgba(255,255,255,0.15)";

  return (
    <div
      ref={ref}
      style={{
        width: 390,
        height: 844,
        overflow: "hidden",
        position: "relative",
        background: "#000",
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgUrl}
        alt=""
        crossOrigin="anonymous"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Top gradient so status bar + time are readable */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 220,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        zIndex: 10, pointerEvents: "none",
      }} />

      {/* Status bar */}
      <div style={{
        position: "relative", zIndex: 20,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "12px 32px 0", color: "#fff",
      }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{carrier}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/phone/network-${iconSuffix}.png`} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/phone/wifi-${iconSuffix}.png`} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/phone/battery-${iconSuffix}.png`} alt="" style={{ width: 25, height: 13, objectFit: "contain" }} />
        </div>
      </div>

      {/* Date + Time */}
      <div style={{ position: "relative", zIndex: 20, marginTop: 40, textAlign: "center", color: "#fff" }}>
        <span style={{ fontSize: 20, fontWeight: 400, fontFamily: "inherit" }}>{date}</span>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-block", position: "relative", lineHeight: 1 }}>
            {/* Backdrop blur shaped like the time text */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                maskImage: maskUrl,
                WebkitMaskImage: maskUrl,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "0 0",
                WebkitMaskPosition: "0 0",
                maskSize: "auto",
                WebkitMaskSize: "auto",
                pointerEvents: "none",
                transform: "translate(0px, -12px)",
              }}
            />
            <span style={{
              position: "relative",
              fontSize: 105,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "rgba(255,255,255,0.7)",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
              fontFamily: "inherit",
            }}>
              {displayTime}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications — anchored from bottom */}
      <div style={{
        position: "absolute", bottom: 120, left: 0, right: 0,
        width: "95%", margin: "0 auto",
        zIndex: 20, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {/* Message notification */}
        <div style={{
          borderRadius: 25, border: cardBorder,
          background: cardBg,
          backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
        }}>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Profile pic + badge */}
              <div style={{ width: 48, height: 48, flexShrink: 0, alignSelf: "center", position: "relative" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={messageNotif.profilePic} alt="" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {/* App badge */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={messageNotif.app === "whatsapp" ? "/img/whatsapp-icon.png" : "/img/imessage-icon.svg"}
                  alt=""
                  style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 20, height: 20, borderRadius: 6,
                    boxShadow: "0 0 0 1.5px rgba(255,255,255,0.15)",
                  }}
                />
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: -2 }}>
                  <span style={{ fontWeight: 600, fontSize: 17, color: "#fff" }}>{messageNotif.sender}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{messageNotif.time}</span>
                </div>
                <p style={{
                  fontSize: 17, lineHeight: 1.25, color: "rgba(255,255,255,0.9)",
                  display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden",
                  margin: 0, fontFamily: "inherit",
                }}>
                  {messageNotif.content}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* App (Shady) notification */}
        <div style={{
          borderRadius: 25, border: cardBorder,
          background: cardBg,
          backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
        }}>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, alignSelf: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={appIcon} alt={appName} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: -2 }}>
                  <span style={{ fontWeight: 600, fontSize: 17, color: "#fff" }}>{appName}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{appNotif.time}</span>
                </div>
                <p style={{ fontSize: 17, lineHeight: 1.4, color: "rgba(255,255,255,0.9)", margin: 0, fontFamily: "inherit" }}>
                  {appNotif.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom lock + camera buttons */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, zIndex: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px",
      }}>
        <BottomButton><LockIcon /></BottomButton>
        <BottomButton><CameraIcon /></BottomButton>
      </div>

      {/* Home indicator */}
      <div style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        width: 140, height: 5, background: "#fff", borderRadius: 9999, zIndex: 20,
      }} />
    </div>
  );
});

export default PhoneMockup;

function BottomButton({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 62, height: 62, borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="24" viewBox="0 0 10 24" fill="none" style={{ transform: "scale(1.2)" }}>
      <path d="M0 2.334V2.051C0 .684.667 0 2.002 0h5.83C9.167 0 9.834.684 9.834 2.051v.283H0zM4.004 23.379c-.658 0-1.159-.176-1.504-.527-.338-.345-.508-.853-.508-1.524V9.951c0-.534-.055-.986-.166-1.357a4.263 4.263 0 00-.449-1.006l-.557-.879a5.89 5.89 0 01-.596-1.103A3.788 3.788 0 010 4.385V3.613h9.834v.772c0 .449-.078.856-.234 1.22a5.89 5.89 0 01-.577 1.104l-.566.879a4.263 4.263 0 00-.45 1.006c-.11.371-.165.823-.165 1.357v11.377c0 .67-.17 1.179-.508 1.524-.339.351-.84.527-1.494.527H4.004zM3.135 10.83v3.105c0 .501.17.924.508 1.27.345.338.771.508 1.279.508.501 0 .924-.17 1.27-.508.344-.345.517-.769.517-1.27V10.83c0-.495-.173-.915-.518-1.26a1.72 1.72 0 00-1.27-.517c-.507 0-.934.172-1.278.517-.339.345-.508.765-.508 1.26zm1.787 4.258a.852.852 0 01-.83-.833c0-.319.11-.589.332-.81a1.1 1.1 0 01.83-.313c.325 0 .599.114.82.313.228.221.342.491.342.81a.86.86 0 01-.332.82 1.07 1.07 0 01-.83.332l-.332-.32z" fill="white" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ transform: "scale(1.4)" }}>
      <path d="M2.648 15.227c-.864 0-1.523-.224-1.976-.672C.224 14.112 0 13.464 0 12.61V4.39c0-.849.224-1.497.672-1.945C1.125 1.997 1.784 1.773 2.648 1.773h1.946c.307 0 .536-.034.687-.101.157-.068.331-.2.524-.398l.617-.64c.208-.214.432-.373.672-.477.24-.104.555-.156.945-.156h3.282c.396 0 .714.052.953.156.24.104.464.263.672.477l.617.64c.13.136.248.24.352.313.11.073.227.122.352.148.13.026.3.039.508.039h1.984c.86 0 1.516.224 1.969.672.453.448.68 1.096.68 1.945v8.219c0 .854-.227 1.503-.68 1.945-.453.448-1.11.672-1.969.672H2.648zM9.703 12.688c.578 0 1.12-.107 1.625-.32a4.24 4.24 0 001.328-.899c.386-.385.685-.83.899-1.336.218-.505.328-1.052.328-1.64 0-.777-.188-1.483-.563-2.118a4.116 4.116 0 00-1.507-1.508 4.013 4.013 0 00-2.11-.562c-.583 0-1.128.107-1.633.32a4.31 4.31 0 00-1.336.899 4.31 4.31 0 00-.898 1.336 4.255 4.255 0 00-.32 1.633c0 .588.107 1.135.32 1.64.219.506.518.95.898 1.337.386.38.834.68 1.336.898.505.214 1.05.32 1.633.32zm0-1.555a2.38 2.38 0 01-1.336-.406 2.72 2.72 0 01-.953-.953 2.536 2.536 0 01-.352-1.281c0-.49.117-.933.352-1.328.24-.401.557-.719.953-.953a2.38 2.38 0 011.336-.36c.484 0 .925.12 1.32.36.401.234.72.552.953.953.24.395.36.839.36 1.328 0 .49-.12.934-.36 1.328a2.64 2.64 0 01-.953.906 2.46 2.46 0 01-1.32.406zm4.672-7.063c0 .297.104.55.313.758.213.203.466.302.757.297.286 0 .534-.102.742-.305.214-.203.32-.453.32-.75 0-.281-.106-.528-.32-.742a1.029 1.029 0 00-.742-.32c-.291 0-.544.107-.757.32a1.044 1.044 0 00-.313.742z" fill="white" />
    </svg>
  );
}
