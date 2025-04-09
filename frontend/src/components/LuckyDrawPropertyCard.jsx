import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Gift,
  AlertCircle
} from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LuckyDrawPropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const handleNavigateToDetails = () => {
    navigate(`/lucky-draw/property/${property.propertyId}`);
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation(); // Prevent navigating to details page
    
    if (!isLoggedIn) {
      toast.info("Please login to register for the lucky draw");
      navigate("/login");
      return;
    }
    
    // If already registered, show message
    if (property.isUserRegistered) {
      toast.info("You are already registered for this lucky draw");
      return;
    }
    
    // Navigate to registration form
    navigate(`/lucky-draw/register/${property._id}`);
  };
  
  // Calculate remaining days
  const calculateRemainingDays = () => {
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
      onClick={handleNavigateToDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={property.image[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white 
              px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1"
          >
            <Gift className="w-3 h-3" />
            Lucky Draw
          </motion.span>
        </div>
        
        {/* Remaining Time Badge */}
        <div className="absolute bottom-4 right-4">
          {isRegistrationClosed() ? (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Registration Closed
            </span>
          ) : (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {calculateRemainingDays()} days left
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2 text-amber-500" />
          {property.location}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 
          group-hover:text-[var(--theme-color-1)] transition-colors">
          {property.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 p-2 rounded-lg bg-amber-50">
            <div className="flex items-center text-amber-700 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-1 text-amber-500" />
              Start Date
            </div>
            <span className="text-sm text-gray-700">{formatDate(property.biddingStartDate)}</span>
          </div>
          
          <div className="flex flex-col gap-1 p-2 rounded-lg bg-amber-50">
            <div className="flex items-center text-amber-700 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-1 text-amber-500" />
              End Date
            </div>
            <span className="text-sm text-gray-700">{formatDate(property.biddingEndDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            <span className="font-medium">{property.registeredUsers || 0}</span>
            <span className="ml-1 text-sm text-gray-500">registrations</span>
          </div>
          
          {isRegistrationClosed() ? (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Draw Closed
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRegisterClick}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm 
                ${property.isUserRegistered 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-amber-500 text-white hover:bg-amber-600"}`}
            >
              {property.isUserRegistered ? "Registered" : "Register Now"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

LuckyDrawPropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    image: PropTypes.arrayOf(PropTypes.string).isRequired,
    biddingStartDate: PropTypes.string.isRequired,
    biddingEndDate: PropTypes.string.isRequired,
    registeredUsers: PropTypes.number,
    isUserRegistered: PropTypes.bool
  }).isRequired
};

export default LuckyDrawPropertyCard;