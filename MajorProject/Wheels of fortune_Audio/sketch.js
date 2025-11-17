const R = 115;
const BEAD_W = 20;
const CHAIN_GAP = 10;
let wheels = [];
let chains = [];

const BASE_CANVAS_SIZE = 800;
let baseImg;
let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;

let sounds = [];
let fft;
let buttonPos = [
  { x: 270, y: 286 },
  { x: 509, y: 216 },
  { x: 194, y: 512 },
  { x: 448, y: 446 },
  { x: 687, y: 392 },
]
let start = false;

function preload() {
  sounds.push(loadSound('assets/Odyssey_Breakdown_Loop_1_-_128_BPM_F_Min.wav'));
  sounds.push(loadSound('assets/Odyssey_House_Drum_Loop_-_128_BPM.wav'));
  sounds.push(loadSound('assets/Odyssey_Impact.wav'));
  sounds.push(loadSound('assets/Odyssey_House_Drop_Loop_12_-_128_BPM_G_Min.wav'));
  sounds.push(loadSound('assets/Trap-Demo-4-Cymatics-LeadOneShot30-E.mp3'));
}

function mousePressed() {
  let pos = getMousePosition();
  for (let i = 0; i < buttonPos.length; i++) {
    let b = buttonPos[i];
    if (dist(pos.x, pos.y, b.x, b.y) < R / scaleFactor) {
      let index = i + 1;
      if (index == 1) {
        if (!sounds[0].isPlaying()) {
          sounds[0].loop();
        } else {
          sounds[0].stop();
        }
        start = true;
        loop();
      } else if (index == 2) {
        if (!sounds[1].isPlaying()) {
          sounds[1].loop();
        } else {
          sounds[1].stop();
        }
        start = true;
        loop();
      } else if (index == 3) {
        sounds[2].play();
        start = true;
        loop();
      } else if (index == 4) {
        if (!sounds[3].isPlaying()) {
          sounds[3].loop();
        } else {
          sounds[3].stop();
        }
        start = true;
        loop();
      } else if (index == 5) {
        sounds[4].play();
        start = true;
        loop();
      }
      break;
    }
  }
}

function setup() {
  createCanvas(BASE_CANVAS_SIZE, BASE_CANVAS_SIZE);
  randomSeed();
  background(37, 84, 125);

  frameRate(30);

  buildWheelsAndResolveChain();
  wheels.forEach((w, i) => {
    genTightChain(w.x, w.y, R + CHAIN_GAP, BEAD_W);
  });

  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();

  fft = new p5.FFT(0.3);
}

function draw() {
  background(37, 84, 125);
  fft.analyze();

  translate(offsetX, offsetY);
  scale(scaleFactor);

  wheels.forEach((w) => w.displayWheel());
  drawTightChain();

  if (!start) {
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
}

function calculateImageDrawProps() {
  scaleFactor = min(width, height) / BASE_CANVAS_SIZE;

  offsetX = (width - BASE_CANVAS_SIZE * scaleFactor) / 2;
  offsetY = (height - BASE_CANVAS_SIZE * scaleFactor) / 2;
}

function getMousePosition() {
  return {
    x: (mouseX - offsetX) / scaleFactor,
    y: (mouseY - offsetY) / scaleFactor
  }
}

function buildWheelsAndResolveChain() {
  wheels.push(new Wheel(113, 104, {
    variantCircle: "B", curved: true, curvedAngle: PI / 2,
    variantCirclePal: [41, 92, 49],
    pal: {
      bg: [205, 225, 239],
      stroke: [10, 10, 104],
      center: [155, 78, 148],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));

  wheels.push(new Wheel(346, 42, {
    variantCircle: "C", isTypeI: true,
    variantCirclePal: [200, 90, 163],
    pal: {
      bg: [242, 181, 64],
      stroke: [255, 25, 25],
      center: [230, 97, 47],
      dot1: [165, 162, 167],
      dot2: [0, 0, 0],
      dot3: [69, 137, 68],
      dot4: [165, 162, 167],
    }
  }));

  wheels.push(new Wheel(589, -13, {
    variantCircle: "B", curved: true, curvedAngle: PI / 4,
    variantCirclePal: [199, 98, 180],
    pal: {
      bg: [243, 240, 236],
      stroke: [218, 53, 35],
      center: [191, 94, 176],
      dot1: [192, 47, 42],
      dot2: [52, 92, 68],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));

  wheels.push(new Wheel(30, 328, {
    variantCircle: "C",
    variantCirclePal: [204, 86, 139],
    pal: {
      bg: [242, 181, 64],
      stroke: [39, 82, 145],
      center: [229, 84, 67],
      dot1: [103, 104, 85],
      dot2: [19, 1, 0],
      dot3: [225, 90, 82],
      dot4: [178, 184, 198],
    }
  }));

  wheels.push(new Wheel(271, 287, {
    variantCircle: "B", curved: true, curvedAngle: -PI / 4,
    variantCirclePal: [230, 87, 75],
    pal: {
      bg: [225, 249, 247],
      stroke: [63, 139, 59],
      center: [204, 84, 160],
      dot1: [74, 73, 54],
      dot2: [199, 207, 200],
      dot3: [0, 0, 0],
      dot4: [68, 140, 59],
    },
    aniType: "scale",
    soundIndex: 0
  }));
  wheels.push(new Wheel(508, 215, {
    variantCircle: "B",
    variantCirclePal: [119, 175, 215],
    pal: {
      bg: [238, 181, 76],
      stroke: [196, 150, 214],
      center: [182, 76, 160],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    },
    aniType: "scale",
    soundIndex: 1
  }));
  wheels.push(new Wheel(758, 162, {
    variantCircle: "C",
    variantCirclePal: [238, 228, 243],
    pal: {
      bg: [242, 181, 64],
      stroke: [33, 62, 107],
      center: [169, 74, 146],
      dot1: [37, 6, 8],
      dot2: [70, 67, 49],
      dot3: [0, 0, 0],
      dot4: [225, 70, 54],
    }
  }));
  wheels.push(new Wheel(-48, 556, {
    variantCircle: "B", curved: true, curvedAngle: -PI / 4,
    variantCirclePal: [188, 71, 166],
    pal: {
      bg: [215, 252, 254],
      stroke: [66, 146, 149],
      center: [188, 71, 166],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));
  wheels.push(new Wheel(193, 509.5, {
    variantCircle: "C", isTypeI: true,
    variantCirclePal: [223, 52, 42],
    pal: {
      bg: [242, 181, 64],
      stroke: [10, 10, 104],
      center: [226, 99, 176],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    },
    aniType: "scale",
    soundIndex: 2
  }));
  wheels.push(new Wheel(448, 445, {
    variantCircle: "A", curved: true, curvedAngle: 0,
    variantCirclePal: [226, 92, 72],
    pal: {
      bg: [247, 236, 238],
      stroke: [215, 65, 62],
      center: [224, 111, 174],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    },
    aniType: "scale",
    soundIndex: 3
  }));
  wheels.push(new Wheel(686, 390, {
    variantCircle: "B", curved: true, curvedAngle: -PI / 4,
    variantCirclePal: [41, 92, 49],
    pal: {
      bg: [240, 250, 248],
      stroke: [236, 148, 64],
      center: [155, 78, 148],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    },
    aniType: "scale",
    soundIndex: 4
  }));
  wheels.push(new Wheel(127, 739.5, {
    variantCircle: "B", curved: true, curvedAngle: PI / 4,
    variantCirclePal: [132, 177, 224],
    pal: {
      bg: [251, 235, 241],
      stroke: [225, 55, 41],
      center: [185, 89, 182],
      dot1: [71, 84, 63],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));
  wheels.push(new Wheel(372, 675.5, {
    variantCircle: "B",
    variantCirclePal: [226, 111, 195],
    pal: {
      bg: [242, 194, 93],
      stroke: [184, 49, 106],
      center: [226, 111, 195],
      dot1: [217, 203, 101],
      dot2: [89, 91, 78],
      dot3: [213, 48, 39],
      dot4: [205, 225, 239],
    }
  }));
  wheels.push(new Wheel(611, 625.5, {
    variantCircle: "B",
    variantCirclePal: [227, 88, 57],
    pal: {
      bg: [242, 181, 64],
      stroke: [49, 105, 169],
      center: [230, 107, 190],
      dot1: [84, 77, 64],
      dot2: [38, 84, 42],
      dot3: [216, 50, 38],
      dot4: [205, 225, 239],
    }
  }));
  wheels.push(new Wheel(845, 570, {
    variantCircle: "C", isTypeI: true,
    variantCirclePal: [41, 92, 49],
    pal: {
      bg: [242, 181, 64],
      stroke: [10, 10, 104],
      center: [155, 78, 148],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));
  wheels.push(new Wheel(532, 859, {
    variantCircle: "B",
    variantCirclePal: [41, 92, 49],
    pal: {
      bg: [252, 240, 237],
      stroke: [229, 70, 54],
      center: [155, 78, 148],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));
  wheels.push(new Wheel(768, 813, {
    variantCircle: "B",
    variantCirclePal: [41, 92, 49],
    pal: {
      bg: [252, 240, 237],
      stroke: [112, 192, 120],
      center: [221, 129, 210],
      dot1: [184, 55, 36],
      dot2: [38, 84, 42],
      dot3: [0, 0, 0],
      dot4: [205, 225, 239],
    }
  }));
}

class Wheel {
  constructor(x, y, options) {
    this.x = x;
    this.y = y;
    this.r = R;
    this.isTypeI = options.isTypeI || false;
    this.rot = 0;
    this.options = {
      curved: false,
      curvedAngle: 0,
      variantCircle: "A",
      variantCirclePal: [30, 180, 90],
      aniType: "rotate",
      rotateSpeed: random([1, -1]),
    };
    Object.assign(this.options, options);
  }

  displayWheel() {
    push();
    translate(this.x, this.y);
    rotate(this.rot);

    let _amp = fft.getEnergy(20, 200);
    let speedOffset = map(_amp, 200, 250, 0, 0.05);
    if (sounds[3].isPlaying()) {
      speedOffset = map(_amp, 230, 240, 0, 0.05);
    }
    let scaleOffset = 0;
    if (this.options.aniType == "rotate") {
      this.rot += this.options.rotateSpeed * speedOffset;
    } else {
      let soundIndex = this.options.soundIndex;
      if (sounds[soundIndex].isPlaying()) {
        scaleOffset = map(_amp, 200, 250, -0.1, 0.1);
        if (sounds[3].isPlaying()) {
          scaleOffset = map(_amp, 230, 240, -0.1, 0.1);
        }
      }
    }
    scale(this.r / 22 + scaleOffset);
    this.drawCore();
    pop();
  }

  drawCore() {
    withStyle(() => {
      noStroke();
      fill(color(...this.options.pal.bg));
      circle(0, 0, 40);
    });
    if (this.isTypeI) {
      drawStrongWavyRing({
        innerR: 10,
        outerR: 20,
        amp: 5,
        freq: 70,
        col: color(223, 50, 34),
      });
    } else {
      const radii = [11, 12.8, 14.6, 16.4, 18.2, 19.6];
      const col = color(...this.options.pal.stroke);
      radii.forEach((r) => dashedRing(r, col, [0.3, 2], 1));
    }
    const centerCol = color(...this.options.pal.center);
    withStyle(() => {
      stroke(centerCol);
      strokeWeight(1);
      fill(red(centerCol), green(centerCol), blue(centerCol), 0.8 * 255);
      circle(0, 0, 20);
    });
    drawVariantCircle(this.options.variantCircle, this.options.variantCirclePal);
    const dots = [
      { d: 11, col: this.options.pal.dot1 },
      { d: 8, col: this.options.pal.center },
      { d: 6, col: this.options.pal.dot2 },
      { d: 4, col: this.options.pal.dot3 },
      { d: 2, col: this.options.pal.dot4 },
    ];
    dots.forEach(({ d, col }) =>
      withStyle(() => {
        noStroke();
        fill(...col);
        circle(0, 0, d);
      })
    );
    if (this.options.curved) {
      drawRandomCurvedLine([255, 70, 130], this.options.curvedAngle);
    }
  }
}

function genTightChain(cx, cy, radius, beadW) {
  const circ = TWO_PI * radius;
  const nBeads = floor(circ / beadW);
  const stepA = TWO_PI / nBeads;
  let angle = 0; 
  let plist = []
  for (let i = 0; i < nBeads; i++) {
    const r = random(radius - 5, radius + 5)
    const x = cx + cos(angle) * r;
    const y = cy + sin(angle) * r;
    plist.push({ x, y, merge: false })
    angle += stepA;
  }
  chains.push(plist);
}

function drawTightChain() {
  const colors = [
    color(252, 11, 13),
    color(254, 155, 14),
    color(99, 153, 35),
    color(93, 192, 213),
  ];

  for (let j = 0; j < chains.length; j++) {
    const plist = chains[j];
    for (let c = 0; c < chains.length; c++) {
      if (j != c) {
        const otherPlist = chains[c]
        if (otherPlist) {
          for (let i = 0; i < plist.length; i++) {
            for (let k = 0; k < otherPlist.length; k++) {
              const { x: x1, y: y1 } = plist[i];
              const { x: x2, y: y2, merge: merge2 } = otherPlist[k];
              if (dist(x1, y1, x2, y2) < 20) {
                plist[i].x = x2;
                plist[i].y = y2;
                plist[i].merge = !merge2;
                break;
              }
            }
          }
        }
      }
    }
  }

  let _amp = fft.getEnergy(20, 200);
  let offsetSize = map(_amp, 200, 250, 0, 5);
  if (sounds[3].isPlaying()) {
    offsetSize = map(_amp, 230, 240, 0, 5);
    offsetSize = constrain(offsetSize, -5, 5);
  }

  for (let j = 0; j < chains.length; j++) {
    const plist = chains[j];
    for (let i = 0; i < plist.length; i++) {
      let next = plist[i + 1];
      if (i == plist.length - 1) {
        next = plist[0];
      }
      if (next) {
        const { x: x1, y: y1, merge: merge1 } = plist[i];
        const { x: x2, y: y2, merge: merge2 } = next;

        if (merge1 && merge2) {
          continue;
        }

        push();
        stroke(255, 255, 255);
        strokeWeight(1.5);
        let cx = (x1 + x2) / 2;
        let cy = (y1 + y2) / 2;
        let size = dist(x1, y1, x2, y2);
        translate(cx, cy);
        rotate(atan2(y2 - y1, x2 - x1));
        if (i % 6 != 0) {
          stroke(255, 255, 255, 180);
          fill(colors[i % colors.length]);
          ellipse(0, 0, size, min(size / 2, 12) + offsetSize);
        }
        pop();
      }
    }
  }

  for (let j = 0; j < chains.length; j++) {
    const plist = chains[j];
    for (let i = 0; i < plist.length; i++) {
      let next = plist[i + 1];
      if (i == plist.length - 1) {
        next = plist[0];
      }
      if (next) {
        const { x: x1, y: y1, merge: merge1 } = plist[i];
        const { x: x2, y: y2, merge: merge2 } = next;

        if (merge1 && merge2) {
          continue;
        }
        push();
        stroke(255, 255, 255);
        strokeWeight(1.5);
        let cx = (x1 + x2) / 2;
        let cy = (y1 + y2) / 2;
        let size = dist(x1, y1, x2, y2);
        translate(cx, cy);
        rotate(atan2(y2 - y1, x2 - x1));
        if (i % 6 === 0) {  
          fill(0);
          ellipse(0, 0, size, min(BEAD_W * 0.75, 12) + offsetSize);
          fill(255);
          noStroke();
          ellipse(0, 0, 3, 3);
        }
        pop();
      }
    }
  }
}

function drawVariantCircle(force, variantCirclePal) {
  const pick = force
  if (pick === "A") return drawVariantA();
  if (pick === "B") return drawVariantB(variantCirclePal);
  return drawVariantC(variantCirclePal);
}
function drawVariantA() {
  drawWavyCircle({
    baseR: 5,
    amp: 4,
    freq: 20,
    col: color(255, 140, 0),
    sw: 0.5,
    step: 0.02,
  });
}
function drawVariantB(variantCirclePal) {
  const strokeCol = color([...variantCirclePal], 200);
  withStyle(() => {
    noFill();
    stroke(strokeCol);
    strokeWeight(1);
    for (let baseR = 6; baseR <= 10; baseR += 2) {
      const amp = random(1, 1.1),
        freq = floor(random(0, 2));
      beginShape();
      for (let a = 0; a <= TWO_PI + 0.05; a += 0.1)
        vertex(
          cos(a) * (baseR + sin(a * freq + random(-0.1, 0.1)) * amp),
          sin(a) * (baseR + sin(a * freq + random(-0.1, 0.1)) * amp)
        );
      endShape(CLOSE);
    }
  });
}
function drawVariantC(variantCirclePal) {
  const strokeCol = color([...variantCirclePal], 153);
  withDash([0.3, 1.8], () => {
    withStyle(() => {
      noFill();
      stroke(strokeCol);
      strokeWeight(1);
      for (let r = 6; r <= 10; r += 2) ellipse(0, 0, r * 1.8);
    });
  });
}
function withStyle(fn) {
  push();
  try {
    fn();
  } finally {
    pop();
  }
}
function withDash(arr, fn) {
  withStyle(() => {
    drawingContext.setLineDash(arr);
    try {
      fn();
    } finally {
      drawingContext.setLineDash([]);
    }
  });
}
function dashedRing(r, col, dash, sw) {
  withDash(dash, () => {
    withStyle(() => {
      noFill();
      stroke(col);
      strokeWeight(sw + 0.5);
      ellipse(0, 0, r * 2);
    });
  });
}
function drawWavyCircle({ baseR, amp, freq, col, sw = 0.5, step = 0.02 }) {
  withStyle(() => {
    noFill();
    stroke(col);
    strokeWeight(sw);
    beginShape();
    for (let a = 0; a <= TWO_PI + step; a += step)
      vertex(
        cos(a) * (baseR + sin(a * freq) * amp),
        sin(a) * (baseR + sin(a * freq) * amp)
      );
    endShape(CLOSE);
  });
}
function drawStrongWavyRing({
  innerR,
  outerR,
  amp,
  freq,
  col,
  sw = 0.5,
  steps = 180,
}) {
  const baseR = (innerR + outerR) / 2,
    stepA = TWO_PI / steps;
  withStyle(() => {
    noFill();
    stroke(col);
    strokeWeight(sw);
    beginShape();
    for (let a = 0; a <= TWO_PI + stepA; a += stepA)
      vertex(
        cos(a) * (baseR + sin(a * freq) * amp),
        sin(a) * (baseR + sin(a * freq) * amp)
      );
    endShape(CLOSE);
  });
}
function drawRandomCurvedLine(lineColor, curvedAngle) {
  withStyle(() => {
    stroke(...lineColor);
    strokeWeight(1);
    noFill();
    beginShape();
    vertex(0, 0);
    const angle = curvedAngle,
      len = 25,
      ctrlAngle = angle + random(-PI / 3, PI / 3),
      ctrlLen = len * 0.5,
      cx = cos(ctrlAngle) * ctrlLen,
      cy = sin(ctrlAngle) * ctrlLen,
      x = cos(angle) * len,
      y = sin(angle) * len;
    quadraticVertex(cx, cy, x, y);
    endShape();
  });
}
function distSq(a, b) {
  return sq(a.x - b.x) + sq(a.y - b.y);
}