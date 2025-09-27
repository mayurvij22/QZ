import { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { FiAward, FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function Leaderboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "total", direction: "desc" });

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

  const getRankBorder = (index) => {
    switch (index) {
      case 0:
        return "border-yellow-400 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 shadow-lg";
      case 1:
        return "border-gray-400 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 shadow-md";
      case 2:
        return "border-orange-400 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 shadow-md";
      default:
        return "border-gray-200 bg-white shadow";
    }
  };

  // Filter based on search
  const filteredStats = useMemo(() => {
    return stats.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, stats]);

  // Sort filtered stats
  const sortedStats = useMemo(() => {
    const sorted = [...filteredStats];
    const { key, direction } = sortConfig;

    sorted.sort((a, b) => {
      const valA = a[key] || 0;
      const valB = b[key] || 0;
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />;
  };

  // Helper to render award icon dynamically
  const renderAward = (index) => {
    switch (index) {
      case 0:
        return <FiAward className="text-yellow-400" />;
      case 1:
        return <FiAward className="text-gray-400" />;
      case 2:
        return <FiAward className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-800">
        Leaderboard
      </h1>

      {/* Total Members & Search */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-gray-700 font-medium">
          Total Members: {stats.length}
        </div>
        <input
          type="text"
          placeholder="Search by name or email"
          className="border border-gray-300 rounded-lg p-2 sm:w-64 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading leaderboard...</div>
      ) : sortedStats.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No matching users found.
        </div>
      ) : (
        <div className="w-full">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                    Email
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 cursor-pointer"
                    onClick={() => requestSort("total")}
                  >
                    Total Quizzes {getSortIcon("total")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 cursor-pointer"
                    onClick={() => requestSort("correct")}
                  >
                    Correct Answers {getSortIcon("correct")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 cursor-pointer"
                    onClick={() => requestSort("accuracy")}
                  >
                    Accuracy (%) {getSortIcon("accuracy")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedStats.map((user, index) => {
                  let rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";
                  return (
                    <tr
                      key={user.email}
                      className={`hover:bg-gray-100 transition-colors duration-200 ${rowBg}`}
                    >
                      <td className="px-4 py-3 text-sm sm:text-base font-medium flex items-center gap-1">
                        {index + 1}
                        {renderAward(index)}
                      </td>
                      <td className="px-4 py-3 text-sm sm:text-base font-semibold text-gray-800">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 truncate max-w-[120px] sm:max-w-xs">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm sm:text-base">{user.total}</td>
                      <td className="px-4 py-3 text-sm sm:text-base">{user.correct}</td>
                      <td className="px-4 py-3 text-sm sm:text-base">
                        {(user.accuracy || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {sortedStats.map((user, index) => (
              <div
                key={user.email}
                className={`rounded-xl p-4 flex flex-col gap-2 ${getRankBorder(
                  index
                )}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{index + 1}</span>
                  {renderAward(index)}
                </div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-gray-600 text-sm truncate">{user.email}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <span>Total: {user.total}</span>
                  <span>Correct: {user.correct}</span>
                  <span>Accuracy: {(user.accuracy || 0).toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
