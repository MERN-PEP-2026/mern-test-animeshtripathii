import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api.js";

function SignupPage() {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const processRegistration = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const response = await registerUser(registrationData);
      const { token, name, email } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email }));
      navigate("/dashboard");
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setErrorMessage(serverMessage || "Account creation failed - please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Inter',sans-serif] min-h-screen flex flex-col">
      <div className="flex flex-1 w-full h-screen overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white z-10 overflow-y-auto">
          <div className="mx-auto w-full max-w-sm lg:w-96 py-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="size-8 text-[#228B22]">
                <span className="material-symbols-outlined text-[32px] font-bold">task_alt</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-black">TaskMaster</h2>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-black">Join TaskMaster</h1>
              <p className="mt-2 text-sm text-gray-700 font-medium">
                Start organizing your life and work efficiently today.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={processRegistration} className="space-y-5">
              <div>
                <label className="block text-sm font-bold leading-6 text-black" htmlFor="name">Full Name</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={registrationData.name}
                    onChange={onFieldChange}
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#228B22] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold leading-6 text-black" htmlFor="email">Email address</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={registrationData.email}
                    onChange={onFieldChange}
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#228B22] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold leading-6 text-black" htmlFor="password">Password</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={registrationData.password}
                    onChange={onFieldChange}
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#228B22] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-lg bg-[#228B22] px-3 py-3 text-sm font-black leading-6 text-white shadow-md hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#228B22] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-gray-700">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-[#228B22] hover:underline">Sign in</Link>
              </p>
            </div>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm font-bold leading-6">
                <span className="bg-white px-6 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <a href="#" className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[20px]">g_mobiledata</span>
                <span className="text-sm font-bold leading-6">Google</span>
              </a>
              <a href="#" className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[20px]">code</span>
                <span className="text-sm font-bold leading-6">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex relative flex-1 bg-[#E0F2F1]">
          <img
            alt="Clean modern office desk workspace with laptop"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6RQVPiHIVRDUqN3VVpwYCYev0MvnvrAE0EGC7tEJzJS1b_jlHU6sHsuwxJPewz0gbHdIbx2YUl1PPU84Gyrmcl29ClVCp8Dc7k_OZ_5oY9tdR79Xz4Pzd9YjpGDQ_9iJlkCyAUZTHivP1jbVOflC-V89BdPjFI53CMX5Z0D351sDHgohfgbmSjUMCNJuXHKN4B2p_h6cvNai1EiHC80MpRXnWKntscBPjaw2CtY_8y0dvKQr2XHQvmpXro0AY1KcNqDGSJfgs9sJv"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2F1]/20 via-transparent to-[#228B22]/10"></div>
          <div className="relative z-10 flex flex-col justify-end p-16 h-full text-black w-full max-w-2xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-[#228B22]/20 bg-white/60 px-4 py-1.5 text-sm font-bold text-[#228B22] backdrop-blur-md shadow-sm w-fit">
              <span className="mr-2">New Feature</span>
              <span className="h-4 w-px bg-[#228B22]/20"></span>
              <span className="ml-2">Collaborative Boards</span>
            </div>
            <h3 className="text-4xl font-black tracking-tight mb-6 leading-tight text-black">
              "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
            </h3>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-3">
                <img alt="User avatar" className="inline-block h-12 w-12 rounded-full ring-4 ring-[#E0F2F1] object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFabi-y99RG1dGBsnHT_eYMN2LuuF5JS4Cq-sP7TE2sWW8FdVs6mwK93Z33f_B0VFMJLn82lTPpWTMxRIjmoPIGQpcaoyZgIugCKU2ORbZYHGBwvmmwkMOP9cN9Uyf4iMY2Xgvsnrh9VBJmyGElYHHnRciM_0FkXeU76oy8Enu3QzY8CFLsMRM9Kiop31fOwq3UP70cg82EH6EjTjLV7F9WrY9y1OcUU34MRu3u7GOWdq4vKQXUXzCHrpys3TVew-o-JBDAE4DKrhv" />
                <img alt="User avatar" className="inline-block h-12 w-12 rounded-full ring-4 ring-[#E0F2F1] object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT5Gri24mztHl37Rz8dZ6dQCc3xgQzFwkbdOHrJWuWjLzUk4frHF9Qn3XsrLO2EAZ4ZQ8cNF3NiFs_L1NjpTmLfIVkdxhLjdRUnQEssG664eFsWPm-uddeLRz4vQLtsPmAGdwqzi-3Od6lNe25XkVoOpCghygQYo1I8EQQzJy1eyakFRANXHqJC6DwNIZwacQP0k6SBmGgxmsK5gZNQ0SRAru90MyZhJ4kul46WW2ASorv1BRs0Ex7GZKYuVTKNZ9VCkrMqjtyFTSt" />
                <img alt="User avatar" className="inline-block h-12 w-12 rounded-full ring-4 ring-[#E0F2F1] object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmKobVbPeLLiB5lvZD7K5U2os-lgh3XQCGe0joQEaqQCBRFzEOIVa24X_OlX37LJWy4Edq9j-jtLnPtUc31Cov9Rkf9G1-0FC0XVRyiXYQWpfKKc8jw9Wb0VCCr613ZsahCDB6L0D6aAeal1tm8pJnmENePDlt1abvkL5znVXSXVfd1mNUPA5lUqlGiIdA66fTVlWVNz5KF39JQhoEPjWs9fA-Qv1Z4xsTfv464YQ8GLJ_NOfeWmS0ZSTeRUcm2CvG60sqbsp-zyCe" />
              </div>
              <div className="text-sm font-bold text-gray-800">
                Join 10,000+ users organizing their tasks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
