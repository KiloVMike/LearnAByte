import { Skeleton } from "@/components/ui/skeleton";
import {
  initialSignInFormData,
  initialSignUpFormData,
} from "@/config";
import {
  checkAuthService,
  loginService,
  registerService,
} from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fixed register user function
  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      console.log("REGISTER RESPONSE:", data);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        console.error("Registration failed:", data.message || data.error);
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  // ✅ Login user function
  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("LOGIN RESPONSE:", data);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        console.error("Login failed:", data.message || data.error);
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  // ✅ Check if user is already authenticated on mount
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.log("Auth check error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  // ✅ Reset auth state (for logout etc.)
  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
    sessionStorage.removeItem("accessToken");
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
