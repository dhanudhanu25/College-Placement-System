import { Link } from "react-router-dom";
import { FaCheckCircle, FaBullseye, FaHandshake, FaChartLine } from "react-icons/fa";

const About = () => (
  <div>
    <section className="gradient-hero py-5 text-white">
      <div className="container text-center py-4">
        <h1 className="display-5 fw-bold">About Placement Portal</h1>
        <p className="lead opacity-75">
          A unified platform bridging students, recruiters and placement officers.
        </p>
      </div>
    </section>

    <section className="py-5">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <h2 className="section-title">Our Mission</h2>
            <p className="text-muted-cpp">
              We simplify campus recruitment by bringing every stakeholder onto a
              single, secure and efficient platform. Students can build profiles,
              upload resumes and apply to opportunities. Recruiters can post jobs,
              review applicants and schedule interviews. Placement officers get
              full visibility and analytics.
            </p>
            <ul className="list-unstyled">
              {[
                "Role-based secure access",
                "Real-time application tracking",
                "Powerful analytics dashboards",
                "Seamless resume & document handling",
              ].map((item, i) => (
                <li key={i} className="mb-2 d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {[
                { icon: <FaBullseye />, title: "Smart Matching", desc: "Jobs matched to skills & department." },
                { icon: <FaHandshake />, title: "Direct Connect", desc: "Recruiters connect directly with talent." },
                { icon: <FaChartLine />, title: "Insightful Analytics", desc: "Track placement performance in real time." },
              ].map((f, i) => (
                <div className="col-md-6" key={i}>
                  <div className="card p-3 h-100">
                    <div className="icon rounded text-primary fs-3 mb-2">
                      {f.icon}
                    </div>
                    <h6 className="fw-bold">{f.title}</h6>
                    <p className="small text-muted-cpp mb-0">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-4">
      <div className="container text-center">
        <Link to="/signup" className="btn btn-primary btn-lg px-4">
          Join the Portal
        </Link>
      </div>
    </section>
  </div>
);

export default About;
