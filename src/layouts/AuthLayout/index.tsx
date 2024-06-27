import { useUserContext } from "@/context/userContext";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { user } = useUserContext();

  if (user) {
    return <Navigate to={"/home"} />;
  }
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}
