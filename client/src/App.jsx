import { Navigate, Route, Routes } from 'react-router-dom'
import FrontendLayout from './components/FrontendLayout'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Category from './pages/Category'
import SingleArticle from './pages/SingleArticle'
import Search from './pages/Search'
import Author from './pages/Author'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Articles from './pages/admin/Articles'
import ArticleForm from './pages/admin/ArticleForm'
import Categories from './pages/admin/Categories'
import CategoryForm from './pages/admin/CategoryForm'
import Users from './pages/admin/Users'
import UserForm from './pages/admin/UserForm'
import Comments from './pages/admin/Comments'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/new" element={<ArticleForm />} />
        <Route path="articles/:id/edit" element={<ArticleForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id/edit" element={<UserForm />} />
        <Route path="comments" element={<Comments />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/" element={<FrontendLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="single/:id" element={<SingleArticle />} />
        <Route path="search" element={<Search />} />
        <Route path="author/:id" element={<Author />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App