# Project Guidelines for Agents

## Hosting & Deployment
- Entirely hosted on GitHub Pages for MVP.
- No build step; all external libraries linked via CDN.
- Client-side only; all backend/storage mechanisms fully mocked on the frontend.

## Tech Stack
- React via CDN.
- BEM-style CSS for styling.

## Principles
- Rigorously follow SOLID principles.
- Design backend/storage modules modularity to allow easy swapping between mocked and real implementations with minimal code changes.

## Documentation
- Maintain a CHRONICLE.md file with a contextual history of all work done on this codebase, including why certain decisions were made, issues encountered and how they were fixed, to provide good background context for AI coding agents.