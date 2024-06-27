import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Home from "./pages/home";
import { Toaster } from "./components/ui/toaster";
import Verify from "./pages/verify";
import Navbar from "./components/custom-ui/Navbar";
import { useUserContext } from "./context/userContext";
import { Loader } from "lucide-react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify/:username" element={<Verify />} />
          </Route>
          <Route path="" element={<PrivateRoute />}>
            <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

const PrivateRoute = () => {
  const { user, loading } = useUserContext();

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
