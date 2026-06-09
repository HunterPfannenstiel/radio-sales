# Motion & Loading States

Standards for transitions, loading feedback, and animation policy. Actual duration values live in `globals.css` — reference them by `--duration-*` token name.

---

## Transition Duration Policy

Three tiers. Use the shortest duration that still feels intentional:

| Token | Use case |
|---|---|
| `--duration-fast` | Hover states, focus rings, color changes on interactive elements |
| `--duration-base` | Panel slide-ins, modal enter/exit, tab switches |
| `--duration-slow` | Full-page transitions, onboarding overlays, celebration animations |

Never animate purely decorative elements that add no navigational signal. If removing the animation would not confuse the user, it should not exist.

---

## Easing Decisions

- **Enter animations** (elements appearing): ease-out — starts fast, settles gently
- **Exit animations** (elements leaving): ease-in — starts slow, accelerates out
- **State changes** (hover, active, focus): ease-in-out — symmetrical feel
- **Spring/bounce effects**: reserved for celebration moments only (goal achieved, streak milestone) — never used for navigation or form feedback

---

## Skeleton vs. Spinner Policy

| Situation | Use |
|---|---|
| Page or section loading content for the first time | **Skeleton screen** — shape matches real content |
| Background data refresh (user-triggered) | **Skeleton** over existing content area |
| Single in-progress action (file upload, form submit) | **Inline spinner** within the button or progress indicator |
| Full-page blocking operation (rare) | **Centered spinner** with descriptive label |

Never show a blank white screen while content loads. The skeleton must approximate the real layout so the user understands what is coming.

---

## Form Submit Button Behavior

On submit:
1. Button immediately shows a loading state (spinner icon replaces trailing icon, label changes to present-tense action: "Saving…", "Logging…")
2. Button is disabled — prevents duplicate submission
3. On success: resolve to normal state, success feedback shown inline
4. On error: resolve to normal state, error shown above the button (see [error-handling.md](error-handling.md))

The button never shows a success checkmark and stays in that state — resolve cleanly and let the surrounding UI confirm the change.

---

## Reduce-Motion Fallback

All transitions and animations respect the `prefers-reduced-motion` media query. When reduced motion is active:

- Slide-in panels appear instantly (no transition)
- Skeletons do not pulse
- Celebration animations are replaced with a static success state
- Duration tokens are overridden to near-zero

This is not optional — it is a baseline accessibility requirement.

---

## Sync Status Indicators

For background sync operations (offline records, data push):

| State | Treatment |
|---|---|
| Pending / syncing | `--color-status-info` pill with label |
| Synced | `--color-status-success` pill — fades after `--duration-slow` |
| Offline | `--color-status-warning` bar pinned to top of screen — persists until resolved |

The offline bar does not auto-dismiss. It stays until connectivity is confirmed restored.
