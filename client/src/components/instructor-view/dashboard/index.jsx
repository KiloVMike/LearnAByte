import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const { totalStudents, totalProfit, studentList } =
    calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      iconColor: "text-indigo-400",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₹${totalProfit.toLocaleString()}`,
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.map((item, index) => (
          <Card
            key={index}
            className="bg-white/5 text-white border border-white/10 backdrop-blur-sm shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">
                {item.label}
              </CardTitle>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Table */}
      <Card className="bg-white/5 text-white border border-white/10 backdrop-blur-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-white font-semibold">
            Students List
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {studentList.length === 0 ? (
            <p className="text-sm text-gray-300">No students enrolled yet.</p>
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/80">Course Name</TableHead>
                  <TableHead className="text-white/80">Student Name</TableHead>
                  <TableHead className="text-white/80">Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.map((student, index) => (
                  <TableRow key={index} className="hover:bg-white/10">
                    <TableCell className="font-medium text-white">
                      {student.courseTitle}
                    </TableCell>
                    <TableCell className="text-white">
                      {student.studentName}
                    </TableCell>
                    <TableCell className="text-white">
                      {student.studentEmail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
