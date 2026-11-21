# setup-omp

Reproduction kit for an [oh-my-pi (OMP)](https://github.com/can1357/oh-my-pi) environment. It ships one executable document, `SETUP.md`, that rebuilds a raw OMP install into a specific working setup: global `AGENTS.md`, always-on rules, model roles and fallback chains, MCP servers, plugins, extensions, tools, and 175 skills.

Captured from OMP `18.4.3` on Windows 11 x64.

## Table of contents

1. [Features](#features)
2. [Requirements](#requirements)
3. [Install](#install)
4. [Usage](#usage)
5. [Reading the fields](#reading-the-fields)
6. [What it reads and touches](#what-it-reads-and-touches)
7. [Architecture](#architecture)
8. [Development](#development)
9. [Troubleshooting](#troubleshooting)
10. [Security notes](#security-notes)
11. [License](#license)

## Features

- **Verbatim agent policy** — `AGENTS.md` (README rules, language rules, todo discipline, mandatory skills, pre-commit rules) and the always-on `rules/antislop.md` embedded unchanged.
- **Full config capture** — `config.yml` model roles, retry fallback chains, browser settings, disabled providers; `mcp.json`; `caveman.json`.
- **Secrets never travel** — `models.yml` is emitted with `apiKey: ${NUSAGATE_API_KEY}`; the only literal key left is the local-only `9router` placeholder `sk-keyless-local`.
- **Extensions and tools** — required `rtk.ts` (rewrites bash calls through `rtk rewrite`), optional `9router-autostart.js`, and the `pele` Mermaid renderer source.
- **Plugin set with pinned versions** — `package.json` for `~/.omp/plugins`, the 12-package lock list, and three marketplaces.
- **Skill catalog** — 163 skills mapped to verified upstream paths (26 repos) plus 12 skills embedded as `SKILL.md` bodies when no public upstream was verifiable.
- **Measurable verification** — section 16 gives commands for versions, file presence, skill count, config parsing, and skill loading.
- **Machine-checkable repo** — `scripts/verify-setup.mjs` fails if `SETUP.md` loses its title, catalog claim, exact row count, or gains a secret-shaped key.

## Requirements

| Requirement | Version | Notes |
|---|---|---|
| OMP | 18.4.3+ | Target runtime |
| Windows | 10/11 | Commands in `SETUP.md` are PowerShell |
| Git | any | Clone upstream skill repos |
| Bun | current | Install plugins and `pele` |
| gh CLI | 2.x | Optional; needed only if you publish |
| rtk | >= 1.1.0 binary | Extension requires `rtk >= 0.23.0` at runtime |
| specify | 1.4.4.dev0 | Optional; needed by `spec-kit` skill |
| Node.js | 24.x | Runs `scripts/verify-setup.mjs` |

## Install

1. Install OMP and confirm it runs:

   ```powershell
   omp --version
   ```

2. Clone this repository:

   ```powershell
   git clone https://github.com/yayayapluto/setup-omp
   cd setup-omp
   ```

3. Open OMP in the repository directory:

   ```powershell
   omp
   ```

4. Ask the agent to apply the document. Type:

   ```text
   read SETUP.md and execute sections 1 through 12 in order
   ```

5. Provide the secrets the document tells you to export (section 6):

   ```powershell
   $env:NUSAGATE_API_KEY = "<your key>"
   omp login
   ```

6. **Verify it loaded.** Run:

   ```powershell
   omp --version
   (Get-ChildItem $HOME/.agents/skills -Directory).Count   # expect 175
   omp --model freepi/deepseek-v4.1-flash -p "reply OK"
   ```

   Then inside an OMP session:

   ```text
   read skill://ponytail
   ```

   All four checks must succeed.

## Usage

The repository is a setup document, not a running service. Day-to-day use means pointing a fresh agent at `SETUP.md` and letting it execute the steps; afterwards the environment is maintained by OMP itself.

| Task | Command or prompt | Effect |
|---|---|---|
| Full setup | `read SETUP.md and execute sections 1 through 12 in order` | Writes config, rules, extensions, plugins, tools, and skills |
| Config only | `apply SETUP.md sections 3 to 8` | Writes `AGENTS.md`, rules, `config.yml`, `models.yml`, `mcp.json`, `caveman.json` |
| Skills only | `apply SETUP.md sections 13 and 14` | Clones upstream repos and restores 175 skills |
| Verify | `run SETUP.md section 16` | Executes the verification block |
| Check the doc itself | `node scripts/verify-setup.mjs` | Validates catalog row count and structure |

Example session:

```text
> read SETUP.md and execute sections 1 through 12 in order
...
> run SETUP.md section 16
```

Expected final output of the verification block includes:

```text
175
OK
```

## Reading the fields

`SETUP.md` is organized as 17 numbered sections.

| Section | What it establishes |
|---|---|
| 1 | Tool and version prerequisites |
| 2 | Target directory layout under `$HOME` |
| 3 | Global `AGENTS.md` (verbatim) |
| 4 | `rules/antislop.md` (verbatim) |
| 5 | `config.yml` — model roles, retry chains, browser, disabled providers |
| 6 | `models.yml` template, env var, provider login |
| 7 | `mcp.json` — `canva` enabled, `Roblox_Studio` disabled |
| 8 | `caveman.json` plus ponytail/caveman level note |
| 9 | `extensions/rtk.ts` (required), optional 9router/Orca notes |
| 10 | Hooks convention; source machine has no user hooks |
| 11 | Plugin `package.json`, pinned versions, marketplaces |
| 12 | `tools/pele` package and renderer |
| 13 | Skills catalog: skill, upstream repo, path in repo |
| 14 | Appendix: 12 skills embedded as `SKILL.md` bodies |
| 15 | Pre-commit hook requirements per repository |
| 16 | Verification commands |
| 17 | Known gaps and machine-bound items |

Skill catalog columns:

| Column | Meaning |
|---|---|
| Skill | Directory name under `$HOME/.agents/skills` |
| Upstream repo | `owner/repo` on GitHub |
| Path in repo | Directory to copy into the skill folder |

## Common prompts

- `read SETUP.md and execute sections 1 through 12 in order`
- `which SETUP.md section installs the rtk extension`
- `apply SETUP.md section 13 only`
- `run SETUP.md section 16 and report which check fails`
- `update SETUP.md section 5 with the current config.yml`

## What it reads and touches

Files written during setup:

| Path | Source |
|---|---|
| `$HOME/.omp/agent/AGENTS.md` | Section 3 |
| `$HOME/.omp/agent/rules/antislop.md` | Section 4 |
| `$HOME/.omp/agent/config.yml` | Section 5 |
| `$HOME/.omp/agent/models.yml` | Section 6 |
| `$HOME/.omp/agent/mcp.json` | Section 7 |
| `$HOME/.omp/agent/caveman.json` | Section 8 |
| `$HOME/.omp/agent/extensions/rtk.ts` | Section 9 |
| `$HOME/.omp/agent/extensions/9router-autostart.js` | Section 9, optional |
| `$HOME/.omp/plugins/package.json` | Section 11 |
| `$HOME/.omp/tools/pele/package.json`, `render.mjs` | Section 12 |
| `$HOME/.agents/skills/<name>/SKILL.md` | Sections 13 and 14 |

Environment variables:

| Variable | Used by |
|---|---|
| `NUSAGATE_API_KEY` | `models.yml` provider `nusagate` |
| `RTK_DISABLED` | `rtk.ts` extension; set to `1` to bypass rewrites |

Network access: `github.com` for skill clones and marketplaces, the Bun/npm registry for plugins and `pele`, and model provider endpoints for `omp login`. No local ports are opened by this repository.

Side effects to expect: new directories under `$HOME`, plugin installs into `~/.omp/plugins/node_modules`, and global model-provider credentials stored by OMP after `omp login`.

## Architecture

```text
setup-omp/
├── SETUP.md                  # the entire setup, 17 sections
├── README.md                 # this file
├── LICENSE                   # MIT
└── scripts/
    └── verify-setup.mjs      # structural smoke check
```

Flow:

```text
fresh OMP install
      │
      ▼
clone setup-omp  ──►  agent reads SETUP.md
      │                     │
      │                     ├─ sections 3–12 ──► ~/.omp/agent/*, plugins, tools
      │                     └─ sections 13–14 ─► ~/.agents/skills/*
      ▼
section 16 verification ──► versions, file presence, skill count, config parse
```

Skills come from upstream repositories, so `SETUP.md` stays a single document instead of vendoring megabytes of third-party material.

## Development

The only build artifact is the document itself. Check it before committing:

```powershell
node scripts/verify-setup.mjs
```

The script asserts:

- `SETUP.md` and `LICENSE` exist
- the document starts with `# SETUP.md`
- it still claims a 175-skill catalog
- the catalog table contains exactly 163 rows
- no `apiKey` value is secret-shaped

Expected output:

```text
setup-omp smoke: OK
```

A pre-commit hook can call the same command:

```sh
#!/bin/sh
node scripts/verify-setup.mjs
```

Repository changes are pushed through a branch and a pull request; `master` is not pushed directly.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `omp: command not found` | OMP not installed or not on PATH | Install OMP, reopen the shell |
| `RTK disabled: rtk binary not found in PATH` | `rtk` missing | Install `rtk` >= 1.1.0 and restart OMP |
| `freepi/...` model unresolved | Plugins or provider login missing | Complete sections 11 and 6, then `omp login` |
| Skill count is not 175 | Clone or copy step skipped | Re-run sections 13 and 14 |
| `read skill://<name>` fails | Skill folder missing or nested too deep | Place `SKILL.md` at `~/.agents/skills/<name>/SKILL.md` |
| Catalog row check fails | `SETUP.md` edited without updating the table | Restore the 163 rows or update `scripts/verify-setup.mjs` |
| `9router` provider errors | Local gateway on `127.0.0.1:20128` not running | Start the gateway or remove the provider from `models.yml` |

## Security notes

- No API keys, tokens, or passwords are stored in this repository. `models.yml` ships with `${NUSAGATE_API_KEY}` and a local-only placeholder key.
- Setup installs third-party plugins and skills from their public upstreams. Review those licenses and versions before running setup on a machine you care about.
- `omp login` writes provider credentials into OMP's own credential store outside this repository.
- `scripts/verify-setup.mjs` exists partly to catch accidental secret commits: it fails on secret-shaped `apiKey` values.

## License

MIT. See [LICENSE](LICENSE).
