/* PERFORMANCE: pause when tab hidden */
let isVisible = true;
document.addEventListener('visibilitychange', () => {
  isVisible = document.visibilityState === 'visible';
});

/* ═══ BG MESH + FLOW ═══ */
const meshC = document.getElementById('bg-mesh');
const meshX = meshC.getContext('2d');
const flowC = document.getElementById('bg-flow');
const flowX = flowC.getContext('2d');
let MW, MH, FW, FH;
function resize() {
  MW = meshC.width = meshC.offsetWidth;
  MH = meshC.height = meshC.offsetHeight;
  FW = flowC.width = flowC.offsetWidth;
  FH = flowC.height = flowC.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

let t = 0;
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let targetMx = mx;
let targetMy = my;
window.addEventListener('mousemove', (e) => {
  targetMx = e.clientX;
  targetMy = e.clientY;
});

function drawMesh() {
  meshX.clearRect(0, 0, MW, MH);
  const cols = 24, rows = 18;
  const cw = MW / (cols - 1), ch = MH / (rows - 1);
  const pts = [];
  for (let r = 0; r < rows; r++) {
    pts[r] = [];
    for (let c = 0; c < cols; c++) {
      const wave = Math.sin(c * 0.4 + r * 0.3 + t * 0.6) * 14
                 + Math.sin(c * 0.18 + t * 0.4) * 10;
      pts[r][c] = { x: c * cw, y: r * ch + wave };
    }
  }
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const p1 = pts[r][c], p2 = pts[r][c+1], p3 = pts[r+1][c], p4 = pts[r+1][c+1];
      const cd = 1 - Math.abs(c / cols - 0.3) * 1.2;
      const a = 0.025 + cd * 0.05;
      meshX.strokeStyle = `rgba(45,255,213,${a})`;
      meshX.lineWidth = 0.4;
      meshX.beginPath();
      meshX.moveTo(p1.x, p1.y); meshX.lineTo(p2.x, p2.y);
      meshX.lineTo(p3.x, p3.y); meshX.closePath();
      meshX.stroke();
      meshX.beginPath();
      meshX.moveTo(p2.x, p2.y); meshX.lineTo(p4.x, p4.y);
      meshX.lineTo(p3.x, p3.y); meshX.closePath();
      meshX.stroke();
    }
  }
  for (let r = 2; r < rows; r += 4) {
    meshX.beginPath();
    for (let c = 0; c < cols; c++) {
      if (c === 0) meshX.moveTo(pts[r][c].x, pts[r][c].y);
      else meshX.lineTo(pts[r][c].x, pts[r][c].y);
    }
    meshX.strokeStyle = `rgba(239,68,68,0.12)`;
    meshX.lineWidth = 0.5;
    meshX.stroke();
  }
}

const FCOLS = 60, FROWS = 14;
function drawFlow() {
  flowX.clearRect(0, 0, FW, FH);
  const cw = FW / (FCOLS - 1);
  const baseY = FH * 0.6;
  const ch = FH * 0.4;
  for (let r = 0; r < FROWS; r++) {
    const rNorm = r / (FROWS - 1);
    flowX.beginPath();
    for (let c = 0; c < FCOLS; c++) {
      const x = c * cw;
      const w1 = Math.sin(c * 0.16 + t * 1.0 + r * 0.3) * 50 * rNorm;
      const w2 = Math.sin(c * 0.08 + t * 0.5 + r * 0.15) * 28 * rNorm;
      const w3 = Math.sin(c * 0.3 + t * 1.4) * 14 * rNorm;
      const y = baseY - w1 - w2 - w3 - rNorm * ch * 0.4;
      if (c === 0) flowX.moveTo(x, y);
      else flowX.lineTo(x, y);
    }
    const a = 0.03 + rNorm * 0.13;
    const isViolet = r % 4 === 0;
    flowX.strokeStyle = isViolet ? `rgba(168,85,247,${a * 0.7})` : `rgba(45,255,213,${a})`;
    flowX.lineWidth = 0.5;
    flowX.stroke();
  }
  for (let i = 0; i < 90; i++) {
    const slideSpeed = 5 + (i % 5) * 2;
    let cf = (i * 6.7 + t * slideSpeed) % FCOLS;
    if (cf < 0) cf += FCOLS;
    const rf = 0.25 + ((i * 0.11) % 0.7);
    const rNorm = rf;
    const x = cf * cw;
    const w1 = Math.sin(cf * 0.16 + t * 1.0 + rNorm * 0.3 * FROWS) * 50 * rNorm;
    const w2 = Math.sin(cf * 0.08 + t * 0.5 + rNorm * 0.15 * FROWS) * 28 * rNorm;
    const w3 = Math.sin(cf * 0.3 + t * 1.4) * 14 * rNorm;
    const y = baseY - w1 - w2 - w3 - rNorm * ch * 0.4;
    const sz = 0.6 + rNorm * 1.8;
    const a = 0.12 + rNorm * 0.4;
    flowX.beginPath();
    flowX.arc(x, y, sz, 0, Math.PI * 2);
    if (i % 7 === 0) flowX.fillStyle = `rgba(168,85,247,${a})`;
    else if (i % 13 === 0) flowX.fillStyle = `rgba(251,191,36,${a * 0.7})`;
    else flowX.fillStyle = `rgba(45,255,213,${a})`;
    flowX.fill();
  }
  flowX.font = '9px "Share Tech Mono", monospace';
  const labels = ['0.94','0.7','0.64','0.46','0.3','0.6','0.45'];
  for (let i = 0; i < labels.length; i++) {
    const cf = 4 + i * 8;
    const rNorm = 0.55;
    const x = cf * cw;
    const w1 = Math.sin(cf * 0.16 + t * 1.0 + rNorm * 0.3 * FROWS) * 50 * rNorm;
    const w2 = Math.sin(cf * 0.08 + t * 0.5 + rNorm * 0.15 * FROWS) * 28 * rNorm;
    const y = baseY - w1 - w2 - rNorm * ch * 0.4 - 12;
    flowX.fillStyle = `rgba(45,255,213,0.22)`;
    flowX.fillText(labels[i], x - 8, y);
  }
}

function bgLoop() {
  if (isVisible) {
    if (meshC.width !== meshC.offsetWidth) resize();
    mx += (targetMx - mx) * 0.05;
    my += (targetMy - my) * 0.05;
    
    let speed = 0.008 + (Math.abs(mx - window.innerWidth / 2) / window.innerWidth) * 0.02;
    t += speed;

    drawMesh();
    drawFlow();
  }
  requestAnimationFrame(bgLoop);
}
bgLoop();

/* ═══ HERO 3D-ish PLACEHOLDER (replace with Spline) ═══ */
const heroC = document.getElementById('hero-canvas');
if (heroC) {
  const heroX = heroC.getContext('2d');
  let HW, HH;
  function resizeHero() {
    HW = heroC.width = heroC.offsetWidth * 2;
    HH = heroC.height = heroC.offsetHeight * 2;
    heroX.setTransform(1, 0, 0, 1, 0, 0);
    heroX.scale(2, 2);
  }
  resizeHero();
  window.addEventListener('resize', resizeHero);

  let ht = 0;
  // Wireframe icosahedron-like sphere using parametric points
  const NODES = 80;
  const nodes = [];
  for (let i = 0; i < NODES; i++) {
    // Fibonacci sphere
    const phi = Math.acos(1 - 2 * (i + 0.5) / NODES);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    nodes.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
    });
  }

  let explodeForce = 0;
  heroC.addEventListener('click', () => {
    explodeForce = 1.0;
  });

  function drawHero() {
    if (!isVisible) { requestAnimationFrame(drawHero); return; }
    if (heroC.width !== heroC.offsetWidth * 2) resizeHero();
    
    const W = heroC.offsetWidth, H = heroC.offsetHeight;
    heroX.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const radius = Math.min(W, H) * 0.32;

    explodeForce *= 0.92;
    const mNormX = (mx / window.innerWidth) * 2 - 1;
    const mNormY = (my / window.innerHeight) * 2 - 1;

    // rotation
    const rotY = ht * 0.4 + mNormX * 1.5;
    const rotX = Math.sin(ht * 0.3) * 0.4 + mNormY * 0.8;

    const projected = nodes.map(n => {
      // explode
      const nx = n.x * (1 + explodeForce * 1.5);
      const ny = n.y * (1 + explodeForce * 1.5);
      const nz = n.z * (1 + explodeForce * 1.5);

      // Y rotation
      let x = nx * Math.cos(rotY) - nz * Math.sin(rotY);
      let z = nx * Math.sin(rotY) + nz * Math.cos(rotY);
      let y = ny;
      // X rotation
      const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
      return {
        x: cx + x * radius,
        y: cy + y2 * radius,
        z: z2,
      };
    });

    // Draw edges between nearby points
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < radius * 0.55) {
          const avgZ = (a.z + b.z) / 2;
          let alpha = (avgZ + 1) / 2 * 0.45;
          alpha = Math.max(0, Math.min(1, alpha));
          heroX.beginPath();
          heroX.moveTo(a.x, a.y);
          heroX.lineTo(b.x, b.y);
          heroX.strokeStyle = `rgba(45,255,213,${alpha * 0.7})`;
          heroX.lineWidth = 0.5;
          heroX.stroke();
        }
      }
    }

    // Draw nodes
    projected.forEach((p, i) => {
      let alpha = (p.z + 1) / 2;
      alpha = Math.max(0, Math.min(1, alpha));
      const sz = 1 + alpha * 2;
      heroX.beginPath();
      heroX.arc(p.x, p.y, sz, 0, Math.PI * 2);
      const isViolet = i % 11 === 0;
      const isYellow = i % 17 === 0;
      if (isYellow) heroX.fillStyle = `rgba(251,191,36,${alpha})`;
      else if (isViolet) heroX.fillStyle = `rgba(168,85,247,${alpha})`;
      else heroX.fillStyle = `rgba(45,255,213,${alpha})`;
      heroX.fill();
      if (alpha > 0.7) {
        heroX.shadowBlur = 8;
        heroX.shadowColor = '#2dffd5';
        heroX.fill();
        heroX.shadowBlur = 0;
      }
    });

    // Inner orbital ring
    heroX.beginPath();
    heroX.ellipse(cx, cy, radius * 1.3, radius * 0.25, ht * 0.3, 0, Math.PI * 2);
    heroX.strokeStyle = 'rgba(168,85,247,0.25)';
    heroX.lineWidth = 1;
    heroX.stroke();

    heroX.beginPath();
    heroX.ellipse(cx, cy, radius * 1.5, radius * 0.18, -ht * 0.2, 0, Math.PI * 2);
    heroX.strokeStyle = 'rgba(45,255,213,0.18)';
    heroX.lineWidth = 1;
    heroX.stroke();

    // Floating data labels around
    heroX.font = '10px "Share Tech Mono", monospace';
    const dataLabels = [
      {txt: '0.94', a: 0.3},
      {txt: '+24.7%', a: 1.2},
      {txt: 'KPI', a: 2.1},
      {txt: '0.65', a: 3.0},
      {txt: 'PRED', a: 3.9},
      {txt: '102k', a: 4.8},
    ];
    dataLabels.forEach((l, i) => {
      const ang = l.a + ht * 0.15;
      const r = radius * 1.65;
      const x = cx + Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r * 0.5;
      const op = 0.4 + Math.sin(ht * 2 + i) * 0.2;
      heroX.fillStyle = i % 2 === 0 ? `rgba(45,255,213,${op})` : `rgba(168,85,247,${op})`;
      heroX.textAlign = 'center';
      heroX.fillText(l.txt, x, y);
    });

    // Center label
    heroX.fillStyle = 'rgba(45,255,213,0.7)';
    heroX.font = 'bold 9px Orbitron, monospace';
    heroX.textAlign = 'center';
    heroX.fillText('// DATA.SPHERE', cx, H - 18);
    heroX.fillStyle = 'rgba(168,85,247,0.5)';
    heroX.font = '8px Share Tech Mono, monospace';
    heroX.fillText('ANALYZING · SAMPLE PREVIEW', cx, H - 6);

    ht += 0.012;
    requestAnimationFrame(drawHero);
  }
  drawHero();
}

/* ═══ ABOUT MINI CHART ═══ */
const ac = document.getElementById('aboutChart');
const aX = ac.getContext('2d');
function resizeAbout() {
  ac.width = ac.offsetWidth * 2;
  ac.height = ac.offsetHeight * 2;
  aX.setTransform(1, 0, 0, 1, 0, 0);
  aX.scale(2, 2);
}
resizeAbout();
window.addEventListener('resize', resizeAbout);

let act = 0;
const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const rev = [42,48,55,51,63,71,68,74,82,88,94,102];
const tgt = [45,50,55,60,65,70,75,80,82,85,90,95];
const maxR = 110;

function drawAbout() {
  if (!isVisible) { requestAnimationFrame(drawAbout); return; }
  if (ac.width !== ac.offsetWidth * 2) resizeAbout();
  const W = ac.offsetWidth, H = ac.offsetHeight;
  aX.clearRect(0, 0, W, H);
  const padL = 28, padR = 10, padT = 10, padB = 22;
  const cw = W - padL - padR;
  const ch = H - padT - padB;
  const bW = cw / rev.length - 2;

  // grid
  aX.font = '8px Share Tech Mono, monospace';
  for (let i = 0; i <= 4; i++) {
    const v = (maxR / 4) * i;
    const y = padT + ch - (v / maxR) * ch;
    aX.beginPath();
    aX.moveTo(padL, y); aX.lineTo(W - padR, y);
    aX.strokeStyle = i === 0 ? 'rgba(45,255,213,0.4)' : 'rgba(45,255,213,0.07)';
    aX.lineWidth = i === 0 ? 1 : 0.5;
    aX.stroke();
    aX.fillStyle = 'rgba(45,255,213,0.6)';
    aX.textAlign = 'right';
    aX.fillText(v + 'k', padL - 4, y + 3);
  }

  // bars
  rev.forEach((v, i) => {
    const x = padL + i * (bW + 2);
    const h = (v / maxR) * ch;
    const y = padT + ch - h;
    const pulse = Math.sin(act * 1.5 + i * 0.5) * 0.08 + 0.92;
    const g = aX.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, `rgba(45,255,213,${0.6 * pulse})`);
    g.addColorStop(1, `rgba(45,255,213,${0.2 * pulse})`);
    aX.fillStyle = g;
    aX.fillRect(x, y, bW, h);
    aX.strokeStyle = `rgba(45,255,213,${0.7 * pulse})`;
    aX.lineWidth = 0.8;
    aX.strokeRect(x, y, bW, h);
  });

  // target
  aX.beginPath();
  aX.setLineDash([3, 2]);
  tgt.forEach((v, i) => {
    const x = padL + i * (bW + 2) + bW / 2;
    const y = padT + ch - (v / maxR) * ch;
    if (i === 0) aX.moveTo(x, y); else aX.lineTo(x, y);
  });
  aX.strokeStyle = 'rgba(168,85,247,0.85)';
  aX.lineWidth = 1.3;
  aX.stroke();
  aX.setLineDash([]);

  // months
  aX.fillStyle = 'rgba(45,255,213,0.55)';
  aX.font = '8px Share Tech Mono, monospace';
  aX.textAlign = 'center';
  months.forEach((m, i) => {
    const x = padL + i * (bW + 2) + bW / 2;
    aX.fillText(m, x, padT + ch + 13);
  });

  act += 0.014;
  requestAnimationFrame(drawAbout);
}
drawAbout();

/* ═══ DATA ═══ */
const skills = [
  {name:'Python',icon:'🐍',cat:'Language'},
  {name:'SQL',icon:'🗄️',cat:'Language'},
  {name:'Power BI',icon:'📊',cat:'Tool'},
  {name:'Excel',icon:'📗',cat:'Tool'},
  {name:'Git / GitHub',icon:'🐙',cat:'Tool'},
  {name:'Data Analysis',icon:'🔍',cat:'Skill'},
  {name:'Data Visualization',icon:'📈',cat:'Skill'},
  {name:'Data Cleaning',icon:'🧹',cat:'Skill'},
  {name:'Machine Learning',icon:'🤖',cat:'Skill'},
  {name:'Jupyter Notebook',icon:'📓',cat:'Tool'},
  {name:'Storytelling',icon:'📖',cat:'Skill'},
  {name:'Visual Studio Code',icon:'💻',cat:'Tool'},
  {name:'HTML',icon:'🌐',cat:'Language'},
  {name:'AI Tools',icon:'✨',cat:'Tool'},
  {name:'Notion',icon:'📔',cat:'Tool'},
  {name:'Unreal Engine',icon:'🎮',cat:'Creative'},
  {name:'Adobe Suite',icon:'🎨',cat:'Creative'},
  {name:'Autodesk Maya',icon:'💠',cat:'Creative'},
];
const sg = document.getElementById('skillsGrid');
skills.forEach(s => {
  sg.innerHTML += `<div class="sk" data-cat="${s.cat}"><div class="sk-icon">${s.icon}</div><div class="sk-name">${s.name}</div><div class="sk-cat">${s.cat}</div></div>`;
});

const langs = [
  {flag:'🇮🇹', name:'Italian', level:'NATIVE', cls:'native'},
  {flag:'🇵🇹', name:'Portuguese', level:'C1', cls:'c1'},
  {flag:'🇬🇧', name:'English', level:'C2', cls:'c2'},
  {flag:'🇪🇸', name:'Spanish', level:'A1', cls:'a1'},
];
const lr = document.getElementById('langRow');
langs.forEach(l => {
  lr.innerHTML += `<div class="lang"><span class="lang-flag">${l.flag}</span><span class="lang-name">${l.name}</span><span class="lang-level ${l.cls}">${l.level}</span></div>`;
});

const certs = [
  {name:'Boolean — Master in Data Analytics', s:'done', link:'https://valuable-pullover-8a2.notion.site/Boolean-Master-in-Data-Analytics-33a02b5de78a80d0aed1d552533a1f69'},
  {name:'IBM Data Analyst Professional Certificate', s:'wip', link:null},
  {name:'Microsoft PL-300 — Power BI Data Analyst', s:'wip', link:null},
];
const cr = document.getElementById('certsRow');
certs.forEach(c => {
  if (c.link) {
    cr.innerHTML += `<a class="cert ${c.s} clickable" href="${c.link}" target="_blank" rel="noopener">
      <div class="cert-st ${c.s==='done'?'d':'w'}">${c.s==='done'?'● Completed':'◌ In progress'}</div>
      <div class="cert-nm">${c.name}</div>
      <div class="cert-link">View Certificate ↗</div>
    </a>`;
  } else {
    cr.innerHTML += `<div class="cert ${c.s}">
      <div class="cert-st ${c.s==='done'?'d':'w'}">${c.s==='done'?'● Completed':'◌ In progress'}</div>
      <div class="cert-nm">${c.name}</div>
    </div>`;
  }
});

const projects = [
  {
    num:'001', wip:false, bonus:false, done:true,
    img:'./assets/crime.png', fallback:'fallback-crime', tag:'CRIME // ECONOMY',
    title:'ITALY CRIME &<br>ECONOMY ANALYSIS',
    desc:'Crime trends across Italian regions 2018–2023. Correlations between unemployment, GDP per capita and criminal activity using ISTAT and Eurostat data.',
    tags:['Python','Pandas','SQL','Data Viz'],
    notion:'https://valuable-pullover-8a2.notion.site/Italy-Crime-Economy-Analysis-beb02b5de78a8396a65c01cdce49f99e',
    github:'https://github.com/gibiai/crime_economy_italy_analysis'
  },
  {
    num:'002', wip:true, bonus:false, done:false,
    img:'./assets/ai.png', fallback:'fallback-ai', tag:'AI // SALARY',
    title:'AI JOBS MARKET &<br>SALARY PREDICTION',
    desc:"Analysis of AI's growing influence across industries, tracking adoption rates and strategic importance in the global market. ML salary prediction model.",
    tags:['Machine Learning','Python','Scikit-learn'],
    notion:'https://valuable-pullover-8a2.notion.site/wip-AI-Jobs-Market-Analysis-Salary-Prediction-33302b5de78a80f0be7bc586b717dd64',
    github:'https://github.com/gibiai/AI_Labor_Market_Impact_Analysis_2020-2024'
  },
  {
    num:'003', wip:true, bonus:false, done:false,
    img:'./assets/churn.png', fallback:'fallback-churn', tag:'SAAS // RETENTION',
    title:'CUSTOMER CHURN<br>ANALYSIS',
    desc:'Predictive modeling for a subscription SaaS. Identifying churn drivers, detecting at-risk users, optimizing retention to increase lifetime value.',
    tags:['XGBoost','Python','Power BI','SQL'],
    notion:'https://valuable-pullover-8a2.notion.site/wip-Customer-Churn-Analysis-33302b5de78a80cbadf2e87338375016',
    github:'https://github.com/gibiai/Customer_Churn_Analysis_Retention_Strategy-Subscription_Business_2025'
  },
  {
    num:'004', wip:false, bonus:true, done:false,
    img:'./assets/bonus.jpg', fallback:'fallback-bonus', tag:'TEAM // CHALLENGE',
    title:'GROUP DATA<br>CHALLENGE 2026',
    desc:'Collaborative Team Project (May 2026): Co-developed a Python management system for tailoring businesses using OOP principles to handle orders and inventory, including basic data visualization via Matplotlib.',
    tags:['Team Work','Python','Data Analysis'],
    notion:null,
    github:'https://github.com/gibiai/Progetto_Gruppo2_07_Maggio_2026'
  },
];
const pg = document.getElementById('projectsGrid');
projects.forEach(p => {
  let badge = '';
  if (p.done) badge = ` <span class="proj-done">DONE</span>`;
  if (p.wip) badge = ` <span class="proj-wip">WIP</span>`;
  if (p.bonus) badge = ` <span class="proj-bonus">BONUS</span>`;
  let links = '';
  if (p.notion && p.github) {
    links = `<a href="${p.notion}" target="_blank" rel="noopener">View on Notion ↗</a><span class="sep">|</span><a class="gh" href="${p.github}" target="_blank" rel="noopener">GitHub ↗</a>`;
  } else if (p.github) {
    links = `<a class="gh" href="${p.github}" target="_blank" rel="noopener">View on GitHub ↗</a>`;
  } else if (p.notion) {
    links = `<a href="${p.notion}" target="_blank" rel="noopener">View on Notion ↗</a>`;
  }
  pg.innerHTML += `
  <div class="proj">
    <div class="proj-img ${p.fallback}">
      <img src="${p.img}" alt="${p.tag}" onerror="this.style.display='none';">
      <div class="proj-img-overlay"></div>
      <div class="proj-img-tag">${p.tag}</div>
    </div>
    <div class="proj-body">
      <div class="proj-num">// ${p.num}${badge}</div>
      <div class="proj-title">${p.title}</div>
      <p class="proj-desc">${p.desc}</p>
      <div class="proj-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="proj-links">${links}</div>
    </div>
  </div>`;
});

/* NAV */
function goTo(id){document.getElementById(id).scrollIntoView({behavior:'smooth'});}
function openMobile(){document.getElementById('mobileMenu').classList.add('open');document.getElementById('mobileOverlay').classList.add('show');}
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('mobileOverlay').classList.remove('show');}

/* VANILLA TILT & INTERSECTION OBSERVER */
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js";
script.onload = () => {
  VanillaTilt.init(document.querySelectorAll(".proj"), {
    max: 6,
    speed: 400,
    glare: true,
    "max-glare": 0.12,
    scale: 1.02
  });
};
document.body.appendChild(script);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add reveal class and observe
const revealElements = document.querySelectorAll('.about-photo, .about-content, .about-chart-card, .sec-head, .sec-title, .sk, .lang, .cert, .proj, .contact-headline, .contact-sub, .contact-links-row, .contact-info, .status-block, .quote-block');
revealElements.forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});
