import { test, expect } from '@playwright/test';

// Utility helpers to create minimal API responses the app expects.
function popularMoviesPayload() {
  return { results: [ { id: 101, title: 'Some Other Movie', poster_path: '/x.jpg', vote_average: 6.2 } ] };
}

function configPayload() {
  return { images: { base_url: 'https://image.tmdb.org/t/p/', secure_base_url: 'https://image.tmdb.org/t/p/' }, change_keys: [] };
}

function genresPayload() {
  return { genres: [ { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' } ] };
}

function garfieldSearchPayload() {
  return { results: [ { id: 200_001, title: 'Garfield', overview: 'Lazy orange cat.', poster_path: '/garfield.jpg', vote_average: 7.1 } ] };
}

test.describe('Movie search', () => {
  test('searching for Garfield shows Garfield in results', async ({ page }) => {
    // Intercept configuration & bootstrap requests BEFORE navigation to avoid error redirect.
    await page.route('**/3/configuration', route => route.fulfill({ json: configPayload() }));
    await page.route('**/3/genre/movie/list', route => route.fulfill({ json: genresPayload() }));
    await page.route(/.*\/3\/movie\/popular.*/i, route => route.fulfill({ json: popularMoviesPayload() }));

    // Intercept search endpoint only when query includes Garfield.
    await page.route('**/3/search/movie*', async route => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('query') || '';
      if (/garfield/i.test(query)) {
        await route.fulfill({ json: garfieldSearchPayload() });
      } else {
        await route.fulfill({ json: { results: [] } });
      }
    });

    await page.goto('/');

    // Locate search input (accessible name observed earlier as 'Search Input').
    const searchBox = page.getByRole('textbox', { name: /search input/i });
    await expect(searchBox).toBeVisible();
    await searchBox.fill('Garfield');
    await searchBox.press('Enter');

    // Assertion: Garfield card appears. Using text match; refine selector if app adds specific roles.
    await expect(page.getByText('Garfield', { exact: true })).toBeVisible();
  });
});
