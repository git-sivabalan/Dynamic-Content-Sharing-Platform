import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated  }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error('Please fill in both fields.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/login`, { email, password });
  
      if (response.status === 200) {
        const token = response.data.results.token;
  
        // Store the token in local storage
        localStorage.setItem('authToken', token);
  
        toast.success('Logged in successfully');
        setIsAuthenticated(true);
        navigate('/'); // Redirect to the home page or dashboard
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const forgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/forgot-password`, { email });
      toast.success(response.data?.message || 'Password reset instructions sent to your email.');
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while requesting a password reset.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md bg-white rounded-lg">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">Login to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Hit forgot password and get your password</p>
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
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">Password</label>
                  <button
                    className="text-sm font-semibold text-black hover:underline"
                    onClick={forgotPassword}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    placeholder="Password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  className={`inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white ${
                    loading ? 'bg-gray-600 cursor-not-allowed' : 'hover:bg-black/80'
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="animate-spin border-t-transparent border-gray-200 border-2 rounded-full w-4 h-4"></span>
                  ) : (
                    'Sign In'
                  )}
                </button>
                <span className="text-sm flex mt-3 justify-center">
                  Don't have an account?{' '}
                  <a href="/signup" className="ml-1 font-bold underline underline-offset-2">
                    Sign Up
                  </a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
