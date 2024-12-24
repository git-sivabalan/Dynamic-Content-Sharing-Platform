import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/interest-categories/interestcategories`);
        if (response.data && response.data.results && response.data.results.data) {
          setCategories(response.data.results.data);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || selectedCategories.length === 0) {
      toast.error("Select at least one category.");
      return;
    }

    setLoading(true); // Set loading to true when request starts

    try {
      // Construct the payload to send to the backend
      const selectedCategoryObjects = selectedCategories.map((categoryName) => {
        return categories.find((category) => category.name === categoryName);
      }).filter(Boolean);

      const payload = {
        email,
        interests: selectedCategoryObjects,
      };

      // Send the data to the backend
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/signup`, payload);

      if (response.data && response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Sign up successful!");
      }
      navigate('/login');
      
    } catch (error) {

      // Display the actual error message from the response if available
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during sign up.");
      }
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };
  console.log(import.meta.env.VITE_APP_BACKEND_URL)

  return (
    <section>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md bg-white rounded-lg">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">Sign Up</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Choose your areas of interest</p>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">Email address</label>
                <div className="mt-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">Choose Categories (1-3)</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedCategories.includes(category.name)
                          ? "bg-black text-white border-black"
                          : "bg-gray-200 text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {selectedCategories.length === 3 && (
                  <p className="mt-2 text-sm text-gray-500">You can select up to 3 categories.</p>
                )}
              </div>
              <div>
                <button
                  className={`inline-flex w-full items-center justify-center rounded-md px-3.5 py-2.5 font-semibold leading-7 text-white ${
                    loading ? "bg-gray-600 cursor-not-allowed" : "bg-black hover:bg-black/80"
                  }`}
                  type="submit"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <span className="animate-spin border-t-transparent border-gray-200 border-2 rounded-full w-4 h-4"></span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
                <span className="text-sm flex mt-3 justify-center">Already have account ? <a href="/login" className="ml-1 font-bold underline underline-offset-2">Login</a></span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
