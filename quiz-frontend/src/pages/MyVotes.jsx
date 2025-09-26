import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import QuizCard from "../components/QuizCard";
import { AuthContext } from "../context/AuthContext";

export default function MyVotes() {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Voted Quizzes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(votes).length === 0 ? (
        <p className="text-gray-500">You haven't voted on any quizzes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(votes).map(([quizId, vote]) => (
            <QuizCard
              key={quizId}
              quiz={{
                _id: quizId,
                question: vote.question,
                options: vote.options,
                correctAnswer: vote.correctAnswer
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
