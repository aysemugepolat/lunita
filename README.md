# LUNITA: Small Steps. Magical Worlds.

LUNITA is a calm, ADHD-friendly fantasy adventure where real-life tasks become magical quests. Finishing small steps restores five illustrated worlds, unlocks story chapters, grows a garden and earns crystals. There are no streaks and nothing is ever taken away. Optional Arc Testnet keepsakes let players collect milestones as digital collectibles.

Built with [Arc Studio](https://studio.arc.io)

## What you can do

- Explore five worlds: Whispering Forest, Quest Forge, Focus Island, Blooming Garden and Moonlight Sanctuary.
- Ask Lumi, the moon-wisp companion, to break any task into small steps, make a step smaller, and turn it into a quest.
- Play five gentle mini-games, one per world: Whisper Match, Rune Echo, Star Chart, Firefly Catch and Moon Breathing. Each has easy options, a how-to, no timer and no losing. Every game grows a mastery rank and a collection (whispers, songs, constellations, wishes and moon phases) that never goes down.
- Sail 1 to 25 minute focus voyages. Pause or land early at any time and keep what you earned.
- Plant and tend a garden, dress your traveller, keep a reflection journal and read illustrated story chapters.
- Hear a synthesised soundtrack: every world has its own instrument (marimba, anvil, glass bells, harp, singing bowl) and an optional ambient soundscape. Sound is off until you turn it on, with a quick speaker button, a volume slider and a gentle-vibration option in settings.
- Collect crystals, XP and achievements. Progress is saved in the browser.
- Meet ten characters in the Sanctum Library. Each lives in one world as an NPC with dialogue, has a three-chapter story and a bond that only grows, and any unlocked friend can travel with you as an on-screen companion.
- Optionally connect a wallet and claim cosmetic keepsakes on Arc Testnet.

## Tech stack

React, Vite, TypeScript, Tailwind CSS, Framer Motion, wagmi, viem, ConnectKit, and a Solidity (Foundry) ERC-721 contract on Arc Testnet.

## Character artwork

Place the official character images in `public/characters/` named `lumi`, `elowen`, `cinder`, `pip`, `seren`, `quill`, `marigold`, `fennel`, `oriel` and `nox` (png, webp, jpg or jpeg). They are shown exactly as supplied. To add a character, create a file in `src/characters/roster/` and list it in `src/characters/index.ts`.

## Development

Prerequisites: Bun.

```bash
bun install
bun run dev
```

Other scripts: `bun run check` (lint and typecheck), `bun run test:smoke` (plays through the game in a simulated browser), `bun run contracts:build`, `bun run contracts:test`.

### Environment variables

- `VITE_KEEPSAKES_ADDRESS`: address of the deployed keepsakes contract on Arc Testnet. Leave unset to hide claiming.
- `RPC_PROXY_BASE_URL`, `RPC_PROXY_TOKEN`, `RPC_PROXY_CHAINS`: provisioned by Arc Studio for RPC access. Optional outside Arc Studio.
