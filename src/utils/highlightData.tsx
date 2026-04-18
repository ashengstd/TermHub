import React from 'react'

/**
 * Syntax-highlight data points in prose text (rainbow code-like coloring).
 *
 * Patterns highlighted:
 *  - Numbers with optional units/suffix  → `num` color (gold)
 *  - ALL-CAPS acronyms (2+ chars)        → `kw`  color (blue)
 *  - Quoted strings ("…" / '…')          → `str` color (green)
 */
export function highlightData(
  text: string,
  c: { kw: string; num: string; str: string },
): React.ReactNode {
  if (!text) return null

  // 1. Numbers/Versions (digits, units, common prefixes like 'V')
  // 2. Quoted strings
  // 3. Technical Acronyms (mostly letters, avoid splitting versions)
  const rx =
    /(\b(?:V\d+(?:\.\d+)*)|\d+(?:[.,]\d+)*\s*(?:%|[xX]|\+|K|M|k|B|GB|MB|TB|ms|s|px)?\b)|("[^"]+"|'[^']+')|(\b[A-Z][A-Z0-9_]{1,}(?:[-/][A-Z0-9]+)*\b)/g

  const parts: React.ReactNode[] = []
  let last = 0
  let key = 0
  let m: null | RegExpExecArray

  while ((m = rx.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))

    const color = m[1] ? c.num : m[2] ? c.str : c.kw
    const fw = m[1] ? 600 : 500
    parts.push(
      <span key={key++} style={{ color, fontWeight: fw }}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
