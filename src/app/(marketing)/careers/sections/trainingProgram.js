// ─────────────────────────────────────────────────────────────
// Intensive Corporate Training Programme: page content
// Every word on /careers/intensive-corporate-training comes from this file.
//
// TO CONFIRM BEFORE PUBLISHING (from the management checklist):
//   1. fee.total            – total programme fee (currently hidden)
//   2. fee.instalments.share – instalment percentages (column hidden until all 3 are set)
//   3. glance "Outcome" wording vs the existing careers page (absorption timing)
//   4. salary basis after the internship (currently "based on your evaluation")
//   5. startBatchDate, howToApply.steps and contact details
//   6. refund / exit condition (add to fee.notes if needed)
// ─────────────────────────────────────────────────────────────

export const TRAINING_PROGRAM_SLUG = "intensive-corporate-training";
export const TRAINING_PROGRAM_PATH = `/careers/${TRAINING_PROGRAM_SLUG}`;

// Fill these in when confirmed. Empty string = not shown / fallback text used.
const TOTAL_FEE = ""; // e.g. "Rs. 50,000"
const START_BATCH_DATE = ""; // e.g. "1 December 2026"
const CONTACT_PHONE = "+91 81482 93231";
const CONTACT_PHONE_HREF = "tel:+918148293231";
const CONTACT_EMAIL = ""; // e.g. "careers@triwinz.com"

export const trainingProgram = {
  name: "Intensive Corporate Training Programme",
  shortName: "Corporate Training Programme",

  seo: {
    title:
      "Intensive Corporate Training & Internship for Full Stack Developers | TriWinz, Thiruvananthapuram",
    description:
      "Six months of on-the-job training and internship in Python, Django, PostgreSQL and React JS at TriWinz, with a path to a Junior Full Stack Developer role. Open to engineering, BCA, MCA and BSc Computer Science graduates.",
  },

  // 1. Hero
  hero: {
    eyebrow: "Intensive Corporate Training Programme",
    headline:
      "Learn on the job. Build real software. Grow into a Full Stack Developer at TriWinz.",
    subheadline:
      "A six-month on-the-job programme: three months of intensive, self-study-based corporate training at our development centre with guidance from TriWinz senior developers, followed by a three-month guided internship, with a pathway to join us as a Junior Full Stack Developer.",
    // icon: training | internship | scholarship | salary
    highlights: [
      { icon: "training", label: "3 months guided self-study training" },
      { icon: "internship", label: "3 months guided internship" },
      { icon: "scholarship", label: "Up to 15% + 15% scholarship on merit" },
      {
        icon: "salary",
        label: "Rs. 16,000 to Rs. 24,000 monthly salary after the internship",
      },
    ],
  },

  // 2. About
  about: [
    "TriWinz Technologies Pvt Ltd offers an on-the-job Intensive Corporate Training Programme for engineering graduates and for BCA, MCA and BSc Computer Science holders who want to start a career in software development.",
    "This is not a classroom course or a typical institute programme. It is a self-study programme that runs inside a working development centre: you learn on your own by following a structured learning path, while senior developers at TriWinz guide you and review your work. Along the way you follow professional workflows such as code review, testing and documentation, and apply what you learn to guided, project-based assignments.",
    "Candidates who complete the training and the internship successfully are absorbed as Junior Full Stack Developers at TriWinz. Top performers may be hired onto live projects in our in-house team, with a competitive salary based on skills and performance, subject to the company's selection criteria and business requirements.",
  ],

  // 3. Programme at a glance
  glance: [
    {
      label: "Programme",
      value:
        "Intensive On-the-Job Corporate Training Programme for Junior Full Stack Developers",
    },
    {
      label: "Eligibility",
      value:
        "Engineering graduates, BCA, MCA and BSc Computer Science holders (see Who can apply)",
    },
    { label: "Duration", value: "6 months: 3 months training + 3 months internship" },
    { label: "Work mode", value: "Work from office" },
    {
      label: "Learning format",
      value:
        "Self-study with mentor support: no classes or lectures; senior developers guide you and review your work",
    },
    {
      label: "Core technologies",
      value: "Python, Django, PostgreSQL, React JS, Git, AI-assisted coding",
    },
    {
      label: "Programme fee",
      value: TOTAL_FEE
        ? `${TOTAL_FEE} (payable in 3 instalments)`
        : "Contact us for fee details (payable in 3 instalments)",
    },
    {
      label: "Scholarship",
      value:
        "Up to 15% of the total fee at the training stage and up to 15% at the internship stage",
    },
    {
      label: "Salary",
      value:
        "Rs. 16,000 to Rs. 24,000 per month, starting after successful completion of the internship, based on evaluation",
    },
    {
      label: "Outcome",
      value:
        "Absorption as Junior Full Stack Developer at TriWinz, subject to successful completion",
    },
    {
      label: "Start",
      value: START_BATCH_DATE
        ? `Immediate joining · Next batch: ${START_BATCH_DATE}`
        : "Immediate joining",
    },
  ],

  // 4. How the programme works
  phases: [
    {
      label: "Phase 1",
      duration: "3 months",
      title: "Intensive Corporate Training",
      intro:
        "Build strong foundations through structured self-study, with guidance and code reviews from senior developers of TriWinz.",
      points: [
        "Python, Django, PostgreSQL and React JS",
        "Git, development tools and AI-assisted workflows",
        "Business Communication and Personality Development",
        "Strict weekly evaluation across all 12 weeks",
      ],
    },
    {
      label: "Phase 2",
      duration: "3 months",
      title: "Guided Internship",
      intro:
        "Apply what you have learned through guided practical assignments, teamwork and project-based learning.",
      points: [
        "Work alongside project teams and team leaders",
        "Evaluation and assessment throughout the internship",
      ],
    },
    {
      label: "Phase 3",
      duration: "On completion",
      title: "Junior Full Stack Developer at TriWinz",
      intro:
        "On successful completion of training and internship, you are absorbed as a Junior Full Stack Developer and develop experience with professional workflows, code quality, testing, documentation and enterprise-level practices. Top-performing candidates may be hired to work on live projects in the in-house team.",
      points: [],
    },
  ],

  // 5. What you will learn
  modules: [
    { title: "Python", description: "Programming foundations and backend development" },
    { title: "Django", description: "Building backend functionality and web applications" },
    {
      title: "PostgreSQL and Database Management",
      description: "Database design, SQL queries and database integration",
    },
    {
      title: "React JS",
      description: "Responsive front-end development with HTML, CSS and JavaScript",
    },
    {
      title: "Git and development tools",
      description:
        "Git, terminal, Visual Studio Code and modern coding and design tools",
    },
    {
      title: "AI-Assisted Coding",
      description:
        "Using AI coding tools responsibly for development, debugging and testing",
    },
    {
      title: "Business Communication",
      description: "Professional written and verbal communication in the workplace",
    },
    {
      title: "Personality Development",
      description: "Confidence, teamwork, attitude and workplace readiness",
    },
  ],

  // 6. Who can apply
  eligibility: {
    required: [
      "Engineering graduates (B.E. / B.Tech), preferably in Computer Science, IT or related disciplines; other engineering disciplines with the required foundational skills may also apply",
      "BCA, MCA and BSc Computer Science holders",
      "Freshers and entry-level candidates are encouraged to apply",
    ],
    lookFor: [
      "Foundational exposure to HTML, CSS and JavaScript",
      "Good logical reasoning, analytical thinking and problem-solving skills",
      "Adequate written and verbal communication skills in English",
      "A strong willingness to learn, a positive attitude and the ability to work in a team",
      "Commitment to completing the three-month intensive training",
    ],
    advantage: [
      "Basic knowledge of Python or any programming language",
      "Familiarity with Git/GitHub, SQL, APIs or React JS",
      "Exposure to AI coding assistants and UI/UX design tools",
      "Academic or personal projects, or a GitHub repository",
    ],
    note: "Prior certifications are not required.",
  },

  // 7. How you are evaluated
  evaluation: {
    intro:
      "We believe in honest, regular feedback. Your progress is measured at every stage.",
    items: [
      {
        title: "Weekly evaluation",
        text: "Strict evaluation every week for 12 weeks during training.",
      },
      {
        title: "Internship assessment",
        text: "Evaluation and assessment of every candidate during the internship.",
      },
    ],
    note: "Your evaluations directly influence your scholarship eligibility and the monthly salary band you receive after the internship.",
  },

  // 8. Programme fee and EMI options
  fee: {
    total: TOTAL_FEE,
    intro:
      "To make the programme accessible, the fee can be paid in three instalments linked to programme milestones.",
    instalments: [
      {
        name: "1st",
        when: "At the time of joining the Intensive On-the-Job Corporate Training Programme",
        share: "", // e.g. "40%"
      },
      {
        name: "2nd",
        when: "After successfully completing the training, before the internship begins",
        share: "",
      },
      {
        name: "3rd",
        when: "On successful completion of the internship",
        share: "",
      },
    ],
    notes: [], // e.g. refund / exit condition
  },

  // 9. Scholarships
  scholarships: {
    intro:
      "Strong performance is rewarded. You can earn scholarships at both stages of the programme.",
    rows: [
      {
        stage: "Training scholarship",
        amount: "Up to 15% of the total fee",
        basis: "12-week training evaluation",
        appliedAt: "Second instalment, on successful completion of training",
      },
      {
        stage: "Internship scholarship",
        amount: "Up to 15% of the total fee",
        basis: "12-week internship evaluation",
        appliedAt: "Third instalment, on successful completion of the internship",
      },
    ],
    note: "The scholarship amount is decided by TriWinz management in consultation with the mentors, senior developers and project team leaders. Besides your evaluation scores, attitude, good team behaviour and related aspects are also considered.",
  },

  // 10. Salary after the internship
  salary: {
    title: "Your salary after the internship",
    range: "Rs. 16,000 – Rs. 24,000",
    rangeLabel: "per month, from successful completion of the internship",
    paragraphs: [
      "Once you successfully complete the three-month training and the three-month internship, you start earning as a Junior Full Stack Developer at TriWinz. Based on the strict evaluation carried out during the programme, your monthly salary starts from Rs. 16,000 and goes up to Rs. 24,000.",
      "Beyond the programme, top-performing candidates may be hired to work on live projects in our in-house team with a competitive salary based on skillset and performance, subject to the company's selection criteria and business requirements.",
    ],
  },

  // 11. Why train with TriWinz
  why: [
    {
      icon: "mentor",
      title: "Guided by practitioners",
      text: "Self-study backed by guidance and code reviews from senior developers of TriWinz.",
    },
    {
      icon: "workplace",
      title: "A real workplace",
      text: "Professional development workflows, code reviews, testing and documentation from day one.",
    },
    {
      icon: "career",
      title: "A defined career path",
      text: "Training, internship and absorption as a Junior Full Stack Developer.",
    },
    {
      icon: "code",
      title: "Modern skills",
      text: "A full stack of Python, Django, PostgreSQL and React JS, plus AI-assisted development.",
    },
    {
      icon: "reward",
      title: "Rewarded performance",
      text: "Scholarships of up to 15% at each stage and a salary band based on your evaluation.",
    },
    {
      icon: "soft",
      title: "Job-ready soft skills",
      text: "Business communication and personality development built into the curriculum.",
    },
  ],

  // 12. How to apply
  howToApply: {
    // PLACEHOLDER steps (from the draft's example) – confirm with management.
    steps: [
      "Submit the application form with your resume",
      "Screening of applications",
      "Interview",
      "Offer and joining",
    ],
    text: "Ready to start your career in software development? Click Apply Now, or view the open roles on our careers page, including the Jr Full Stack Developer role.",
    jobDescriptionHref: "/careers",
    contactPhone: CONTACT_PHONE,
    contactPhoneHref: CONTACT_PHONE_HREF,
    contactEmail: CONTACT_EMAIL,
  },

  // 13. FAQ
  faqs: [
    {
      q: "Who can join the programme?",
      a: "Engineering graduates, BCA, MCA and BSc Computer Science holders. Freshers are welcome and prior certifications are not required.",
    },
    {
      q: "How long is the programme?",
      a: "Six months in total: three months of intensive training followed by a three-month internship.",
    },
    {
      q: "Is this a classroom course?",
      a: "No. This is a self-study programme, not a typical institute course. You learn on your own at the TriWinz office by following a structured learning path, while senior developers guide you and review your work.",
    },
    {
      q: "Is the programme online or in person?",
      a: "The programme is work from office, at the TriWinz development centre in Thiruvananthapuram.",
    },
    {
      q: "Will I get a job at the end?",
      a: "Candidates who successfully complete the training and the internship are absorbed as Junior Full Stack Developers at TriWinz, subject to the company's selection criteria and business requirements. Top performers may be hired to work on live projects.",
    },
    {
      q: "Is the fee payable in instalments?",
      a: "Yes. The fee is paid in three instalments: at joining, after training before the internship begins, and on successful completion of the internship.",
    },
    {
      q: "How do scholarships work?",
      a: "Based on your 12-week evaluations, you can earn up to 15% of the total fee at the training stage and up to 15% at the internship stage. Management decides the amount, also considering attitude and team behaviour.",
    },
    {
      q: "When does the salary start?",
      a: "The salary starts after you successfully complete the internship, when you are absorbed as a Junior Full Stack Developer. The monthly salary ranges from Rs. 16,000 to Rs. 24,000, based on your evaluation during the programme.",
    },
    {
      q: "What will I learn?",
      a: "Python, Django, PostgreSQL, React JS, Git, AI-assisted coding, business communication and personality development.",
    },
  ],

  // 14. Closing CTA and company details
  closing: {
    headline:
      "Start your software career with real projects, real mentors and a real path to a job.",
  },
  company: {
    name: "TriWinz Technologies Pvt Ltd",
    cin: "U72900TN2017PTC119814",
  },
  terms:
    "Terms apply. Scholarships, salary bands and absorption are subject to evaluation outcomes, company selection criteria and business requirements.",
};
