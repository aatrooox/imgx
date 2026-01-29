# TicketCard Compact Redesign

## TL;DR

> **Quick Summary**: Redesign TicketCard for article header use - shorter height (350px), auto-calculated dates, dual progress bars
> 
> **Deliverables**:
> - Updated `server/templates/TicketCard.ts`
> - Updated `presets/104.json`
> 
> **Estimated Effort**: Quick
> **Critical Path**: Edit template → Edit preset → Test → Commit

---

## TODOs

- [ ] 1. Update TicketCard.ts template with compact design
- [ ] 2. Update 104.json preset configuration  
- [ ] 3. Test and verify rendering
- [ ] 4. Commit changes

---

## Detailed Specifications

### Layout Changes

**Dimensions:**
- Height: 510px → 350px
- LOGO area: 510×510 → 350×350 (maintain 1:1 square)

**Center Content Area (3 rows):**

**Row 1 - Title:**
- 公众号名称 (from URL)

**Row 2 - Info Blocks (vertical dividers):**
```
YEAR    │  WEEK     │  ARTICLE
2026    │  第5周     │  第100篇
```

**Row 3 - Progress Bars:**
```
本年剩余  92%  ████████████████████░░
本月剩余  45%  █████████░░░░░░░░░░░░░
```
- Style: Taller bars, NO border-radius, bold/醒目

### Dynamic Date Calculation (in template)

```javascript
// Current date info
const now = new Date()
const year = now.getFullYear()

// Week number calculation
const startOfYear = new Date(year, 0, 1)
const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)

// Year progress
const endOfYear = new Date(year, 11, 31)
const totalDaysInYear = (endOfYear - startOfYear) / 86400000 + 1
const daysPassed = (now - startOfYear) / 86400000
const yearRemaining = Math.round((1 - daysPassed / totalDaysInYear) * 100)

// Month progress  
const startOfMonth = new Date(year, now.getMonth(), 1)
const endOfMonth = new Date(year, now.getMonth() + 1, 0)
const totalDaysInMonth = endOfMonth.getDate()
const dayOfMonth = now.getDate()
const monthRemaining = Math.round((1 - dayOfMonth / totalDaysInMonth) * 100)
```

### Ticket Stub

- Add `stubText` prop (default: "IMGX")
- Display vertically rotated

### URL Format

```
Old: /api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇
New: /api/104/早早集市/100
            ↑name    ↑articleNum
```

### Preset Config (104.json)

```json
{
  "height": 350,
  "contentKeys": ["name", "articleNum"],
  "styleProps": {
    "stubText": "IMGX"
  }
}
```
