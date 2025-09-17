# Playwright Test Automation Lab

## Scenario: Search for Garfield
This project contains a Playwright test that:
1. Navigates to the demo movies app
2. Stubs network calls the app makes on load (config, genres, popular movies)
3. Mocks the search API response for the query `Garfield`
4. Verifies that a movie titled `Garfield` appears in the rendered results

Because the public deployed site currently returns CORS errors (missing API key & headers), tests rely on network request interception to provide deterministic fixtures.

## Install & Run

```pwsh
npm install
npx playwright install --with-deps # optional locally; ensures browsers installed
npm test
```

List tests:
```pwsh
npm run test:list
```

Run headed UI mode:
```pwsh
npm run test:ui
```

## File Overview
- `playwright.config.ts` – Base configuration (Chromium only by default).
- `tests/search-garfield.spec.ts` – The Garfield search test with network stubbing.

## Adjusting Selectors
If the production application changes accessible names:
* Update the `getByRole('textbox', { name: /search input/i })` selector.
* Optionally add a `data-testid="search-input"` in the app and switch to `page.getByTestId('search-input')`.

## Enhancements To Consider
* Add additional tests for pagination, theme toggle, error handling recovery.
* Parameterize search term via test fixtures.
* Introduce fixtures folder for larger JSON payloads.

---
Generated automatically as part of an automation exercise.
