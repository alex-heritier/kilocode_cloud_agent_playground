# Chronicle of Development

This file maintains a contextual history of all work done on the English to Vietnamese Learning Platform codebase. It includes decisions made, issues encountered, and how they were resolved, to provide background context for AI coding agents and future developers.

## Initial Setup (2026-01-01)

- **Project Initialization**: Created basic React app structure with CDN dependencies (React, Babel) for client-side only deployment on GitHub Pages.
- **Tech Stack Decision**: Chose React via CDN to avoid build steps, BEM CSS for maintainable styling, following SOLID principles for modular design.
- **File Structure**: Set up index.html, app.js, styles.css, README.md, and AGENTS.md with project guidelines.

## Architecture Planning (2026-01-01)

- **Decision**: Created ARCHITECTURE.md to document system design, including client-side architecture, component hierarchy, SRS implementation, and future extensibility.
- **Rationale**: Provides clear blueprint for development, ensuring adherence to project principles and easy onboarding.
- **Diagrams**: Included Mermaid diagrams for system architecture, component tree, and data flow to visualize complex relationships.

## Flashcard System Implementation (2026-01-01)

- **Feature Added**: Implemented core learning functionality with flashcard system using SRS and n+1 strategy.
- **Components**: Created Card component for translation practice, with random side presentation (English/Vietnamese).
- **SRS Algorithm**: Implemented Supermemo SM-2 algorithm for spaced repetition, adjusting intervals based on performance (quality 0-5).
- **Data Management**: Used localStorage for progress persistence, with mock card database.
- **n+1 Strategy**: Prioritize due reviews, then introduce new cards one at a time.
- **UI/UX**: Added BEM-styled card interface with input, feedback, and navigation.
- **Issue Encountered**: Detached HEAD state during git operations; resolved by pushing to specific branch name.
- **Commit**: "Implement flashcard learning system with SRS and n+1 strategy"

## Documentation Updates (2026-01-02)

- **Update**: Added Documentation section to AGENTS.md requiring maintenance of CHRONICLE.md.
- **Purpose**: Ensure ongoing record of development history for AI agents and team continuity.
- **Creation**: Initialized CHRONICLE.md with this entry and previous work summary.

## Mock Authentication Implementation (2026-01-02)

- **Feature Added**: Replaced Google OAuth with mocked authentication for development/testing.
- **Decision**: Auto-login as test user to simplify development workflow, avoiding real OAuth setup.
- **Implementation**: Modified auth.js to set mock user on init, removed Google API calls, updated logout.
- **Test User**: Hardcoded user with id 'test-user', email 'test@example.com', name 'Test User', placeholder avatar.
- **Rationale**: Enables quick testing of authenticated features without external dependencies.
- **PR Created**: Pull request #3 opened for review.
- **Commit**: "Mock Google login to auto login as test user"

## Ongoing Development Notes

- **Current State**: MVP with basic flashcard functionality, SRS scheduling, and local persistence.
- **Future Plans**: Expand card database, add user authentication, implement real backend integration, enhance UI with progress visualization.
- **Technical Debt**: Consider modularizing code into separate files for better maintainability, though current single-file approach suits CDN deployment.
- **Testing**: Manual testing of core functionality; consider adding unit tests for SRS logic in future iterations.