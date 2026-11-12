// Reviewed-reference sheets the drafter may cite. Keep this list short and have a
// qualified advocate verify every entry before launch. The model is told it may cite
// ONLY provisions listed here and must never invent others.
export const LEGAL_REFERENCES = {
  "Basic Petition": {
    provisions: [],
    outline:
      "Court heading; cause title (petitioner v. respondent); petition title; numbered facts; grounds ONLY if supplied; prayer; blank place/date and signature lines.",
    reviewerChecks: [
      "Confirm the court or forum, the governing statute, and that the court's prescribed format is followed.",
      "Confirm limitation, the court fee for the stated subject-matter value (state-specific), and whether a verification affidavit is required.",
      "Confirm that the cause title lists all parties and that each party's details match their ID documents.",
    ],
  },
  "Legal Notice (non-payment / cheque bounce)": {
    provisions: [
      "Negotiable Instruments Act, 1881, Section 138 (dishonour of cheque for insufficiency of funds) - only when the notice relates to a dishonoured cheque",
      "Negotiable Instruments Act, 1881, Section 138(b): demand notice must be given within 30 days of receiving information from the bank of the dishonour",
      "Negotiable Instruments Act, 1881, Section 138(c): drawer has 15 days from receipt of the notice to make payment",
      "Indian Contract Act, 1872 - only for unpaid dues based on an agreement",
    ],
    outline:
      "LEGAL NOTICE; sender and recipient blocks; subject; numbered facts; demand; closing asking for a response; blank signature line.",
    reviewerChecks: [
      "For a cheque case, confirm the notice is sent within 30 days of the bank's return memo and that cheque number, date, amount, bank and return-memo date are stated correctly.",
      "Confirm the mode and proof of service (registered post / email) and the response period.",
    ],
  },
  "Rent / Leave and Licence Agreement": {
    provisions: [
      "Registration Act, 1908, Section 17(1)(d): a lease of immovable property for more than one year must be registered",
      "Transfer of Property Act, 1882, Section 105 (definition of lease)",
      "Indian Contract Act, 1872",
    ],
    outline:
      "Title; date and place; parties; property; numbered clauses (term, rent, deposit, maintenance/utilities, termination); blank signature lines.",
    reviewerChecks: [
      "Stamp duty and registration requirements vary by State; confirm them for the property's State.",
      "Check lock-in, rent escalation, repair, police-verification and dispute clauses, none of which were drafted unless supplied.",
    ],
  },
  "General Affidavit": {
    provisions: ["Oaths Act, 1969"],
    outline:
      "AFFIDAVIT; deponent block; numbered first-person statements; unsigned verification section for the deponent to complete; blank place/date.",
    reviewerChecks: [
      "The affidavit must be sworn or affirmed before an authorised officer; stamp paper requirements vary by State and purpose.",
      "Confirm each statement is within the deponent's personal knowledge.",
    ],
  },
  NDA: {
    provisions: [
      "Indian Contract Act, 1872, Section 27 (agreements in restraint of trade are void)",
      "Indian Contract Act, 1872, Section 73 (compensation for breach)",
    ],
    outline:
      "Title; parties; recitals/purpose; numbered clauses (confidential information, duration, effective date); blank signature lines.",
    reviewerChecks: [
      "Consider exclusions, permitted disclosures, return/destruction of information, remedies, governing law and forum, none of which were drafted unless supplied.",
      "Check stamp duty requirements for the State.",
    ],
  },
  "Consumer Complaint": {
    provisions: [
      "Consumer Protection Act, 2019, Section 35 (manner of filing a complaint before the District Commission)",
      "Consumer Protection Act, 2019, Section 69 (limitation: two years from the date the cause of action arises)",
    ],
    outline:
      "Commission heading; parties with addresses; subject; numbered facts; relief; blank place/date and signature lines.",
    reviewerChecks: [
      "Confirm the Commission level from the claim value under the Consumer Protection (Jurisdiction of the District, State and National Commissions) Rules, 2021, and the territorial jurisdiction of the place where the seller operates or the complainant lives.",
      "Confirm limitation (two years from the cause of action) and the fee payable for the claim amount.",
      "Confirm the complaint lists every annexure and that the verification is signed by the complainant.",
    ],
  },
  "RTI Application": {
    provisions: [
      "Right to Information Act, 2005, Section 6(1) (request for information)",
      "Right to Information Act, 2005, Section 7(1) (disposal of request within 30 days)",
      "Right to Information Act, 2005, Section 6(2) (no reason need be given for the request)",
    ],
    outline:
      "Title; addressed to the Public Information Officer of the supplied authority; applicant block; numbered information points; response format; blank place/date and signature lines.",
    reviewerChecks: [
      "Confirm the Public Information Officer's designation and the application fee and payment mode for this authority (Central and State rules differ).",
      "Check whether any requested item may fall under a Section 8 exemption.",
    ],
  },
};
