import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Fazil Khan — Robotics, Perception &amp; Autonomy<\/title>/i);
  assert.match(html, /Building robots that/);

  const heroStart = html.indexOf('<section class="hero"');
  const heroEnd = html.indexOf('<div class="focus-rail"', heroStart);
  assert.ok(heroStart >= 0 && heroEnd > heroStart, "expected rendered hero section");
  const hero = html.slice(heroStart, heroEnd);

  assert.match(hero, /Education credentials/);
  assert.match(hero, /Johns Hopkins University/);
  assert.match(hero, /M\.S\. Robotics/);
  assert.doesNotMatch(html, /Government College of Engineering|B\.Tech\./);
  assert.match(html, /brand-name[^>]*>Fazil</);
  assert.doesNotMatch(
    hero,
    /Baltimore|industrial vision AUROC|adaptive-controller success|terrain-model improvement/i,
  );
  assert.match(html, /01 \/ Projects/);
  assert.match(html, /VLM-guided mobile manipulation/);
  assert.match(html, /Position-based visual servoing/);
  assert.match(html, /100 Hz PBVS controller/);
  assert.match(html, /Orocos KDL/);
  assert.equal((html.match(/<video\b/g) ?? []).length, 5);
  assert.match(html, /Fazil-Cinematic-Hero-Reel-8s\.mp4/);
  assert.match(html, /mobile-manipulation-preview\.mp4/);
  assert.match(html, /rough-terrain-preview\.mp4/);
  assert.match(html, /semantic-slam-preview\.mp4/);
  assert.match(html, /visual-servoing-preview\.mp4/);
  assert.match(html, /https:\/\/github\.com\/dghiya\/TB4_Project/);
  assert.match(html, /https:\/\/github\.com\/fazz45\/jhu_rl_project/);
  assert.match(html, /https:\/\/github\.com\/fazz45\/cv-project-f24/);
  assert.match(html, /MRI-guided robotic needle steering/);
  assert.match(html, /02 \/ Experience &amp; trajectory/);
  assert.match(html, /View experience/);
  assert.doesNotMatch(html, /class="industry-proof"|At Reliance Industries/);
  assert.match(
    html,
    /https:\/\/drive\.google\.com\/file\/d\/1Xfcm2-whCf2Rt7ppVJ08lyZXPTzhVLE3\/view\?usp=sharing/,
  );
  assert.match(html, /Robot systems/);
  assert.match(html, /Perception &amp; deep learning/);
  assert.match(html, /Control &amp; planning/);
  assert.match(html, /Simulations/);
  assert.match(html, /Programming languages &amp; dev tools/);
  assert.match(html, /Stable-Baselines3/);
  assert.match(html, /Isaac Sim/);
  assert.match(html, /Bash/);
  assert.match(html, /colcon/);
  assert.match(html, /fazhara1@jh\.edu/);
  assert.doesNotMatch(
    html,
    /codex-preview|Your site is taking shape|react-loading-skeleton|href="#research"|case study/i,
  );
});

test("ships the essential static portfolio assets", async () => {
  const [page, layout, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    access(new URL("../public/fazil-lab-hero.png", import.meta.url)),
    access(new URL("../public/Fazil-Cinematic-Hero-Reel-8s.mp4", import.meta.url)),
    access(new URL("../public/Fazil-Khan-Resume.pdf", import.meta.url)),
    access(new URL("../public/project-videos/mobile-manipulation-preview.mp4", import.meta.url)),
    access(new URL("../public/project-videos/mobile-manipulation-poster.webp", import.meta.url)),
    access(new URL("../public/project-videos/rough-terrain-preview.mp4", import.meta.url)),
    access(new URL("../public/project-videos/rough-terrain-poster.webp", import.meta.url)),
    access(new URL("../public/project-videos/semantic-slam-preview.mp4", import.meta.url)),
    access(new URL("../public/project-videos/semantic-slam-poster.webp", import.meta.url)),
    access(new URL("../public/project-videos/visual-servoing-preview.mp4", import.meta.url)),
    access(new URL("../public/project-videos/visual-servoing-poster.webp", import.meta.url)),
  ]);

  assert.match(page, /fazil-lab-hero\.png/);
  assert.match(page, /Fazil-Cinematic-Hero-Reel-8s\.mp4/);
  assert.match(page, /className="hero-video"/);
  assert.match(page, /autoPlay/);
  assert.match(page, /playsInline/);
  assert.match(page, /1Xfcm2-whCf2Rt7ppVJ08lyZXPTzhVLE3/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /selectedExperience/);
  assert.match(page, /ProjectPreviewVideo/);
  assert.match(page, /IntersectionObserver/);
  const projectModal = page.slice(
    page.indexOf("{selectedProject &&"),
    page.indexOf("{selectedExperience &&"),
  );
  assert.doesNotMatch(projectModal, /repositoryUrl|GitHub repository/);
  assert.match(page, /className="hero-credentials/);
  assert.match(styles, /\.hero-credentials/);
  assert.match(styles, /\.project-preview-video/);
  assert.match(styles, /\.repository-link/);
  assert.match(styles, /\.visual-servoing/);
  assert.doesNotMatch(page, /Baltimore|[—–]/);
  assert.match(layout, /Fazil Khan — Robotics, Perception & Autonomy/);
});
