import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/playwright",
  fullyParallel: false, // tests depend on each other (state in DB)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "build/playwright-report" }], ["list"]],

  use: {
    baseURL: "http://localhost:5173/services/konsum",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start vite dev server (with konsum backend) before tests
  webServer: {
    command: "npm run start",
    url: "http://localhost:5173/services/konsum",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
