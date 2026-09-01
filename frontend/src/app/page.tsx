"use client";

import Link from "next/link";

export default function HomePage() {
  const exams = [
    { name: "SAT", color: "#4F46E5", icon: "🎓" },
    { name: "ACT", color: "#06B6D4", icon: "📖" },
    { name: "GRE", color: "#7C3AED", icon: "🧠" },
    { name: "GMAT", color: "#10B981", icon: "💼" },
    { name: "SHSAT", color: "#F97316", icon: "🏫" },
    { name: "Regents", color: "#DC2626", icon: "🎯" },
  ];

  const faqs = [
    {
      q: "How is Askesis different from other prep services?",
      a: "Askesis uses AI-adaptive technology to personalize your learning path based on your performance, adjusting question difficulty in real-time for maximum efficiency."
    },
    {
      q: "Can I access full-length practice exams?",
      a: "Yes! Each exam includes multiple full-length mock tests with realistic timing, scoring, and detailed analytics to track your progress."
    },
    {
      q: "Do you provide explanations for every question?",
      a: "Absolutely. Every single question comes with detailed explanations, concept breakdowns, and links to relevant learning materials."
    },
    {
      q: "Can I download materials for offline study?",
      a: "Study materials are optimized for online learning. However, you can access them anytime with our responsive design working on all devices."
    },
    {
      q: "What payment options do you accept?",
      a: "We accept all major credit cards via Stripe. Flexible payment plans are available with options to purchase individual exams or bundles."
    },
    {
      q: "Is there a free trial?",
      a: "Yes! You get a 3-day free trial of Pro or Premium, plus 5 free practice questions per day for any exam. Upgrade to unlimited access with a subscription or exam purchase."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{ padding: "0 24px" }}>
        <div className="card fade-in" style={{ maxWidth: 640, margin: "48px auto", textAlign: "center", backgroundColor: "#ffffff" }}>
          <span className="badge">Adaptive & Personalized</span>
          <h1 style={{ marginTop: 12 }}>Askesis</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>
            Calm, focused exam prep for SAT, ACT, GRE, GMAT, SHSAT, and Regents — with adaptive
            practice, full timed exam simulations, and personalized study plans.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            <Link href="/exams" className="btn-primary">
              Browse Exams
            </Link>
            <Link href="/register" className="btn-primary">
              Get started
            </Link>
            <Link href="/login" className="btn-primary">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ maxWidth: 1000, margin: "80px auto", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24,
        }}>
          <div style={{ textAlign: "center", padding: "24px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>2,900+</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Practice Questions</div>
          </div>
          <div style={{ textAlign: "center", padding: "24px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>30</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Mock Exams</div>
          </div>
          <div style={{ textAlign: "center", padding: "24px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>6</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Major Exams</div>
          </div>
          <div style={{ textAlign: "center", padding: "24px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>24/7</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Access Anytime</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: 1000, margin: "80px auto", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: "32px", fontWeight: "700" }}>
          Why Askesis?
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 24,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <h3 style={{ marginBottom: 8 }}>AI-Adaptive Learning</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Questions adjust to your skill level, ensuring optimal challenge and growth.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <h3 style={{ marginBottom: 8 }}>Comprehensive Curriculum</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Structured learning paths covering every topic on your exam.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <h3 style={{ marginBottom: 8 }}>Detailed Analytics</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Track progress, identify weak areas, and get score predictions.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <h3 style={{ marginBottom: 8 }}>Personalized Study Plans</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Get a customized weekly schedule tailored to your pace and goals.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏱️</div>
            <h3 style={{ marginBottom: 8 }}>Full-Length Exams</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Practice with realistic timed simulations under exam conditions.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
            <h3 style={{ marginBottom: 8 }}>Instant Feedback</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Understand every concept with detailed explanations for every answer.
            </p>
          </div>
        </div>
      </div>

      {/* Exams Section */}
      <div style={{ maxWidth: 1000, margin: "80px auto", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: "32px", fontWeight: "700" }}>
          Prepare for Your Exam
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
        }}>
          {exams.map((exam) => (
            <Link
              key={exam.name}
              href="/exams"
              style={{
                padding: "24px",
                backgroundColor: "#ffffff",
                border: `2px solid #e5e7eb`,
                borderRadius: "8px",
                textAlign: "center",
                textDecoration: "none",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = exam.color;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${exam.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{exam.icon}</div>
              <div style={{ fontSize: 18, fontWeight: "600", color: exam.color }}>
                {exam.name}
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/exams" className="btn-primary">
            View All Exams →
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ backgroundColor: "#f9fafb", padding: "80px 24px", marginTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: "32px", fontWeight: "700" }}>
            How Askesis Works
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}>
            <div style={{ padding: "24px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: "#3A6EA5", marginBottom: 12 }}>1. Choose Your Exam</div>
              <p style={{ color: "#6b7280" }}>Select from 6 major standardized exams and start learning immediately.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: "#3A6EA5", marginBottom: 12 }}>2. Learn & Practice</div>
              <p style={{ color: "#6b7280" }}>Work through comprehensive learning materials and adaptive practice questions.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: "#3A6EA5", marginBottom: 12 }}>3. Take Mock Exams</div>
              <p style={{ color: "#6b7280" }}>Test yourself with full-length exams under realistic timed conditions.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: "#3A6EA5", marginBottom: 12 }}>4. Review & Improve</div>
              <p style={{ color: "#6b7280" }}>Use detailed analytics to identify weak areas and focus your studies.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: "#3A6EA5", marginBottom: 12 }}>5. Study Smarter</div>
              <p style={{ color: "#6b7280" }}>Get personalized study plans tailored to your goals and timeline.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: "#3A6EA5", marginBottom: 12 }}>6. Get Results</div>
              <p style={{ color: "#6b7280" }}>Track your score improvements and reach your target with confidence.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div style={{ maxWidth: 1000, margin: "80px auto", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: "32px", fontWeight: "700" }}>
          Student Success Features
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}>
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: "600" }}>📈 Performance Tracking</h3>
            <ul style={{ listStyle: "none", padding: 0, color: "#6b7280", lineHeight: 1.8 }}>
              <li>✓ Real-time score tracking</li>
              <li>✓ Accuracy by topic and difficulty</li>
              <li>✓ Time management insights</li>
              <li>✓ Performance benchmarks</li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: "600" }}>🎓 Learning Resources</h3>
            <ul style={{ listStyle: "none", padding: 0, color: "#6b7280", lineHeight: 1.8 }}>
              <li>✓ Video tutorials & guides</li>
              <li>✓ Concept walkthroughs</li>
              <li>✓ Strategy articles</li>
              <li>✓ Question explanations</li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: "600" }}>💬 Study Assistant AI</h3>
            <ul style={{ listStyle: "none", padding: 0, color: "#6b7280", lineHeight: 1.8 }}>
              <li>✓ 24/7 study buddy</li>
              <li>✓ Concept explanations</li>
              <li>✓ Strategy advice</li>
              <li>✓ Question walkthroughs</li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: "600" }}>🎯 Personalization</h3>
            <ul style={{ listStyle: "none", padding: 0, color: "#6b7280", lineHeight: 1.8 }}>
              <li>✓ Custom study plans</li>
              <li>✓ Adaptive difficulty</li>
              <li>✓ Goal-based learning</li>
              <li>✓ Progress recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ backgroundColor: "#f9fafb", padding: "80px 24px", marginTop: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: "32px", fontWeight: "700" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer"
                }}
              >
                <summary style={{ fontWeight: "600", fontSize: 16, outline: "none" }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: 12, color: "#6b7280", lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        marginTop: 0,
        padding: "60px 24px",
        backgroundColor: "#3A6EA5",
        textAlign: "center",
        color: "#ffffff"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: "700", marginBottom: 16 }}>
            Ready to Ace Your Exam?
          </h2>
          <p style={{ fontSize: 16, marginBottom: 32, opacity: 0.95 }}>
            Join thousands of students preparing with Askesis. Start your free trial today with 5 practice questions.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{
              padding: "12px 32px",
              backgroundColor: "#F9C74F",
              color: "#1f2937",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontSize: 16
            }}>
              Create Free Account
            </Link>
            <Link href="/login" style={{
              padding: "12px 32px",
              backgroundColor: "transparent",
              color: "#ffffff",
              textDecoration: "none",
              border: "2px solid #ffffff",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: 16
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div style={{ backgroundColor: "#1f2937", color: "#e5e7eb", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            marginBottom: 40
          }}>
            <div>
              <h4 style={{ color: "#ffffff", marginBottom: 16, fontWeight: "600" }}>Product</h4>
              <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.8 }}>
                <li><Link href="/exams" style={{ color: "#e5e7eb", textDecoration: "none" }}>Browse Exams</Link></li>
                <li><Link href="/subscription" style={{ color: "#e5e7eb", textDecoration: "none" }}>Pricing</Link></li>
                <li><Link href="/exams" style={{ color: "#e5e7eb", textDecoration: "none" }}>Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "#ffffff", marginBottom: 16, fontWeight: "600" }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.8 }}>
                <li><span style={{ color: "#9ca3af" }}>About (coming soon)</span></li>
                <li><span style={{ color: "#9ca3af" }}>Blog (coming soon)</span></li>
                <li><a href="mailto:contact@askesisprep.com" style={{ color: "#e5e7eb", textDecoration: "none" }}>Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "#ffffff", marginBottom: 16, fontWeight: "600" }}>Legal & Support</h4>
              <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.8 }}>
                <li><Link href="/privacy-policy" style={{ color: "#e5e7eb", textDecoration: "none" }}>Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" style={{ color: "#e5e7eb", textDecoration: "none" }}>Terms of Service</Link></li>
                <li><a href="mailto:contact@askesisprep.com" style={{ color: "#e5e7eb", textDecoration: "none" }}>Support</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #374151", paddingTop: 24, textAlign: "center", color: "#9ca3af" }}>
            <p>&copy; 2026 Askesis. All rights reserved. | Helping students succeed, one question at a time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
