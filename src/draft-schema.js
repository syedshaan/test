export const STATES_AND_TERRITORIES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Puducherry",
];

export const COURT_TYPES = [
  "Supreme Court of India",
  "High Court",
  "District Court",
  "Civil Court",
  "Judicial Magistrate Court",
  "Consumer Commission",
  "Tribunal",
  "Other",
];

const f = (name, label, opts = {}) => ({
  name,
  label,
  type: "text",
  maxLength: 150,
  required: true,
  group: "Details",
  ...opts,
});

const area = (name, label, maxLength, minLength = 10, opts = {}) =>
  f(name, label, { type: "textarea", maxLength, minLength, ...opts });

const date = (name, label, opts = {}) =>
  f(name, label, { type: "date", maxLength: 10, ...opts });

const select = (name, label, options, opts = {}) => ({
  name,
  label,
  type: "select",
  maxLength: Math.max(...options.map((o) => o.length)),
  options,
  required: true,
  group: "Details",
  ...opts,
});

const addressField = (name, label, group) => area(name, label, 400, 10, { group });

const partyFields = (prefix, role, group) => [
  f(`${prefix}Name`, `${role} full name`, { group, maxLength: 100 }),
  f(`${prefix}Relation`, `${role} father's / husband's name`, { group, maxLength: 100 }),
  f(`${prefix}Age`, `${role} age`, { group, maxLength: 3, placeholder: "e.g. 34" }),
  f(`${prefix}Occupation`, `${role} occupation`, { group, maxLength: 100, required: false }),
  addressField(`${prefix}Address`, `${role} full address`, group),
  f(`${prefix}Mobile`, `${role} mobile`, { group, maxLength: 15, required: false }),
  f(`${prefix}Email`, `${role} email`, { group, maxLength: 254, required: false }),
];

const placeFields = (group) => [
  select("stateOrTerritory", "State / Union Territory", STATES_AND_TERRITORIES, { group }),
  f("place", "City / place of execution and filing", {
    group,
    maxLength: 100,
    placeholder: "e.g. Jaipur",
    helpText: "Used in the place line of the document. It does not decide jurisdiction.",
  }),
];

const CHEQUE_ONLY = { name: "noticeIssue", equals: "Dishonoured cheque" };

export const DOCUMENT_SCHEMAS = {
  "Basic Petition": {
    instruction: [
      "Draft a preliminary petition for the selected court or authority.",
      "Use the court name exactly as supplied in the heading, then a cause title with petitioner and respondent names, father's/husband's names, ages and addresses.",
      "Order: court heading; cause title; petition title; description of the parties; numbered facts in date order; cause of action with date and place; grounds only if supplied; jurisdiction statement only if supplied; subject-matter value and court fee note; prayer; interim relief if supplied; list of annexures; verification; place, date and signature blocks for the petitioner and advocate.",
      "Do not invent a case number, filing date, statutory basis, limitation statement or affidavit contents.",
    ].join(" "),
    fields: [
      select("courtType", "Court / authority", COURT_TYPES, { group: "Court" }),
      f("courtName", "Court name exactly as it should appear in the heading", {
        group: "Court",
        maxLength: 200,
        placeholder: "e.g. Court of the Civil Judge (Junior Division), Jaipur",
        helpText: "Use the court's full name as it appears on its website or filing counter.",
      }),
      f("petitionType", "Type of petition", {
        group: "Court",
        maxLength: 200,
        placeholder: "e.g. Civil suit for recovery of possession",
      }),
      ...placeFields("Court"),
      ...partyFields("petitioner", "Petitioner", "Parties"),
      ...partyFields("respondent", "Respondent", "Parties"),
      area("facts", "Material facts (numbered, in date order)", 3000, 20, { group: "Facts" }),
      date("causeOfActionDate", "Date the cause of action arose", { group: "Facts" }),
      area("grounds", "Grounds / legal basis", 2000, 0, {
        group: "Facts",
        required: false,
        helpText: "Leave blank if you are not sure. The draft will not invent grounds.",
      }),
      f("claimValue", "Value of the subject matter (Rs)", {
        group: "Relief",
        maxLength: 30,
        required: false,
        helpText: "Needed for court fee and forum. Enter the amount, or 'not applicable'.",
      }),
      area("relief", "Prayer / relief sought", 1500, 5, { group: "Relief" }),
      area("interimRelief", "Interim relief sought (optional)", 800, 0, { group: "Relief", required: false }),
      area("annexures", "Documents to annex (one per line)", 1000, 0, { group: "Relief", required: false }),
      date("documentDate", "Date of petition", { group: "Relief" }),
    ],
  },

  "Legal Notice (non-payment / cheque bounce)": {
    instruction: [
      "Draft a legal notice, not a court pleading.",
      "Heading 'LEGAL NOTICE'; date and place; sender block; recipient block; subject line.",
      "If the sender is an advocate, use 'Under instructions from my client' wording and show the advocate's name and enrolment number. Otherwise, the notice is from the sender in person.",
      "Body: numbered facts with dates and amounts exactly as supplied. For a cheque case, state the cheque number, date, amount, bank, date of the return memo and reason for dishonour.",
      "For a cheque notice, refer to Section 138 of the Negotiable Instruments Act, 1881 and the 15-day period under Section 138(c) only as stated in the permitted references. State no consequence beyond what is in those references.",
      "State the amount demanded, the period given to pay and the mode of service the user chose. Signature block blank.",
    ].join(" "),
    fields: [
      f("sender", "Sender full name", { group: "Sender", maxLength: 100 }),
      f("senderRelation", "Sender father's / husband's name", { group: "Sender", maxLength: 100, required: false }),
      addressField("senderAddress", "Sender full address", "Sender"),
      f("senderMobile", "Sender mobile", { group: "Sender", maxLength: 15, required: false }),
      f("senderEmail", "Sender email", { group: "Sender", maxLength: 254, required: false }),
      f("senderAdvocate", "Advocate name and enrolment no. (only if sent through an advocate)", {
        group: "Sender",
        maxLength: 200,
        required: false,
      }),
      f("recipient", "Recipient full name / company name", { group: "Recipient", maxLength: 150 }),
      addressField("recipientAddress", "Recipient full address", "Recipient"),
      f("recipientEmail", "Recipient email", { group: "Recipient", maxLength: 254, required: false }),
      select("noticeIssue", "Notice relates to", ["Unpaid dues", "Dishonoured cheque", "Other"], { group: "Matter" }),
      f("agreementRef", "Agreement / invoice / order reference and date", {
        group: "Matter",
        maxLength: 200,
        required: false,
      }),
      f("chequeNumber", "Cheque number", { group: "Cheque", maxLength: 30, showIf: CHEQUE_ONLY }),
      date("chequeDate", "Cheque date", { group: "Cheque", showIf: CHEQUE_ONLY }),
      f("chequeAmount", "Cheque amount (Rs)", { group: "Cheque", maxLength: 30, showIf: CHEQUE_ONLY }),
      f("chequeBank", "Drawn on (bank and branch)", { group: "Cheque", maxLength: 150, showIf: CHEQUE_ONLY }),
      date("returnMemoDate", "Date of bank return memo", { group: "Cheque", showIf: CHEQUE_ONLY }),
      f("returnReason", "Reason for dishonour (as per bank memo)", {
        group: "Cheque",
        maxLength: 150,
        showIf: CHEQUE_ONLY,
        placeholder: "e.g. Funds insufficient",
      }),
      area("facts", "Facts with dates and amounts", 2500, 20, { group: "Facts" }),
      f("amountDue", "Total amount demanded (Rs)", { group: "Demand", maxLength: 30 }),
      f("paymentPeriod", "Period given to pay", {
        group: "Demand",
        maxLength: 100,
        placeholder: "e.g. 15 days from receipt of this notice",
      }),
      select("serviceMode", "Mode of service", ["Registered post AD", "Speed post", "Email", "Hand delivery"], {
        group: "Demand",
      }),
      area("demand", "What the recipient must do", 800, 5, { group: "Demand" }),
      f("place", "Place of notice", { group: "Demand", maxLength: 100 }),
      date("documentDate", "Date of notice", { group: "Demand" }),
    ],
  },

  "Rent / Leave and Licence Agreement": {
    instruction: [
      "Prepare an unsigned leave-and-licence or rent agreement in standard Indian form.",
      "Title; 'This agreement is made on [date] at [place] between' the owner/licensor and the tenant/licensee, with name, father's name, age, occupation and address for each.",
      "Recitals: the owner's ownership of the property and the purpose (residential or commercial) as supplied.",
      "Numbered clauses in order: property description (address, floor, built-up area as supplied); term with start date and duration; licence fee or rent, due date and mode of payment; escalation only if supplied; security deposit and refund conditions; lock-in only if supplied; maintenance, electricity and water responsibility; notice period for termination; subletting position as supplied; governing city and courts only if supplied.",
      "Closing: 'In witness whereof' with blank signature lines for the licensor and licensee, and two witness blocks with the name and address supplied.",
      "Do not calculate an end date or add any clause the user did not supply. Do not state the agreement is registered or stamped.",
    ].join(" "),
    fields: [
      ...partyFields("owner", "Owner / licensor", "Owner"),
      ...partyFields("occupant", "Tenant / licensee", "Tenant"),
      f("propertyAddress", "Property full address", { group: "Property", maxLength: 300 }),
      select("propertyUse", "Purpose of use", ["Residential", "Commercial", "Other"], { group: "Property" }),
      f("propertyArea", "Built-up area (sq ft)", { group: "Property", maxLength: 30, required: false }),
      date("startDate", "Start date", { group: "Terms" }),
      f("term", "Duration", { group: "Terms", maxLength: 100, placeholder: "e.g. 11 months" }),
      f("monthlyRent", "Monthly rent / licence fee (Rs)", { group: "Terms", maxLength: 50 }),
      f("rentDueDate", "Rent due day of each month", {
        group: "Terms",
        maxLength: 50,
        placeholder: "e.g. 5th of each month",
      }),
      f("escalation", "Yearly increase (optional)", { group: "Terms", maxLength: 100, required: false }),
      f("securityDeposit", "Security deposit (Rs)", { group: "Terms", maxLength: 50 }),
      f("lockIn", "Lock-in period (optional)", { group: "Terms", maxLength: 100, required: false }),
      f("noticePeriod", "Notice period for termination", { group: "Terms", maxLength: 100 }),
      f("maintenance", "Who pays maintenance, electricity and water", { group: "Terms", maxLength: 300 }),
      select("subletting", "Subletting allowed?", ["No", "Yes, with written consent"], { group: "Terms" }),
      f("witness1", "Witness 1 name and address", { group: "Witnesses", maxLength: 300 }),
      f("witness2", "Witness 2 name and address", { group: "Witnesses", maxLength: 300 }),
      ...placeFields("Place"),
      date("documentDate", "Date of agreement", { group: "Place" }),
    ],
  },

  "General Affidavit": {
    instruction: [
      "Prepare an unsigned affidavit in the standard Indian format for the stated purpose.",
      "Heading 'AFFIDAVIT'; then 'I, [name], [son/daughter/wife] of [father/husband], aged [age] years, [occupation], residing at [address], do hereby solemnly affirm and state as under:' using only supplied details.",
      "Numbered first-person statements using only the supplied facts; a purpose line stating why the affidavit is made.",
      "Closing: 'DEPONENT' signature line blank; a verification paragraph stating the contents are true to the deponent's knowledge; place and date blank.",
      "Do not claim the affidavit has been sworn, notarised or attested. Do not name an oath commissioner or notary.",
    ].join(" "),
    fields: [
      f("deponent", "Deponent full name", { group: "Deponent", maxLength: 100 }),
      f("deponentRelation", "Father's / husband's name", { group: "Deponent", maxLength: 100 }),
      f("deponentAge", "Age", { group: "Deponent", maxLength: 3 }),
      f("deponentOccupation", "Occupation", { group: "Deponent", maxLength: 100, required: false }),
      addressField("deponentAddress", "Full address", "Deponent"),
      f("nationality", "Nationality", { group: "Deponent", maxLength: 50, placeholder: "Indian" }),
      select(
        "purpose",
        "Purpose of affidavit",
        ["Name change", "Address proof", "Bank / KYC", "Passport / visa", "Police verification", "Income / residence", "Other"],
        { group: "Purpose" }
      ),
      area("facts", "Facts to be affirmed (one per line)", 3000, 20, { group: "Purpose" }),
      ...placeFields("Place"),
      date("documentDate", "Date of affidavit", { group: "Place" }),
    ],
  },

  NDA: {
    instruction: [
      "Prepare an unsigned non-disclosure agreement in standard Indian form, one-way or mutual as stated.",
      "Title; date of agreement; parties block with name, entity type, registered address and authorised signatory; recitals stating the purpose.",
      "Numbered clauses in order: definition of confidential information; exclusions only if supplied; obligations of confidentiality; permitted use; confidentiality period; effective date; return or destruction only if supplied; remedies only if supplied; governing law and courts only if supplied.",
      "For a mutual NDA, each party both discloses and receives. For a one-way NDA, only the disclosing party's information is covered.",
      "Closing: blank signature lines for each party's authorised signatory, and two witness lines with blank name and address.",
      "Do not state that the NDA is signed or stamped.",
    ].join(" "),
    fields: [
      select("ndaType", "Agreement type", ["One-way (only one party discloses)", "Mutual (both parties disclose)"], {
        group: "Agreement",
      }),
      f("disclosingParty", "Disclosing party name and entity type", { group: "Parties", maxLength: 200 }),
      addressField("disclosingAddress", "Disclosing party registered address", "Parties"),
      f("receivingParty", "Receiving party name and entity type", { group: "Parties", maxLength: 200 }),
      addressField("receivingAddress", "Receiving party registered address", "Parties"),
      f("signatory", "Authorised signatory names (if known)", { group: "Parties", maxLength: 300, required: false }),
      area("purpose", "Purpose for sharing information", 800, 5, { group: "Terms" }),
      area("confidentialInformation", "Information to be kept confidential", 1500, 10, { group: "Terms" }),
      area("exclusions", "Information that is NOT confidential (optional)", 800, 0, { group: "Terms", required: false }),
      f("duration", "Confidentiality period", { group: "Terms", maxLength: 100, placeholder: "e.g. 3 years" }),
      date("effectiveDate", "Effective date", { group: "Terms" }),
      f("governingCourts", "Courts for disputes (city, optional)", { group: "Terms", maxLength: 100, required: false }),
      select("stateOrTerritory", "State / Union Territory", STATES_AND_TERRITORIES, { group: "Place" }),
      f("place", "Place of execution", { group: "Place", maxLength: 100 }),
    ],
  },

  "Consumer Complaint": {
    instruction: [
      "Draft a consumer complaint in the format used before a Consumer Disputes Redressal Commission.",
      "Heading: 'BEFORE THE [commission level] CONSUMER DISPUTES REDRESSAL COMMISSION, [place]' using the commission level supplied, or the neutral heading if 'Not sure'. 'Complaint No. ____ of ____' left blank.",
      "Complainant and Opposite Party blocks with names, father's names, ages, addresses and mobile.",
      "Order: short subject; the parties; numbered facts in date order (purchase, payment, defect, complaints made to the seller and replies received); cause of action with date; limitation and jurisdiction statements only if supplied; relief clause split into refund, compensation, litigation cost and interest as supplied; documents annexed; verification; place, date and complainant's signature block.",
      "Do not invent invoice numbers, complaint dates, replies, or statutory sections other than those in the permitted references.",
    ].join(" "),
    fields: [
      ...partyFields("complainant", "Complainant", "Complainant"),
      f("businessName", "Opposite party name (seller / service provider)", { group: "Opposite party", maxLength: 150 }),
      f("businessDesignation", "Opposite party contact person and designation", {
        group: "Opposite party",
        maxLength: 150,
        required: false,
      }),
      addressField("businessAddress", "Opposite party registered / office address", "Opposite party"),
      select(
        "commissionLevel",
        "Consumer Commission level",
        ["District Commission", "State Commission", "National Commission", "Not sure"],
        {
          group: "Court",
          helpText: "Choose by the total claim amount. If you are not sure, the draft uses a neutral heading.",
        }
      ),
      f("claimValue", "Total value of claim (Rs)", { group: "Court", maxLength: 30 }),
      f("productOrService", "Product or service", { group: "Transaction", maxLength: 200 }),
      f("invoiceNumber", "Invoice / bill / order number", { group: "Transaction", maxLength: 100, required: false }),
      date("purchaseDate", "Purchase / booking date", { group: "Transaction" }),
      f("amountPaid", "Amount paid (Rs)", { group: "Transaction", maxLength: 50 }),
      f("paymentMode", "Payment mode", { group: "Transaction", maxLength: 100, placeholder: "e.g. UPI, credit card" }),
      select(
        "deficiencyType",
        "Type of complaint",
        ["Defective goods", "Deficiency in service", "Unfair trade practice", "Other"],
        { group: "Transaction" }
      ),
      date("defectDate", "Date the problem was first noticed", { group: "Transaction" }),
      area("facts", "What happened, in order, with dates", 3000, 20, { group: "Facts" }),
      area("priorComplaints", "Complaints made to the seller (dates and replies received)", 1200, 0, {
        group: "Facts",
        required: false,
      }),
      f("refundAmount", "Refund sought (Rs)", { group: "Relief", maxLength: 30, required: false }),
      f("compensation", "Compensation for mental agony / loss (Rs)", { group: "Relief", maxLength: 30, required: false }),
      f("litigationCost", "Litigation cost (Rs)", { group: "Relief", maxLength: 30, required: false }),
      f("interest", "Interest (if you are asking for it)", { group: "Relief", maxLength: 100, required: false }),
      area("otherRelief", "Any other relief you are asking for", 800, 0, { group: "Relief", required: false }),
      area("annexures", "Documents annexed (one per line, e.g. invoice, receipt, complaint emails)", 1000, 0, {
        group: "Relief",
        required: false,
      }),
      ...placeFields("Place"),
      date("documentDate", "Date of complaint", { group: "Place" }),
    ],
  },

  "RTI Application": {
    instruction: [
      "Draft an RTI application under Section 6(1) of the Right to Information Act, 2005.",
      "Heading 'APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005'; addressed to the Public Information Officer (PIO) of the supplied authority; applicant block with name, postal address, phone and email if supplied.",
      "Numbered points requesting the specific information or records supplied; the period if supplied; the preferred format of response.",
      "State that no reasons are given for the request, as Section 6(2) provides. Mention the fee mode only as supplied (including any BPL exemption).",
      "Do not add an appeal, exemption analysis, response deadline, or any claim that the application was filed. Signature block blank; place and date blank.",
    ].join(" "),
    fields: [
      f("pioDesignation", "PIO designation (if known)", {
        group: "Authority",
        maxLength: 150,
        required: false,
        placeholder: "e.g. Public Information Officer",
      }),
      f("publicAuthority", "Public authority / department name and address", { group: "Authority", maxLength: 300 }),
      f("applicant", "Applicant full name", { group: "Applicant", maxLength: 100 }),
      addressField("applicantAddress", "Applicant postal address", "Applicant"),
      f("applicantPhone", "Applicant phone", { group: "Applicant", maxLength: 15, required: false }),
      f("applicantEmail", "Applicant email", { group: "Applicant", maxLength: 254, required: false }),
      area("informationRequested", "Information or records requested (one per line)", 2000, 10, { group: "Request" }),
      f("timePeriod", "Relevant period", { group: "Request", maxLength: 100, required: false }),
      select("responseFormat", "Preferred response format", ["Copies of records", "Inspection of records", "Electronic copies", "Other"], {
        group: "Request",
      }),
      select("feeMode", "Application fee", ["Fee paid by cash / IPO / DD", "BPL card holder (fee exempt, copy enclosed)"], {
        group: "Request",
      }),
      ...placeFields("Place"),
      date("documentDate", "Date of application", { group: "Place" }),
    ],
  },
};

export const DOCUMENT_TYPES = Object.keys(DOCUMENT_SCHEMAS);
