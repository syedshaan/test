export const teamMembers = [
  {
    name: "Amirah Rizvi",
    role: "Legal research, policy, and public-service careers",
    image: "/amirah-rizvi.jpg",
    bio: "Amirah Rizvi is a legal professional with over four years of experience across key public institutions in India, including the Ministry of Labour and Employment, the Supreme Court of India, and the National Legal Services Authority (NALSA). Her work spans legal research, legislative and regulatory drafting, judicial policy, social security, and access to justice. She holds a B.A. LL.B. (Hons.) and an LL.M. from Aligarh Muslim University. She has contributed to research reports, memoranda, regulatory frameworks, and institutional initiatives, and served as Joint Editor of My Legal Friend, a Hindi legal magazine. Her knowledge-sharing includes workshops and mentoring for the Supreme Court Law Clerk-cum-Research Associate examination, judicial services examinations, and other law-related public-service examinations, as well as interview readiness, CV development, and career guidance.",
  },
  {
    name: "Akash Singh",
    role: "Litigation counsel",
    image: "/akash-singh.jpg",
    bio: "Advocate Akash Singh is a litigation counsel with more than seven years of experience before the Supreme Court of India, High Courts, District Courts, and specialised tribunals including NCLAT, NCDRC, and TDSAT. He practised in the chambers of a Supreme Court Advocate-on-Record, working on criminal defence, bail applications, quashing petitions, special leave petitions, civil and consumer matters, insolvency, and matrimonial matters. He previously served as a Law Clerk-cum-Research Associate to the Supreme Court and contributed to the National Court Management Policy and Action Plan, 2024, and other projects of the National Court Management Systems and the Case Flow Management Committee. His research features in three Supreme Court-published reports on judicial reform. He is an alumnus of the Campus Law Centre, University of Delhi, and has reached the interview stage for UP PCS-J and Haryana ADA and appeared in the mains for the Delhi Judicial Service and other examinations.",
  },
  {
    name: "Aman Rizvi",
    role: "Data privacy, data protection, and FinTech",
    image: "/aman-rizvi.jpg",
    bio: "Aman Rizvi is a legal professional with five years of litigation experience, specialising in data privacy, data protection, and FinTech laws. His work includes the Digital Personal Data Protection Act, 2023, data-protection compliance, privacy policies, consent management, and regulatory analysis. He drafts and reviews consent notices, data-protection agreements, internal privacy policies, and personal-data breach response policies. His work also covers Data Protection Gap Assessments, Records of Processing Activities (RoPA), privacy-compliance frameworks, and research on privacy, artificial intelligence, and emerging technologies.",
  },
  {
    name: "Luv Tripathi",
    role: "Judicial research, legal drafting, and dispute resolution",
    image: "/luv-tripathi.jpg",
    bio: "Luv Tripathi is a legal professional with experience in judicial research, legal drafting, and dispute resolution. He served for two years as a Law Clerk-cum-Research Associate at the Supreme Court of India, gaining experience in judicial proceedings, case analysis, legal research, and research-based legal inputs. He holds a B.A. LL.B. from Jamia Millia Islamia and has pursued a postgraduate diploma course in International Commercial Arbitration from the National Law School of India University (NLSIU). His experience also includes law-firm work in legal drafting, dispute resolution, and analysis of complex legal issues. He brings a structured, analytical, and solution-oriented approach to legal matters, with a particular interest in arbitration and the practical application of law.",
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1LijFmDgJJ/?mibextid=wwXIfr",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1T7WUtAqxW/?mibextid=wwXIfr",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/pleadlaw/",
  },
];

export default function Team() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <header className="hero-glow rounded-3xl px-6 py-10 text-white md:px-10 md:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">People behind Pleadlaw</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Our team</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-indigo-100/85">
          Meet the legal professionals contributing experience in public institutions,
          litigation, privacy, judicial research, legal drafting, and dispute resolution.
        </p>
      </header>

      <section aria-label="Pleadlaw team members" className="mt-8 grid gap-5 md:grid-cols-2">
        {teamMembers.map((member, index) => (
          <article key={member.name} className="surface-card rounded-2xl p-6 md:p-8">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
              <img
                src={member.image}
                alt={`${member.name}, ${member.role}`}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="mt-5 flex items-start gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                  Team member {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{member.name}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">{member.role}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{member.bio}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Follow Pleadlaw</h2>
          <p className="mt-1 text-sm text-slate-600">Find our social updates and announcements.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((item, index) => (
            <a
              key={`${item.label}-${index}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-violet-800 hover:border-violet-300 hover:bg-violet-50"
            >
              {item.label}{index < 2 && item.label === "Facebook" ? ` ${index + 1}` : ""} ↗
            </a>
          ))}
        </div>
      </section>
      <p className="mt-5 text-xs leading-relaxed text-slate-500">
        Professional biographies describe the experience provided for this page and
        are not a guarantee of any particular result or engagement.
      </p>
    </main>
  );
}
