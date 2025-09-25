// src/pages/UserDashboard.jsx
import { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import QuizCard from "../components/QuizCard";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/quizzes");
      const data = Array.isArray(res.data) ? res.data : res.data.quizzes || [];
      setQuizzes(data);

      // Fetch user votes
      const voteRes = await api.get("/api/votes/me/stats");
      const votes = {};
      data.forEach(q => {
        const userVote = voteRes.data?.votes?.find(v => v.quiz === q._id);
        if (userVote) votes[q._id] = userVote;
      });
      setUserVotes(votes);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleVote = async (quizId, chosenOption) => {
    try {
      const res = await api.post("/api/votes", { quizId, chosenOption });
      alert(res.data.message);

      setUserVotes(prev => ({
        ...prev,
        [quizId]: { chosenOption, isCorrect: res.data.isCorrect }
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Welcome, {user?.name}</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl shadow p-4 h-48" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-gray-500 text-lg">No quizzes available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(q => (
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
