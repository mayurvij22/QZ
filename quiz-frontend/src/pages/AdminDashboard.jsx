// src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import QuizCard from "../components/QuizCard";
import AdminQuizForm from "../components/AdminQuizForm";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch quizzes (admin endpoint)
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/quizzes");
      if (res?.data) {
        const quizzesWithCounts = res.data.map((q) => {
          const counts = q.optionCounts || q.options.map(() => ({ count: 0 }));
          return { ...q, optionCounts: counts };
        });
        setQuizzes(quizzesWithCounts);
      }
    } catch (err) {
      console.error(err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await api.delete(`/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-700">
        Admin Dashboard
      </h1>

      {/* Create Quiz Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
        >
          + Create New Quiz
        </button>
      </div>

      {/* Quiz Form */}
      {showForm && (
        <AdminQuizForm
          quiz={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchQuizzes(); }}
        />
      )}

      {/* Quizzes List */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">
          Loading quizzes...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No quizzes available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {quizzes.map((q) => (
            <QuizCard
              key={q._id}
              quiz={q}
              isAdmin
              onEdit={() => { setEditing(q); setShowForm(true); }}
              onDelete={() => handleDelete(q._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
