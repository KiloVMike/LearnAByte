import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import logo from "../../assets/ssssssss-removebg-preview.png"

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

return (
  <header className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(99,102,241,0.15)] border-b border-white/10 transition-all duration-500">
    <div className="flex items-center justify-between px-6 lg:px-20 py-4 relative">
      {/* Glowing animated background pulse */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-44 h-44 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-ping -top-8 -left-10"></div>
        <div className="absolute w-32 h-32 bg-indigo-400 opacity-10 blur-2xl rounded-full animate-pulse top-6 right-0"></div>
      </div>

      {/* Left: Logo */}
<Link
  to="/home"
  className="  duration-300"
>
  <img
    src={logo}
    alt="LMS Learn"
    className="h-20 w-52  rounded-md "
  />
</Link>


      {/* Right: Navigation + Actions */}
      <div className="flex items-center gap-5">
  {/* Explore Courses */}
  <button
    onClick={() =>
      location.pathname.includes("/courses") ? null : navigate("/courses")
    }
    className="group flex items-center gap-2 text-white bg-white/10 hover:bg-indigo-500/30 transition-all duration-300 px-6 py-3 rounded-full text-base font-semibold shadow hover:shadow-indigo-500/20 border border-white/20 backdrop-blur"
  >
    <span className="group-hover:text-indigo-300 transition duration-300">
      📚 Explore Courses
    </span>
  </button>

  {/* My Courses */}
  <button
    onClick={() => navigate("/student-courses")}
    className="group flex items-center gap-2 text-white bg-white/10 hover:bg-indigo-500/30 transition-all duration-300 px-6 py-3 rounded-full text-base font-semibold shadow hover:shadow-indigo-500/20 border border-white/20 backdrop-blur"
  >
    <TvMinimalPlay className="w-6 h-6 text-indigo-300 group-hover:scale-110 transition-transform duration-300" />
    <span className="group-hover:text-indigo-300 transition duration-300">
      My Courses
    </span>
  </button>

  {/* Sign Out */}
  <Button
    onClick={handleLogout}
    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 text-base font-semibold rounded-full shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
  >
    🔒 Sign Out
  </Button>
</div>

    </div>
  </header>
);





}

export default StudentViewCommonHeader;
