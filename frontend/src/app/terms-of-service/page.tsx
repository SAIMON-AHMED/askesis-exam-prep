const termsSections = [
  {
    heading: "Use of Service",
    body: "Askesis Prep provides educational tools and resources for students. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of, or restrict the use of the platform by, any other user.",
  },
  {
    heading: "User Accounts",
    body: "To access certain features, you must sign in using a valid Google account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
  },
  {
    heading: "Intellectual Property",
    body: "All content, design elements, text, graphics, and code included on Askesis Prep are the property of Askesis Prep and are protected by applicable intellectual property laws.",
  },
  {
    heading: "Limitation of Liability",
    body: "Askesis Prep is provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.",
  },
  {
    heading: "Changes to Terms",
    body: "We reserve the right to modify these terms at any time. Continued use of Askesis Prep following any changes indicates your acceptance of the new terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="card fade-in" style={{ maxWidth: 900, margin: "48px auto", padding: 32 }}>
      <h1>Terms of Service</h1>
      <p style={{ marginBottom: 20 }}>
        <strong>Effective Date:</strong> August 30, 2026
      </p>

      <p>
        Welcome to <strong>Askesis Prep</strong>. By accessing or using our website and application, you agree to be bound by these Terms of Service.
      </p>

      {termsSections.map((section) => (
        <section key={section.heading} style={{ marginTop: 28 }}>
          <h2 style={{ marginBottom: 12 }}>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section style={{ marginTop: 28 }}>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
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
