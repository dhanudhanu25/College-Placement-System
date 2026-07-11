import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { companyService } from "../../services/dataService";
import Spinner from "../../components/Spinner";
import { fileUrl } from "../../utils/format";
import { toast } from "react-toastify";
import { FaBuilding, FaUpload } from "react-icons/fa";

const CompanyProfile = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [logo, setLogo] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.company) return;
    companyService.getById(user.company).then((res) => setCompany(res.data.company));
  }, [user]);

  if (!user?.company) {
    return (
      <div className="alert alert-info">
        No company is linked to your account yet. Contact the placement officer.
      </div>
    );
  }
  if (!company) return <Spinner fullScreen />;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await companyService.update(company._id, company, logo);
      setCompany(res.data.company);
      toast.success("Company profile updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setCompany({ ...company, [key]: e.target.value });

  return (
    <div>
      <h4 className="section-title mb-3">
        <FaBuilding className="me-2 text-primary" /> Company Profile
      </h4>
      <div className="card p-4">
        <form onSubmit={submit}>
          <div className="d-flex align-items-center gap-3 mb-3">
            {company.logo ? (
              <img src={fileUrl(company.logo)} width={70} height={70} style={{ objectFit: "cover", borderRadius: 10 }} alt="" />
            ) : (
              <div className="avatar" style={{ width: 70, height: 70, fontSize: 28 }}>{company.companyName.charAt(0)}</div>
            )}
            <div>
              <label className="btn btn-outline-primary btn-sm mb-0">
                <FaUpload className="me-1" /> Change Logo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setLogo(e.target.files[0])}
                />
              </label>
              <div className="small text-muted-cpp mt-1">
                {company.approved ? "✓ Approved by placement officer" : "⏳ Pending approval"}
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="small fw-semibold">Company Name</label>
              <input className="form-control" value={company.companyName} onChange={set("companyName")} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">Email</label>
              <input className="form-control" value={company.email} onChange={set("email")} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">Website</label>
              <input className="form-control" value={company.website} onChange={set("website")} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">Location</label>
              <input className="form-control" value={company.location} onChange={set("location")} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">Industry</label>
              <input className="form-control" value={company.industry} onChange={set("industry")} />
            </div>
            <div className="col-12">
              <label className="small fw-semibold">Description</label>
              <textarea className="form-control" rows={3} value={company.description} onChange={set("description")} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
