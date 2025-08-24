# Poke Vote

A simple voting application for Pokémon.

## Description

This project allows users to vote for their favorite Pokémon and view voting results.

## Installation

```bash
pnpm i
```

## Usage

```bash
pnpm run dev
```

## Features

- Vote for Pokémon with your friends using Web RTC Datachannel
- View voting results

## Known issues

- Currently, having more than one guest connection does not work reliably. This is likely due to storing guest data inside React state: older guest entries are not updated correctly because of stale closures. A refactor is needed to ensure all guest connections are consistently updated. (Might fix using useRef instead?)
- Vercel routing: When deployed to Vercel, navigating directly to a non-root route (e.g., /waiting-room) returns a 404. This can be fixed with a proper Vercel rewrite configuration or React Router setup.

## TODOs

- Fix multiple guests issue
- Better error handling (catch errors and display in the UI, add ErrorBoundary)
- Refactor
- Add Bonus features
- Add test code
- improve eslint/prettier config
