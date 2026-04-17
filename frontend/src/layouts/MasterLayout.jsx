import React from "react";
import "@tabler/core/dist/css/tabler.min.css";
import { useTranslation } from "react-i18next";

// layoutType can be 'navbar' or 'sidebar'
export default function MasterLayout({ children, layoutType = "navbar" }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "km" : "en");
  };

  // === SIDEBAR (VERTICAL) LAYOUT ===
  const renderSidebar = () => (
    <aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebar-menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <h1 className="navbar-brand navbar-brand-autodark">
          <a href="/">{t('product_dashboard')}</a>
        </h1>
        <div className="navbar-nav flex-row d-lg-none">
          <div className="nav-item">
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={toggleLanguage}>
              {i18n.language === "en" ? "KM" : "EN"}
            </button>
          </div>
          <div className="nav-item">
            <span
              className="avatar avatar-sm"
              style={{ backgroundImage: "url(https://i.pravatar.cc/150)" }}
            ></span>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="sidebar-menu">
          <ul className="navbar-nav pt-lg-3">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                <span className="nav-link-title">{t('products')}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );

  // === NAVBAR (HORIZONTAL) LAYOUT ===
  const renderNavbar = () => (
    <>
      <header className="navbar navbar-expand-md navbar-light d-print-none">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="/">{t('product_dashboard')}</a>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="nav-item d-none d-md-flex me-3">
              <button className="btn btn-sm btn-outline-secondary" onClick={toggleLanguage}>
                {i18n.language === "en" ? "KM" : "EN"}
              </button>
            </div>
            <div className="nav-item">
              <a href="#" className="nav-link d-flex lh-1 text-reset p-0">
                <span
                  className="avatar avatar-sm"
                  style={{ backgroundImage: "url(https://i.pravatar.cc/150)" }}
                ></span>
                <div className="d-none d-xl-block ps-2">
                  <div>{t('admin_user')}</div>
                  <div className="mt-1 small text-muted">{t('system_admin')}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar / Menu */}
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar navbar-light">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <a className="nav-link" href="/">
                    <span className="nav-link-title">{t('products')}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );

  return (
    <div className="page">
      {/* Conditionally render sidebar or navbar based on the prop */}
      {layoutType === "sidebar" ? renderSidebar() : renderNavbar()}

      {/* Main Content Wrapper */}
      <div className="page-wrapper">
        
        {/* If using sidebar, we optionally show a top header for desktop profile menu */}
        {layoutType === "sidebar" && (
          <header className="navbar navbar-expand-md navbar-light d-none d-lg-flex d-print-none">
            <div className="container-xl">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbar-menu"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="navbar-nav flex-row order-md-last ms-auto">
                <div className="nav-item d-none d-md-flex me-3">
                  <button className="btn btn-sm btn-outline-secondary" onClick={toggleLanguage}>
                    {i18n.language === "en" ? "KM" : "EN"}
                  </button>
                </div>
                <div className="nav-item">
                  <a href="#" className="nav-link d-flex lh-1 text-reset p-0">
                    <span
                      className="avatar avatar-sm"
                      style={{ backgroundImage: "url(https://i.pravatar.cc/150)" }}
                    ></span>
                    <div className="d-none d-xl-block ps-2">
                      <div>{t('admin_user')}</div>
                      <div className="mt-1 small text-muted">{t('system_admin')}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="page-body">
          <div className="container-xl">{children}</div>
        </div>

        {/* Footer */}
        <footer className="footer footer-transparent d-print-none">
          <div className="container-xl">
            <div className="row text-center align-items-center flex-row-reverse">
              <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">
                    Product App &copy; 2026 Admin Dashboard
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
