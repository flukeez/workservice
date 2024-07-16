import { Navigate, Outlet } from "react-router-dom";
import { useLoginStore } from "@/stores/useLoginStore";

export default function PublicRoute() {
  const loginStore = useLoginStore();
  const isAuthenticated = () => !!loginStore.token;

  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
}
