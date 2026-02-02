---
name: keep-claude-md-updated
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: (src/utils/colorUtils\.ts|src/components/ThreeCanvas/useShirtModel\.ts|src/components/ThreeCanvas/useThreeScene\.ts|scripts/separate_shirt_zones\.py|public/models/shirt-zones\.glb)
  - field: new_text
    operator: regex_match
    pattern: .+
action: warn
---

📝 **Reminder: Update CLAUDE.md**

You're modifying a critical file that's documented in CLAUDE.md.

**File changed:** Check if CLAUDE.md needs updating for:
- `src/utils/colorUtils.ts` - Material cloning pattern or color application logic
- `src/components/ThreeCanvas/useShirtModel.ts` - Zone detection or color orchestration
- `src/components/ThreeCanvas/useThreeScene.ts` - Scene setup or hook stability
- `scripts/separate_shirt_zones.py` - Mesh separation logic or axis orientation
- `public/models/shirt-zones.glb` - Model structure or zone boundaries

**What to update in CLAUDE.md:**
- Known Issues section if you fixed something
- Critical Architecture Decisions if you changed a pattern
- Key Files Reference if behavior changed
- Outstanding Issues - TODO if you resolved an issue

**Also consider updating:**
- `docs/in-progress/color-zones-fix.md` for zone-related changes
- Version History in CLAUDE.md with today's date

This is a reminder, not a blocker - update documentation when appropriate.
