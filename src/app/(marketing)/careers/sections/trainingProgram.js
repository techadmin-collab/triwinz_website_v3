// ─────────────────────────────────────────────────────────────
// Intensive Corporate Training Programme: page content
// Every word on /careers/intensive-corporate-training comes from this file.
//
// TO CONFIRM BEFORE PUBLISHING (from the management checklist):
//   3. glance "Outcome" wording vs the existing careers page (absorption timing)
//   5. startBatchDate, howToApply.steps and contact details
// ─────────────────────────────────────────────────────────────

export const TRAINING_PROGRAM_SLUG = "intensive-corporate-training";
export const TRAINING_PROGRAM_PATH = `/careers/${TRAINING_PROGRAM_SLUG}`;

// Fill these in when confirmed. Empty string = not shown / fallback text used.
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
      "A one-year programme at TriWinz: 3 months of training, 3 months of internship and 6 months of enterprise project experience in Python, Django, PostgreSQL and React JS. Open to engineering, BCA, MCA and BSc Computer Science graduates.",
  },

  // 1. Hero
  hero: {
    eyebrow: "Intensive Corporate Training Programme",
    // Short bold line shown just above the headline. Set to "" to hide.
    tagline: "",
    // Highlighted badge shown in the hero. Set to "" to hide.
    tag: "Paid Corporate Programme",
    headline:
      "Learn, Build and Get hired.\nYour Full-Stack career starts here.", // \n = line break
    subheadline:
      "A one-year on-the-job programme: three months of intensive, self-paced corporate training at our development centre, led by our senior experts, followed by a three-month guided internship and six months of enterprise-level project experience as a Full Stack Developer at TriWinz.",
    // icon: training | internship | projects | scholarship | career
    highlights: [
      { icon: "training", label: "3 months training" },
      { icon: "internship", label: "3 months guided internship" },
      { icon: "projects", label: "6 months enterprise project experience" },
      { icon: "scholarship", label: "Up to 30% scholarship" },
      {
        icon: "career",
        label: "Guaranteed job",
      },
    ],
  },

  // 2. About
  about: [
    "TriWinz Technologies Pvt Ltd offers an on-the-job Intensive Corporate Training Programme for engineering graduates and for BCA, MCA and BSc Computer Science holders who want to start a career in software development.",
    "This is not a classroom course or a typical institute programme. It is a self-paced training programme that runs inside a working development centre: you learn at your own pace by following a structured learning path, while senior developers at TriWinz guide you and review your work. Along the way you follow professional workflows such as code review, testing and documentation, and apply what you learn to guided, project-based assignments.",
    "Candidates who complete the training and the internship successfully join TriWinz as Full Stack Developers and spend the next six months gaining experience on live, enterprise-level projects with our in-house team, subject to the company's selection criteria and business requirements.",
  ],

  // 3. Programme at a glance
  glance: [
    {
      label: "Programme",
      value:
        "Intensive On-the-Job Corporate Training Programme for Full Stack Developers",
    },
    {
      label: "Eligibility",
      value:
        "Engineering graduates, BCA, MCA and BSc Computer Science holders (see Who can apply)",
    },
    {
      label: "Duration",
      value:
        "1 year: 3 months training + 3 months internship + 6 months enterprise-level project experience",
    },
    { label: "Work mode", value: "Work from office" },
    {
      label: "Learning format",
      value:
        "Self-paced training with mentor support: no classes or lectures; senior developers guide you and review your work",
    },
    {
      label: "Core technologies",
      value: "Python, Django, PostgreSQL, React JS, Git, AI-assisted coding",
    },
    {
      label: "Programme fee",
      value: "Contact us for fee details",
    },
    {
      label: "Scholarship",
      value:
        "Up to 30% of the total fee, based on merit",
    },
    {
      label: "Outcome",
      value:
        "Join TriWinz as a Full Stack Developer after the internship, subject to successful completion",
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
        "Build strong foundations through structured self-paced training, with guidance and code reviews from senior developers of TriWinz.",
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
      duration: "6 months",
      title: "Enterprise Project Experience as a Full Stack Developer",
      intro:
        "On successful completion of training and internship, you join TriWinz as a Full Stack Developer and spend six months working on live, enterprise-level projects with our in-house team, gaining experience with professional workflows, code quality, testing, documentation and enterprise-level practices.",
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
        text: "Monthly evaluation and assessment of every candidate during the internship.",
      },
    ],
    note: "Your evaluations directly influence your scholarship eligibility.",
  },

  // 8. Programme fee
  fee: {
    title: "Programme fee",
    text: "Contact us for fee details.",
  },

  // 9. Scholarships
  scholarships: {
    intro:
      "Strong performance is rewarded. You can earn a scholarship of up to 30% of the total fee, based on merit.",
    rows: [
      {
        stage: "Training scholarship",
        basis: "12-week training evaluation",
        appliedAt: "On successful completion of training",
      },
      {
        stage: "Internship scholarship",
        basis: "Monthly internship evaluation",
        appliedAt: "On successful completion of the internship",
      },
    ],
    note: "The scholarship amount is decided by TriWinz management in consultation with the mentors, senior developers and project team leaders. Besides your evaluation scores, attitude, good team behaviour and related aspects are also considered.",
  },

  // 11. Why train with TriWinz
  why: [
    {
      icon: "mentor",
      title: "Guided by practitioners",
      text: "Self-paced training backed by guidance and code reviews from senior developers of TriWinz.",
    },
    {
      icon: "workplace",
      title: "A real workplace",
      text: "Professional development workflows, code reviews, testing and documentation from day one.",
    },
    {
      icon: "career",
      title: "A defined career path",
      text: "Training, internship and six months of enterprise project experience as a Full Stack Developer.",
    },
    {
      icon: "code",
      title: "Modern skills",
      text: "A full stack of Python, Django, PostgreSQL and React JS, plus AI-assisted development.",
    },
    {
      icon: "reward",
      title: "Rewarded performance",
      text: "Scholarships of up to 30% of the total fee, based on merit.",
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
    text: "Ready to start your career in software development? Click Apply Now to send your application.",
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
      a: "One year in total: three months of intensive training, a three-month internship and six months of enterprise-level project experience.",
    },
    {
      q: "Is this a classroom course?",
      a: "No. This is a self-paced training programme, not a typical institute course. You learn at your own pace at the TriWinz office by following a structured learning path, while senior developers guide you and review your work.",
    },
    {
      q: "Is the programme online or in person?",
      a: "The programme is work from office, at the TriWinz development centre in Thiruvananthapuram.",
    },
    {
      q: "Will I get a job at the end?",
      a: "Candidates who successfully complete the training and the internship join TriWinz as Full Stack Developers and work on enterprise-level projects for the next six months, subject to the company's selection criteria and business requirements.",
    },
    {
      q: "What is the programme fee?",
      a: "Please contact us for fee details.",
    },
    {
      q: "How do scholarships work?",
      a: "You can earn a scholarship of up to 30% of the total fee, based on merit. Your weekly evaluations during training and monthly evaluations during the internship are considered, and management decides the amount, also considering attitude and team behaviour.",
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
    "Terms apply. Scholarships and absorption are subject to evaluation outcomes, company selection criteria and business requirements.",
};
