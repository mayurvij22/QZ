import { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import QuizCard from "../components/QuizCard";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Fetch all quizzes + user votes
  const fetchData = async () => {
    setLoading(true);
    try {
      const resQuizzes = await api.get("/api/quizzes");
      const data = Array.isArray(resQuizzes.data) ? resQuizzes.data : resQuizzes.data.quizzes || [];
      setQuizzes(data);

      const resVotes = await api.get("/api/votes/me/votes");
      setUserVotes(resVotes.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVote = async (quizId, chosenOption) => {
    try {
      const res = await api.post("/api/votes", { quizId, chosenOption });

      // Save vote in state
      setUserVotes((prev) => ({
        ...prev,
        [quizId]: {
          chosenOption,
          isCorrect: res.data.vote.isCorrect,
          question: res.data.vote.question,
          options: res.data.vote.options,
          correctAnswer: res.data.vote.correctAnswer
        }
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  // Only show quizzes not voted yet
  const availableQuizzes = quizzes.filter((q) => !userVotes[q._id]);

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-700">
        Welcome, {user?.name}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-xl shadow p-4 h-48 sm:h-56"
            />
          ))}
        </div>
      ) : availableQuizzes.length === 0 ? (
        <div className="text-gray-500 text-lg text-center mt-12">
          No quizzes available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map((q) => (
            <QuizCard
              key={q._id}
              quiz={q}
              isAdmin={false}
              userVote={userVotes[q._id]}
              onVote={(option) => handleVote(q._id, option)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
