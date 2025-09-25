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
        // Ensure optionCounts is aligned with options
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Create New Quiz
        </button>
      </div>

      {showForm && (
        <AdminQuizForm
          quiz={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchQuizzes(); }}
        />
      )}

      {loading ? (
        <div>Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div>No quizzes available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
