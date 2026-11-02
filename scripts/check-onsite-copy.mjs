#!/usr/bin/env node
// Copy-check for the Voxa On-Site section.
// Fails CI if forbidden tokens appear in content or page files:
//   - "$" followed by a digit (price)
//   - "starting at" (case-insensitive)
//   - a digit followed by hr/hour/day/week (timing)
// Package names that legitimately contain words like "Content Day" are
// allowlisted; any match is still reported for human review.

import { readdir, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const SCAN_DIRS = [
  join(ROOT, 'lib/content/onsite'),
  join(ROOT, 'app/onsite'),
  join(ROOT, 'components/onsite'),
]
const EXTRA_FILES = [join(ROOT, 'lib/content/onsite-form.ts')]

const EXT_ALLOWED = new Set(['.ts', '.tsx', '.mts', '.cts'])

const RULES = [
  {
    name: 'price',
    regex: /\$\s?\d/,
    message: 'Prices are not allowed in /onsite content.',
    // Budget ranges a visitor picks from are not published prices.
    exemptFiles: ['lib/content/onsite-form.ts'],
  },
  {
    name: 'starting-at',
    regex: /starting at/i,
    message: '"starting at" is a price signal — not allowed in /onsite content.',
  },
  {
    name: 'timing',
    regex: /\d+\s*(?:hrs?|hours?|days?|weeks?)\b/i,
    message: 'Turnaround or duration claims are not allowed in /onsite content.',
  },
]

// Phrases that legitimately contain words rule 3 would catch
// (package names + schema types). Flagged for review, not auto-passed.
const ALLOWLIST_PHRASES = ['Content Day', 'Interview Session', 'Commercial']

async function* walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(p)
    } else if (EXT_ALLOWED.has(p.slice(p.lastIndexOf('.')))) {
      yield p
    }
  }
}

async function main() {
  const violations = []
  const flagged = []

  async function scanFile(file) {
    const src = await readFile(file, 'utf8')
    const lines = src.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const rule of RULES) {
        if (rule.exemptFiles?.includes(relative(ROOT, file))) continue
        const m = line.match(rule.regex)
        if (!m) continue
        const isAllowlisted = ALLOWLIST_PHRASES.some((p) => line.includes(p))
        const record = {
          file: relative(ROOT, file),
          line: i + 1,
          rule: rule.name,
          matched: m[0],
          lineText: line.trim(),
          message: rule.message,
        }
        if (isAllowlisted) flagged.push(record)
        else violations.push(record)
      }
    }
  }

  for (const base of SCAN_DIRS) {
    try {
      await stat(base)
    } catch {
      continue
    }
    for await (const file of walk(base)) {
      await scanFile(file)
    }
  }
  for (const file of EXTRA_FILES) {
    try {
      await stat(file)
    } catch {
      continue
    }
    await scanFile(file)
  }

  if (flagged.length) {
    console.log('— On-site copy check: flagged for human review —')
    for (const r of flagged) {
      console.log(`  ${r.file}:${r.line} [${r.rule}] matched "${r.matched}" — ${r.lineText}`)
    }
    console.log('')
  }

  if (violations.length) {
    console.error('✖ On-site copy check failed. Fix these before shipping:')
    for (const r of violations) {
      console.error(`  ${r.file}:${r.line} [${r.rule}] "${r.matched}" — ${r.lineText}`)
      console.error(`    ${r.message}`)
    }
    process.exit(1)
  }

  console.log('✓ On-site copy check passed.')
}

main().catch((err) => {
  console.error('copy check crashed:', err)
  process.exit(2)
})
