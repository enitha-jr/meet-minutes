import "../../styles/FeaturesPage.css";
import {
  FaCalendarCheck,
  FaTasks,
  FaLock,
  FaChartLine,
  FaEdit,
  FaUsers
} from "react-icons/fa";

function FeaturesPage() {

  const features = [
    {
      icon: <FaUsers />,
      title: "Meeting Management",
      desc: "Create, schedule and organize meetings effortlessly."
    },
    {
      icon: <FaEdit />,
      title: "Minutes Recording",
      desc: "Record and update meeting minutes in real time."
    },
    {
      icon: <FaLock />,
      title: "Secure Communication",
      desc: "End-to-end secure messaging between members."
    },
    {
      icon: <FaTasks />,
      title: "Task Assignment",
      desc: "Assign responsibilities individually and track owners."
    },
    {
      icon: <FaChartLine />,
      title: "Progress Reports",
      desc: "Monitor work status with detailed reports and insights."
    },
    {
      icon: <FaCalendarCheck />,
      title: "Integrated Calendar",
      desc: "Access all meetings and follow-ups in one place."
    }
  ];

  return (
    <div className="features-page">

      <h2 className="features-title">Key Features</h2>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">

            <div className="feature-icon">{f.icon}</div>

            <h3 className="feature-heading">{f.title}</h3>

            <p className="feature-desc">{f.desc}</p>

          </div>
        ))}
      </div>

    </div>
  );
}

export default FeaturesPage;
