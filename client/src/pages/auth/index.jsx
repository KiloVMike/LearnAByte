import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pic from '../../assets/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector-removebg-preview.png'


function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  function handleLoginWithToast(e) {
    e.preventDefault();
    if (!checkIfSignInFormIsValid()) {
      toast.error("Please fill all required fields for Sign In.");
      return;
    }
    handleLoginUser(e);
  }

  function handleRegisterWithToast(e) {
    e.preventDefault();
    if (!checkIfSignUpFormIsValid()) {
      toast.error("Please fill all required fields for Sign Up.");
      return;
    }
    handleRegisterUser(e);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex flex-col text-white">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Header */}
      <header className="px-4 lg:px-6 h-28 flex items-center justify-start border-b border-white/10 shadow-sm">
        <Link to={"/"} className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-indigo-400" />
          <span className="font-extrabold text-4xl tracking-wide">L LEARN</span>
        </Link>
      </header>

      {/* Auth Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 py-12 gap-10 animate-fade-in">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col items-start justify-center max-w-2xl space-y-4">
          <h2 className="text-4xl font-bold">Unlock your potential 🚀</h2>
          <p className="text-gray-300 text-lg">
            Learn from the best instructors and track your growth in one place.
          </p>
          <img
            src={pic}
            alt="Illustration of a person learning"
            className=" lg:block w-full h-full rounded-lg "
          />
        </div>

        {/* Auth form */}
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="p-6 bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-white">Welcome back!</CardTitle>
                <CardDescription className="text-sm text-gray-300">
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginWithToast}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="p-6 bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-white">Join the community!</CardTitle>
                <CardDescription className="text-sm text-gray-300">
                  Sign up to start learning and growing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterWithToast}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
