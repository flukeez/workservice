import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";

const Equipment = lazy(() => import("@/pages/equipment"));
const EquipmentForm = lazy(() => import("@/pages/equipment/equipment_form"));
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
          <Route path="/" element={<Faculty />} />
          <Route path="/home" element={<Faculty />} />
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
          <Route path="/equipment">
            <Route index element={<Equipment />} />
            <Route path="create" element={<EquipmentForm />} />
            <Route path=":id" element={<EquipmentForm />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
