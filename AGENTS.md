# LUNITA

> Built with Arc Studio

Project memory for agents and humans.

## What This App Does

LUNITA is a cozy, ADHD-friendly fantasy game. Real tasks become quests broken into tiny steps by Lumi (a local, rule-based companion in `src/game/lumi.ts`). Rewards (XP, stardust, crystals, sunbeams) restore five worlds. No streaks, no punishment. Progress persists in localStorage (`lunita:save:v1`).

## Tech Stack

- React, Vite, TypeScript, Tailwind (parchment/burgundy/gold theme in `tailwind.config.js` and `src/index.css`), Framer Motion
- wagmi v2 + viem + ConnectKit; chain Arc Testnet (5042002)
- Contracts: Solidity 0.8.28 + Foundry

## Structure

- `src/game/`: types, data (worlds, chapters, achievements, plants, cosmetics), store (state, actions, rewards), lumi (task breakdown + replies), sound, keepsakes (ABI + address)
- `src/art/`: SVG illustrations (scenes per world, Lumi, traveller, garden glyphs, ornaments)
- `src/ui/`: shell, nav, Lumi drawer, task forge, modals, intro
- `src/views/`: Realm map, Forest, Forge, Island, Garden, Sanctuary, Quests, Collection, Keepsakes
- `src/games/`: Whisper Match, Rune Echo, Star Chart, Firefly Catch, Moon Breathing, plus GameShell (frame, mastery rank, collection), discoveries.tsx (all collectible data, ranks), rewards.ts (gameWin). Progress per game lives in `save.games[gameId]` ({plays, wins, found[]})

## Characters

- Data: `src/characters/roster/<id>.ts` (profile, dialogue, reactions, 3-chapter arc, gifts), aggregated in `src/characters/index.ts`. Bond rules in `bond.ts`, arc/chapter helpers in `progress.ts`.
- Art: images live in `public/characters/<id>.(png|webp|jpg|jpeg)` and are shown untouched by `CharacterArt`. Missing files show a neutral placeholder (Lumi falls back to the in-game SVG). Never redraw or restyle supplied art.
- UI: `src/characters/ui/` (PortraitCard, Bubble, Sparkle, CompanionDock, CompanionSelect, CharacterSheet, Residents); `src/views/Library.tsx` is the Sanctum Library.
- State (in the main save): `charUnlocked`, `charBond`, `companion`, `giftsClaimed`, `inventory`; character chapters use ids like `elowen-arc-2` in `chaptersRead`.
- Bond points: companion +1 per step/mini-game/etc, world residents +1 to +3 on quests, games, voyages, blooms. Chapters 2 and 3 open at bond 2 and 3.

## Sound

- `src/game/sound.ts` synthesises everything with Web Audio (no audio files): world instruments via `play(enabled, world, freqs)`, effects via `sfx`, breathing guide via `breathTone`, and per-world ambience via `setAmbient` (driven by the current view in `Shell`). Silent unless `settings.sound` is on; ambience needs `settings.ambient`; `settings.volume` scales the master bus.

## Deployed Contracts

- LunitaKeepsakes (ERC-721, open cosmetic claim of 12 keepsakes, one per address each): `0x22448ecab2800695ebc90a63929ad15b720d3720` on Arc Testnet. Address is wired via `VITE_KEEPSAKES_ADDRESS` in `.env`. The contract cannot verify in-game progress; the UI gates the claim button.

## Notes

- Worlds unlock by total crystals (Forest 0, Forge 1, Island 3, Garden 5, Sanctuary 8). Crystals gained in locked worlds still count.
- World scene stage comes from crystals in that world (thresholds in `STAGE_AT`).
- Lumi is not an external LLM. To make her LLM-backed, add a backend route and call it from `LumiDrawer`.
