import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import QuizCard from "../components/QuizCard";
import { AuthContext } from "../context/AuthContext";

export default function MyVotes() {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const { user } = useContext(AuthContext);

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/votes/me/votes");
      setVotes(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const voteList = Object.entries(votes)
    .map(([quizId, vote]) => ({ ...vote, _id: quizId }))
    .filter((v) => v.question.toLowerCase().includes(search.toLowerCase()));

  const totalQuizzes = Object.keys(votes).length;
  const correctAnswers = Object.values(votes).filter((v) => v.isCorrect).length;
  const accuracy = totalQuizzes ? ((correctAnswers / totalQuizzes) * 100).toFixed(2) : 0;

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        My Voted Quizzes
      </h1>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm text-sm">
            Total Quizzes: {totalQuizzes}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full shadow-sm text-sm">
            Correct Answers: {correctAnswers}
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full shadow-sm text-sm">
            Accuracy: {accuracy}%
          </span>
        </div>

        {/* Search and toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm w-full sm:w-auto"
          />
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition"
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      {/* Quizzes */}
      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading...</p>
      ) : voteList.length === 0 ? (
        <p className="text-center py-8 text-gray-400">
          No quizzes found.
        </p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {voteList.map((vote) => (
            <QuizCard
              key={vote._id}
              quiz={{
                _id: vote._id,
                question: vote.question,
                options: vote.options,
                correctAnswer: vote.correctAnswer,
                totalVotes: vote.totalVotes ?? 0,
              }}
              isAdmin={false}
              userVote={vote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
