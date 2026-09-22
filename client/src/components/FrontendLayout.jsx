import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { api } from "../api";

function FrontendLayout() {
  const [site, setSite] = useState(null);

  useEffect(() => {
    api("/site")
      .then((data) => setSite(data))
      .catch(() => setSite({ settings: null, latestNews: [], categories: [] }));
  }, []);

  if (!site) return null;

  const { settings, latestNews, categories } = site;

  return (
    <>
      <div id="header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-3">
              {settings && settings.website_logo ? (
                <Link to="/" id="logo">
                  <img src={`/uploads/${settings.website_logo}`} alt="Logo" />
                </Link>
              ) : (
                <Link to="/" id="logo">
                  <img src="/images/news.jpg" alt="Logo" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="menu-bar">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="menu">
                <li>
                  <Link to="/">Home</Link>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link to={`/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="main-content">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <Outlet />
            </div>
            <Sidebar latestNews={latestNews} categories={categories} />
          </div>
        </div>
      </div>

      <div id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {settings && settings.footer_description ? (
                <span>{settings.footer_description}</span>
              ) : (
                <span>
                  © Copyright 2026 News | Powered by <a href="#">NEWS Blog</a>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontendLayout;
