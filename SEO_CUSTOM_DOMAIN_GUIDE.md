# Askesis SEO & Custom Domain Setup Guide

## ✅ COMPLETED SEO Enhancements (Just Deployed)

### 1. **Metadata & Open Graph Tags**
- ✅ Root layout with comprehensive SEO metadata
- ✅ Title: "Askesis - Adaptive Exam Prep for SAT, ACT, GRE, GMAT & More"
- ✅ Description optimized for keywords: SAT prep, ACT prep, GRE prep, GMAT prep
- ✅ Open Graph tags for social media sharing (Twitter, Facebook, LinkedIn)
- ✅ Canonical URL configuration
- ✅ Page-level metadata for all key routes:
  - `/exams` - Exam prep courses
  - `/practice` - Practice questions
  - `/study-plan` - Personalized study plans
  - `/mock-test` - Full-length exams
  - `/analytics` - Performance tracking

### 2. **Search Engine Crawling**
- ✅ `robots.txt` - Allows all search engines (Google, Bing) with sitemap reference
- ✅ `sitemap.xml` - Dynamic XML sitemap with 20+ routes covering all pages
- ✅ Change frequency and priority hints for each page

### 3. **Structured Data (Schema.org)**
- ✅ JSON-LD schema in layout (Educational Organization)
- ✅ Markup includes:
  - Organization name, description, URL, logo
  - Contact information
  - Educational courses (SAT, ACT, GRE, GMAT)

### 4. **Page Performance**
- ✅ 21 static routes prerendered for instant load times
- ✅ 220 KB shared JavaScript (optimized)
- ✅ Image optimization via Next.js
- ✅ Font optimization (Inter from Google Fonts)

---

## 🚀 NEXT STEPS: Custom Domain & Google Search Ranking

### Step 1: Purchase & Register Custom Domain
**Choose one of these options:**

**Premium Short Domains (Best for ranking):**
- `askesis.io` (~$12/year, good TLD for tech/education)
- `askesisprep.com` (~$2-5/year, long but keyword-rich)
- `satprep.ai` (~$30/year, direct keyword match for SAT)

**Where to buy:**
- Namecheap.com (cheapest, ~$2-5/year for .com)
- GoDaddy.com (popular, good support)
- Google Domains (integrates with Vercel)

**Recommended:** `askesisprep.com` or `askesis.io`

---

### Step 2: Configure Domain with Vercel

Once you've purchased your domain, connect it to Vercel:

```bash
cd frontend
npx vercel domains add <your-domain.com>
```

Vercel will provide DNS records to add at your domain registrar:
- **Option A (Recommended):** Add CNAME record pointing to Vercel
- **Option B:** Add A records for IPv4

Follow Vercel's on-screen instructions to complete DNS setup.

---

### Step 3: Update Backend Configuration

**Update Railway environment variables:**

1. Go to Railway dashboard → Askesis project → Variables
2. Update `FRONTEND_ORIGIN` from `https://askesis-tawny.vercel.app` to your new domain
3. Example: `FRONTEND_ORIGIN=https://askesisprep.com`

This ensures:
- ✅ CORS allows requests from your custom domain
- ✅ Stripe checkout URLs use your custom domain
- ✅ Authentication tokens validate against correct origin

**Command to verify:**
```bash
curl https://<your-domain.com>/health
```

---

### Step 4: Submit to Google Search Console

1. Go to https://search.google.com/search-console
2. Click "Add Property" → Enter your custom domain
3. Verify ownership (Vercel DNS verification or HTML file)
4. Submit sitemap: https://<your-domain.com>/sitemap.xml
5. Check "Crawl Stats" to see Google's indexation progress

**Timeline:** Google typically indexes within 24-48 hours if domain is new

---

### Step 5: Monitor Search Performance

In Google Search Console, track:
- **Coverage:** Which pages are indexed
- **Performance:** Click-through rate (CTR), impressions, average position
- **Enhancements:** Rich results (if schema markup is correct)
- **Core Web Vitals:** Page speed and user experience metrics

---

## 📊 Ranking Strategy for Top 5 Google Results

### A. Technical SEO (Already Done)
✅ Metadata and keywords  
✅ Sitemap and robots.txt  
✅ Structured data  
✅ Fast load times (220KB JS)  
✅ Mobile responsive design  
✅ HTTPS/SSL (Vercel auto-handles)  

### B. Content SEO (TO DO - High Impact)

**1. Optimize Landing Page Copy**
- Add keyword-rich headlines: "SAT Prep", "ACT Preparation", "GRE Study"
- Include long-tail keywords in hero section
- Add FAQ section with common questions (appears in "People Also Ask")

**2. Create Exam-Specific Pages**
- `/sat` - SAT preparation guide
- `/act` - ACT preparation guide  
- `/gre` - GRE preparation guide
- `/gmat` - GMAT preparation guide

Each page should include:
- Exam overview and scope
- Number of questions available
- Practice test count
- Average score improvement data
- Testimonials/success stories

**3. Start a Blog**
- "10 SAT Math Strategies"
- "How to Score 1500+ on the SAT"
- "ACT vs SAT: Which Should You Take?"
- "GRE Vocabulary: 100 Must-Know Words"

Blog posts:
- Rank for long-tail keywords
- Build domain authority
- Generate backlinks from education sites

### C. Link Building (Medium-Term - 2-3 months)

**High-value backlink sources:**
1. **Education directories:**
   - Capterra.com (list your platform)
   - G2.com (software reviews)
   - ProductHunt.com (launch your app)

2. **Relevant websites:**
   - Test prep forums (Reddit r/SAT, r/ACT)
   - Student blog networks
   - Education technology blogs
   - High school/college websites

3. **Social signals:**
   - Twitter: Share test prep tips, link to your app
   - LinkedIn: Target educators and students
   - TikTok: Short SAT/ACT tips video series

### D. User Engagement Signals

Google tracks:
- **Click-through rate (CTR):** Make title/description compelling
- **Dwell time:** Keep users on your site (good curriculum does this)
- **Bounce rate:** Keep bouncing users low (engaging landing page helps)

**How to improve:**
- Compelling meta descriptions (already done)
- Fast load times (already done)
- Mobile-friendly design (already done)
- Clear CTA buttons (already done)

---

## 🎯 Realistic Timeline to Top 5 Results

| Phase | Timeline | Actions | Difficulty |
|-------|----------|---------|------------|
| **Phase 1: Setup** | Week 1 | Custom domain, DNS, Google Search Console | Easy ✅ |
| **Phase 2: Content** | Weeks 2-4 | Landing page optimization, FAQ, exam guides | Medium |
| **Phase 3: Links** | Weeks 2-8 | Directory submissions, social signals, outreach | Medium |
| **Phase 4: Ranking** | Months 2-3 | Monitor GSC, refine keywords, blog posts | Ongoing |

**For competitive keywords like "SAT prep" or "ACT prep":**
- 🟡 3-6 months: Realistic with consistent effort
- 🟢 1-2 months: Possible if you build high-quality backlinks

**For less competitive keywords:**
- 🟢 "Askesis" (brand name): 1-2 weeks (low competition)
- 🟡 "Adaptive SAT prep": 4-8 weeks
- 🟡 "Best free SAT practice": 2-3 months

---

## 💡 Quick Wins (Do These First)

1. ✅ Buy custom domain (1-2 hours)
2. ✅ Connect to Vercel (15 minutes)
3. ✅ Update Railway variables (10 minutes)
4. ✅ Verify in Google Search Console (30 minutes)
5. ✅ Add FAQ section to home page (2-3 hours) → Appears in "People Also Ask"
6. ✅ Write 3 blog posts about test prep (6-8 hours) → Target long-tail keywords

**ROI:** Steps 1-4 take <2 hours and unlock Google indexation. Steps 5-6 dramatically improve ranking.

---

## 🔍 Monitoring & Verification

### Weekly Checks (Google Search Console)
- New pages being indexed?
- Any crawl errors?
- Core Web Vitals score?

### Monthly Reviews
- Search position for target keywords
- Click-through rate trends
- New backlink sources

### Tools for Analysis
- Google Search Console (free)
- Google PageSpeed Insights (free)
- Ahrefs (paid, for backlink analysis)
- SEMrush (paid, for keyword research)

---

## ❓ FAQ

**Q: Will my app rank immediately after deploying SEO changes?**
A: No. Google needs to crawl and index pages (24-48 hours), then rank them (1-3 months for competitive keywords).

**Q: What if I don't have a custom domain?**
A: Your app will still rank, but custom domains perform better. `askesis-tawny.vercel.app` is harder to rank than `askesis.com`.

**Q: How much does a custom domain cost?**
A: $2-15/year depending on TLD (.com is ~$2-5, .io is ~$12-30).

**Q: Can I switch domains later?**
A: Yes, but you'll lose ranking history. Stay with your domain choice.

**Q: Should I remove the current Vercel domain?**
A: After switching to custom domain, you can remove the `.vercel.app` domain or keep it as a redirect for legacy links.

---

## 📝 Next Action

**Tell me:**
1. What custom domain do you want? (e.g., `askesisprep.com`, `askesis.io`)
2. Do you want me to help optimize landing page copy for keywords?
3. Should I create sample FAQ and blog post structure?

I'm ready to help implement any of these steps!
