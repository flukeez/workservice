import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";

import Ctype from "./pages/ctype";
import CustomerPage from "@/pages/customer";
import CustomerFormPage from "@/pages/customer/customer_form";
const Faculty = lazy(() => import("@/pages/faculty"));
const Issue = lazy(() => import("@/pages/issue"));
const Position = lazy(() => import("@/pages/position"));
const Priority = lazy(() => import("@/pages/priority"));
const Status = lazy(() => import("@/pages/status"));
const PageNotFound = lazy(() => import("@/pages/notfound"));

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Ctype />} />
          <Route path="/home" element={<Ctype />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/position" element={<Position />} />
          <Route path="/priority" element={<Priority />} />
          <Route path="/status" element={<Status />} />
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
