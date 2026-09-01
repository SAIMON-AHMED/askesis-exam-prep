const policySections = [
  {
    heading: "Information We Collect",
    body: "When you register or sign in using Google OAuth, we receive basic profile information permitted by your Google account settings, which typically includes: name, email address, and profile picture.",
  },
  {
    heading: "How We Use Your Information",
    body: "We use the information we collect to create and manage your student account on Askesis Prep, authenticate your identity and secure access to your learning materials, and communicate important updates regarding your account or our services.",
  },
  {
    heading: "Data Security",
    body: "We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. We do not sell, trade, or rent your personal information to third parties.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="card fade-in" style={{ maxWidth: 900, margin: "48px auto", padding: 32 }}>
      <h1>Privacy Policy</h1>
      <p style={{ marginBottom: 20 }}>
        <strong>Effective Date:</strong> August 30, 2026
      </p>

      <p>
        At <strong>Askesis Prep</strong>, we respect your privacy and are committed to protecting the personal information of our student users. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and web application.
      </p>

      {policySections.map((section) => (
        <section key={section.heading} style={{ marginTop: 28 }}>
          <h2 style={{ marginBottom: 12 }}>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section style={{ marginTop: 28 }}>
        <h2>Contact Us</h2>
        <p>
          If you have any questions or concerns regarding this Privacy Policy, please contact us at:
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>
            <strong>Email:</strong> contact@askesisprep.com
          </li>
        </ul>
      </section>
    </main>
  );
}
