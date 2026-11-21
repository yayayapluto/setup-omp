# SETUP.md — Reproduce this OMP environment

Single-file setup document for **oh-my-pi (OMP)**. Goal: turn a raw OMP install into an environment identical to the source machine it was captured from: global AGENTS.md, rules, config, model providers, plugins, extensions, tools, and the full 175-skill catalog under `~/.agents/skills`.

Captured from OMP **18.4.3** on Windows 11 x64 (2026-11-21). All paths below are for Windows PowerShell; `$HOME` = `C:\Users\<you>`.

> This repo intentionally contains only `SETUP.md` and `LICENSE`. Every file it installs is embedded verbatim below; every third-party skill is installed from its public upstream.

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Target layout](#2-target-layout)
3. [Global AGENTS.md](#3-global-agentsmd)
4. [Rules](#4-rules)
5. [config.yml](#5-configyml)
6. [models.yml + provider auth](#6-modelsyml--provider-auth)
7. [mcp.json](#7-mcpjson)
8. [caveman + ponytail levels](#8-caveman--ponytail-levels)
9. [Extensions (rtk, optional bridges)](#9-extensions-rtk-optional-bridges)
10. [Hooks](#10-hooks)
11. [Plugins + marketplaces](#11-plugins--marketplaces)
12. [Tools (pele)](#12-tools-pele)
13. [Skills catalog (175)](#13-skills-catalog-175)
14. [Appendix: skills without public upstream](#14-appendix-skills-without-public-upstream)
15. [Pre-commit hooks for repos](#15-pre-commit-hooks-for-repos)
16. [Verification](#16-verification)
17. [Known gaps](#17-known-gaps)

## 1. Prerequisites

| Tool | Version | Install |
|---|---|---|
| Git | any | `winget install Git.Git` |
| Bun | current | `powershell -c "irm bun.sh/install.ps1 | iex"` |
| gh CLI | 2.x, logged in | `winget install GitHub.cli` then `gh auth login` |
| OMP | 18.4.3+ | `bun install -g @oh-my-pi/cli` (or your install channel) |
| rtk | >= 1.1.0 (binary), extension needs >= 0.23.0 | https://github.com/rtk-ai/rtk |
| specify | 1.4.4.dev0 | https://github.com/github/spec-kit |
| Node | 24.x | `winget install OpenJS.NodeJS.LTS` |

Check: `omp --version`, `rtk --version`, `specify --version`, `gh auth status`.

## 2. Target layout

```text
$HOME/.omp/agent/
  AGENTS.md            # global agent rules
  config.yml           # model roles, fallback chains, browser
  models.yml           # custom providers (keys via env)
  mcp.json             # MCP servers
  caveman.json         # caveman defaults
  rules/antislop.md    # always-on rule
  extensions/          # extension/hook files (rtk.ts, ...)
$HOME/.omp/plugins/    # bun-installed plugin packages + package.json
$HOME/.omp/tools/pele/ # Mermaid renderer
$HOME/.agents/skills/  # 175 skills, one dir per skill, SKILL.md inside
```

## 3. Global AGENTS.md

Write `$HOME/.omp/agent/AGENTS.md` exactly:

```markdown
# README documentation

Creating, rewriting, or updating any `README.md` file — or a request like "write readme", "create readme", "document this project", "project documentation" — MUST first read `skill://readme` and follow its workflow.

## Gaya README produk siap pakai (preferensi pengguna)

Untuk repo produk/plugin/tool (bukan dokumen internal), README WAJIB mengikuti struktur ini:

1. Judul + 2–3 kalimat overview + TOC.
2. **Features** — bullet konkret, bukan marketing.
3. **Requirements** — versi runtime, tool eksternal, OS.
4. **Install** — bernomor per langkah, diawali prasyarat eksternal, lalu opsi pemasangan (marketplace / link / file tunggal), ditutup langkah **Verify it loaded** dengan perintah nyata.
5. **Usage** — alur harian pemakaian nyata, contoh perintah dan contoh output; prompt yang bisa diketik ke model; tabel action/command beserta efeknya.
6. **Reading the fields / output** — tabel arti tiap field atau status, plus "Common prompts".
7. **What it reads / touches** — path, env, file, port, side effect.
8. **Architecture** — tree file + flow diagram teks.
9. **Development** — self-check/test nyata yang bisa dijalankan.
10. **Troubleshooting** — tabel symptom → cause → fix.
11. **Security notes**, **License**.

Aturan isi: semua klaim harus sesuai kode; jangan tulis fitur yang belum ada; jangan pakai placeholder; TOC wajib sinkron dengan heading. Bahasa README mengikuti bahasa teknis repo (default English); balasan chat tetap bahasa Indonesia.

# Bahasa

SELALU gunakan bahasa Indonesia untuk seluruh balasan chat, penjelasan, dan laporan kepada pengguna. Kode, komentar kode, dan berkas teknis mengikuti konteks proyek (proyek praktikum daspro: komentar kode dan dokumentasi juga bahasa Indonesia).

# Kebahasaan Indonesia (WAJIB)

Setiap pekerjaan yang menyentuh teks bahasa Indonesia — menulis, menyunting, merapikan, menerjemahkan, mengaudit gaya, dokumentasi, laporan, copy UI, atau saat pengguna mengeluh "kaku/terbaca AI" — WAJIB membaca dan mengikuti `skill://humanizer-indonesia` terlebih dahulu. Skill ini juga berlaku untuk audit hasil model lain. Sumber: https://github.com/adhiprib/humanizer-indonesia (sudah terpasang di `~/.agents/skills/humanizer-indonesia`; sinkronkan dari repo bila versinya tertinggal).

# TODO (WAJIB)

Setiap agen yang memakai `todo` WAJIB meng-update todo secara berkala: begitu satu item selesai, tandai `done` saat itu juga. JANGAN menunggu semua item beres baru update.

- Selesai satu item → `todo` `done` langsung, di turn yang sama, lanjut ke item berikutnya.
- Selesai satu fase → tandai item fase itu satu per satu, bukan sekaligus di akhir.
- `done` harus menempel pada aksi kerja berikutnya (atau verifikasinya) — bukan turn khusus berisi todo saja.
- Todo yang ternyata tidak relevan → `rm`/`drop` segera, jangan biarkan menggantung sampai akhir.

# Skill wajib per jenis pekerjaan

- Eskalasi desain: jika `antislop` sudah dipakai tetapi pengguna masih minta hasil lebih jauh (lebih dalam, lebih berani, audit desain penuh, DESIGN.md, atau "kurang bagus"), WAJIB lanjut baca `skill://impeccable` dan ikuti alurnya. Terpasang di `~/.agents/skills/impeccable` (manual install dari https://github.com/pbakaus/impeccable; launcher Windows: `scripts/impeccable.cmd`). Impeccable hanya untuk kerja UI/frontend.

- Membuat project dari kosong (greenfield): WAJIB gunakan skill dari https://github.com/mattpocock/skills. Jika skill-nya belum terpasang, pasang lebih dulu (`omp skill` / salin ke folder skills) sebelum mulai.
- Pekerjaan frontend (UI, animasi, komponen): WAJIB gunakan skill dari https://github.com/emilkowalski/skills. Pasang dulu jika belum ada.
- Setiap project web/api selesai: WAJIB jalankan security audit dengan skill dari https://github.com/cloudflare/security-audit-skill sebelum dinyatakan selesai. Pasang dulu jika belum ada.

# Matriks skill wajib (terpasang 21 November 2026 di `~/.agents/skills`)

| Sumber | Skill / alat | Aturan pakai |
|---|---|---|
| DietrichGebert/ponytail | `ponytail`, `ponytail-audit`, `-debt`, `-gain`, `-review`, `-help` | Mode **ultra** SELALU aktif. Mati hanya jika pengguna bilang "stop ponytail" atau "normal mode". |
| JuliusBrussee/caveman | `caveman` (`ultracave`, `megacave`) | Mode **ultra** SELALU aktif. Kode, perintah, dan error ditulis utuh. |
| rtk-ai/rtk | skill `rtk`, binary `rtk 1.1.0` | Prefix `rtk` di setiap perintah shell. Setelah restart, aktifkan dulu sebelum lanjut kerja. |
| xerj-org/xerj | skill `xerj` (docs-only, binary belum dipasang) | Utamakan untuk pencarian makna, pemakaian simbol, dan perbandingan lintas repo. Tanpa node atau binary, pakai `grep`/`glob` dan sebutkan sekali. |
| obsidianmd/pele | skill `pele`, paket `pele@1.13` di `~/.omp/tools/pele` | Setiap diagram Mermaid WAJIB dikompilasi dulu: `node ~/.omp/tools/pele/render.mjs in.mmd -o out.svg`. |
| cloudflare/security-audit-skill | `security-audit` | Jalankan di akhir setiap pekerjaan yang menyentuh koneksi publik (web, API, daemon, CLI jaringan). |
| emilkowalski/skills | `emil-design-eng`, `animate*`, `ask-emil`, dll | Wajib dimuat untuk kerja frontend: UI, animasi, komponen, motion. |
| danyuchn/asd-ste100-skill | `asd-ste100` | Untuk teks Inggris yang tidak boleh ambigu: deskripsi tool, pesan error, instruksi agen. Teks Indonesia tetap `humanizer-indonesia`. |
| coleam00/excalidraw-diagram-skill | `excalidraw-diagram` | Saat pengguna minta diagram Excalidraw. |
| Agents365-ai/drawio-skill | `drawio-skill` | Saat pengguna minta diagram draw.io atau berkas `.drawio` yang bisa diedit. |
| mattpocock/skills | `implement`, `implement-spec`, `to-spec`, `to-tickets`, `triage`, `retro`, `wayfinder`, `handoff`, `teach`, `grill-me`, `grill-with-docs`, `tdd` | Wajib untuk awal project dan alur kerja terencana. |
| github/spec-kit | skill `spec-kit`, CLI `specify 1.4.4.dev0` | Backbone SDD. Urutan constitution, specify, clarify, plan, tasks, analyze, implement, converge. Grilling spec sebelum `plan`. |

Skill yang baru disalin baru muncul di katalog setelah omp dijalankan ulang, karena daftar skill dibaca sekali per sesi.

# Bootstrap tiap sesi (WAJIB)

1. Nyalakan `ponytail` level ultra dan `caveman` level ultra sebelum pekerjaan pertama, tanpa perlu diminta.
2. Nyalakan `rtk`: prefix `rtk` di setiap perintah shell. Sesi baru atau restart berarti rtk harus dinyalakan dulu sebelum pengerjaan dilanjutkan.
3. Cek ketersediaan alat sebelum mengandalkannya: `rtk --version`, `specify --version`, dan ada atau tidaknya `xerj`.
4. Mode tidak boleh turun sendiri saat sesi memanjang. Turun hanya atas perintah eksplisit pengguna.

# Tool omp (WAJIB)

Selalu pakai tool bawaan omp, bukan padanan shell atau library. Padanan shell hanya dipakai kalau tool omp tidak ada.

- Bertanya ke pengguna: `ask`, bukan pertanyaan yang ditulis di badan balasan.
- Cari berkas: `glob`. Cari isi: `grep`, atau skill `xerj` bila node hidup. Jangan `find`, `rg`, `grep`, atau `ls -R` lewat bash.
- Baca, tulis, sunting berkas: `read`, `write`, `edit`. Jangan `cat`, `sed`, `awk`, atau skrip Python untuk menyunting.
- SQLite: baca `berkas.db:tabel` lewat `read`. Jangan CLI `sqlite3`.
- PDF, arsip, gambar, video: `read` dengan path dan suffix, bukan `pdftotext`, `unzip`, atau `ffmpeg` manual.
- Rencana multi-langkah: `todo`. Subagent: `task`. Menunggu hasil: `wait`. Kode eksploratif: `eval`.
- Verifikasi UI web: browser di `eval`, bukan `curl` untuk menebak tampilan.
- Setting omp: `cfg://`, dan hanya saat pengguna meminta.
- URI internal (`skill://`, `agent://`, `artifact://`, `proc://`, `issue://`, `pr://`, `ssh://`) dipakai apa adanya, jangan diterjemahkan jadi path shell.
- `xd://<tool>` untuk tool MCP yang terpasang. Baca dokumentasinya dulu sebelum pemakaian pertama.

# Pre-commit (WAJIB)

Setiap commit WAJIB melewati pre-commit hook yang menjalankan unit test. Aturan:

- Hook pre-commit harus memanggil unit test proyek (`npm test`, `pytest`, `cargo test`, `go test ./...`, `dotnet test`, atau perintah test proyek), bukan hanya linter atau formatter.
- Repo tanpa hook: pasang dulu dengan `skill://setup-pre-commit` (atau `skill://hook-commits`) sebelum commit pertama.
- Test merah berarti commit batal. Jangan memakai `--no-verify`, jangan melewati hook, jangan menonaktifkan test agar lolos.
- Hook yang sudah ada tetapi tidak menjalankan test: tambahkan langkah test-nya.
- Perubahan yang tidak punya unit test sama sekali (skrip sekali pakai, konfigurasi) tetap wajib punya satu smoke check yang dijalankan hook.
```

## 4. Rules

Write `$HOME/.omp/agent/rules/antislop.md` exactly:

```markdown
---
description: Anti-slop filter. Every agent applies the antislop skills to UI, copy, people, mobile layout, and code-comment work.
alwaysApply: true
---

# antislop

Every agent (main session and all subagents) uses antislop. It is a filter, not a style guide: it stops generic AI slop in generated UI, copy, and code without prescribing aesthetics.

Before UI, copywriting, people, mobile/responsive layout, or code-comment work, read `skill://antislop` (core filter) and then the matching skill:

- UI / visual: `skill://antislop-ui`
- Copy and text: `skill://antislop-copywriting`
- People: `skill://antislop-human`
- Mobile / responsive: `skill://antislop-layoutmobile`
- Code comments: `skill://antislop-code`

Resolve the usage mode as the core skill's "Two Usage Modes" section describes, then announce it once as `antislop active: <mode> (<source>)`.
```

## 5. config.yml

Write `$HOME/.omp/agent/config.yml` exactly. It contains no secrets:

```yaml
setupVersion: 2
modelRoles:
  default: freepi/deepseek-v4.1-flash
  smol: freepi/glm-5.3-flash:low
  slow: freepi/deepseek-v4.1-flash:max
  plan: freepi/deepseek-v4.1-flash:high
  commit: freepi/glm-5.3-flash:low
  advisor: freepi/deepseek-v4.1-flash:max
browser:
  headless: false
retry:
  fallbackRevertPolicy: cooldown-expiry
  fallbackChains:
    memory:
      - local/qwen2.5-1.5b
    default:
      - freepi/deepseek-v4.1-flash
      - bansos/deepseek-v4.1-flash-free
      - bansosr/deepseek-v4.1-flash-free
      - opencode-free/deepseek-v4.1-flash-free
      - 9router/tok/deepseek-v4-pro
      - freepi/deepseek-v4-flash
      - bansos/big-pickle
    smol:
      - freepi/glm-5.3-flash
      - bansos/mimo-v2.6-flash-free
      - bansosr/flint-40b-free
      - opencode-free/mimo-v2.6-flash-free
      - 9router/tok/glm-5.3-flash
      - bansos/flint-40b-free
    slow:
      - freepi/deepseek-v4.1-flash
      - bansosr/ovh/Qwen3.5-397B-A17B
      - bansos/deepseek-v4.1-flash-free
      - 9router/tok/deepseek-v4-pro
      - freepi/deepseek-v4-flash
      - bansosr/ovh/Qwen3.5-9B
    plan:
      - bansosr/ovh/Qwen3.5-397B-A17B
      - 9router/tok/deepseek-v4-pro
      - freepi/deepseek-v4.1-flash
      - bansos/deepseek-v4.1-flash-free
      - opencode-free/big-pickle
    commit:
      - freepi/glm-5.3-flash
      - bansos/mimo-v2.6-flash-free
      - 9router/tok/glm-5.3-flash
      - bansosr/flint-40b-free
    advisor:
      - freepi/deepseek-v4.1-flash
      - bansosr/ovh/Qwen3.5-397B-A17B
      - 9router/tok/deepseek-v4-pro
      - bansosr/deepseek-v4.1-flash-free
cycleOrder:
  - smol
  - slow
  - default
defaultThinkingLevel: auto
modelProviderOrder:
  - freepi
  - 9router
dev:
  autoqaConsent: granted
startup:
  checkUpdate: false
marketplace:
  autoUpdate: "off"
disabledProviders:
  - ollama
  - llama.cpp
  - lm-studio
```

## 6. models.yml + provider auth

`models.yml` only carries custom providers. `freepi` and `bansos` model names resolve after the plugins in section 11 are installed and provider auth is done. Write `$HOME/.omp/agent/models.yml`:

```yaml
providers:
  nusagate:
    baseUrl: https://api.nusagate.com/v1
    api: openai-completions
    apiKey: ${NUSAGATE_API_KEY}
    authHeader: true
    discovery:
      type: openai-models-list
  9router:
    baseUrl: http://127.0.0.1:20128/v1
    api: openai-completions
    apiKey: sk-keyless-local
    authHeader: true
    discovery:
      type: openai-models-list
```
Set the secret in the shell profile (PowerShell `$PROFILE`), never in a file that gets committed:

```powershell
$env:NUSAGATE_API_KEY = "<your nusagate key>"
```

Then authenticate the providers used by the fallback chains:

```powershell
omp login            # pick interactively; repeat per provider
```

## 7. mcp.json

Write `$HOME/.omp/agent/mcp.json` exactly:

```json
{
  "$schema": "https://raw.githubusercontent.com/can1357/oh-my-pi/main/packages/coding-agent/src/config/mcp-schema.json",
  "mcpServers": {
    "Roblox_Studio": {
      "args": [
        "/c",
        "%LOCALAPPDATA%\\Roblox\\mcp.bat"
      ],
      "command": "cmd.exe"
    },
    "canva": {
      "type": "http",
      "url": "https://mcp.canva.com/mcp",
      "timeout": 120000
    }
  },
  "disabledServers": ["Roblox_Studio"]
}
```

## 8. caveman + ponytail levels

Write `$HOME/.omp/agent/caveman.json`:

```json
{
  "defaultLevel": "ultra",
  "showStatus": true
}
```
Ponytail level `ultra` and caveman `ultra` come from the plugins in section 11; caveman.json sets the default level.

## 9. Extensions (rtk, optional bridges)

Write `$HOME/.omp/agent/extensions/rtk.ts` exactly. It is required: it rewrites every bash command through `rtk rewrite`:

```typescript
// RTK Pi extension — rewrites bash commands to use rtk for token savings.
// Shared with Oh My Pi (OMP) — OMP loads this same file via its legacy-pi-compat layer.
// Requires: rtk >= 0.23.0 in PATH.
//
// This is a thin delegating extension: all rewrite logic lives in `rtk rewrite`,
// which is the single source of truth (src/discover/registry.rs).
// To add or change rewrite rules, edit the Rust registry — not this file.
//
// Exit code contract for `rtk rewrite`:
//   0 + stdout  Rewrite found → mutate command
//   1           No RTK equivalent → pass through unchanged
//   3 + stdout  Rewrite (advisory) → mutate command

import type {
  BashToolCallEvent,
  ExtensionAPI,
  ToolCallEvent,
} from "@earendil-works/pi-coding-agent"
import { execFile } from "node:child_process"

const REWRITE_TIMEOUT_MS = 2_000
const MIN_SUPPORTED_RTK_MINOR = 23

// Local reimplementation of the package's `isToolCallEventType("bash", event)` type
// guard. That helper is a value export, so importing it pulls in the whole
// `@earendil-works/pi-coding-agent` barrel at extension load — profiled at ~250ms
// warmed, vs ~10ms for a type-only import. `BashToolCallEvent`/`ToolCallEvent`
// below are type-only imports and are erased at compile time, so they carry none
// of that cost. See #2753.
function isBashToolCallEvent(event: ToolCallEvent): event is BashToolCallEvent {
  return event.toolName === "bash"
}

// Parse "X.Y.Z" semver, return [major, minor, patch] or null.
function parseSemver(raw: string): [number, number, number] | null {
  const m = raw.trim().match(/(\d+)\.(\d+)\.(\d+)/)
  if (!m) return null
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)]
}

// Calls `rtk rewrite`; returns the rewritten command or null (pass through).
async function rewriteCommand(
  pi: ExtensionAPI,
  cmd: string,
  signal?: AbortSignal
): Promise<string | null> {
  const result = await pi.exec("rtk", ["rewrite", cmd], {
    timeout: REWRITE_TIMEOUT_MS,
    signal,
  })
  if (result.killed) return null
  if (result.code !== 0 && result.code !== 3) return null
  return result.stdout.trim() || null
}

type StatusContext = {
  ui?: {
    setStatus?: (key: string, text: string) => void
  }
}

// Register before the async version probe so a host cannot miss the handler
// while the probe is in flight. If session_start happens first, retain its
// context and apply the status as soon as the probe reports a failure.
// pi.notify is intentionally not used — OMP wipes it on the initial render.
function registerRtkUnavailableNotice(pi: ExtensionAPI) {
  let reason: string | undefined
  let sessionContext: StatusContext | undefined

  const applyStatus = () => {
    if (!reason || !sessionContext) return
    try {
      sessionContext.ui?.setStatus?.("rtk", `RTK disabled: ${reason}`)
    } catch {
      // Status reporting must never affect the extension's fail-open behavior.
    }
  }

  try {
    pi.on("session_start", (_event: unknown, ctx: unknown) => {
      sessionContext = ctx as StatusContext
      applyStatus()
    })
  } catch {
    // Runtimes without a session_start event: nothing to report.
    return (_reason: string) => {}
  }

  return (nextReason: string) => {
    reason = nextReason
    applyStatus()
  }
}

export default async function (pi: ExtensionAPI) {
  const reportRtkUnavailable = registerRtkUnavailableNotice(pi)

  // Probe lazily: the version check costs a process spawn, and blocking
  // extension load on it delays session start. Probe on session_start in the
  // background and again on first bash call; never await it at load.
  let probe: Promise<boolean> | undefined
  const ensureRtk = () => {
    probe ??= new Promise<boolean>((resolve) => {
      execFile("rtk", ["--version"], { timeout: REWRITE_TIMEOUT_MS }, (err, stdout) => {
        if (err) {
          reportRtkUnavailable("rtk binary not found in PATH")
          return resolve(false)
        }
        const parsed = parseSemver(String(stdout).replace(/^rtk\s+/, ""))
        if (parsed) {
          const [major, minor] = parsed
          if (major === 0 && minor < MIN_SUPPORTED_RTK_MINOR) {
            reportRtkUnavailable(`rtk ${parsed.join(".")} is too old (need >= 0.23.0)`)
            return resolve(false)
          }
        }
        resolve(true)
      })
    })
    return probe
  }

  try {
    pi.on("session_start", () => {
      void ensureRtk()
    })
  } catch {
    // Runtimes without session_start: the first bash call still probes.
  }

  pi.on("tool_call", async (event, ctx) => {
    try {
      if (!isBashToolCallEvent(event)) return
      if (!(await ensureRtk())) return

      const cmd = event.input.command
      if (typeof cmd !== "string" || cmd.trim() === "") return

      if (cmd.startsWith("rtk ")) return
      if (process.env.RTK_DISABLED === "1") return

      // Delegate to RTK.
      const rewritten = await rewriteCommand(pi, cmd, ctx.signal)
      if (rewritten && rewritten !== cmd) {
        event.input.command = rewritten
      }
    } catch (err) {
      // Fail open: never block execution on an unexpected error.
      console.warn("[rtk] unexpected error in tool_call handler; passing through command", err)
      return
    }
  })
}
```
Optional, machine-specific — only if you also run Orca / a local 9router gateway:

- `$HOME/.omp/agent/extensions/9router-autostart.js`:

```javascript
import net from "node:net";
import { spawn } from "node:child_process";


export default function routerGuard(pi) {
  const LAUNCHER =
    process.env.NINEROUTER_LAUNCHER ||
    "C:\\Users\\mfarr\\.omp\\tools\\9router-hidden.vbs";
  const WSCRIPT = "C:\\Windows\\System32\\wscript.exe";
  const PORT = Number(process.env.NINEROUTER_PORT || 20128);

  const portOpen = (port) =>
    new Promise((resolve) => {
      const sock = net.connect({ host: "127.0.0.1", port, timeout: 1500 });
      sock.on("connect", () => {
        sock.destroy();
        resolve(true);
      });
      sock.on("error", () => resolve(false));
      sock.on("timeout", () => {
        sock.destroy();
        resolve(false);
      });
    });

  pi.on("session_start", async () => {
    if (await portOpen(PORT)) return;
    pi.logger?.info?.(`9router autostart: port ${PORT} tutup, luncurkan ${LAUNCHER} (hidden)`);
    const child = spawn(WSCRIPT, [LAUNCHER], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.on("error", (err) => pi.logger?.warn?.(`9router autostart gagal: ${err.message}`));
    child.unref();
  });
}
```
- `orca-agent-status.ts`, `orca-prefill.ts`, `orca-titlebar-spinner.ts`: Orca UI extensions, not reproduced here; copy them from the source machine if you use Orca.

## 10. Hooks

OMP hook discovery uses `$HOME/.omp/agent/hooks/pre/*.ts` and `hooks/post/*.ts` (see OMP docs `hooks.md`). The source machine has **no** user hooks — do not create the directory. Git pre-commit hooks are covered in section 15.

## 11. Plugins + marketplaces

Create `$HOME/.omp/plugins/package.json`:

```json
{
  "name": "omp-plugins",
  "private": true,
  "dependencies": {
    "@dietrichgebert/ponytail": "npm:@dietrichgebert/ponytail",
    "@juicesharp/rpiv-ask-user-question": "npm:@juicesharp/rpiv-ask-user-question",
    "bigpowers": "npm:bigpowers",
    "omp-freepi-bridge": "^0.1.1",
    "omp-opencode-bridge": "^2.6.0",
    "omp-openhop": "github:yayayapluto/OMP-openhop",
    "pi-bansos": "^0.8.1",
    "pi-bansos-router": "^0.6.2",
    "pi-caveman": "npm:pi-caveman",
    "pi-web-access": "npm:pi-web-access"
  }
}
```
Install:

```powershell
cd $HOME/.omp/plugins
bun install
omp plugin doctor --fix
```

Enabled plugin set (from `omp-plugins.lock.json`):

| Package | Version | Enabled |
|---|---|---|
| `@dietrichgebert/ponytail` | 4.10.0 | yes |
| `pi-caveman` | 1.0.8 | yes |
| `@juicesharp/rpiv-ask-user-question` | 2.11.0 | yes |
| `bigpowers` | 2.88.9 | yes |
| `pi-web-access` | 0.33.0 | no (disabled) |
| `pi-bansos` | 0.8.1 | yes |
| `antislop` | 3.2.30 | yes |
| `pi-bansos-router` | 0.6.2 | yes |
| `omp-freepi-bridge` | 0.1.1 | yes |
| `omp-opencode-bridge` | 2.6.0 | yes |
| `omp-jailbreak` | 0.1.0 | yes |
| `omp-openhop` | 1.2.0 | yes |

Marketplaces:

```powershell
omp plugin marketplace add miqdadbadjuber/anti-slop
omp plugin marketplace add yayayapluto/omp-freepi-bridge
omp plugin marketplace add yayayapluto/OMP-openhop
omp plugin install antislop@anti-slop
```

## 12. Tools (pele)

Create `$HOME/.omp/tools/pele/package.json`:

```json
{
  "name": "pele",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "pele": "^1.13.0"
  }
}
```
Create `$HOME/.omp/tools/pele/render.mjs`:

```javascript
#!/usr/bin/env node
// Compile Mermaid text -> SVG string with Pele (obsidianmd/pele).
// Usage:
//   node ~/.omp/tools/pele/render.mjs diagram.mmd -o out.svg
//   cat diagram.mmd | node ~/.omp/tools/pele/render.mjs - > out.svg
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const require = createRequire(path.join(os.homedir(), '.omp', 'tools', 'pele', 'package.json'));
const { render } = await import(pathToFileURL(require.resolve('pele')).href);

const argv = process.argv.slice(2);
let out = null;
const args = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '-o' || argv[i] === '--out') { out = argv[++i]; continue; }
  if (argv[i] === '-h' || argv[i] === '--help') {
    console.error('usage: render.mjs <file.mmd|-> [-o out.svg]');
    process.exit(0);
  }
  args.push(argv[i]);
}

const input = args[0] ?? '-';
let text;
try {
  text = input === '-' ? readFileSync(0, 'utf8') : readFileSync(input, 'utf8');
} catch (e) {
  console.error(`render: cannot read ${input}: ${e.message}`);
  process.exit(1);
}

let svg;
try {
  ({ svg } = render(text));
} catch (e) {
  console.error(`render: mermaid parse/render failed: ${e.message}`);
  process.exit(2);
}
if (!svg || !svg.startsWith('<svg')) {
  console.error('render: pele returned no svg');
  process.exit(2);
}

if (out) {
  writeFileSync(out, svg, 'utf8');
  console.error(`render: wrote ${out} (${svg.length} bytes)`);
} else {
  process.stdout.write(svg);
}
```
Install and verify:

```powershell
cd $HOME/.omp/tools/pele; bun install
node $HOME/.omp/tools/pele/render.mjs diagram.mmd -o out.svg
```

## 13. Skills catalog (175)

Skills live one level under `$HOME/.agents/skills/<name>/SKILL.md` (the `agents` provider scans non-recursively). Seven local dirs carry a nested duplicate `<skill>/<skill>/SKILL.md` (caveman, ponytail and its five subskills); OMP ignores those duplicates.

For each row below: `git clone --depth 1 https://github.com/<repo>` and copy the `<path>` directory to `$HOME/.agents/skills/<skill>`.

| Skill | Upstream repo | Path in repo |
|---|---|---|
| `a11y` | aladicf/better-react-web-ui | `skills/a11y` |
| `adapt` | aladicf/better-react-web-ui | `skills/adapt` |
| `add-ui` | aladicf/better-react-web-ui | `skills/add-ui` |
| `animate` | emilkowalski/skills | `skills/animate` |
| `animate-expo` | emilkowalski/skills | `skills/animate-expo` |
| `animation-performance` | emilkowalski/skills | `skills/animation-performance` |
| `animation-vocabulary` | emilkowalski/skills | `skills/animation-vocabulary` |
| `apple-design` | emilkowalski/skills | `skills/apple-design` |
| `arrange` | aladicf/better-react-web-ui | `skills/arrange` |
| `asd-ste100` | danyuchn/asd-ste100-skill | `SKILL.md` |
| `ask-emil` | emilkowalski/skills | `skills/ask-emil` |
| `ask-matt` | mattpocock/skills | `skills/engineering/ask-matt` |
| `ask-sonner` | emilkowalski/skills | `skills/ask-sonner` |
| `audit` | aladicf/better-react-web-ui | `skills/audit` |
| `bolder` | aladicf/better-react-web-ui | `skills/bolder` |
| `break-ui` | emilkowalski/skills | `skills/break-ui` |
| `build-gtk` | Unity-Technologies/skills | `skills/build-gtk` |
| `build-live-game` | Unity-Technologies/skills | `skills/build-live-game` |
| `caveman` | JuliusBrussee/caveman | `skills/caveman` |
| `chief-of-staff` | mattpocock/skills | `skills/in-progress/chief-of-staff` |
| `choreograph` | emilkowalski/skills | `skills/choreograph` |
| `clarify` | aladicf/better-react-web-ui | `skills/clarify` |
| `claude-handoff` | mattpocock/skills | `skills/in-progress/claude-handoff` |
| `code-review` | mattpocock/skills | `skills/engineering/code-review` |
| `codebase-design` | mattpocock/skills | `skills/engineering/codebase-design` |
| `colorize` | aladicf/better-react-web-ui | `skills/colorize` |
| `computer-use` | stablyai/orca | `skills` |
| `craft-game-floors` | Unity-Technologies/skills | `skills/craft-game-floors` |
| `create-2d-physics` | Unity-Technologies/skills | `skills/create-2d-physics` |
| `create-tile-palette-or-rule-tiles` | Unity-Technologies/skills | `skills/create-tile-palette-or-rule-tiles` |
| `create-xr` | Unity-Technologies/skills | `skills/create-xr` |
| `critique` | aladicf/better-react-web-ui | `skills/critique` |
| `daspro-solver` | yayayapluto/skill-daspro-solver | `SKILL.md` |
| `data-viz` | aladicf/better-react-web-ui | `skills/data-viz` |
| `delight` | aladicf/better-react-web-ui | `skills/delight` |
| `deploy-to-vercel` | vercel-labs/agent-skills | `skills/deploy-to-vercel` |
| `depth` | aladicf/better-react-web-ui | `skills/depth` |
| `diagnosing-bugs` | mattpocock/skills | `skills/engineering/diagnosing-bugs` |
| `distill` | aladicf/better-react-web-ui | `skills/distill` |
| `domain-modeling` | mattpocock/skills | `skills/engineering/domain-modeling` |
| `drawio-skill` | Agents365-ai/drawio-skill | `skills/drawio-skill` |
| `emil-design-eng` | emilkowalski/skills | `skills/emil-design-eng` |
| `empty-state` | aladicf/better-react-web-ui | `skills/empty-state` |
| `excalidraw-diagram` | coleam00/excalidraw-diagram-skill | `SKILL.md` |
| `extract` | aladicf/better-react-web-ui | `skills/extract` |
| `find-animation-opportunities` | emilkowalski/skills | `skills/find-animation-opportunities` |
| `find-docs` | upstash/context7 | `skills/find-docs` |
| `find-skills` | vercel-labs/skills | `skills/find-skills` |
| `fix` | motiondivision/motion | `.agents/skills/fix` |
| `fix-3d-physics-collisions` | Unity-Technologies/skills | `skills/fix-3d-physics-collisions` |
| `forms` | aladicf/better-react-web-ui | `skills/forms` |
| `frontend-design` | aladicf/better-react-web-ui | `skills/frontend-design` |
| `generate-editor-search-query` | Unity-Technologies/skills | `skills/generate-editor-search-query` |
| `gestures` | emilkowalski/skills | `skills/gestures` |
| `git-guardrails-claude-code` | mattpocock/skills | `skills/misc/git-guardrails-claude-code` |
| `grill-me` | mattpocock/skills | `skills/productivity/grill-me` |
| `grill-with-docs` | mattpocock/skills | `skills/engineering/grill-with-docs` |
| `grilling` | mattpocock/skills | `skills/productivity/grilling` |
| `handoff` | mattpocock/skills | `skills/productivity/handoff` |
| `harden` | aladicf/better-react-web-ui | `skills/harden` |
| `herdr` | herdrdev/herdr | `skills/herdr` |
| `hierarchy` | aladicf/better-react-web-ui | `skills/hierarchy` |
| `humanizer-indonesia` | adhiprib/humanizer-indonesia | `SKILL.md` |
| `imagery` | aladicf/better-react-web-ui | `skills/imagery` |
| `impeccable` | pbakaus/impeccable | `.claude/skills/impeccable` |
| `implement` | mattpocock/skills | `skills/engineering/implement` |
| `implement-in-app-purchases` | Unity-Technologies/skills | `skills/implement-in-app-purchases` |
| `implement-spec` | mattpocock/skills | `skills/engineering/implement-spec` |
| `improve-animations` | emilkowalski/skills | `skills/improve-animations` |
| `improve-codebase-architecture` | mattpocock/skills | `skills/engineering/improve-codebase-architecture` |
| `initialize-ai-navigation` | Unity-Technologies/skills | `skills/initialize-ai-navigation` |
| `learn-taste` | emilkowalski/skills | `skills/learn-taste` |
| `levelplay-unity-integration` | Unity-Technologies/skills | `skills/levelplay-unity-integration` |
| `localize` | aladicf/better-react-web-ui | `skills/localize` |
| `localize-unity-project` | Unity-Technologies/skills | `skills/localize-unity-project` |
| `loop-me` | mattpocock/skills | `skills/in-progress/loop-me` |
| `manage-cloud-build` | Unity-Technologies/skills | `skills/manage-cloud-build` |
| `manage-sprite-atlas` | Unity-Technologies/skills | `skills/manage-sprite-atlas` |
| `migrate-birp-to-urp` | Unity-Technologies/skills | `skills/migrate-birp-to-urp` |
| `migrate-to-shoehorn` | mattpocock/skills | `skills/misc/migrate-to-shoehorn` |
| `mobile-native` | emilkowalski/skills | `skills/mobile-native` |
| `new-unity-project` | Unity-Technologies/skills | `skills/new-unity-project` |
| `normalize` | aladicf/better-react-web-ui | `skills/normalize` |
| `onboard` | aladicf/better-react-web-ui | `skills/onboard` |
| `optimize` | aladicf/better-react-web-ui | `skills/optimize` |
| `optimize-audio` | Unity-Technologies/skills | `skills/optimize-audio` |
| `optimize-text-mesh-pro` | Unity-Technologies/skills | `skills/optimize-text-mesh-pro` |
| `optimize-web` | Unity-Technologies/skills | `skills/optimize-web` |
| `orca-cli` | stablyai/orca | `skills/orca-cli` |
| `orchestration` | stablyai/orca | `skill-guides` |
| `pick-ui-library` | emilkowalski/skills | `skills/pick-ui-library` |
| `polish` | aladicf/better-react-web-ui | `skills/polish` |
| `ponytail` | DietrichGebert/ponytail | `skills/ponytail` |
| `ponytail-audit` | DietrichGebert/ponytail | `skills/ponytail-audit` |
| `ponytail-debt` | DietrichGebert/ponytail | `skills/ponytail-debt` |
| `ponytail-gain` | DietrichGebert/ponytail | `skills/ponytail-gain` |
| `ponytail-help` | DietrichGebert/ponytail | `skills/ponytail-help` |
| `ponytail-review` | DietrichGebert/ponytail | `skills/ponytail-review` |
| `pr` | humanlayer/skills | `plugins/show-me/skills` |
| `project-auditor-fixes` | Unity-Technologies/skills | `skills/project-auditor-fixes` |
| `prototype` | emilkowalski/skills | `skills/prototype` |
| `quieter` | aladicf/better-react-web-ui | `skills/quieter` |
| `remove-animations` | emilkowalski/skills | `skills/remove-animations` |
| `research` | mattpocock/skills | `skills/engineering/research` |
| `retro` | mattpocock/skills | `skills/engineering/retro` |
| `review-animations` | emilkowalski/skills | `skills/review-animations` |
| `roblox-agent-workflow` | m4bwav/roblox-agent | `skills/roblox-agent-workflow` |
| `roblox-mcp` | nonlooped/roblox-suite | `roblox-mcp` |
| `rtk` | rtk-ai/rtk | `.claude/skills/ship` |
| `scaffold-exercises` | mattpocock/skills | `skills/misc/scaffold-exercises` |
| `search` | aladicf/better-react-web-ui | `skills/search` |
| `security-audit` | cloudflare/security-audit-skill | `skills/security-audit` |
| `security-ux` | aladicf/better-react-web-ui | `skills/security-ux` |
| `setup` | aladicf/better-react-web-ui | `skills/setup` |
| `setup-matt-pocock-skills` | mattpocock/skills | `skills/engineering/setup-matt-pocock-skills` |
| `setup-pre-commit` | mattpocock/skills | `skills/misc/setup-pre-commit` |
| `setup-ts-deep-modules` | mattpocock/skills | `skills/in-progress/setup-ts-deep-modules` |
| `setup-vivox-voice-chat` | Unity-Technologies/skills | `skills/setup-vivox-voice-chat` |
| `shader-graph-create-custom-node` | Unity-Technologies/skills | `skills/shader-graph-create-custom-node` |
| `showcase` | aladicf/better-react-web-ui | `skills/showcase` |
| `spec-kit` | github/spec-kit | `.github/skills/code-review` |
| `sprite-editor` | Unity-Technologies/skills | `skills/sprite-editor` |
| `sprite-segment-3x3grid` | Unity-Technologies/skills | `skills/sprite-segment-3x3grid` |
| `tdd` | mattpocock/skills | `skills/engineering/tdd` |
| `teach` | mattpocock/skills | `skills/productivity/teach` |
| `test` | aladicf/better-react-web-ui | `skills/test` |
| `threejs-3d-generator` | majidmanzarpour/threejs-game-skills | `skills/threejs-3d-generator` |
| `threejs-aaa-graphics-builder` | majidmanzarpour/threejs-game-skills | `skills/threejs-aaa-graphics-builder` |
| `threejs-audio-generator` | majidmanzarpour/threejs-game-skills | `skills/threejs-audio-generator` |
| `threejs-debug-profiler` | majidmanzarpour/threejs-game-skills | `skills/threejs-debug-profiler` |
| `threejs-game-director` | majidmanzarpour/threejs-game-skills | `skills/threejs-game-director` |
| `threejs-game-ui-designer` | majidmanzarpour/threejs-game-skills | `skills/threejs-game-ui-designer` |
| `threejs-gameplay-systems` | majidmanzarpour/threejs-game-skills | `skills/threejs-gameplay-systems` |
| `threejs-image-generator` | majidmanzarpour/threejs-game-skills | `skills/threejs-image-generator` |
| `threejs-qa-release` | majidmanzarpour/threejs-game-skills | `skills/threejs-qa-release` |
| `to-questionnaire` | mattpocock/skills | `skills/productivity/to-questionnaire` |
| `to-spec` | mattpocock/skills | `skills/engineering/to-spec` |
| `to-tickets` | mattpocock/skills | `skills/engineering/to-tickets` |
| `triage` | mattpocock/skills | `skills/engineering/triage` |
| `typeset` | aladicf/better-react-web-ui | `skills/typeset` |
| `ultracave` | JuliusBrussee/caveman | `skills/ultracave` |
| `unity-cli` | Unity-Technologies/skills | `skills/unity-cli` |
| `unity-package-management` | Unity-Technologies/skills | `skills/unity-package-management` |
| `unity-pipeline` | Unity-Technologies/skills | `skills/unity-pipeline` |
| `urp-postprocessing` | Unity-Technologies/skills | `skills/urp-postprocessing` |
| `validate-urp-render-graph-renderer-feature` | Unity-Technologies/skills | `skills/validate-urp-render-graph-renderer-feature` |
| `vercel-cli-with-tokens` | vercel-labs/agent-skills | `skills/vercel-cli-with-tokens` |
| `vercel-composition-patterns` | vercel-labs/agent-skills | `skills` |
| `vercel-optimize` | vercel-labs/agent-skills | `skills/vercel-optimize` |
| `vercel-react-best-practices` | vercel-labs/agent-skills | `skills` |
| `vercel-react-native-skills` | vercel-labs/agent-skills | `skills` |
| `vercel-react-view-transitions` | vercel-labs/agent-skills | `skills` |
| `wait-what` | mattpocock/skills | `skills/productivity/wait-what` |
| `wayfinder` | mattpocock/skills | `skills/engineering/wayfinder` |
| `web-design-guidelines` | vercel-labs/agent-skills | `skills/web-design-guidelines` |
| `wizard` | mattpocock/skills | `skills/engineering/wizard` |
| `write-swift` | emilkowalski/skills | `skills/write-swift` |
| `writing-beats` | mattpocock/skills | `skills/in-progress/writing-beats` |
| `writing-for-agents` | mattpocock/skills | `skills/productivity/writing-for-agents` |
| `writing-fragments` | mattpocock/skills | `skills/in-progress/writing-fragments` |
| `writing-guidelines` | vercel-labs/agent-skills | `skills/writing-guidelines` |
| `writing-shape` | mattpocock/skills | `skills/in-progress/writing-shape` |
| `xerj` | xerj-org/xerj | `landing/.well-known/agent-skills/xerj` |

Repos used (clone once, then copy the paths above):

```powershell
$repos = @(
  "https://github.com/Agents365-ai/drawio-skill",
  "https://github.com/DietrichGebert/ponytail",
  "https://github.com/JuliusBrussee/caveman",
  "https://github.com/Unity-Technologies/skills",
  "https://github.com/adhiprib/humanizer-indonesia",
  "https://github.com/aladicf/better-react-web-ui",
  "https://github.com/cloudflare/security-audit-skill",
  "https://github.com/coleam00/excalidraw-diagram-skill",
  "https://github.com/danyuchn/asd-ste100-skill",
  "https://github.com/emilkowalski/skills",
  "https://github.com/github/spec-kit",
  "https://github.com/herdrdev/herdr",
  "https://github.com/humanlayer/skills",
  "https://github.com/m4bwav/roblox-agent",
  "https://github.com/majidmanzarpour/threejs-game-skills",
  "https://github.com/mattpocock/skills",
  "https://github.com/motiondivision/motion",
  "https://github.com/nonlooped/roblox-suite",
  "https://github.com/pbakaus/impeccable",
  "https://github.com/rtk-ai/rtk",
  "https://github.com/stablyai/orca",
  "https://github.com/upstash/context7",
  "https://github.com/vercel-labs/agent-skills",
  "https://github.com/vercel-labs/skills",
  "https://github.com/xerj-org/xerj",
  "https://github.com/yayayapluto/skill-daspro-solver",
")
foreach ($r in $repos) { git clone --depth 1 $r "$env:TEMP/skills/$(Split-Path $r -Leaf)" }
```

## 14. Appendix: skills without public upstream

Twelve skills could not be verified against a public upstream (renamed or removed upstream, or local-only). Their `SKILL.md` bodies are embedded below; copy each into `$HOME/.agents/skills/<name>/SKILL.md`. Supporting files (`references/`, `scripts/`) listed after each entry are **not** reproduced — copy them from the source machine if needed.

### 2d-pixel-perfect

Extra files not embedded: `references/api-reference.md`, `references/camera-setup-builtin.cs`, `references/camera-setup-urp.cs`, `references/pipeline-detection.cs`, `references/sprite-settings.cs`

```markdown
---
name: 2d-pixel-perfect
description: Sets up, diagnoses, and fixes pixel perfect 2D rendering with PixelPerfectCamera in URP or Built-in. Use when a retro-style or pixel art 2D game looks blurry, jittery, or misaligned. Not for HD 2D or high-resolution art.
---

Set up, diagnose, and fix pixel perfect 2D rendering in Unity projects.

---

## ⚠ There Are Two Completely Separate Implementations

Pixel perfect rendering in Unity is **not one system** — it is two separate, incompatible implementations, one per render pipeline. **Always detect the pipeline before writing or diagnosing any code.** 

| | URP | Built-in |
|---|---|---|
| **Component** | `UnityEngine.Rendering.Universal.PixelPerfectCamera` | `UnityEngine.U2D.PixelPerfectCamera` |
| **Package** | Built into URP — no extra install | `com.unity.2d.pixel-perfect` v6.0.0+ |
| **API style** | Enums (`gridSnapping`, `cropFrame`) | Booleans (`pixelSnapping`, `upscaleRT`, `cropFrameX/Y`) |

**Do not install `com.unity.2d.pixel-perfect` in a URP project.**

**→ Always call `DetectPipeline()` first** (`references/pipeline-detection.cs`), then branch your setup, diagnostics, and fixes based on the result.

---

## When NOT to use this skill

- **HD 2D or high-resolution 2D games** — pixel snapping and point filtering will make smooth art look wrong
- **UI-only scenes** — use Canvas Scaler instead
- **HDRP projects** — Pixel Perfect Camera is not supported

---

## Critical Reminders

⚠ **Detect the render pipeline first** — URP and Built-in use different Pixel Perfect Camera components that are not interchangeable.
⚠ **Filter Mode = Point is the #1 fix** — bilinear filtering is Unity's default and is almost always the cause of blurry sprites.
⚠ **Anti-Aliasing must be disabled** — in Quality Settings and on the camera. AA actively blurs pixel edges.

## Key Principles

### 1. Pipeline Detection & Camera Component Selection

See the two-path comparison table at the top of this file. Assembly name note: the standalone Built-in package installs into a `Runtime/` folder, but the asmdef `"name"` field is `Unity.2D.PixelPerfect` — no `Runtime` suffix. HDRP is unsupported — see the HDRP fallback section under Common Issues.

**→ Code: `references/pipeline-detection.cs`** — `DetectPipeline()`, `GetPixelPerfectCameraType()`, and migration mismatch check.

### 2. Diagnostic-First Approach

Always diagnose before making changes. Report findings, then fix only what is broken.

### 3. Work in the correct scope

Default to scene scope. Scan project-wide only when the user explicitly requests it.

---

## Diagnostic Checklist

**Sprite import settings:**
- [ ] Filter Mode = `Point (no filter)` on all in-scope sprites
- [ ] Mip Maps = disabled
- [ ] Compression = `None` / Uncompressed
- [ ] PPU consistent across all sprites in scene
- [ ] Sprite pivots set to Custom / Pixels mode — a center pivot on an odd-dimension sprite (e.g. 15×15) lands at 7.5px, causing 0.5px misalignment

**→ Code: `references/sprite-settings.cs`** — `GetImporter()` and `FixSpriteImportSettings()`.

**Editor snap settings:**
- [ ] Grid Size = `1 / assetsPPU` on all axes (e.g. PPU 16 → 0.0625, PPU 100 → 0.01)
- [ ] Grid Snapping enabled in the Grid and Snap overlay
- [ ] To snap existing GameObjects: select them → Align Selected → All Axes

**Camera setup:**
- [ ] Camera projection = Orthographic
- [ ] Pixel Perfect Camera component present and correct type for pipeline
- [ ] `allowHDR`, `allowMSAA`, `allowDynamicResolution` all `false`
- [ ] Scene view shows two green bounding boxes on the camera gizmo — solid = visible area, dotted = reference resolution

**→ Code: `references/camera-setup-urp.cs`** — full URP camera + PP Camera configuration.
**→ Code: `references/camera-setup-builtin.cs`** — Built-in standalone configuration.

**Project quality settings:**
- [ ] Anti-Aliasing = 0 in Quality Settings
- [ ] Anisotropic Filtering = Disabled

---

## API Reference

Full property/method tables, `GridSnapping` and `CropFrame` enum values, and recommended configurations:
**→ `references/api-reference.md`** — read this when writing or reviewing camera setup code.

Quick enum summary:

**`GridSnapping`**: `None` · `PixelSnapping` (standard) · `UpscaleRenderTexture` (authentic low-res; incompatible with post-processing and UI text)

**`CropFrame`**: `None` · `Pillarbox` · `Letterbox` · `Windowbox` (safest default) · `StretchFill`

---

## Reference Resolution

Choose before building any assets. Never change after asset production starts.

| Reference resolution | 1080p | 1440p | 4K |
|---|---|---|---|
| 320 × 180 | 6× | 8× | 12× |
| 480 × 270 | 4× | ~5.3× | 8× |
| 640 × 360 | 3× | 4× | 6× |

320×180 is the safest general choice. For screens with no integer fit (e.g. 1366×768), use `cropFrame = Windowbox` to add black bars rather than stretching to a fractional scale.

---

## Migration & Compatibility

### URP project with the Built-in standalone component

**Symptom**: `DetectPipeline()` returns URP but camera has `UnityEngine.U2D.PixelPerfectCamera`. Symptoms are subtle because the standalone component has `ENABLE_URP` conditional code.

**Fix**:
1. Remove `com.unity.2d.pixel-perfect` from Package Manager
2. Remove `UnityEngine.U2D.PixelPerfectCamera` from each camera
3. Add `UnityEngine.Rendering.Universal.PixelPerfectCamera`
4. Reconfigure — booleans (`pixelSnapping`, `upscaleRT`, `cropFrameX/Y`) become enums (`gridSnapping`, `cropFrame`)

**→ Detection code: `references/pipeline-detection.cs`** (bottom of file).

### Old URP namespace (pre-Unity 2022 / URP pre-13.x)

**Symptom**: Compiler errors referencing `UnityEngine.Experimental.Rendering.Universal`.

**Fix**: Replace `using UnityEngine.Experimental.Rendering.Universal;` with `using UnityEngine.Rendering.Universal;`. Update any assembly-qualified type strings. The `[MovedFrom]` attribute handles serialization automatically — components on GameObjects survive the upgrade.

---

## Common Issues & Solutions

### Blurry sprites
**Fix**: Set Filter Mode to Point on all in-scope sprites, disable Mip Maps, disable AA in Quality Settings.
**→ Code: `references/sprite-settings.cs`**

### Tilemap gaps between tiles
Work through in order — workarounds like negative cell gap or PPU = 31.99 break when the camera moves.

| # | Check | Fix |
|---|---|---|
| 1 | Sprite Atlas with Tight Packing off, Padding ≥ 4, Sprite Packer Mode enabled? | Enable Sprite Packer Mode in Editor settings; on the atlas set Padding ≥ 4 and turn Tight Packing off |
| 2 | Mipmaps disabled on tileset textures and atlas? | Disable Generate Mip Maps |
| 3 | AA = 0, MSAA off on camera? | Disable AA globally |
| 4 | Compression = None? | RGBA 32-bit uncompressed |
| 5 | All tile sprites have even pixel dimensions? | Odd dimensions cause 0.5px grid offset |
| 6 | PPU = tile pixel width? (16×16 → PPU 16) | PPU mismatch leaves physical gaps |
| 7 | Gaps only during camera movement after all above pass? | Use PP Camera pixel snapping; do not use `cellGap = -0.01f` |

### Cinemachine conflict
**Cause**: Both Cinemachine and the Pixel Perfect Camera write to orthographic size every frame.

**Fix**: Add `CinemachinePixelPerfect` extension via the Add Extension dropdown on each Virtual Camera. Do not add it via `AddComponent` in code.

**Known limitations**:
- Camera blends between virtual cameras are not pixel-perfect during transitions
- `UpscaleRenderTexture` reduces valid pixel-perfect ortho sizes, which may cause framing to deviate
- Target Group + Framing Transposer causes visible choppiness (no fix available)

### Post-processing blur with `upscaleRT`
**Cause**: Post-processing runs after the PP Camera upscales the render texture.

**Simple fix**: Disable `upscaleRT`. Post-processing then runs at native screen resolution.

**Advanced fix (Unity 6 URP)**: Inject a `ScriptableRendererFeature2D` at `RenderPassEvent2D.AfterRenderingPostProcessing`. Use 2D-specific base classes — `ScriptableRendererFeature` (3D base class) is silently ignored in a URP 2D renderer.

### UI text blurry with `upscaleRT`
**Status**: Known Unity bug, declined to fix (still present Unity 6, 2025).

**Root causes**: (A) Canvas renders into the low-res buffer and is upscaled with the scene. (B) TMP's SDF gradient threshold is miscalibrated at low reference resolutions.

**Fixes in order of reliability**:
1. `Screen Space - Overlay` on Canvas — bypasses the camera, renders at native resolution
2. Dedicated UI camera with no PP Camera component, `Screen Space - Camera` mode
3. Unity 6 only: `Font Material → Debug Settings → Sharpness = 1` (mitigates B, not A)

### Physics / render desync (micro-stutter)
**Cause**: Physics runs at a fixed timestep; interpolated positions produce fractional values that snap to different pixels each frame.

**Fix**:
- Enable `Rigidbody2D.interpolation = RigidbodyInterpolation2D.Interpolate` on physics-driven sprites
- Set `Time.fixedDeltaTime = 1f / 60f` to match target frame rate
- Keep camera tracking in `LateUpdate`, not `FixedUpdate`

### Non-integer scaling / pixel decimation
**Cause**: Screen resolution is not a clean integer multiple of the reference resolution.

**Fix**: Choose a reference resolution from the table above. Use `cropFrame = Windowbox` when no integer fit exists.

### Missing URP 2D Renderer
**Fix**:
1. `Assets > Create > Rendering > URP 2D Renderer Data`
2. Assign it to your URP Asset under Renderer List
3. Requires `com.unity.render-pipelines.universal` 12.0+

### HDRP fallback
Pixel Perfect Camera is unsupported in HDRP.

**Built-in / Unity 5.x**: Use `RenderTexture` + `Graphics.Blit` with `FilterMode.Point`.

**Unity 6 URP**: Use `ScriptableRendererFeature2D` + `ScriptableRenderPass2D` injected at `RenderPassEvent2D.AfterRendering` with `AddRasterRenderPass`. Note: `OnRenderImage` and `Graphics.Blit` are incompatible with Unity 6's render graph.
```

### asset-transformer-toolkit

Extra files not embedded: `SECURITY.md`, `references/create-importer.md`, `references/lods.md`, `references/rule-api.md`, `references/ruleblock-api.md`, `references/ruleset-api.md`, `references/rulesets-and-actions.md`

```markdown
---
name: asset-transformer-toolkit
description: >-
  In the Unity Editor, imports 3D models and point clouds with Asset Transformer Toolkit (formerly
  Pixyz), and creates, edits, and runs RuleSets, Actions, and LODs. Use for Pixyz imports in a Unity
  project, not for converting files from the shell.
required_packages:
    com.unity.industry.toolkit: ">=4.0.0"
---
### Before you start: check the package version
This skill needs Asset Transformer Toolkit 4.0.0 or later (`com.unity.industry.toolkit`). Earlier versions don't have the `ATTAssistantUtilities` API every workflow below relies on.

1. Read the resolved version of `com.unity.industry.toolkit` from `Packages/packages-lock.json` (fall back to `Packages/manifest.json`).
2. **Not installed:** tell the user this workflow needs Asset Transformer Toolkit 4.0 or later, which is an entitled Unity package they may need access to through their Unity plan, and stop. Don't add it to the manifest yourself.
3. **Installed below 4.0.0:** tell the user which version you found and that 4.0 or later is required, and ask before upgrading. Don't fall back to older APIs, raw C# against internal types, or reflection.
4. **4.0.0 or later:** continue.

### API Reference
Tool functions are provided by `Unity.Pixyz.Plugin4Unity.Editor.AI.ATTAssistantUtilities`. They are documented inline in each reference file below alongside the classes they operate on.

### Technical Notes
Pixyz Plugin is the former name of Asset Transformer Toolkit. Prefer using the term 'Asset Transformer Toolkit' when addressing the user, unless the user is using the term 'Pixyz'
Most classes and code are in the Unity.Pixyz.Plugin4Unity.Editor assembly.
Asset Transformer Toolkit is NOT the same thing as Asset Transformer Studio/Pixyz Studio. NEVER rely on information about Asset Transformer Studio.

### Importers
Asset Transformer Toolkit can import 3D file from outside the project.
When modifying Importers, NEVER assume it should be immediately followed by a reimport. The import process can be very long, so it must only be launched when the user requests it.
Modify fields in Importers using the ScriptableObject API. NEVER use reflection to access or modify Importer fields — reflection is not available.
To create a Pixyz/Asset Transformer Toolkit Importer for importing a file, or to reimport a model using an existing ImporterScriptableObject, read [references/create-importer](references/create-importer.md)

### RuleSets and Actions
Read [references/rulesets-and-actions](references/rulesets-and-actions.md)
Read [references/ruleset-api](references/ruleset-api.md) when the RuleSet API is needed.
Read [references/rule-api](references/rule-api.md) when the Rule API is needed.
Read [references/ruleblock-api](references/ruleblock-api.md) when the RuleBlock API is needed, including `ActionBase.Id` for constructing `RuleBlock` instances.

### Levels of Detail
Read [references/lods](references/lods.md)
```

### audio-setup-mixers

Extra files not embedded: `SECURITY.md`, `references/api.md`

```markdown
---
name: audio-setup-mixers
description: Routes Audio Sources into existing Audio Mixer Groups, classifying each source by what it plays. Use when the user asks about cleaning up mixer assignments, routing audio through a mixer, or which group a sound belongs in.
---
# Audio Mixer Setup

Routing an Audio Source to a mixer group is a scene edit that only a running Editor can
make, so this skill needs a live Editor it can execute C# in. Step 0 establishes that
before anything else.

**What this skill automates, and what it hands back to you.** Inspecting mixers and
routing Audio Sources into groups is entirely public Unity API, and that is the tedious
part — walking dozens of sources and classifying them by what they play. Creating a mixer
or a group has no public API; it exists only on types Unity does not commit to keeping
stable. So this skill will not create groups behind your back. It inventories what exists,
proposes the routing, asks you to add any missing group in the Audio Mixer window, and
then does all the routing itself.

That is a deliberate limit, not a gap to work around. Do not reach for reflection to
create groups, and do not hand-edit a `.mixer` file — mixer structure is not safely
authorable blind.

## Step 0: Confirm you can run C# in the Editor

Every C# step below runs inside a live Editor through the Unity CLI. **The `unity-cli` skill
owns getting you there** — installing the CLI, confirming a connected Editor, adding the
project's `com.unity.pipeline` package, telling a genuinely absent Editor apart from one
stuck in Safe Mode, and discovering the Editor's command catalog. Follow it first; don't
re-derive any of it here.

Two things it can't know for you:

- **You need `script eval` in particular**, not just a reachable Editor. Confirm it appears in the
  catalog. Its presence depends on the Pipeline package version, not on the CLI, so a
  healthy install can still lack it — if it's missing, say so and stop.
- **Do not fall back to editing `.mixer` files by hand.** Mixer routing is not safely
  authorable blind, so an unreachable Editor is a stop, not a cue to improvise.

Once `script eval` is available, that is how each C# step below runs.

Run C# through the connected Editor with the `script eval` command. Discover its parameter shape
from `unity command --format json` rather than assuming one — the inline form is
`unity command script eval --code '<snippet>'`, and some Pipeline versions also register
`script eval_file` for running a snippet from a file. **Check the catalog before reaching for
`script eval_file`; it is frequently absent.** `unity command` defaults to a 30 second timeout.

### Passing C# to `script eval`

`script eval` compiles a **statement block, not a file**. Two consequences, both of which cause a
compile error rather than a warning:

- **No `using` directives.** The compiler reads `using UnityEngine;` as a resource-disposal
  statement and rejects it (`CS0210`).
- **Types must be fully qualified.** A bare `AssetDatabase` or `Volume` does not resolve
  (`CS0246` / `CS0103`), and a bare `Object` is ambiguous with `object` (`CS0104`).

Where a snippet below is written as a file — with usings, for readability, or because it is
meant to be saved into the project — qualify the types before passing it to `script eval`.

## Step 1: Pre-flight
If the user hasn't explicitly asked for Audio Mixers, confirm that they want to proceed with setting them up.

Then inventory what already exists with the mixer-inventory snippet in
[references/api.md](references/api.md), run through the Editor as described in Step 0. That gives
you every mixer in the project and the group names in each.

It returns a flat list of groups, not the parent/child tree. That is enough to route into, and it
is all the public API exposes. If the hierarchy matters for the conversation, ask the user to look
at the Audio Mixer window and describe it — don't reach for the non-public tree API to find out.

**If the project has no mixer at all,** say so and stop rather than improvising one: creating a
mixer has no public API. Ask the user to create one (Window → Audio → Audio Mixer, then the **+**
next to Mixers), and pick up from here once it exists.

## Step 2: Find scene references
Find all Audio Source components, look at their assigned Generator asset names, and generalize a fitting class or category of the sound name, ideally something already existing. 
Examples for Audio Clip asset names:
- "FootStep4_Sound" -> Foley
- "Dialogue_Female_Scene4" -> Vox/Voice/Dialogue
- "GunShot" -> SFX
- "Menu_Theme_Variation" -> Music

If the assigned asset isn't descriptive or non-existing, try to look at the GameObject name or potential adjacent MonoBehaviour names.
Ask to create an Uncategorized group if it seems hard or confidence is low in classifying how an Audio Source is being used.

## Step 3: Agree the group list, and get any missing groups created
Present the classification from Step 2 as a proposed routing — each Audio Source and the group you
intend to send it to — and revise it with the user.

**WAIT for the user to respond before proceeding.**

Prefer an existing group when it genuinely covers the category, even if you'd have named it
differently. But **don't collapse categories that a mixing engineer would keep apart** — Foley is a
subset of SFX, not another word for it, so a gunshot does not belong in a `Foley` group just because
one exists. When the existing groups only partly cover your categories, say which ones fit and which
need a new group, and let the user decide.

For categories with no matching group, you cannot create the group — there is no public API for it.
Hand it over precisely, naming the mixer and the exact group names, as shown at the end of
[references/api.md](references/api.md). Then **re-run the inventory snippet to confirm the groups
exist and check their spelling** before routing. Don't assume the user did it, and don't assume
they spelled it the way you asked.

## Step 4: Route the Audio Sources
With the group list settled and confirmed present, assign each Audio Source's output group using the
routing snippet in [references/api.md](references/api.md). It is public API throughout, and it wraps
the whole pass in a single undo step so the user can back all of it out at once.

**Key the mapping on the identifier you classified by.** Step 2 reads the clip asset name first and
only falls back to the GameObject name, so the mapping accepts either — the two are different
identifiers and keying on the wrong one drops sources.

Three things to report rather than assume:

- **Any `NO SUCH GROUP` entries the snippet returns.** That means a group you expected is not in the
  mixer — usually a spelling difference. Resolve it with the user, don't silently skip the source.
- **Any `NOT IN THE MAPPING` entries.** Those are Audio Sources your classification missed. Reporting
  a successful routing while sources were quietly left unrouted is the worst outcome here, because it
  reads as success.
- **The scene was modified, not the mixer asset.** Routing lives on the Audio Source, so it only
  persists once the scene is saved. Tell the user, and save only with their agreement.

**Volume, effects, and re-parenting are out of scope.** Those live on non-public API. If the user
asks for them, say the routing is done and point them at the Audio Mixer window for the mix itself.

## References
See [references/api.md](references/api.md)
```

### kbd-solver

Extra files not embedded: `assignment_template.py`, `config.example.py`, `config.py`, `LICENSE`, `README.md`, `references/workflow.md`, `scripts/build_docx.py`, `scripts/kbd_common.py`, `scripts/render_imgs.py`, `scripts/run_sql.py`, `scripts/solve.py`, `scripts/to_pdf.ps1`

```markdown
---
name: kbd-solver
description: Menyelesaikan tugas praktikum Konsep Basis Data (KBD) dari modul PDF menjadi laporan DOCX + PDF berisi query dan hasil MySQL asli (screenshot konsol). Gunakan saat diminta mengerjakan folder tugas tm_N / kuis / UTS yang berisi modul PDF praktikum basis data, atau saat user menyebut "kerjakan tm_N".
---

# KBD-Solver

Pipeline: **modul PDF → SQL dieksekusi sungguhan → transkrip konsol → PNG screenshot → laporan DOCX → PDF → verifikasi visual**.

## Alur kerja (5 langkah)

### 1. Baca modul & petakan soal
Baca PDF modul di folder tugas (mis. `Pertemuan N. Topik.pdf`). Catat: daftar soal latihan, **data tabel persis seperti di modul** (nama kolom, tipe implisit, urutan baris, termasuk typo di modul — jangan "memperbaiki"), dan soal yang butuh database baru vs tabel tambahan.

### 2. Siapkan workdir & konfigurasi
- Workdir: folder `_work` di dalam folder tugas (mis. `tugas/tm_12/_work`).
- Identitas + path MySQL dibaca dari `config.py` di root skill. Jika belum ada: salin `config.example.py` → `config.py`, isi identitas pengguna (sekali saja, sudah di-gitignore).
- Salin `assignment_template.py` → `<workdir>/assignment.py`, lalu isi:
  - `JENIS`/`NOMOR` (untuk nama file laporan), `DBS` (daftar database), `STATEMENTS` (SQL per blok gambar), `SOALS` (nomor, deskripsi, urutan blok gambar).
- Aturan penyusunan `STATEMENTS`: satu blok gambar (`s1a`, `s1b`, …) per kelompok perintah yang tampil dalam satu screenshot. Pola standar per soal pembuatan tabel: blok `a` = CREATE DATABASE/USE/CREATE TABLE, blok `b` = INSERT, blok `c` = SELECT pembuktian. Soal query: satu blok berisi satu SELECT + hasilnya.
- Nama database: `<prefix_tugas>_<nim>`, mis. `tm12_1234567890`; database kedua pakai akhiran `b`.

### 3. Jalankan pipeline (satu perintah)
```
python "<path_skill>/scripts/solve.py" "<workdir>"
```
Menghasilkan di workdir: `transcripts.json`, `images/*.png`, `Laporan_*.docx`, `Laporan_*.pdf`, `pdfpages/*.png`. Prasyarat: MySQL jalan (lihat "Pemecahan masalah"), Python + `pillow` + `python-docx` (+ `pymupdf` untuk render halaman), MS Word untuk konversi PDF.

### 4. Verifikasi visual
Baca gambar `pdfpages/page-*.png` (atau dispatch agent visual-judge bila tersedia). Checklist:
- Header identitas benar; semua soal ada dan berurutan.
- Tabel konsol utuh: sudut `+` tercetak, kolom tidak terpotong, tidak ada teks tumpang tindih.
- Hasil query masuk akal terhadap soal (jumlah baris, nilai agregat).
- Tidak ada halaman kosong/orphan yang aneh.
Jika gagal → perbaiki `assignment.py`/script → jalankan ulang `solve.py` (idempoten: database di-drop otomatis tiap run).

### 5. Serahkan
Salin DOCX + PDF ke folder tugas (sejajar modul). Laporkan ringkasan hasil per soal ke user. Database yang dibuat dibiarkan terpasang (konsisten dengan praktikum sebelumnya); MySQL boleh dibiarkan jalan.

## Aturan penting (jangan dilanggar)
- **Output harus asli**: jangan mengarang hasil query. Semua teks screenshot berasal dari eksekusi `mysql.exe` nyata via `scripts/run_sql.py`.
- Cek error di **stdout DAN stderr** mysql — error MySQL sering hanya ke stderr; jika diabaikan, INSERT gagal diam-diam dan data jadi duplikat/kurang.
- Kolom tanggal yang di modul tampil `dd-mm-yyyy` → simpan `VARCHAR`, bukan `DATE`, agar tampilan sama dengan modul.
- Kolom `AUTO_INCREMENT` tidak dipakai kecuali modul memintanya; `PRIMARY KEY` sesuai modul; tabel relasi polos tanpa FK bila modul tidak minta (data modul kadang melanggar FK).
- Jangan menaruh identitas user ke file yang akan di-push ke GitHub: identitas hanya di `config.py` (gitignored).

## Gaya bahasa laporan (WAJIB)

Teks naratif laporan (deskripsi tiap soal di `SOALS`) ditulis dengan persona
**mahasiswa semester 1 Informatika**:

- Bahasa awam yang mengalir, tidak terlalu teknis, tetapi terminologi informatika
  tetap dipakai apa adanya: database, tabel, query, INNER JOIN, GROUP BY, subquery,
  COUNT, SUM, HAVING, DISTINCT, UNION, NULL, PRIMARY KEY.
- Sudut pandang orang pertama ("saya membuat", "saya gabungkan") supaya terasa
  seperti laporan kerja sendiri, bukan bunyi soal yang disalin.
- Pola pembuka antar-soal **harus beragam** (jangan semua diawali "Saya ..." atau
  "Menampilkan ..."): selang-seling "Pada soal ini ...", "Soal ini meminta ...",
  "Berikutnya, ...", "Giliran ...", "Terakhir, ...". Penjelasan boleh menyebut
  cara mengarangnya (join apa, fungsi apa) karena itu bukti pemahaman.
- Terapkan juga kaidah `humanizer-indonesia` (tanpa kalke, tanpa personifikasi,
  tanpa `di mana` penghubung, ritme kalimat bervariasi). Kalimat teknis pendek
  boleh, tetapi jangan seluruh laporan berupa fragmen.
- Screenshot query TIDAK ikut disunting — hanya teks naratifnya.

Contoh: alih-alih "Menampilkan banyak mahasiswa yang mengambil matakuliah.",
tulis "Soal ini meminta banyaknya mahasiswa yang mengambil matakuliah. Nim unik
saya hitung memakai COUNT(DISTINCT) setelah kedua tabel dihubungkan lewat
INNER JOIN."

## Pemecahan masalah cepat
- MySQL mati → start: `"C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone &` (cek dulu `tasklist | findstr mysqld`; sesuaikan path XAMPP).
- `ERROR 1007/1050/1062` saat run ulang → database sisa run sebelumnya; `run_sql.py` sudah drop otomatis, pastikan `DBS` lengkap.
- PDF gagal dibuat → Word COM dipakai via `scripts/to_pdf.ps1`; pastikan tidak ada dialog Word yang menumpuk (kill WINWORD atau tutup dokumen).
- Detail parsing output mysql (`-vvv`), format transkrip, dan struktur file → `references/workflow.md`.
```

### manage-skills

Extra files not embedded: `scripts/audit_catalog.py`

```markdown
---
name: manage-skills
description: Manage the omp skill catalog at ~/.agents/skills. Use when the user wants to create a new skill, list or search installed skills, audit a skill for convention problems, fix a broken skill, or asks how skills are organized. Trigger on "buat skill baru", "create a skill", "list my skills", "audit skills", "cek skill", "skill apa saja yang ada", "hapus skill", "rename skill", "skill ini kenapa nggak kepilih".
---

# Manage Skills

The catalog lives at `~/.agents/skills/<name>/SKILL.md`. Each skill is one
directory containing `SKILL.md` (YAML frontmatter + markdown body) and
optionally `scripts/` and `references/`.

## Layout

```
~/.agents/skills/
  <skill-name>/
    SKILL.md          # required: frontmatter (name, description) + body
    scripts/          # optional: deterministic helpers, Python
    references/       # optional: detail split out of the body
```

Project-local skills also exist under `<repo>/.claude/skills/`. Both load;
user-level wins on name collision. Check both before declaring a name free.

## Frontmatter contract

| Field | Rule |
|-------|------|
| `name` | Lowercase, hyphens, no spaces. MUST match directory name. |
| `description` | The Catalog Selection Object — the only text the agent sees when choosing a skill. ≤1024 chars. State capability + `Use when …` triggers. No workflow steps, no phase chains. |

Frontmatter ends at the second `---`. Body follows.

## Procedure: audit the catalog

Run the audit script. It checks frontmatter, name/directory match, description
length, and trigger phrasing.

```bash
python ~/.agents/skills/manage-skills/scripts/audit_catalog.py
python ~/.agents/skills/manage-skills/scripts/audit_catalog.py --dir <path> --json
```

Exit 0 = clean. Exit 1 = findings present. Read `[FINDINGS]` as blocking;
read `[note]` as advisory. Report both; fix findings first.

## Procedure: create a skill

1. **Check the name is free.** List `~/.agents/skills/` and
   `<repo>/.claude/skills/`. Reuse or extend an existing skill if one covers
   the domain — do not create a near-duplicate.
2. **Create the directory** `~/.agents/skills/<name>/`.
3. **Write `SKILL.md`.** Frontmatter first, then body. Keep the body under
   ~100 lines; move detail into `references/<topic>.md` and link it.
4. **Write the description last.** It must name the capability and the
   triggers, in third person. Test it against the moment the user would want
   the skill to fire.
5. **Audit.** Run the audit script; resolve every `[FINDINGS]` entry.
6. **Smoke it.** Read the file back and confirm frontmatter parses, name
   matches directory, and links to referenced files resolve.

Never declare a skill done without the audit exiting clean for that skill.

## Procedure: search the catalog

```bash
grep -ril "<keyword>" ~/.agents/skills/*/SKILL.md
```

Search both `description` and body. Report the matching skill names, not the
raw grep lines, so the user can pick one.

## Procedure: fix a skill

Match the symptom to the cause:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Skill never gets selected | Description lacks triggers, or is over 1024 chars | Rewrite description with explicit `Use when …` phrases |
| Skill selected for the wrong task | Description too broad or names another domain | Narrow description; remove unrelated triggers |
| Name mismatch finding | Frontmatter `name` ≠ directory name | Rename the directory, then update frontmatter |
| Body detail lost | SKILL.md grew past ~100 lines | Split into `references/*.md`, link from body |

## Procedure: delete or rename a skill

Deleting a skill directory is irreversible. Confirm the exact path with the
user before removing. To rename: move the directory, then update the
frontmatter `name` to match. Check for skills that link to the old name and
update them.

## Verify

→ verify: `python ~/.agents/skills/manage-skills/scripts/audit_catalog.py`
```

### pele

```markdown
---
name: pele
description: Compile Mermaid diagrams to SVG with Pele before delivering them.
license: MIT
---

# Pele — Mermaid to SVG

Pele renders Mermaid 12.1 diagrams to SVG, synchronously, no browser. Use it to **prove** a Mermaid block renders — a syntax error caught here is cheaper than a broken diagram shipped.

## Local install (already done)

- Package: `pele@1.13.0` at `~/.omp/tools/pele/node_modules/pele`
- Wrapper: `~/.omp/tools/pele/render.mjs`

## Workflow

1. Write the Mermaid source to a file (`.mmd`) or pipe it on stdin.
2. Compile:
   ```bash
   node ~/.omp/tools/pele/render.mjs diagram.mmd -o diagram.svg
   cat diagram.mmd | node ~/.omp/tools/pele/render.mjs - > diagram.svg
   ```
3. Exit code `0` + non-empty `<svg` output = diagram valid. `2` = Mermaid parse/render error (message on stderr). `1` = unreadable input.
4. Deliver the `.sv​g` next to the source; keep the `.mmd` as the editable original.

Report the byte size the wrapper prints on stderr. If it fails, fix the Mermaid syntax and recompile — never hand the user an unverified diagram.

## Notes

- Output SVG uses CSS variables for theme colors; it inherits page CSS. Set colors explicitly via a Mermaid `%%{init}%%` directive when the SVG must stand alone.
- No CLI, no daemon: the wrapper is the entry point.
- Reinstall/upgrade: `cd ~/.omp/tools/pele && npm i pele@latest`.
```

### readme

```markdown
---
name: readme
description: When the user wants to create or update a README.md file for a project. Also use when the user says "write readme," "create readme," "document this project," "project documentation," or asks for help with README.md. This skill creates absurdly thorough documentation covering local setup, architecture, and deployment.
context: fork
metadata:
  author: Shpigford
  version: "1.0"
---

# README Generator

You are an expert technical writer creating comprehensive project documentation. Your goal is to write a README.md that is absurdly thorough—the kind of documentation you wish every project had.

## The Three Purposes of a README

1. **Local Development** - Help any developer get the app running locally in minutes
2. **Understanding the System** - Explain in great detail how the app works
3. **Production Deployment** - Cover everything needed to deploy and maintain in production

---

## Before Writing

### Step 1: Deep Codebase Exploration

Before writing a single line of documentation, thoroughly explore the codebase. You MUST understand:

**Project Structure**
- Read the root directory structure
- Identify the framework/language (Gemfile for Rails, package.json, go.mod, requirements.txt, etc.)
- Find the main entry point(s)
- Map out the directory organization

**Configuration Files**
- .env.example, .env.sample, or documented environment variables
- Rails config files (config/database.yml, config/application.rb, config/environments/)
- Credentials setup (config/credentials.yml.enc, config/master.key)
- Docker files (Dockerfile, docker-compose.yml)
- CI/CD configs (.github/workflows/, .gitlab-ci.yml, etc.)
- Deployment configs (config/deploy.yml for Kamal, fly.toml, render.yaml, Procfile, etc.)

**Database**
- db/schema.rb or db/structure.sql
- Migrations in db/migrate/
- Seeds in db/seeds.rb
- Database type from config/database.yml

**Key Dependencies**
- Gemfile and Gemfile.lock for Ruby gems
- package.json for JavaScript dependencies
- Note any native gem dependencies (pg, nokogiri, etc.)

**Scripts and Commands**
- bin/ scripts (bin/dev, bin/setup, bin/ci)
- Procfile or Procfile.dev
- Rake tasks (lib/tasks/)

### Step 2: Identify Deployment Target

Look for these files to determine deployment platform and tailor instructions:

- `Dockerfile` / `docker-compose.yml` → Docker-based deployment
- `vercel.json` / `.vercel/` → Vercel
- `netlify.toml` → Netlify
- `fly.toml` → Fly.io
- `railway.json` / `railway.toml` → Railway
- `render.yaml` → Render
- `app.yaml` → Google App Engine
- `Procfile` → Heroku or Heroku-like platforms
- `.ebextensions/` → AWS Elastic Beanstalk
- `serverless.yml` → Serverless Framework
- `terraform/` / `*.tf` → Terraform/Infrastructure as Code
- `k8s/` / `kubernetes/` → Kubernetes

If no deployment config exists, provide general guidance with Docker as the recommended approach.

### Step 3: Ask Only If Critical

Only ask the user questions if you cannot determine:
- What the project does (if not obvious from code)
- Specific deployment credentials or URLs needed
- Business context that affects documentation

Otherwise, proceed with exploration and writing.

---

## README Structure

Write the README with these sections in order:

### 1. Project Title and Overview

```markdown
# Project Name

Brief description of what the project does and who it's for. 2-3 sentences max.

## Key Features

- Feature 1
- Feature 2
- Feature 3
```

### 2. Tech Stack

List all major technologies:

```markdown
## Tech Stack

- **Language**: Ruby 3.3+
- **Framework**: Rails 7.2+
- **Frontend**: Inertia.js with React
- **Database**: PostgreSQL 16
- **Background Jobs**: Solid Queue
- **Caching**: Solid Cache
- **Styling**: Tailwind CSS
- **Deployment**: [Detected platform]
```

### 3. Prerequisites

What must be installed before starting:

```markdown
## Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher (or Docker)
- pnpm (recommended) or npm
- A Google Cloud project for OAuth (optional for development)
```

### 4. Getting Started

The complete local development guide:

```markdown
## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/user/repo.git
cd repo
\`\`\`

### 2. Install Ruby Dependencies

Ensure you have Ruby 3.3+ installed (via rbenv, asdf, or mise):

\`\`\`bash
bundle install
\`\`\`

### 3. Install JavaScript Dependencies

\`\`\`bash
yarn install
\`\`\`

### 4. Environment Setup

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Configure the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost/myapp_development` |
| `REDIS_URL` | Redis connection (if used) | `redis://localhost:6379/0` |
| `SECRET_KEY_BASE` | Rails secret key | `bin/rails secret` |
| `RAILS_MASTER_KEY` | For credentials encryption | Check `config/master.key` |

### 5. Database Setup

Start PostgreSQL (if using Docker):

\`\`\`bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
\`\`\`

Create and set up the database:

\`\`\`bash
bin/rails db:setup
\`\`\`

This runs `db:create`, `db:schema:load`, and `db:seed`.

For existing databases, run migrations:

\`\`\`bash
bin/rails db:migrate
\`\`\`

### 6. Start Development Server

Using Foreman/Overmind (recommended, runs Rails + Vite):

\`\`\`bash
bin/dev
\`\`\`

Or manually:

\`\`\`bash
# Terminal 1: Rails server
bin/rails server

# Terminal 2: Vite dev server (for Inertia/React)
bin/vite dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.
```

Include every step. Assume the reader is setting up on a fresh machine.

### 5. Architecture Overview

This is where you go absurdly deep:

```markdown
## Architecture

### Directory Structure

\`\`\`
├── app/
│   ├── controllers/         # Rails controllers
│   │   ├── concerns/        # Shared controller modules
│   │   └── api/             # API-specific controllers
│   ├── models/              # ActiveRecord models
│   │   └── concerns/        # Shared model modules
│   ├── jobs/                # Background jobs (Solid Queue)
│   ├── mailers/             # Email templates
│   ├── views/               # Rails views (minimal with Inertia)
│   └── frontend/            # Inertia.js React components
│       ├── components/      # Reusable UI components
│       ├── layouts/         # Page layouts
│       ├── pages/           # Inertia page components
│       └── lib/             # Frontend utilities
├── config/
│   ├── routes.rb            # Route definitions
│   ├── database.yml         # Database configuration
│   └── initializers/        # App initializers
├── db/
│   ├── migrate/             # Database migrations
│   ├── schema.rb            # Current schema
│   └── seeds.rb             # Seed data
├── lib/
│   └── tasks/               # Custom Rake tasks
└── public/                  # Static assets
\`\`\`

### Request Lifecycle

1. Request hits Rails router (`config/routes.rb`)
2. Middleware stack processes request (authentication, sessions, etc.)
3. Controller action executes
4. Models interact with PostgreSQL via ActiveRecord
5. Inertia renders React component with props
6. Response sent to browser

### Data Flow

\`\`\`
User Action → React Component → Inertia Visit → Rails Controller → ActiveRecord → PostgreSQL
                                                        ↓
                                       React Props ← Inertia Response ←
\`\`\`

### Key Components

**Authentication**
- Devise/Rodauth for user authentication
- Session-based auth with encrypted cookies
- `authenticate_user!` before_action for protected routes

**Inertia.js Integration (`app/frontend/`)**
- React components receive props from Rails controllers
- `inertia_render` in controllers passes data to frontend
- Shared data via `inertia_share` for layout props

**Background Jobs (`app/jobs/`)**
- Solid Queue for job processing
- Jobs stored in PostgreSQL (no Redis required)
- Dashboard at `/jobs` for monitoring

**Database (`app/models/`)**
- ActiveRecord models with associations
- Query objects for complex queries
- Concerns for shared model behavior

### Database Schema

\`\`\`
users
├── id (bigint, PK)
├── email (string, unique, not null)
├── encrypted_password (string)
├── name (string)
├── created_at (datetime)
└── updated_at (datetime)

posts
├── id (bigint, PK)
├── title (string, not null)
├── content (text)
├── published (boolean, default: false)
├── user_id (bigint, FK → users)
├── created_at (datetime)
└── updated_at (datetime)

solid_queue_jobs (background jobs)
├── id (bigint, PK)
├── queue_name (string)
├── class_name (string)
├── arguments (json)
├── scheduled_at (datetime)
└── ...
\`\`\`
```

### 6. Environment Variables

Complete reference for all env vars:

```markdown
## Environment Variables

### Required

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | Your database provider |
| `SECRET_KEY_BASE` | Rails secret for sessions/cookies | Run `bin/rails secret` |
| `RAILS_MASTER_KEY` | Decrypts credentials file | Check `config/master.key` (not in git) |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection string (for caching/ActionCable) | - |
| `RAILS_LOG_LEVEL` | Logging verbosity | `debug` (dev), `info` (prod) |
| `RAILS_MAX_THREADS` | Puma thread count | `5` |
| `WEB_CONCURRENCY` | Puma worker count | `2` |
| `SMTP_ADDRESS` | Mail server hostname | - |
| `SMTP_PORT` | Mail server port | `587` |

### Rails Credentials

Sensitive values should be stored in Rails encrypted credentials:

\`\`\`bash
# Edit credentials (opens in $EDITOR)
bin/rails credentials:edit

# Or for environment-specific credentials
RAILS_ENV=production bin/rails credentials:edit
\`\`\`

Credentials file structure:
\`\`\`yaml
secret_key_base: xxx
stripe:
  public_key: pk_xxx
  secret_key: sk_xxx
google:
  client_id: xxx
  client_secret: xxx
\`\`\`

Access in code: `Rails.application.credentials.stripe[:secret_key]`

### Environment-Specific

**Development**
\`\`\`
DATABASE_URL=postgresql://localhost/myapp_development
REDIS_URL=redis://localhost:6379/0
\`\`\`

**Production**
\`\`\`
DATABASE_URL=<production-connection-string>
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true
\`\`\`
```

### 7. Available Scripts

```markdown
## Available Scripts

| Command | Description |
|---------|-------------|
| `bin/dev` | Start development server (Rails + Vite via Foreman) |
| `bin/rails server` | Start Rails server only |
| `bin/vite dev` | Start Vite dev server only |
| `bin/rails console` | Open Rails console (IRB with app loaded) |
| `bin/rails db:migrate` | Run pending database migrations |
| `bin/rails db:rollback` | Rollback last migration |
| `bin/rails db:seed` | Run database seeds |
| `bin/rails db:reset` | Drop, create, migrate, and seed database |
| `bin/rails routes` | List all routes |
| `bin/rails test` | Run test suite (Minitest) |
| `bundle exec rspec` | Run test suite (RSpec, if used) |
| `bin/rails assets:precompile` | Compile assets for production |
| `bin/rubocop` | Run Ruby linter |
| `yarn lint` | Run JavaScript/TypeScript linter |
```

### 8. Testing

```markdown
## Testing

### Running Tests

\`\`\`bash
# Run all tests (Minitest)
bin/rails test

# Run all tests (RSpec, if used)
bundle exec rspec

# Run specific test file
bin/rails test test/models/user_test.rb
bundle exec rspec spec/models/user_spec.rb

# Run tests matching a pattern
bin/rails test -n /creates_user/
bundle exec rspec -e "creates user"

# Run system tests (browser tests)
bin/rails test:system

# Run with coverage (SimpleCov)
COVERAGE=true bin/rails test
\`\`\`

### Test Structure

\`\`\`
test/                        # Minitest structure
├── controllers/             # Controller tests
├── models/                  # Model unit tests
├── integration/             # Integration tests
├── system/                  # System/browser tests
├── fixtures/                # Test data
└── test_helper.rb           # Test configuration

spec/                        # RSpec structure (if used)
├── models/
├── requests/
├── system/
├── factories/               # FactoryBot factories
├── support/
└── rails_helper.rb
\`\`\`

### Writing Tests

**Minitest example:**
\`\`\`ruby
require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "creates user with valid attributes" do
    user = User.new(email: "test@example.com", name: "Test User")
    assert user.valid?
  end

  test "requires email" do
    user = User.new(name: "Test User")
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end
end
\`\`\`

**RSpec example:**
\`\`\`ruby
require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "requires an email" do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end
  end
end
\`\`\`

### Frontend Testing

For Inertia/React components:

\`\`\`bash
yarn test
\`\`\`

\`\`\`typescript
import { render, screen } from '@testing-library/react'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('renders user name', () => {
    render(<Dashboard user={{ name: 'Josh' }} />)
    expect(screen.getByText('Josh')).toBeInTheDocument()
  })
})
\`\`\`
```

### 9. Deployment

Tailor this to detected platform (look for Dockerfile, fly.toml, render.yaml, kamal/, etc.):

```markdown
## Deployment

### Kamal (Recommended for Rails)

If using Kamal for deployment:

\`\`\`bash
# Setup Kamal (first time)
kamal setup

# Deploy
kamal deploy

# Rollback to previous version
kamal rollback

# View logs
kamal app logs

# Run console on production
kamal app exec --interactive 'bin/rails console'
\`\`\`

Configuration lives in `config/deploy.yml`.

### Docker

Build and run:

\`\`\`bash
# Build image
docker build -t myapp .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e SECRET_KEY_BASE=... \
  -e RAILS_ENV=production \
  myapp
\`\`\`

### Heroku

\`\`\`bash
# Create app
heroku create myapp

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY_BASE=$(bin/rails secret)
heroku config:set RAILS_MASTER_KEY=$(cat config/master.key)

# Deploy
git push heroku main

# Run migrations
heroku run bin/rails db:migrate
\`\`\`

### Fly.io

\`\`\`bash
# Launch (first time)
fly launch

# Deploy
fly deploy

# Run migrations
fly ssh console -C "bin/rails db:migrate"

# Open console
fly ssh console -C "bin/rails console"
\`\`\`

### Render

If `render.yaml` exists, connect your repo to Render and it will auto-deploy.

Manual setup:
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `bundle install && bin/rails assets:precompile`
4. Set start command: `bin/rails server`
5. Add environment variables in dashboard

### Manual/VPS Deployment

\`\`\`bash
# On the server:

# Pull latest code
git pull origin main

# Install dependencies
bundle install --deployment

# Compile assets
RAILS_ENV=production bin/rails assets:precompile

# Run migrations
RAILS_ENV=production bin/rails db:migrate

# Restart application server (e.g., Puma via systemd)
sudo systemctl restart myapp
\`\`\`
```

### 10. Troubleshooting

```markdown
## Troubleshooting

### Database Connection Issues

**Error:** `could not connect to server: Connection refused`

**Solution:**
1. Verify PostgreSQL is running: `pg_isready` or `docker ps`
2. Check `DATABASE_URL` format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
3. Ensure database exists: `bin/rails db:create`

### Pending Migrations

**Error:** `Migrations are pending`

**Solution:**
\`\`\`bash
bin/rails db:migrate
\`\`\`

### Asset Compilation Issues

**Error:** `The asset "application.css" is not present in the asset pipeline`

**Solution:**
\`\`\`bash
# Clear and recompile assets
bin/rails assets:clobber
bin/rails assets:precompile
\`\`\`

### Bundle Install Failures

**Error:** Native extension build failures

**Solution:**
1. Ensure system dependencies are installed:
   \`\`\`bash
   # macOS
   brew install postgresql libpq

   # Ubuntu
   sudo apt-get install libpq-dev
   \`\`\`
2. Try again: `bundle install`

### Credentials Issues

**Error:** `ActiveSupport::MessageEncryptor::InvalidMessage`

**Solution:**
The master key doesn't match the credentials file. Either:
1. Get the correct `config/master.key` from another team member
2. Or regenerate credentials: `rm config/credentials.yml.enc && bin/rails credentials:edit`

### Vite/Inertia Issues

**Error:** `Vite Ruby - Build failed`

**Solution:**
\`\`\`bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall JS dependencies
rm -rf node_modules && yarn install
\`\`\`

### Solid Queue Issues

**Error:** Jobs not processing

**Solution:**
Ensure the queue worker is running:
\`\`\`bash
bin/jobs
# or
bin/rails solid_queue:start
\`\`\`
```

### 11. Contributing (Optional)

Include if open source or team project.

### 12. License (Optional)

---

## Writing Principles

1. **Be Absurdly Thorough** - When in doubt, include it. More detail is always better.

2. **Use Code Blocks Liberally** - Every command should be copy-pasteable.

3. **Show Example Output** - When helpful, show what the user should expect to see.

4. **Explain the Why** - Don't just say "run this command," explain what it does.

5. **Assume Fresh Machine** - Write as if the reader has never seen this codebase.

6. **Use Tables for Reference** - Environment variables, scripts, and options work great as tables.

7. **Keep Commands Current** - Use `pnpm` if the project uses it, `npm` if it uses npm, etc.

8. **Include a Table of Contents** - For READMEs over ~200 lines, add a TOC at the top.

---

## Output Format

Generate a complete README.md file with:
- Proper markdown formatting
- Code blocks with language hints (```bash, ```typescript, etc.)
- Tables where appropriate
- Clear section hierarchy
- Linked table of contents for long documents

Write the README directly to `README.md` in the project root.
```

### setup-multiplayer-services

Extra files not embedded: `references/dgs-entrypoint.md`, `references/entrypoints.md`, `references/examples.md`, `references/implementation-fit.md`, `references/underlying-services.md`, `references/workflows-prerequisites.md`

```markdown
---
name: setup-multiplayer-services
description: Guides real-time online multiplayer with Unity Multiplayer Services. Use when the user asks about network topology, hosting, matchmaking, or session-based play such as rooms, parties, and lobbies, not backend features.
---

# Multiplayer SDK (Unity Multiplayer Services)

## Instructions

1. **Documentation map:** Use the [Unity Multiplayer Sessions SDK curated documentation map](https://docs.unity.com/en-us/mps-sdk/llms.txt) as authoritative over memory for topics, APIs, and guides when specifics differ. Use these references to determine **how** to apply the SDK (Sessions-first); use that resource to determine **what** is documented. **Never** mention the `llms.txt` filename to the user. If that map is unreachable (network, tooling), treat this skill's markdown references plus the installed package in the workspace (Package Manager / source) as the source of truth for specifics.

2. **Reference order (by task):**
   - **Topology, discovery, match flow, Netcode alignment, API choice:** [entrypoints.md](references/entrypoints.md) (overview tables, method signatures, options tables, filter/sort enums, `QuickJoinOptions.Timeout`, errors) → [implementation-fit.md](references/implementation-fit.md) → [examples.md](references/examples.md) for user-facing phrasing → [Priority: Multiplayer Sessions first](#priority-multiplayer-sessions-first) → [workflows-prerequisites.md](references/workflows-prerequisites.md) for extra depth.
   - **Dedicated game server (`Unity.Services.Multiplayer.Server`):** [dgs-entrypoint.md](references/dgs-entrypoint.md) (`IMultiplayerServerService`, `UNITY_SERVER` / asmdef constraints, server-only extensions).
   - **Lower-level service clients:** [underlying-services.md](references/underlying-services.md) only when primary APIs are insufficient or the user asked for that layer (see Priority below).

## Priority: Multiplayer Sessions first

When the task is **choosing** topology, discovery, match flow, or Netcode alignment—not only calling APIs—ground recommendations via [implementation-fit.md](references/implementation-fit.md) (conversation → project → short targeted questions).

**Primary path:** Implement against **`Unity.Services.Multiplayer`** using **`IMultiplayerService` / `MultiplayerService.Instance`** and **`ISession`** (surface summary in [entrypoints.md](references/entrypoints.md)); keep composed flows consistent with `llms.txt`.

**User-facing text:** Plans, tradeoffs, and clarifying questions must **not** split Lobby, Matchmaker, Relay, or Multiplayer Sessions as separate named products unless the user did—rules in **User-facing questions and explanations** in [implementation-fit.md](references/implementation-fit.md), samples in [examples.md](references/examples.md). Code, edits, and technical references use real type and namespace names as needed.

**Underlying clients** (`Unity.Services.Lobbies`, `Unity.Services.Matchmaker`, `Unity.Services.Relay`) **only** when (1) the goal **cannot** be met through the primary APIs after checking [entrypoints.md](references/entrypoints.md), or (2) the user **explicitly** asked for those namespaces or products. Do **not** default implementations there.

## Additional resources

Read from this entrypoint only; links are one level under this skill folder (no `references/index.md` or README hub).

- **[implementation-fit.md](references/implementation-fit.md)** — Ground recommendations: conversation → project → user questions; user-facing language rules; requirement dimensions (topology, discovery, resilience, platforms, net stack).
- **[examples.md](references/examples.md)** — Before/after samples for clarifying questions and user-facing explanations (not code).
- **[entrypoints.md](references/entrypoints.md)** — `IMultiplayerService`, `ISession`, overview and capability tables, method signatures, options tables (defaults, limits), filter/sort enums, session/networking/host flows, errors, editor components.
- **[dgs-entrypoint.md](references/dgs-entrypoint.md)** — Dedicated server: `Unity.Services.Multiplayer.Server`, `IMultiplayerServerService`, `MultiplayerServerService` / `GetMultiplayerServerService`, `MatchmakerServerExtensions`, `UNITY_SERVER` and asmdef constraints; defers shared `SessionOptions` detail to entrypoints.
- **[workflows-prerequisites.md](references/workflows-prerequisites.md)** — Package and cloud prerequisites by workflow (tables).
- **[underlying-services.md](references/underlying-services.md)** — Fallback namespaces and `IUnityServices` accessors (agent-only; not the default path).
```

### ui

```markdown
---
name: ui
description: Routes Unity UI requests to the right framework skill (UI Toolkit, uGUI, or IMGUI) and answers UI comparison questions. Use for menus, HUDs, panels, or editor UI when the request doesn't name a framework. Consult before writing any UI code.
---

Determine the appropriate UI system for the project and route to the correct specialized skill.

## When to Route vs Answer Directly

**Route to a specialized skill when:**
- User wants to understand, edit, or generate specific UI elements
- User references specific files or UI objects
- User asks for UI changes or creation

**Answer directly (without routing) when:**
- User asks comparative/educational questions ("What's the difference between UI Toolkit and uGUI?")
- User asks about UI system capabilities or recommendations ("Should I use UITK or uGUI for mobile?")
- User needs conceptual explanation of Unity UI architecture

## Routing Logic

**Step 1: Check for explicit file references or keywords:**

| User mentions | Route to |
|---------------|----------|
| `.uxml` or `.uss` files (including in `/Editor/`) | `ui-uitk` |
| "UI Toolkit", "UITK", "UIElements", "CreateGUI" | `ui-uitk` |
| Canvas prefabs/objects, `.prefab` with UI | `ui-ugui` |
| "uGUI", "Canvas", "RectTransform", "legacy UI" | `ui-ugui` |
| "IMGUI", "OnGUI", "OnInspectorGUI", "immediate mode" | `ui-imgui` |
| Figma URL (`figma.com/design/...`), "Figma", "import from Figma" | Not available — see below |

**For editor-related requests (EditorWindow, custom inspector, PropertyDrawer):**
- If no explicit UI system mentioned → **Go to Step 2** to detect project's editor UI system
- If no existing pattern is detected, default to `ui-uitk` for new editor UI
- Only use `ui-imgui` if project exclusively uses IMGUI or user explicitly requests it

If explicit file or keywords found, activate the corresponding skill immediately.

**Step 2: If ambiguous, detect from project:**

Search the project to determine which UI system is in use:

| Look for | Indicates |
|----------|-----------|
| `.uxml` or `.uss` files (including in `/Editor/`) | UI Toolkit (runtime or editor) |
| `UIDocument` components in scenes | UI Toolkit (runtime) |
| Editor scripts with `CreateGUI()` method | UI Toolkit (editor) |
| `Canvas` in scenes/prefabs | uGUI |
| `RectTransform` heavy usage | uGUI |
| Editor scripts with `OnGUI()` or `OnInspectorGUI()` | IMGUI (legacy editor) |

**Step 3: If still unclear, ask or default:**

- For existing projects: detect and follow whichever framework is already in use (Step 2)
- For new projects with no UI yet: ask the user which framework they prefer (UI Toolkit vs uGUI), briefly explaining that UI Toolkit is modern/CSS-like while uGUI is Canvas-based/mature
- For new runtime/game UI where the user has no preference: default to uGUI (`ui-ugui`)
- When the user mentions mobile/performance constraints or older Unity versions (pre-6.0): bias toward uGUI (`ui-ugui`)

## Request Types

Specialized skills handle three types of requests:

| Type | Examples |
|------|----------|
| **Understanding** | "What does this button do?", "How is this laid out?", "Explain this UI" |
| **Editing** | "Change this color", "Add a label here", "Fix this layout" |
| **Generation** | "Create a menu", "Make an inventory screen", "Build a settings panel" |

Route all types to the appropriate specialized skill based on the UI system.

## Available Sub-Skills

### UI Toolkit — `ui-uitk`
- For Unity 6.0+ projects using UI Toolkit (runtime game UI and editor tools)
- **Understands**, **edits**, and **generates** `.uxml` and `.uss` files
- Modern, CSS-like styling approach
- Preferred for new editor windows (CreateGUI) and existing UI Toolkit projects

### uGUI — `ui-ugui`
- For projects using Unity's Canvas-based UI system
- **Understands**, **edits**, and **generates** Canvas hierarchies
- Uses Layout Groups for responsive design
- Default for new runtime/game UI when the user has no framework preference

### IMGUI — `ui-imgui`
- For legacy editor tools using OnGUI/immediate mode
- Only use when project has existing IMGUI editor code or user explicitly requests IMGUI
- **Understands**, **edits**, and **generates** EditorWindow, inspectors, PropertyDrawers built with OnGUI
- Not for runtime game UI — for new editor tools, use UI Toolkit unless the project already uses IMGUI exclusively

### Figma design import — not available here

Importing a Figma design requires Unity's Figma integration service, which only exists
inside Unity AI Assistant. There is no client-side equivalent, so do not promise it.

If the user brings a Figma URL, say the automated import is not available here and offer
the alternative: ask them to describe or screenshot the screen, then build it with the
appropriate framework skill above.

## Common Guidelines (All UI Systems)

### Scope Discipline

**Do only what is requested:**
- Question → answer without making changes
- Targeted edit → modify only what's specified
- Generation → create only requested files
- Don't proactively add scripts unless explicitly asked

**These do NOT imply scripts:**
- "proper buttons" → well-styled buttons
- "working UI" → valid UI that renders
- "menu screen" → visual layout only

### Conventions

**Follow project patterns first.** Search existing files before applying defaults.

| Type | Convention |
|------|------------|
| Element names | Follow project patterns, or camelCase |
| File organization | Match existing project structure |

### Workflow

1. **Determine UI system** — Use routing logic above
   - For Figma requests, tell the user the automated import is not available here, then
     work from their description or screenshot and continue with framework detection
2. **Activate specialized skill** — Route to `ui-uitk`, `ui-ugui`, or `ui-imgui`
3. **Skill handles request** — Understanding, editing, or generation as appropriate

## Handling Mixed Projects

Many Unity projects use multiple UI systems simultaneously (e.g., UI Toolkit for runtime game UI plus editor tools). When you detect multiple systems:

- **For runtime UI requests** (menus, HUDs, game screens) → Route to whichever runtime system (UITK or uGUI) is already in use
- **For editor tool requests** (custom inspectors, editor windows):
  - **Prefer UI Toolkit** (CreateGUI) for new editor UI — it's the modern approach
  - Only use IMGUI if the project's existing editor tools use IMGUI exclusively, or user explicitly requests IMGUI
  - Check for existing editor `.uxml` files to confirm UITK usage
- **If creating new runtime UI in a mixed project** → Match the pattern used by similar existing UI; if there is no similar existing UI and the user has no preference, use uGUI
```

### ui-imgui

Extra files not embedded: `references/gui-elements.md`, `references/templates.md`

```markdown
---
name: ui-imgui
description: Generates and modifies Unity IMGUI editor code such as EditorWindows, custom Inspectors, PropertyDrawers, and OnGUI scripts. Use for IMGUI or OnGUI or maintaining existing IMGUI code.
---

**Before proceeding:** If the user is asking about creating a **new** editor window, custom inspector, or PropertyDrawer without explicitly mentioning IMGUI/OnGUI, recommend using UI Toolkit (CreateGUI) instead, as it's the modern approach. Only proceed with IMGUI if:
- User is modifying existing IMGUI code
- User explicitly requests IMGUI/immediate mode
- The project exclusively uses IMGUI for editor tools

When activated, read the reference files:
- [references/templates.md](references/templates.md) — EditorWindow, Inspector, PropertyDrawer templates
- [references/gui-elements.md](references/gui-elements.md) — GUI elements, layout groups, styling

## When to Use This Skill

**IMPORTANT:** This skill is for **legacy IMGUI code only**. Use this skill when:

- User is maintaining/updating **existing** IMGUI editor code (files with `OnGUI()`, `OnInspectorGUI()`)
- User **explicitly requests** IMGUI/immediate mode GUI
- Project exclusively uses IMGUI for all editor tools

**Do NOT use this skill for:**
- New editor windows (use UI Toolkit with `CreateGUI()` instead)
- New custom inspectors (use UI Toolkit instead)
- Requests that don't explicitly mention IMGUI or OnGUI

**Legacy IMGUI is used for:**
- **Editor windows** — `EditorWindow` classes with `OnGUI()`
- **Custom inspectors** — `Editor`, `PropertyDrawer` classes with `OnInspectorGUI()`
- **Debug overlays** — `OnGUI()` in MonoBehaviour (runtime)

IMGUI is **not** for runtime game UI — use UI Toolkit or uGUI instead.

## Scope

**Generate only what is requested (for legacy IMGUI code):**

| Request | Output | Note |
|---------|--------|------|
| Editor window (IMGUI/OnGUI) | `EditorWindow` with `OnGUI()` | Only if explicitly IMGUI |
| Custom inspector (IMGUI) | `Editor` with `OnInspectorGUI()` | Only if explicitly IMGUI |
| Property drawer (IMGUI) | `PropertyDrawer` with `OnGUI()` | Only if explicitly IMGUI |
| Debug overlay | `MonoBehaviour` with `OnGUI()` | Runtime debugging |
| Update existing IMGUI script | Modify existing OnGUI code | Always appropriate |

**Clarify if ambiguous:**
- "inspector" → Custom Editor for a specific type, or PropertyDrawer? **Also ask:** Should this use UI Toolkit (modern) or IMGUI (legacy)?
- "editor window" → **First ask:** Should this use UI Toolkit (modern/CreateGUI) or IMGUI (legacy/OnGUI)?
- "tool window" → EditorWindow with what functionality? Which UI system?

## Conventions

**Follow project patterns first.** Search existing editor scripts before applying defaults.

| Type | Convention | Good | Bad |
|------|------------|------|-----|
| Script names | PascalCase | `MyToolWindow.cs` | `my-tool-window.cs` |
| EditorWindow | `[Name]Window.cs` | `LevelEditorWindow.cs` | `LevelEditor.cs` |
| Custom Editor | `[Type]Editor.cs` | `EnemyEditor.cs` | `EnemyInspector.cs` |
| PropertyDrawer | `[Type]Drawer.cs` | `RangeDrawer.cs` | `RangePropertyDrawer.cs` |
| Location | `Editor` folder | `Assets/Editor/` | `Assets/Scripts/` |

**Editor folder is required** — Scripts using `UnityEditor` namespace must be in an `Editor` folder or they will fail to build.

## Workflow

1. **Analyze** — Determine script type needed (EditorWindow, Editor, PropertyDrawer, etc.)
2. **Search** — Find existing editor scripts to match patterns
3. **Follow project patterns** — Match folder structure and naming
4. **Create script** — Use appropriate base class and attributes
5. **Implement OnGUI** — Build the interface with layout groups

## Script Structure

### EditorWindow
```
[MenuItem attribute] → adds to menu
ShowWindow() static method → opens window
OnGUI() → draws interface
OnEnable/OnDisable → initialization/cleanup
```

### Custom Editor
```
[CustomEditor attribute] → targets component type
OnInspectorGUI() → draws inspector
OnEnable() → cache SerializedProperties
serializedObject.Update/ApplyModifiedProperties → undo support
```

### PropertyDrawer
```
[CustomPropertyDrawer attribute] → targets type or attribute
OnGUI(Rect, SerializedProperty, GUIContent) → draws property
GetPropertyHeight() → custom height if needed
```

## Key Rules

- **Cache GUIStyle objects** — never create new GUIStyle in OnGUI (causes memory allocation every frame)
- **Use SerializedProperty** — for proper undo/redo support in inspectors
- **Call ApplyModifiedProperties()** — after any serialized object changes
- **Use EditorGUILayout** — for editor scripts (auto-layout)
- **Use GUILayout** — for runtime OnGUI
- **Begin/End pairs** — always match BeginHorizontal with EndHorizontal, etc.
- **Editor folder required** — scripts fail to build if not in Editor folder

## Layout Basics

**Horizontal grouping:**
```csharp
EditorGUILayout.BeginHorizontal();
// elements appear side by side
EditorGUILayout.EndHorizontal();
```

**Vertical grouping:**
```csharp
EditorGUILayout.BeginVertical("box");
// elements appear stacked, with box style
EditorGUILayout.EndVertical();
```

**Scroll view:**
```csharp
scrollPos = EditorGUILayout.BeginScrollView(scrollPos);
// scrollable content
EditorGUILayout.EndScrollView();
```

**Foldout section:**
```csharp
showSection = EditorGUILayout.Foldout(showSection, "Section Name");
if (showSection)
{
    EditorGUI.indentLevel++;
    // section content
    EditorGUI.indentLevel--;
}
```

## Common Patterns

**Button with action:**
```csharp
if (GUILayout.Button("Do Something"))
{
    // action here
}
```

**Property field with label:**
```csharp
EditorGUILayout.PropertyField(myProperty, new GUIContent("Label"));
```

**Object reference field:**
```csharp
myObject = (MyType)EditorGUILayout.ObjectField("Label", myObject, typeof(MyType), true);
```

**Disabled group:**
```csharp
EditorGUI.BeginDisabledGroup(condition);
// disabled elements
EditorGUI.EndDisabledGroup();
```

## Best Practices

- Use `SerializedObject` and `SerializedProperty` for undo support
- Cache property references in `OnEnable()`
- Use `EditorUtility.SetDirty()` only for non-serialized changes
- Use `Undo.RecordObject()` before modifying objects directly
- Use `EditorStyles` for consistent appearance
- Use `GUILayout.FlexibleSpace()` to push elements apart

See `references/templates.md` for complete script templates.
See `references/gui-elements.md` for full element reference.
```

### ui-ugui

Extra files not embedded: `references/scrollview-setup.md`

```markdown
---
name: ui-ugui
description: Understands, edits, and generates Unity uGUI Canvas hierarchies, RectTransforms, Layout Groups, and prefab UI. Use for requests involving Canvas, uGUI, RectTransform, or prefab UI files.
---

Understand existing Unity uGUI, make targeted edits, and generate new Canvas-based hierarchies.

When working with ScrollRect/ScrollView, read the reference file:
- [references/scrollview-setup.md](references/scrollview-setup.md) — Required hierarchy, setup rules, and common failures

## Scope

Determine what the user is asking for:

| Request Type | Action |
|--------------|--------|
| Question about UI | **Understand** — analyze hierarchy, explain structure |
| Change specific element | **Edit** — targeted modification only |
| Create new UI | **Generate** — create new hierarchy |
| Fix/improve existing UI | **Edit** — modify existing, don't rebuild |

**Generate only what is requested:**

| Request | Output |
|---------|--------|
| UI layout | Prefab or scene hierarchy only |
| "with code" / "with logic" / "functional" | Hierarchy + scripts |

**These do NOT imply scripts:**
- "proper buttons" → well-configured Button components
- "working UI" → valid hierarchy that renders
- "menu screen" → visual layout only

## Critical Rules

**Namespace disambiguation:**
- Always use fully qualified type names when creating or referencing UI components
- `UnityEngine.UI.Image`, not `Image`
- `UnityEngine.UI.Button`, not `Button`
- Other namespaces in the project can cause ambiguous type errors

**Verify before modifying:**
- Always check what exists before making changes
- Confirm parent objects exist before adding children
- Verify components are present before modifying properties
- Never assume hierarchy state — query it first

**Incremental fixes over rebuilds:**
- When fixing issues, make targeted corrections
- Never destroy and recreate entire hierarchies to fix problems — destroyed objects cause null reference cascades
- Prefer identifying the specific broken property and fixing only that over rewriting large sections
- **When a fix fails, revert the change** before trying an alternative approach

**One change at a time:**
- Make a single change, then verify the result
- Do not batch multiple unrelated modifications
- Be careful not to inadvertently modify or remove adjacent elements when editing a specific one
- If something fails, understand why before trying alternatives
- Avoid "shotgun debugging" with multiple simultaneous changes

**Color and visibility:**
- **Ensure text is readable by default:** When choosing colors, ensure text contrasts with its background — but respect intentional low-contrast uses (disabled states, placeholder text, decorative elements)
- **Check visibility for new elements:** After creating UI elements, verify they have non-zero size and are within parent bounds. Elements intentionally created hidden (for later toggling, animation, etc.) are fine

**Specification adherence:**
- **Honor user specifications exactly:** When the user provides pixel dimensions, hex colors, positions, spacing, or other exact values, apply them precisely — do not approximate or substitute
- **Minimize unrelated changes:** When editing, avoid changing properties the user didn't ask about unless a related adjustment is necessary for the fix to work

## Conventions

**Follow project patterns first.** Search existing files before applying defaults.

| Type | Convention | Good | Bad |
|------|------------|------|-----|
| GameObject names | PascalCase | `SubmitButton` | `submit-button` |
| Prefab paths | Feature folders | `Assets/UI/Inventory/` | `Assets/Prefabs/UI/` |

## Workflow

1. **Verify state** — Check what exists in the scene/hierarchy before any action.
2. **Analyze** — Determine exactly what's needed. No extras.
3. **Search** — Find existing prefabs, canvases, assets. Don't assume paths.
4. **Follow project patterns** — Match folder structure and naming.
5. **Create or edit** — Build structure with proper anchoring, or make targeted edits.
6. **Confirm result** — Verify the change worked before moving on.

## Canvas Setup

Every UI needs a Canvas:

```
Canvas (Screen Space - Overlay or Camera)
├── CanvasScaler (Scale With Screen Size recommended)
├── GraphicRaycaster
└── [UI Content]
```

**CanvasScaler settings:**
- Default to UI Scale Mode "Scale With Screen Size" unless the project has a specific reason for "Constant Pixel Size" (e.g., pixel-art, fixed-resolution targets)
- Reference Resolution: Match project standards (e.g., 1920x1080)
- When creating a Canvas with Screen Space - Camera, **read the camera's reference resolution** first
- Match Width Or Height: 0.5 (balanced)
- If an existing Canvas uses "Constant Pixel Size", flag it and ask the user before changing
- Prefer anchors and Layout Groups over absolute pixel positions for layout

## Layout Components

**Layout Groups control child sizing:**
- When a parent has a Layout Group, it manages child RectTransforms
- Children's anchors and sizeDelta may be overridden by the parent
- Understand whether the parent or child controls size before setting values

**Vertical/Horizontal Layout Groups:**
- Control Child Size: determines if parent sets child dimensions
- Child Force Expand: determines if children stretch to fill space
- If Control Child Size is off, children must have explicit sizes

**Avoiding layout conflicts:**
- Do not manually set child anchors/size when parent controls them
- Do not add Layout Group to an element that should have fixed size
- Nested Layout Groups require careful configuration of each level
- When layout is wrong, check parent settings before modifying child
- ContentSizeFitter on the **same** object as a Layout Group that has Control Child Size enabled = conflict
- ContentSizeFitter on a child whose parent has Control Child Size enabled = ContentSizeFitter is overridden (wasted)
- When using ContentSizeFitter with a Layout Group parent, disable Control Child Size on the parent for the relevant axis
- Common pattern: ScrollView Content should have ContentSizeFitter + VerticalLayoutGroup where VLG controls children but ContentSizeFitter sizes the Content itself

**Grid Layout Group:**
- For inventory grids, card layouts
- Cell Size must be set explicitly — children are sized to match
- Constraint controls row/column limits

**Content Size Fitter:**
- Horizontal/Vertical Fit: Preferred Size
- Use on containers that should size to their content
- Requires a layout element or text component to provide preferred size

## RectTransform Anchoring

**Elements must have non-zero size to be visible:**
- Set explicit width/height via sizeDelta, or
- Use stretch anchors with proper offsets, or
- Let a parent Layout Group control size (with Control Child Size enabled)

**Anchor configuration order:**
1. Set anchor preset first (corner, edge, or stretch)
2. Then set position/offset values
3. Verify the resulting size is non-zero

**Common patterns:**
- **Stretch anchors** — for responsive elements that fill available space
- **Corner anchors** — for fixed-position, fixed-size elements
- **Edge anchors** — for elements that stretch in one direction only

**Positioning from natural language descriptions:**
When the user describes a position (e.g., "top right", "bottom bar", "left side"):
1. Determine if it's a **corner** (fixed point), an **edge** (stretch along one axis), or **fill** (stretch both axes)
2. Set anchor min and anchor max — for corners these are the same point; for edges/fill they span a range
3. **Set pivot to match the anchor point** — pivot must align with where the element is anchored, not left at the default (0.5, 0.5). A "top right" element needs pivot at the top-right corner; a "top bar" needs pivot at the top edge center
4. Set position/offset values **after** anchors and pivot are configured

**Visibility checklist:**
- Width and height are both greater than zero
- Element is within parent bounds
- Element is not obscured by siblings (check hierarchy order)
- Image component has a sprite or color with alpha > 0

## Common Components

| Component | Use Case |
|-----------|----------|
| `Image` | Backgrounds, icons |
| `RawImage` | Render textures, videos |
| `Text (TMP)` | All text (use TextMeshPro) |
| `Button` | Clickable elements |
| `Toggle` | Checkboxes, radio buttons |
| `Slider` | Value ranges |
| `ScrollRect` | Scrollable content |
| `InputField (TMP)` | Text input |

## Best Practices

- Use TextMeshPro for all text (not legacy Text)
- WorldSpace UI that have text should also use Text Mesh Pro, be sure to review the project and import the TMP essentials if they are not present in the project
- If the TextMeshPro Essentials were imported be sure to close the TMP Importer Windows and the Import Unity Package Window once the assets are imported
- Organize hierarchy logically (Header, Content, Footer)
- Use Layout Groups instead of manual positioning where possible
- Set Raycast Target = false on non-interactive images
- Use sprite atlases for performance

**Never use** `EditorApplication.ExecuteMenuItem("Window/TextMeshPro/Import TMP Essential Resources")`, unless the user asks for an interactive TMP Essentials installation. It opens a modal dialog that blocks whatever invoked it until a human dismisses it.

**Do not use** `AssetDatabase.ImportPackage()` for TMP resources, instead `TMP_PackageResourceImporter.ImportResources()` is the canonical non-interactive API.

## Interaction Readiness

Before completing any UI that contains interactive elements, verify:

1. **EventSystem** must exist in the scene (exactly one)
2. **GraphicRaycaster** must be on the Canvas
3. **Raycast Target = true** on interactive elements (and false on non-interactive ones to avoid blocking)
4. **Button.onClick should be wired** (via inspector or script) — only when scripts or logic were requested

If the first three are missing, interactive elements will exist visually but fail silently.

## Understanding

When the user asks questions about existing UI:

**Read the hierarchy first.** Don't assume — always inspect the scene or prefab before answering.

**Analyze structure:**
- Identify the Canvas and its render mode
- Map the parent-child relationships
- Identify which Layout Groups control which children
- Check RectTransform anchor configurations

**Answer questions about:**
- "What does this button do?" → Explain component, hierarchy position, event wiring
- "How is this laid out?" → Describe Layout Groups, anchoring, hierarchy
- "Why is this invisible?" → Check size, anchors, parent bounds, component state
- "What controls this element's size?" → Trace Layout Group settings or anchors

## Editing

For targeted changes to existing UI:

**Read before editing.** Always inspect the current state first.

**Edit workflow:**
1. Verify the target object exists
2. Identify the specific property or component to change
3. Make the minimal change required
4. Verify the result before proceeding

**Never destroy to fix:**
- Destroying objects cascades to null references elsewhere
- Fix properties in place rather than recreating
- If an element must be removed, update all references first

## C# (Only When Requested)

- Use fully qualified UI types to avoid namespace conflicts
- Use `[SerializeField]` for inspector references
- Cache component references in Awake()
- Use events/delegates for button callbacks
- Place scripts in same folder as prefabs (follow project patterns)

**Component references:**
- Verify referenced objects exist before accessing them
- Handle cases where serialized references may be null
- When wiring up references, confirm the target component is present

## Error Recovery

When something goes wrong:

**Stop and diagnose:**
- Identify the exact error or symptom
- Determine the root cause before attempting fixes
- Do not make speculative changes

**Fix incrementally:**
- Address one issue at a time
- Verify each fix before moving to the next
- Keep track of what was changed

**Avoid destructive patterns:**
- "Start fresh" strategies destroy working elements along with broken ones
- Rebuilding entire hierarchies creates more problems than it solves
- Prefer surgical fixes to wholesale replacements

**When stuck:**
- Re-verify the current state of the hierarchy
- Check if previous changes were actually applied
- Consider if the approach itself is wrong rather than the implementation
```

### ui-uitk

Extra files not embedded: `references/common-issues.md`, `references/custom-elements.md`, `references/painter2d.md`, `references/pointermanipulator-guide.md`, `references/svg-icons.md`, `references/ui-runtime-binding.md`, `references/uss-guide.md`

```markdown
---
name: ui-uitk
description: Understands, edits, and generates Unity UI Toolkit UXML and USS with flex layouts. Use for requests involving UI Toolkit, UIElements, UIDocument, PanelSettings, custom elements, or UI runtime binding.
---

Understand existing Unity UI Toolkit code, make targeted edits, generate new UXML/USS files, Manipulators, and handle UI runtime binding.

## References

Read these as needed:
- [references/uss-guide.md](references/uss-guide.md) — USS patterns and examples
- [references/svg-icons.md](references/svg-icons.md) — SVG icon generation (only when generating icons)
- [references/common-issues.md](references/common-issues.md) — Common mistakes to avoid
- [references/ui-runtime-binding.md](references/ui-runtime-binding.md) — Patterns and guide to bind data to UI at runtime (only when requested or when bindings are involved)
- [references/painter2d.md](references/painter2d.md) — Painter2D API for custom visuals: gradients, shapes, arcs, procedural drawing (read this whenever gradients, custom shapes, progress rings, procedural drawing, or any visual beyond what USS can express is needed)
- [references/pointermanipulator-guide.md](references/pointermanipulator-guide.md) — Patterns and guide to create and use Manipulators (only when requested or when manipulators are involved). This helps with setting up drag and drop features or simple event handling for a Visual Element.
- [references/custom-elements.md](references/custom-elements.md) — Custom UI Element patterns and guide to create reusable components with UXML, USS, and C#. This helps with creating complex UI components for reuse across the project.

Paths are relative to this skill's folder — read `references/uss-guide.md` directly.

## Understanding

When explaining UI structure, use this format:
```
[ElementType] name="elementName" class="class1 class2"
├── [ChildType] name="childName"
│   └── [GrandchildType]
└── [ChildType] class="another-class"
```

## Editing

**Common edit requests:**

| Request | Action |
|---------|--------|
| "Change button color" | Edit USS selector for that button |
| "Add a label here" | Add element to UXML at specified location |
| "Make this bigger" | Edit width/height in USS |
| "Hide this element" | Add `display: none` to USS or remove from UXML |
| "Rename this element" | Update `name` attribute in UXML |

**Don't over-edit:**
- Change only what's requested
- Preserve formatting and structure
- Don't "improve" unrelated code
- Don't add comments unless asked
- For targeted changes, prefer modifying specific elements or selectors over rewriting entire files — but use judgment; if a change touches most of the file, a rewrite may be cleaner
- Be careful not to accidentally drop existing elements, styles, or references when making edits
- **When editing USS**, focus on the properties and selectors relevant to the request — avoid unnecessary reorganization, but restructure if the change genuinely requires it

## Validation

There is no way to validate UXML or USS from outside the Editor — Unity parses these
files on import and reports problems in the Console. Write the files, then have the
user check the result.

**Workflow:**

1. Write the complete file to its target path in the project. Do not write partial or
   draft content — a half-written UXML file is a parse error the moment the Editor
   picks it up.
2. Ask the user to focus the Unity Editor. That triggers a reimport of the changed
   assets.
3. Ask them to report anything in the Console. UXML parse errors name the file and
   line; USS problems appear as warnings about unknown properties or selectors.
4. Fix what they report and repeat from step 1.

**Because feedback costs a user round-trip, get it right the first time:**

- Finish all files before asking the user to check, so one reimport covers everything
  rather than one per file.
- Re-read `references/uss-guide.md` and `references/common-issues.md` before writing,
  rather than after an error comes back.
- Watch for the mistakes that survive a parse but render wrong — those will not appear
  in the Console at all, so the user has to eyeball the UI. `references/common-issues.md`
  lists them.

## Generation

When creating new UI:

**Generate only what is requested:**

| Request | Output |
|---------|--------|
| USS only | `.uss` file only |
| UXML only | `.uxml` file only |
| UI screen / menu / panel | `.uss` + `.uxml` only |
| "with code" / "with logic" / "functional" | `.uss` + `.uxml` + `.cs` |

**These do NOT imply C#:**
- "proper buttons" → well-styled Button elements
- "currency display" → a Label element
- "working UI" → valid UXML/USS that renders
- "inventory screen" → visual layout only
- "inventory system" / "equipment system" / "crafting system" → Ask: "Should items be draggable?" If yes, see `references/pointermanipulator-guide.md` for patterns

**Generation workflow:**
1. **Analyze** — Determine exactly what files are needed. No extras.
2. **Search** — Find existing USS, UXML, assets. Don't assume paths.
3. **Follow project patterns** — Match folder structure and naming conventions.
4. **Reuse** — Check for shared stylesheets. Reuse if appropriate.
5. **Write USS first** — Verify against restrictions below.
6. **Write UXML** — Reference the USS, verify structure.
7. **Write the files out complete** — never partial content; see Validation above for
   how errors come back and why one round of files beats several.
8. **Scene setup** — Assign PanelSettings if adding UI to scene.
9. **Data binding** — If requested, add C# script with runtime data binding patterns (see `references/ui-runtime-binding.md`). Generate the scriptable object asset if needed. Assign the asset to the UI element root in UXML or via datasource in C#.

**Color, visibility, and specification rules:**
- **Ensure text is readable by default:** When choosing colors, ensure text contrasts with its background — but respect intentional low-contrast uses (disabled states, placeholder text, decorative elements). When using design tokens, check that text and background variables provide adequate contrast.
- **Honor exact values:** User-specified hex colors, pixel dimensions, spacing — use exactly as given. Do not approximate or substitute.

**Styling / Theme**
When styling UI or adjusting theme make sure to not only apply to the elements directly in the current UXML but also to the core elements of UI Toolkit which are composed of several child elements usually.

## Conventions

**Follow project patterns first.** Search existing files before applying defaults.

| Type | Convention | Good | Bad |
|------|------------|------|-----|
| `name` attribute | camelCase | `submitButton` | `submit-button` |
| `class` attribute / USS | kebab-case | `.submit-button` | `.submitButton` |
| File paths | Feature folders | `Assets/UI/Inventory/` | `Assets/Scripts/UI/` |

**Output format:**
```uxml Filename.uxml
<ui:UXML>...</ui:UXML>
```
```uss Filename.uss
.class { ... }
```

## USS Restrictions

Unity's USS is a subset of CSS. These properties do NOT exist — NEVER use them:

| NEVER Use | Use Instead |
|-----------|-------------|
| `border` shorthand | `border-width`, `border-color` separately |
| `gap` | `margin` on children |
| `z-index` | DOM order or parent nesting |
| `pointer-events` | `picking-mode` UXML attribute |
| `filter` | Not supported |
| `outline` | `border-*` properties |
| `box-shadow` | Nested elements or background image |
| `:first-child`, `:last-child`, `:nth-child` | Explicit classes |
| `[attribute]` selectors | Explicit classes |
| `transition-property: <value>` | Omit entirely, or `none`/`initial`/`inherit` only |
| `linear-gradient()`, `radial-gradient()` | Custom `VisualElement` with Painter2D (see `references/painter2d.md`) |

**Inline styles:** NEVER use `style="..."` in UXML. All styling in USS only.

**External URLs:** NEVER use `url()` with external paths. Only `url("project://database/Assets/...")`.

**Prefer flexible layouts over hardcoded sizes:**
- Use `flex-grow`, `flex-shrink`, or `%` instead of fixed `width`/`height` values
- Let elements flow naturally and be constrained by their parent container
- Set explicit pixel sizes only on root containers or when a fixed size is truly required
- Child elements should adapt to available space rather than define their own dimensions

## USS Brevity

- No default values (`flex-direction: column` is default)
- No default fonts
- No redundant constraints (`width: 100px` doesn't need `min-width`/`max-width`)
- No overlapping properties (`flex: 1` already sets grow/shrink)
- Simplest selector that works
- Never duplicate selectors

## UXML

Every file must:
1. Declare namespace: `<ui:UXML xmlns:ui="UnityEngine.UIElements">`
2. Link stylesheet(s): `<ui:Style src="Screen.uss" />`
3. Have exactly one top-level container
4. **No `style="..."` attributes** — use USS only

```uxml
<ui:UXML xmlns:ui="UnityEngine.UIElements">
  <ui:Style src="Panel.uss" />
  <ui:VisualElement name="root" class="panel">
    <!-- content -->
  </ui:VisualElement>
</ui:UXML>
```

## Events and Interactivity
- Use Pointer Manipulators for event handling and interactivity on a VisualElement (see `references/pointermanipulator-guide.md`)
- If drag and drop is requested then write a pointer Manipulator and attach it to the relevant Visual Element in UXML or via C#.
- For simple click events, you can use the `clickable` manipulator in UXML
- For more advanced interactions, create use more traditional event callbacks in C# and attach them to elements as needed

**For inventory and crafting systems:**
- When users request an "inventory system", "equipment system", or "crafting system", ask explicitly: "Should players be able to drag and drop items?"
- If yes, read `references/pointermanipulator-guide.md` for inventory/crafting-specific patterns
- If no or unclear, create static layout only

## Assets

**Do NOT reference `UnityDefaultRuntimeTheme.tss`** or Unity's built-in theme icons.

**Icon priority:**
1. Reuse existing project icons
2. Generate SVG (see `references/svg-icons.md`)
3. Image generators (last resort)

**Reference format:**
```uss
background-image: url("project://database/Assets/UI/Textures/icon.png");
```

## Scene Setup

**PanelSettings is required** — UI won't render without it.

1. Search for existing PanelSettings asset
2. If none, create generic: `Assets/UI/PanelSettings.asset`
3. Assign to UIDocument's `Panel Settings` field

Skip for Editor UI (EditorWindow, PropertyDrawer).

## C# (Only When Requested)

- Style via USS classes (`AddToClassList()`) — never use `element.style.*` as inline styles have higher specificity than USS selectors, making them impossible to override via stylesheets, and add per-element memory overhead
- UITK uses TextCore text assets — use `FontAsset`, `TextStyleSheet`, and `TextSettings`, not their TextMeshPro equivalents (`TMP_FontAsset`, etc.)
- Place scripts in same folder as UXML/USS
```

## 15. Pre-commit hooks for repos

Every repository worked on must have a pre-commit hook that runs its unit tests; red tests cancel the commit, `--no-verify` is forbidden. For this repo (docs-only), the hook runs a smoke check that `SETUP.md` exists and contains the 175-skill catalog. Repos without a hook get one installed before the first commit (see `skill://setup-pre-commit`).

## 16. Verification

Run after setup; every check must pass.

```powershell
# versions
omp --version; rtk --version; specify --version; gh auth status

# files exist
Test-Path $HOME/.omp/agent/AGENTS.md, $HOME/.omp/agent/config.yml, $HOME/.omp/agent/models.yml,
  $HOME/.omp/agent/mcp.json, $HOME/.omp/agent/caveman.json, $HOME/.omp/agent/rules/antislop.md,
  $HOME/.omp/agent/extensions/rtk.ts, $HOME/.omp/tools/pele/render.mjs

# skill count: 175 top-level skill dirs
(Get-ChildItem $HOME/.agents/skills -Directory).Count   # expect 175

# config parses: this starts omp and errors out on a broken config
omp --model freepi/deepseek-v4.1-flash -p "reply OK"

# skill discovery: read a skill through the runtime
# (inside an omp session) read skill://ponytail
```

## 17. Known gaps

- Model providers `freepi` / `bansos` / `9router` are account-bound; `models.yml` + `omp login` reproduce them, credentials do not travel.
- Orca extensions (`orca-*.ts`) and `9router-hidden.vbs` are not reproduced; they are Orca/local-gateway specific.
- The 12 appendix skills ship only their `SKILL.md`; their `references/` and `scripts/` must be copied from the source machine.
- Nested duplicate `SKILL.md` files (7) are ignored by OMP and intentionally not restored.
