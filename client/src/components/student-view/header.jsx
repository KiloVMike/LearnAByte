import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

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
        className="flex items-center gap-3 group hover:scale-[1.03] transition-transform duration-300"
      >
        <div className="p-2 rounded-full bg-indigo-600/20 border border-indigo-400/30 shadow-inner hover:shadow-indigo-500/40 transition">
          <GraduationCap className="h-7 w-7 text-indigo-400" />
        </div>
        <span className="text-xl md:text-2xl font-extrabold text-white tracking-wide group-hover:text-indigo-300 transition">
          LMS Learn
        </span>
      </Link>

      {/* Right: Navigation + Actions */}
      <div className="flex items-center gap-4">
        {/* Explore Courses */}
        <button
          onClick={() =>
            location.pathname.includes("/courses") ? null : navigate("/courses")
          }
          className="group flex items-center gap-2 text-white bg-white/10 hover:bg-indigo-500/30 transition-all duration-300 px-5 py-2 rounded-full text-sm font-medium shadow hover:shadow-indigo-500/20 border border-white/20 backdrop-blur"
        >
          <span className="group-hover:text-indigo-300 transition duration-300">
            📚 Explore Courses
          </span>
        </button>

        {/* My Courses */}
        <button
          onClick={() => navigate("/student-courses")}
          className="group flex items-center gap-2 text-white bg-white/10 hover:bg-indigo-500/30 transition-all duration-300 px-5 py-2 rounded-full text-sm font-medium shadow hover:shadow-indigo-500/20 border border-white/20 backdrop-blur"
        >
          <TvMinimalPlay className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform duration-300" />
          <span className="group-hover:text-indigo-300 transition duration-300">
            My Courses
          </span>
        </button>

        {/* Sign Out */}
        <Button
          onClick={handleLogout}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2 font-semibold rounded-full shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
        >
          🔒 Sign Out
        </Button>
      </div>
    </div>
  </header>
);





}

export default StudentViewCommonHeader;
