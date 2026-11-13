// Builds court-style documents from a draft and the form details, and exports them
// as Word (.docx) or a print-ready page (Save as PDF). Filing-package pages are built
// from the form values directly, not by the AI, so names and numbers stay exact.

const WATERMARK = "PRELIMINARY DRAFT";

const value = (form, name, fallback = "____________") =>
  (form[name] || "").trim() || fallback;

const lines = (text) =>
  (text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

// ---------- draft text to blocks ----------

function isHeading(line) {
  const letters = line.replace(/[^A-Za-z]/g, "");
  return (
    line.length <= 120 &&
    letters.length >= 3 &&
    letters === letters.toUpperCase() &&
    !/^\d+[.)]/.test(line)
  );
}

export function parseDraft(text) {
  const blocks = [];
  for (const raw of (text || "").split(/\r?\n/)) {
    const line = raw
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/^#{1,6}\s+/, "")
      .replace(/^[-*•]\s+/, "")
      .trim();
    if (!line) {
      blocks.push({ type: "space" });
    } else if (/^(versus|vs\.?|v\.)$/i.test(line)) {
      blocks.push({ type: "para", text: "VERSUS", align: "center", bold: true });
    } else if (isHeading(line)) {
      blocks.push({ type: "para", text: line, align: "center", bold: true });
    } else {
      blocks.push({ type: "para", text: line, align: "justify" });
    }
  }
  return blocks;
}

// ---------- shared filing-package pieces ----------

function partyBlock(form, prefix, label) {
  const name = value(form, `${prefix}Name`);
  const relation = (form[`${prefix}Relation`] || "").trim();
  const age = (form[`${prefix}Age`] || "").trim();
  const occupation = (form[`${prefix}Occupation`] || "").trim();
  const address = value(form, `${prefix}Address`);
  const details = [
    relation && `S/o, D/o or W/o ${relation}`,
    age && `aged about ${age} years`,
    occupation,
    `R/o ${address}`,
  ].filter(Boolean);
  return [
    { type: "para", text: `${name},`, bold: true },
    { type: "para", text: `${details.join(", ")}.` },
    { type: "para", text: `...${label}`, align: "right", bold: true },
  ];
}

function courtHeading(form, courtField = "courtName") {
  return [
    { type: "para", text: value(form, courtField).toUpperCase(), align: "center", bold: true },
    { type: "para", text: "CASE NO. ________ OF 20____", align: "center" },
    { type: "space" },
  ];
}

function annexures(form, prefix) {
  return lines(form.annexures).map((item, index) => ({
    mark: `Annexure ${prefix}-${index + 1}`,
    item,
  }));
}

function signatureBlock(form, role) {
  return [
    { type: "space" },
    { type: "para", text: `Place: ${value(form, "place")}` },
    { type: "para", text: `Date: ${value(form, "documentDate")}` },
    { type: "space" },
    { type: "para", text: role, align: "right", bold: true },
    { type: "para", text: "Through Counsel", align: "right" },
    { type: "para", text: `${value(form, "advocateName", "[Advocate name]")}`, align: "right" },
    { type: "para", text: `Enrolment No. ${value(form, "advocateEnrolment", "[____]")}`, align: "right" },
  ];
}

function indexPage(form, title, mainDocTitle, annex) {
  const rows = [
    ["1.", "Memo of Parties"],
    ["2.", mainDocTitle],
    ["3.", "Supporting affidavit"],
    ["4.", "List of documents"],
    ...annex.map((a, i) => [`${5 + i}.`, `${a.mark}: ${a.item}`]),
  ];
  return {
    title,
    blocks: [
      ...courtHeading(form),
      { type: "para", text: "INDEX", align: "center", bold: true },
      { type: "table", header: ["S. No.", "Particulars", "Pages"], rows: rows.map((r) => [...r, "____"]) },
      ...signatureBlock(form, "Filed by"),
    ],
  };
}

function memoOfParties(form, title, firstPrefix, firstLabel, second) {
  return {
    title,
    blocks: [
      ...courtHeading(form),
      { type: "para", text: "MEMO OF PARTIES", align: "center", bold: true },
      { type: "space" },
      ...partyBlock(form, firstPrefix, firstLabel),
      { type: "space" },
      { type: "para", text: "VERSUS", align: "center", bold: true },
      { type: "space" },
      ...second,
      ...signatureBlock(form, "Filed by"),
    ],
  };
}

function listOfDocuments(form, annex) {
  const rows = annex.length
    ? annex.map((a, i) => [`${i + 1}.`, a.mark, a.item])
    : [["1.", "Annexure __", "____________"]];
  return {
    title: "List of documents",
    blocks: [
      ...courtHeading(form),
      { type: "para", text: "LIST OF DOCUMENTS", align: "center", bold: true },
      { type: "table", header: ["S. No.", "Annexure", "Description of document"], rows },
      ...signatureBlock(form, "Filed by"),
    ],
  };
}

function supportingAffidavit(form, prefix, role, docName) {
  const name = value(form, `${prefix}Name`);
  const relation = value(form, `${prefix}Relation`);
  const age = value(form, `${prefix}Age`, "__");
  const address = value(form, `${prefix}Address`);
  return {
    title: "Supporting affidavit",
    blocks: [
      ...courtHeading(form),
      { type: "para", text: "AFFIDAVIT", align: "center", bold: true },
      {
        type: "para",
        align: "justify",
        text: `I, ${name}, S/o, D/o or W/o ${relation}, aged about ${age} years, R/o ${address}, do hereby solemnly affirm and state as under:`,
      },
      { type: "para", align: "justify", text: `1. That I am the ${role} in the above matter and am well conversant with the facts of the case. I am competent to swear this affidavit.` },
      { type: "para", align: "justify", text: `2. That the accompanying ${docName} has been drafted under my instructions. Its contents have been read over and explained to me, and are true and correct to my knowledge.` },
      { type: "para", align: "justify", text: "3. That the annexures filed with it are true copies of their respective originals." },
      { type: "space" },
      { type: "para", text: "DEPONENT", align: "right", bold: true },
      { type: "space" },
      { type: "para", text: "VERIFICATION", align: "center", bold: true },
      {
        type: "para",
        align: "justify",
        text: `Verified at ${value(form, "place")} on this ____ day of ________ 20____ that the contents of the above affidavit are true and correct to my knowledge, no part of it is false and nothing material has been concealed therefrom.`,
      },
      { type: "space" },
      { type: "para", text: "DEPONENT", align: "right", bold: true },
    ],
  };
}

// ---------- packages by document type ----------

function petitionPackage(form) {
  const annex = annexures(form, "P");
  return [
    indexPage(form, "Index", "Petition", annex),
    memoOfParties(form, "Memo of parties", "petitioner", "Petitioner", partyBlock(form, "respondent", "Respondent")),
    supportingAffidavit(form, "petitioner", "Petitioner", "petition"),
    listOfDocuments(form, annex),
  ];
}

function consumerPackage(form) {
  const annex = annexures(form, "C");
  const commission = (form.commissionLevel || "").startsWith("Not")
    ? "CONSUMER DISPUTES REDRESSAL COMMISSION"
    : `${value(form, "commissionLevel").toUpperCase()}, CONSUMER DISPUTES REDRESSAL COMMISSION`;
  const formWithCourt = { ...form, courtName: `BEFORE THE ${commission}, ${value(form, "place").toUpperCase()}` };
  const opposite = [
    { type: "para", text: `${value(form, "businessName")},`, bold: true },
    { type: "para", text: `Through its ${value(form, "businessDesignation", "authorised representative")}, ${value(form, "businessAddress")}.` },
    { type: "para", text: "...Opposite Party", align: "right", bold: true },
  ];
  return [
    indexPage(formWithCourt, "Index", "Consumer complaint", annex),
    memoOfParties(formWithCourt, "Memo of parties", "complainant", "Complainant", opposite),
    supportingAffidavit(formWithCourt, "complainant", "Complainant", "complaint"),
    listOfDocuments(formWithCourt, annex),
  ];
}

function noticeEnclosures(form) {
  const items = [];
  if (form.noticeIssue === "Dishonoured cheque") {
    items.push(`Copy of cheque No. ${value(form, "chequeNumber")} dated ${value(form, "chequeDate")}`);
    items.push(`Copy of bank return memo dated ${value(form, "returnMemoDate")}`);
  }
  if ((form.agreementRef || "").trim()) items.push(`Copy of ${form.agreementRef.trim()}`);
  if (!items.length) return [];
  return [
    {
      title: "Enclosures",
      blocks: [
        { type: "para", text: "ENCLOSURES", align: "center", bold: true },
        { type: "table", header: ["S. No.", "Document"], rows: items.map((item, i) => [`${i + 1}.`, item]) },
        { type: "space" },
        { type: "para", text: `Sent by: ${value(form, "serviceMode")}` },
        { type: "para", text: "Postal receipt / tracking no.: ____________" },
      ],
    },
  ];
}

function rentSchedules(form) {
  const pages = [
    {
      title: "Schedule of property",
      blocks: [
        { type: "para", text: "SCHEDULE OF PROPERTY", align: "center", bold: true },
        {
          type: "table",
          header: ["Particular", "Details"],
          rows: [
            ["Address", value(form, "propertyAddress")],
            ["Type", value(form, "propertyType")],
            ["Floor", value(form, "floorNumber", "—")],
            ["Built-up area", `${value(form, "propertyArea", "—")} sq ft`],
            ["Purpose", value(form, "propertyUse")],
            ["Furnishing", value(form, "furnishing")],
          ],
        },
      ],
    },
  ];
  const fixtures = lines(form.fixtures);
  if (fixtures.length) {
    pages.push({
      title: "Inventory of fixtures",
      blocks: [
        { type: "para", text: "INVENTORY OF FIXTURES AND FITTINGS", align: "center", bold: true },
        { type: "table", header: ["S. No.", "Item", "Condition"], rows: fixtures.map((f, i) => [`${i + 1}.`, f, "____"]) },
        { type: "space" },
        { type: "para", text: "Licensor ____________          Licensee ____________" },
      ],
    });
  }
  return pages;
}

export function hasFilingPackage(docType) {
  return [
    "Basic Petition",
    "Consumer Complaint",
    "Legal Notice (non-payment / cheque bounce)",
    "Rent / Leave and Licence Agreement",
  ].includes(docType);
}

export function buildDocument({ docType, draft, form, includePackage }) {
  const pages = [{ title: docType, blocks: parseDraft(draft) }];
  if (!includePackage) return pages;
  if (docType === "Basic Petition") return [...petitionPackage(form), ...pages];
  if (docType === "Consumer Complaint") return [...consumerPackage(form), ...pages];
  if (docType.startsWith("Legal Notice")) return [...pages, ...noticeEnclosures(form)];
  if (docType.startsWith("Rent")) return [...pages, ...rentSchedules(form)];
  return pages;
}

function letterhead(form) {
  return `${value(form, "advocateName", "[ADVOCATE NAME]")}, Advocate  |  Enrolment No. ${value(form, "advocateEnrolment", "[____]")}  |  [Chamber address]  |  [Phone / Email]`;
}

// ---------- Word export ----------

export async function downloadDocx({ docType, draft, form, includePackage }) {
  const docx = await import("docx");
  const {
    Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber,
    Table, TableRow, TableCell, WidthType, BorderStyle,
  } = docx;

  const font = "Times New Roman";
  const run = (text, opts = {}) => new TextRun({ text, font, size: 24, ...opts });
  const align = {
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
    justify: AlignmentType.JUSTIFIED,
    left: AlignmentType.LEFT,
  };

  const toChildren = (blocks) =>
    blocks.map((block) => {
      if (block.type === "space") return new Paragraph({ children: [run("")] });
      if (block.type === "table") {
        const cell = (text, bold) =>
          new TableCell({ children: [new Paragraph({ children: [run(String(text), { bold })] })] });
        return new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: block.header.map((h) => cell(h, true)), tableHeader: true }),
            ...block.rows.map((row) => new TableRow({ children: row.map((c) => cell(c, false)) })),
          ],
        });
      }
      return new Paragraph({
        alignment: align[block.align || "left"],
        spacing: { line: 360, after: 120 },
        children: [run(block.text, { bold: Boolean(block.bold) })],
      });
    });

  const makeHeader = () => new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [run(letterhead(form), { size: 18 })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 4 } },
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [run(WATERMARK, { size: 20, bold: true, color: "B0B0B0" })],
      }),
    ],
  });
  const makeFooter = () => new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ font, size: 18, children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] }),
        ],
      }),
    ],
  });

  const pages = buildDocument({ docType, draft, form, includePackage });
  const wordDoc = new Document({
    sections: pages.map((page) => ({
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: { default: makeHeader() },
      footers: { default: makeFooter() },
      children: toChildren(page.blocks),
    })),
  });

  const blob = await Packer.toBlob(wordDoc);
  triggerDownload(blob, `${slug(docType)}-draft.docx`);
}

// ---------- print / PDF ----------

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function openPrintView({ docType, draft, form, includePackage }) {
  const pages = buildDocument({ docType, draft, form, includePackage });
  const blockHtml = (block) => {
    if (block.type === "space") return "<p>&nbsp;</p>";
    if (block.type === "table") {
      const head = block.header.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
      const body = block.rows
        .map((row) => `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
        .join("");
      return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    }
    const style = `text-align:${block.align || "left"};${block.bold ? "font-weight:bold;" : ""}`;
    return `<p style="${style}">${escapeHtml(block.text)}</p>`;
  };

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(docType)} - draft</title>
<style>
@page { size: A4; margin: 25mm; }
body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; color: #000; }
.page { page-break-after: always; position: relative; }
.page:last-child { page-break-after: auto; }
.letterhead { text-align: center; font-size: 9pt; border-bottom: 1px solid #999; padding-bottom: 4px; margin-bottom: 16px; }
.watermark { position: fixed; top: 45%; left: 0; right: 0; text-align: center; transform: rotate(-30deg); font-size: 64pt; font-weight: bold; color: rgba(0,0,0,0.08); pointer-events: none; }
p { margin: 0 0 6pt; }
table { width: 100%; border-collapse: collapse; margin: 8pt 0; }
th, td { border: 1px solid #000; padding: 4pt 6pt; text-align: left; vertical-align: top; }
.toolbar { position: fixed; top: 8px; right: 8px; }
@media print { .toolbar { display: none; } }
</style></head><body>
<div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button></div>
<div class="watermark">${WATERMARK}</div>
${pages
  .map(
    (page) =>
      `<section class="page"><div class="letterhead">${escapeHtml(letterhead(form))}</div>${page.blocks.map(blockHtml).join("")}</section>`
  )
  .join("")}
</body></html>`;

  const win = window.open("", "_blank");
  if (!win) throw new Error("Allow pop-ups for this site to open the print view.");
  win.document.open();
  win.document.write(html);
  win.document.close();
}

// ---------- helpers ----------

function slug(text) {
  return text.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
