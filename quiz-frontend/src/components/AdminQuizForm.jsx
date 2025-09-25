// src/components/AdminQuizForm.jsx
import { useState, useEffect } from "react";
import api from "../utils/api";

export default function AdminQuizForm({ quiz, onClose, onSuccess }) {
  const [question, setQuestion] = useState(quiz?.question || "");
  const [options, setOptions] = useState(
    quiz?.options?.map(o => (typeof o === "string" ? o : o.option)) || ["", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(quiz?.correctAnswer ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (quiz) {
      setQuestion(quiz.question || "");
      setOptions(quiz.options?.map(o => (typeof o === "string" ? o : o.option)) || ["", ""]);
      setCorrectAnswer(quiz.correctAnswer ?? 0);
    }
  }, [quiz]);

  const addOption = () => setOptions(prev => [...prev, ""]);
  const changeOption = (i, v) => setOptions(prev => prev.map((p, idx) => (idx === i ? v : p)));
  const removeOption = (i) => setOptions(prev => prev.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (options.length < 2) return setError("At least 2 options required");
    setError("");
    setSaving(true);
    try {
      const payload = { question, options, correctAnswer: Number(correctAnswer) };
      if (quiz) await api.put(`/api/quizzes/${quiz._id}`, payload);
      else await api.post("/api/quizzes", payload);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in overflow-auto max-h-[90vh]"
      >
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {quiz ? "Edit Quiz" : "Create New Quiz"}
        </h3>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>
        )}

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Quiz Question"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        />

        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <span className="font-medium">{i + 1}.</span>
            <input
              value={opt}
              onChange={(e) => changeOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                X
              </button>
            )}
          </div>
        ))}

        <div className="mb-4">
          <button
            type="button"
            onClick={addOption}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Option
          </button>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          >
            {options.map((_, idx) => (
              <option key={idx} value={idx}>
                {`Option ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-white transition w-full sm:w-auto ${
              saving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
