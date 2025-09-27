import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext"; 
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const { addToast } = useToast();
  const nav = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem("rememberEmail") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(!!localStorage.getItem("rememberEmail"));
  const [loading, setLoading] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Shake animation states
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);

  // Real-time email validation
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(email) ? "" : "Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [email]);

  // Real-time password validation
  useEffect(() => {
    if (password && password.length <= 4) {
      setPasswordError("Password must be greater than 4 characters");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const submit = async (e) => {
    e.preventDefault();

    // Trigger shake animation if invalid
    if (emailError) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
    }
    if (passwordError) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 500);
    }

    // Stop submission if invalid
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      if (remember) localStorage.setItem("rememberEmail", email);
      else localStorage.removeItem("rememberEmail");

      addToast("Login successful!", "success");
      nav(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 px-4 sm:px-6 md:px-8">
      <form
        onSubmit={submit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg transition-all space-y-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>

        {/* Email */}
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 hover:shadow-sm transition ${
              emailError
                ? "border-red-500 focus:ring-red-400 focus:border-red-400"
                : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
            } ${shakeEmail ? "animate-shake" : ""}`}
          />
          {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 pr-10 hover:shadow-sm transition ${
              passwordError
                ? "border-red-500 focus:ring-red-400 focus:border-red-400"
                : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
            } ${shakePassword ? "animate-shake" : ""}`}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
        </div>

        {/* Remember & Forgot */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            Remember me
          </label>
          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !!emailError || !!passwordError}
          className={`w-full p-3 text-white font-semibold rounded-lg shadow-md transition-transform transform ${
            loading || emailError || passwordError
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
