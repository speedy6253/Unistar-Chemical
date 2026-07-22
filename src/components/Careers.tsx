import React, { useState, useRef } from "react";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  ChevronRight,
  UserCheck
} from "lucide-react";
import { careerService, JobApplicationInput } from "../services/careerService";

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  employment: string;
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: "sales-executive",
    title: "Sales Executive",
    department: "Sales & Business Development",
    location: "Kolkata",
    experience: "1–3 Years",
    employment: "Full Time",
  },
  {
    id: "logistics-coordinator",
    title: "Logistics Coordinator",
    department: "Logistics & Supply Chain",
    location: "Kolkata",
    experience: "2–4 Years",
    employment: "Full Time",
  },
  {
    id: "procurement-executive",
    title: "Procurement Executive",
    department: "Procurement",
    location: "Kolkata",
    experience: "2+ Years",
    employment: "Full Time",
  },
  {
    id: "qa-executive",
    title: "Quality Assurance Executive",
    department: "Quality & Documentation",
    location: "Kolkata",
    experience: "1–3 Years",
    employment: "Full Time",
  },
  {
    id: "warehouse-executive",
    title: "Warehouse Executive",
    department: "Warehouse & Inventory",
    location: "Kolkata",
    experience: "1–3 Years",
    employment: "Full Time",
  },
  {
    id: "accounts-admin-executive",
    title: "Accounts & Administration Executive",
    department: "Finance & Administration",
    location: "Kolkata",
    experience: "2+ Years",
    employment: "Full Time",
  },
];

export default function Careers() {
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Status & Validation
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successAppId, setSuccessAppId] = useState("");

  const handleSelectJob = (jobTitle: string) => {
    setPosition(jobTitle);
    setErrorMsg("");
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (!validTypes.includes(file.type) && !["pdf", "doc", "docx"].includes(ext || "")) {
        setErrorMsg("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
        setResumeFile(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("File size exceeds 5 MB. Please upload a smaller resume.");
        setResumeFile(null);
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessAppId("");

    // Validate fields
    if (!fullName.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }
    if (!currentLocation.trim()) {
      setErrorMsg("Current Location is required.");
      return;
    }
    if (!contactNumber.trim() || contactNumber.trim().length < 7) {
      setErrorMsg("Please enter a valid Contact Number.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid Email ID.");
      return;
    }
    if (!position) {
      setErrorMsg("Please select the Position you are applying for.");
      return;
    }
    if (!resumeFile) {
      setErrorMsg("Please upload your resume (PDF, DOC, or DOCX, max 5 MB).");
      return;
    }

    try {
      setLoading(true);
      const appId = await careerService.submitApplication({
        fullName: fullName.trim(),
        currentLocation: currentLocation.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        position,
        resumeFile,
      });

      setSuccessAppId(appId);
      // Reset form
      setFullName("");
      setCurrentLocation("");
      setContactNumber("");
      setEmail("");
      setPosition("");
      setResumeFile(null);
    } catch (err: any) {
      console.error("Application submission failed:", err);
      setErrorMsg("Failed to submit your application. Please try again or email us directly at info@unistarchemicals.in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="careers" className="py-24 bg-gray-50/60 border-t border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-14">
          <div className="text-xs font-black text-[#123C74] tracking-widest uppercase">
            CAREERS
          </div>
          <div className="flex items-center gap-3 w-full max-w-[240px]">
            <div className="h-[1px] bg-[#123C74]/20 flex-grow" />
            <span className="text-[#2FA8B8] text-[11px] font-black">★</span>
            <div className="h-[1px] bg-[#123C74]/20 flex-grow" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mt-1">
            Join Our Team
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed font-medium mt-1">
            At Unistar Chemicals, we're always looking for passionate and talented professionals to grow with us. Explore our current openings and submit your application below.
          </p>
        </div>

        {/* Current Openings Title */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#123C74]" />
            <h3 className="text-lg font-black text-[#123C74] uppercase tracking-wide">
              Current Openings
            </h3>
          </div>
          <span className="text-xs font-extrabold text-[#2FA8B8] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {JOB_OPENINGS.length} Positions Available
          </span>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {JOB_OPENINGS.map((job) => {
            const isSelected = position === job.title;
            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between gap-5 relative group ${
                  isSelected 
                    ? "border-[#2FA8B8] shadow-lg ring-2 ring-[#2FA8B8]/20" 
                    : "border-gray-200 hover:border-[#123C74]/40 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#123C74] bg-[#F7FBFD] px-2.5 py-1 rounded border border-blue-100">
                      {job.department}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {job.employment}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-gray-900 tracking-tight group-hover:text-[#123C74] transition-colors">
                    {job.title}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2FA8B8] flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#2FA8B8] flex-shrink-0" />
                      <span>{job.experience}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectJob(job.title)}
                  className={`w-full py-2.5 px-4 rounded font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? "bg-[#2FA8B8] text-white shadow-sm"
                      : "bg-[#F7FBFD] hover:bg-[#123C74] text-[#123C74] hover:text-white border border-blue-100"
                  }`}
                >
                  <span>{isSelected ? "Selected for Application" : "Apply For Position"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Apply Now Form Section */}
        <div ref={formRef} className="max-w-3xl mx-auto">
          <div className="bg-white border border-[#123C74]/15 rounded-[24px] shadow-[0_10px_35px_rgba(18,60,116,0.04)] p-6 sm:p-10 md:p-12">
            
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-5">
              <div className="w-10 h-10 rounded-xl bg-[#123C74] text-white flex items-center justify-center shadow-md">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                  Apply Now
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Submit your details and resume. Our HR team will contact shortlisted candidates.
                </p>
              </div>
            </div>

            {/* Success Message Banner */}
            {successAppId && (
              <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-3 text-emerald-900">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-base text-emerald-900">
                      Application Submitted Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed mt-1">
                      Thank you for applying to Unistar Chemicals. Your application reference ID is{" "}
                      <strong className="font-black text-emerald-900">{successAppId}</strong>.
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed mt-1">
                      A confirmation copy has been dispatched to our recruitment desk (<span className="underline font-semibold">info@unistarchemicals.in</span>).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSuccessAppId("")}
                  className="self-end text-xs font-black uppercase text-emerald-800 hover:text-emerald-950 underline mt-2"
                >
                  Submit Another Application
                </button>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#123C74] focus:ring-2 focus:ring-[#123C74]/20 outline-none text-sm text-gray-900 transition-all font-medium"
                    required
                  />
                </div>

                {/* Current Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Current Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="e.g. Kolkata, West Bengal"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#123C74] focus:ring-2 focus:ring-[#123C74]/20 outline-none text-sm text-gray-900 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#123C74] focus:ring-2 focus:ring-[#123C74]/20 outline-none text-sm text-gray-900 transition-all font-medium"
                    required
                  />
                </div>

                {/* Email ID */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. applicant@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#123C74] focus:ring-2 focus:ring-[#123C74]/20 outline-none text-sm text-gray-900 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Position Applying For */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Position Applying For <span className="text-red-500">*</span>
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#123C74] focus:ring-2 focus:ring-[#123C74]/20 outline-none text-sm text-gray-900 transition-all font-medium bg-white"
                  required
                >
                  <option value="">-- Select Position --</option>
                  {JOB_OPENINGS.map((job) => (
                    <option key={job.id} value={job.title}>
                      {job.title} ({job.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resume Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Resume Upload <span className="text-red-500">*</span>
                </label>

                <div className="border-2 border-dashed border-gray-300 hover:border-[#123C74] rounded-xl p-6 transition-colors text-center bg-gray-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={!resumeFile}
                  />

                  {resumeFile ? (
                    <div className="flex items-center gap-3 text-sm text-emerald-800 font-extrabold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span>{resumeFile.name} ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#123C74] flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-gray-700 font-bold">
                        Click or drag and drop to upload your resume
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium">
                        Accepted formats: <strong className="text-gray-700">PDF, DOC, DOCX</strong> &bull; Max size: <strong className="text-gray-700">5 MB</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Apply Now Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 bg-[#123C74] hover:bg-[#1E5A93] active:bg-[#0D2951] text-white rounded-lg font-black text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Apply Now</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
