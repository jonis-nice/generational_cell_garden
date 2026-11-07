/* Transparent, conservative screening for perennial planting communities.
 * This is a selection aid, not a botanical proof of companionability.
 * Missing data is kept as unknown; only clear conflicts are hard-filtered.
 */
window.PLANT_COMPATIBILITY = (() => {
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lightBands = value => {
    const s = norm(value), out = new Set();
    if (/sol/.test(s)) out.add('sun');
    if (/halvskugga/.test(s)) out.add('part');
    if (/skugga/.test(s)) out.add('shade');
    if (!out.size) return null;
    if (out.has('sun') && out.has('shade')) out.add('part');
    return out;
  };
  const moistureBand = value => {
    const s = norm(value);
    // Drainage describes soil structure, not necessarily a dry moisture regime.
    if (/torr|torrare|torktalig/.test(s)) return 'dry';
    if (/blot|fuktig|fuktighetshallande|jamn markfukt/.test(s)) return 'moist';
    return null;
  };
  const winterScore = p => ({ A: 4, 'A*': 4, B: 3, 'B*': 3, C: 2, 'C*': 2, D: 0 })[p.winteringRating] ?? null;
  const evaluate = (a, b) => {
    const reasons = [], conflicts = [];
    let score = 0, known = 0;
    if (a.spreadRisk === 'high' || b.spreadRisk === 'high') conflicts.push('Dokumenterad hög spridningsrisk kräver särskild avgränsning');
    else if (a.spreadRisk === 'medium' || b.spreadRisk === 'medium') reasons.push('Minst en art har måttlig spridningsrisk och kräver uppföljning');
    const la = lightBands(a.light), lb = lightBands(b.light);
    if (la && lb) {
      const overlap = [...la].some(x => lb.has(x));
      if (overlap) { score += 2; known++; reasons.push('Ljusintervallen överlappar'); }
      else conflicts.push('Tydligt skilda ljuskrav');
    } else reasons.push('Ljuskrav saknas eller är för grovt angivna');

    const ma = moistureBand(a.soilMoisture), mb = moistureBand(b.soilMoisture);
    if (ma && mb) {
      if (ma !== mb) conflicts.push('Möjligen motstridiga fuktkrav');
      else { score += 2; known++; reasons.push('Angivna fuktkrav ligger i samma grova intervall'); }
    } else reasons.push('Fuktkrav kan inte jämföras säkert');

    const wa = winterScore(a), wb = winterScore(b);
    if (wa !== null && wb !== null) {
      score += Math.min(wa, wb); known++;
      if (a.winteringRating === 'D' || b.winteringRating === 'D') conflicts.push('Minst en post har övervintringsbedömning D');
    } else reasons.push('Svensk övervintringsbedömning saknas för minst en post');

    const ha = Number(a.height), hb = Number(b.height);
    if (Number.isFinite(ha) && Number.isFinite(hb)) {
      score += Math.abs(ha - hb) < 0.25 ? 0.5 : 1.5;
      known++;
      reasons.push('Höjdskillnad kan ge skiktning; placering måste styra konkurrens och sikt');
    } else reasons.push('Höjddata saknas');

    const status = conflicts.length ? 'avoid' : known >= 3 ? 'candidate' : 'insufficient_data';
    return { status, score, known, reasons, conflicts };
  };

  // Rank candidates against the entire already selected community. A single
  // unknown pairing does not reject a species; a clear conflict does.
  const rankAgainstCommunity = (candidate, community) => {
    if (!community.length) return { status: 'candidate', score: 0, known: 0, conflicts: [], reasons: [] };
    const checks = community.map(member => evaluate(candidate, member));
    const conflicts = checks.flatMap(x => x.conflicts);
    return {
      status: conflicts.length ? 'avoid' : checks.every(x => x.status === 'candidate') ? 'candidate' : 'insufficient_data',
      score: checks.reduce((n, x) => n + x.score, 0),
      known: checks.reduce((n, x) => n + x.known, 0),
      conflicts: [...new Set(conflicts)],
      reasons: [...new Set(checks.flatMap(x => x.reasons))]
    };
  };
  return { evaluate, rankAgainstCommunity, lightBands, moistureBand };
})();
