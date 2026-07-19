/* ---------------------------------------------------------------
   Détails de l'événement — à modifier une fois les informations
   définitives connues. `start` / `end` sont en heure locale du
   fuseau `timezone` (nom IANA, ex. "Europe/Paris"),
   format : "YYYY-MM-DDTHH:MM:SS".
------------------------------------------------------------------ */
const EVENT = {
  title: "Mariage de Géraldine & Mattéo",
  description: "Réservez la date ! Invitation complète à venir.",
  location: "Lieu à confirmer",
  start: "2027-08-21T16:00:00",
  end: "2027-08-21T23:00:00",
  timezone: "Europe/Paris",
};

/* ---------------------------------------------------------------
   Scroll-reveal: fade/slide in elements once they enter view.
------------------------------------------------------------------ */
(function setupScrollReveal() {
  const targets = document.querySelectorAll(".fade-up");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 0.12}s`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ---------------------------------------------------------------
   Ticket à gratter : révèle la date en la grattant à la souris
   ou au doigt sur un canvas superposé au texte de la date.
------------------------------------------------------------------ */
(function setupScratchCard() {
  const card = document.getElementById("scratch-card");
  const canvas = document.getElementById("scratch-canvas");
  if (!card || !canvas) return;

  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let revealed = false;

  function paintScratchLayer(width, height) {
    ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#D0D0D0");
    gradient.addColorStop(1, "#A8A8A8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(250, 250, 248, 0.85)";
    ctx.font = "600 11px Manrope, sans-serif";
    ctx.textBaseline = "middle";
    const label = "★ GRATTEZ ICI ";
    const labelWidth = ctx.measureText(label).width || 1;
    for (let y = 12; y < height; y += 20) {
      let x = -((y / 2) % labelWidth);
      while (x < width) {
        ctx.fillText(label, x, y);
        x += labelWidth;
      }
    }
  }

  function sizeCanvas() {
    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!revealed) paintScratchLayer(rect.width, rect.height);
  }

  function getPointerPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const point = evt.touches ? evt.touches[0] : evt;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function scratchAt(evt) {
    const { x, y } = getPointerPos(evt);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkRevealProgress() {
    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);
    if (!w || !h) return;
    const imageData = ctx.getImageData(0, 0, w, h).data;
    let cleared = 0;
    let total = 0;
    const sampleStep = 4 * 6;
    for (let i = 3; i < imageData.length; i += sampleStep) {
      total++;
      if (imageData[i] === 0) cleared++;
    }
    if (total && cleared / total > 0.99) {
      completeReveal();
    }
  }

  function completeReveal() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add("is-cleared");
  }

  function startScratch(evt) {
    if (revealed) return;
    isDrawing = true;
    scratchAt(evt);
    checkRevealProgress();
  }

  function moveScratch(evt) {
    if (!isDrawing || revealed) return;
    evt.preventDefault();
    scratchAt(evt);
    checkRevealProgress();
  }

  function endScratch() {
    isDrawing = false;
  }

  canvas.addEventListener("mousedown", startScratch);
  canvas.addEventListener("mousemove", moveScratch);
  window.addEventListener("mouseup", endScratch);

  canvas.addEventListener("touchstart", startScratch, { passive: true });
  canvas.addEventListener("touchmove", moveScratch, { passive: false });
  window.addEventListener("touchend", endScratch);

  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();
})();

/* ---------------------------------------------------------------
   Timezone-aware date helpers.
   Converts a local wall-clock time in `timeZone` to a real UTC Date,
   using only the Intl API (no external libraries).
------------------------------------------------------------------ */
function getTimezoneOffsetMinutes(utcGuess, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(utcGuess).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return (asUTC - utcGuess.getTime()) / 60000;
}

function localToUTCDate(localDateTimeString, timeZone) {
  const naiveUTC = new Date(`${localDateTimeString}Z`);
  const offsetMinutes = getTimezoneOffsetMinutes(naiveUTC, timeZone);
  return new Date(naiveUTC.getTime() - offsetMinutes * 60000);
}

function toICSUTCString(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/* ---------------------------------------------------------------
   Ajouter au calendrier : télécharge un fichier .ics universel
   qui fonctionne avec tous les calendriers (Google, Apple, Outlook, etc).
   Utilise navigator.share() si disponible (meilleur support WebView/apps).
------------------------------------------------------------------ */
function downloadCalendarFile() {
  const start = localToUTCDate(EVENT.start, EVENT.timezone);
  const end = localToUTCDate(EVENT.end, EVENT.timezone);
  const now = toICSUTCString(new Date());
  const uid = `${Date.now()}-save-the-date@wedding`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Save The Date//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toICSUTCString(start)}`,
    `DTEND:${toICSUTCString(end)}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:${EVENT.description}`,
    `LOCATION:${EVENT.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });

  if (navigator.share) {
    navigator.share({
      title: EVENT.title,
      text: EVENT.description,
      files: [new File([blob], "mariage-Gege&Matt.ics", { type: "text/calendar" })]
    }).catch(() => fallbackDownload(blob));
  } else {
    fallbackDownload(blob);
  }
}

function fallbackDownload(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mariage-Gege&Matt.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

document.getElementById("add-calendar").addEventListener("click", downloadCalendarFile);

