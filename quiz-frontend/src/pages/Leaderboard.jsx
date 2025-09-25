import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Leaderboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/votes/leaderboard");
      setStats(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>

      {loading ? (
        <div className="text-center py-8">Loading leaderboard...</div>
      ) : stats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No votes yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2 text-left">Rank</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Total Quizzes</th>
                <th className="border px-4 py-2 text-left">Correct Answers</th>
                <th className="border px-4 py-2 text-left">Accuracy (%)</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((user, index) => (
                <tr
                  key={user.email}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2 font-medium">{user.name}</td>
                  <td className="border px-4 py-2 text-sm text-gray-600">{user.email}</td>
                  <td className="border px-4 py-2">{user.total}</td>
                  <td className="border px-4 py-2">{user.correct}</td>
                  <td className="border px-4 py-2">{(user.accuracy || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
