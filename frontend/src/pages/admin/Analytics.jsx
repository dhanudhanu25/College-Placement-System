import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { adminService } from "../../services/dataService";
import useFetch from "../../hooks/useFetch";
import Spinner from "../../components/Spinner";
import { LineChart, DoughnutChart, BarChart } from "../../components/charts/Charts";
import { formatDate } from "../../utils/format";
import { toast } from "react-toastify";
import { FaFilePdf, FaUserGraduate, FaChartBar } from "react-icons/fa";

const Analytics = () => {
  const dash = useFetch(() => adminService.dashboard(), []);

  if (dash.loading) return <Spinner fullScreen />;

  const s = dash.data?.stats || {};
  const monthly = dash.data?.monthly || { labels: [], data: [] };
  const status = dash.data?.statusBreakdown || [];
  const dept = dash.data?.byDepartment || [];

  const generatePDF = async () => {
    try {
      const res = await adminService.report();
      const doc = new jsPDF();
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 28, "F");
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.text("Placement Report", 14, 18);
      doc.setTextColor(30);
      doc.setFontSize(11);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 38);

      doc.setFontSize(12);
      doc.text("Summary", 14, 50);
      doc.autoTable({
        startY: 54,
        head: [["Metric", "Value"]],
        body: [
          ["Students", s.totalStudents],
          ["Companies", s.totalCompanies],
          ["Jobs", s.totalJobs],
          ["Applications", s.totalApplications],
          ["Selected", s.selected],
          ["Interviews", s.interviews],
        ],
        theme: "striped",
      });

      doc.text(
        "Students",
        14,
        doc.lastAutoTable.finalY + 12
      );
      const students = res.data.students.map((st) => [
        st.name,
        st.email,
        st.department,
        st.cgpa,
        st.isVerified ? "Yes" : "No",
      ]);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 16,
        head: [["Name", "Email", "Department", "CGPA", "Verified"]],
        body: students,
        theme: "grid",
        styles: { fontSize: 8 },
      });

      doc.save("Placement_Report.pdf");
      toast.success("Report generated.");
    } catch (e) {
      toast.error("Failed to generate report.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="section-title mb-0">
          <FaChartBar className="me-2 text-primary" /> Analytics
        </h4>
        <button className="btn btn-danger btn-sm" onClick={generatePDF}>
          <FaFilePdf className="me-1" /> Download PDF Report
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card p-3">
            <h6 className="fw-bold">Applications Trend</h6>
            <LineChart labels={monthly.labels} data={monthly.data} label="Applications" />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card p-3">
            <h6 className="fw-bold">Application Status</h6>
            <DoughnutChart
              labels={status.map((x) => x._id)}
              data={status.map((x) => x.count)}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="card p-3">
            <h6 className="fw-bold">
              <FaUserGraduate className="me-2 text-primary" /> Students by Department
            </h6>
            <BarChart
              labels={dept.map((x) => x._id || "Other")}
              data={dept.map((x) => x.count)}
              label="Students"
              color="#0ea5e9"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
