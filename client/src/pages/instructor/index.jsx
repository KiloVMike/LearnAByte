import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/10 hidden md:block shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-white">Instructor Panel</h2>
          <nav className="space-y-2">
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                variant="ghost"
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
                className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-md transition-all duration-200
                  ${
                    activeTab === menuItem.value
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <menuItem.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{menuItem.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {menuItems.find((item) => item.value === activeTab)?.label}
          </h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
