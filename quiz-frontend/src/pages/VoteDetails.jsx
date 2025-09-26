import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VoteDetails() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

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

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <button className="mb-4 text-blue-600" onClick={() => navigate("/admin")}>
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-6">{quiz.question}</h2>

      <div className="space-y-4">
        {quiz.options.map((optionText, i) => {
          const voters = quiz.optionCounts?.[i]?.voters || [];
          const isCorrectOption = i === quiz.correctAnswer;

          return (
            <div key={i} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold ${isCorrectOption ? "text-green-600" : ""}`}>
                  Option {i + 1}: {optionText}
                </span>
                <span className="text-blue-500 font-medium">Votes: {voters.length}</span>
              </div>

              {voters.length === 0 ? (
                <div className="text-sm text-gray-600">No votes yet</div>
              ) : (
                <ul className="pl-4 list-disc">
                  {voters.map((voter, idx) => (
                    <li
                      key={idx}
                      className={voter.isCorrect ? "text-green-600" : "text-red-600"}
                    >
                      {voter.name} {voter.isCorrect ? "(Correct)" : "(Wrong)"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
