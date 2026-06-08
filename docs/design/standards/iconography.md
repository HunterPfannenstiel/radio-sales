# Iconography

Standards for icon selection, sizing, stroke weight, and state treatment. The icon library is **Lucide React** throughout the product. Icon token sizes live in `tokens.md` — reference them by `--icon-size-*` name. Icon style (e.g., `ⓘ` for inline help) belongs here; tooltip anatomy belongs in [components.md](components.md).

---

## Icon Library

**Lucide React** is the sole icon library. No mixing of icon sets. All icons are outline-only — Lucide does not provide filled variants.

---

## Sizing Scale

Reference `--icon-size-*` tokens. Use the smallest size that is legible in context:

| Token | Use case |
|---|---|
| `--icon-size-xs` | Tertiary / muted inline icons; rarely needed |
| `--icon-size-sm` | Standard button icons, inline body icons |
| `--icon-size-md` | Navigation items, primary inline actions |
| `--icon-size-lg` | Secondary empty state icons, section headers |
| `--icon-size-xl` | Primary empty state hero icons, full-page feedback |

Icons paired with a text label use `--icon-size-sm`. Standalone icon buttons (no label) use `--icon-size-md`. Never use an icon smaller than `--icon-size-xs` — below that threshold they lose meaning.

---

## Stroke Width

Lucide's default 2px stroke is used at all sizes. Increase to 2.5px only for hero-scale empty state icons (`--icon-size-xl`) where the default stroke feels too delicate against the surrounding whitespace.

Never vary stroke width for emphasis within the UI — use color and size instead.

---

## Active / Selected State

Lucide is outline-only — active states are communicated through **context signals**, not a filled icon swap.

Active state signals (apply all three together):
1. **Color** — switch from `--color-text-secondary` to `--color-accent-primary`
2. **Background** — apply a light tint (`--color-accent-primary` at low opacity) behind the icon container
3. **Label** — if a label is present, it also shifts to `--color-accent-primary`

The icon shape itself does not change between inactive and active. No filled-icon swapping, no separate active icon asset, no stroke weight change.

---

## Navigation Icon Rules

**Sidebar (desktop):**
- Inactive: `--color-text-secondary` icon + label
- Active: `--color-accent-primary` icon + label + faint background pill behind item
- Icon size: `--icon-size-md`

**Bottom tab bar (mobile):**
- Inactive: `--color-text-secondary` icon + label
- Active: `--color-accent-primary` icon + label
- Icon size: `--icon-size-md` (must meet touch target minimum — see [layout.md](layout.md))

---

## Inline Icon Rules

Icons used within body copy, labels, or alongside text:
- Size: `--icon-size-sm`
- Color: inherits from surrounding text color unless indicating status
- Vertical alignment: centered to the text cap-height, not the line box

Status icons (success, warning, info) use the corresponding `--color-status-*` token from [color.md](color.md).

---

## Help Icon

The `ⓘ` inline help icon uses `--icon-size-sm` and `--color-text-secondary` at rest, `--color-text-primary` on hover. Placement: immediately after the field label, never before. See [help-integration.md](help-integration.md) for tooltip rules.
