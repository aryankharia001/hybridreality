import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Tag, Users, Calendar, Loader, Search } from "lucide-react";
import LuckyDrawPropertyCard from "./LuckyDrawPropertyCard.jsx";
import { Backendurl } from "../App.jsx";

const LuckyDrawPage = () => {
  const [luckyDrawProperties, setLuckyDrawProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchLuckyDrawProperties = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${Backendurl}/api/lucky-draw/properties`);
        
        // console.log('response : ',response);

        if (response.data.success) {
          setLuckyDrawProperties(response.data.properties);
          setError(null);
        } else {
          throw new Error(response.data.message);
        }
        // console.log('luckyDrawProperties : ', luckyDrawProperties);

      } catch (err) {
        console.error("Error fetching lucky draw properties:", err);
        setError("Failed to load lucky draw properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLuckyDrawProperties();
  }, []);
  
//   console.log('luckyDrawProperties : ', luckyDrawProperties);

  // Filter properties based on search query
  const filteredProperties = luckyDrawProperties.filter((property) => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

//   console.log('filteredProperties : ', filteredProperties)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-[var(--theme-color-1)] animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Lucky Draw Properties</h3>
            <p className="text-gray-600">Please wait while we fetch the latest opportunities...</p>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50 max-w-md"
        >
          <p className="font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--theme-color-1)] text-white rounded-lg hover:bg-[var(--theme-hover-color-1)] transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Limited Time Opportunity
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Property Lucky Draw
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Register for a chance to be selected for exclusive property opportunities
          </p>
        </motion.header>
        
        {/* Information Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
                <p className="text-gray-600">Register for properties you're interested in and get selected in our lucky draw</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg font-medium"
              onClick={() => window.open("/lucky-draw/about", "_blank")}
            >
              Learn More
            </motion.button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{luckyDrawProperties.length}</h3>
              <p className="text-gray-600">Active Lucky Draw Properties</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {luckyDrawProperties.reduce((total, property) => total + (property.registeredUsers || 0), 0)}
              </h3>
              <p className="text-gray-600">Total Registrations</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {luckyDrawProperties.filter(property => 
                  new Date(property.biddingEndDate) > new Date()
                ).length}
              </h3>
              <p className="text-gray-600">Draws Closing Soon</p>
            </div>
          </div>
        </div>
        
        {/* Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <LuckyDrawPropertyCard key={property._id} property={property} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"
              >
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lucky draw properties found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No properties match "${searchQuery}"`
                    : "There are currently no lucky draw properties available"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default LuckyDrawPage;