import React from "react";

export default function PageHeader({ title, children }) {
  return (
    <div className="page-header d-print-none mb-4">
      <div className="row align-items-center">
        <div className="col">
          <h2 className="page-title">{title}</h2>
        </div>
        {children && <div className="col-auto ms-auto d-print-none">{children}</div>}
      </div>
    </div>
  );
}
