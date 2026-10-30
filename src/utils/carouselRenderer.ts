import { InstagramSlide, LinkedInCarouselSlide } from '../types';

/**
 * Renders a visual carousel slide to an HTML5 canvas and triggers a PNG download
 */
export function exportSlideAsPng(
  slide: { title?: string; headline?: string; bullets?: string[]; textOverlay?: string; designNote?: string },
  slideIndex: number,
  totalSlides: number,
  authorName: string = 'OmniRepurpose',
  accentColor: string = '#6366f1'
) {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Draw modern dark gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#090d16');
  gradient.addColorStop(0.6, '#0f172a');
  gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw subtle geometric accent glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(width - 150, 150, 280, 0, Math.PI * 2);
  ctx.fillStyle = `${accentColor}18`;
  ctx.filter = 'blur(40px)';
  ctx.fill();
  ctx.restore();

  // 3. Draw Top Header Bar
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(authorName.toUpperCase(), 80, 100);

  // Slide Number Pill
  const slideText = `${slideIndex + 1} / ${totalSlides}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(width - 180, 70, 100, 42, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(slideText, width - 158, 98);

  // 4. Headline / Title
  const headline = slide.headline || slide.title || 'Key Insight';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, headline, 80, 240, width - 160, 68);

  // 5. Main Content (Bullets or Text Overlay)
  if (slide.bullets && slide.bullets.length > 0) {
    ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    let bulletY = 460;
    slide.bullets.forEach((bullet) => {
      // Bullet dot
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(95, bulletY - 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Bullet text
      ctx.fillStyle = '#cbd5e1';
      wrapText(ctx, bullet, 130, bulletY, width - 220, 44);
      bulletY += 100;
    });
  } else if (slide.textOverlay) {
    ctx.font = '600 40px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    wrapText(ctx, `"${slide.textOverlay}"`, 80, 480, width - 160, 56);
  }

  // 6. Footer callout
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, height - 120);
  ctx.lineTo(width - 80, height - 120);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Swipe for more ›', 80, height - 70);

  ctx.fillStyle = '#a5b4fc';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Save & Share', width - 230, height - 70);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `Slide-${slideIndex + 1}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Text wrapper helper for Canvas context
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
