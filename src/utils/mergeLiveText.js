export function mergeLiveText(persisted, live) {
  const p = String(persisted || '').trim();
  const l = String(live || '').trim();

  if (!p) return l;
  if (!l) return p;

  if (l.startsWith(p) || p.startsWith(l)) {
    return l.length >= p.length ? l : p;
  }

  if (l.includes(p) || p.includes(l)) {
    return l.length >= p.length ? l : p;
  }

  const needSpace = /[^\s]$/.test(p) && !/^[.,!?;:([{'"]/.test(l);
  return needSpace ? `${p} ${l}` : `${p}${l}`;
}
