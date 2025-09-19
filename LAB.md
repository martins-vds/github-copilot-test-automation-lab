# Hands-On Lab: UI Testing with VS Code, GitHub Copilot & Playwright (TypeScript)

Welcome to this self-paced lab! In this tutorial, you'll learn how to set up **Visual Studio Code**, **enable GitHub Copilot**, and **use Playwright (with the MCP server)** to compose and execute end-to-end UI tests in **TypeScript**.

We'll walk through writing tests for the Suncor company website (<https://www.suncor.com>) step-by-step – perfect for beginners to GitHub Copilot and Playwright.

Along the way, we'll cover setup, writing and running tests (with Copilot's help), and even an advanced peek at using the Playwright MCP server with Copilot's agent mode.

Finally, we include best practices and troubleshooting tips to ensure a smooth experience.

## 1. Prerequisites and Environment Setup

Before we dive into writing tests, make sure your environment is prepared with the following:

- **Node.js (v18 or higher):** Playwright (and the MCP server) require Node.js 18+. You can download Node from the official website. Verify the installation by running node -v in a terminal. (Example output should show 18.x or newer.)
- **npm:** Comes bundled with Node.js. Verify by running npm -v.
- **Visual Studio Code:** Our code editor of choice. Ensure you have the latest VS Code installed. This lab assumes you're using VS Code for all coding, terminal, and Copilot interactions. [How to Install Visual Studio Code]
- **GitHub Copilot Access:** You'll need a GitHub account with an active Copilot subscription or trial (Copilot is a paid AI coding assistant). If you haven't already, sign up for GitHub Copilot (there's a free trial available for new users).

**Install the GitHub Copilot extension in VS Code:** If you haven't installed it yet, open VS Code and go to the Extensions view (click the Extensions icon on the left or press `Ctrl+Shift+X`). Search for **"GitHub Copilot"** and click Install on the official extension. After installation, you'll be prompted to sign in to GitHub to authorize Copilot. Follow the login prompts and authorize VS Code with your GitHub account. Once signed in, VS Code will indicate that GitHub Copilot is active (you should see the Copilot icon at the bottom status bar).

> **Note:** By default, installing the Copilot extension in VS Code also installs the Copilot Chat extension (for the chat interface). In this lab we will primarily use Copilot's inline suggestions, but having Copilot Chat is useful for asking questions or using the new agent mode later.

**Verify Copilot is working:** Open a new file in VS Code (e.g., a simple JavaScript or TypeScript file) and start typing a comment like `// this function will return the sum of two numbers`. After a moment, GitHub Copilot should suggest a code completion (grayed text) based on the comment. If you see suggestions, Copilot is set up correctly! If not, ensure you're logged in and that your subscription is active.

## 2. Setting Up the Project and Installing Playwright

Next, let's set up a new project for our Playwright tests.

1. **Create a project folder:** Choose a directory on your machine and create a new folder (for example, suncor-playwright-lab). Open this folder in Visual Studio Code (File > Open Folder).

2. **Initialize a Node.js project:** In VS Code, open a terminal (**Ctrl+`**  or via Terminal > New Terminal). Run the following command to initialize a Node.js project with a default package.json file:

    ```bash
    npm init -y
    ```

    This will create a package.json with default settings (you can open it to confirm).

3. **Install Playwright (Test):** Now install Playwright's test runner as a development dependency. We'll use the TypeScript version of Playwright Test:

    ```bash
    npm install -D @playwright/test
    ```

    This downloads the Playwright framework.

4. **Install Playwright browsers:** Playwright automates real web browsers (Chromium, Firefox, WebKit). After installing the package, you need to download the browser binaries. Run:

    ```bash
    npx playwright install
    ```

    This will download browsers (Chromium, Firefox, WebKit) to be used by Playwright. You should see output indicating the installation of browsers. (By default, Playwright will install all three browser engines.)

    After these steps, your project folder should contain node_modules, a package-lock.json, and the package.json with @playwright/test listed as a dev dependency.

5. **(Optional) Configure TypeScript:** Playwright can run tests written in TypeScript out-of-the-box, so a TypeScript compiler config is not strictly required for our simple project. Playwright will transpile your .ts tests at runtime. However, if you want VS Code to fully recognize TypeScript, you can initialize a tsconfig:

    ```bash
    npx tsc --init
    ```

    This creates a default **tsconfig.json**. You might set "target": "ES2020" and "module": "commonjs" (or leave defaults). This step is optional — Playwright will run tests even if TypeScript isn't manually compiled.

Your environment is now ready with Node.js, VS Code, Copilot, and Playwright installed.

**Project structure so far:**

```text
suncor-playwright-lab/
├─ package.json
├─ package-lock.json
├─ tsconfig.json        (if you ran tsc --init)
└─ node_modules/        (contains Playwright and its deps)
```

## 3. Writing Your First Playwright Test (with Copilot's Help)

We will start by writing a simple test for Suncor's homepage. The test will load the homepage and verify that the page title contains "Suncor". Let's create our first test file and use GitHub Copilot to speed up the coding.

**Step 3.1: Create a test file**. In the project folder, create a new directory called **tests** (Playwright by default looks for tests in a `tests/` directory). Inside that, create a file named `suncor.spec.ts`. (The `.spec.ts` extension is conventional for test files.)

Open `suncor.spec.ts` in VS Code.

**Step 3.2: Import Playwright testing utilities**. Start by writing the import line for Playwright's test functions at the top of the file:

```typescript
import { test, expect } from '@playwright/test';
```

This brings in the test function to define a test case and the expect assertion library for verifications.

> *Tip*: As you started typing the import, Copilot may have auto-completed it for you. If not, simply type it out or accept the suggestion when it appears.

**Step 3.3: Write a test to verify the homepage title.** We will use the `test()` function to define a test. Type the following test stub in the file:

```typescript
test('Suncor homepage has the correct title', async ({ page }) => {
  // TODO: go to Suncor homepage and check title
});
```

A few notes:

The string `'Suncor homepage has the correct title'` is a human-readable name for the test.
The async function gets a `{ page }` object from Playwright, which represents a browser page (this is provided via Playwright's fixture).
Inside the function, we left a `// TODO` comment. We'll let Copilot help us fill this in.

Now, **use GitHub Copilot to complete the test steps**. Place your cursor after the `// TODO comment` (or start a new line below it) and **write a comment or prompt** describing what you want to do. For example:

```typescript
    // Navigate to Suncor homepage and verify the title contains "Suncor"
```

As soon as you finish typing this comment (and pause a moment), Copilot should suggest the code to perform that action. Accept the suggestion (press Tab or click it) if it looks correct. Copilot will likely produce something like:

```typescript
  await page.goto('https://www.suncor.com');
```

This is exactly what we need:

- `page.goto('https://www.suncor.com/')` instructs Playwright to open the browser and navigate to Suncor's homepage.
- `expect(page).toHaveTitle(/Suncor/)` asserts that the page's title contains the word "Suncor" (using a regex). This will automatically wait until the title is available.

Your first test is complete! For reference, the `suncor.spec.ts` file should now look like this:

```typescript
import { test, expect } from '@playwright/test';

test('Suncor homepage has the correct title', async ({ page }) => {
  await page.goto('https://www.suncor.com/');
  await expect(page).toHaveTitle(/Suncor/);
});
```

> If Copilot did not auto-generate the code, no worries – you can manually type the two lines above. They are straightforward and accomplish the required actions.

## 4. Writing a Second Test: Navigating the Site

For a more interactive test, we'll add another scenario: click the "Investors" link on the Suncor homepage and verify that the Investors page loads correctly (for example, by checking its title or content).

**Step 4.1: Add a new test case in the same file.** Below the first test, start writing a new `test(...)` block:

```typescript
test('Navigate to Investors page via homepage menu', async ({ page }) => {
  // TODO: go to homepage, click "Investors" link, and verify page
});
```

Again, use Copilot to fill in the steps. You might write a comment like `// click the Investors link in the navbar` and see what Copilot suggests. If Copilot doesn't automatically suggest, try typing the first action yourself and it may complete the rest. For instance:

- Start by going to the homepage (we know this from the previous test):

    ```typescript
    await page.goto('https://www.suncor.com/');
    ```

    Copilot may even suggest this line as you start typing `await page.goto('https://www.suncor.com/');`

- Next, we need to click the **Investors** link. There are a few ways in Playwright to select an element:
    - Clicking by visible text: `await page.click('text=Investors');`
    - Using Playwright's built-in role selectors (accessible name): `await page.getByRole('link', { name: 'Investors' }).click();`
    - Or using a CSS/XPath selector if we know one (not needed here since text is simplest).

    Let's use the text selector for simplicity. Type a line like:

    ```typescript
    await page.click('text=Investors');
    ```

    Copilot might auto-complete it once you type `'text=Investors'`. This will find any element with visible text "Investors" and click it. (This should click the Investors menu item on the homepage.)

- After clicking, Playwright should navigate to the Investors page. We want to verify we landed on the right page. An easy check is the page title or URL. According to Suncor's site, the Investors page title is likely "Investors | Suncor". We can assert the title contains "Investors":

    ```typescript
    await expect(page).toHaveTitle(/Investors/);
    ```

    Alternatively, we could check that the URL contains "investors":

    ```typescript
    await expect(page).toHaveURL(/investors/);
    ```

Putting it all together, the second test might look like this (with Copilot's help or manual typing):

```typescript
test('Navigate to Investors page via homepage menu', async ({ page }) => {
  await page.goto('https://www.suncor.com/');
  await page.click('text=Investors');
  await expect(page).toHaveTitle(/Investors/);
});
```

Now our `suncor.spec.ts` file has two tests. For clarity, here's the full content of the file:

```typescript
import { test, expect } from '@playwright/test';

test('Suncor homepage has the correct title', async ({ page }) => {
  await page.goto('https://www.suncor.com/');
  await expect(page).toHaveTitle(/Suncor/);
});

test('Navigate to Investors page via homepage menu', async ({ page }) => {
  await page.goto('https://www.suncor.com/');
  await page.click('text=Investors');
  await expect(page).toHaveTitle(/Investors/);
});
```

Each `test(...)` is independent – Playwright will launch a new browser context for each, so the second test isn't relying on the first one's side effects. We navigate to the homepage in both tests to be explicit and keep tests self-contained.

**A note on Copilot:** If you found Copilot's suggestions useful here, great! If it made an incorrect suggestion (for example, clicking a wrong selector), that's okay. Part of learning Copilot is guiding it with good comments or editing the code it gives you. In our case, we guided it with clear comments and got the needed code. When Copilot suggested the code, we still made sure it made sense (always review the AI-suggested code!).

Now, let's run our tests and see them in action.

## 5. Executing the Tests

We have two test cases ready. Playwright provides a test runner that will launch browsers, run tests, and report results. There are a couple of ways to run the tests:

**Option A: Run tests via the command line**. In your VS Code terminal, run:

```bash
npx playwright test
```

This command will find tests (it looks in the tests directory by default) and execute them. By default, it runs tests in headless mode (browsers not visible) on all three browsers (Chromium, Firefox, WebKit) if not specified otherwise.

You should see output in the terminal indicating that the tests are running and then the results. For example, it might show something like:

```text
Running 2 tests using 1 worker
[chromium] › ✔  suncor.spec.ts:3:1 › Suncor homepage has the correct title (PASSED)
[chromium] › ✔  suncor.spec.ts:9:1 › Navigate to Investors page via homepage menu (PASSED)
```

Followed by summary statistics (2 passed, 0 failed). Congratulations, both tests should pass! 🎉

If anything failed, read the error message to see what assertion failed or which step. Common issues could be a navigation timeout if the site was slow, or a selector failing if the "Investors" text wasn't found (ensure the spelling matches exactly). In our case, Suncor's homepage should have an "Investors" link, so it should work.

**Run in headed mode (optional):** It's often useful (and fun) to watch the browser as the tests run. To launch the browser visually, append the `--headed` flag:

```bash
npx playwright test --headed
```

Now Playwright will open a real browser window for each test, allowing you to see the interactions (you'll see it navigate to the site and click the link). This is great for debugging or learning what the test is doing.

**Option B: Run tests via VS Code UI (optional):** If you prefer, you can install the **Playwright Test for VSCode** extension, which provides a UI to run tests and see results inside VS Code. Alternatively, Playwright has a built-in UI mode: run:

```bash
npx playwright test --ui
```

This opens an interactive dashboard in your browser where you can run individual tests, see reports, etc. This is optional but can be handy as you develop more tests.

> When starting out, try running in --headed mode to watch the browser interactions. It helps you verify that clicks and navigations are happening as expected. Once things work, you can run headlessly for speed.

Assuming both tests passed, you have successfully written and executed UI tests with Playwright! 🙌 Now, let's take it a step further and see how GitHub Copilot and the **Playwright MCP server** can do even more for us.

## 6. (Advanced) Using the Playwright MCP Server with Copilot's Agent Mode

> This section is optional but highly recommended to understand the cutting-edge integration of Copilot with Playwright.

GitHub Copilot now has an **agent mode** that can use external tools via the Model Context Protocol (MCP). The **Playwright MCP server** is one such tool that allows Copilot to control a browser using Playwright. In simpler terms, this means Copilot can `perform browser actions` (click, navigate, etc.) as part of its reasoning, instead of just suggesting code. This can help generate tests or debug issues by actually exploring the website.

**6.1 Installing/Enabling the Playwright MCP server in VS Code:**

- In VS Code, open the Command Palette (`Ctrl+Shift+P`) and search for "**MCP: Add new server**" or "**Add MCP server**". If the GitHub Copilot extension is updated, you should find an option to install or add an MCP server configuration. Choose that, and when prompted, select the **Playwright MCP server** (some setups might list it by name). This process should auto-update your VS Code settings to include the Playwright MCP server configuration. Under the covers, it's equivalent to adding the following to your `mcp.json` settings:

    ```json
        "servers": {
            "microsoft/playwright-mcp": {
                "type": "stdio",
                "command": "npx",
                "args": [
                    "@playwright/mcp@latest"
                ]                
            }
        }
    ```

    (This tells VS Code to use npx to launch the latest Playwright MCP server. VS Code will handle starting/stopping it.)

    If not done automatically, you can manually add the above JSON to your VS Code settings (preferences → open settings JSON). Save the settings after adding.

- **Alternative method:** Newer versions of the Copilot extension have an **Agents** tab or a button like "Install Server" in the Copilot Chat pane. Clicking that and selecting Playwright will achieve the same result, updating your settings and installing the server tool.
- **Verify the MCP server is configured:** Run the command "`MCP: List Servers`" in the Command Palette. You should see "playwright" listed as an available server. You can select it and choose Start if it's not already running. (VS Code might auto-start the MCP server when needed, but it's good to know you can control it manually.)

**6.2 Using Copilot in Agent Mode:**

Now that the Playwright MCP server is set up, we can use Copilot's agent mode in VS Code to interact with the browser via natural language.

- Open the `GitHub Copilot Chat` view in VS Code (click the Copilot icon in the sidebar or use the shortcut if enabled). At the top of the chat panel, you'll see a mode selector (it might say "Ask" by default). Click it and switch to `Agent` mode. This mode allows Copilot to use tools – in our case, the Playwright MCP – to act on your requests. [Suncor]

- Next to the prompt input, there may be a "Tools" or "Plugins" button where you can manage which tools the agent can use. Ensure the Playwright tool (likely listed as "playwright" or specific actions like navigate, click, etc.) is `enabled`. You might not need to tweak this if it's the only server, but it's good to check. Copilot's agent can perform many actions exposed by Playwright MCP, such as `browser_navigate`, `browser_click`, `browser_type`, etc., based on what the server provides.

- **Give the agent a task:** Now you can simply **ask Copilot to perform web actions or even generate tests**. For example, try typing:

    ```text
    Navigate to https://www.suncor.com and list the text of the top navigation menu.
    ```

    When you send this, Copilot (in agent mode) will decide it needs to use the browser. It will likely respond by asking for permission to run a tool (for security, the first time it runs) – for instance, it might say it wants to execute a browser_navigate command to open the URL. Grant permission, and it will use Playwright to open the Suncor homepage in the background (headless). Then it might use another tool to read elements on the page (via the accessibility tree) and return the list of menu items (which could include "What we do", "Who we are", "Sustainability", etc., as seen on the site). This is Copilot actually controlling a browser session through Playwright MCP!

    Similarly, you could ask the agent to click something:

    ```text
    Click on the "Investors" link.
    ```

    It will again choose a `browser_click` action on an element named "Investors". After performing the click, you could ask:

    ```text
    What is the page title now?
    ```

    The agent might then fetch the title of the current page (which should now be the Investors page) and respond with it (for example, "Investors | Suncor") confirming the navigation succeeded.

- **Generating a test via the agent (optional):** One of the powerful uses of this setup is to have Copilot generate test code after exploring. You can try a prompt like:

    ```text
    Generate a Playwright test in TypeScript that navigates to suncor.com, clicks the "Investors" link, and verifies the title contains "Investors".
    ```

    Because we've essentially done this manually, Copilot agent might replay those steps: it will navigate, click, verify title using the MCP server (as above), then **produce a snippet of code** as the answer. In ideal cases, it will output a test function similar to what we wrote (using `await page.goto(...)`, etc.). You can then copy that code into your test file. This demonstrates how an AI agent can *autonomously generate a test by actually trying out the interactions first* – very useful for black-box testing scenarios.

Keep in mind that Copilot's agent is a relatively new feature. It may sometimes take different approaches or require carefully phrased prompts. The key is that the Playwright MCP server gives it the "hands" to manipulate the browser, and it can use that to help you write or debug tests in ways that static code suggestions alone cannot.

When you're done experimenting, you can stop the MCP server (via "MCP: List Servers" -> Stop) or simply close VS Code. The MCP server runs locally and only while VS Code is open/active.

## Summary

In this hands-on lab, we covered the full journey of setting up and using Visual Studio Code, GitHub Copilot, and Playwright (with the MCP server) for UI testing:

- We set up our environment with Node.js and VS Code, and installed GitHub Copilot to assist with coding.
- We initialized a project and installed Playwright, including its browsers.
- Using TypeScript, we wrote two simple Playwright tests for the Suncor website – one to check the homepage title, and one to navigate to the Investors page. GitHub Copilot helped generate the code based on our comments and prompts, making the process quicker and showcasing how AI can aid in writing test automation.
- We ran the tests using Playwright's runner, both headlessly and in headed mode to see the browser action, ensuring the tests behaved as expected.
- We then explored the advanced Copilot agent mode with the Playwright MCP server, which allows Copilot to not just suggest code but actually control a browser to perform tasks. This allowed us to ask Copilot in natural language to interact with the Suncor site and even generate test code automatically, demonstrating a glimpse of the future of AI-assisted testing.
- Finally, we went through best practices (like reviewing AI suggestions, writing independent tests, using Playwright's robust features) and troubleshooting tips for common issues (Copilot setup problems, Playwright installation issues, etc.), so you can resolve them and continue your testing smoothly.

You should now have a functional test project and a grasp of how to write Playwright tests with some AI help. From here, you can expand your test suite to cover more of the Suncor site or any other web application. Try testing form submissions, navigation flows, or use Copilot to generate a test for a different scenario on the site. Each time, you'll get more comfortable with the tools.

**Happy testing, and happy coding with Copilot!** The combination of Playwright's powerful automation and Copilot's AI suggestions can make writing tests faster and even fun. Good luck on your QA automation journey! 🚀
