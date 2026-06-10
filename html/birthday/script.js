const sceneMatrix = document.getElementById("sceneMatrix");
const sceneStory = document.getElementById("sceneStory");
const sceneMessage = document.getElementById("sceneMessage");
const matrixCenter = document.getElementById("matrixCenter");
const rainCanvas = document.getElementById("rainCanvas");
const soundToggle = null;
const characterBlock = document.getElementById("characterBlock");
const envelopeStage = document.getElementById("envelopeStage");
const envelopeWrap = document.getElementById("envelopeWrap");
const tapInstruction = document.getElementById("tapInstruction");
const polaroidArea = document.getElementById("polaroidArea");
const slideCaption = document.getElementById("slideCaption");
const polaroidStack = document.getElementById("polaroidStack");
const collageStage = document.getElementById("collageStage");
const heartCollage = document.getElementById("heartCollage");

const rainCtx = rainCanvas.getContext("2d");
const rainChars = "01HAPPYBIRTHDAYTOMYHEARTLOVE";
let rainDrops = [];
let rainFontSize = 18;
let rainAnimFrame = null;
let envelopeOpened = false;
let slideIndex = -1;
let collageStarted = false;
let audioCtx = null;
let audioReady = false;
let audioEnabled = false;
let padNode = null;
let padLfo = null;
let beatInterval = null;
let ambientDecorInitialized = false;
const bgMusicCandidates = ["Sound.mp3", "sound.mp3", "sound.wav", "sound.m4a", "sound.ogg", "sound"];
let bgMusic = null;
let bgMusicInitialized = false;

const cardFolderCandidates = ["Cards_Photos", "cards phtotos", "Cards Photos"];
const heartFolderCandidates = ["Heart_Photos", "heart", "Heart Photos"];
const supportedImageExt = /\.(?:jpg|jpeg|png|webp|gif|avif)$/i;
const slideTitlePool = [
  "Happy Birthday my heart",
  "You make my world softer",
  "Every look feels like home",
  "Still my favorite person",
  "One more year, one more love",
  "Forever my safe place",
  "You are my favorite story",
  "You are my favorite part of every day",
  "Thank you for being my joy and my home",
  "With you, every memory shines"
];
let slides = [];
let collagePhotos = [];
let collagePreloadStarted = false;

const cardPhotoFiles = [
  "Photo1.jpg",
  "Photo2.jpg",
  "Photo3.jpg",
  "Photo4.jpg",
  "Photo5.jpg",
  "Photo6.jpg",
  "Photo7.jpg",
  "Photo8.jpg",
  "Photo9.jpg",
  "Photo10.jpg",
  "Photo11.jpg"
];

const heartPhotoFiles = [
  "Photo1..jpg",
  "Photo1.jpg",
  "Photo2.jpg",
  "Photo3.jpg",
  "Photo4.jpg",
  "Photo5.jpg",
  "Photo6.jpg",
  "Photo7.jpg",
  "Photo8.jpg",
  "Photo9.jpg",
  "Photo10.jpg",
  "Photo11.jpg",
  "Photo12.jpg",
  "Photo14.jpg",
  "Photo15.jpg",
  "Photo16.jpg",
  "Photo17.jpg",
  "Photo18.jpg",
  "Photo19.jpg",
  "Photo20.jpg",
  "Photo21.jpg",
  "Photo22.jpg",
  "Photo23.jpg",
  "Photo24.jpg",
  "Photo25.jpg",
  "Photo26.jpg",
  "Photo27.jpg",
  "Photo28.jpg",
  "Photo29.jpg",
  "Photo30.jpg",
  "Photo31.jpg",
  "Photo32.jpg",
  "Photo33.jpg",
  "Photo34.jpg",
  "Photo35.jpg"
];

function extractPhotoOrder(name) {
  const match = name.match(/photo_(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortPhotoNames(list) {
  return [...list].sort((a, b) => {
    const byIndex = extractPhotoOrder(a) - extractPhotoOrder(b);
    if (byIndex !== 0) {
      return byIndex;
    }
    return a.localeCompare(b);
  });
}

function getSlideTitle(index) {
  return slideTitlePool[index % slideTitlePool.length];
}

function fallbackSlidesFromStaticList() {
  return sortPhotoNames(cardPhotoFiles).map((fileName, index) => ({
    title: getSlideTitle(index),
    image: `Cards_Photos/${fileName}`
  }));
}

function fallbackCollageFromStaticList() {
  const mapped = sortPhotoNames(heartPhotoFiles).map(
    (fileName) => `Heart_Photos/${fileName}`
  );

  if (mapped.length > 0) {
    return mapped;
  }

  return Array.from({ length: 20 }, (_, index) => {
    const seed = index + 1;
    const hueA = (seed * 37) % 360;
    const hueB = (hueA + 48) % 360;
    return makePhotoSvg(
      `Memory ${seed}`,
      `hsl(${hueA} 72% 70%)`,
      `hsl(${hueB} 62% 52%)`
    );
  });
}

function parseImageNamesFromDirectoryHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const names = new Set();

  doc.querySelectorAll("a[href]").forEach((anchor) => {
    const raw = anchor.getAttribute("href") || "";
    const cleaned = raw.split("#")[0].split("?")[0];
    if (!cleaned || cleaned.endsWith("/")) {
      return;
    }

    const decoded = decodeURIComponent(cleaned);
    const fileName = decoded.split("/").pop() || "";
    if (supportedImageExt.test(fileName)) {
      names.add(fileName);
    }
  });

  return sortPhotoNames(Array.from(names));
}

async function tryLoadFolderPhotoPaths(folderCandidates) {
  const fetchWithTimeout = async (url, timeoutMs = 1200) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), timeoutMs);
    });
    return Promise.race([fetch(url, { cache: "no-store" }), timeoutPromise]);
  };

  for (const folderName of folderCandidates) {
    try {
      const folderUrl = `${encodeURI(folderName)}/`;
      const response = await fetchWithTimeout(folderUrl);
      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      const imageNames = parseImageNamesFromDirectoryHtml(html);
      if (imageNames.length > 0) {
        return imageNames.map((name) => `${folderName}/${name}`);
      }
    } catch (error) {
      // Ignore listing failures and continue with fallback sources.
    }
  }

  return [];
}

async function preparePhotoCollections() {
  const dynamicCardPhotos = await tryLoadFolderPhotoPaths(cardFolderCandidates);
  slides =
    dynamicCardPhotos.length > 0
      ? dynamicCardPhotos.map((image, index) => ({
          title: getSlideTitle(index),
          image
        }))
      : fallbackSlidesFromStaticList();

  const dynamicHeartPhotos = await tryLoadFolderPhotoPaths(heartFolderCandidates);
  collagePhotos =
    dynamicHeartPhotos.length > 0
      ? dynamicHeartPhotos
      : fallbackCollageFromStaticList();
}

function makePhotoSvg(label, colorA, colorB) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 1100'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${colorA}'/>
        <stop offset='100%' stop-color='${colorB}'/>
      </linearGradient>
    </defs>
    <rect width='900' height='1100' fill='url(#g)'/>
    <circle cx='180' cy='180' r='110' fill='rgba(255,255,255,.2)'/>
    <circle cx='760' cy='860' r='150' fill='rgba(255,255,255,.15)'/>
    <text x='50%' y='52%' text-anchor='middle' font-size='82' font-family='Arial' fill='white' font-weight='700'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function tryBackgroundMusicPlayback() {
  if (!bgMusic) {
    return;
  }

  const playPromise = bgMusic.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Playback can fail before a user gesture; next interaction retries.
    });
  }
}

function initBackgroundMusic() {
  if (bgMusicInitialized) {
    return;
  }

  bgMusicInitialized = true;
  const inlineAudio = document.getElementById("bgMusic");
  if (inlineAudio instanceof HTMLAudioElement) {
    bgMusic = inlineAudio;
    bgMusic.loop = true;
    bgMusic.preload = "auto";
    bgMusic.volume = 0.42;

    bgMusic.addEventListener("ended", () => {
      bgMusic.currentTime = 0;
      tryBackgroundMusicPlayback();
    });

    if (bgMusic.readyState >= 2) {
      tryBackgroundMusicPlayback();
    } else {
      bgMusic.addEventListener(
        "canplay",
        () => {
          tryBackgroundMusicPlayback();
        },
        { once: true }
      );
      bgMusic.load();
    }
    return;
  }

  bgMusic = new Audio();
  bgMusic.loop = true;
  bgMusic.preload = "auto";
  bgMusic.volume = 0.42;

  bgMusic.addEventListener("ended", () => {
    bgMusic.currentTime = 0;
    tryBackgroundMusicPlayback();
  });

  let sourceIndex = 0;
  const tryNextSource = () => {
    if (!bgMusic || sourceIndex >= bgMusicCandidates.length) {
      return;
    }
    bgMusic.src = bgMusicCandidates[sourceIndex];
    bgMusic.load();
    sourceIndex += 1;
  };

  bgMusic.addEventListener("error", tryNextSource);
  bgMusic.addEventListener(
    "canplay",
    () => {
      tryBackgroundMusicPlayback();
    },
    { once: true }
  );

  tryNextSource();
}

async function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "lazy";

    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.src = url;

    if (typeof img.decode === "function") {
      img.decode().then(done).catch(done);
    }
    
    // Timeout after 3 seconds to avoid blocking
    setTimeout(done, 3000);
  });
}

function startCollagePreload() {
  if (collagePreloadStarted || collagePhotos.length === 0) {
    return;
  }

  collagePreloadStarted = true;
  const unique = [...new Set(collagePhotos)].slice(0, 26);
  Promise.all(unique.map((url) => preloadImage(url))).catch(() => {
    // Ignore image preload failures and continue with runtime loading.
  });
}

function initAmbientDecor() {
  if (ambientDecorInitialized) {
    return;
  }

  function createLayer(heartCount, shapeCount) {
    const layer = document.createElement("div");
    layer.className = "ambient-layer";
    
    // Reduce animations on mobile/low-end devices
    const isLowPerf = window.matchMedia("(max-width: 900px)").matches || 
                      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
    const finalHeartCount = isLowPerf ? Math.ceil(heartCount * 0.5) : heartCount;
    const finalShapeCount = isLowPerf ? Math.ceil(shapeCount * 0.5) : shapeCount;

    for (let i = 0; i < finalHeartCount; i += 1) {
      const heart = document.createElement("span");
      heart.className = "ambient-heart";
      heart.style.setProperty("--x", `${(Math.random() * 100).toFixed(2)}vw`);
      heart.style.setProperty("--s", `${(9 + Math.random() * 12).toFixed(1)}px`);
      heart.style.setProperty("--d", `${(9 + Math.random() * 9).toFixed(2)}s`);
      heart.style.setProperty("--delay", `${(-Math.random() * 14).toFixed(2)}s`);
      layer.appendChild(heart);
    }

    for (let i = 0; i < finalShapeCount; i += 1) {
      const shape = document.createElement("span");
      shape.className = "ambient-shape";
      const size = (10 + Math.random() * 18).toFixed(1);
      shape.style.setProperty("--x", `${(Math.random() * 100).toFixed(2)}vw`);
      shape.style.setProperty("--w", `${size}px`);
      shape.style.setProperty("--h", `${size}px`);
      shape.style.setProperty("--d", `${(14 + Math.random() * 12).toFixed(2)}s`);
      shape.style.setProperty("--delay", `${(-Math.random() * 16).toFixed(2)}s`);
      layer.appendChild(shape);
    }

    return layer;
  }

  sceneStory.appendChild(createLayer(30, 12));
  if (sceneMessage) {
    sceneMessage.appendChild(createLayer(24, 8));
  }
  ambientDecorInitialized = true;
}

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      return false;
    }
    audioCtx = new AC();
    audioReady = true;
  }
  return true;
}

function playTone(freq, duration, type = "sine", gain = 0.04, when = 0) {
  if (!audioEnabled || !audioCtx) {
    return;
  }
  const now = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const vol = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  vol.gain.setValueAtTime(0.0001, now);
  vol.gain.exponentialRampToValueAtTime(gain, now + 0.02);
  vol.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(vol);
  vol.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function playNoiseBurst(duration = 0.15, gain = 0.03) {
  if (!audioEnabled || !audioCtx) {
    return;
  }
  const sampleRate = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const source = audioCtx.createBufferSource();
  const vol = audioCtx.createGain();
  source.buffer = buffer;
  vol.gain.value = gain;
  source.connect(vol);
  vol.connect(audioCtx.destination);
  source.start();
}

function startAmbientMusic() {
  if (!audioEnabled || !audioCtx || padNode) {
    return;
  }

  padNode = audioCtx.createOscillator();
  padNode.type = "triangle";
  padNode.frequency.value = 165;

  const padGain = audioCtx.createGain();
  padGain.gain.value = 0.016;

  padLfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  padLfo.type = "sine";
  padLfo.frequency.value = 0.18;
  lfoGain.gain.value = 16;

  padLfo.connect(lfoGain);
  lfoGain.connect(padNode.frequency);
  padNode.connect(padGain);
  padGain.connect(audioCtx.destination);

  padNode.start();
  padLfo.start();

  if (!beatInterval) {
    beatInterval = window.setInterval(() => {
      playTone(110, 0.12, "sine", 0.015);
      playTone(220, 0.07, "triangle", 0.01, 0.08);
    }, 1500);
  }
}

function stopAmbientMusic() {
  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }

  if (padLfo) {
    padLfo.stop();
    padLfo.disconnect();
    padLfo = null;
  }
  if (padNode) {
    padNode.stop();
    padNode.disconnect();
    padNode = null;
  }
}

async function toggleSound() {
  if (!soundToggle) {
    return;
  }

  const ok = ensureAudio();
  if (!ok) {
    return;
  }

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  audioEnabled = !audioEnabled;
  soundToggle.classList.toggle("on", audioEnabled);
  soundToggle.textContent = audioEnabled ? "Sound: On" : "Sound: Off";

  if (audioEnabled) {
    startAmbientMusic();
    playTone(392, 0.12, "triangle", 0.03);
  } else {
    stopAmbientMusic();
  }
}

function fitRainCanvas() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
  const columns = Math.ceil(rainCanvas.width / rainFontSize);
  rainDrops = new Array(columns).fill(0).map(() => Math.random() * -40);
}

function drawRain() {
  rainCtx.fillStyle = "rgba(10, 3, 20, 0.18)";
  rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCtx.font = `700 ${rainFontSize}px 'Space Grotesk'`;

  for (let i = 0; i < rainDrops.length; i += 1) {
    const ch = rainChars[Math.floor(Math.random() * rainChars.length)];
    const x = i * rainFontSize;
    const y = rainDrops[i] * rainFontSize;
    rainCtx.fillStyle = Math.random() > 0.82 ? "#fba6df" : "#f260c4";
    rainCtx.fillText(ch, x, y);

    if (y > rainCanvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i] += 0.64;
  }

  // Use lower frame rate on low-performance devices
  const frameDelay = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2 ? 32 : 16;
  setTimeout(() => {
    rainAnimFrame = requestAnimationFrame(drawRain);
  }, frameDelay);
}

function startRain() {
  if (rainAnimFrame) {
    cancelAnimationFrame(rainAnimFrame);
  }
  drawRain();
}

function stopRain() {
  if (rainAnimFrame) {
    cancelAnimationFrame(rainAnimFrame);
    rainAnimFrame = null;
  }
}

async function flashText(text, duration, isSmall = false) {
  if (/^[321]$/.test(text)) {
    playTone(420, 0.2, "square", 0.035);
  } else if (text.includes("matrix-heart")) {
    playTone(196, 0.18, "sine", 0.04);
    playTone(246, 0.18, "sine", 0.03, 0.14);
  } else {
    playTone(540, 0.14, "triangle", 0.026);
  }

  matrixCenter.classList.toggle("small", isSmall);
  matrixCenter.innerHTML = text;
  matrixCenter.classList.add("show");
  await wait(duration);
  matrixCenter.classList.remove("show");
  await wait(180);
}

async function runMatrixSequence() {
  await wait(800);
  await flashText("3", 650);
  await flashText("2", 650);
  await flashText("1", 650);
  await flashText("HAPPY", 760, true);
  await flashText("BIRTHDAY", 780, true);
  await flashText("TO", 720, true);
  await flashText("MY HEART", 860, true);

  await flashText("<div class='matrix-heart'></div>", 1100, true);

  sceneMatrix.classList.remove("active");
  stopRain();
  sceneStory.classList.add("active");
  sceneStory.classList.add("story-cool");
  playNoiseBurst(0.18, 0.028);
  playTone(280, 0.25, "sawtooth", 0.025);

  await wait(2300);
  characterBlock.classList.add("hide");
  await wait(450);
  envelopeStage.classList.add("show");
  playTone(350, 0.2, "triangle", 0.02);
}



function renderSlide(nextIndex) {
  const data = slides[nextIndex];
  slideCaption.textContent = data.title;
  slideCaption.classList.remove("blast");
  // Reflow to replay animation every slide change.
  void slideCaption.offsetWidth;
  slideCaption.classList.add("blast");
  slideCaption.style.transform = "translateY(8px)";
  slideCaption.style.opacity = "0.2";
  requestAnimationFrame(() => {
    slideCaption.style.transform = "translateY(0)";
    slideCaption.style.opacity = "1";
  });

  const oldCards = polaroidStack.querySelectorAll(".polaroid-card.reveal");
  oldCards.forEach((item) => item.classList.add("push-back"));

  const card = document.createElement("article");
  card.className = "polaroid-card";
  card.style.setProperty("--rot", `${(Math.random() * 14 - 7).toFixed(1)}deg`);
  card.style.zIndex = `${20 + nextIndex}`;

  const grid = document.createElement("div");
  grid.className = "memory-grid";

  const img = document.createElement("img");
  img.src = data.image;
  img.alt = data.title;

  grid.appendChild(img);
  card.appendChild(grid);
  polaroidStack.appendChild(card);

  const shiftX = (Math.random() * 42 - 21).toFixed(1);
  const shiftY = (Math.random() * 8 - 6).toFixed(1);
  card.style.left = `calc(50% + ${shiftX}px)`;
  card.style.top = `calc(36% + ${shiftY}px)`;

  requestAnimationFrame(() => {
    card.classList.add("reveal");
  });

  playTone(610, 0.1, "triangle", 0.02);
  playNoiseBurst(0.08, 0.014);
}

function openEnvelopeAndFirstSlide() {
  envelopeOpened = true;
  envelopeWrap.classList.add("open");
  polaroidArea.classList.add("show");
  playTone(720, 0.11, "triangle", 0.03);
  playTone(540, 0.18, "sine", 0.025, 0.12);
  playNoiseBurst(0.11, 0.02);

  if (slides.length === 0) {
    slideCaption.textContent = "Add photos to Cards_Photos folder";
    setTimeout(() => {
      launchCollage();
    }, 700);
    return;
  }

  slideIndex = 0;
  setTimeout(() => {
    renderSlide(slideIndex);
  }, 180);
}

function advanceSlide() {
  if (!envelopeOpened || collageStarted) {
    return;
  }

  if (slideIndex < slides.length - 1) {
    const nextIndex = slideIndex + 1;
    slideIndex = nextIndex;
    renderSlide(nextIndex);
  } else {
    launchCollage();
  }
}

function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x, y };
}

function generateHeartPoints() {
  const points = [];
  const compactMode = window.matchMedia("(max-width: 900px)").matches;

  const outerCount = compactMode ? 28 : 34;
  for (let i = 0; i < outerCount; i += 1) {
    const t = (i / outerCount) * Math.PI * 2;
    const p = heartPoint(t);
    points.push({
      x: (p.x + 18) / 36,
      y: 0.08 + (1 - (p.y + 17) / 34) * 0.84
    });
  }

  const middleCount = compactMode ? 8 : 10;
  for (let i = 0; i < middleCount; i += 1) {
    const t = (i / middleCount) * Math.PI * 2 + 0.11;
    const p = heartPoint(t);
    points.push({
      x: (p.x * 0.74 + 18) / 36,
      y: 0.12 + (1 - ((p.y * 0.74 + 0.9) + 17) / 34) * 0.78
    });
  }

  const innerCount = compactMode ? 5 : 7;
  for (let i = 0; i < innerCount; i += 1) {
    const t = (i / innerCount) * Math.PI * 2 + 0.22;
    const p = heartPoint(t);
    points.push({
      x: (p.x * 0.54 + 18) / 36,
      y: 0.17 + (1 - ((p.y * 0.54 + 1.4) + 17) / 34) * 0.7
    });
  }

  return points;
}

function launchCollage() {
  collageStarted = true;
  envelopeStage.classList.remove("show");
  collageStage.classList.add("show");
  playTone(300, 0.2, "triangle", 0.03);
  playTone(460, 0.24, "triangle", 0.03, 0.2);
  playTone(620, 0.35, "sine", 0.03, 0.38);

  heartCollage.innerHTML = "";

  const points = generateHeartPoints();
  const fragment = document.createDocumentFragment();
  const newTiles = [];
  for (let i = 0; i < points.length; i += 1) {
    const point = points[i];
    const nx = point.x;
    const ny = point.y;

    const tile = document.createElement("div");
    tile.className = "heart-piece";
    tile.style.setProperty("--tx", `${(nx * 100).toFixed(2)}%`);
    tile.style.setProperty("--ty", `${(ny * 100).toFixed(2)}%`);
    tile.style.setProperty("--sx", `${Math.random() * 240 - 120}vw`);
    tile.style.setProperty("--sy", `${Math.random() * 200 - 100}vh`);
    tile.style.setProperty("--sr", `${(Math.random() * 120 - 60).toFixed(1)}deg`);
    tile.style.setProperty("--fr", `${(Math.random() * 16 - 8).toFixed(1)}deg`);

    tile.style.setProperty("--w", `${(48 + Math.random() * 20).toFixed(1)}px`);

    const imgRef = collagePhotos[i % collagePhotos.length];
    tile.style.backgroundImage = `url('${imgRef}')`;
    tile.style.transitionDelay = `${(i * 16).toFixed(0)}ms`;
    fragment.appendChild(tile);
    newTiles.push(tile);

    if (i % 7 === 0) {
      playTone(390 + i * 5, 0.08, "triangle", 0.01, i * 0.01);
    }

  }

  heartCollage.appendChild(fragment);
  requestAnimationFrame(() => {
    newTiles.forEach((tile) => tile.classList.add("settle"));
  });

  const lastDelay = Math.max(0, (points.length - 1) * 16);
  const holdCollageMs = 15000;
  const transitionAfter = lastDelay + holdCollageMs;
  setTimeout(() => {
    sceneStory.classList.remove("active");
    sceneMessage.classList.add("active", "show");
  }, transitionAfter);
}

function handleInteraction() {
  tryBackgroundMusicPlayback();

  if (!envelopeOpened) {
    openEnvelopeAndFirstSlide();
    return;
  }
  advanceSlide();
}

envelopeWrap.addEventListener("click", handleInteraction);
envelopeWrap.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleInteraction();
  }
});

sceneStory.addEventListener("click", (event) => {
  tryBackgroundMusicPlayback();

  if (!envelopeStage.classList.contains("show") || collageStarted) {
    return;
  }

  if (!envelopeOpened) {
    return;
  }

  if (event.target.closest(".envelope-wrap")) {
    return;
  }

  advanceSlide();
});

window.addEventListener("resize", fitRainCanvas);
document.addEventListener("pointerdown", tryBackgroundMusicPlayback, { passive: true });
document.addEventListener("keydown", tryBackgroundMusicPlayback);
if (soundToggle) {
  soundToggle.addEventListener("click", toggleSound);
}

async function initApp() {
  slides = fallbackSlidesFromStaticList();
  collagePhotos = fallbackCollageFromStaticList();
  initBackgroundMusic();
  startCollagePreload();
  fitRainCanvas();
  startRain();
  initAmbientDecor();
  runMatrixSequence();

  preparePhotoCollections().then(() => {
    startCollagePreload();
  });
}

initApp();
