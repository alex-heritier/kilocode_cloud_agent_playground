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