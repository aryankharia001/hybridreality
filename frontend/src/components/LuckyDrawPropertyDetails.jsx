import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Share2,
  Gift,
  Loader,
  BedDouble,
  Bath,
  Maximize,
  Copy,
  IndianRupee,
  AlertCircle,
  Trophy,
  Phone
} from "lucide-react";
import { Backendurl } from "../App.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LuckyDrawPropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/lucky-draw/property/${id}`);

        // console.log('response : ',response);

        if (response.data.success) {
          setProperty(response.data.property);
          setError(null);
        } else {
          setError(response.data.message || "Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching lucky draw property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleKeyNavigation = useCallback((e) => {
    if (!property) return;
    
    if (e.key === 'ArrowLeft') {
      setActiveImage(prev => (prev === 0 ? property.image.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setActiveImage(prev => (prev === property.image.length - 1 ? 0 : prev + 1));
    }
  }, [property]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this lucky draw property: ${property.title}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRegisterForDraw = () => {
    if (!isLoggedIn) {
      toast.info("Please login to register for the lucky draw");
      navigate("/login");
      return;
    }
    
    if (property.isUserRegistered) {
      toast.info("You are already registered for this lucky draw");
      return;
    }
    
    setShowRegistrationForm(true);
  };
  
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    try {
      setRegistrationLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${Backendurl}/api/lucky-draw/register`,
        { 
          propertyId: id,
          phone: phone 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success("Successfully registered for the lucky draw!");
        setProperty(prev => ({
          ...prev,
          isUserRegistered: true,
          registeredUsers: (prev.registeredUsers || 0) + 1
        }));
        setShowRegistrationForm(false);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering for lucky draw:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to register. Please try again."
      );
    } finally {
      setRegistrationLoading(false);
    }
  };
  
  // Calculate remaining days
  const calculateRemainingDays = () => {
    if (!property) return 0;
    
    const today = new Date();
    const endDate = new Date(property.biddingEndDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Check if registration is closed
  const isRegistrationClosed = () => {
    return calculateRemainingDays() === 0;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 text-[var(--theme-color-1)] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Property Details</h3>
          <p className="text-gray-600">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/lucky-draw"
            className="text-[var(--theme-color-1)] hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Lucky Draw
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link
            to="/lucky-draw"
            className="inline-flex items-center text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lucky Draw
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              hover:bg-gray-100 transition-colors relative"
          >
            {copySuccess ? (
              <span className="text-green-600">
                <Copy className="w-5 h-5 mr-1" />
                Copied!
              </span>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share
              </>
            )}
          </button>
        </nav>

        {/* Lucky Draw Status Banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Gift className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Lucky Draw Property</h3>
                <p className="text-sm text-amber-700">
                  Registration {isRegistrationClosed() ? "closed" : "open until " + formatDate(property.biddingEndDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{property.registeredUsers || 0}</span>
                  <span className="text-xs text-gray-500">registrations</span>
                </div>
              </div>
              
              {!isRegistrationClosed() && (
                <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm">
                  <div className="flex items-center gap-1.5 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{calculateRemainingDays()}</span>
                    <span className="text-xs text-gray-500">days left</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-[500px] bg-gray-100 rounded-xl overflow-hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={property.image[activeImage]}
                alt={`${property.title} - View ${activeImage + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Lucky Draw Badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-medium">Lucky Draw Property</span>
            </div>

            {/* Image Navigation */}
            {property.image.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage(prev => 
                    prev === 0 ? property.image.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImage(prev => 
                    prev === property.image.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 
              bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {activeImage + 1} / {property.image.length}
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {property.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {/* Property Price */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-[var(--theme-color-1)]">
                      ₹{Number(property.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Market Value
                  </p>
                </div>

                {/* Lucky Draw Info */}
                <div className="bg-amber-50 rounded-lg p-6 mb-6">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-amber-700 mb-3">
                    <Trophy className="w-5 h-5" />
                    Lucky Draw Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Registration Started:</span>
                      <span className="font-medium text-gray-900">{formatDate(property.biddingStartDate)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Registration Ends:</span>
                      <span className="font-medium text-gray-900">{formatDate(property.biddingEndDate)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Registrations:</span>
                      <span className="font-medium text-gray-900">{property.registeredUsers || 0}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Draw Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(new Date(new Date(property.biddingEndDate).getTime() + 86400000))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <BedDouble className="w-6 h-6 text-[var(--theme-color-1)] mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {property.beds} {property.beds > 1 ? 'Beds' : 'Bed'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Bath className="w-6 h-6 text-[var(--theme-color-1)] mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {property.baths} {property.baths > 1 ? 'Baths' : 'Bath'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Maximize className="w-6 h-6 text-[var(--theme-color-1)] mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{property.sqft} sqft</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isRegistrationClosed() ? (
                  !property.isUserRegistered ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRegisterForDraw}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-lg 
                        hover:from-amber-600 hover:to-yellow-600 transition-all flex items-center 
                        justify-center gap-2 font-medium shadow-md"
                      disabled={registrationLoading}
                    >
                      {registrationLoading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Gift className="w-5 h-5" />
                          Register for Lucky Draw
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">You are registered for this lucky draw!</span>
                      </div>
                      <p className="text-sm">Results will be announced after {formatDate(property.biddingEndDate)}</p>
                    </div>
                  )
                ) : (
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center text-gray-700 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Registration is now closed</span>
                    </div>
                    <p className="text-sm">Results will be announced soon</p>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {property.amenities && property.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Lucky Draw Rules */}
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Lucky Draw Rules
                  </h2>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2"></span>
                      <span>Participants must be registered users of Hybrid Realty</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2"></span>
                      <span>Only one registration per user is allowed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2"></span>
                      <span>Winners will be selected randomly after the registration period ends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2"></span>
                      <span>Winners will be notified via email and phone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2"></span>
                      <span>The lucky draw winner gets exclusive access to purchase this property at a special price</span>
                    </li>
                  </ul>
                </div>
                
                {/* Contact Information */}
                <div className="mb-6 bg-blue-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Have Questions?
                  </h2>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Phone className="w-5 h-5 mr-2 text-[var(--theme-color-1)]" />
                    {import.meta.env.VITE_CONTACT_NUMBER || "9999999999"}
                  </div>
                  <p className="text-sm text-gray-500">
                    Our customer service team is available Monday to Saturday, 9 AM to 6 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form Modal */}
        <AnimatePresence>
          {showRegistrationForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Register for Lucky Draw</h3>
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmitRegistration}>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your 10-digit phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      We'll use this to contact you if you win the lucky draw
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-amber-600 hover:text-amber-700">terms and conditions</a>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 flex items-center justify-center gap-2"
                      disabled={registrationLoading}
                    >
                      {registrationLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          Register Now
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Location */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-[var(--theme-color-1)] mb-4">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {property.location}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)]"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LuckyDrawPropertyDetails;