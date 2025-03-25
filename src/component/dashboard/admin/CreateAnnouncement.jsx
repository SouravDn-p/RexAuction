import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignRight, Link, Upload, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import ThemeContext from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import withReactContent from "sweetalert2-react-content";
// import { toast } from "react-hot-toast";

const MySwal = withReactContent(Swal);

export default function CreateAnnouncement() {
  const { isDarkMode } = useContext(ThemeContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Handle Image Upload
      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const response = await axios.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          imageUrl = response.data.data.url;
        }
      }

      // Prepare Announcement Data
      const announcementData = {
        title: data.title,
        content: data.content,
        date: data.date,
        status: data.status,
        image: imageUrl,
      };

      // Send POST Request
      const res = await axios.post(
        "http://localhost:3000/announcement",
        announcementData
      );

      if (res.data.success) {
        toast.success("Announcement created successfully!");
        reset();
      }
    } catch (error) {
      toast.error("Failed to publish announcement");
      console.error("Error:", error);
      await MySwal.fire({
        title: "Error",
        text: "Something went wrong while publishing your announcement",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${bgMain} ${textColor}`}>
      <div className={`max-w-6xl mx-auto p-6 rounded-lg  ${cardBg}`}>
        <h1 className="text-2xl font-bold mb-1">Create Announcement</h1>
        <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Create and publish announcements to your target audience
        </p>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Announcement Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className={`w-full ${inputBg} ${borderColor} ${textColor}`}
              required
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Announcement Content <span className="text-red-500">*</span>
            </Label>
            <div className={`border ${borderColor} rounded-md overflow-hidden`}>
              <div className={`${toolbarBg} p-2 border-b ${borderColor} flex gap-2`}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", isBold && activeButtonBg)}
                  onClick={() => toggleStyle("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", isItalic && activeButtonBg)}
                  onClick={() => toggleStyle("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", isUnderline && activeButtonBg)}
                  onClick={() => toggleStyle("underline")}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", isRTL && activeButtonBg)}
                  onClick={() => toggleStyle("rtl")}
                >
                  <AlignRight className="h-4 w-4" />
                  <span className="sr-only">RTL</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", showLinkInput && activeButtonBg)}
                  onClick={handleAddLink}
                >
                  <Link className="h-4 w-4" />
                  <span className="sr-only">Add Link</span>
                </Button>
              </div>
              
              {showLinkInput && (
                <div className={`p-2 ${toolbarBg} border-b ${borderColor}`}>
                  <Input
                    ref={linkInputRef}
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter URL"
                    className={`w-full ${inputBg} ${borderColor} ${textColor}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddLink();
                      }
                    }}
                  />
                </div>
              )}
              
              <div
                ref={editorRef}
                contentEditable
                className={`min-h-[150px] p-3 focus:outline-none ${inputBg} ${textColor}`}
                onInput={updateContent}
                onKeyDown={(e) => {
                  if (isRTL) {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                      e.preventDefault();
                      const selection = window.getSelection();
                      if (selection?.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        if (e.key === "ArrowLeft") {
                          range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
                        } else {
                          range.setStart(range.startContainer, Math.min(
                            range.startContainer.length, 
                            range.startOffset + 1
                          ));
                        }
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                      }
                    }
                  }
                }}
                style={{
                  direction: isRTL ? "rtl" : "ltr",
                  textAlign: isRTL ? "right" : "left",
                  unicodeBidi: isRTL ? "embed" : "normal",
                }}
              />
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <Label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Target Audience <span className="text-red-500">*</span>
            </Label>
            <RadioGroup 
              value={targetAudience} 
              onValueChange={setTargetAudience} 
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-users" />
                <Label htmlFor="all-users" className={textColor}>
                  All Users
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific-groups" />
                <Label htmlFor="specific-groups" className={textColor}>
                  Specific Groups
                </Label>
              </div>
            </RadioGroup>

            {targetAudience === "specific" && (
              <div className="mt-2">
                <Select
                  multiple
                  onValueChange={(values) => setSelectedGroups(values)}
                >
                  <SelectTrigger className={`w-full ${inputBg} ${borderColor} ${textColor}`}>
                    <SelectValue placeholder="Select groups" />
                  </SelectTrigger>
                  <SelectContent className={`${cardBg} ${borderColor} ${textColor}`}>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Display Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Display Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      `w-full justify-start text-left font-normal ${inputBg} ${borderColor} ${textColor}`,
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy/MM/dd") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={`w-auto p-0 ${cardBg} ${borderColor}`}>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={`${cardBg} ${textColor}`}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Display End Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      `w-full justify-start text-left font-normal ${inputBg} ${borderColor} ${textColor}`,
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy/MM/dd") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={`w-auto p-0 ${cardBg} ${borderColor}`}>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className={`${cardBg} ${textColor}`}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <Label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Media Upload
            </Label>
            <div
              className={`border-2 border-dashed ${borderColor} rounded-lg p-8 text-center`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-10 w-10 mx-auto text-gray-500" />
              <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Drag and drop files here or click to upload
              </p>
              <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"} mt-1`}>
                Supported formats: JPG, PNG, MP4, PDF, WebM
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                multiple 
                accept="image/*,video/*,application/pdf"
              />
              <Button
                type="button"
                variant="outline"
                className={`mt-4 ${isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-100 border-gray-300 hover:bg-gray-200"} ${textColor}`}
                onClick={handleBrowseFiles}
              >
                Browse Files
              </Button>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Selected Files:
                </h4>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              className={`${isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white border-gray-300 hover:bg-gray-50"} ${textColor}`}
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white" 
              onClick={handlePublish}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}