import { Navigate, Outlet } from "react-router-dom";
import { useLoginStore } from "@/stores/useLoginStore";

export default function ProtectRoute() {
  const loginStore = useLoginStore();
  const isAuthenticated = () => !!loginStore.token;

  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
}
