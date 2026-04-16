// ─── FORMULA AUTO GENERATOR — CORE ENGINE ────────────────────────────────────
// Pure logic: no DOM dependency. Imported by formula_generator.html.

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MATERIAL = ['', 'Beast', 'Wood', 'Metal', 'Cloth', 'Medicine', 'Mana'];
const SUCCESS_CONSTANT = 160;
const COUNTER_LIMIT = 20;

// ─── STAT DATA ────────────────────────────────────────────────────────────────
// new Stat(id, name, mat_id, pot, mat_base, cheap_limit, multiplier, multiplier2, category, type, negative_ok)

const STATS = {};

function defStat(id, name, mat_id, pot, mat_base, cheap_limit, multiplier, multiplier2, category, type, negative_ok) {
  STATS[id] = {
    id, name,
    mat_id:     +mat_id,
    pot:        +pot,
    mat_base:   +mat_base,
    cheap_limit:+cheap_limit,
    multiplier: +multiplier,
    multiplier2:+multiplier2,
    category, type,
    negative_ok:+negative_ok
  };
}

defStat(3,  'STR',                   1,  5,  25,     20,  1, 1,  'Enhance Stats',      'U', 1);
defStat(4,  'STR %',                 1, 10,  50,     10,  1, 0,  'Enhance Stats',      'U', 1);
defStat(5,  'INT',                   2,  5,  25,     20,  1, 1,  'Enhance Stats',      'U', 1);
defStat(6,  'INT %',                 2, 10,  50,     10,  1, 0,  'Enhance Stats',      'U', 1);
defStat(7,  'VIT',                   3,  5,  25,     20,  1, 1,  'Enhance Stats',      'U', 1);
defStat(8,  'VIT %',                 3, 10,  50,     10,  1, 0,  'Enhance Stats',      'U', 1);
defStat(9,  'AGI',                   4,  5,  25,     20,  1, 1,  'Enhance Stats',      'U', 1);
defStat(10, 'AGI %',                 4, 10,  50,     10,  1, 0,  'Enhance Stats',      'U', 1);
defStat(11, 'DEX',                   5,  5,  25,     20,  1, 1,  'Enhance Stats',      'U', 1);
defStat(12, 'DEX %',                 5, 10,  50,     10,  1, 0,  'Enhance Stats',      'U', 1);
defStat(13, 'Natural HP Regen',      3,  5,  25,     20,  1, 1,  'Enhance HP/MP',      'A', 1);
defStat(14, 'Natural HP Regen %',    3, 10,  50,     10,  1, 0,  'Enhance HP/MP',      'A', 1);
defStat(15, 'Natural MP Regen',      2, 10,  50,     10,  1, 1,  'Enhance HP/MP',      'A', 1);
defStat(16, 'Natural MP Regen %',    2, 20, 100,      5,  1, 0,  'Enhance HP/MP',      'A', 1);
defStat(17, 'MaxHP',                 3,  3,  16.49, 200, 10,160, 'Enhance HP/MP',      'U', 1);
defStat(18, 'MaxHP %',               3, 10,  50,     10,  1, 1,  'Enhance HP/MP',      'U', 1);
defStat(19, 'MaxMP',                 2,  6,  33.49, 150, 10, 10, 'Enhance HP/MP',      'U', 1);
defStat(20, 'ATK',                   1,  3,  16.49,  20,  1, 1,  'Enhance Attack',     'W', 1);
defStat(21, 'ATK %',                 1, 10,  50,     10,  1, 1,  'Enhance Attack',     'W', 1);
defStat(22, 'MATK',                  2,  3,  16.49,  20,  1, 1,  'Enhance Attack',     'W', 1);
defStat(23, 'MATK %',                2, 10,  50,     10,  1, 1,  'Enhance Attack',     'W', 1);
defStat(24, 'Stability %',           5, 20, 100,      5,  1, 1,  'Enhance Attack',     'U', 1);
defStat(25, 'Physical Pierce %',     1, 20, 100,      5,  1, 1,  'Enhance Attack',     'W', 1);
defStat(26, 'Magic Pierce %',        2, 20, 100,      5,  1, 1,  'Enhance Attack',     'W', 1);
defStat(27, 'DEF',                   3,  3,  16.49,  20,  1,10,  'Enhance Defense',    'A', 1);
defStat(28, 'DEF %',                 3, 10,  50,     10,  1, 1,  'Enhance Defense',    'A', 1);
defStat(29, 'MDEF',                  3,  3,  16.49,  20,  1,10,  'Enhance Defense',    'A', 1);
defStat(30, 'MDEF %',                3, 10,  50,     10,  1, 1,  'Enhance Defense',    'A', 1);
defStat(31, 'Physical Resistance %', 3, 10,  50,     10,  1, 1,  'Enhance Defense',    'A', 1);
defStat(32, 'Magic Resistance %',    2, 10,  50,     10,  1, 1,  'Enhance Defense',    'A', 1);
defStat(33, 'Accuracy',              5, 10,  50,     10,  1, 2,  'Enhance Accuracy',   'W', 1);
defStat(34, 'Accuracy %',            5, 20, 100,      5,  1, 1,  'Enhance Accuracy',   'W', 1);
defStat(35, 'Dodge',                 4, 10,  50,     10,  1, 2,  'Enhance Dodge',      'A', 1);
defStat(36, 'Dodge %',               4, 20, 100,      5,  1, 1,  'Enhance Dodge',      'A', 1);
defStat(37, 'ASPD',                  4,  1,   1.49,  20,  1,16,  'Enhance Speed',      'U', 1);
defStat(38, 'ASPD %',                4,  1,   5,     20,  1, 1,  'Enhance Speed',      'U', 1);
defStat(39, 'CSPD',                  5,  1,   1.49,  20,  1,16,  'Enhance Speed',      'U', 1);
defStat(40, 'CSPD %',                5,  1,   5,     20,  1, 1,  'Enhance Speed',      'U', 1);
defStat(41, 'Critical Rate',         6,  1,   5,     20,  1, 1,  'Enhance Critical',   'U', 1);
defStat(42, 'Critical Rate %',       6,  1,   5,     20,  1, 1,  'Enhance Critical',   'U', 1);
defStat(43, 'Critical Damage',       6,  3,  16.49,  20,  1, 1,  'Enhance Critical',   'U', 1);
defStat(44, 'Critical Damage %',     6, 10,  50,     10,  1, 1,  'Enhance Critical',   'U', 1);
defStat(45, '% stronger against Fire',  6, 5, 25,   20,  1, 1,  'Enhance Elements',   'W', 1);
defStat(46, '% stronger against Water', 6, 5, 25,   20,  1, 1,  'Enhance Elements',   'W', 1);
defStat(47, '% stronger against Wind',  6, 5, 25,   20,  1, 1,  'Enhance Elements',   'W', 1);
defStat(48, '% stronger against Earth', 6, 5, 25,   20,  1, 1,  'Enhance Elements',   'W', 1);
defStat(49, '% stronger against Light', 6, 5, 25,   20,  1, 1,  'Enhance Elements',   'W', 1);
defStat(50, '% stronger against Dark',  6, 5, 25,   20,  1, 1,  'Enhance Elements',   'W', 1);
defStat(51, 'Fire resistance %',     6,  5,  25,     20,  1, 1,  'Enhance Elements',   'A', 1);
defStat(52, 'Water resistance %',    6,  5,  25,     20,  1, 1,  'Enhance Elements',   'A', 1);
defStat(53, 'Wind resistance %',     6,  5,  25,     20,  1, 1,  'Enhance Elements',   'A', 1);
defStat(54, 'Earth resistance %',    6,  5,  25,     20,  1, 1,  'Enhance Elements',   'A', 1);
defStat(55, 'Light resistance %',    6,  5,  25,     20,  1, 1,  'Enhance Elements',   'A', 1);
defStat(56, 'Dark resistance %',     6,  5,  25,     20,  1, 1,  'Enhance Elements',   'A', 1);
defStat(57, 'Ailment Resistance %',  6, 20, 100,      5,  1, 1,  'Special Enhancement','U', 1);
defStat(58, 'Guard Power %',         6, 20, 100,      5,  1, 1,  'Special Enhancement','U', 1);
defStat(59, 'Guard Recharge %',      6, 20, 100,      5,  1, 1,  'Special Enhancement','U', 1);
defStat(60, 'Evasion Recharge %',    6, 20, 100,      5,  1, 1,  'Special Enhancement','U', 1);
defStat(61, 'Aggro %',               6,  6,  33.49,  15,  1, 1,  'Special Enhancement','U', 1);
defStat(62, 'Fire Element',          6,100, 150,      1,  1, 0,  'Awaken Elements',    'E', 0);
defStat(63, 'Water Element',         6,100, 150,      1,  1, 0,  'Awaken Elements',    'E', 0);
defStat(64, 'Wind Element',          6,100, 150,      1,  1, 0,  'Awaken Elements',    'E', 0);
defStat(65, 'Earth Element',         6,100, 150,      1,  1, 0,  'Awaken Elements',    'E', 0);
defStat(66, 'Light Element',         6,100, 150,      1,  1, 0,  'Awaken Elements',    'E', 0);
defStat(67, 'Dark Element',          6,100, 150,      1,  1, 0,  'Awaken Elements',    'E', 0);

// ─── GARB (ARMOR) LIST ────────────────────────────────────────────────────────
// Sourced from coryn.html equipments[8]

const GARBS = [
  { id: 992,  name: "Adventurer's Garb",        pot: 15 },
  { id: 993,  name: "Leather Armor",             pot: 16 },
  { id: 995,  name: "Mage Robe",                 pot: 17 },
  { id: 994,  name: "Warrior Mail",              pot: 17 },
  { id: 996,  name: "Hunter's Garb",             pot: 18 },
  { id: 997,  name: "Straye Garb",               pot: 18 },
  { id: 999,  name: "Fightwear",                 pot: 19 },
  { id: 1007, name: "Magic Crystal Armor",       pot: 19 },
  { id: 1006, name: "Forest Wolf Garb",          pot: 19 },
  { id: 1000, name: "Plate Armor",               pot: 20 },
  { id: 998,  name: "Brutal Dragon Armor",       pot: 20 },
  { id: 1001, name: "Green Dragon Garb",         pot: 21 },
  { id: 1002, name: "Aqua Garb",                 pot: 22 },
  { id: 1003, name: "Ooze Armor",                pot: 23 },
  { id: 1004, name: "Scale Armor",               pot: 23 },
  { id: 1917, name: "Sakura Kimono",             pot: 23 },
  { id: 1005, name: "Oracle Robe",               pot: 23 },
  { id: 1299, name: "Medic Coat",                pot: 24 },
  { id: 1023, name: "Killer Coat",               pot: 24 },
  { id: 1181, name: "Magic Swordsman's Garb",    pot: 24 },
  { id: 1278, name: "Knight Armor",              pot: 24 },
  { id: 1421, name: "Outerworld Armor",          pot: 25 },
  { id: 1659, name: "Brigandine",                pot: 28 },
  { id: 1859, name: "Praetor Suit",              pot: 29 },
  { id: 1799, name: "Armigma",                   pot: 29 },
  { id: 1916, name: "Sakura Kimono II",          pot: 30 },
  { id: 1941, name: "Twilight Dress",            pot: 30 },
  { id: 2242, name: "Assassin Garb",             pot: 31 },
  { id: 2230, name: "Anniversary Dress",         pot: 31 },
  { id: 2314, name: "Fortistra",                 pot: 32 },
  { id: 2708, name: "Diomedea Suit",             pot: 33 },
  { id: 2583, name: "Holy Robe",                 pot: 34 },
  { id: 2637, name: "Fortuita Vestibus",         pot: 34 },
  { id: 2709, name: "Mozt Armor",                pot: 35 },
  { id: 2831, name: "Sakura Kimono III",         pot: 35 },
  { id: 3498, name: "Jeremiah Mail",             pot: 36 },
  { id: 3400, name: "Soldier Armor",             pot: 37 },
  { id: 3569, name: "Lil Empress Garb",          pot: 38 },
  { id: 3997, name: "Anniversary Festive Garb",  pot: 38 },
  { id: 4266, name: "Elfin Armor",               pot: 39 },
  { id: 4545, name: "Sakura Kimono IV",          pot: 41 },
  { id: 4047, name: "Heaven Feather Garb",       pot: 41 },
  { id: 6667, name: "Stoodie's Robe",            pot: 43 },
  { id: 6668, name: "Ninja Costume",             pot: 44 },
  { id: 4600, name: "Bark Mail",                 pot: 44 },
  { id: 5665, name: "Anniversary Festive Garb II",  pot: 45 },
  { id: 6350, name: "Khalyps Mail",              pot: 45 },
  { id: 5534, name: "Demon Empress Garb",        pot: 46 },
  { id: 6089, name: "Maiden",                    pot: 49 },
  { id: 6483, name: "Anniversary Festive Garb III", pot: 49 },
  { id: 7075, name: "Trickster Costume",         pot: 54 },
  { id: 7308, name: "Anniversary Festive Garb IV", pot: 54 },
  { id: 7700, name: "Water Priest Robe",         pot: 56 },
  { id: 7760, name: "Anniversary Festive Garb V",   pot: 57 },
  { id: 8157, name: "Anniversary Festive Garb VI",  pot: 60 },
  { id: 11111111, name: "Starry Robe",   pot: 57 },
  // { id: ???, name: "Mulgoon Robe",  pot: ??? },
  // { id: ???, name: "Dragoon Mail",  pot: ??? },
];

// ─── MATH FUNCTIONS ───────────────────────────────────────────────────────────

function valToCounter(val, statId) {
  if (!val || !statId) return 0;
  const s = STATS[statId];
  const sign = val < 0 ? -1 : 1;
  const abs = Math.abs(val);
  if (abs <= s.cheap_limit) return (abs / s.multiplier) * sign;
  let result = s.cheap_limit / s.multiplier;
  const excess = abs - s.cheap_limit;
  if (s.multiplier2) result += excess / s.multiplier2;
  return result * sign;
}

function counterToVal(ctr, statId) {
  const s = STATS[statId];
  const sign = ctr < 0 ? -1 : 1;
  const abs = Math.abs(ctr);
  const cheapCtr = s.cheap_limit / s.multiplier;
  if (abs <= cheapCtr) return Math.round(abs * s.multiplier) * sign;
  const val = s.cheap_limit + (abs - cheapCtr) * (s.multiplier2 || s.multiplier);
  return Math.round(val) * sign;
}

// Returns potential change in x100 units. Divide by 100 for actual.
function calcPot(statId, startVal, endVal, penalty, equipType, matchElement) {
  const s = STATS[statId];
  const start = valToCounter(startVal, statId);
  const end   = valToCounter(endVal,   statId);
  const softLimit = Math.min(COUNTER_LIMIT, 100 / s.pot, s.cheap_limit / s.multiplier);

  let [mn, mx] = start < end ? [start, end] : [end, start];
  let diff = mx - mn, outliers = 0;

  if (Math.abs(mn) > softLimit) { const c = Math.abs(mn) - softLimit; outliers += c; diff -= c; }
  if (Math.abs(mx) > softLimit) { const c = Math.abs(mx) - softLimit; outliers += c; diff -= c; }
  if (diff < 0) { outliers += diff; diff = 0; }

  let multiplier = 1;
  if ((s.type === 'A' && equipType === 'W') || (s.type === 'W' && equipType === 'A')) multiplier *= 2;
  if (s.type === 'E' && matchElement === '1') multiplier /= 10;

  let base, nega;
  if (start > end) {
    base = (30500 * diff + 2 * 7625 * outliers) * s.pot;
    nega = 1;
  } else {
    base = (100000 * diff + 200000 * outliers) * s.pot;
    nega = -1;
  }
  return Math.floor(base * multiplier / 100000) * nega * penalty;
}

function calcMats(oldCtr, newCtr, statId, smithProf, extraReduction = 0) {
  const s = STATS[statId];
  const smithReduction = Math.min(1, Math.max(0,
    (Math.floor(smithProf / 10) + Math.floor(smithProf / 50)) / 100
  ));
  // Multiplicative stacking: (1 - smith) × (1 - extra). Game compounds reductions.
  const modifier = Math.max(0, (1 - smithReduction) * (1 - extraReduction));
  const startCtr = Math.round(oldCtr);
  const endCtr   = Math.round(newCtr);
  let total = 0;
  if (startCtr < endCtr)
    for (let i = startCtr; i < endCtr; i++) {
      const m = Math.max(Math.abs(i), Math.abs(i + 1));
      total += Math.trunc(s.mat_base * m * m * modifier);
    }
  else if (startCtr > endCtr)
    for (let i = startCtr; i > endCtr; i--) {
      const m = Math.max(Math.abs(i), Math.abs(i - 1));
      total += Math.trunc(s.mat_base * m * m * modifier);
    }
  return total;
}

function calcPenalty(statIds) {
  const cats = statIds.filter(id => id > 0).map(id => STATS[id].category).sort();
  let penalty = 100, prev = '', count = 1;
  for (let i = 0; i < cats.length; i++) {
    if (cats[i] !== prev) {
      if (count > 1) penalty += 5 * count * count;
      prev = cats[i]; count = 1;
    } else count++;
  }
  if (count > 1) penalty += 5 * count * count;
  return penalty;
}

function calcSuccessRate(potBefore, original, deltaPot) {
  const divisor = potBefore >= original ? potBefore : original;
  if (divisor <= 0) return 100;
  const raw = Math.trunc(SUCCESS_CONSTANT + 230 * (potBefore + Math.trunc(deltaPot)) / divisor);
  return Math.max(0, Math.min(100, raw));
}

// dir: +1 = max positive counter, -1 = max negative counter
function getMinMaxSteps(statId, dir, levelCap) {
  const s = STATS[statId];
  const level_max = Math.floor(levelCap / 10);
  let bonus = Math.max(0, level_max - 20);

  const max_only    = ['MaxMP','Critical Rate','Critical Rate %','Aggro %',
                       'Guard Power %','Guard Recharge %','Evasion Recharge %'];
  const half_growth  = ['Natural MP Regen','ATK %','MaxMP','MATK %','Aggro %'];
  const third_growth = ['MaxHP %','DEF %','MDEF %','Physical Resistance %','Magic Resistance %',
    'Critical Damage','% stronger against Fire','% stronger against Wind','% stronger against Water',
    '% stronger against Earth','% stronger against Light','% stronger against Dark'];
  const sixty_growth = ['Stability %','Accuracy %','Dodge %','ASPD %','CSPD %','Critical Damage %',
    'Ailment Resistance %','Guard Power %','Guard Recharge %','Evasion Recharge %'];
  const half_third   = ['Accuracy','Dodge','Fire resistance %','Earth resistance %','Water resistance %',
    'Wind resistance %','Light resistance %','Dark resistance %'];
  const twenty_five  = ['Physical Pierce %','Magic Pierce %'];

  if (!s.multiplier2)                     bonus = 0;
  if (half_growth.includes(s.name))       bonus = Math.floor(bonus / 2);
  if (third_growth.includes(s.name))      bonus = Math.floor(bonus / 3);
  if (sixty_growth.includes(s.name))      bonus = Math.floor(bonus / 6);
  if (half_third.includes(s.name))        bonus = Math.floor(bonus * 2 / 3);
  if (twenty_five.includes(s.name))       bonus = Math.floor(bonus * 2 / 5);
  if (max_only.includes(s.name) && dir < 0) bonus = 0;

  const base_max = s.cheap_limit / s.multiplier;
  return dir * Math.min(level_max, base_max + bonus);
}

function getStatLimits(statId, levelCap) {
  if (!statId) return { minVal: 0, maxVal: 0 };
  const s = STATS[statId];
  const maxCtr = getMinMaxSteps(statId,  1, levelCap);
  const maxVal = counterToVal(maxCtr, statId);
  if (!s.negative_ok) return { minVal: 0, maxVal };
  const minCtr = getMinMaxSteps(statId, -1, levelCap);
  const minVal = counterToVal(minCtr, statId);
  return { minVal, maxVal };
}

function snapValue(val, statId, levelCap) {
  if (!statId || val === 0) return 0;
  const { minVal, maxVal } = getStatLimits(statId, levelCap);
  const clamped = Math.max(minVal, Math.min(maxVal, val));
  // round-trip through counter to snap to valid display value
  return counterToVal(Math.round(valToCounter(clamped, statId)), statId);
}

// ─── SIMULATION ENGINE ────────────────────────────────────────────────────────

// state = { slotStats[8], vals[8], ctrs[8], pot, original }

function applyStep(state, newSlotStats, newVals, equipType, matchElement, smithProf, matReductions = {}) {
  const newCtrs = newVals.map((v, i) => newSlotStats[i] ? valToCounter(v, newSlotStats[i]) : 0);

  let changed = false;
  for (let i = 0; i < 8; i++) if (newCtrs[i] !== state.ctrs[i]) { changed = true; break; }
  if (!changed) return null;

  const penalty = calcPenalty(newSlotStats);
  let deltaPotX100 = 0;
  const matsPerType = {};
  const deltas = [];

  for (let i = 0; i < 8; i++) {
    const id = newSlotStats[i];
    if (!id) { deltas.push(0); continue; }
    const oldV = state.vals[i], newV = newVals[i];
    deltas.push(newCtrs[i] - state.ctrs[i]);
    if (oldV === newV) continue;

    deltaPotX100 += calcPot(id, oldV, newV, penalty, equipType, matchElement);

    if (newCtrs[i] !== state.ctrs[i]) {
      const mid = STATS[id].mat_id;
      const mat = calcMats(state.ctrs[i], newCtrs[i], id, smithProf, matReductions[mid] || 0);
      if (mat > 0) matsPerType[mid] = (matsPerType[mid] || 0) + mat;
    }
  }

  const delta   = Math.trunc(deltaPotX100 / 100);
  const newPot  = state.pot + delta;
  const rate    = calcSuccessRate(state.pot, state.original, delta);

  return {
    state: { slotStats: [...newSlotStats], vals: [...newVals], ctrs: newCtrs, pot: newPot, original: state.original },
    delta, mats: matsPerType, rate, deltas
  };
}

// ─── STEP COMPRESSION ─────────────────────────────────────────────────────────

function compressSteps(steps) {
  if (!steps.length) return [];
  const result = [];
  let i = 0;
  while (i < steps.length) {
    let repeat = 1;
    while (
      i + repeat < steps.length &&
      steps[i].delta                     === steps[i + repeat].delta &&
      JSON.stringify(steps[i].deltas)    === JSON.stringify(steps[i + repeat].deltas) &&
      JSON.stringify(steps[i].slotStats) === JSON.stringify(steps[i + repeat].slotStats)
    ) repeat++;
    const totalMats = {};
    for (let j = i; j < i + repeat; j++) {
      Object.entries(steps[j].mats || {}).forEach(([mid, amt]) => {
        totalMats[mid] = (totalMats[mid] || 0) + amt;
      });
    }
    result.push({ ...steps[i + repeat - 1], repeat, mats: totalMats });
    i += repeat;
  }
  return result;
}

// ─── FORMULA GENERATOR ────────────────────────────────────────────────────────

function tryStrategy(primary, others, negative, slotStats, splitN, primaryMaxCtr,
                     equipType, startPot, originalPot, smithProf, matchElement, matReductions) {
  let state = {
    slotStats: Array(8).fill(0),
    vals:      Array(8).fill(0),
    ctrs:      Array(8).fill(0),
    pot:       startPot,
    original:  originalPot
  };

  const rawSteps = [];

  // Phase 1: cheapest positive, one-by-one in isolation (only slot 0 active)
  const phase1Slots = [primary.id, ...Array(7).fill(0)];
  for (let n = 0; n < splitN; n++) {
    const newVals = Array(8).fill(0);
    newVals[0] = counterToVal(n + 1, primary.id);
    const r = applyStep(state, phase1Slots, newVals, equipType, matchElement, smithProf, matReductions);
    if (!r) continue;
    if (r.state.pot < 0) return null;
    rawSteps.push({ slotStats: [...phase1Slots], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
    state = r.state;
  }

  // Phase 2: at-once — negatives to target + 1 unit of each other positive
  if (others.length > 0 || negative.length > 0) {
    const newVals = [...state.vals];
    for (let i = 0; i < others.length; i++)
      newVals[1 + i] = counterToVal(1, others[i].id);
    for (let i = 0; i < negative.length; i++)
      newVals[1 + others.length + i] = negative[i].targetVal;

    const r = applyStep(state, slotStats, newVals, equipType, matchElement, smithProf, matReductions);
    if (r) {
      rawSteps.push({ slotStats: [...slotStats], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
      state = r.state;
    }
  }

  // Phase 3: continue primary one-by-one to target
  for (let n = splitN; n < primaryMaxCtr; n++) {
    const newVals = [...state.vals];
    newVals[0] = counterToVal(n + 1, primary.id);
    const r = applyStep(state, slotStats, newVals, equipType, matchElement, smithProf, matReductions);
    if (!r) continue;
    rawSteps.push({ slotStats: [...slotStats], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
    state = r.state;
  }

  // Phase 4: final at-once — remaining values of all other positives
  const finalVals = [...state.vals];
  finalVals[0] = primary.targetVal;
  for (let i = 0; i < others.length; i++) finalVals[1 + i] = others[i].targetVal;

  const rf = applyStep(state, slotStats, finalVals, equipType, matchElement, smithProf, matReductions);
  if (rf) {
    rawSteps.push({ slotStats: [...slotStats], vals: [...finalVals], deltas: rf.deltas, mats: rf.mats, rate: rf.rate, delta: rf.delta, potAfter: rf.state.pot });
    state = rf.state;
  }

  if (!rawSteps.length) return null;

  const compressed    = compressSteps(rawSteps);
  const lastRate      = rawSteps[rawSteps.length - 1].rate;
  const totalConfirms = rawSteps.length;

  return { splitN, steps: compressed, rawSteps, rate: lastRate, potRemaining: state.pot, totalConfirms, startPot };
}

// Pure 2-stage: negatives alone (low penalty) → all positives at once.
// Trades "more negative return" (high penalty from full slots) for
// "higher pot_before on the final confirm" (→ larger SR divisor).
// Prepended with a primary +1 step so the "preserve first trait on fail"
// skill (Compassion) has something to lock in before any risky confirm.
function try2Stage(primary, others, negative, slotStats, equipType,
                   startPot, originalPot, smithProf, matchElement, matReductions) {
  if (!negative.length) return null;

  let state = {
    slotStats: Array(8).fill(0),
    vals:      Array(8).fill(0),
    ctrs:      Array(8).fill(0),
    pot:       startPot,
    original:  originalPot
  };

  const rawSteps = [];
  const negStart = 1 + others.length;  // where negatives live in slotStats

  // Stage 0: primary +1 in isolation (locks in primary trait before risky confirms)
  {
    const s0Slots = [primary.id, ...Array(7).fill(0)];
    const s0Vals  = Array(8).fill(0);
    s0Vals[0] = counterToVal(1, primary.id);
    const r0 = applyStep(state, s0Slots, s0Vals, equipType, matchElement, smithProf, matReductions);
    if (!r0 || r0.state.pot < 0) return null;
    rawSteps.push({ slotStats: [...s0Slots], vals: [...s0Vals], deltas: r0.deltas,
                    mats: r0.mats, rate: r0.rate, delta: r0.delta, potAfter: r0.state.pot });
    state = r0.state;
  }

  // Stage 1: only negative slots assigned → penalty from |neg| slots only
  const s1Slots = Array(8).fill(0);
  const s1Vals  = Array(8).fill(0);
  for (let i = 0; i < negative.length; i++) {
    s1Slots[negStart + i] = negative[i].id;
    s1Vals [negStart + i] = negative[i].targetVal;
  }
  const r1 = applyStep(state, s1Slots, s1Vals, equipType, matchElement, smithProf, matReductions);
  if (!r1) return null;
  rawSteps.push({ slotStats: [...s1Slots], vals: [...s1Vals], deltas: r1.deltas,
                  mats: r1.mats, rate: r1.rate, delta: r1.delta, potAfter: r1.state.pot });
  state = r1.state;

  // Stage 2: full slotStats (positives + negatives already placed) → all positives to target
  const s2Vals = [...state.vals];
  s2Vals[0] = primary.targetVal;
  for (let i = 0; i < others.length; i++) s2Vals[1 + i] = others[i].targetVal;

  const r2 = applyStep(state, slotStats, s2Vals, equipType, matchElement, smithProf, matReductions);
  if (!r2) return null;
  rawSteps.push({ slotStats: [...slotStats], vals: [...s2Vals], deltas: r2.deltas,
                  mats: r2.mats, rate: r2.rate, delta: r2.delta, potAfter: r2.state.pot });
  state = r2.state;

  const compressed = compressSteps(rawSteps);
  return {
    splitN: -1, strategy: '2stage',
    steps: compressed, rawSteps,
    rate: rawSteps[rawSteps.length - 1].rate,
    potRemaining: state.pot,
    totalConfirms: rawSteps.length,
    startPot
  };
}

// Extended progressive: separates "positive intro" from "negative dump" into
// distinct confirms, letting positives land at lower penalty while negatives
// still return at full penalty. Matches the 4-5 step pattern external tools use.
//
// Sequence:
//   Step 1: primary OBO in isolation            (slotStats = [primary], penalty=100)
//   Step 2: intro each other[i] to otherIntroCtrs[i] counters in ONE confirm
//           (slotStats = positives only, penalty = pos-only categories)
//   Step 3: dump all negatives to target in ONE confirm
//           (slotStats = full, only neg slots change → neg return at full penalty)
//   Step 4: primary OBO continues under full slotStats
//   Step 5: final at-once — push all other positives from intro → target
function tryProgressive(primary, others, negative, slotStats, splitN, primaryMaxCtr,
                        otherIntroCtrs, equipType, startPot, originalPot,
                        smithProf, matchElement, matReductions) {
  let state = {
    slotStats: Array(8).fill(0),
    vals:      Array(8).fill(0),
    ctrs:      Array(8).fill(0),
    pot:       startPot,
    original:  originalPot
  };
  const rawSteps = [];

  // Phase 1: primary OBO alone
  const phase1Slots = [primary.id, ...Array(7).fill(0)];
  for (let n = 0; n < splitN; n++) {
    const newVals = Array(8).fill(0);
    newVals[0] = counterToVal(n + 1, primary.id);
    const r = applyStep(state, phase1Slots, newVals, equipType, matchElement, smithProf, matReductions);
    if (!r) continue;
    if (r.state.pot < 0) return null;
    rawSteps.push({ slotStats: [...phase1Slots], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
    state = r.state;
  }

  // Phase 2: introduce all other positives (pos-only slotStats, no negs yet)
  if (others.length > 0) {
    const posOnlySlots = [primary.id, ...others.map(o => o.id),
                          ...Array(8 - 1 - others.length).fill(0)];
    const newVals = [...state.vals];
    for (let i = 0; i < others.length; i++) {
      newVals[1 + i] = counterToVal(otherIntroCtrs[i], others[i].id);
    }
    const r = applyStep(state, posOnlySlots, newVals, equipType, matchElement, smithProf, matReductions);
    if (r) {
      if (r.state.pot < 0) return null;
      rawSteps.push({ slotStats: [...posOnlySlots], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
      state = r.state;
    }
  }

  // Phase 3: dump all negatives at once (full slotStats; only neg slots change)
  if (negative.length > 0) {
    const newVals = [...state.vals];
    for (let i = 0; i < negative.length; i++) {
      newVals[1 + others.length + i] = negative[i].targetVal;
    }
    const r = applyStep(state, slotStats, newVals, equipType, matchElement, smithProf, matReductions);
    if (!r) return null;
    rawSteps.push({ slotStats: [...slotStats], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
    state = r.state;
  }

  // Phase 4: primary OBO continues under full slotStats
  for (let n = splitN; n < primaryMaxCtr; n++) {
    const newVals = [...state.vals];
    newVals[0] = counterToVal(n + 1, primary.id);
    const r = applyStep(state, slotStats, newVals, equipType, matchElement, smithProf, matReductions);
    if (!r) continue;
    rawSteps.push({ slotStats: [...slotStats], vals: [...newVals], deltas: r.deltas, mats: r.mats, rate: r.rate, delta: r.delta, potAfter: r.state.pot });
    state = r.state;
  }

  // Phase 5: final at-once — push all other positives from intro → target
  const finalVals = [...state.vals];
  finalVals[0] = primary.targetVal;
  for (let i = 0; i < others.length; i++) finalVals[1 + i] = others[i].targetVal;
  const rf = applyStep(state, slotStats, finalVals, equipType, matchElement, smithProf, matReductions);
  if (rf) {
    rawSteps.push({ slotStats: [...slotStats], vals: [...finalVals], deltas: rf.deltas, mats: rf.mats, rate: rf.rate, delta: rf.delta, potAfter: rf.state.pot });
    state = rf.state;
  }

  if (!rawSteps.length) return null;

  const compressed    = compressSteps(rawSteps);
  const lastRate      = rawSteps[rawSteps.length - 1].rate;
  const totalConfirms = rawSteps.length;

  return {
    splitN, strategy: 'progressive',
    steps: compressed, rawSteps,
    rate: lastRate,
    potRemaining: state.pot,
    totalConfirms,
    startPot
  };
}

// Main entry: tries all split points, returns ALL distinct rate results (best confirms per rate)
function generateFormula(positive, negative, equipType, startPot, originalPot, smithProf, matchElement, matReductions = {}) {
  if (!positive.length) return [];

  const sorted  = [...positive].sort((a, b) => STATS[a.id].pot - STATS[b.id].pot);
  const primary = sorted[0];
  const others  = sorted.slice(1);

  const totalSlots = 1 + others.length + negative.length;
  if (totalSlots > 8) return [{ error: `Need ${totalSlots} slots but max is 8.` }];

  const slotStats = [
    primary.id,
    ...others.map(o => o.id),
    ...negative.map(n => n.id),
    ...Array(8 - totalSlots).fill(0)
  ];

  const primaryMaxCtr = Math.floor(valToCounter(primary.targetVal, primary.id));

  // Collect best (fewest confirms) result per unique success rate
  const byRate = new Map(); // rate → result

  // splitN >= 1 guarantees Phase 1 runs at least once, locking primary +1
  // before any risky confirm — protects the "preserve first trait on fail" skill.
  const splitMin = Math.min(1, primaryMaxCtr);

  for (let splitN = primaryMaxCtr; splitN >= splitMin; splitN--) {
    const r = tryStrategy(primary, others, negative, slotStats, splitN, primaryMaxCtr,
                          equipType, startPot, originalPot, smithProf, matchElement, matReductions);
    if (!r) continue;
    const existing = byRate.get(r.rate);
    if (!existing || r.totalConfirms < existing.totalConfirms) {
      byRate.set(r.rate, r);
    }
  }

  // Extended progressive: try two shapes for other-positive intro levels —
  // minimal (+1 each) and maximal (target each). Separates pos intro from neg dump.
  if (others.length > 0) {
    const otherMaxCtrs = others.map(o => Math.floor(valToCounter(o.targetVal, o.id)));
    const shapes = [
      otherMaxCtrs.map(() => 1),   // low:  +1 each in Step 2
      otherMaxCtrs.slice()          // high: target each in Step 2 (skips Step 5 for them)
    ];
    for (const shape of shapes) {
      for (let splitN = primaryMaxCtr; splitN >= splitMin; splitN--) {
        const rp = tryProgressive(primary, others, negative, slotStats, splitN, primaryMaxCtr,
                                  shape, equipType, startPot, originalPot, smithProf, matchElement, matReductions);
        if (!rp) continue;
        const existing = byRate.get(rp.rate);
        if (!existing || rp.totalConfirms < existing.totalConfirms) {
          byRate.set(rp.rate, rp);
        }
      }
    }
  }

  // Also try pure 2-stage (negatives-first, one-shot positives)
  const r2 = try2Stage(primary, others, negative, slotStats,
                       equipType, startPot, originalPot, smithProf, matchElement, matReductions);
  if (r2) {
    const existing = byRate.get(r2.rate);
    if (!existing || r2.totalConfirms < existing.totalConfirms) {
      byRate.set(r2.rate, r2);
    }
  }

  // Sort by rate descending
  return [...byRate.values()].sort((a, b) => b.rate - a.rate);
}
