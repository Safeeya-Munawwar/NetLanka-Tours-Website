// src/components/CommentsGrid.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const CommentsGrid = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE}/api/comments`);
        const lastComments = res.data.slice(-4).reverse();
        setComments(lastComments);
      } catch (err) {
        console.error(err);
        setError("Failed to load comments");
      }
      setLoading(false);
    };
    fetchComments();
  }, []);

  if (loading) return <p className="text-center text-green-900">Loading comments...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="px-5 md:px-12 py-10 max-w-[1400px] mx-auto bg-green-950">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          What Our Customers Say
        </h2>
        <p className="text-white max-w-2xl mx-auto">
          Hear what our travelers are saying about their experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {comments.map((comment, idx) => {
          const createdAt = comment.createdAt || comment.date || comment.time || null;
          const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : "";
          const formattedTime = createdAt ? new Date(createdAt).toLocaleTimeString() : "";

          return (
            <div
              key={idx}
              className="bg-lime-300 p-4 rounded-2xl shadow-lg border-2 border-black flex flex-col justify-between h-[200px] transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
            >
              <div className="mb-2">
                <h3 className="text-green-950 font-bold text-lg">{comment.name}</h3>
                <p className="text-green-950 text-xs mt-1">
                  {formattedDate} {formattedTime}
                </p>
              </div>
              <p className="text-black text-sm overflow-hidden leading-5">
                {comment.message || comment.comment}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CommentsGrid;
