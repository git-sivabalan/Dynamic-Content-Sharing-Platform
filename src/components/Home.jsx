import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlusCircle } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        axios
          .post("http://localhost:5000/posts/getpostforuser", { token })
          .then((response) => {
            setPosts(response.data.posts);
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
      } else {
        console.error("No auth token found");
      }
    };

    fetchPosts();
    const intervalId = setInterval(fetchPosts, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  const handleReadMore = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handlePostClick = (e, postId) => {
    e.preventDefault(); // Prevent any default behavior
  };

  return (
    <div className="bg-black text-white min-h-screen flex justify-center">
      {/* Main Container */}
      <div className="md:w-4/12 flex flex-col bg-[#1b1b1b]">
        {/* Posts */}
        <div className="flex flex-col p-1 mb-16 space-y-3">
          {posts.length === 0 ? (
            <div className="text-center text-white text-xl">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-black text-white rounded shadow-md p-4 cursor-pointer"
                onClick={(e) => handlePostClick(e, post.id)} // Call handlePostClick with e
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <FaUserCircle className="text-xl" />
                  <span className="text-sm font-medium">
                    {post.user ? getUsername(post.user.email) : "Anonymous"}
                  </span>
                </div>
                <hr className="mb-5" />

                {/* Image */}
                {post.imagePath && (
                  <img
                    src={`http://localhost:5000/${post.imagePath.replace(/\\/g, "/")}`}
                    alt="Post"
                    className="h-11/12 object-cover"
                  />
                )}

                {/* Content */}
                <div className="flex flex-col pt-1">
                  <p className="text-sm" style={{ maxHeight: "4rem", overflow: "hidden" }}>
                    {expandedPostId === post.id ? post.content : `${post.content.slice(0, 50)}...`}
                  </p>
                  {post.content.length > 50 && (
                    <span
                      className="text-blue-500 text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        handleReadMore(post.id);
                      }}
                    >
                      {expandedPostId === post.id ? "Show Less" : "Read More"}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
