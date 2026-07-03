import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState({ contacts: 0, companies: 0, users: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targets = { contacts: 2400, companies: 380, users: 5100 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        contacts: Math.floor(targets.contacts * ease),
        companies: Math.floor(targets.companies * ease),
        users: Math.floor(targets.users * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: "📞",
      title: "Real HR numbers",
      desc: "Direct phone numbers shared by people who actually called — no fake contacts, no gatekeeping.",
    },
    {
      icon: "🏢",
      title: "Company directory",
      desc: "Browse by company. See all HR contacts, roles, cities, and interview questions in one place.",
    },
    {
      icon: "💬",
      title: "Interview intel",
      desc: "People share exactly what was asked in each round. Walk into your interview prepared.",
    },
    {
      icon: "👥",
      title: "Community feed",
      desc: "Share your placement story, upload your resume, or post tips. Help others the way you were helped.",
    },
    {
      icon: "🔖",
      title: "Track your progress",
      desc: "Save contacts, mark them as called or applied. Manage your entire job search from one place.",
    },
    {
      icon: "✅",
      title: "Community verified",
      desc: "Likes and comments from real applicants tell you which contacts are still active.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "Find the company",
      desc: "Search by company name, role, or city. Instantly see HR contacts shared by the community.",
    },
    {
      num: "2",
      title: "Reveal the number",
      desc: "Click reveal to see the HR's direct phone number. Free users get 5 reveals a day.",
    },
    {
      num: "3",
      title: "Call and get hired",
      desc: "Call directly. No InMail, no waiting weeks for a recruiter to notice your application.",
    },
  ];

  const testimonials = [
    {
      name: "Sneha K.",
      role: "Frontend Developer · Placed at Infosys",
      text: "I found Priya's number on DekhoHR, called her directly, and had an interview scheduled the same week.",
      avatar: "S",
    },
    {
      name: "Rahul M.",
      role: "Backend Engineer · Placed at TCS",
      text: "LinkedIn InMail never worked for me. DekhoHR gave me a direct line to the hiring manager. Got placed in 2 weeks.",
      avatar: "R",
    },
    {
      name: "Priya T.",
      role: "Full Stack Developer · Placed at Wipro",
      text: "The interview questions section alone is worth it. I knew exactly what was coming in my DSA round.",
      avatar: "P",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#111827", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .btn-primary { background: #1A56DB; color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: #1E40AF; }
        .btn-secondary { background: #fff; color: #1A56DB; border: 1.5px solid #1A56DB; border-radius: 8px; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-secondary:hover { background: #EFF6FF; }
        .card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 28px; transition: box-shadow 0.2s, border-color 0.2s; }
        .card:hover { box-shadow: 0 8px 30px rgba(26,86,219,0.08); border-color: #BFDBFE; }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .hero-btns { flex-direction: column; align-items: center; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; gap: 12px !important; }
          .step-line { display: none !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "#fff",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
        padding: "14px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "#1A56DB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>D</div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: "#111827" }}>DekhoHR</span>
        </div>

        <div className="nav-links" style={{ display: "flex", gap: 32 }}>
          {["Features", "How it works", "Community"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{ color: "#6B7280", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
            >{item}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: "8px 18px", fontSize: 14 }}>Log in</Link>
          <Link to="/register" className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>Sign up free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, textAlign: "center", background: "linear-gradient(180deg, #EFF6FF 0%, #fff 100%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#DBEAFE", color: "#1D4ED8", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          🇮🇳 India's first community HR contact platform
        </div>

        <h1 className="hero-title" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: "#111827", maxWidth: 720, margin: "0 auto 20px" }}>
          Stop applying blind.<br />
          <span style={{ color: "#1A56DB" }}>Call the HR directly.</span>
        </h1>

        <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Real HR phone numbers shared by people who actually got hired. Search by company, get the contact, make the call.
        </p>

        <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <Link to="/feed" className="btn-primary" style={{ fontSize: 17, padding: "16px 36px", borderRadius: 10 }}>
            🚀 Explore HR Contacts
          </Link>
          <Link to="/register" className="btn-secondary" style={{ fontSize: 17, padding: "16px 36px", borderRadius: 10 }}>
            Create free account
          </Link>
        </div>

        {/* Hero demo card */}
        <div style={{ maxWidth: 460, margin: "0 auto", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.08)", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, background: "#DBEAFE", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1A56DB", fontSize: 14 }}>IN</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Infosys Digital</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Senior React Developer · Bangalore</div>
            </div>
            <div style={{ marginLeft: "auto", background: "#EFF6FF", color: "#1A56DB", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>Frontend</div>
          </div>

          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>HR Contact: <span style={{ color: "#111827", fontWeight: 500 }}>Priya Mehta</span></div>

          <div style={{ background: "#F1F5F9", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Phone number</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ filter: "blur(5px)", fontWeight: 600, fontFamily: "monospace", fontSize: 14, userSelect: "none" }}>+91 98765 43210</span>
              <span style={{ background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>Reveal</span>
            </div>
          </div>

          <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Phone number</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 14, color: "#059669" }}>+91 91234 56789</span>
              <span style={{ background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>✓ Revealed</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12, fontStyle: "italic" }}>
            "Called this number — got an interview in 2 days!" — Amit, TCS hire
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#1A56DB", padding: "52px 24px" }}>
        <div className="stats-grid" style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, textAlign: "center" }}>
          {[
            { value: count.contacts.toLocaleString() + "+", label: "HR contacts shared" },
            { value: count.companies.toLocaleString() + "+", label: "Companies covered" },
            { value: count.users.toLocaleString() + "+", label: "Job seekers helped" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: "#BFDBFE", marginTop: 8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A56DB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>How it works</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 36, fontWeight: 800, color: "#111827" }}>Three steps to your next job</h2>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: "relative", textAlign: "center", padding: "0 16px" }}>
                {i < steps.length - 1 && (
                  <div className="step-line" style={{ position: "absolute", top: 24, left: "calc(50% + 24px)", width: "calc(100% - 48px)", height: 1, background: "#E5E7EB" }} />
                )}
                <div style={{ width: 48, height: 48, background: "#EFF6FF", border: "2px solid #BFDBFE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A56DB", position: "relative", zIndex: 1 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A56DB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 36, fontWeight: 800, color: "#111827" }}>Everything you need to get hired faster</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A56DB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Community</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 36, fontWeight: 800, color: "#111827" }}>People who got hired through DekhoHR</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card">
                <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, background: "#DBEAFE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1A56DB", fontSize: 14, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #1A56DB 0%, #1E40AF 100%)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Stop waiting. Start calling.
        </h2>
        <p style={{ fontSize: 18, color: "#BFDBFE", maxWidth: 480, margin: "0 auto 36px" }}>
          Join thousands of job seekers who found their HR contact on DekhoHR and got hired faster.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/feed" style={{ background: "#fff", color: "#1A56DB", textDecoration: "none", padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16 }}>
            🚀 Explore HR Contacts
          </Link>
          <Link to="/register" style={{ background: "transparent", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
            Create free account
          </Link>
        </div>
        <p style={{ fontSize: 13, color: "#93C5FD", marginTop: 16 }}>No credit card required · Free forever for job seekers</p>
      </section>

      {/* Footer */}
      <footer style={{ background: "#111827", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, background: "#1A56DB", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>D</div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>DekhoHR</span>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280" }}>© 2026 DekhoHR. Built for Indian job seekers.</p>
      </footer>
    </div>
  );
};

export default Landing;