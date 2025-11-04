import React from "react";
import { FaPenFancy } from "react-icons/fa";

const BlogCard = ({ blog, showViewMore = false, latestBlogs = [] }) => {
  // ✅ Render Single Blog Card
  if (blog) {
    return (
      <div className="bg-gradient-to-br from-white to-green-50 p-3 sm:p-4 rounded-2xl shadow-lg border-2 border-black flex flex-col justify-between transition-transform duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:scale-105 hover:shadow-2xl
                      h-[320px] sm:h-[360px]">
        {blog.imageUrl && (
          <img
            src={blog.imageUrl.startsWith("http") ? blog.imageUrl : `http://localhost:5000${blog.imageUrl}`}
            alt={blog.title}
            className="w-full h-[140px] sm:h-[180px] rounded-xl object-cover border-2 border-black transition-all"
          />
        )}
        <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-2">
          {blog.title}
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm mt-1 h-[80px] sm:h-[100px] overflow-hidden leading-5">
          {blog.snippet || blog.summary || "Dive into this exciting story! ✨"}
        </p>
        <button
          onClick={() => (window.location.href = `/Blog/${blog._id}`)}
          className="mt-2 bg-green-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-green-700 transition-all"
        >
          📖 Read More
        </button>
      </div>
    );
  }

  // ✅ Render "View More Blogs" Button
  if (showViewMore) {
    return (
      <div className="flex justify-center mt-6 w-full">
        <button
          onClick={() => (window.location.href = "/blog")}
          className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaPenFancy /> View More Blogs
        </button>
      </div>
    );
  }

  // ✅ Render Blogs Section with Background + Grid
  if (latestBlogs.length > 0) {
    return (
      <section className="relative overflow-hidden py-12 sm:py-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/yala7.jpg')" }}
        ></div>

        {/* White Blur Overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-900">
              Latest Blogs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {latestBlogs.map((blog, idx) => (
              <BlogCard key={idx} blog={blog} />
            ))}
          </div>

          <BlogCard showViewMore />
        </div>
      </section>
    );
  }

  return null;
};

export default BlogCard;
