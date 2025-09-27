import { useNavigate } from "react-router-dom";

export default function QuizCard({ quiz, isAdmin, userVote, onVote, onEdit, onDelete }) {
  const navigate = useNavigate();

  if (!quiz || !quiz.options || quiz.options.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md w-full mx-auto my-3 text-red-500 font-semibold text-center">
        Invalid quiz data
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-xl mx-auto my-4 border border-gray-200">
      <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 text-gray-800 break-words">
        {quiz.question}
      </h2>

      <ul className="space-y-3">
        {quiz.options.map((opt, i) => {
          const isCorrectAnswer = i === quiz.correctAnswer;
          const userChoseThis = userVote?.chosenOption === i;

          let optionClasses =
            "p-3 sm:p-4 rounded-xl border flex flex-col cursor-pointer transition-all";

          if (userVote) {
            if (userChoseThis && userVote.isCorrect) {
              optionClasses += " bg-green-200 border-green-400";
            } else if (userChoseThis && !userVote.isCorrect) {
              optionClasses += " bg-red-200 border-red-400";
            } else {
              optionClasses += " bg-gray-50 border-gray-200";
            }
          } else {
            optionClasses += " hover:scale-[1.02] hover:shadow-lg";
          }

          if (isAdmin && isCorrectAnswer) {
            optionClasses += " bg-green-100 border-green-400 font-semibold";
          }

          const handleOptionClick = () => {
            if (isAdmin) {
              navigate(`/admin/quiz/${quiz._id}/option/${i}`);
            } else if (!userVote && onVote) {
              onVote(i);
            }
          };

          return (
            <li key={i}>
              <div className={optionClasses} onClick={handleOptionClick}>
                <span className="text-gray-800 font-medium">{opt}</span>
                {!isAdmin && userVote && isCorrectAnswer && (
                  <span className="mt-1 text-green-600 font-semibold text-sm">
                    (Correct Answer)
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* User feedback */}
      {!isAdmin && userVote && (
        <p
          className={`mt-4 font-semibold text-center ${
            userVote.isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {userVote.isCorrect ? "✅ Correct!" : "❌ Wrong Answer"}
        </p>
      )}

      {/* Admin actions */}
      {isAdmin && (
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-4 sm:mt-5">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 w-full sm:w-auto transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 w-full sm:w-auto transition"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
