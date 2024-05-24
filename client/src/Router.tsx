import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";

import PageNotFound from "./pages/notfound";
import Ctype from "./pages/ctype";
import CustomerPage from "@/pages/customer";
import CustomerFormPage from "@/pages/customer/customer_form";
import { lazy } from "react";
const Faculty = lazy(() => import("@/pages/faculty"));

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Ctype />} />
          <Route path="/home" element={<Ctype />} />
          <Route path="/faculty" element={<Faculty />} />
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
