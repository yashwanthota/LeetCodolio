import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Kernel from "@onkernel/sdk";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dummyDataPath = path.join(__dirname, "dummy.json");
const dummyData = JSON.parse(fs.readFileSync(dummyDataPath, "utf8"));

const kernel = new Kernel({
  apiKey: process.env.KERNEL_API_KEY,
});

async function WebScrape(username) {
  let kernelBrowser;
  let browser;

  try {
    kernelBrowser = await kernel.browsers.create();

    browser = await puppeteer.connect({
      browserWSEndpoint: kernelBrowser.cdp_ws_url,
    });

    const page = await browser.newPage();
    await page.goto(`https://leetcode.com/${username}`, {
      waitUntil: "networkidle0",
    });
    await page.setViewport({ width: 1280, height: 800 });
    await page.waitForSelector(
      'span[class="text-[30px] font-semibold leading-[32px]"]',
      { timeout: 15000 }
    );

    const data = await page.evaluate(() => {
      const Attempted = document.querySelector(
        "span[class='text-[30px] font-semibold leading-[32px]']"
      );
      const MediumAttempted = document.querySelector(
        "div[class='flex h-full w-[90px] flex-none flex-col gap-2']"
      );
      const valueOfBadge = document
        .querySelector(
          "div[class='text-label-1 dark:text-dark-label-1 mt-1.5 text-2xl leading-[18px]']"
        )
        ?.textContent.trim();
      const YourRank = document.querySelector(
        "span[class='ttext-label-1 dark:text-dark-label-1 font-medium']"
      );
      const Days = document.querySelector(
        "span[class='font-medium text-label-2 dark:text-dark-label-2']"
      );
      const Skills = document.querySelectorAll(
        "span[class='inline-flex items-center px-2 whitespace-nowrap text-xs leading-6 rounded-full bg-fill-3 dark:bg-dark-fill-3 cursor-pointer transition-all hover:bg-fill-2 dark:hover:bg-dark-fill-2 text-label-2 dark:text-dark-label-2']"
      );
      const elements = document.querySelectorAll(
        "span.pl-1.text-xs.text-label-3.dark\\:text-dark-label-3"
      );
      const Streak = document.querySelector("div[class='space-x-1']");
      const RecentlySolved = document.querySelectorAll(
        "span[class='text-label-1 dark:text-dark-label-1 line-clamp-1 font-medium']"
      );

      let images = [];
      if (Number(valueOfBadge) !== 0) {
        const BadgesElements = document.querySelectorAll(
          "img[class='h-full w-full cursor-pointer object-contain']"
        );
        images = Array.from(BadgesElements).map((img) => img.src);
      }

      const extractedNumbers = [];
      elements.forEach((element) => {
        const textContent = element.textContent.trim();
        const numberOnly = textContent.match(/\d+/);
        if (numberOnly) {
          extractedNumbers.push(Number(numberOnly[0]));
        }
      });

      return {
        TotalAttempted: Attempted ? Attempted.textContent : "",
        SectionAttempted: MediumAttempted
          ? MediumAttempted.textContent.match(/\d+/g).map(Number)
          : [],
        ProfileRank: YourRank
          ? Number(YourRank.textContent.replace(/,/g, ""), 10)
          : 0,
        ActiveDays: Days ? Number(Days.textContent) : 0,
        NumberOfBadges: valueOfBadge ? Number(valueOfBadge) : 0,
        Badges: images,
        MaxStreak: Streak
          ? Streak.textContent.match(/\d+/g).map(Number)
          : null,
        Skills: Array.from(Skills).map((skill) => skill.textContent),
        elements: extractedNumbers,
        RecentlySolveds: Array.from(RecentlySolved).map(
          (ques) => ques.textContent
        ),
      };
    });

    return data;
  } catch (error) {
    console.log(`Error while Scrapping ${error.message}`);

    // fallback to dummy data
    if (username.toLowerCase().includes("demo") || username.toLowerCase().includes("user1")) {
      return dummyData.user1;
    } else if (username.toLowerCase().includes("user2")) {
      return dummyData.user2;
    } else {
      return dummyData.user1;
    }
  } finally {
    if (browser) await browser.close();
    if (kernelBrowser) await kernel.browsers.deleteByID(kernelBrowser.session_id);
  }
}

app.get("/scrape/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const data = await WebScrape(username);
    res.json(data);
  } catch (error) {
    console.log("Scraping error:", error.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.get("/dummy/:user", (req, res) => {
  const { user } = req.params;
  if (user === "user1") {
    res.json(dummyData.user1);
  } else if (user === "user2") {
    res.json(dummyData.user2);
  } else {
    res.json(dummyData.user1); 
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:5000`);
});
