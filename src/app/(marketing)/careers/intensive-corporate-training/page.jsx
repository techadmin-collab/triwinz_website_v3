import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import TrainingApplyModal from "../sections/TrainingApplyModal";
import {
  TRAINING_PROGRAM_PATH,
  trainingProgram as p,
} from "../sections/trainingProgram";
import { defaultOpenGraph, defaultTwitter } from "../../../../lib/seo";

/* ── Shared styles ─────────────────────────────────────────── */

const container = {
  width: "100%",
  mx: "auto",
  px: { xs: 2, md: 4 },
  maxWidth: { xs: "1250px", xl: "xl" },
};

const PURPLE = "#5014d2";
const gradientStrong = "linear-gradient(135deg, #5014d2 0%, #dd3ca7 100%)";
const gradientSoft =
  "linear-gradient(135deg, rgba(80,20,210,0.1) 0%, rgba(221,60,167,0.1) 100%)";
const cardSx = {
  borderRadius: 3,
  backgroundColor: "#fff",
  border: "1px solid rgba(80, 20, 210, 0.1)",
  boxShadow: "0 12px 30px rgba(80, 20, 210, 0.06)",
};

const ICONS = {
  training: <SchoolOutlinedIcon />,
  internship: <WorkOutlineIcon />,
  projects: <AccountTreeOutlinedIcon />,
  scholarship: <EmojiEventsOutlinedIcon />,
  mentor: <Groups2OutlinedIcon />,
  workplace: <ApartmentOutlinedIcon />,
  career: <TrendingUpOutlinedIcon />,
  code: <CodeOutlinedIcon />,
  reward: <EmojiEventsOutlinedIcon />,
  soft: <RecordVoiceOverOutlinedIcon />,
};

/* ── SEO ───────────────────────────────────────────────────── */

export const metadata = {
  // "absolute" skips the site-wide "%s | TRIWINZ" title template.
  title: { absolute: p.seo.title },
  description: p.seo.description,
  alternates: { canonical: TRAINING_PROGRAM_PATH },
  openGraph: {
    ...defaultOpenGraph,
    title: p.seo.title,
    description: p.seo.description,
    url: TRAINING_PROGRAM_PATH,
  },
  twitter: {
    ...defaultTwitter,
    title: p.seo.title,
    description: p.seo.description,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: p.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* ── Page ──────────────────────────────────────────────────── */

export default function IntensiveCorporateTrainingPage() {

  return (
    <Box sx={{ fontFamily: "montserrat, inter", backgroundColor: "#fff" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. Hero */}
      <Box sx={{ position: "relative", overflow: "hidden", color: "#fff", pt: { xs: 12, md: 14 }, pb: { xs: 9, md: 11 } }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),url('/about/bg-1-1.webp')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box sx={{ ...container, position: "relative", zIndex: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Link href="/careers" style={{ textDecoration: "none" }}>
              <Button
                startIcon={<ArrowBackIcon />}
                sx={{ color: "#fff", textTransform: "none", fontWeight: 600, "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" } }}
              >
                Back to careers
              </Button>
            </Link>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2.5 }}>
            <Box
              sx={{
                px: 2.5,
                py: 0.8,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                fontWeight: 600,
              }}
            >
              {p.hero.eyebrow}
            </Box>
          </Box>

          {p.hero.tagline ? (
            <Typography
              textAlign="center"
              sx={{
                fontSize: { xs: "1.05rem", md: "1.35rem" },
                fontWeight: 700,
                letterSpacing: "0.01em",
                maxWidth: 900,
                mx: "auto",
                mb: 2,
                opacity: 0.97,
              }}
            >
              {p.hero.tagline}
            </Typography>
          ) : null}

          <Typography
            component="h1"
            textAlign="center"
            fontWeight={800}
            sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, lineHeight: 1.15, whiteSpace: "pre-line", maxWidth: 1000, mx: "auto", mb: 3 }}
          >
            {p.hero.headline}
          </Typography>

          <Typography
            textAlign="center"
            sx={{ maxWidth: 860, mx: "auto", lineHeight: 1.7, fontSize: { xs: "0.95rem", md: "1.08rem" }, opacity: 0.93 }}
          >
            {p.hero.subheadline}
          </Typography>

          {p.hero.tag ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, md: 3.5 } }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 2.25,
                  py: 0.8,
                  borderRadius: 999,
                  backgroundColor: "#fff",
                  color: PURPLE,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                  fontSize: { xs: "0.78rem", sm: "0.9rem" },
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 18 }} />
                {p.hero.tag}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* Highlight strip */}
      <Box sx={{ ...container, position: "relative", zIndex: 2, mt: { xs: -4, md: -5 } }}>
        <Box
          sx={{
            ...cardSx,
            boxShadow: "0 18px 40px rgba(80, 20, 210, 0.12)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" },
            gap: { xs: 2, md: 2.5 },
            p: { xs: 2.5, md: 3 },
          }}
        >
          {p.hero.highlights.map((h) => (
            <Box key={h.label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconBadge icon={ICONS[h.icon]} />
              <Typography fontWeight={700} sx={{ fontSize: { xs: "0.9rem", md: "0.95rem" }, lineHeight: 1.4, color: "#1a1a1a" }}>
                {h.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 2 + 3. About + At a glance */}
      <Box sx={{ ...container, py: { xs: 7, md: 10 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: { xs: 6, lg: 7 }, alignItems: "start" }}>
          <Box>
            <SectionTitle title="About the programme" />
            <Box sx={{ display: "grid", gap: 2 }}>
              {p.about.map((para, i) => (
                <Typography key={i} sx={{ color: "#444", lineHeight: 1.8, fontSize: { xs: "0.95rem", md: "1rem" } }}>
                  {para}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box>
            <SectionTitle title="Programme at a glance" />
            <Box sx={{ ...cardSx, overflow: "hidden" }}>
              {p.glance.map((row, i) => (
                <Box
                  key={row.label}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "170px 1fr" },
                    gap: { xs: 0.25, sm: 2 },
                    px: { xs: 2, md: 2.5 },
                    py: 1.5,
                    backgroundColor: i % 2 ? "#fff" : "rgba(80, 20, 210, 0.025)",
                    borderTop: i ? "1px solid rgba(80, 20, 210, 0.07)" : "none",
                  }}
                >
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: PURPLE, pt: { sm: 0.25 } }}>
                    {row.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.92rem", color: "#222", lineHeight: 1.55, fontWeight: 500 }}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 4. How the programme works */}
      <Band>
        <SectionTitle title="How the programme works" intro="One year on the job: training, internship, then six months of enterprise projects with the TriWinz team." center />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: { xs: 2.5, md: 3 } }}>
          {p.phases.map((phase, i) => (
            <Box key={phase.title} sx={{ ...cardSx, p: { xs: 2.5, md: 3 }, display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", background: gradientStrong, color: "#fff", fontWeight: 800 }}>
                    {i + 1}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {phase.label}
                  </Typography>
                </Box>
                <Box sx={{ px: 1.5, py: 0.5, borderRadius: 999, background: gradientSoft, color: PURPLE, fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {phase.duration}
                </Box>
              </Box>
              <Typography component="h3" fontWeight={800} sx={{ fontSize: "1.15rem", color: "#141414", mb: 1 }}>
                {phase.title}
              </Typography>
              <Typography sx={{ color: "#555", lineHeight: 1.7, fontSize: "0.92rem", mb: phase.points.length ? 2 : 0 }}>
                {phase.intro}
              </Typography>
              {phase.points.length ? <CheckList items={phase.points} /> : null}
            </Box>
          ))}
        </Box>
      </Band>

      {/* 5. What you will learn */}
      <Box sx={{ ...container, py: { xs: 7, md: 10 } }}>
        <SectionTitle title="What you will learn" intro="A structured self-paced training path across the full stack, plus the workplace skills that make you job-ready." center />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2 }}>
          {p.modules.map((m) => (
            <Box key={m.title} sx={{ ...cardSx, p: 2.5, position: "relative", overflow: "hidden", "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: gradientStrong } }}>
              <Typography component="h3" fontWeight={800} sx={{ fontSize: "1rem", color: "#141414", mb: 0.75 }}>
                {m.title}
              </Typography>
              <Typography sx={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.6 }}>{m.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 6. Who can apply */}
      <Band>
        <SectionTitle title="Who can apply" center />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: { xs: 2.5, md: 3 } }}>
          <ListCard title="Eligibility" items={p.eligibility.required} />
          <ListCard title="What we look for" items={p.eligibility.lookFor} />
          <ListCard title="An advantage, but not mandatory" items={p.eligibility.advantage} muted />
        </Box>
        <Typography textAlign="center" sx={{ mt: 3, fontWeight: 700, color: PURPLE }}>
          {p.eligibility.note}
        </Typography>
      </Band>

      {/* 7. Evaluation */}
      <Box sx={{ ...container, py: { xs: 7, md: 10 } }}>
        <SectionTitle title="How you are evaluated" intro={p.evaluation.intro} center />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2, md: 3 }, maxWidth: 960, mx: "auto" }}>
          {p.evaluation.items.map((item) => (
            <Box key={item.title} sx={{ ...cardSx, p: { xs: 2.5, md: 3 }, display: "flex", gap: 2, alignItems: "flex-start" }}>
              <IconBadge icon={<FactCheckOutlinedIcon />} />
              <Box>
                <Typography component="h3" fontWeight={800} sx={{ fontSize: "1.05rem", mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#555", lineHeight: 1.65, fontSize: "0.92rem" }}>{item.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ maxWidth: 960, mx: "auto" }}>
          <NoteBox>{p.evaluation.note}</NoteBox>
        </Box>
      </Box>

      {/* 8 + 9. Fee + Scholarships */}
      <Band>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: { xs: 7, lg: 6 }, alignItems: "start" }}>
          <Box>
            <SectionTitle title={p.fee.title} />
            <Box sx={{ ...cardSx, p: { xs: 3, md: 4 }, display: "flex", gap: 2, alignItems: "flex-start" }}>
              <IconBadge icon={<PaymentsOutlinedIcon />} />
              <Box>
                <Typography sx={{ color: "#222", fontWeight: 700, fontSize: { xs: "1.05rem", md: "1.15rem" }, mb: 1 }}>
                  {p.fee.text}
                </Typography>
                {p.howToApply.contactPhone ? (
                  <Box
                    component="a"
                    href={p.howToApply.contactPhoneHref}
                    sx={{ color: PURPLE, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 0.75 }}
                  >
                    <PhoneOutlinedIcon sx={{ fontSize: 18 }} /> {p.howToApply.contactPhone}
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>

          <Box>
            <SectionTitle title="Scholarships" intro={p.scholarships.intro} />
            <Box sx={{ display: "grid", gap: 2 }}>
              {p.scholarships.rows.map((row) => (
                <Box key={row.stage} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
                    <Typography component="h3" fontWeight={800} sx={{ fontSize: "1.05rem" }}>
                      {row.stage}
                    </Typography>
                    {row.amount ? (
                      <Box sx={{ px: 1.5, py: 0.5, borderRadius: 999, background: gradientStrong, color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}>
                        {row.amount}
                      </Box>
                    ) : null}
                  </Box>
                  <KeyValue label="Basis" value={row.basis} />
                  <KeyValue label="Applied at" value={row.appliedAt} />
                </Box>
              ))}
            </Box>
            <Typography sx={{ mt: 2.5, color: "#555", fontSize: "0.9rem", lineHeight: 1.7 }}>{p.scholarships.note}</Typography>
          </Box>
        </Box>
      </Band>

      {/* 11. Why train with TriWinz */}
      <Band>
        <SectionTitle title="Why train with TriWinz" center />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }, gap: { xs: 2, md: 3 } }}>
          {p.why.map((w) => (
            <Box key={w.title} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
              <IconBadge icon={ICONS[w.icon]} />
              <Typography component="h3" fontWeight={800} sx={{ fontSize: "1.05rem", mt: 2, mb: 0.75 }}>
                {w.title}
              </Typography>
              <Typography sx={{ color: "#555", lineHeight: 1.65, fontSize: "0.92rem" }}>{w.text}</Typography>
            </Box>
          ))}
        </Box>
      </Band>

      {/* 12. How to apply */}
      <Box sx={{ ...container, py: { xs: 7, md: 10 } }}>
        <SectionTitle title="How to apply" center />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: `repeat(${p.howToApply.steps.length}, 1fr)` }, gap: 2, mb: 4 }}>
          {p.howToApply.steps.map((step, i) => (
            <Box key={step} sx={{ ...cardSx, p: 2.5, textAlign: "center" }}>
              <Box sx={{ width: 40, height: 40, mx: "auto", mb: 1.5, borderRadius: "50%", display: "grid", placeItems: "center", background: gradientStrong, color: "#fff", fontWeight: 800 }}>
                {i + 1}
              </Box>
              <Typography fontWeight={700} sx={{ fontSize: "0.95rem", lineHeight: 1.45 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography textAlign="center" sx={{ color: "#444", maxWidth: 680, mx: "auto", lineHeight: 1.7, mb: 3 }}>
          {p.howToApply.text}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", alignItems: "center", gap: 1.5 }}>
          <TrainingApplyModal buttonLabel="Apply Now" buttonSx={{ minWidth: { xs: "100%", sm: 220 } }} />
        </Box>
        <ContactLine />
      </Box>

      {/* 13. FAQ */}
      <Band>
        <SectionTitle title="Frequently asked questions" center />
        <Box sx={{ maxWidth: 860, mx: "auto", display: "grid", gap: 1.5 }}>
          {p.faqs.map((f) => (
            <Box
              key={f.q}
              component="details"
              sx={{
                ...cardSx,
                boxShadow: "none",
                "& summary": {
                  listStyle: "none",
                  cursor: "pointer",
                  px: { xs: 2, md: 2.5 },
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  fontWeight: 700,
                  color: "#141414",
                },
                "& summary::-webkit-details-marker": { display: "none" },
                "& .faq-icon": { transition: "transform 0.2s ease", color: PURPLE },
                "&[open] .faq-icon": { transform: "rotate(180deg)" },
                "&[open]": { borderColor: "rgba(80, 20, 210, 0.3)" },
              }}
            >
              <Box component="summary">
                {f.q}
                <ExpandMoreIcon className="faq-icon" />
              </Box>
              <Typography sx={{ px: { xs: 2, md: 2.5 }, pb: 2, color: "#555", lineHeight: 1.7, fontSize: "0.93rem" }}>
                {f.a}
              </Typography>
            </Box>
          ))}
        </Box>
      </Band>

      {/* 14. Closing CTA + company details */}
      <Box sx={{ ...container, py: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(80,20,210,0.06) 0%, rgba(221,60,167,0.06) 100%)",
            border: "1px solid rgba(80, 20, 210, 0.1)",
          }}
        >
          <Typography component="h2" fontWeight={800} sx={{ fontSize: { xs: "1.35rem", md: "1.85rem" }, maxWidth: 760, mx: "auto", mb: 3, lineHeight: 1.3 }}>
            {p.closing.headline}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TrainingApplyModal buttonLabel="Apply Now" buttonSx={{ minWidth: { xs: "100%", sm: 280 } }} />
          </Box>
        </Box>

        <Box sx={{ mt: 5, pt: 3, borderTop: "1px solid rgba(80, 20, 210, 0.1)", display: "grid", gap: 0.75, color: "#666", fontSize: "0.82rem", lineHeight: 1.6 }}>
          <Typography sx={{ fontSize: "inherit", fontWeight: 700, color: "#333" }}>
            {p.company.name} · CIN: {p.company.cin}
          </Typography>
          <Typography sx={{ fontSize: "inherit", mt: 1, fontStyle: "italic" }}>{p.terms}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Building blocks ───────────────────────────────────────── */

function Band({ children }) {
  return (
    <Box sx={{ background: "linear-gradient(180deg, #faf8ff 0%, #f6f2ff 100%)", borderTop: "1px solid rgba(80,20,210,0.06)", borderBottom: "1px solid rgba(80,20,210,0.06)" }}>
      <Box sx={{ ...container, py: { xs: 7, md: 10 } }}>{children}</Box>
    </Box>
  );
}

function SectionTitle({ title, intro, center = false }) {
  return (
    <Box sx={{ textAlign: center ? "center" : "left", mb: { xs: 3, md: 4 }, maxWidth: center ? 720 : "none", mx: center ? "auto" : 0 }}>
      <Typography component="h2" fontWeight={800} sx={{ fontSize: { xs: "1.5rem", md: "1.9rem" }, letterSpacing: "-0.02em", color: "#141414" }}>
        {title}
      </Typography>
      <Box sx={{ width: 56, height: 4, borderRadius: 2, background: gradientStrong, mt: 1.25, mx: center ? "auto" : 0 }} />
      {intro ? <Typography sx={{ color: "text.secondary", mt: 2, lineHeight: 1.6 }}>{intro}</Typography> : null}
    </Box>
  );
}

function IconBadge({ icon }) {
  return (
    <Box sx={{ width: 44, height: 44, borderRadius: 2, flexShrink: 0, display: "grid", placeItems: "center", background: gradientSoft, color: PURPLE, "& svg": { fontSize: 22 } }}>
      {icon}
    </Box>
  );
}

function CheckList({ items, muted = false }) {
  return (
    <Box sx={{ display: "grid", gap: 1 }}>
      {items.map((item) => (
        <Box key={item} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              flexShrink: 0,
              mt: 0.25,
              display: "grid",
              placeItems: "center",
              background: muted ? "rgba(80,20,210,0.15)" : gradientStrong,
              color: muted ? PURPLE : "#fff",
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 12 }} />
          </Box>
          <Typography sx={{ color: "#333", lineHeight: 1.55, fontSize: "0.9rem" }}>{item}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function ListCard({ title, items, muted = false }) {
  return (
    <Box sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
      <Typography component="h3" fontWeight={800} sx={{ fontSize: "1.05rem", mb: 2, color: muted ? "#555" : "#141414" }}>
        {title}
      </Typography>
      <CheckList items={items} muted={muted} />
    </Box>
  );
}

function NoteBox({ children }) {
  return (
    <Box sx={{ mt: { xs: 3, md: 4 }, p: { xs: 2, md: 2.5 }, borderRadius: 2.5, borderLeft: `4px solid ${PURPLE}`, backgroundColor: "rgba(80, 20, 210, 0.05)" }}>
      <Typography sx={{ color: "#333", lineHeight: 1.7, fontWeight: 500 }}>{children}</Typography>
    </Box>
  );
}

function KeyValue({ label, value }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "100px 1fr" }, gap: { xs: 0, sm: 1.5 }, py: 0.5 }}>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: PURPLE, pt: { sm: 0.2 } }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.55 }}>{value}</Typography>
    </Box>
  );
}

function ContactLine() {
  const { contactPhone, contactPhoneHref, contactEmail } = p.howToApply;
  if (!contactPhone && !contactEmail) return null;
  const linkSx = { color: PURPLE, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 0.75 };
  return (
    <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: { xs: 1.5, sm: 3 }, color: "#555" }}>
      <Typography sx={{ fontSize: "0.92rem" }}>Questions? Contact us:</Typography>
      {contactPhone ? (
        <Box component="a" href={contactPhoneHref} sx={linkSx}>
          <PhoneOutlinedIcon sx={{ fontSize: 18 }} /> {contactPhone}
        </Box>
      ) : null}
      {contactEmail ? (
        <Box component="a" href={`mailto:${contactEmail}`} sx={linkSx}>
          <MailOutlineIcon sx={{ fontSize: 18 }} /> {contactEmail}
        </Box>
      ) : null}
    </Box>
  );
}
