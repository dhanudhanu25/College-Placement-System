import { useState, useEffect } from "react";
import { companyService } from "../../services/dataService";
import CompanyCard from "../../components/CompanyCard";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import { SkeletonCard } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

const Companies = () => {
  const [params, setParams] = useState({ page: 1, limit: 9, search: "", approved: "true" });
  const [state, setState] = useState({ loading: true, companies: [], total: 0, pages: 1 });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true }));
    companyService
      .getAll(params)
      .then((res) => {
        if (active)
          setState({
            loading: false,
            companies: res.data.companies,
            total: res.data.total,
            pages: res.data.pages,
          });
      })
      .catch(() => setState((s) => ({ ...s, loading: false })));
    return () => (active = false);
  }, [params]);

  const handleSearch = (search) => setParams((p) => ({ ...p, search, page: 1 }));
  const handlePage = (page) => setParams((p) => ({ ...p, page }));

  return (
    <div className="py-4">
      <div className="container">
        <h2 className="section-title mb-3">Partner Companies</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <SearchBar onSearch={handleSearch} placeholder="Search companies by name, industry or location" />
          </div>
        </div>

        {state.loading ? (
          <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-md-4" key={i}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : state.companies.length === 0 ? (
          <EmptyState title="No companies found" message="Try a different search." />
        ) : (
          <>
            <div className="row g-3">
              {state.companies.map((c) => (
                <div className="col-md-4 col-6" key={c._id}>
                  <CompanyCard company={c} />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Pagination page={params.page} pages={state.pages} onPageChange={handlePage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Companies;
