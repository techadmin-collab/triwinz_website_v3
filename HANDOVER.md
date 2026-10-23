# Triwinz Website v3: Handover Document

Prepared by: Abdul Samad (Full-stack Developer)
Date: 2026-10-19
Repository: https://github.com/harikrishnan-triwinz/triwinz-website-v3 (branch worked on: `dev`)

> **No passwords, API keys or secrets are written in this document.** Share credentials only through the approved secure method (password manager / secure vault).

---

## 1. Overview

Public marketing website for Triwinz (triwinz.com) plus an internal Admin CMS used to manage careers, job applications, contact enquiries, blogs, case studies and admin users.

| Item | Detail |
|---|---|
| Framework | Next.js 16.1.4 (App Router), React 19.2.3 |
| UI | MUI 7 + Emotion, Tailwind CSS 4, mui-tiptap rich text editor |
| Database | MongoDB (Atlas) via Prisma 6 (`prisma/schema.prisma`) |
| Auth | NextAuth v4 (Credentials provider), bcrypt password hashes |
| File storage | Cloudinary (resumes, images). AWS S3 client exists in `src/lib/s3.js` |
| Email | SMTP via Nodemailer (current). EmailJS (legacy / contact form) |
| Bot protection | Cloudflare Turnstile on forms |
| Hosting | Vercel |

## 2. Modules / Applications Handled

### 2.1 Public website (`src/app/(marketing)`)
- Home, About, Teams, Contact Us, Privacy Policy, Terms and Conditions
- Service pages: Custom Software & ERP Development, IT & Digital Transformation, SAP Consulting & Support, Cloud & Web Infrastructure, eGovernance / Visa Platform Solutions
- Product pages: eVisa Suite, BisBuddy ERP, Triwinz CloudKart, India Domain Mart
- Blogs (list + `[slug]`), Case Studies (list + `[slug]`)
- Careers (job list, `[slug]` job details, Apply modal/form with resume upload)
- SEO: `src/app/sitemap.js`, `src/app/robots.js`, `src/lib/seo.js`, OG share image script

### 2.2 Admin CMS (`src/app/admin`, API in `src/app/api/admin`)
| Module | Function |
|---|---|
| Dashboard | Summary counts (including job counts) |
| Jobs | Create / edit / publish jobs; work mode, joining period, job type |
| Applications | List, filter, edit status, resume preview in modal |
| Shortlisted | Shortlisted candidates view per job |
| Contacts | Contact form messages, status (new / read / archived), email delivery status |
| Blogs / Case Studies | CRUD with rich text editor (admin pages exist; the sidebar modules are Dashboard, Jobs, Applications, Contacts, Users) |
| Users | Admin user management with role + per-module permissions |
| Account | Change own password |

### 2.3 Public APIs
`/api/applications` (job application + resume upload, Turnstile checked), `/api/contact`, `/api/blog`, `/api/case-studies`, `/api/upload` (resume upload, max 512 KB, PDF/DOC/DOCX), `/api/auth/[...nextauth]`.

## 3. Key Technical Details

### 3.1 Data model (MongoDB / Prisma)
`Blog`, `CaseStudy`, `Job`, `JobApplication` (status: new | shortlisted | on_hold | rejected | selected), `ContactMessage` (status: new | read | archived, `emailSent` / `emailError`), `AdminUser` (role: admin | staff, `permissions[]`, `active`).

### 3.2 Authentication and roles
- **The super admin credentials are stored in the environment variables, not in the database:** the login email is `ADMIN_EMAIL` and the password is `ADMIN_PASSWORD`. They are set in the local `.env` and in the Vercel project's Environment Variables. Logic in `src/lib/auth.js`, `src/lib/permissions.js`. To change the super admin password, update `ADMIN_PASSWORD` in Vercel and redeploy.
- `admin` role gets all modules; `staff` gets only modules listed in `permissions` (`dashboard`, `jobs`, `applications`, `contacts`, `users`). These users are stored in the `AdminUser` collection.
- API guards: `src/lib/requireAdmin.js`, page guards: `src/lib/requirePageModule.js`.

### 3.3 Application flow
Candidate submits form, then Turnstile token verified (`src/lib/turnstile.js`), then resume uploaded to Cloudinary (`src/lib/cloudinary.js`; file name must not contain `& # % ? / \ < >`, see `src/lib/resumeFile.js`), then record saved in `JobApplication`, then emails sent (`src/lib/sendApplicationEmails.js`, templates in `src/lib/emailTemplates.js`).

### 3.4 Local setup
```bash
npm install
cp .env.example .env      # fill values (obtain securely)
npx prisma generate
npm run dev               # http://localhost:3000
npm run build             # runs "prisma generate && next build"
```
Scripts in `scripts/`: `generate-og-share.mjs` (builds `public/og-share.webp`), `migrate-job-types.mjs` and `migrate-job-types-to-string.mjs` (one-off Job type migrations, already applied).

### 3.5 Deployment (Vercel)
- The website is hosted on **Vercel** at **triwinz.com**. The project is a standard Next.js project, so Vercel builds it automatically; no `vercel.json` is needed.
- Build command: `npm run build` (which runs `prisma generate && next build`). The `prisma generate` step is required because the Prisma client is generated at build time. Install command: `npm install`. Output: Next.js default.
- Deployments are triggered from the GitHub repository (`harikrishnan-triwinz/triwinz-website-v3`): a push to the production branch deploys to production; other branches get preview deployments. Production branch: **[FILL IN: main or dev]**.
- All environment variables (section 4) must be set in **Vercel, Project Settings, Environment Variables**; the local `.env` file is never deployed. After changing a variable, redeploy for it to take effect. Set `NEXTAUTH_URL` to the production domain.
- Domain and DNS: triwinz.com is attached to the Vercel project (Settings, Domains). Domain registrar / DNS provider: **[FILL IN]**.
- Vercel project name and team / account that owns it: **[FILL IN]**.
- Rollback: Vercel, Deployments, pick the previous good deployment, Promote to Production (instant).
- Database access: MongoDB Atlas must allow connections from Vercel (Network Access, IP allow-list or 0.0.0.0/0).

## 4. Environments, Accounts and Credentials Required
(Names only. Values to be transferred via the approved secure method.)

### 4.1 Services and environment variables
| Service | Env variables | Notes |
|---|---|---|
| MongoDB Atlas | `MONGODB_URI` (also `DATABASE_URL`, `MONGODB_USERNAME`, `MONGODB_PASSWORD` present in `.env`) | Prisma uses `MONGODB_URI`. Cluster / DB owner: techadmin |
| NextAuth / Admin | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Super admin login; stored in environment variables (local `.env` and Vercel), not in the database |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Resume + image storage. Account owner: techadmin |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Current email sending (Gmail SMTP, see 4.2) |
| EmailJS (legacy) | `EMAILJS_*`, `EMAILJS_*_FOR_CONTACT_US`, `EMAILJS_APPLICATION_THANKYOU_TEMPLATE_ID` | Account owner: techadmin |
| Cloudflare Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Dev uses always-pass test keys; production needs real keys |
| Notifications | `CONTACT_NOTIFICATION_EMAIL` | Recipient of contact form alerts |
| AWS S3 (if used) | `AWS_REGION`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY` | Referenced in `src/lib/s3.js` but not in `.env.example`; confirm whether it is used at all |

Environments: local (dev), production triwinz.com (Vercel).

### 4.2 Email accounts used by this project
| Purpose | Email account | Where configured |
|---|---|---|
| Outgoing email (job application confirmations and notifications), sender "Triwinz Careers" | `joinus@triwinz.com` (sent through Gmail SMTP `smtp.gmail.com:587`) | `SMTP_USER`, `SMTP_FROM` |
| Receives contact-form alerts | `techadmin@triwinz.net` | `CONTACT_NOTIFICATION_EMAIL` |
| Owner of the external accounts (MongoDB Atlas, Cloudinary, EmailJS) | `techadmin` account (techadmin@triwinz.net) | Each service's own console |
| Super admin login of the admin CMS | `superadmin@triwinz.com` | `ADMIN_EMAIL` (password in `ADMIN_PASSWORD`) |

### 4.3 How to sign in to the external tools
| Tool | Sign-in method (Google login or email + password) | Account |
|---|---|---|
| GitHub | **[FILL IN]** | **[FILL IN]** |
| Vercel | **[FILL IN]** | **[FILL IN]** |
| MongoDB Atlas | **[FILL IN]** | techadmin |
| Cloudinary | **[FILL IN]** | techadmin |
| EmailJS | **[FILL IN]** | techadmin |
| Cloudflare (Turnstile) | **[FILL IN]** | **[FILL IN]** |
| Google account for `joinus@triwinz.com` (Gmail SMTP) | **[FILL IN]** | joinus@triwinz.com |

Where a tool uses Google sign-in, access follows that Google account, so the new owner must be added as a member / the account ownership transferred instead of sharing a password.

## 5. Current Status and Pending Tasks

**Overall:** Site and admin CMS are functional. Latest commit on `dev`: `70862bb` "Switch to SMTP email templates and polish admin applications workflow" (45 commits total; my commits are authored as `abdulsamad-triwinz`).

**Pending / recommended follow-ups:**
1. Clean up env configuration: remove unused `DATABASE_URL`, decide between EmailJS and SMTP (SMTP is now primary), add `AWS_*` to `.env.example` or remove `s3.js` if unused.
2. `README.md` is still the default create-next-app text; replace with the setup steps in section 3.4.
3. Super admin password lives in env (`ADMIN_PASSWORD`); consider moving to a DB user and rotating the password after handover.
4. All credentials that were shared with or used by me should be rotated after handover (MongoDB, Cloudinary, SMTP, EmailJS, Turnstile, NextAuth secret).

## 6. Handover Plan (proposed)

| Step | Activity | Output |
|---|---|---|
| 1 | Confirm list of applications and modules (this document) | Reply to HR / manager |
| 2 | Confirm the state of the `dev` branch and merge as agreed | Clean branch |
| 3 | Share repository access, Vercel, DB, Cloudinary, SMTP, EmailJS and Turnstile ownership via secure method | Access checklist signed off |
| 4 | Walkthrough / KT session of codebase, admin CMS and deployment | Recorded session or call |
| 5 | Q&A and support period; fix handover questions | Closure confirmation |
