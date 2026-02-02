---
name: block-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: block
---

🚫 **BLOCKED: Dangerous rm -rf command detected!**

You're attempting to use `rm -rf` which can permanently delete files without confirmation.

**In this project, these directories are critical:**
- `public/models/` - 3D models (shirt.glb, shirt-zones.glb)
- `screenshots/` - Visual verification screenshots
- `src/` - All source code
- `docs/` - Documentation including in-progress work

**Instead of rm -rf:**
- Use `rm -r` (will prompt for confirmation)
- Be specific: `rm screenshots/old-*.png` instead of `rm -rf screenshots/`
- Use `trash` command if available (reversible)
- Double-check the path before deleting

**If you're absolutely sure:**
Ask the user for explicit permission before using rm -rf.
