import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { studentService } from "../../services/dataService";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { toast } from "react-toastify";
import { FaFileExcel, FaTrash, FaUserGraduate } from "react-icons/fa";

const ManageStudents = () => {
  const { user } = useAuth();
  const [params, setParams] = useState({ page: 1, limit: 10, search: "", department: "" });
  const [state, setState] = useState({ loading: true, students: [], total: 0, pages: 1 });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    studentService.getAll(params).then((res) =>
      setState({
        loading: false,
        students: res.data.students,
        total: res.data.total,
        pages: res.data.pages,
      })
    );
  }, [params]);

  const remove = async (id) => {
    if (!window.confirm("Delete this student? This also removes their applications.")) return;
    try {
      await studentService.remove(id);
      toast.success("Student deleted.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed.");
    }
  };

  const exportExcel = async () => {
    try {
      const res = await studentService.getAll({ limit: 1000 });
      const rows = res.data.students.map((s) => ({
        Name: s.name,
        Email: s.email,
        Phone: s.phone,
        Department: s.department,
        CGPA: s.cgpa,
        Skills: (s.skills || []).join(", "),
        Verified: s.isVerified ? "Yes" : "No",
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");
      XLSX.writeFile(wb, "students.xlsx");
      toast.success("Exported to Excel.");
    } catch (e) {
      toast.error("Export failed.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="section-title mb-0">Manage Students</h4>
        <button className="btn btn-success btn-sm" onClick={exportExcel}>
          <FaFileExcel className="me-1" /> Export Excel
        </button>
      </div>

      <SearchBar
        onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
        placeholder="Search students..."
        className="mb-3"
      />

      {state.loading ? (
        <Spinner fullScreen />
      ) : state.students.length === 0 ? (
        <EmptyState title="No students found" />
      ) : (
        <>
          <div className="card p-2">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>CGPA</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.students.map((s) => (
                    <tr key={s._id}>
                      <td className="fw-semibold">{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.department}</td>
                      <td>{s.cgpa}</td>
                      <td>
                        {s.isVerified ? (
                          <span className="badge bg-success-subtle text-success">Yes</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning">No</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={s._id === user?._id}
                          onClick={() => remove(s._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-3">
            <Pagination page={params.page} pages={state.pages} onPageChange={(page) => setParams((p) => ({ ...p, page }))} />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageStudents;
