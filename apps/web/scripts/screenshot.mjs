import puppeteer from "puppeteer-core";

const url = process.env.URL ?? "http://localhost:4321";
const outDir = process.env.OUT ?? "/tmp/shots";
const mobile = process.env.MOBILE === "1";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "new",
  args: [
    "--no-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
  ],
});

const page = await browser.newPage();
await page.setViewport(
  mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2 }
    : { width: 1440, height: 900, deviceScaleFactor: 1 },
);

page.on("console", (msg) => {
  const type = msg.type();
  if (type === "error" || type === "warning") {
    console.log(`[console.${type}]`, msg.text());
  }
});
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4000));

const total = await page.evaluate(() => document.body.scrollHeight);
const vh = mobile ? 844 : 900;
const steps = Math.ceil(total / vh);
console.log(`total height ${total}px, ${steps} steps`);

for (let i = 0; i < steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * vh);
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({
    path: `${outDir}/${mobile ? "m" : "d"}-${String(i).padStart(2, "0")}.png`,
  });
}

await browser.close();
