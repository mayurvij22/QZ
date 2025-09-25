// src/components/QuizCard.jsx
import { useState } from "react";

export default function QuizCard({ quiz, isAdmin, userVote, onVote, onEdit, onDelete }) {
  const [showVoters, setShowVoters] = useState(null);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 w-full max-w-xl mx-auto my-3">
      <h2 className="font-bold text-lg mb-4 text-gray-800">{quiz.question}</h2>

      <ul className="space-y-2">
        {quiz.options.map((opt, i) => {
          const voted = userVote?.chosenOption === i;
          const correct = userVote?.isCorrect && voted;
          const wrong = userVote && !userVote.isCorrect && voted;

          const voteCount = quiz.optionCounts?.[i]?.count || 0;
          const voters = quiz.optionCounts?.[i]?.voters || [];

          const highlightCorrect = userVote && i === quiz.correctAnswer ? "bg-green-100 font-semibold" : "";

          const optionClasses = `
            p-3 rounded-lg flex justify-between items-center border cursor-pointer transition
            ${correct ? "bg-green-200 border-green-400" : ""}
            ${wrong ? "bg-red-200 border-red-400" : ""}
            ${highlightCorrect}
            hover:shadow-md
          `;

          const handleOptionClick = () => {
            if (!isAdmin && !userVote) onVote(i);
            if (isAdmin) setShowVoters(showVoters === i ? null : i);
          };

          return (
            <li key={i} className="relative">
              <div className={optionClasses} onClick={handleOptionClick}>
                <span>{opt}</span>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <span className="text-blue-500 text-sm">
                      Votes: {voteCount}
                    </span>
                  )}

                  {!isAdmin && userVote && i === quiz.correctAnswer && (
                    <span className="ml-2 text-green-600 font-semibold text-sm">
                      (Correct Answer)
                    </span>
                  )}
                </div>
              </div>

              {/* Show voter names for admin */}
              {isAdmin && showVoters === i && (
                <ul className="absolute left-0 top-full bg-white shadow-lg rounded p-2 mt-1 text-sm text-gray-700 z-10 w-full">
                  {voters.length > 0 ? (
                    voters.map((name, idx) => <li key={idx}>{name}</li>)
                  ) : (
                    <li>No votes yet</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Admin controls */}
      {isAdmin && (
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={onEdit}
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
