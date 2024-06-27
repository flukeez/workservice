import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoadingLayout } from "./components/login/LoadingLayout";
import ProtectRoute from "./components/protect_route/ProtectRoute";
import PublicRoute from "./components/protect_route/PublicRoute";

const RequestForm = lazy(() => import("@/pages/request/request_form"));
const Request = lazy(() => import("@/pages/request"));
const RequestDetails = lazy(() => import("@/pages/request/request_details"));
const Equipment = lazy(() => import("@/pages/equipment"));
const EquipmentForm = lazy(() => import("@/pages/equipment/equipment_form"));
const Faculty = lazy(() => import("@/pages/faculty"));
const UserPosition = lazy(() => import("@/pages/user_position"));
const Issue = lazy(() => import("@/pages/issue"));
const Position = lazy(() => import("@/pages/position"));
const Priority = lazy(() => import("@/pages/priority"));
const EquipStatus = lazy(() => import("@/pages/equip_status"));
const Category = lazy(() => import("@/pages/category"));
const Status = lazy(() => import("@/pages/status"));
const User = lazy(() => import("@/pages/user"));
const UserForm = lazy(() => import("@/pages/user/user_form"));
const Provider = lazy(() => import("@/pages/provider"));
const ProviderForm = lazy(() => import("@/pages/provider/provider_form"));
const Login = lazy(() => import("@/pages/login"));
const PageNotFound = lazy(() => import("@/pages/notfound"));

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<LoadingLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>
        <Route element={<ProtectRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Faculty />} />
            <Route path="/request">
              <Route index element={<Request />} />
              <Route path="new" element={<RequestForm />} />
              <Route path=":id" element={<RequestForm />} />
              <Route path="assign" element={<RequestForm />} />
              <Route path="details/:id" element={<RequestDetails />} />
            </Route>
            <Route path="/service_request" element={<RequestForm />} />
            <Route path="/home" element={<Faculty />} />
            <Route path="/faculty">
              <Route index element={<Faculty />} />
              <Route path="user_position/:id" element={<UserPosition />} />
            </Route>
            <Route path="/provider">
              <Route index element={<Provider />} />
              <Route path="new" element={<ProviderForm />} />
              <Route path=":id" element={<ProviderForm />} />
            </Route>
            <Route path="/issue" element={<Issue />} />
            <Route path="/position" element={<Position />} />
            <Route path="/priority" element={<Priority />} />
            <Route path="/status" element={<Status />} />
            <Route path="/equip_status" element={<EquipStatus />} />
            <Route path="/category" element={<Category />} />
            <Route path="/user">
              <Route index element={<User />} />
              <Route path="new" element={<UserForm />} />
              <Route path=":id" element={<UserForm />} />
            </Route>
            <Route element={<UserForm />} path="/profile" />
            <Route path="/equipment">
              <Route index element={<Equipment />} />
              <Route path="create" element={<EquipmentForm />} />
              <Route path=":id" element={<EquipmentForm />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
