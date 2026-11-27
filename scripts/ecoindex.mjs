// Estime l'EcoIndex (https://www.ecoindex.fr) de chaque page à partir des rapports Lighthouse.
// Formule officielle : score = 100 - 5 × (3·q(DOM) + 2·q(requêtes) + q(poids)) / 6
// Les valeurs viennent de Lighthouse : c'est une estimation, pas une mesure certifiée.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const QUANTILES = {
  dom: [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601],
  req: [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920],
  size: [
    0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06,
    2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26,
  ],
};

const GRADES = [
  [80, "A"],
  [70, "B"],
  [55, "C"],
  [40, "D"],
  [25, "E"],
  [10, "F"],
  [-Infinity, "G"],
];

const MIN_GRADE = process.env.ECOINDEX_MIN_GRADE ?? "B";

function quantile(table, value) {
  for (let i = 1; i < table.length; i++) {
    if (value < table[i]) return i - 1 + (value - table[i - 1]) / (table[i] - table[i - 1]);
  }
  return table.length - 1;
}

function ecoindex(dom, requests, sizeKb) {
  const q = 3 * quantile(QUANTILES.dom, dom) + 2 * quantile(QUANTILES.req, requests) + quantile(QUANTILES.size, sizeKb);
  const score = Math.max(0, Math.min(100, 100 - (5 * q) / 6));
  const grade = GRADES.find(([min]) => score > min)[1];
  return { score: Math.round(score), grade };
}

const dir = process.argv[2] ?? ".lighthouseci";
const reports = readdirSync(dir).filter((f) => f.startsWith("lhr-") && f.endsWith(".json"));
if (reports.length === 0) {
  console.error(`Aucun rapport Lighthouse dans ${dir}`);
  process.exit(1);
}

let failed = false;
const rows = [];
for (const file of reports) {
  const lhr = JSON.parse(readFileSync(join(dir, file), "utf8"));
  // "dom-size" a été remplacé par "dom-size-insight" dans les versions récentes de Lighthouse.
  const dom = (lhr.audits["dom-size-insight"] ?? lhr.audits["dom-size"]).numericValue;
  const requests = lhr.audits["network-requests"].details.items.length;
  const sizeKb = lhr.audits["total-byte-weight"].numericValue / 1024;
  const { score, grade } = ecoindex(dom, requests, sizeKb);
  if (grade > MIN_GRADE) failed = true;
  rows.push({
    page: lhr.finalDisplayedUrl,
    ecoindex: score,
    note: grade,
    dom,
    requêtes: requests,
    "poids (ko)": Math.round(sizeKb),
  });
}

console.table(rows);
if (failed) {
  console.error(`Au moins une page est sous la note EcoIndex ${MIN_GRADE}.`);
  process.exit(1);
}
