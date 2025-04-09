import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BedDouble, 
  Bath, 
  Maximize, 
  ArrowLeft, 
  Phone, 
  Calendar, 
  MapPin,
  Loader,
  Building,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Compass,
  TrendingUp,
  IndianRupee,
  Hash,
  Heart
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing.jsx";
import { toast } from "react-toastify";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/products/single/${id}`);

        if (response.data.success) {
          const propertyData = response.data.property;
          setProperty({
            ...propertyData,
            amenities: parseAmenities(propertyData.amenities)
          });
          setError(null);
        } else {
          setError(response.data.message || "Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Check if property is in user's wishlist
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isLoggedIn || !id) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${Backendurl}/api/users/check-favorite/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
        // Don't show error to user for this call
      }
    };
    
    checkFavoriteStatus();
  }, [id, isLoggedIn]);

  useEffect(() => {
    // Reset scroll position and active image when component mounts
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  const parseAmenities = (amenities) => {
    // console.log(amenities);
    if (!amenities || !Array.isArray(amenities)) return [];
    
    try {
      // if (amenities.length > 0 && typeof amenities[0] === "string") {
      //   return JSON.parse(amenities[0].replace(/'/g, '"'));
      // }


      return amenities;
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  const handleKeyNavigation = useCallback((e) => {
    if (!property) return;
    
    if (e.key === 'ArrowLeft') {
      setActiveImage(prev => (prev === 0 ? property.image.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setActiveImage(prev => (prev === property.image.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'Escape' && showSchedule) {
      setShowSchedule(false);
    }
  }, [property, showSchedule]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type}: ${property.title}`,
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

  // Toggle favorite/wishlist status
  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to save properties to your wishlist");
      navigate('/login');
      return;
    }
    
    try {
      setFavoriteLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${Backendurl}/api/users/toggle-wishlist`, 
        { propertyId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setIsFavorite(response.data.isInWishlist);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Check if property is for investment
  const isForInvestment = property && (property.isForInvestment || (property.invest && property.invest !== ''));
  // Get investment price, preferring monthlyRent if it exists, otherwise use invest
  const investmentPrice = property && (property.monthlyRent || property.invest);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image Gallery Skeleton */}
            <div className="relative h-[500px] bg-gray-200 rounded-xl mb-8 animate-pulse">
              {/* Image Navigation Buttons */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 rounded-full"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 rounded-full"></div>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-black/20 rounded-full"></div>
            </div>
  
            {/* Content Skeleton */}
            <div className="p-8">
              {/* Title and Location */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3 w-full max-w-md">
                  <div className="h-10 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
  
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Price Box */}
                  <div className="h-28 bg-blue-50/50 rounded-lg animate-pulse"></div>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                  
                  {/* Contact */}
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                  </div>
                  
                  {/* Button */}
                  <div className="h-12 bg-blue-200 rounded-lg animate-pulse"></div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Location Skeleton */}
          <div className="mt-8 p-6 bg-blue-50/50 rounded-xl animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
              <div className="h-7 bg-gray-300 rounded-lg w-1/6"></div>
            </div>
            <div className="h-5 bg-gray-300 rounded-lg w-4/5 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded-lg w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/properties"
            className="text-[var(--theme-color-1)] hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
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
            to="/properties"
            className="inline-flex items-center text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg 
                transition-colors relative ${
                  isFavorite 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              {favoriteLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              )}
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                hover:bg-gray-100 transition-colors relative"
            >
              {copySuccess ? (
                <span className="text-[var(--theme-color-3)]">
                  <Copy className="w-5 h-5" />
                  Copied!
                </span>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Share
                </>
              )}
            </button>
          </div>
        </nav>

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

            {/* Favorite Button - Top Left */}
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`absolute top-4 left-4 p-3 rounded-full
                bg-white/80 backdrop-blur-sm hover:bg-white transition-colors
                shadow-md z-10 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`}
            >
              {favoriteLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : ''}`} />
              )}
            </button>

            {/* Serial Number Badge */}
            {property.serialNumber && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-md font-medium flex items-center z-10">
                <Hash className="w-4 h-4 mr-1.5" />
                <span> {property.serialNumber}</span>
              </div>
            )}

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
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  {property.serialNumber && (
                    <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm font-medium hidden md:flex items-center">
                      <Hash className="w-3.5 h-3.5 mr-1" />
                      {property.serialNumber}
                    </div>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {property.location}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`p-2 rounded-full hover:bg-gray-100 
                    transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                >
                  {favoriteLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Share2 className="w-5 h-5" />
                </button>
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
                    {property.serialNumber && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium md:hidden flex items-center">
                        <Hash className="w-3.5 h-3.5 mr-1" />
                        {property.serialNumber}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">
                    Available for {property.availability}
                  </p>
                </div>

                {/* Investment Price - Only shown when property is for investment */}
                {isForInvestment && investmentPrice && (
                  <div className="bg-amber-50 rounded-lg p-6 mb-6">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-amber-700 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      Investment Opportunity
                    </h3>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-amber-500" />
                      <span className="text-2xl font-bold text-amber-500 ml-1">
                        {Number(investmentPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="text-amber-700 ml-2">/month rental income</span>
                    </div>
                  </div>
                )}

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

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-2" />
                    {import.meta.env.VITE_CONTACT_NUMBER || "9999999999"}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setShowSchedule(true)}
                    className="bg-[var(--theme-color-1)] text-white py-3 rounded-lg 
                      hover:bg-[var(--theme-hover-color-1)] transition-colors flex items-center 
                      justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Viewing
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`py-3 rounded-lg flex items-center justify-center gap-2
                      transition-colors ${
                        isFavorite 
                          ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                  >
                    {favoriteLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                        {isFavorite ? 'Saved to Wishlist' : 'Add to Wishlist'}
                      </>
                    )}
                  </button>
                </div>
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
                    {property.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <Building className="w-4 h-4 mr-2 text-[var(--theme-color-1)]" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Info Section */}
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Property Information
                  </h2>
                  <ul className="space-y-3 text-gray-700">
                    {property.serialNumber && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        Property ID: <span className="font-semibold">#{property.serialNumber}</span>
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Type: <span className="font-semibold">{property.type}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Listed on: <span className="font-semibold">{new Date(property.createdAt).toLocaleDateString()}</span>
                    </li>
                  </ul>
                </div>

                {/* Investment Details - Show additional details for investment properties */}
                {isForInvestment && (
                  <div className="mb-6 bg-amber-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Investment Details
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Potential Monthly Income: ₹{Number(investmentPrice).toLocaleString('en-IN')}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Annual Rental Yield: {((Number(investmentPrice) * 12 / Number(property.price)) * 100).toFixed(2)}%
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        ROI Duration: {(Number(property.price) / (Number(investmentPrice) * 12)).toFixed(1)} years
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Map Location */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-[var(--theme-color-1)] mb-4">
            <Compass className="w-5 h-5" />
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

        {/* Viewing Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleViewing
              propertyId={property._id}
              onClose={() => setShowSchedule(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;