import type { MessageNotif, AppNotif } from "@/components/PhoneMockup";

const W = 390;
const H = 844;
const S = 3; // retina scale

async function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = src.startsWith("/") ? window.location.origin + src : src;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // retry without crossOrigin (blob URLs)
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = () => resolve(null);
      img2.src = url;
    };
    img.src = url;
  });
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
  maxLines = 99
): number {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  let count = 0;
  for (const word of words) {
    if (count >= maxLines) break;
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lh;
      count++;
    } else {
      line = test;
    }
  }
  if (line && count < maxLines) {
    ctx.fillText(line, x, cy);
    cy += lh;
  }
  return cy;
}

function measureLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number
): number {
  const words = text.split(" ");
  let line = "";
  let count = 1;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      line = word;
      count++;
    } else {
      line = test;
    }
  }
  return count;
}

function clipCircle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  d: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x, y, d, d);
  ctx.restore();
}

function clipRR(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.save();
  rr(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
}

export interface RenderParams {
  bgUrl: string;
  time: string;
  date: string;
  carrier: string;
  theme: "dark" | "light";
  messageNotif: MessageNotif;
  appNotif: AppNotif;
  appIcon: string;
  appName: string;
}

export async function renderToCanvas(p: RenderParams): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(S, S);

  const FONT = `-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;

  // ── 1. Background ──────────────────────────────────────────────────────────
  const bgImg = await loadImg(p.bgUrl);
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
  }

  // ── 2. Gradient overlay ────────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, 0, 220);
  grad.addColorStop(0, "rgba(0,0,0,0.72)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 220);

  // ── 3. Status bar ──────────────────────────────────────────────────────────
  ctx.fillStyle = "#fff";
  ctx.font = `500 14px ${FONT}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(p.carrier, 32, 15);

  const [netImg, wifiImg, battImg] = await Promise.all([
    loadImg("/img/phone/network-light.png"),
    loadImg("/img/phone/wifi-light.png"),
    loadImg("/img/phone/battery-light.png"),
  ]);
  const battX = W - 32 - 25;
  const wifiX = battX - 8 - 16;
  const netX = wifiX - 8 - 16;
  if (battImg) ctx.drawImage(battImg, battX, 19, 25, 13);
  if (wifiImg) ctx.drawImage(wifiImg, wifiX, 17, 16, 16);
  if (netImg) ctx.drawImage(netImg, netX, 17, 16, 16);

  // ── 4. Date ────────────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.font = `400 20px ${FONT}`;
  ctx.fillStyle = "#fff";
  ctx.fillText(p.date, W / 2, 72);

  // ── 5. Time ────────────────────────────────────────────────────────────────
  const displayTime = p.time.replace(":", "∶"); // ∶
  ctx.font = `700 105px ${FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillText(displayTime, W / 2, 97);

  // ── 6. Notification cards (anchored bottom:120) ────────────────────────────
  const cardPadX = 10; // (390 * 0.025 ≈ 10)
  const cardW = W - cardPadX * 2;
  const textFont = `400 17px ${FONT}`;
  const boldFont = `600 17px ${FONT}`;
  const smallFont = `400 14px ${FONT}`;

  // Pre-load images for cards
  const [profileImg, appIconImg, badgeImg] = await Promise.all([
    loadImg(p.messageNotif.profilePic),
    loadImg(p.appIcon),
    loadImg(p.messageNotif.app === "whatsapp" ? "/img/whatsapp-icon.png" : "/img/imessage-icon.svg"),
  ]);

  // Measure card 1 height (message card)
  const msgContentW = cardW - 16 - 48 - 12 - 16; // left_pad + pfp + gap + right_pad
  ctx.font = textFont;
  const msgLines = measureLines(ctx, p.messageNotif.content, msgContentW);
  const card1ContentH = Math.max(48, 21 + msgLines * 21);
  const card1H = 12 + card1ContentH + 12;

  // Measure card 2 height (app card)
  const appContentW = cardW - 16 - 44 - 12 - 16;
  const appLines = measureLines(ctx, p.appNotif.title, appContentW);
  const card2ContentH = Math.max(44, 21 + appLines * 21);
  const card2H = 12 + card2ContentH + 12;

  const totalCardsH = card1H + 8 + card2H;
  const cardsBottom = H - 120;
  const card1Y = cardsBottom - totalCardsH;
  const card2Y = card1Y + card1H + 8;

  // Draw card helper
  function drawCardBg(y: number, h: number) {
    ctx.fillStyle = "rgba(30,30,30,0.88)";
    rr(ctx, cardPadX, y, cardW, h, 25);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    rr(ctx, cardPadX, y, cardW, h, 25);
    ctx.stroke();
  }

  // ── Card 1: Message ────────────────────────────────────────────────────────
  drawCardBg(card1Y, card1H);

  const c1innerX = cardPadX + 16;
  const c1innerY = card1Y + 12;

  // Profile pic (circle 48x48)
  if (profileImg) {
    clipCircle(ctx, profileImg, c1innerX, c1innerY, 48);
  } else {
    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.arc(c1innerX + 24, c1innerY + 24, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  // Badge (WhatsApp/iMessage) bottom-right of pfp
  if (badgeImg) {
    clipRR(ctx, badgeImg, c1innerX + 48 - 20, c1innerY + 48 - 20, 20, 20, 5);
  }

  // Sender name + time
  const c1textX = c1innerX + 48 + 12;
  ctx.font = boldFont;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(p.messageNotif.sender, c1textX, c1innerY);

  ctx.font = smallFont;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "right";
  ctx.fillText(p.messageNotif.time, cardPadX + cardW - 16, c1innerY + 2);

  // Message text
  ctx.font = textFont;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "left";
  wrapText(ctx, p.messageNotif.content, c1textX, c1innerY + 21, msgContentW, 21);

  // ── Card 2: App ────────────────────────────────────────────────────────────
  drawCardBg(card2Y, card2H);

  const c2innerX = cardPadX + 16;
  const c2innerY = card2Y + 12;

  // App icon (44x44 rounded)
  if (appIconImg) {
    clipRR(ctx, appIconImg, c2innerX, c2innerY, 44, 44, 10);
  } else {
    ctx.fillStyle = "#333";
    rr(ctx, c2innerX, c2innerY, 44, 44, 10);
    ctx.fill();
  }

  const c2textX = c2innerX + 44 + 12;
  ctx.font = boldFont;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(p.appName, c2textX, c2innerY + 2);

  ctx.font = smallFont;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "right";
  ctx.fillText(p.appNotif.time, cardPadX + cardW - 16, c2innerY + 4);

  ctx.font = textFont;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "left";
  wrapText(ctx, p.appNotif.title, c2textX, c2innerY + 24, appContentW, 21);

  // ── 7. Bottom buttons ──────────────────────────────────────────────────────
  const btnY = H - 36 - 31; // bottom:36, radius 31
  [[40 + 31, btnY] as const, [W - 40 - 31, btnY] as const].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 31, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // ── 8. Home indicator ──────────────────────────────────────────────────────
  const hiW = 140;
  const hiH = 5;
  rr(ctx, (W - hiW) / 2, H - 8 - hiH, hiW, hiH, hiH / 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  return canvas.toDataURL("image/png");
}
