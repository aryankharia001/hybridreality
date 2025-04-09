import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Loader, UserPlus, Mail, Lock, Key } from 'lucide-react';
import { Backendurl } from '../App';
import { authStyles } from '../styles/auth';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // New states for OTP verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${Backendurl}/api/users/send-verification`, 
        { email: formData.email }
      );
      
      if (response.data.success) {
        setOtpSent(true);
        setVerificationId(response.data.verificationId);
        toast.success('OTP sent to your email');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${Backendurl}/api/users/verify-otp`, 
        {
          verificationId,
          otp,
          userData: formData
        }
      );
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to--50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mt-14">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] bg-clip-text text-transparent">
                Hybrid Realty
              </h2>
            </Link>
            <h2 className="mt-6 text-2xl font-semibold text-gray-800">Create an account</h2>
            <p className="mt-2 text-gray-600">Join our community of property enthusiasts</p>
          </div>

          {!otpSent ? (
            // Step 1: Registration Form
            <form onSubmit={handleSendOTP} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-[var(--theme-hover-color-1)]/20 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-[var(--theme-hover-color-1)]/20 transition-all duration-200"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-[var(--theme-hover-color-1)]/20 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white py-3 rounded-lg hover:from-[var(--theme-hover-color-1)] hover:to--700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg shadow-[var(--theme-hover-color-1)]/25"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Get Verification Code</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Sign in to your account
              </Link>
            </form>
          ) : (
            // Step 2: OTP Verification Form
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg inline-block mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verify your email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We've sent a verification code to {formData.email}
                </p>
              </div>

              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-[var(--theme-hover-color-1)]/20 transition-all duration-200"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white py-3 rounded-lg hover:from-[var(--theme-hover-color-1)] hover:to--700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg shadow-[var(--theme-hover-color-1)]/25"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Verify & Create Account</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Didn't receive the code? <span className="font-medium">Resend</span>
              </button>

              {/* Go Back Link */}
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="font-medium">Go back</span> to registration
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;