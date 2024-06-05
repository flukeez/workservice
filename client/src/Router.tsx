import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";

import Ctype from "./pages/ctype";
import CustomerPage from "@/pages/customer";
import CustomerFormPage from "@/pages/customer/customer_form";
import Equipment from "./pages/equipment";
const Faculty = lazy(() => import("@/pages/faculty"));
const OrganizeChart = lazy(() => import("@/pages/faculty/organize_chart"));
const Issue = lazy(() => import("@/pages/issue"));
const Position = lazy(() => import("@/pages/position"));
const Priority = lazy(() => import("@/pages/priority"));
const EquipStatus = lazy(() => import("@/pages/equip_status"));
const Category = lazy(() => import("@/pages/category"));
const Status = lazy(() => import("@/pages/status"));
const User = lazy(() => import("@/pages/user"));
const UserForm = lazy(() => import("@/pages/user/user_form"));
const PageNotFound = lazy(() => import("@/pages/notfound"));

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Ctype />} />
          <Route path="/home" element={<Ctype />} />
          <Route path="/faculty">
            <Route index element={<Faculty />} />
            <Route path="organize_chart/:id" element={<OrganizeChart />} />
          </Route>
          <Route path="/issue" element={<Issue />} />
          <Route path="/position" element={<Position />} />
          <Route path="/priority" element={<Priority />} />
          <Route path="/status" element={<Status />} />
          <Route path="/equip_status" element={<EquipStatus />} />
          <Route path="/category" element={<Category />} />
          <Route path="/user" element={<User />} />
          <Route path="/user">
            <Route index element={<User />} />
            <Route path="new" element={<UserForm />} />
            <Route path=":id" element={<UserForm />} />
          </Route>
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/ctype" element={<Ctype />} />
          <Route path="/customer">
            <Route index element={<CustomerPage />} />
            <Route path="new" element={<CustomerFormPage />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
