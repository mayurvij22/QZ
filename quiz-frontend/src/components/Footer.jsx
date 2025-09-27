// src/components/Footer.jsx
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-10 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} QuizApp. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 text-sm transition duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 text-sm transition duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 text-sm transition duration-200"
          >
            Contact
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-gray-600 hover:text-blue-400 transition duration-200"
          >
            <FaTwitter />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-600 hover:text-blue-600 transition duration-200"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
