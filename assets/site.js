/* Shared workshop shell script for the Azure Service Bus workshop. */

import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const STORAGE_KEY = "sb-runtime-theme";
const COPYRIGHT_TEXT = "Created by Walid Amro (CSA at Microsoft).";

/* ---------------------------------------------------------------------------------
   Navigation model. hrefs are relative to the site root; site.js prefixes them with
   the page's data-root so links resolve from any folder depth.
   --------------------------------------------------------------------------------- */
const TOPICS = [
  { key: "module-1", label: "1. Introduction", href: "introduction.html", dot: "dot-blue" },
  { key: "architecture", label: "2. Architecture Design", href: "architecture-design.html", dot: "dot-red" },
  { key: "module-2", label: "3. SKUs and Tiers", href: "skus-and-tiers.html", dot: "dot-green" },
  { key: "module-3", label: "4. Deploy via Portal", href: "deploy-portal.html", dot: "dot-orange" },
  { key: "module-4", label: "5. Deploy with CLI and Bicep", href: "deploy-cli-bicep.html", dot: "dot-purple" },
  {
    key: "module-5", label: "6. Working with Queues", href: "queues.html", dot: "dot-blue",
    children: [
      { key: "queue-dotnet", label: ".NET", href: "languages/dotnet/queue-processing.html", dot: "dot-purple" },
      { key: "queue-java", label: "Java", href: "languages/java/queue-processing.html", dot: "dot-orange" },
      { key: "queue-javascript", label: "JavaScript / TypeScript", href: "languages/javascript/queue-processing.html", dot: "dot-green" },
      { key: "queue-python", label: "Python", href: "languages/python/queue-processing.html", dot: "dot-blue" }
    ]
  },
  {
    key: "module-6", label: "7. Topics and Subscriptions", href: "topics-subscriptions.html", dot: "dot-green",
    children: [
      { key: "topic-dotnet", label: ".NET", href: "languages/dotnet/topic-processing.html", dot: "dot-purple" },
      { key: "topic-java", label: "Java", href: "languages/java/topic-processing.html", dot: "dot-orange" },
      { key: "topic-javascript", label: "JavaScript / TypeScript", href: "languages/javascript/topic-processing.html", dot: "dot-green" },
      { key: "topic-python", label: "Python", href: "languages/python/topic-processing.html", dot: "dot-blue" }
    ]
  },
  { key: "module-7", label: "8. Advanced Features", href: "advanced-features.html", dot: "dot-orange" },
  { key: "module-8", label: "9. Security and Monitoring", href: "security-monitoring.html", dot: "dot-red" },
  { key: "module-9", label: "10. Administration and Operations", href: "administration.html", dot: "dot-blue" },
  { key: "module-10", label: "11. Summary", href: "summary.html", dot: "dot-purple" }
];

/* Flatten a topic list (parents + their children) for active-state detection. */
function flattenTopics(items) {
  return items.flatMap((it) => (it.children ? [it, ...it.children] : [it]));
}

const LANGUAGES = [
  {
    key: "dotnet", label: ".NET", href: "languages/dotnet.html", dot: "dot-purple",
    children: [
      { key: "dotnet-lab-1", label: "Lab 1 - Queue case study", href: "languages/dotnet/lab-1.html", dot: "dot-purple" },
      { key: "dotnet-lab-2", label: "Lab 2 - Topic fan-out", href: "languages/dotnet/lab-2.html", dot: "dot-purple" },
      { key: "dotnet-lab-3", label: "Lab 3 - Ordered sessions", href: "languages/dotnet/lab-3.html", dot: "dot-purple" },
      { key: "dotnet-lab-4", label: "Lab 4 - DLQ recovery", href: "languages/dotnet/lab-4.html", dot: "dot-purple" },
      { key: "dotnet-lab-5", label: "Lab 5 - Serverless integration", href: "languages/dotnet/lab-5.html", dot: "dot-purple" }
    ]
  },
  {
    key: "java", label: "Java", href: "languages/java.html", dot: "dot-orange",
    children: [
      { key: "java-lab-1", label: "Lab 1 - Queue case study", href: "languages/java/lab-1.html", dot: "dot-orange" },
      { key: "java-lab-2", label: "Lab 2 - Topic fan-out", href: "languages/java/lab-2.html", dot: "dot-orange" },
      { key: "java-lab-3", label: "Lab 3 - Ordered sessions", href: "languages/java/lab-3.html", dot: "dot-orange" },
      { key: "java-lab-4", label: "Lab 4 - DLQ recovery", href: "languages/java/lab-4.html", dot: "dot-orange" },
      { key: "java-lab-5", label: "Lab 5 - Serverless integration", href: "languages/java/lab-5.html", dot: "dot-orange" }
    ]
  },
  {
    key: "javascript", label: "JavaScript / TypeScript", href: "languages/javascript.html", dot: "dot-green",
    children: [
      { key: "javascript-lab-1", label: "Lab 1 - Queue case study", href: "languages/javascript/lab-1.html", dot: "dot-green" },
      { key: "javascript-lab-2", label: "Lab 2 - Topic fan-out", href: "languages/javascript/lab-2.html", dot: "dot-green" },
      { key: "javascript-lab-3", label: "Lab 3 - Ordered sessions", href: "languages/javascript/lab-3.html", dot: "dot-green" },
      { key: "javascript-lab-4", label: "Lab 4 - DLQ recovery", href: "languages/javascript/lab-4.html", dot: "dot-green" },
      { key: "javascript-lab-5", label: "Lab 5 - Serverless integration", href: "languages/javascript/lab-5.html", dot: "dot-green" }
    ]
  },
  {
    key: "python", label: "Python", href: "languages/python.html", dot: "dot-blue",
    children: [
      { key: "python-lab-1", label: "Lab 1 - Queue case study", href: "languages/python/lab-1.html", dot: "dot-blue" },
      { key: "python-lab-2", label: "Lab 2 - Topic fan-out", href: "languages/python/lab-2.html", dot: "dot-blue" },
      { key: "python-lab-3", label: "Lab 3 - Ordered sessions", href: "languages/python/lab-3.html", dot: "dot-blue" },
      { key: "python-lab-4", label: "Lab 4 - DLQ recovery", href: "languages/python/lab-4.html", dot: "dot-blue" },
      { key: "python-lab-5", label: "Lab 5 - Serverless integration", href: "languages/python/lab-5.html", dot: "dot-blue" }
    ]
  }
];

const MOON_SUN = `
  <span class="theme-icon theme-icon-moon" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5z"></path><path d="M16.5 5.2v2.1"></path><path d="M15.45 6.25h2.1"></path></svg>
  </span>
  <span class="theme-icon theme-icon-sun" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.8v2.1"></path><path d="M12 19.1v2.1"></path><path d="M2.8 12h2.1"></path><path d="M19.1 12h2.1"></path><path d="M5.5 5.5l1.5 1.5"></path><path d="M17 17l1.5 1.5"></path><path d="M17 7l1.5-1.5"></path><path d="M5.5 18.5L7 17"></path></svg>
  </span>`;

function rootPrefix() {
  const root = document.body.getAttribute("data-root") || ".";
  return root.replace(/\/+$/, "");
}

function url(href) {
  return `${rootPrefix()}/${href}`;
}

function menuMarkup(items, active, options = {}) {
  const includeChildren = options.includeChildren !== false;
  const includeChildrenKeys = options.includeChildrenKeys || null;
  return items
    .map((it) => {
      const parentActive = it.children && it.children.some((c) => c.key === active);
      const cls = (it.key === active || parentActive) ? "is-active" : "";
      let html = `<a class="${cls}" href="${url(it.href)}"><span class="nav-dot ${it.dot}"></span>${it.label}</a>`;
      const showChildren = includeChildren && it.children && it.children.length
        && (!includeChildrenKeys || includeChildrenKeys.includes(it.key));
      if (showChildren) {
        const subActive = it.children.some((c) => c.key === active);
        const childHtml = it.children
          .map((c) => {
            const ccls = "nav-subitem" + (c.key === active ? " is-active" : "");
            return `<a class="${ccls}" href="${url(c.href)}"><span class="nav-dot ${c.dot}"></span>${c.label}</a>`;
          })
          .join("");
        html += `<div class="nav-submenu${subActive ? " is-active" : ""}">${childHtml}</div>`;
      }
      return html;
    })
    .join("");
}

function buildNav() {
  const active = document.body.getAttribute("data-active") || "";
  const topicsActive = flattenTopics(TOPICS).some((t) => t.key === active);
  const langActive = LANGUAGES.some((l) => l.key === active);

  const nav = document.createElement("header");
  nav.className = "site-nav";
  nav.innerHTML = `
    <a class="brand" href="${url("index.html")}">
      <span class="brand-mark" aria-hidden="true">
        <img src="${url("images/azure/10836-icon-service-Azure-Service-Bus.svg")}" alt="" loading="eager" decoding="async" />
      </span>
      <span class="brand-text"><strong>Azure Service Bus</strong><small>Developer Workshop</small></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="${url("index.html")}" class="${active === "home" ? "is-active" : ""}">Home</a>
      <details class="nav-dropdown ${topicsActive ? "is-active" : ""}">
        <summary>Modules</summary>
        <div class="nav-menu">${menuMarkup(TOPICS, active, { includeChildrenKeys: ["module-5", "module-6"] })}</div>
      </details>
      <details class="nav-dropdown ${langActive ? "is-active" : ""}">
        <summary>Languages</summary>
        <div class="nav-menu">${menuMarkup(LANGUAGES, active, { includeChildrenKeys: [active] })}</div>
      </details>
      <a href="${url("trainer/index.html")}" class="${active === "trainer" ? "is-active" : ""}">Trainer</a>
      <button id="theme-toggle" class="nav-toggle" type="button" aria-pressed="false" aria-label="Switch theme" title="Switch theme">
        ${MOON_SUN}
        <span id="theme-toggle-text" class="sr-only">Switch theme</span>
      </button>
    </nav>`;
  document.body.insertBefore(nav, document.body.firstChild);

  // Close any open dropdown when clicking elsewhere or pressing Escape.
  document.addEventListener("click", (e) => {
    nav.querySelectorAll("details.nav-dropdown[open]").forEach((d) => {
      if (!d.contains(e.target)) d.removeAttribute("open");
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") nav.querySelectorAll("details.nav-dropdown[open]").forEach((d) => d.removeAttribute("open"));
  });
}

function buildFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <span>&copy; <span id="footer-year"></span> ${COPYRIGHT_TEXT}</span>
      <span class="footer-links">
        <a href="${url("index.html")}">Home</a>
        <a href="${url("queues.html")}">Queues</a>
        <a href="${url("index.html#languages")}">Language labs</a>
        <a href="${url("topics-subscriptions.html")}">Topics</a>
        <a href="${url("trainer/index.html")}">Trainer Hub</a>
        <a href="https://learn.microsoft.com/azure/service-bus-messaging/" target="_blank" rel="noopener">Microsoft Learn &#8599;</a>
      </span>
    </div>`;
  document.body.appendChild(footer);
  const yr = footer.querySelector("#footer-year");
  if (yr) yr.textContent = String(new Date().getFullYear());
}

/* ---------------------------------------------------------------------------------
   Theme toggle
   --------------------------------------------------------------------------------- */
function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme, persist) {
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  if (persist) localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");

  const toggle = document.getElementById("theme-toggle");
  const toggleText = document.getElementById("theme-toggle-text");
  const next = isDark ? "Switch to light mode" : "Switch to dark mode";
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", next);
    toggle.setAttribute("title", next);
  }
  if (toggleText) toggleText.textContent = next;
}

function wireToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  applyTheme(getPreferredTheme(), false);
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark", true);
  });
  // Follow OS changes only when the user hasn't picked an explicit theme.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? "dark" : "light", false);
  });
}

/* ---------------------------------------------------------------------------------
   Enhance TOC with Page Title
   This ensures users always see which page they're on when scrolling
   --------------------------------------------------------------------------------- */
function enhanceTocWithPageTitle() {
  const toc = document.querySelector(".toc");
  const pageTitle = document.querySelector("h1");

  if (!toc || !pageTitle) return;

  // Create a page title element at the top of the TOC
  const pageIndicator = document.createElement("div");
  pageIndicator.className = "toc-page-title";
  pageIndicator.innerHTML = `<p class="toc-page-label"><strong>${pageTitle.textContent.trim()}</strong></p>`;

  // Insert before the h3 "On This Page" heading
  const tocHeading = toc.querySelector("h3");
  if (tocHeading) {
    toc.insertBefore(pageIndicator, tocHeading);
  } else {
    toc.insertBefore(pageIndicator, toc.firstChild);
  }
}

/* ---------------------------------------------------------------------------------
   Code block copy buttons
   --------------------------------------------------------------------------------- */
function enhanceCodeBlocks() {
  const blocks = document.querySelectorAll("pre.code");
  blocks.forEach((pre) => {
    if (pre.closest(".code-block")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement("button");
    button.className = "code-copy-btn";
    button.type = "button";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      const code = pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        button.classList.add("copied");
      } catch {
        button.textContent = "Copy failed";
      }

      window.setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("copied");
      }, 1500);
    });

    wrapper.appendChild(button);
  });
}

/* ---------------------------------------------------------------------------------
   Mermaid
   --------------------------------------------------------------------------------- */
function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: {
      primaryColor: "#e6f2fb",
      primaryTextColor: "#0f1722",
      primaryBorderColor: "#0078d4",
      lineColor: "#0078d4",
      secondaryColor: "#fff3e3",
      tertiaryColor: "#e7f5e7",
      actorBorder: "#0078d4",
      actorBkg: "#e6f2fb",
      actorTextColor: "#0f1722",
      signalColor: "#0078d4",
      signalTextColor: "#0f1722",
      noteBkgColor: "#fff3e3",
      noteTextColor: "#4a2a0a",
      noteBorderColor: "#ff8c00"
    },
    flowchart: {
      curve: "basis",
      fontSize: 12,
      htmlLabels: true
    }
  });
  const nodes = document.querySelectorAll("pre.mermaid, .mermaid");
  if (nodes.length) mermaid.run({ nodes });
}

/* ---------------------------------------------------------------------------------
   Prism syntax highlighting (opt-in via pre.code[data-lang])
   --------------------------------------------------------------------------------- */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function loadStyle(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function normalizeCodeIndent(raw) {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  if (lines.length < 2) return raw;

  // Common case in HTML: first line starts at column 0 and following lines inherit page indentation.
  const firstIndent = (lines[0].match(/^[\t ]*/) || [""])[0].length;
  const candidateLines = lines.slice(1).filter((line) => line.trim().length > 0);
  if (!candidateLines.length) return raw;

  const minIndent = Math.min(
    ...candidateLines.map((line) => (line.match(/^[\t ]*/) || [""])[0].length)
  );

  if (firstIndent === 0 && minIndent > 0) {
    const normalized = [lines[0], ...lines.slice(1).map((line) => line.slice(Math.min(minIndent, line.length)))];
    return normalized.join("\n");
  }

  return raw;
}

async function initPrismHighlighting() {
  const blocks = Array.from(document.querySelectorAll("pre.code[data-lang]"));
  if (!blocks.length) return;

  const codes = [];
  blocks.forEach((pre) => {
    const lang = (pre.getAttribute("data-lang") || "").trim().toLowerCase();
    if (!lang) return;

    let code = pre.querySelector("code");
    if (!code) {
      code = document.createElement("code");
      code.textContent = normalizeCodeIndent(pre.textContent);
      pre.textContent = "";
      pre.appendChild(code);
    } else {
      code.textContent = normalizeCodeIndent(code.textContent);
    }

    pre.classList.add(`language-${lang}`);
    code.classList.add(`language-${lang}`);
    codes.push(code);
  });

  if (!codes.length) return;

  window.Prism = window.Prism || {};
  window.Prism.manual = true;

  loadStyle("https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css");

  try {
    await loadScript("https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-clike.min.js");
    await Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-csharp.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-json.min.js")
    ]);

    if (window.Prism && typeof window.Prism.highlightElement === "function") {
      codes.forEach((code) => window.Prism.highlightElement(code));
    }
  } catch {
    // Keep plain code blocks if syntax-highlighting assets fail to load.
  }
}

/* ---------------------------------------------------------------------------------
   Service Bus cost calculator (East US retail estimate; browser memory only)
   --------------------------------------------------------------------------------- */
function initServiceBusCostCalculator() {
  const form = document.getElementById("service-bus-cost-calculator");
  if (!form) return;

  const rates = {
    basicOperationsPerMillion: 0.05,
    standardMonthlyBase: 0.013441 * 730,
    premiumMonthlyPerMessagingUnit: 0.9275 * 730,
    premiumGeoReplicationPerGb: 0.09
  };
  const tierInput = form.querySelector("#calc-tier");
  const operationsInput = form.querySelector("#calc-operations");
  const messagingUnitsInput = form.querySelector("#calc-messaging-units");
  const geoTransferInput = form.querySelector("#calc-geo-transfer");
  const operationsField = form.querySelector('[data-calc-field="operations"]');
  const messagingUnitsField = form.querySelector('[data-calc-field="messaging-units"]');
  const geoTransferField = form.querySelector('[data-calc-field="geo-transfer"]');
  const totalOutput = form.querySelector("#calc-total");
  const planName = form.querySelector("#calc-plan-name");
  const breakdown = form.querySelector("#calc-breakdown");
  const resultNote = form.querySelector("#calc-result-note");
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

  function nonNegativeValue(input) {
    const value = Number.parseFloat(input.value);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function addRow(rows, charge, calculation, cost) {
    rows.push(`<tr><td>${charge}</td><td>${calculation}</td><td>${currency.format(cost)}</td></tr>`);
  }

  function calculateStandardOperations(operations, rows) {
    let cost = 0;
    const firstBand = Math.min(Math.max(operations - 13, 0), 87);
    const secondBand = Math.min(Math.max(operations - 100, 0), 2400);
    const thirdBand = Math.max(operations - 2500, 0);

    if (firstBand > 0) {
      const bandCost = firstBand * 0.80;
      cost += bandCost;
      addRow(rows, "Operations: 13M-100M", `${number.format(firstBand)}M x $0.80`, bandCost);
    }
    if (secondBand > 0) {
      const bandCost = secondBand * 0.50;
      cost += bandCost;
      addRow(rows, "Operations: 100M-2,500M", `${number.format(secondBand)}M x $0.50`, bandCost);
    }
    if (thirdBand > 0) {
      const bandCost = thirdBand * 0.20;
      cost += bandCost;
      addRow(rows, "Operations: over 2,500M", `${number.format(thirdBand)}M x $0.20`, bandCost);
    }
    return cost;
  }

  function updateEstimate() {
    const tier = tierInput.value;
    const operations = nonNegativeValue(operationsInput);
    const messagingUnits = nonNegativeValue(messagingUnitsInput);
    const geoTransfer = nonNegativeValue(geoTransferInput);
    const rows = [];
    let total = 0;

    operationsField.hidden = tier === "premium";
    messagingUnitsField.hidden = tier !== "premium";
    geoTransferField.hidden = tier !== "premium";

    if (tier === "basic") {
      total = operations * rates.basicOperationsPerMillion;
      addRow(rows, "Messaging operations", `${number.format(operations)}M x $0.05`, total);
      planName.textContent = "Basic";
      resultNote.textContent = "Basic has no namespace base charge. Each operation is billed using Azure's operation-metering rules.";
    } else if (tier === "standard") {
      total = rates.standardMonthlyBase;
      addRow(rows, "Namespace base charge", "One namespace x $9.81/month", rates.standardMonthlyBase);
      total += calculateStandardOperations(operations, rows);
      if (operations <= 13) {
        addRow(rows, "Messaging operations", `${number.format(operations)}M of 13M included`, 0);
      }
      planName.textContent = "Standard";
      resultNote.textContent = "The first 13 million Standard operations are included. Brokered connection overages are not included in this estimate.";
    } else {
      const messagingUnitCost = messagingUnits * rates.premiumMonthlyPerMessagingUnit;
      const geoTransferCost = geoTransfer * rates.premiumGeoReplicationPerGb;
      total = messagingUnitCost + geoTransferCost;
      addRow(rows, "Messaging units", `${number.format(messagingUnits)} x $677.08/month`, messagingUnitCost);
      if (geoTransfer > 0) {
        addRow(rows, "Geo-Replication transfer", `${number.format(geoTransfer)} GB x $0.09`, geoTransferCost);
      }
      planName.textContent = "Premium";
      resultNote.textContent = "Premium operations and brokered connections have no separate charge. Geo-Replication uses the Zone 1 transfer rate.";
    }

    totalOutput.value = currency.format(total);
    totalOutput.textContent = currency.format(total);
    breakdown.innerHTML = rows.join("");
  }

  form.addEventListener("input", updateEstimate);
  form.addEventListener("reset", () => window.setTimeout(updateEstimate, 0));
  updateEstimate();
}

/* ---------------------------------------------------------------------------------
   Boot
   --------------------------------------------------------------------------------- */
function boot() {
  buildNav();
  buildFooter();
  wireToggle();
  enhanceTocWithPageTitle();
  enhanceCodeBlocks();
  initPrismHighlighting();
  initMermaid();
  initServiceBusCostCalculator();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
