import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostContent = () => {
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    content: "",
    categoryId: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/interest-categories/interestcategories"
        );
        setCategories(response.data.results.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("content", formData.content);
      data.append("categoryId", formData.categoryId);
      if (formData.image) data.append("image", formData.image);

      const response = await axios.post("http://localhost:5000/posts/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "Post created successfully!");
      setFormData({ content: "", categoryId: "", image: null });
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center  sm:px-6 sm:py-2 lg:px-8">
      <div className="w-screen md:w-4/12 bg-white p-8 sm:rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Create a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6 h-auto mb-20">
          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-lg font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="4"
              placeholder="Write your content here..."
              required
              className="block w-full px-4 py-3 mt-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-lg font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="block w-full px-4 py-3 mt-2 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Drag-and-Drop Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Image</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("image").click()}
              className={`mt-2 p-6 border-2 border-dashed rounded-lg ${isDragging ? "border-black bg-gray-200" : "border-gray-300"}`}
            >
              <p className="text-center text-gray-600">
                {isDragging ? "Drop your image here" : "Drag and drop an image, or click to select"}
              </p>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="hidden"
                required
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 text-lg font-semibold text-white bg-black rounded-lg shadow-md hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostContent;
