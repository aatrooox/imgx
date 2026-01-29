# TicketCard Premium UI Redesign

## TL;DR

> **Quick Summary**: Redesign the TicketCard center content area with a premium boarding-pass style layout featuring 3 vertical rows: title, info blocks with micro-labels, and progress strip.
> 
> **Deliverables**:
> - Updated `server/templates/TicketCard.ts` with new center content layout
> - Visual verification via browser test
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO - single file change
> **Critical Path**: Edit file -> Test -> Commit

---

## Context

### Original Request
User requested a UI redesign for the TicketCard template's center content area to look more premium, minimalist, and reference real ticket designs (high-speed rail tickets, boarding passes).

### Interview Summary
**Key Discussions**:
- Oracle UI/UX consultation completed with specific design specs
- 3-row vertical layout recommended: Title, Info Blocks (DATE/ARTICLE), Progress Strip
- Premium typography: near-black `#0B1220`, negative letter-spacing
- Micro-labels with boarding pass aesthetic (`DATE`, `ARTICLE`)
- Hairline progress bar (6px) instead of chunky 8px bar

### Research Findings
- Current implementation at `server/templates/TicketCard.ts` lines 73-232
- Content structure: `content[0]`=title, `content[1]`=date, `content[2]`=progress, `content[3]`=article
- Satori constraints apply: must use flexbox, no CSS grid, no box-shadow

---

## Work Objectives

### Core Objective
Replace the current center content area (lines 73-232) with a premium ticket-style 3-row layout.

### Concrete Deliverables
- Modified `server/templates/TicketCard.ts` file

### Definition of Done
- [x] Template renders correctly in browser
- [x] All 4 content lines display properly
- [x] Progress bar fills dynamically based on percentage

### Must Have
- 3-row vertical layout (title, info blocks, progress)
- Micro-labels `DATE` and `ARTICLE` 
- Vertical divider between info blocks
- Hairline progress bar (6px height)
- Premium near-black color `#0B1220`

### Must NOT Have (Guardrails)
- Do NOT change the left LOGO area (lines 24-45)
- Do NOT change the semicircle notches (lines 47-71)
- Do NOT change the right ticket stub (lines 234-261)
- Do NOT use CSS grid (Satori constraint)
- Do NOT use box-shadow (Satori constraint)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no automated tests)
- **User wants tests**: Manual verification
- **Framework**: None

### Automated Verification (Browser via Playwright)

Each TODO includes browser-based verification:

```
# Agent executes via playwright browser automation:
1. Navigate to: http://localhost:4573/api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇
2. Wait for: image to fully render (PNG response)
3. Screenshot: .sisyphus/evidence/ticketcard-redesign.png
4. Visual inspection: Verify 3-row layout visible
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
└── Task 1: Replace center content area code

Wave 2 (After Wave 1):
└── Task 2: Test and verify in browser

Wave 3 (After Wave 2):
└── Task 3: Commit changes
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3 | None |
| 2 | 1 | 3 | None |
| 3 | 2 | None | None |

---

## TODOs

- [x] 1. Replace TicketCard center content area with premium ticket layout

  **What to do**:
  - Open `server/templates/TicketCard.ts`
  - Find lines 73-232 (the `<!-- Center: Content Area -->` section)
  - Replace the entire section with the new premium ticket-style code (provided below)
  - Preserve the surrounding code (left LOGO area, notches, right stub)

  **The replacement code**:
  
  ```typescript
      <!-- Center: Content Area (Premium Ticket Style) -->
      <div class="flex"
        :style="{
          flex: '1',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 64px',
          gap: '32px',
          borderRight: '3px dashed rgba(0, 0, 0, 0.15)'
        }">
        
        <!-- Row 1: Brand/Account Name (Primary) -->
        <div class="flex"
          :style="{
            fontSize: fontSizes?.[0] ?? '64px',
            fontWeight: '700',
            color: colors?.[0] ?? '#0B1220',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }">
          <template v-for="(part, partIdx) in content[0]" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ 
                width: fontSizes?.[0] ?? '64px', 
                height: fontSizes?.[0] ?? '64px', 
                backgroundImage: \`url(\${part.base64URL})\`, 
                backgroundSize: '100% 100%' 
              }">
            </span>
            <span v-else class="text-nowrap flex"
              :style="{ 
                color: part.type === 'accent' ? (accentColors?.[0] ?? '#E67E22') : '' 
              }">
              {{ part.text }}
            </span>
          </template>
        </div>

        <!-- Row 2: Ticket Info Blocks (Date | Article Count) -->
        <div class="flex"
          :style="{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '48px'
          }">
          
          <!-- Date Block -->
          <div v-if="content[1]" class="flex"
            :style="{
              flexDirection: 'column',
              gap: '8px'
            }">
            <!-- Micro Label -->
            <div class="flex"
              :style="{
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.15em',
                color: 'rgba(11, 18, 32, 0.45)'
              }">
              DATE
            </div>
            <!-- Value -->
            <div class="flex"
              :style="{
                fontSize: '28px',
                fontWeight: '600',
                color: 'rgba(11, 18, 32, 0.88)',
                gap: '4px',
                alignItems: 'baseline'
              }">
              <template v-for="(part, partIdx) in content[1]" :key="partIdx">
                <span v-if="part.type === 'emoji'" class="flex"
                  :style="{ 
                    width: '28px', 
                    height: '28px', 
                    backgroundImage: \`url(\${part.base64URL})\`, 
                    backgroundSize: '100% 100%' 
                  }">
                </span>
                <span v-else class="text-nowrap flex"
                  :style="{ 
                    fontSize: part.type === 'accent' ? '16px' : '28px',
                    fontWeight: part.type === 'accent' ? '500' : '600',
                    color: part.type === 'accent' ? 'rgba(11, 18, 32, 0.5)' : 'rgba(11, 18, 32, 0.88)'
                  }">
                  {{ part.text }}
                </span>
              </template>
            </div>
          </div>

          <!-- Vertical Divider -->
          <div class="flex"
            :style="{
              width: '1px',
              height: '56px',
              backgroundColor: 'rgba(11, 18, 32, 0.1)'
            }">
          </div>
          
          <!-- Article Count Block -->
          <div v-if="content[3]" class="flex"
            :style="{
              flexDirection: 'column',
              gap: '8px'
            }">
            <!-- Micro Label -->
            <div class="flex"
              :style="{
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.15em',
                color: 'rgba(11, 18, 32, 0.45)'
              }">
              ARTICLE
            </div>
            <!-- Value -->
            <div class="flex"
              :style="{
                fontSize: '28px',
                fontWeight: '600',
                color: 'rgba(11, 18, 32, 0.88)',
                gap: '4px',
                alignItems: 'baseline'
              }">
              <template v-for="(part, partIdx) in content[3]" :key="partIdx">
                <span v-if="part.type === 'emoji'" class="flex"
                  :style="{ 
                    width: '28px', 
                    height: '28px', 
                    backgroundImage: \`url(\${part.base64URL})\`, 
                    backgroundSize: '100% 100%' 
                  }">
                </span>
                <span v-else class="text-nowrap flex"
                  :style="{ 
                    color: part.type === 'accent' ? (accentColors?.[3] ?? '#E67E22') : 'rgba(11, 18, 32, 0.88)',
                    fontWeight: part.type === 'accent' ? '700' : '600'
                  }">
                  {{ part.text }}
                </span>
              </template>
            </div>
          </div>
          
        </div>

        <!-- Row 3: Progress Strip (Percentage + Hairline Bar) -->
        <div v-if="content[2]" class="flex"
          :style="{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginTop: '8px'
          }">
          
          <!-- Progress Text -->
          <div class="flex"
            :style="{
              alignItems: 'baseline',
              gap: '6px'
            }">
            <template v-for="(part, partIdx) in content[2]" :key="partIdx">
              <span v-if="part.type === 'emoji'" class="flex"
                :style="{ 
                  width: '36px', 
                  height: '36px', 
                  backgroundImage: \`url(\${part.base64URL})\`, 
                  backgroundSize: '100% 100%' 
                }">
              </span>
              <span v-else class="text-nowrap flex"
                :style="{ 
                  fontSize: part.type === 'accent' ? '36px' : '18px',
                  fontWeight: part.type === 'accent' ? '700' : '500',
                  color: part.type === 'accent' ? 'rgba(11, 18, 32, 0.9)' : 'rgba(11, 18, 32, 0.5)',
                  letterSpacing: part.type === 'accent' ? '-0.02em' : '0'
                }">
                {{ part.text }}
              </span>
            </template>
          </div>
          
          <!-- Hairline Progress Bar -->
          <div class="flex"
            :style="{
              flex: '1',
              maxWidth: '280px',
              height: '6px',
              backgroundColor: 'rgba(11, 18, 32, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden'
            }">
            <!-- Progress Fill -->
            <div class="flex"
              :style="{
                width: \`\${(() => {
                  const percentText = content[2].find(p => p.text && p.text.includes('%'))?.text || '0%';
                  const match = percentText.match(/\\d+/);
                  return match ? match[0] : '0';
                })()}%\`,
                height: '100%',
                backgroundColor: 'rgba(11, 18, 32, 0.75)',
                borderRadius: '999px'
              }">
            </div>
          </div>
          
        </div>
      </div>
  ```

  **Must NOT do**:
  - Do not modify lines 1-72 (left LOGO area and notches)
  - Do not modify lines 234-261 (right ticket stub)
  - Do not introduce CSS grid or box-shadow

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit with clear replacement code provided
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Template involves UI styling and layout

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None (can start immediately)

  **References**:
  
  **Pattern References**:
  - `server/templates/TicketCard.ts:73-232` - Current center content area to replace

  **Documentation References**:
  - `server/templates/README.md` - Satori constraints documentation
  - `AGENTS.md` - Project conventions and Satori rules

  **Acceptance Criteria**:
  
  **Automated Verification (Browser via Playwright)**:
  ```
  # Agent executes via playwright browser automation:
  1. Start dev server if not running: pnpm dev
  2. Navigate to: http://localhost:4573/api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇
  3. Wait for: PNG image response (check Content-Type header)
  4. Screenshot: Save rendered image for visual inspection
  5. Assert: Image renders without errors (HTTP 200)
  ```

  **Commit**: YES
  - Message: `feat(TicketCard): redesign center content area with premium ticket style`
  - Files: `server/templates/TicketCard.ts`
  - Pre-commit: Visual verification via browser

---

- [x] 2. Verify template renders correctly

  **What to do**:
  - Ensure dev server is running (`pnpm dev`)
  - Navigate to test URL in browser
  - Capture screenshot of rendered image
  - Verify all content sections display correctly

  **Must NOT do**:
  - Do not make code changes in this task
  - Do not proceed to commit if rendering fails

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple browser verification task
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for visual verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  
  **Test URLs**:
  - `http://localhost:4573/api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇` - Full test with all content
  - `http://localhost:4573/api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇?format=svg` - SVG format for debugging

  **Acceptance Criteria**:
  
  **Automated Verification (Browser via Playwright)**:
  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:4573/api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇
  2. Assert: HTTP response status is 200
  3. Assert: Content-Type is image/png
  4. Screenshot: .sisyphus/evidence/ticketcard-test.png
  5. Visual check: Image shows 3-row layout with:
     - Row 1: "早早集市" title
     - Row 2: DATE block with "2026年30日" + ARTICLE block with "第100篇"
     - Row 3: Progress "剩余92%" with hairline bar
  ```

  **Commit**: NO (verification only)

---

- [x] 3. Commit changes

  **What to do**:
  - Stage the modified file
  - Create commit with descriptive message
  - Include design highlights in commit body

  **Must NOT do**:
  - Do not push to remote (unless user requests)
  - Do not amend previous commits

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple git operation
  - **Skills**: [`git-master`]
    - `git-master`: Git operations expertise

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 2

  **References**:
  
  **Files to commit**:
  - `server/templates/TicketCard.ts`

  **Acceptance Criteria**:
  
  **Automated Verification (CLI)**:
  ```bash
  # Agent runs:
  git add server/templates/TicketCard.ts
  git commit -m "feat(TicketCard): redesign center content area with premium ticket style

  - 3-row vertical layout: title, info blocks, progress strip
  - Micro-labels (DATE, ARTICLE) with boarding pass aesthetic
  - Hairline progress bar (6px) instead of chunky bar
  - Premium typography: near-black #0B1220, negative letter-spacing
  - Vertical divider between info blocks
  - Based on Oracle UI/UX consultation"
  
  git status
  # Assert: "nothing to commit, working tree clean"
  ```

  **Commit**: YES (this IS the commit task)
  - Message: As shown above
  - Files: `server/templates/TicketCard.ts`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 3 | `feat(TicketCard): redesign center content area with premium ticket style` | server/templates/TicketCard.ts | Visual browser test |

---

## Success Criteria

### Verification Commands
```bash
# Start dev server
pnpm dev

# Test URL (open in browser or curl)
curl -I "http://localhost:4573/api/104/早早集市/2026*年*30*日*/剩余*92%*/第*100*篇"
# Expected: HTTP 200, Content-Type: image/png
```

### Final Checklist
- [x] Template has 3-row vertical layout
- [x] Micro-labels "DATE" and "ARTICLE" display
- [x] Vertical divider visible between info blocks
- [x] Progress bar is 6px hairline style
- [x] Colors use premium near-black `#0B1220`
- [x] All content sections render correctly
- [x] No Satori rendering errors
