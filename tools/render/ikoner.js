/*
 * Digital praksis · tre bløde 3D-ikoner
 * Enheder: frie. Gulvet er y = 0. Alle ikoner bygges omkring origo og
 * renderes med samme kamera og lys (se ikoner.html).
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

/* Fælles palet: rolige pastelfarver + én tydelig accent pr. ikon */
export const C = {
  creme: '#f1e9de', hvid: '#f7f3ee', lavendel: '#ab9ff0', mint: '#8fd8b2', fersken: '#ffb68e',
  himmel: '#8ec4f2', smoer: '#f8d36a', rosa: '#f6a9be', salvie: '#b9d6a8', graa: '#cfc9c0',
  navy: '#2f3d6b', trae: '#e6c49a', blyant: '#f7c84a', grafit: '#4b4f58',
  groen: '#2fbf71', orange: '#ff7a45', koral: '#ff5d63'
};
const mats = {};
export function mat(hex, rough = 0.9) {
  rough = Math.max(rough, 0.88);   // matte, lerede overflader
  const k = hex + rough;
  if (!mats[k]) mats[k] = new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0, envMapIntensity: 0.9 });
  return mats[k];
}
function add(parent, geo, hex, pos, rot, rough) {
  const m = new THREE.Mesh(geo, mat(hex, rough));
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}
const rbox = (w, h, d, r, seg = 6) => new RoundedBoxGeometry(w, h, d, seg, r);

/* Rør med runde ender langs en række punkter (knækpunkter afrundes let) */
function roundTube(parent, pts, radius, hex, rough) {
  const v = pts.map(p => new THREE.Vector3(...p));
  const path = new THREE.CurvePath();
  for (let i = 0; i < v.length - 1; i++) path.add(new THREE.LineCurve3(v[i], v[i + 1]));
  const g = new THREE.TubeGeometry(path, 64 * (v.length - 1), radius, 28, false);
  add(parent, g, hex, null, null, rough);
  for (const p of v) add(parent, new THREE.SphereGeometry(radius, 28, 20), hex, [p.x, p.y, p.z], null, rough);
}

/* Afrundet 2D-form → blød ekstrudering */
function roundedShape(points, r) {
  // polygon med afrundede hjørner (radius r)
  const s = new THREE.Shape();
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = new THREE.Vector2(...points[(i - 1 + n) % n]), p1 = new THREE.Vector2(...points[i]), p2 = new THREE.Vector2(...points[(i + 1) % n]);
    const a = p0.clone().sub(p1).normalize(), b = p2.clone().sub(p1).normalize();
    const rr = Math.min(r, p0.distanceTo(p1) / 2.2, p2.distanceTo(p1) / 2.2);
    const s1 = p1.clone().add(a.multiplyScalar(rr)), s2 = p1.clone().add(b.multiplyScalar(rr));
    if (i === 0) s.moveTo(s1.x, s1.y); else s.lineTo(s1.x, s1.y);
    s.quadraticCurveTo(p1.x, p1.y, s2.x, s2.y);
  }
  s.closePath();
  return s;
}
function puffy(shape, depth, bevel) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.9, bevelSegments: 8, curveSegments: 32 });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ 1 Organisering */
export function organisering() {
  const root = new THREE.Group();
  // skemaet: en tyk, afrundet tavle der står let tilbagelænet på gulvet
  const board = new THREE.Group(); root.add(board);
  const W = 3.3, H = 2.75, D = 0.42;
  board.position.set(-0.25, 0, -0.35);
  board.rotation.set(-0.16, 0.22, 0);
  const lift = H / 2;
  add(board, rbox(W, H, D, 0.2), C.hvid, [0, lift, 0]);
  // farvet top med to ringe
  add(board, rbox(W - 0.18, 0.5, 0.12, 0.06), C.lavendel, [0, H - 0.38, D / 2 + 0.02]);
  for (const x of [-0.85, 0.85]) {
    add(board, new THREE.TorusGeometry(0.17, 0.065, 16, 40), C.navy, [x, H + 0.02, 0], [0, Math.PI / 2, 0], 0.6);
  }
  // regnbueceller 5 × 3
  const rows = [[C.koral, C.fersken, C.smoer, C.mint, C.himmel], [C.lavendel, C.rosa, C.hvid, C.smoer, C.mint], [C.himmel, C.mint, C.fersken, C.graa, C.lavendel]];
  const cw = 0.5, ch = 0.42, gx = 0.1, gy = 0.11;
  const x0 = -((5 * cw + 4 * gx) / 2) + cw / 2, y0 = H - 0.95;
  rows.forEach((row, r) => row.forEach((hex, c) => {
    if (hex === C.hvid) return;
    const pastel = hex === C.koral ? C.fersken : hex;
    add(board, rbox(cw, ch, 0.12, 0.06, 4), pastel, [x0 + c * (cw + gx), y0 - r * (ch + gy), D / 2 + 0.03]);
  }));
  // stort flueben (accent) foran skemaet
  const chk = new THREE.Group(); root.add(chk);
  chk.position.set(0.6, 0, 0.85);
  chk.rotation.set(0, -0.32, 0.0);
  // fluebenets spids hviler på gulvet
  roundTube(chk, [[-0.95, 0.98, 0], [-0.25, 0.31, 0], [1.3, 1.95, 0]], 0.31, C.groen, 0.86);
  return root;
}

/* ------------------------------------------------------------------ 2 Undervisning */
export function undervisning() {
  const root = new THREE.Group();
  const easel = new THREE.Group(); root.add(easel);
  easel.position.set(-0.3, 0, -0.35);
  easel.rotation.set(0, 0.2, 0);
  // ben
  const leg = (x, z, tx, tz) => {
    const g = new THREE.CapsuleGeometry(0.09, 2.6, 8, 16);
    const m = add(easel, g, C.trae, [x, 1.4, z], [tx, 0, tz]);
    return m;
  };
  leg(-1.05, 0.05, -0.06, 0.13); leg(1.05, 0.05, -0.06, -0.13); leg(0, -0.75, 0.32, 0);
  // tavle
  const bw = 3.0, bh = 2.05, by = 1.9;
  const tav = new THREE.Group(); easel.add(tav);
  tav.position.set(0, by, 0.18); tav.rotation.x = -0.1;
  add(tav, rbox(bw + 0.26, bh + 0.26, 0.24, 0.12), C.trae);
  add(tav, rbox(bw, bh, 0.1, 0.06), '#fbfcfd', [0, 0, 0.1]);
  add(tav, rbox(bw * 0.92, 0.12, 0.3, 0.05), C.trae, [0, -bh / 2 - 0.18, 0.12]);
  // farvede tegninger: søjlediagram, kurve og cirkel
  const z = 0.19;
  [[C.himmel, 0.55], [C.mint, 0.85], [C.fersken, 0.42], [C.lavendel, 1.05]].forEach(([hex, h], i) => {
    add(tav, rbox(0.24, h, 0.08, 0.06, 3), hex, [-1.15 + i * 0.36, -0.72 + h / 2, z]);
  });
  const curve = new THREE.CatmullRomCurve3([[0.2, -0.45], [0.55, 0.1], [0.85, -0.15], [1.25, 0.45]].map(([x, y]) => new THREE.Vector3(x, y, z)));
  add(tav, new THREE.TubeGeometry(curve, 80, 0.055, 16, false), C.koral, null, null, 0.6);
  add(tav, new THREE.TorusGeometry(0.28, 0.055, 16, 48), C.smoer, [0.62, 0.55, z], null, 0.6);
  add(tav, rbox(0.9, 0.08, 0.06, 0.03, 3), C.navy, [-0.7, 0.62, z], null, 0.6);
  add(tav, rbox(0.6, 0.08, 0.06, 0.03, 3), C.graa, [-0.85, 0.42, z], null, 0.6);
  // blyant på gulvet
  const p = new THREE.Group(); root.add(p);
  p.position.set(0.35, 0.21, 1.15); p.rotation.set(0, -0.5, 0);
  const pl = 2.1;
  const body = new THREE.CylinderGeometry(0.2, 0.2, pl, 6); body.rotateZ(Math.PI / 2);
  add(p, body, C.blyant, [0, 0, 0], [Math.PI / 6, 0, 0], 0.7);
  const tip = new THREE.ConeGeometry(0.2, 0.5, 6); tip.rotateZ(-Math.PI / 2);
  add(p, tip, C.trae, [pl / 2 + 0.25, 0, 0], [Math.PI / 6, 0, 0]);
  const lead = new THREE.ConeGeometry(0.07, 0.18, 12); lead.rotateZ(-Math.PI / 2);
  add(p, lead, C.grafit, [pl / 2 + 0.45, 0, 0]);
  const fer = new THREE.CylinderGeometry(0.21, 0.21, 0.24, 24); fer.rotateZ(Math.PI / 2);
  add(p, fer, C.graa, [-pl / 2 - 0.12, 0, 0], null, 0.5);
  const er = new THREE.CapsuleGeometry(0.2, 0.18, 8, 24); er.rotateZ(Math.PI / 2);
  add(p, er, C.rosa, [-pl / 2 - 0.36, 0, 0]);
  // taleboble (accent) ved tavlens øverste hjørne
  const bub = new THREE.Group(); root.add(bub);
  bub.position.set(1.4, 3.15, 0.25); bub.rotation.set(-0.08, -0.25, 0.04);
  const sh = roundedShape([[-0.85, -0.45], [-0.2, -0.45], [-0.45, -0.85], [0.25, -0.45], [0.85, -0.45], [0.85, 0.5], [-0.85, 0.5]], 0.32);
  add(bub, puffy(sh, 0.3, 0.12), C.orange, null, null, 0.66);
  for (const x of [-0.38, 0, 0.38]) add(bub, new THREE.SphereGeometry(0.1, 24, 16), C.hvid, [x, 0.03, 0.29]);
  return root;
}

/* ------------------------------------------------------------------ 3 Video & podcast */
export function video() {
  const root = new THREE.Group();
  // afspilningsknap (accent): blød "squircle" der står op
  const play = new THREE.Group(); root.add(play);
  play.position.set(0.45, 0, -0.35); play.rotation.set(-0.05, -0.2, 0);
  const S = 2.55;
  add(play, rbox(S, S, 0.95, 0.5, 8), C.koral, [0, S / 2, 0], null, 0.68);
  const tri = roundedShape([[-0.42, -0.62], [0.72, 0], [-0.42, 0.62]], 0.2);
  const tg = puffy(tri, 0.12, 0.08);
  add(play, tg, C.hvid, [0.06, S / 2, 0.52], null, 0.7);
  // hovedtelefoner foran til venstre, stående på puderne
  const hp = new THREE.Group(); root.add(hp);
  hp.position.set(-1.05, 0, 0.85); hp.rotation.set(0, 0.3, 0);
  const R = 1.0, cy = 0.58;
  add(hp, new THREE.TorusGeometry(R, 0.15, 24, 96, Math.PI), C.himmel, [0, cy + 0.12, 0], null, 0.72);
  const pad = new THREE.TorusGeometry(R - 0.1, 0.1, 16, 60, Math.PI * 0.5);
  add(hp, pad, C.navy, [0, cy + 0.12, 0], [0, 0, Math.PI * 0.25], 0.8);
  for (const s2 of [-1, 1]) {
    const cup = new THREE.SphereGeometry(0.56, 48, 32); cup.scale(0.46, 1, 1);
    add(hp, cup, C.himmel, [s2 * (R + 0.04), cy, 0], null, 0.72);
    const cush = new THREE.TorusGeometry(0.36, 0.15, 20, 48); cush.rotateY(Math.PI / 2);
    add(hp, cush, C.lavendel, [s2 * (R - 0.2), cy, 0], null, 0.85);
    add(hp, new THREE.SphereGeometry(0.3, 32, 20).scale(0.3, 1, 1), C.navy, [s2 * (R - 0.24), cy, 0], null, 0.85);
  }
  return root;
}

export const IKONER = { organisering, undervisning, video };
