# BACKGROUND SYSTEMS — IMMERSIVE INTERACTIVE BACKGROUNDS
## For Any Website Type, Industry, or Style

The sites in those videos use **Three.js WebGL particle systems** — not CSS gradients.
This file gives Claude everything it needs to build that same quality background
for any kind of website. Just tell Claude which background and what to customize.

---

## CORE SETUP (paste into any HTML file)

**In `<head>`:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

**First element inside `<body>`:**
```html
<canvas id="three-bg" style="
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
"></canvas>
```

**All content sections must have:**
```css
position: relative;
z-index: 10;
```

---

## THE 6 BACKGROUND SYSTEMS

---

### BG-1 — ENERGY HELIX
**What it looks like:** A glowing 3D double-helix (DNA/energy ribbon) made of particles
slowly rotates in space. Camera scrolls *through* the helix as the user reads.
Ambient dust drifts around it. Floating glowing orbs pulse in the distance.

**Best for:** Agriculture, biotech, science, nature brands, storytelling sites,
health & wellness, environmental companies, origin-story narratives, luxury/premium.

**Customize:**
- Change `renderer.setClearColor(0x061008)` → your background hex color
- Change `glowTex(230, 165, 55)` (helix color) → your primary brand RGB
- Change `glowTex(70, 190, 140)` (dust color) → your secondary brand RGB
- `HELIX_HEIGHT = 44` → increase for more scroll travel
- `RADIUS = 1.7` → wider or narrower helix

```html
<script>
(function () {
  const canvas = document.getElementById('three-bg');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x061008, 1); // ← CHANGE: background color

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x061008, 0.028); // ← MATCH background color

  const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, -8, 6.5);

  function glowTex(r, g, b) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g2 = ctx.createRadialGradient(32,32,0,32,32,32);
    g2.addColorStop(0,    `rgba(${r},${g},${b},1)`);
    g2.addColorStop(0.35, `rgba(${r},${g},${b},0.5)`);
    g2.addColorStop(0.7,  `rgba(${r},${g},${b},0.1)`);
    g2.addColorStop(1,    `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = g2; ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(c);
  }

  // ← CHANGE THESE 3 COLORS to match your brand:
  const texMain  = glowTex(230, 165,  55);   // helix strand color (gold)
  const texHot   = glowTex(255, 210,  90);   // helix bright core (amber)
  const texDust  = glowTex( 70, 190, 140);   // ambient dust (teal)
  const texWhite = glowTex(255, 245, 200);   // connector rungs (white)

  const N=2800, REVS=7, HEIGHT=44, RADIUS=1.7;

  function makeStrand(phase, tex, sz, op) {
    const pos = new Float32Array(N*3);
    for(let i=0;i<N;i++){
      const t=i/N, a=t*REVS*Math.PI*2+phase;
      pos[i*3]=RADIUS*Math.cos(a); pos[i*3+1]=t*HEIGHT-HEIGHT/2; pos[i*3+2]=RADIUS*Math.sin(a);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    return new THREE.Points(geo,new THREE.PointsMaterial({size:sz,map:tex,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));
  }

  const RUNGS=160, RPR=8;
  const rPos=new Float32Array(RUNGS*RPR*3); let ri=0;
  for(let r=0;r<RUNGS;r++){
    const t=r/RUNGS, angle=t*REVS*Math.PI*2, y=t*HEIGHT-HEIGHT/2;
    for(let p=0;p<RPR;p++){const a=angle+(p/(RPR-1))*Math.PI; rPos[ri*3]=RADIUS*Math.cos(a); rPos[ri*3+1]=y; rPos[ri*3+2]=RADIUS*Math.sin(a); ri++;}
  }
  const rGeo=new THREE.BufferGeometry(); rGeo.setAttribute('position',new THREE.BufferAttribute(rPos,3));

  const helixGroup=new THREE.Group();
  helixGroup.add(makeStrand(0,texMain,0.13,0.92),makeStrand(Math.PI,texMain,0.13,0.92),
    makeStrand(0,texHot,0.06,0.5),makeStrand(Math.PI,texHot,0.06,0.5),
    new THREE.Points(rGeo,new THREE.PointsMaterial({size:0.055,map:texWhite,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false})));
  scene.add(helixGroup);

  const DUST=4000; const dPos=new Float32Array(DUST*3); const dVel=new Float32Array(DUST*3);
  for(let i=0;i<DUST;i++){
    const r=2.8+Math.random()*8, theta=Math.random()*Math.PI*2;
    dPos[i*3]=r*Math.cos(theta); dPos[i*3+1]=(Math.random()-.5)*HEIGHT; dPos[i*3+2]=r*Math.sin(theta);
    dVel[i*3]=(Math.random()-.5)*.004; dVel[i*3+1]=(Math.random()-.5)*.002; dVel[i*3+2]=(Math.random()-.5)*.004;
  }
  const dGeo=new THREE.BufferGeometry(); dGeo.setAttribute('position',new THREE.BufferAttribute(dPos,3));
  const dustPts=new THREE.Points(dGeo,new THREE.PointsMaterial({size:0.065,map:texDust,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false}));
  scene.add(dustPts);

  let tCamY=-8,camY=-8,tMX=0,tMY=0,mX=0,mY=0;
  window.addEventListener('scroll',()=>{ const t=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight); tCamY=-8+t*HEIGHT*.8; });
  document.addEventListener('mousemove',e=>{ tMX=(e.clientX/innerWidth-.5)*2.8; tMY=(e.clientY/innerHeight-.5)*1.2; });
  window.addEventListener('resize',()=>{ renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); });

  const clock=new THREE.Clock();
  (function animate(){
    requestAnimationFrame(animate); clock.getElapsedTime();
    helixGroup.rotation.y+=.0022;
    for(let i=0;i<DUST;i++){dPos[i*3]+=dVel[i*3]; dPos[i*3+1]+=dVel[i*3+1]; dPos[i*3+2]+=dVel[i*3+2]; if(dPos[i*3+1]>HEIGHT/2)dPos[i*3+1]-=HEIGHT; if(dPos[i*3+1]<-HEIGHT/2)dPos[i*3+1]+=HEIGHT;}
    dGeo.attributes.position.needsUpdate=true;
    camY+=(tCamY-camY)*.04; mX+=(tMX-mX)*.025; mY+=(tMY-mY)*.025;
    camera.position.y=camY; camera.position.x=mX*.6; camera.lookAt(0,camY+2,0);
    renderer.render(scene,camera);
  })();
})();
</script>
```

---

### BG-2 — PARTICLE STORM SPHERE
**What it looks like:** 10,000+ particles arranged in a glowing sphere that slowly
breathes (expands and collapses). Mouse movement rotates the entire cloud.
Clicking sends an explosion shockwave through all layers.

**Best for:** Creative agencies, game studios, entertainment brands, music artists,
cyberpunk/dark tech, AR/VR companies, anything bold and high-energy.

**Customize:**
- `renderer.setClearColor(0x050508)` → your background
- `glowTex(255, 245, 255)` → core color (inner glow)
- `glowTex(168, 85, 247)` → inner sphere color
- `glowTex(6, 200, 240)` → mid-ring color
- Change particle counts to make denser or sparser

```html
<script>
(function () {
  const canvas=document.getElementById('three-bg');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x050508,1); // ← background color

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,500);
  camera.position.set(0,0,10);

  function glowTex(r,g,b){
    const c=document.createElement('canvas'); c.width=c.height=64;
    const ctx=c.getContext('2d');
    const grd=ctx.createRadialGradient(32,32,0,32,32,32);
    grd.addColorStop(0,`rgba(${r},${g},${b},1)`); grd.addColorStop(.4,`rgba(${r},${g},${b},.4)`); grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd; ctx.fillRect(0,0,64,64); return new THREE.CanvasTexture(c);
  }

  // ← CHANGE THESE to your brand colors:
  const tCore  = glowTex(255, 245, 255);   // white-hot center
  const tInner = glowTex(168,  85, 247);   // primary brand color
  const tMid   = glowTex(  6, 200, 240);   // accent/secondary color
  const tOuter = glowTex( 80, 100, 255);   // outer haze

  function makeLayer(count,baseRad,spread,tex,sz,op){
    const pos=new Float32Array(count*3),orig=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const theta=Math.random()*Math.PI*2, phi=Math.acos(2*Math.random()-1), r=baseRad+(Math.random()-.5)*spread;
      const x=r*Math.sin(phi)*Math.cos(theta), y=r*Math.cos(phi), z=r*Math.sin(phi)*Math.sin(theta);
      pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z; orig[i*3]=x; orig[i*3+1]=y; orig[i*3+2]=z;
    }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({size:sz,map:tex,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false});
    const pts=new THREE.Points(geo,mat); pts.userData.orig=orig; return pts;
  }

  const lCore=makeLayer(1400,.5,.5,tCore,.08,.95);
  const lInner=makeLayer(4000,2.2,.9,tInner,.09,.88);
  const lMid=makeLayer(3000,3.6,1.2,tMid,.09,.75);
  const lOuter=makeLayer(2500,5.2,1.8,tOuter,.11,.55);
  const lDrift=makeLayer(1500,8,3.5,tInner,.07,.3);

  const group=new THREE.Group();
  group.add(lCore,lInner,lMid,lOuter,lDrift);
  scene.add(group);

  let explodeT=-1;
  document.addEventListener('click',()=>{ explodeT=0; });

  let tRX=0,tRY=0,rX=0,rY=0;
  document.addEventListener('mousemove',e=>{ tRX=(e.clientY/innerHeight-.5)*1.2; tRY=(e.clientX/innerWidth-.5)*1.2; });
  window.addEventListener('resize',()=>{ renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); });

  const clock=new THREE.Clock();
  (function animate(){
    requestAnimationFrame(animate);
    const dt=clock.getDelta(), t=clock.getElapsedTime();
    group.rotation.y+=.0012; group.rotation.x+=.0004;
    rX+=(tRX-rX)*.018; rY+=(tRY-rY)*.018;
    group.rotation.x=rX+Math.sin(t*.15)*.05; group.rotation.y+=rY*.008;
    if(explodeT>=0){ explodeT+=dt/1.8; if(explodeT>1)explodeT=-1; }
    const breathe=1+Math.sin(t*.45)*.045;
    [lCore,lInner,lMid,lOuter,lDrift].forEach((layer,li)=>{
      const pos=layer.geometry.attributes.position.array, orig=layer.userData.orig;
      let exScale=1;
      if(explodeT>=0){ const localT=Math.max(0,explodeT-li*.08); exScale=1+Math.sin(localT*Math.PI)*(.45+li*.2); }
      const scale=breathe*exScale;
      for(let i=0;i<pos.length;i++) pos[i]=orig[i]*scale;
      layer.geometry.attributes.position.needsUpdate=true;
    });
    renderer.render(scene,camera);
  })();
})();
</script>
```

---

### BG-3 — FLOW FIELD
**What it looks like:** Thousands of tiny particles drift through space following
invisible wind currents that shift over time. Trails leave fading lines behind them.
The whole thing undulates slowly, like smoke or Northern lights.

**Best for:** Creative portfolios, wellness/spa brands, music/audio companies,
art studios, meditation apps, luxury fashion, anything organic and flowing.

**Customize:**
- `BG = 'rgba(5,5,12,0.12)'` → trail fade color (match your background)
- `HUE_BASE = 200, HUE_RANGE = 80` → 200=blue-purple, 120=green, 30=orange/warm, 300=pink/magenta
- `PARTICLES = 1800` → increase for denser, decrease for performance
- `SPEED = 0.6` → increase for faster flow

```html
<script>
(function(){
  const canvas=document.getElementById('three-bg');
  const ctx=canvas.getContext('2d');
  let W=canvas.width=innerWidth, H=canvas.height=innerHeight;

  // ← CHANGE THESE:
  const BG        = 'rgba(5, 5, 12, 0.12)';   // trail color (match your page bg)
  const HUE_BASE  = 200;                        // base hue: 200=blue, 120=green, 30=orange, 300=pink
  const HUE_RANGE = 80;                         // how much the hue varies
  const PARTICLES = 1800;
  const SPEED     = 0.7;

  function noise(x,y,t){ return (Math.sin(x*1.3+t)*Math.cos(y*.9+t*.7)+Math.cos(x*.7-t*.5)*Math.sin(y*1.1+t*.3))*Math.PI; }

  const pts=Array.from({length:PARTICLES},()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:0, vy:0,
    speed:SPEED+Math.random()*SPEED,
    life:Math.random(), maxLife:.4+Math.random()*.6,
    hue:HUE_BASE+Math.random()*HUE_RANGE,
    size:.5+Math.random()*1.3
  }));

  let t=0;
  window.addEventListener('resize',()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });

  (function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
    t+=.004;
    pts.forEach(p=>{
      const angle=noise(p.x/W*3,p.y/H*3,t);
      p.vx=p.vx*.95+Math.cos(angle)*p.speed*.05;
      p.vy=p.vy*.95+Math.sin(angle)*p.speed*.05;
      p.x+=p.vx; p.y+=p.vy; p.life+=.005;
      if(p.life>p.maxLife||p.x<0||p.x>W||p.y<0||p.y>H){
        p.x=Math.random()*W; p.y=Math.random()*H;
        p.vx=p.vy=0; p.life=0; p.hue=HUE_BASE+Math.random()*HUE_RANGE;
      }
      const alpha=Math.sin(p.life/p.maxLife*Math.PI)*.7;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=`hsla(${p.hue},70%,65%,${alpha})`; ctx.fill();
    });
  })();
})();
</script>
```

---

### BG-4 — CONSTELLATION NET
**What it looks like:** Floating dots connected by thin lines when close.
Clean, professional, minimal. Mouse repels nearby particles.

**Best for:** SaaS, tech startups, finance, data platforms, legal/consulting,
B2B services, anything that needs subtle polish without drama.

**Customize:**
- `BG = 'rgba(4, 6, 20, 0.18)'` → trail fade
- `DOT = [100, 160, 255]` → dot color RGB
- `LINE = [80, 140, 220]` → line color RGB
- `COUNT = 120` → number of dots

```html
<script>
(function(){
  const canvas=document.getElementById('three-bg');
  const ctx=canvas.getContext('2d');
  let W=canvas.width=innerWidth, H=canvas.height=innerHeight;
  let mx=-999,my=-999;

  // ← CHANGE THESE:
  const BG   = 'rgba(4, 6, 20, 0.18)';   // trail fade (match your bg)
  const DOT  = [100, 160, 255];            // dot color [R,G,B]
  const LINE = [ 80, 140, 220];            // line color [R,G,B]
  const COUNT = 120;                        // number of particles

  const dots=Array.from({length:COUNT},()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-.5)*.5, vy:(Math.random()-.5)*.5,
    r:1.5+Math.random()*2
  }));

  document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; });
  window.addEventListener('resize',()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });

  (function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
    dots.forEach(d=>{
      const dx=d.x-mx,dy=d.y-my,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<100){d.vx+=dx/dist*.3; d.vy+=dy/dist*.3;}
      d.vx=Math.max(-1.5,Math.min(1.5,d.vx*.99));
      d.vy=Math.max(-1.5,Math.min(1.5,d.vy*.99));
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0)d.x=W; if(d.x>W)d.x=0; if(d.y<0)d.y=H; if(d.y>H)d.y=0;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${DOT},.8)`; ctx.fill();
    });
    for(let i=0;i<dots.length;i++) for(let j=i+1;j<dots.length;j++){
      const dx=dots[i].x-dots[j].x, dy=dots[i].y-dots[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){ ctx.beginPath(); ctx.moveTo(dots[i].x,dots[i].y); ctx.lineTo(dots[j].x,dots[j].y);
        ctx.strokeStyle=`rgba(${LINE},${(1-d/130)*.35})`; ctx.lineWidth=.5; ctx.stroke(); }
    }
  })();
})();
</script>
```

---

### BG-5 — FIRE / SMOKE EMITTER
**What it looks like:** Particles rise upward from the bottom of the screen
like fire, smoke, embers, or sparks. Color and speed define the mood.

**Best for:** BBQ/food brands (warm orange/red), fitness (fire/energy), music events
(colored smoke), cannabis/smoke brands, anything with heat/energy/passion.

**Customize:**
- `SOURCE_X = 0.5` → 0=left, 0.5=center, 1=right (or use array for multiple sources)
- `HUE_START/HUE_END` → 0-30=fire, 180-220=blue-smoke, 100-140=green
- `RISE_SPEED` → how fast particles float up
- `SPREAD` → how wide particles fan out

```html
<script>
(function(){
  const canvas=document.getElementById('three-bg');
  const ctx=canvas.getContext('2d');
  let W=canvas.width=innerWidth, H=canvas.height=innerHeight;

  // ← CHANGE THESE:
  const BG         = 'rgba(8, 4, 2, 0.14)'; // match your page bg
  const HUE_START  = 10;                      // starting hue (10=orange-red fire)
  const HUE_END    = 50;                      // ending hue as particle ages (50=yellow)
  const SOURCE_X   = 0.5;                     // 0=left, 0.5=center, 1=right
  const RISE_SPEED = 1.2;
  const SPREAD     = 0.3;                     // 0=straight up, 1=wide fan

  const PARTICLES = 300;
  const pts=Array.from({length:PARTICLES},()=>spawnParticle());

  function spawnParticle(){
    return {
      x: SOURCE_X*W+(Math.random()-.5)*W*SPREAD*.5,
      y: H+10,
      vx: (Math.random()-.5)*SPREAD,
      vy: -(RISE_SPEED+Math.random()*2),
      life: 0, maxLife: 0.4+Math.random()*.6,
      size: 1+Math.random()*3,
      hue: HUE_START+Math.random()*(HUE_END-HUE_START)
    };
  }

  window.addEventListener('resize',()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });

  (function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      p.vx+=(Math.random()-.5)*.08;
      p.life+=.008;
      if(p.life>p.maxLife||p.y<-20){ Object.assign(p,spawnParticle()); return; }
      const a=Math.sin(p.life/p.maxLife*Math.PI)*.8;
      const h=p.hue+(p.life/p.maxLife)*(HUE_END-HUE_START)*2;
      const rad=p.size*(1-p.life/p.maxLife*.5);
      ctx.beginPath(); ctx.arc(p.x,p.y,rad,0,Math.PI*2);
      ctx.fillStyle=`hsla(${h},90%,65%,${a})`; ctx.fill();
    });
  })();
})();
</script>
```

---

### BG-6 — AURORA / LIGHT RIBBONS
**What it looks like:** Smooth, sweeping ribbons of colored light undulate across
the screen like the Northern Lights. Slow, peaceful, cinematic.

**Best for:** Luxury brands, spas, yoga/meditation, travel, high-end hospitality,
wellness, premium software, anything that needs dreamy and upscale.

**Customize:**
- `COLORS` → array of brand colors as `[h, s, l]` (hue, saturation, lightness)
- `SPEED = 0.0008` → slower = more peaceful, faster = more active
- `RIBBONS = 5` → number of light streams

```html
<script>
(function(){
  const canvas=document.getElementById('three-bg');
  const ctx=canvas.getContext('2d');
  let W=canvas.width=innerWidth, H=canvas.height=innerHeight;

  // ← CHANGE: your brand color palette [hue, saturation%, lightness%]
  const COLORS = [
    [200, 70, 55],   // blue-cyan
    [260, 60, 50],   // purple
    [180, 65, 45],   // teal
    [220, 75, 60],   // blue
    [240, 55, 45],   // indigo
  ];
  const SPEED   = 0.0008;
  const RIBBONS = 5;
  const BG      = 'rgba(4, 5, 14, 0.04)'; // very slow fade for long trails

  const ribbons = Array.from({length:RIBBONS},(_, i)=>({
    col: COLORS[i % COLORS.length],
    offset: Math.random()*Math.PI*2,
    yBase: (i/RIBBONS)*H + Math.random()*100,
    width: 60+Math.random()*120,
    speed: SPEED*(0.5+Math.random()),
    amp: 80+Math.random()*120,
  }));

  let t=0;
  window.addEventListener('resize',()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });

  (function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
    t+=0.5;

    ribbons.forEach(r=>{
      const pts=[];
      for(let x=0;x<=W;x+=8){
        const y=r.yBase+Math.sin((x/W)*Math.PI*3+t*r.speed+r.offset)*r.amp
                       +Math.cos((x/W)*Math.PI*5+t*r.speed*.7)*r.amp*.4;
        pts.push([x,y]);
      }

      const [h,s,l]=r.col;
      ctx.beginPath();
      ctx.moveTo(pts[0][0],pts[0][1]);
      for(let i=1;i<pts.length-1;i++){
        const mx=(pts[i][0]+pts[i+1][0])/2, my=(pts[i][1]+pts[i+1][1])/2;
        ctx.quadraticCurveTo(pts[i][0],pts[i][1],mx,my);
      }
      ctx.lineWidth=r.width;
      ctx.strokeStyle=`hsla(${h},${s}%,${l}%,0.06)`;
      ctx.stroke();

      // Bright center line
      ctx.beginPath();
      ctx.moveTo(pts[0][0],pts[0][1]);
      for(let i=1;i<pts.length-1;i++){
        const mx=(pts[i][0]+pts[i+1][0])/2, my=(pts[i][1]+pts[i+1][1])/2;
        ctx.quadraticCurveTo(pts[i][0],pts[i][1],mx,my);
      }
      ctx.lineWidth=2;
      ctx.strokeStyle=`hsla(${h},${s}%,${l+20}%,0.35)`;
      ctx.stroke();
    });
  })();
})();
</script>
```

---

## QUICK REFERENCE — WHICH BACKGROUND FOR WHICH SITE

| Industry / Vibe | Best Background |
|---|---|
| Agriculture, biotech, science, nature | BG-1 Energy Helix |
| Luxury brand, origin story, premium product | BG-1 Energy Helix |
| Creative agency, game studio, AR/VR | BG-2 Particle Storm |
| Music artist, events, entertainment | BG-2 Particle Storm or BG-3 Flow Field |
| SaaS, tech startup, data platform | BG-4 Constellation Net |
| B2B, finance, legal, consulting | BG-4 Constellation Net |
| Wellness, yoga, spa, meditation | BG-6 Aurora Ribbons |
| Luxury hospitality, travel, hotel | BG-6 Aurora Ribbons |
| Portfolio, creative studio, art | BG-3 Flow Field |
| BBQ, food, fitness, energy brands | BG-5 Fire / Smoke |
| Streetwear, fashion, hype brands | BG-2 Particle Storm |
| Environmental, sustainability | BG-1 Helix (green) or BG-3 Flow Field |

---

## HOW TO TELL CLAUDE TO USE THESE

Just add this phrase to any website prompt:

> *"Use the Energy Helix background from my BACKGROUND-SYSTEMS.md — set the
> helix color to [your brand color] and the background to [your bg color]."*

Or for automatic matching:

> *"Use the most fitting background from my BACKGROUND-SYSTEMS.md for this type
> of business, and customize the colors to match the brand."*

---

## FILES IN THIS FOLDER

| File | Description |
|---|---|
| `immersive-scroll-storytelling.html` | BG-1 Energy Helix in action (Pioneer Seeds style) |
| `glitch-creative-agency.html` | BG-2 Particle Storm in action (Active Theory style) |
| `HOW-TO-BUILD-ADVANCED-SITES.md` | Full site-building prompt guide |
| `BACKGROUND-SYSTEMS.md` | This file — background library for any site type |
