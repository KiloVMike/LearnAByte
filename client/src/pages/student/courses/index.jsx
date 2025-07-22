import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentOption = cpyFilters[getSectionId]?.indexOf(getCurrentOption.id);

    if (!cpyFilters[getSectionId]) {
      cpyFilters[getSectionId] = [getCurrentOption.id];
    } else if (indexOfCurrentOption === -1) {
      cpyFilters[getSectionId].push(getCurrentOption.id);
    } else {
      cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({ ...filters, sortBy: sort });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      navigate(response?.data ? `/course-progress/${getCurrentCourseId}` : `/course/details/${getCurrentCourseId}`);
    }
  }

  useEffect(() => {
    const query = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(query));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters && sort) fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => sessionStorage.removeItem("filters");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white font-sans px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-tight">🎓 All Courses</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 w-full backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-indigo-400">Filters</h2>
          {Object.keys(filterOptions).map((section) => (
            <div key={section} className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300 mb-3">{section}</h3>
              <div className="space-y-2">
                {filterOptions[section].map((option) => (
                  <Label key={option.id} className="flex items-center gap-2 text-white text-sm">
                    <Checkbox
                      checked={filters?.[section]?.includes(option.id)}
                      onCheckedChange={() => handleFilterOnChange(section, option)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Course Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-white border-white/20 bg-white/10 hover:bg-white/20 shadow-md px-5"
                >
                  <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur border-white/20">
                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-gray-300 font-medium">
              {studentViewCoursesList.length} Results
            </span>
          </div>

          {/* Course Cards */}
          <div className="space-y-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 h-32 overflow-hidden rounded-xl">
                      <img
                        src={courseItem?.image}
                        alt={courseItem?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-white">
                      <CardTitle className="text-2xl font-semibold mb-1 text-indigo-400">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-300">
                        Created by <span className="font-semibold">{courseItem?.instructorName}</span>
                      </p>
                      <p className="text-sm mt-2 text-gray-400">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"
                        } • ${courseItem?.level?.toUpperCase()} Level`}
                      </p>
                      <p className="text-lg font-bold text-indigo-400 mt-3">₹ {courseItem?.pricing}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton className="w-full h-24 rounded-xl bg-white/20" />
            ) : (
              <p className="text-center text-gray-400 text-lg">No Courses Found</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
