import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const { registerUser } = useContext(AuthContext);
  const { addToast } = useToast();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await registerUser({ name, email, password });
      addToast("Registration successful!", "success");
      nav(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg space-y-4 transition-all"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Register
        </h2>

        {/* Name */}
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:shadow-sm transition"
          />
        </div>

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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:shadow-sm transition"
          />
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 pr-10 hover:shadow-sm transition"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Password must be at least 6 characters.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white font-semibold rounded-lg shadow-md transition-transform transform ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:scale-105"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Already have account */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => nav("/login")}
            className="text-green-600 hover:text-green-700 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
