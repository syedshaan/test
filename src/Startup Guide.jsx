import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "1 November 2026";
const CHECKLIST_STORAGE_KEY = "pleadlaw-startup-checklist-v1";

const officialResources = [
  { label: "India Code", url: "https://www.indiacode.nic.in/", area: "Central Acts and legislation published by the Government of India" },
  { label: "eGazette of India", url: "https://egazette.gov.in/", area: "Official Gazette notifications and commencement instruments" },
  { label: "Ministry of Corporate Affairs (MCA)", url: "https://www.mca.gov.in/", area: "Company and LLP incorporation, filings, and forms" },
  { label: "Startup India", url: "https://www.startupindia.gov.in/", area: "DPIIT recognition, startup schemes, and learning resources" },
  { label: "Udyam Registration", url: "https://udyamregistration.gov.in/", area: "Micro, Small and Medium Enterprise registration" },
  { label: "Income Tax Department", url: "https://www.incometax.gov.in/iec/foportal/", area: "Income-tax returns, PAN, TAN, and e-filing services" },
  { label: "GST Portal", url: "https://www.gst.gov.in/", area: "GST registration, returns, and taxpayer services" },
  { label: "Ministry of Labour and Employment", url: "https://labour.gov.in/", area: "Central labour laws, schemes, and official updates" },
  { label: "Ministry of Electronics and Information Technology", url: "https://www.meity.gov.in/", area: "Digital policy, information technology, and data protection updates" },
  { label: "CERT-In", url: "https://www.cert-in.org.in/", area: "Cybersecurity advisories and incident-reporting directions" },
  { label: "Reserve Bank of India", url: "https://www.rbi.org.in/", area: "Banking, foreign exchange, and regulated financial activities" },
  { label: "Securities and Exchange Board of India", url: "https://www.sebi.gov.in/", area: "Securities-market regulation and intermediary requirements" },
  { label: "IP India", url: "https://ipindia.gov.in/", area: "Trade marks, patents, designs, and intellectual property services" },
  { label: "FSSAI", url: "https://www.fssai.gov.in/", area: "Food-business registration, licences, and standards" },
  { label: "National Single Window System", url: "https://www.nsws.gov.in/", area: "Central and State approval discovery and application services" },
  { label: "CERSAI", url: "https://www.cersai.org.in/", area: "Central Registry of Securitisation Asset Reconstruction and Security Interest" },
  { label: "Department of Consumer Affairs", url: "https://consumeraffairs.nic.in/", area: "Consumer protection and e-commerce rules and resources" },
];

const structureComparison = [
  {
    name: "Sole proprietorship",
    liability: "Owned and operated by one individual; owner and business are generally not separate legal persons, so personal liability may follow.",
    minimum: "One individual proprietor; local and tax registrations depend on activity.",
    tax: "Generally reported through the proprietor; check current tax treatment.",
    compliance: "Often simpler formation; ongoing tax, local, and sector duties may still apply.",
    funding: "Owner funds and borrowing; equity investment is generally not structured like a company share issue.",
  },
  {
    name: "Partnership firm",
    liability: "Owned by partners under their deed; partners may have personal liability for firm obligations.",
    minimum: "At least two partners; document the relationship and authority in a deed.",
    tax: "Firm and partner tax treatment must be checked for the facts and current law.",
    compliance: "Deed, accounts, tax and applicable State registration or filing requirements.",
    funding: "Partner contributions and borrowing; institutional equity funding can be less straightforward.",
  },
  {
    name: "Limited Liability Partnership",
    liability: "Partners own and manage the LLP under its agreement; separate body corporate with statutory limits and exceptions to liability protection.",
    minimum: "At least two partners and two designated partners under the LLP framework; confirm current eligibility and residency rules.",
    tax: "LLP and partner tax treatment differs from a company; confirm with an accountant.",
    compliance: "MCA incorporation, LLP agreement, accounts, annual and event-based filings.",
    funding: "Partner contributions and debt; investment mechanics differ from company shares.",
  },
  {
    name: "Private limited company",
    liability: "Owned by shareholders/members; separate legal entity and generally limited member liability, subject to law and conduct.",
    minimum: "Baseline: at least two members and two directors; verify current MCA eligibility and exceptions.",
    tax: "Company-level tax and shareholder-level consequences may apply.",
    compliance: "Higher governance, accounts, meeting, audit, and filing requirements.",
    funding: "Commonly used for equity investment; share rights and approvals need careful structuring.",
  },
  {
    name: "One Person Company",
    liability: "Owned by one member; separate company with statutory limits and exceptions to liability protection.",
    minimum: "One member with a nominee; verify current director, eligibility, and conversion rules.",
    tax: "Company tax treatment; check current tax rules and distributions.",
    compliance: "Company-law filings and governance apply, with any current OPC-specific provisions.",
    funding: "Useful for a single-member company; ownership and conversion rules can affect investment plans.",
  },
  {
    name: "Public limited company",
    liability: "Owned by its members/shareholders; separate legal entity and generally limited member liability, subject to law and conduct.",
    minimum: "Baseline: at least seven members and three directors; verify current MCA eligibility and exceptions.",
    tax: "Company tax treatment; securities transactions may bring additional rules.",
    compliance: "More extensive company-law and, for relevant offerings, securities-law obligations.",
    funding: "Can support broader capital raising subject to applicable securities laws; not a shortcut to listing.",
  },
  {
    name: "Section 8 company",
    liability: "Owned by members under its company form; member liability depends on the structure and governing documents.",
    minimum: "Eligible objects and licensing conditions; member/director minimum depends on private or public company form.",
    tax: "No automatic tax exemption; tax registrations and exemption eligibility are separate questions.",
    compliance: "Company filings plus restrictions and reporting associated with its permitted objects.",
    funding: "May suit eligible non-profit activity; profits are applied to objects and are not distributed as dividends.",
  },
];

const sections = [
  {
    id: "startup-journey",
    title: "The startup journey",
    intro: "Use this as a sequence of questions, not a one-size-fits-all list of mandatory registrations. Requirements depend on the entity, activity, State, size, and current law.",
    topics: [
      { title: "1. Before starting", status: "Recommended", detail: "Describe the product, customers, founders, ownership, operating locations, funding plan, and whether the business will handle personal data or regulated goods and services. Check whether the name and brand are available." },
      { title: "2. Choose and form an entity", status: "Conditional", detail: "Compare a proprietorship, partnership, LLP, company, or eligible Section 8 company. Select a structure based on liability, ownership, investment plans, governance, and ongoing compliance—not only the registration price." },
      { title: "3. Prepare the launch", status: "Conditional", detail: "Check tax registrations, local licences, sector approvals, customer contracts, website terms, privacy notices, intellectual-property ownership, and payment arrangements before trading." },
      { title: "4. Operate and report", status: "Conditional", detail: "Keep accounts and records, track filing dates, review employment and data-protection duties, and retain evidence of approvals, contracts, payments, and decisions." },
      { title: "5. Raise funds, expand, or close", status: "Conditional", detail: "Update ownership and filings when required. For financing, expansion, restructuring, or closure, identify transaction, State, tax, employment, and regulatory consequences before acting." },
    ],
  },
  {
    id: "registration",
    title: "Business registration and incorporation",
    intro: "The outline below is a comparison aid, not a recommendation. Costs, forms, eligibility, timelines, taxes, and exemptions change and must be checked with the relevant authority and a qualified professional.",
    topics: [
      { title: "Sole proprietorship", status: "Conditional", detail: "A proprietorship is not incorporated as a separate company. The proprietor and business are generally not separate legal persons. PAN, tax treatment, local registrations, and sector licences depend on the activity and applicable rules." },
      { title: "Partnership firm", status: "Conditional", detail: "Partners document their relationship in a partnership deed. Registration and related consequences are governed by applicable law; check State requirements, PAN, tax treatment, liability, and authority to sign." },
      { title: "Limited Liability Partnership (LLP)", status: "Conditional", detail: "An LLP is formed under the LLP Act through the MCA process, with designated partners and an LLP agreement. Ongoing filings and accounts apply; confirm the current forms, deadlines, eligibility, and fees on MCA." },
      { title: "Private limited company", status: "Conditional", detail: "Incorporation is completed through the MCA process, with a memorandum and articles, directors, and shareholders. Plan for company-law governance, statutory filings, accounts, and post-incorporation actions." },
      { title: "One Person Company (OPC)", status: "Conditional", detail: "An OPC is a company form with one member and a nominee framework under company law. Confirm current eligibility, nominee, conversion, filing, and governance rules before choosing it." },
      { title: "Public limited company", status: "Conditional", detail: "A public company has additional statutory and governance requirements and may suit businesses with a relevant scale or capital-raising plan. Public-company status does not itself permit a public securities offering." },
      { title: "Section 8 company", status: "Conditional", detail: "A Section 8 company is for qualifying charitable or other permitted not-for-profit objects, subject to statutory conditions and licensing. It is not a general-purpose low-cost startup structure." },
      { title: "Incorporation, licences, and tax registrations are different", status: "Recommended", detail: "Incorporation or entity registration establishes or records a legal form. A sector or local licence permits a regulated activity or premises. Tax registrations such as GST are separate and depend on the applicable tax law. Obtaining one does not automatically satisfy the others." },
      { title: "Compare before choosing", status: "Recommended", detail: "Compare liability, number and type of owners, governance, taxation, annual compliance, investor suitability, transfer of ownership, and professional and government costs. Ask a qualified accountant or lawyer to estimate current costs and timelines; this guide does not publish unverified estimates." },
      { title: "Name, PAN/TAN, bank account, and schemes", status: "Conditional", detail: "Check name availability through the appropriate official portal and separately check trademarks. PAN, TAN, a current account, GST, Udyam/MSME registration, DPIIT recognition, and State or Central incentives each have their own eligibility and process; one does not automatically grant the others." },
    ],
    resources: ["Ministry of Corporate Affairs (MCA)", "Startup India", "Udyam Registration", "Income Tax Department"],
  },
  {
    id: "documents",
    title: "Essential legal documentation",
    intro: "Keep signed, dated, and current copies in a controlled records system. Use a template only after adapting it to the parties, business model, location, and applicable law.",
    topics: [
      { title: "Foundational and ownership records", status: "Conditional", detail: "Keep the applicable registration certificate, PAN/TAN/GST records, constitutional document or partnership deed, founders' agreement, shareholders' agreement, board approvals, cap table, and ownership disclosures." },
      { title: "Commercial agreements", status: "Recommended", detail: "Consider NDAs, client and service terms, vendor and procurement agreements, consulting and contractor terms, office leases, licences, distribution and franchise agreements, payment terms, refunds, indemnities, liability limits, and dispute-resolution clauses." },
      { title: "Employment and people operations", status: "Conditional", detail: "Use suitable offer letters, employment and contractor agreements, confidentiality and IP assignments, a handbook, payroll records, exit documents, and workplace policies. POSH duties and Internal Committee requirements depend on the law and facts." },
      { title: "Digital and intellectual-property records", status: "Conditional", detail: "Document ownership and permitted use of software, content, designs, brands, inventions, domains, and contractor-created work. Review website terms, privacy disclosures, cookie use, and data-processing terms where relevant." },
      { title: "Templates and review", status: "Recommended", detail: "A sample is a starting point only. Do not sign a template unchanged or assume it works for every State, sector, entity, customer, or transaction. Record who approved each final version." },
    ],
    resources: ["Ministry of Corporate Affairs (MCA)", "IP India", "Ministry of Electronics and Information Technology"],
  },
  {
    id: "compliance",
    title: "Legal compliance for startups",
    intro: "Classify each item as mandatory, conditional, recommended, or optional after checking the relevant law. A reference here does not mean every business must comply with it.",
    topics: [
      { title: "Corporate and secretarial", status: "Conditional", detail: "Depending on the entity, review annual returns and financial statements, event-based filings, meetings and minutes, statutory registers, auditors, books of account, director disclosures, and beneficial-ownership rules under the Companies Act, 2013 or LLP Act, 2008." },
      { title: "Tax and finance", status: "Conditional", detail: "Check income-tax returns and advance tax, TDS/TCS, GST registration and returns, invoices and input tax credit, e-invoicing, tax or statutory audit, professional tax, State-specific duties, and tax consequences of investments and employee equity." },
      { title: "Data protection and information technology", status: "Conditional", detail: "Assess the Digital Personal Data Protection Act, 2023, applicable rules, commencement notifications, and transition provisions. Identify whether the business acts as a Data Fiduciary or Data Processor; review notices, consent, minimisation, retention, deletion, user requests, breach response, vendor contracts, IT Act obligations, and applicable CERT-In directions." },
      { title: "Labour and employment", status: "Conditional", detail: "Check which labour codes, rules, notifications, and transition arrangements are in force for the business. Review State Shops and Establishments law, wages, hours, leave, overtime, EPF, ESI, gratuity, maternity benefits, contract labour, POSH, records, notices, and apprenticeship or internship obligations." },
      { title: "Sector and local approvals", status: "Conditional", detail: "Depending on the activity, investigate FSSAI, Import Export Code, RBI, IRDAI, SEBI, Legal Metrology, trade, fire, building, environmental, consumer, healthcare, education, manufacturing, real-estate, and other State or local permissions. Use the relevant regulator or local authority to verify applicability." },
      { title: "SARFAESI and borrowing", status: "Conditional", detail: "SARFAESI is not a routine registration or compliance requirement for every startup. Its relevance depends on the startup's role, the financing and security arrangements, and the legal position of the lender or other concerned party. For secured borrowing, review loan and guarantee terms, charges, security documents, charge registration, and CERSAI requirements with qualified counsel." },
    ],
    resources: ["Ministry of Corporate Affairs (MCA)", "Income Tax Department", "GST Portal", "Ministry of Labour and Employment", "Ministry of Electronics and Information Technology", "CERT-In", "FSSAI", "Reserve Bank of India", "Securities and Exchange Board of India"],
  },
  {
    id: "filing-calendar",
    title: "Reporting and filing calendar",
    intro: "Build a calendar from the business's actual registrations and transactions. Due dates, forms, thresholds, exemptions, and consequences may change; verify them against the official portal before relying on a reminder.",
    topics: [
      { title: "Corporate and LLP filings", status: "Conditional", detail: "Track annual and event-based MCA filings, accounts and audit reports, changes to directors, members, capital or registered office, meetings, resolutions, and statutory registers where applicable." },
      { title: "Tax and payroll reports", status: "Conditional", detail: "Track income-tax, GST, TDS/TCS, EPF, ESI, professional tax, and other tax or labour returns that apply to the entity, State, workforce, and activity." },
      { title: "Funding and foreign transactions", status: "Conditional", detail: "Review share issuance, investor reporting, cap-table updates, FEMA and foreign-investment conditions, pricing guidelines, and applicable RBI reporting for the specific instrument and transaction." },
      { title: "Operational and incident records", status: "Conditional", detail: "Maintain contracts, invoices, payroll and employee records, statutory registers, data-protection decisions, and sector records. Assess mandatory data-breach, cyber-incident, and sector-regulator reporting when an incident occurs." },
      { title: "Calendar fields to record", status: "Recommended", detail: "For each obligation record applicability, authority, form or portal, frequency, due date, responsible person, source URL, evidence of filing, likely consequence of non-compliance, and the date the source was last checked. Add reminders only after a responsible person verifies the date." },
    ],
    resources: ["Ministry of Corporate Affairs (MCA)", "Income Tax Department", "GST Portal", "Ministry of Labour and Employment", "Reserve Bank of India"],
  },
  {
    id: "intellectual-property",
    title: "Intellectual-property protection",
    intro: "Ownership, registrability, and protection depend on the type of work, how it was created, and the relevant law. Registration is not a substitute for documenting ownership and permissions.",
    topics: [
      { title: "Brand and trade marks", status: "Recommended", detail: "Search for conflicting names and marks before investing in a brand. Consider whether and where to apply to register the name, logo, or other sign, and monitor renewals and possible disputes." },
      { title: "Copyright and software", status: "Conditional", detail: "Identify the creator and owner of software, website copy, designs, photographs, and other original works. Preserve dated source records and written assignments or licences from employees, interns, contractors, and agencies." },
      { title: "Patents, designs, and trade secrets", status: "Conditional", detail: "Obtain specialist advice before public disclosure of a potentially patentable invention. Consider design registration where relevant and protect confidential know-how through access controls and appropriate agreements." },
      { title: "Domains, licences, and diligence", status: "Recommended", detail: "Secure relevant domain names, document licences and assignments, check third-party assets, and prepare clear IP ownership records for investment, acquisition, or a dispute." },
    ],
    resources: ["IP India"],
  },
  {
    id: "funding",
    title: "Funding, investment, and investor readiness",
    intro: "Financing choices bring different ownership, governance, tax, and regulatory effects. Requirements depend on the investor, instrument, sector, company form, and transaction.",
    topics: [
      { title: "Funding routes", status: "Optional", detail: "Compare bootstrapping, grants and eligible schemes, incubators, angel or venture investment, and debt. Review repayment, dilution, control, eligibility, and reporting before accepting funds." },
      { title: "Investment documents and ownership", status: "Conditional", detail: "Review term sheets, subscription and shareholders' agreements, share issuance, valuation, cap tables, investor rights, conditions precedent, representations, and dilution with professional advisers." },
      { title: "ESOPs and convertible instruments", status: "Conditional", detail: "Check company-law, tax, valuation, foreign-exchange, documentation, approval, and reporting requirements before implementing an ESOP or convertible security." },
      { title: "Foreign investment and diligence", status: "Conditional", detail: "Check FEMA, sectoral caps, entry routes, pricing guidelines, beneficial ownership, and current RBI reporting where foreign investment is involved. Keep a complete diligence folder and disclose liabilities accurately." },
      { title: "Debt, security, and SARFAESI", status: "Conditional", detail: "Review covenants, guarantees, collateral, charge creation and registration, CERSAI records, default remedies, and the lender's rights. SARFAESI does not apply as a routine startup registration; obtain advice on the transaction's specific facts." },
    ],
    resources: ["Startup India", "Ministry of Corporate Affairs (MCA)", "Reserve Bank of India", "CERSAI", "Securities and Exchange Board of India"],
  },
  {
    id: "digital-business",
    title: "Consumer protection, e-commerce, and digital business",
    intro: "Online businesses should assess their role in the transaction and the rules that apply to their product, customer, platform model, and data practices.",
    topics: [
      { title: "Customer-facing terms", status: "Recommended", detail: "Publish clear terms of use, accurate pricing and product claims, and appropriate cancellation, refund, return, shipping, grievance, and contact information." },
      { title: "Privacy and electronic records", status: "Conditional", detail: "Explain personal-data handling in a suitable privacy notice, use appropriate consent and vendor terms, secure records, and review electronic-contract and accessibility needs." },
      { title: "Marketplace or inventory model", status: "Conditional", detail: "Identify whether the business sells its own inventory, operates a marketplace, or provides another platform service. Review e-commerce, intermediary, payment gateway, consumer protection, and product-labelling obligations for that model." },
      { title: "Consumer claims and support", status: "Recommended", detail: "Keep claims accurate, preserve order and communication records, provide a working grievance path, and handle complaints consistently with applicable law." },
    ],
    resources: ["Department of Consumer Affairs", "Ministry of Electronics and Information Technology"],
  },
  {
    id: "risk",
    title: "Dispute prevention and legal risk management",
    intro: "A practical record of decisions, contracts, and communications can reduce avoidable risk. It cannot guarantee that a dispute will not occur.",
    topics: [
      { title: "Contracts and collections", status: "Recommended", detail: "Use written scopes, deliverables, payment milestones, acceptance criteria, change processes, termination rights, dispute-resolution clauses, and clear invoice follow-up." },
      { title: "Disputes and evidence", status: "Conditional", detail: "Consider negotiation, mediation, arbitration, or court proceedings as appropriate. Record relevant notices, claims, limitation dates, communications, approvals, and evidence; obtain advice promptly when a deadline or formal proceeding is involved." },
      { title: "People, customers, and intellectual property", status: "Conditional", detail: "Create fair employment and termination processes, consumer grievance handling, and IP ownership records. Escalate complaints, suspected infringement, or workplace concerns through documented procedures." },
      { title: "Insurance", status: "Optional", detail: "Ask a qualified broker or adviser whether professional indemnity, cyber, directors' and officers', property, or other cover is appropriate for the actual risks and policy exclusions." },
    ],
  },
  {
    id: "expansion-closure",
    title: "Expansion, restructuring, and closure",
    intro: "Major changes can affect registrations, contracts, taxes, staff, creditors, investors, licences, and personal data. Plan the sequence before carrying out the change.",
    topics: [
      { title: "New locations and growth", status: "Conditional", detail: "Before opening a branch or operating in another State, check local registrations, State tax and employment rules, premises approvals, licences, and contract or privacy changes." },
      { title: "Ownership and restructuring", status: "Conditional", detail: "For changes in management, shareholding, conversion, merger, acquisition, business transfer, or sale, check approvals, filings, tax, investor rights, employee issues, liabilities, and due diligence." },
      { title: "Closure and post-closure", status: "Conditional", detail: "Choose the correct route—such as strike-off, winding-up, insolvency, or liquidation—based on eligibility and circumstances. Plan settlement of employee and creditor dues, taxes, contracts, records retention, licences, and post-closure duties with professional advice." },
    ],
    resources: ["Ministry of Corporate Affairs (MCA)", "Income Tax Department", "Ministry of Labour and Employment"],
  },
  {
    id: "official-resources",
    title: "Official resources and legal updates",
    intro: "Start with the issuing authority's current legislation, rules, notifications, circulars, and portal instructions. A news article or this guide should not replace the primary source.",
    topics: [
      { title: "How to record a legal update", status: "Recommended", detail: "For each update record the authority, date issued, instrument, publication and effective dates, affected business types, action required, official source URL, and the date the entry was checked. Mark unclear or future commencement dates for legal review." },
      { title: "State and local resources", status: "Conditional", detail: "Use the relevant State department, municipal body, labour department, and local regulator for location-specific rules. The National Single Window System can help discover approvals, but confirm each requirement with its issuing authority." },
    ],
    resources: officialResources.map((item) => item.label),
  },
];

const checklistStages = [
  {
    title: "Before starting the business",
    items: [
      { id: "idea-model", text: "Write down the product, customers, operating locations, and proposed business model.", status: "Recommended" },
      { id: "founders-ownership", text: "Agree founder roles, ownership expectations, decision-making, and exit discussions in writing.", status: "Recommended" },
      { id: "name-check", text: "Check business-name availability and conduct a separate trade-mark search.", status: "Recommended" },
      { id: "entity-choice", text: "Compare entity structures, liability, tax, governance, investor needs, and ongoing compliance.", status: "Recommended" },
      { id: "state-check", text: "Identify State, municipal, premises, and sector approvals that may apply.", status: "Conditional", when: "state" },
    ],
  },
  {
    title: "During incorporation and registration",
    items: [
      { id: "formation-docs", text: "Complete the applicable formation or registration process and retain official certificates and filings.", status: "Conditional", when: "entity" },
      { id: "entity-agreement", text: "Prepare and approve the applicable partnership deed, LLP agreement, or company governance documents.", status: "Conditional", when: "entity" },
      { id: "pan-tax", text: "Check PAN, TAN, GST, and other tax-registration requirements for this entity and activity.", status: "Conditional", when: "tax" },
      { id: "bank", text: "Ask the bank about documents and controls needed for a business current account.", status: "Recommended" },
      { id: "udyam-dpiit", text: "Check eligibility and official requirements for Udyam/MSME or DPIIT Startup recognition.", status: "Optional" },
    ],
  },
  {
    title: "Before launching the product or service",
    items: [
      { id: "sector-licences", text: "Verify sector-specific registrations, licences, product standards, and local permissions.", status: "Conditional", when: "sector" },
      { id: "customer-terms", text: "Prepare customer and supplier contracts, payment terms, cancellation/refund terms, and grievance contact details.", status: "Recommended" },
      { id: "privacy-security", text: "Map personal data, publish suitable privacy information, set retention/access controls, and review vendor terms.", status: "Conditional", when: "personalData" },
      { id: "website-terms", text: "Review website/application terms, consumer disclosures, accessibility, and electronic contracting.", status: "Conditional", when: "online" },
      { id: "brand-ip", text: "Record ownership and licences for the brand, domain, software, content, and other IP.", status: "Recommended" },
    ],
  },
  {
    title: "Before hiring employees",
    items: [
      { id: "employment-docs", text: "Prepare appropriate offer, employment/contractor, confidentiality, and IP documents.", status: "Conditional", when: "employees" },
      { id: "payroll", text: "Check wages, payroll, leave, working-hours, professional-tax, EPF, ESI, and other applicable thresholds.", status: "Conditional", when: "employees" },
      { id: "posh", text: "Assess POSH Act duties and required workplace processes for the organisation.", status: "Conditional", when: "employees" },
      { id: "interns", text: "Review apprenticeship and internship arrangements, supervision, stipend, and applicable requirements.", status: "Conditional", when: "employees" },
    ],
  },
  {
    title: "Before accepting investments",
    items: [
      { id: "cap-table", text: "Prepare and reconcile the cap table, securities, approvals, and ownership records.", status: "Recommended", when: "investment" },
      { id: "term-sheet", text: "Have the term sheet and investment, subscription, and shareholders' documents reviewed.", status: "Conditional", when: "investment" },
      { id: "foreign-investment", text: "Check foreign-investment route, sectoral caps, pricing, FEMA, and reporting where a non-resident is involved.", status: "Conditional", when: "investment" },
      { id: "diligence", text: "Organise contracts, IP records, accounts, employment records, licences, disputes, and disclosures for diligence.", status: "Recommended", when: "investment" },
    ],
  },
  {
    title: "During regular business operations",
    items: [
      { id: "filing-calendar", text: "Maintain a verified filing calendar with authority, form, due date, owner, source, and proof of filing.", status: "Recommended" },
      { id: "bookkeeping", text: "Keep accurate books, invoices, receipts, payroll, contracts, statutory registers, and approval records.", status: "Conditional", when: "tax" },
      { id: "data-breach", text: "Maintain a practical security and incident-response process, including applicable reporting duties.", status: "Conditional", when: "personalData" },
      { id: "turnover-review", text: "Ask an accountant to review turnover-linked registrations, tax, audit, and reporting thresholds.", status: "Conditional", when: "turnover" },
    ],
  },
  {
    title: "During expansion or restructuring",
    items: [
      { id: "new-state", text: "Re-check registrations, employment rules, tax, licences, premises, and data practices in each new State.", status: "Conditional", when: "state" },
      { id: "change-filings", text: "Identify approvals, contract consents, tax effects, and filings before changing ownership, capital, or management.", status: "Conditional", when: "entity" },
      { id: "due-diligence", text: "Complete legal, financial, employment, tax, and IP diligence before a merger, acquisition, or business transfer.", status: "Conditional", when: "investment" },
    ],
  },
  {
    title: "At the time of closure",
    items: [
      { id: "closure-route", text: "Confirm the correct closure, strike-off, winding-up, insolvency, or liquidation route with an adviser.", status: "Conditional", when: "entity" },
      { id: "settlements", text: "Plan employee, creditor, tax, investor, contractual, and secured-lender obligations.", status: "Conditional" },
      { id: "records-retention", text: "Retain required corporate, tax, employment, customer, and data-protection records for applicable periods.", status: "Conditional" },
    ],
  },
];

const entityOptions = [
  ["undecided", "Not decided"],
  ["proprietorship", "Sole proprietorship"],
  ["partnership", "Partnership firm"],
  ["llp", "LLP"],
  ["company", "Private/public company or OPC"],
  ["section8", "Section 8 company"],
];

const checklistConditions = {
  entity: () => true,
  tax: () => true,
  state: () => true,
  sector: () => true,
  online: (answers) => answers.sector === "online",
  personalData: (answers) => answers.personalData !== "no",
  employees: (answers) => answers.employees !== "no",
  investment: (answers) => answers.investment !== "no",
  turnover: () => true,
};

function getStoredChecklist() {
  try {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) {
      console.warn("Saved checklist data is invalid; starting with an empty checklist.");
      return [];
    }
    return parsed.filter((id) => typeof id === "string");
  } catch (error) {
    console.warn("Could not read the saved checklist from this browser.", error);
    return [];
  }
}

function InfoStatus({ children }) {
  return (
    <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-800">
      {children}
    </span>
  );
}

export default function StartupGuide() {
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState({
    entity: "undecided",
    state: "",
    sector: "undecided",
    employees: "undecided",
    turnover: "undecided",
    investment: "undecided",
    personalData: "undecided",
  });
  const [checklistGenerated, setChecklistGenerated] = useState(false);
  const [completedItems, setCompletedItems] = useState(getStoredChecklist);

  const filteredSections = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return sections;
    return sections.filter((section) =>
      `${section.title} ${section.intro} ${section.topics.map((topic) => `${topic.title} ${topic.detail}`).join(" ")}`
        .toLowerCase()
        .includes(search)
    );
  }, [query]);

  const visibleChecklist = useMemo(() => {
    if (!checklistGenerated) return [];
    return checklistStages.map((stage) => ({
      ...stage,
      items: stage.items.filter((item) =>
        !item.when || checklistConditions[item.when]?.(answers)
      ),
    })).filter((stage) => stage.items.length > 0);
  }, [answers, checklistGenerated]);

  const updateAnswer = (event) => {
    setAnswers((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleChecklistItem = (id) => {
    setCompletedItems((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
      try {
        window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn("Could not save checklist progress in this browser.", error);
      }
      return next;
    });
  };

  const downloadChecklist = () => {
    const lines = [
      "Pleadlaw Startup Legal Checklist",
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      `Entity: ${entityOptions.find(([value]) => value === answers.entity)?.[1] || "Not decided"}`,
      `State/UT: ${answers.state || "Not provided"}`,
      `Business activity: ${answers.sector}`,
      `Employees or interns: ${answers.employees}`,
      `Turnover/size: ${answers.turnover}`,
      `External investment: ${answers.investment}`,
      `Personal data: ${answers.personalData}`,
      "",
      "Preliminary checklist — verify applicability with official sources and a qualified professional.",
      "",
      ...visibleChecklist.flatMap((stage) => [
        stage.title,
        ...stage.items.map((item) =>
          `${completedItems.includes(item.id) ? "[x]" : "[ ]"} ${item.text} (${item.status})`
        ),
        "",
      ]),
    ];
    const file = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pleadlaw-startup-checklist.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <section className="hero-glow overflow-hidden rounded-3xl px-6 py-10 text-white md:px-10 md:py-14 print:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Pleadlaw founder resources</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Startup Guide</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-indigo-100/85">
          A practical starting point for understanding business structures, documents,
          compliance, funding, and legal risks for startups in India.
        </p>
        <p className="mt-5 text-sm text-indigo-100/70">
          Guide content date: {LAST_UPDATED}. Laws, thresholds, commencement dates,
          and State requirements change. Check the linked official source before acting.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#startup-checklist" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-cyan-50">
            Build a checklist
          </a>
          <Link to="/consultation" className="rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
            Ask about tailored legal help
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 print:hidden">
          <label htmlFor="startup-guide-search" className="text-sm font-semibold text-slate-800">
            Search this guide
          </label>
          <input
            id="startup-guide-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try GST, hiring, funding..."
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
          <nav aria-label="Startup Guide categories" className="mt-5 space-y-1">
            {filteredSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-800"
              >
                {section.title}
              </a>
            ))}
            <a href="#startup-checklist" className="block rounded-lg px-3 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50">
              Interactive checklist
            </a>
          </nav>
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
            Applicability labels are prompts for review, not a legal determination.
            Mandatory duties depend on your facts and current law.
          </p>
        </aside>

        <div className="min-w-0 space-y-5 print:hidden">
          {filteredSections.length === 0 && (
            <p role="status" className="rounded-xl border border-slate-200 bg-white p-5 text-slate-600">
              No guide sections match “{query}”. Try another term or clear your search.
            </p>
          )}
          {filteredSections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.intro}</p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {section.topics.map((topic) => (
                  <details key={topic.title} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-800">
                      <span>{topic.title}</span>
                      <span className="flex items-center gap-3">
                        <InfoStatus>{topic.status}</InfoStatus>
                        <span aria-hidden="true" className="text-slate-400 transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">{topic.detail}</p>
                  </details>
                ))}
              </div>

              {section.id === "registration" && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-900">Compare common business structures</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    High-level orientation only. “Minimum” is not a complete eligibility test.
                    For every structure, government fees and processing time vary with the
                    application, documents, State, and current rules. This guide has no
                    verified live price or turnaround estimate; verify official fees and
                    obtain a current professional estimate before budgeting.
                  </p>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-[1100px] border-collapse text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                        <tr>
                          <th className="p-3">Structure</th>
                          <th className="p-3">Liability and ownership</th>
                          <th className="p-3">Baseline minimum / formation notes</th>
                          <th className="p-3">Tax considerations</th>
                          <th className="p-3">Compliance burden</th>
                          <th className="p-3">Fundraising fit</th>
                          <th className="p-3">Cost and timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {structureComparison.map((row) => (
                          <tr key={row.name} className="align-top">
                            <th scope="row" className="min-w-36 p-3 font-semibold text-slate-900">{row.name}</th>
                            <td className="min-w-52 p-3 leading-relaxed">{row.liability}</td>
                            <td className="min-w-52 p-3 leading-relaxed">{row.minimum}</td>
                            <td className="min-w-48 p-3 leading-relaxed">{row.tax}</td>
                            <td className="min-w-52 p-3 leading-relaxed">{row.compliance}</td>
                            <td className="min-w-52 p-3 leading-relaxed">{row.funding}</td>
                            <td className="min-w-56 p-3 leading-relaxed">
                              Variable. Check the current MCA/State fee schedule and get a
                              written professional quote; confirm the latest processing estimate.
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {section.id === "documents" && (
                <div className="mt-5 rounded-xl bg-violet-50 p-4">
                  <p className="text-sm leading-relaxed text-violet-950">
                    Pleadlaw also offers preliminary, guided drafting for selected
                    documents. The AI Drafter is not a library of reviewed startup
                    templates; any generated draft must be adapted and reviewed
                    by a qualified professional.
                  </p>
                  <Link to="/drafter" className="mt-3 inline-flex text-sm font-semibold text-violet-800 underline">
                    Explore the AI Drafter
                  </Link>
                </div>
              )}

              {section.resources?.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-semibold text-slate-800">Official resources</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {section.resources.map((resourceName) => {
                      const resource = officialResources.find((item) => item.label === resourceName);
                      return resource ? (
                        <a
                          key={resource.label}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-violet-800 hover:border-violet-300 hover:bg-violet-50"
                        >
                          {resource.label} ↗
                        </a>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              {section.id === "official-resources" && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {officialResources.map((resource) => (
                    <a
                      key={resource.label}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 hover:bg-violet-50/50"
                    >
                      <span className="font-semibold text-violet-800">{resource.label} ↗</span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">{resource.area}</span>
                    </a>
                  ))}
                </div>
              )}
              <p className="mt-4 text-xs text-slate-400">
                Guide content dated {LAST_UPDATED}; re-check official sources before relying on it.
              </p>
            </section>
          ))}
        </div>
      </div>

      <section id="startup-checklist" className="scroll-mt-24 mt-10 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-9 print:mt-0 print:border-0 print:shadow-none">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Practical tool</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Startup legal checklist</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Answer a few questions to create a preliminary checklist across the eight
          stages. It does not decide which laws apply. Use the results to identify
          questions for the relevant authority or professional adviser.
          Questionnaire answers stay in this page and are not sent to Pleadlaw;
          completion marks are saved only in this browser.
        </p>

        <form
          className="mt-6 grid gap-4 sm:grid-cols-2 print:hidden"
          onSubmit={(event) => {
            event.preventDefault();
            setChecklistGenerated(true);
          }}
        >
          <label className="text-sm font-medium text-slate-700">
            Business structure
            <select name="entity" value={answers.entity} onChange={updateAnswer} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              {entityOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            State/UT of operation
            <input name="state" value={answers.state} onChange={updateAnswer} placeholder="Enter State or Union Territory" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Business activity
            <select name="sector" value={answers.sector} onChange={updateAnswer} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="undecided">Not decided</option>
              <option value="services">Professional or other services</option>
              <option value="online">E-commerce or digital platform</option>
              <option value="food">Food business</option>
              <option value="finance">Financial services</option>
              <option value="import-export">Import or export</option>
              <option value="other-regulated">Other regulated activity</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Employees or interns
            <select name="employees" value={answers.employees} onChange={updateAnswer} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="undecided">Not decided</option>
              <option value="no">None currently</option>
              <option value="yes">One or more / planned</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Turnover/size
            <select name="turnover" value={answers.turnover} onChange={updateAnswer} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="undecided">Not assessed</option>
              <option value="micro">Micro / early stage</option>
              <option value="growing">Growing</option>
              <option value="large">Larger or above a threshold</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            External investment
            <select name="investment" value={answers.investment} onChange={updateAnswer} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="undecided">Not decided</option>
              <option value="no">No / bootstrapped</option>
              <option value="yes">Yes / planning to raise</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Does the business handle personal data?
            <select name="personalData" value={answers.personalData} onChange={updateAnswer} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="undecided">Not sure</option>
              <option value="no">No personal data expected</option>
              <option value="yes">Yes, or likely to</option>
            </select>
          </label>
          <button type="submit" className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800 sm:col-span-2">
            Generate preliminary checklist
          </button>
        </form>

        {checklistGenerated && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your checklist</h3>
                <p className="mt-1 text-sm text-slate-500">Completion marks are saved in this browser only.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={downloadChecklist} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Download checklist
                </button>
                <button type="button" onClick={() => window.print()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Print
                </button>
              </div>
            </div>
            <div className="mt-5 space-y-5">
              {visibleChecklist.map((stage) => (
                <section key={stage.title} className="rounded-2xl bg-slate-50 p-4 md:p-5">
                  <h4 className="font-bold text-slate-900">{stage.title}</h4>
                  <ul className="mt-3 space-y-3">
                    {stage.items.map((item) => (
                      <li key={item.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={completedItems.includes(item.id)}
                          onChange={() => toggleChecklistItem(item.id)}
                          aria-label={`Mark as complete: ${item.text}`}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
                        />
                        <span className={`text-sm leading-relaxed ${completedItems.includes(item.id) ? "text-slate-400 line-through" : "text-slate-700"}`}>
                          {item.text} <span className="ml-1 text-xs font-medium text-violet-700">({item.status})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              This checklist is preliminary and does not determine legal applicability.
              Verify current rules, thresholds, dates, and local requirements with
              official sources and a qualified professional.
            </p>
          </div>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 print:hidden">
        <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="mt-3 divide-y divide-slate-200">
          <details className="py-4">
            <summary className="cursor-pointer font-semibold text-slate-800">Does every startup need a company, GST registration, or DPIIT recognition?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">No. Entity form, tax registrations, licences, and recognition each have separate eligibility rules. Check the current law and official portal for your business facts.</p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-semibold text-slate-800">Can I rely on this guide or a sample contract as legal advice?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">No. This is general educational information. A sample must be adapted and reviewed for the specific parties, transaction, jurisdiction, and current law.</p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-semibold text-slate-800">Does choosing a State in the checklist identify all local requirements?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">No. The State entry is a reminder to check the relevant State and local authorities; the checklist does not determine which laws or licences apply.</p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-semibold text-slate-800">How can I get help with a specific business issue?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Use the <Link to="/consultation" className="font-semibold text-violet-800 underline">consultation request form</Link> to describe the issue. Submitting a request does not by itself create an advocate-client relationship.</p>
          </details>
        </div>
      </section>

      <footer className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
        <strong>Important:</strong> This Startup Guide is for general information, not legal,
        tax, accounting, or investment advice. It is not a complete list of obligations,
        and it does not state that every registration or law applies to every startup.
        Rules, thresholds, exemptions, commencement dates, and State requirements may
        change. Verify current official sources and obtain advice suited to your facts.
      </footer>
    </main>
  );
}
