import jsPDF from "jspdf";

// Generates a dummy offer letter PDF for a selected student/application.
export const generateOfferLetter = (student, job, company) => {
  const doc = new jsPDF();
  const primary = "#4f46e5";

  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(company?.companyName || "Company Name", 14, 22);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Offer Letter", 14, 56);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const date = new Date().toLocaleDateString("en-IN");

  const body = [
    `Date: ${date}`,
    "",
    `Dear ${student?.name || "Candidate"},`,
    "",
    `We are pleased to offer you the position of "${
      job?.title || "Software Engineer"
    }" at ${company?.companyName || "our company"}.`,
    `This offer is based on your performance during the recruitment process and the`,
    `recommendation of our hiring panel.`,
    "",
    `Location: ${job?.location || "Bangalore"}`,
    `Compensation: ${job?.salary || "As per company policy"}`,
    "",
    `Please confirm your acceptance by signing and returning this letter.`,
    "",
    `We look forward to welcoming you to the team.`,
    "",
    `Sincerely,`,
    `HR Team, ${company?.companyName || "Company"}`,
  ];

  let y = 68;
  body.forEach((line) => {
    doc.text(line, 14, y);
    y += 7;
  });

  doc.setDrawColor(79, 70, 229);
  doc.line(14, y + 6, 90, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Authorized Signature", 14, y + 12);

  doc.save(`Offer_Letter_${student?.name || "Candidate"}.pdf`);
};
