const BRANCH_COLORS = ['#6b5c4e', '#0d9488', '#e879a0']

export function branchColor(growthPhase) {
  return BRANCH_COLORS[growthPhase] ?? BRANCH_COLORS[BRANCH_COLORS.length - 1]
}

export default function NodeIcon({ state }) {
  if (state === 'bud') return (
    <>
      <circle r={10} fill="#16a34a" />
      <circle r={4.5} fill="#dcfce7" />
      <line x1={0} y1={-10} x2={0} y2={-14} stroke="#16a34a" strokeWidth={2} strokeLinecap="round" />
      <line x1={10} y1={-6} x2={13} y2={-9} stroke="#16a34a" strokeWidth={2} strokeLinecap="round" />
      <line x1={-10} y1={-6} x2={-13} y2={-9} stroke="#16a34a" strokeWidth={2} strokeLinecap="round" />
    </>
  )

  if (state === 'leaf') return (
    <path d="M 0,-14 C 14,-8 14,8 0,14 C -14,8 -14,-8 0,-14 Z" fill="#3d6b17" />
  )

  if (state === 'berry') return (
    <>
      <circle r={10} fill="#7c3aed" />
      <circle cx={-3} cy={-3} r={3.5} fill="white" opacity={0.4} />
      <line x1={0} y1={-10} x2={0} y2={-14} stroke="#7c3aed" strokeWidth={1.5} strokeLinecap="round" />
    </>
  )

  if (state === 'harvested_berry') return (
    <>
      <circle r={10} fill="#c2612b" />
      <circle cx={-3} cy={-3} r={3.5} fill="white" opacity={0.4} />
      <line x1={-5} y1={-8} x2={-11} y2={-16} stroke="#c2612b" strokeWidth={2} strokeLinecap="round" />
      <line x1={5} y1={-8} x2={11} y2={-16} stroke="#c2612b" strokeWidth={2} strokeLinecap="round" />
    </>
  )

  return null
}
