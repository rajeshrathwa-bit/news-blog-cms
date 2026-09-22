import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/admin/login");
  };

  return (
    <div>
      {/* HEADER */}
      <div id="header-admin">
        <div className="container">
          <div className="row">
            {/* LOGO */}
            <div className="col-md-2 me-auto">
              <Link to="/admin/dashboard">
                <img className="logo" src="/images/news.jpg" alt="Logo" />
              </Link>
            </div>
            {/* /LOGO */}
            {/* LOG-Out */}
            <div className="col-md-2">
              <a href="#" onClick={handleLogout} className="admin-logout">
                <i className="fa fa-sign-out"></i> logout
              </a>
            </div>
            {/* /LOG-Out */}
          </div>
        </div>
      </div>
      {/* /HEADER */}

      {/* Menu Bar */}
      <div id="admin-menubar">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="admin-menu">
                <li>
                  <Link to="/admin/dashboard">Home</Link>
                </li>
                <li>
                  <Link to="/admin/articles">Article</Link>
                </li>
                {user.role === "admin" && (
                  <>
                    <li>
                      <Link to="/admin/categories">Category</Link>
                    </li>
                    <li>
                      <Link to="/admin/users">Users</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/admin/comments">Comments</Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link to="/admin/settings">Settings</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* /Menu Bar */}

      <Outlet />

      {/* Footer */}
      <div id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <span>
                © Copyright 2026 News | Powered by <a href="">NEWS BLOG</a>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* /Footer */}
    </div>
  );
}

export default AdminLayout;
