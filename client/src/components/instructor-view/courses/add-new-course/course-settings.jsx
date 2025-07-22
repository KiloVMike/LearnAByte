import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-md shadow-md text-white">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-indigo-300">
      Course Settings
    </CardTitle>
  </CardHeader>

  <div className="p-4">
    {mediaUploadProgress && (
      <MediaProgressbar
        isMediaUploading={mediaUploadProgress}
        progress={mediaUploadProgressPercentage}
      />
    )}
  </div>

  <CardContent>
    {courseLandingFormData?.image ? (
      <img
        src={courseLandingFormData.image}
        alt="Course Cover"
        className="rounded-md border border-white/10 shadow-md max-w-full h-auto"
      />
    ) : (
      <div className="flex flex-col gap-3 text-white">
        <Label className="text-sm text-gray-300">Upload Course Image</Label>
        <Input
          onChange={handleImageUploadChange}
          type="file"
          accept="image/*"
          className="bg-white/10 text-white border border-white/20 file:text-white file:bg-indigo-600 file:border-0 file:rounded-sm file:px-3 file:py-1"
        />
      </div>
    )}
  </CardContent>
</Card>
  );
}

export default CourseSettings;
