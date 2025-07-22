import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  return (
   <Card className="bg-white/5 border border-white/10 backdrop-blur-md shadow-md text-white">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-indigo-300">
      Course Landing Page
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    <FormControls
      formControls={courseLandingPageFormControls}
      formData={courseLandingFormData}
      setFormData={setCourseLandingFormData}
    />
  </CardContent>
</Card>
  );
}

export default CourseLanding;
