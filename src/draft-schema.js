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

const YES_NO = ["Yes", "No"];

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
  addressField(`${prefix}Address`, `${role} full address (with PIN code)`, group),
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

const when = (name, equals) => ({ name, equals });
const CHEQUE_ONLY = when("noticeIssue", "Dishonoured cheque");
const BPL_ONLY = when("feeMode", "BPL card holder (fee exempt, copy enclosed)");
const COMPANY_RECIPIENT = when("recipientType", "Company / firm");
const INTERIM_YES = when("interimReliefNeeded", "Yes");
const PRIOR_COMPLAINT_YES = when("priorComplaintsMade", "Yes");

export const DOCUMENT_SCHEMAS = {
  "Basic Petition": {
    instruction: [
      "Draft a preliminary petition for the selected court or authority.",
      "Use the court name exactly as supplied in the heading, then a cause title with petitioner and respondent names, father's/husband's names, ages and addresses.",
      "Follow the required sections in the order given. Use the statute, provision and jurisdiction basis only if supplied.",
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
        placeholder: "e.g. Civil suit for recovery of money",
      }),
      f("governingLaw", "Law or provision under which the petition is filed (optional)", {
        group: "Court",
        maxLength: 300,
        required: false,
        placeholder: "e.g. Order XXXVII CPC, or Article 226",
        helpText: "Leave blank if you are not sure. The draft will not guess a provision.",
      }),
      f("jurisdictionBasis", "Why this court has jurisdiction (optional)", {
        group: "Court",
        maxLength: 400,
        required: false,
        helpText: "For example: the defendant lives here, or the cause of action arose here.",
      }),
      ...placeFields("Court"),
      ...partyFields("petitioner", "Petitioner", "Parties"),
      select("petitionerStatus", "Petitioner is", ["Individual", "Proprietor of a firm", "Company / firm"], {
        group: "Parties",
      }),
      ...partyFields("respondent", "Respondent", "Parties"),
      area("facts", "Material facts (numbered, in date order)", 3000, 20, { group: "Facts" }),
      date("causeOfActionDate", "Date the cause of action arose", { group: "Facts" }),
      f("causeOfActionPlace", "Place the cause of action arose", { group: "Facts", maxLength: 150 }),
      area("grounds", "Grounds / legal basis", 2000, 0, {
        group: "Facts",
        required: false,
        helpText: "Leave blank if you are not sure. The draft will not invent grounds.",
      }),
      f("claimValue", "Value of the subject matter (Rs)", {
        group: "Relief",
        maxLength: 30,
        helpText: "Needed for court fee and forum. Enter the amount, or 'not applicable'.",
      }),
      f("courtFeePaid", "Court fee paid (Rs, optional)", { group: "Relief", maxLength: 30, required: false }),
      area("relief", "Prayer / relief sought (one item per line)", 1500, 5, { group: "Relief" }),
      select("interimReliefNeeded", "Do you need interim relief?", YES_NO, { group: "Relief" }),
      area("interimRelief", "Interim relief sought", 800, 5, { group: "Relief", required: false, showIf: INTERIM_YES }),
      area("annexures", "Documents to annex (one per line)", 1000, 0, { group: "Relief", required: false }),
      f("advocateName", "Advocate name (optional)", { group: "Advocate", maxLength: 100, required: false }),
      f("advocateEnrolment", "Advocate enrolment number (optional)", {
        group: "Advocate",
        maxLength: 60,
        required: false,
      }),
      date("documentDate", "Date of petition", { group: "Advocate" }),
    ],
  },

  "Legal Notice (non-payment / cheque bounce)": {
    instruction: [
      "Draft a legal notice, not a court pleading.",
      "Heading 'LEGAL NOTICE'; date and place; sender block; recipient block; subject line.",
      "If an advocate sends it, use 'Under instructions from my client' wording and show the advocate's name and enrolment number. Otherwise the sender writes in person.",
      "Body: numbered facts with dates and amounts exactly as supplied. For a cheque case, state the cheque details and the bank's return reason.",
      "For a cheque notice, refer to Section 138 of the Negotiable Instruments Act, 1881 and the 15-day period. Do not state any other consequence beyond the supplied details.",
      "State the amount demanded, the period given and the mode of service. Signature block blank.",
    ].join(" "),
    fields: [
      f("sender", "Sender full name", { group: "Sender", maxLength: 100 }),
      f("senderRelation", "Sender father's / husband's name", { group: "Sender", maxLength: 100, required: false }),
      addressField("senderAddress", "Sender full address (with PIN code)", "Sender"),
      f("senderMobile", "Sender mobile", { group: "Sender", maxLength: 15, required: false }),
      f("senderEmail", "Sender email", { group: "Sender", maxLength: 254, required: false }),
      f("senderAdvocate", "Advocate name and enrolment no. (only if sent through an advocate)", {
        group: "Sender",
        maxLength: 200,
        required: false,
      }),
      select("recipientType", "Recipient is", ["Individual", "Company / firm", "Government body"], { group: "Recipient" }),
      f("recipient", "Recipient full name / company or firm name", { group: "Recipient", maxLength: 150 }),
      f("recipientDesignation", "Recipient's designation (for company, e.g. Director / Proprietor)", {
        group: "Recipient",
        maxLength: 100,
        required: false,
        showIf: COMPANY_RECIPIENT,
      }),
      addressField("recipientAddress", "Recipient full address (with PIN code)", "Recipient"),
      f("recipientEmail", "Recipient email", { group: "Recipient", maxLength: 254, required: false }),
      select("noticeIssue", "Notice relates to", ["Unpaid dues", "Dishonoured cheque", "Other"], { group: "Matter" }),
      f("agreementRef", "Agreement / invoice / order reference and date", {
        group: "Matter",
        maxLength: 200,
        required: false,
      }),
      area("priorDemands", "Earlier reminders or demands (dates and how made)", 800, 0, {
        group: "Matter",
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
      "Recitals: the owner's ownership and the purpose of use as supplied.",
      "Numbered clauses in the order given; include a clause only where the user supplied its terms.",
      "Closing: blank signature lines for the licensor and licensee, and two witness blocks with the name and address supplied.",
      "Do not calculate an end date or add any clause the user did not supply. Do not state the agreement is registered or stamped.",
    ].join(" "),
    fields: [
      ...partyFields("owner", "Owner / licensor", "Owner"),
      ...partyFields("occupant", "Tenant / licensee", "Tenant"),
      f("propertyAddress", "Property full address (with PIN code)", { group: "Property", maxLength: 300 }),
      select("propertyType", "Property type", ["Flat / apartment", "House / villa", "Shop / office", "Other"], {
        group: "Property",
      }),
      select("propertyUse", "Purpose of use", ["Residential", "Commercial", "Other"], { group: "Property" }),
      f("floorNumber", "Floor number (optional)", { group: "Property", maxLength: 30, required: false }),
      f("propertyArea", "Built-up area (sq ft)", { group: "Property", maxLength: 30, required: false }),
      select("furnishing", "Furnishing", ["Unfurnished", "Semi-furnished", "Fully furnished"], { group: "Property" }),
      area("fixtures", "Fixtures and fittings provided (e.g. fans, geyser, AC, modular kitchen)", 500, 0, {
        group: "Property",
        required: false,
      }),
      date("startDate", "Start date", { group: "Terms" }),
      date("possessionDate", "Date of possession (if different from start date)", {
        group: "Terms",
        required: false,
      }),
      f("term", "Duration", { group: "Terms", maxLength: 100, placeholder: "e.g. 11 months" }),
      f("monthlyRent", "Monthly rent / licence fee (Rs)", { group: "Terms", maxLength: 50 }),
      f("rentDueDate", "Rent due day of each month", {
        group: "Terms",
        maxLength: 50,
        placeholder: "e.g. 5th of each month",
      }),
      f("lateFee", "Late payment charge (optional)", { group: "Terms", maxLength: 100, required: false }),
      f("escalation", "Yearly increase (optional)", { group: "Terms", maxLength: 100, required: false }),
      f("securityDeposit", "Security deposit (Rs)", { group: "Terms", maxLength: 50 }),
      f("depositRefund", "Deposit refund timing (e.g. within 30 days after vacating)", {
        group: "Terms",
        maxLength: 150,
        required: false,
      }),
      f("lockIn", "Lock-in period (optional)", { group: "Terms", maxLength: 100, required: false }),
      f("noticePeriod", "Notice period for termination", { group: "Terms", maxLength: 100 }),
      f("maintenance", "Who pays society maintenance", { group: "Terms", maxLength: 300 }),
      f("utilities", "Who pays electricity, water and gas", { group: "Terms", maxLength: 300 }),
      select("subletting", "Subletting allowed?", ["No", "Yes, with written consent"], { group: "Terms" }),
      select("renewal", "Renewal", ["Renewable by mutual agreement", "Not renewable"], { group: "Terms" }),
      select("repairs", "Repairs", ["Owner carries out structural repairs; tenant carries out minor repairs", "Tenant carries out all repairs", "Owner carries out all repairs"], {
        group: "Terms",
      }),
      select("policeVerification", "Police verification of tenant", ["Tenant to complete before occupation", "Not required"], {
        group: "Terms",
      }),
      select("stampDutyBy", "Stamp duty and registration paid by", ["Owner", "Tenant", "Shared equally"], {
        group: "Terms",
      }),
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
      "Numbered first-person statements using only the supplied facts; a purpose statement.",
      "Closing: deponent signature line blank; a verification paragraph; place and date blank; an oath or affirmation block for the notary or oath commissioner, blank.",
      "Do not claim the affidavit has been sworn, notarised or attested. Do not name an oath commissioner or notary.",
    ].join(" "),
    fields: [
      f("deponent", "Deponent full name", { group: "Deponent", maxLength: 100 }),
      f("deponentRelation", "Father's / husband's / wife's name", { group: "Deponent", maxLength: 100 }),
      f("deponentAge", "Age", { group: "Deponent", maxLength: 3 }),
      f("deponentOccupation", "Occupation", { group: "Deponent", maxLength: 100, required: false }),
      addressField("deponentAddress", "Full address (with PIN code)", "Deponent"),
      f("nationality", "Nationality", { group: "Deponent", maxLength: 50, placeholder: "Indian" }),
      f("identityProof", "ID proof you hold (type only, e.g. Aadhaar, Passport)", {
        group: "Deponent",
        maxLength: 60,
        required: false,
      }),
      select(
        "purpose",
        "Purpose of affidavit",
        [
          "Name change",
          "Address proof",
          "Bank / KYC",
          "Passport / visa",
          "Police verification",
          "Income / residence",
          "Court use",
          "Other",
        ],
        { group: "Purpose" }
      ),
      area("purposeDetails", "Details of the purpose (e.g. old and new name, which bank or authority)", 500, 0, {
        group: "Purpose",
        required: false,
      }),
      area("facts", "Facts to be affirmed (one per line)", 3000, 20, { group: "Purpose" }),
      select("oathBefore", "Affirmation will be taken before", ["Notary", "Oath commissioner", "Magistrate", "Not decided"], {
        group: "Purpose",
      }),
      ...placeFields("Place"),
      date("documentDate", "Date of affidavit", { group: "Place" }),
    ],
  },

  NDA: {
    instruction: [
      "Prepare an unsigned non-disclosure agreement in standard Indian form, one-way or mutual as stated.",
      "Title; date of agreement; parties block with name, entity type, registered address and authorised signatory; recitals stating the purpose.",
      "Numbered clauses in the order given; include an optional clause only where the user supplied its terms.",
      "For a mutual NDA, each party both discloses and receives. For a one-way NDA, only the disclosing party's information is covered.",
      "Closing: blank signature lines for each authorised signatory, and two witness lines with blank name and address.",
      "Do not state that the NDA is signed or stamped.",
    ].join(" "),
    fields: [
      select("ndaType", "Agreement type", ["One-way (only one party discloses)", "Mutual (both parties disclose)"], {
        group: "Agreement",
      }),
      f("disclosingParty", "Disclosing party name and entity type", { group: "Parties", maxLength: 200 }),
      addressField("disclosingAddress", "Disclosing party registered address (with PIN code)", "Parties"),
      f("receivingParty", "Receiving party name and entity type", { group: "Parties", maxLength: 200 }),
      addressField("receivingAddress", "Receiving party registered address (with PIN code)", "Parties"),
      f("signatory", "Authorised signatory names (if known)", { group: "Parties", maxLength: 300, required: false }),
      area("purpose", "Purpose for sharing information", 800, 5, { group: "Terms" }),
      area("confidentialInformation", "Information to be kept confidential", 1500, 10, { group: "Terms" }),
      area("exclusions", "Information that is NOT confidential (optional)", 800, 0, { group: "Terms", required: false }),
      area("permittedDisclosures", "Disclosures allowed (e.g. to employees, advisers, or by law) (optional)", 600, 0, {
        group: "Terms",
        required: false,
      }),
      f("duration", "Confidentiality period", { group: "Terms", maxLength: 100, placeholder: "e.g. 3 years" }),
      date("effectiveDate", "Effective date", { group: "Terms" }),
      select("returnOrDestroy", "On termination, the receiving party must", ["Return all information", "Destroy all information", "Return or destroy", "Not specified"], {
        group: "Terms",
      }),
      select("nonSolicitation", "Non-solicitation of staff included?", YES_NO, { group: "Terms" }),
      select("remedies", "Injunctive relief for breach", YES_NO, { group: "Terms" }),
      f("governingLaw", "Governing law (optional)", {
        group: "Terms",
        maxLength: 100,
        required: false,
        placeholder: "e.g. Laws of India",
      }),
      f("governingCourts", "Courts for disputes (city, optional)", { group: "Terms", maxLength: 100, required: false }),
      select("disputeResolution", "Dispute resolution", ["Courts only", "Arbitration (sole arbitrator)"], { group: "Terms" }),
      ...placeFields("Place"),
    ],
  },

  "Consumer Complaint": {
    instruction: [
      "Draft a consumer complaint in the format used before a Consumer Disputes Redressal Commission.",
      "Heading: 'BEFORE THE [commission level] CONSUMER DISPUTES REDRESSAL COMMISSION, [place]' using the commission level supplied, or the neutral heading if 'Not sure'. Complaint number left blank.",
      "Complainant and opposite party blocks with names, father's names, ages, addresses and mobile.",
      "Follow the required sections in the order given; include limitation and jurisdiction statements only as the user confirmed them.",
      "Relief clause split into refund, compensation, litigation cost and interest as supplied.",
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
      addressField("businessAddress", "Opposite party registered / office address (with PIN code)", "Opposite party"),
      f("businessGst", "Opposite party GSTIN (optional)", { group: "Opposite party", maxLength: 20, required: false }),
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
      select("limitationConfirmed", "Is the complaint filed within two years of the problem?", YES_NO, { group: "Court" }),
      f("productOrService", "Product or service", { group: "Transaction", maxLength: 200 }),
      f("invoiceNumber", "Invoice / bill / order number", { group: "Transaction", maxLength: 100, required: false }),
      date("purchaseDate", "Purchase / booking date", { group: "Transaction" }),
      f("amountPaid", "Amount paid (Rs)", { group: "Transaction", maxLength: 50 }),
      f("paymentMode", "Payment mode", { group: "Transaction", maxLength: 100, placeholder: "e.g. UPI, credit card" }),
      f("warranty", "Warranty or guarantee period (optional)", { group: "Transaction", maxLength: 100, required: false }),
      select(
        "deficiencyType",
        "Type of complaint",
        ["Defective goods", "Deficiency in service", "Unfair trade practice", "Other"],
        { group: "Transaction" }
      ),
      date("defectDate", "Date the problem was first noticed", { group: "Transaction" }),
      select("priorComplaintsMade", "Did you complain to the seller before?", YES_NO, { group: "Facts" }),
      area("priorComplaints", "Complaints to the seller (dates, how made, and replies received)", 1200, 5, {
        group: "Facts",
        showIf: PRIOR_COMPLAINT_YES,
      }),
      select("replacementOffered", "Did the seller offer a repair, replacement or refund?", ["Yes, I rejected it", "Yes, I accepted it", "No"], {
        group: "Facts",
      }),
      area("facts", "What happened, in order, with dates", 3000, 20, { group: "Facts" }),
      f("refundAmount", "Refund sought (Rs)", { group: "Relief", maxLength: 30, required: false }),
      f("compensation", "Compensation for mental agony / loss (Rs)", { group: "Relief", maxLength: 30, required: false }),
      f("litigationCost", "Litigation cost (Rs)", { group: "Relief", maxLength: 30, required: false }),
      f("interest", "Interest (if you are asking for it)", { group: "Relief", maxLength: 100, required: false }),
      area("otherRelief", "Any other relief you are asking for", 800, 0, { group: "Relief", required: false }),
      area("annexures", "Documents annexed (one per line, e.g. invoice, warranty, complaint emails)", 1000, 0, {
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
      "State that no reasons are given for the request, as Section 6(2) provides. Mention the fee mode only as supplied, including any BPL exemption.",
      "Do not add an appeal, exemption analysis, response deadline, or any claim that the application was filed. Signature block blank; place and date blank.",
    ].join(" "),
    fields: [
      f("pioDesignation", "PIO designation (if known)", {
        group: "Authority",
        maxLength: 150,
        required: false,
        placeholder: "e.g. Public Information Officer",
      }),
      f("publicAuthority", "Public authority / department name", { group: "Authority", maxLength: 300 }),
      addressField("authorityAddress", "Public authority address (with PIN code)", "Authority"),
      f("subjectOfRequest", "Subject of the request (one line)", {
        group: "Request",
        maxLength: 200,
        placeholder: "e.g. Sanctioned estimate for road repair",
      }),
      area("informationRequested", "Information or records requested (one per line)", 2000, 10, { group: "Request" }),
      f("timePeriod", "Relevant period", { group: "Request", maxLength: 100, required: false }),
      f("fileReference", "File or reference number, if known (optional)", {
        group: "Request",
        maxLength: 100,
        required: false,
      }),
      f("previousApplication", "Earlier RTI application number, if this follows one (optional)", {
        group: "Request",
        maxLength: 100,
        required: false,
      }),
      select("responseFormat", "Preferred response format", ["Copies of records", "Inspection of records", "Electronic copies", "Other"], {
        group: "Request",
      }),
      f("applicantName", "Applicant full name", { group: "Applicant", maxLength: 100 }),
      addressField("applicantAddress", "Applicant postal address (with PIN code)", "Applicant"),
      f("applicantPhone", "Applicant phone", { group: "Applicant", maxLength: 15, required: false }),
      f("applicantEmail", "Applicant email", { group: "Applicant", maxLength: 254, required: false }),
      select("feeMode", "Application fee", ["Fee paid by cash / IPO / DD", "BPL card holder (fee exempt, copy enclosed)"], {
        group: "Fee",
      }),
      f("ipoNumber", "IPO / DD number and date (if fee paid)", { group: "Fee", maxLength: 100, showIf: when("feeMode", "Fee paid by cash / IPO / DD") }),
      f("bplCardNumber", "BPL card number", { group: "Fee", maxLength: 60, showIf: BPL_ONLY }),
      ...placeFields("Place"),
      date("documentDate", "Date of application", { group: "Place" }),
    ],
  },
};

export const DOCUMENT_TYPES = Object.keys(DOCUMENT_SCHEMAS);
