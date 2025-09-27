import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VoteDetails() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [expandedOptions, setExpandedOptions] = useState({}); // Track which options are expanded

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/quizzes/admin/quizzes/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <div className="p-8 text-center text-gray-600">Loading quiz details...</div>;

  const totalVotes = quiz.optionCounts?.reduce((sum, opt) => sum + (opt.voters?.length || 0), 0);

  const toggleOption = (i) => {
    setExpandedOptions((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      <button
        className="mb-6 text-blue-600 font-medium hover:underline"
        onClick={() => navigate("/admin")}
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 break-words">
        {quiz.question}
      </h2>

      <div className="mb-4 text-gray-700 font-medium">
        Total Votes: <span className="text-blue-600">{totalVotes}</span>
      </div>

      <div className="space-y-4">
        {quiz.options.map((optionText, i) => {
          const voters = quiz.optionCounts?.[i]?.voters || [];
          const isCorrectOption = i === quiz.correctAnswer;
          const correctVotes = voters.filter(v => v.isCorrect).length;
          const isExpanded = expandedOptions[i];

          return (
            <div
              key={i}
              className={`p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <span className={`font-semibold ${isCorrectOption ? "text-green-600" : "text-gray-800"}`}>
                  Option {i + 1}: {optionText}
                  {isCorrectOption && correctVotes > 0 && (
                    <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {correctVotes} correct
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-blue-500 font-medium">
                    Votes: {voters.length}
                  </span>
                  {voters.length > 0 && (
                    <button
                      onClick={() => toggleOption(i)}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      {isExpanded ? "Hide voters" : "Show voters"}
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && voters.length > 0 && (
                <ul className="pl-4 list-disc max-h-48 overflow-auto">
                  {voters.map((voter, idx) => (
                    <li
                      key={idx}
                      className={`text-sm ${voter.isCorrect ? "text-green-600" : "text-red-600"}`}
                    >
                      {voter.name} {voter.isCorrect ? "(Correct)" : "(Wrong)"}
                    </li>
                  ))}
                </ul>
              )}

              {voters.length === 0 && <div className="text-sm text-gray-500">No votes yet</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
