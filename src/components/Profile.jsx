import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      // Fetch user data and posts
      const fetchData = async () => {
        try {
          const userResponse = await axios.get("http://localhost:5000/auth/getuserprofile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const postsResponse = await axios.get("http://localhost:5000/posts/getpostbyuser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(userResponse.data);
          // Safely handle posts, ensuring it's always an array
          setPosts(postsResponse.data?.posts || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    }
  }, [token]);

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex justify-center bg-black md:bg-white">
      <div className="min-h-screen sm:w-4/12 bg-black flex justify-center items-start px-4 sm:px-6 py-8">
        <div className="w-full max-w-4xl shadow-lg rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative">
              <FaUserCircle className="text-6xl text-white" />
            </div>
            <p className="font-bold text-2xl text-white">{getUsername(userData.email)}</p>
            <div className="flex space-x-6 mt-2">
              <div className="text-center">
                <p className="text-xl font-semibold text-white">{posts.length}</p>
                <span className="text-sm text-gray-500">Posts</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6 text-center">
            <p className="text-gray-700">{userData.bio}</p>
          </div>

          {/* User's Posts Grid or "No posts yet" Message */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href="#"
                  className="block bg-center bg-no-repeat bg-cover h-24 w-24 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-lg"
                  style={{
                    backgroundImage: `url(http://localhost:5000/${post.imagePath.replace(/\\/g, "/")})`,
                  }}
                ></a>
              ))}
            </div>
          ) : (
            <div className="text-center text-white text-xl">No posts yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
