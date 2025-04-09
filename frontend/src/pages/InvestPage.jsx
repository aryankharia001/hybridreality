import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, TrendingUp, MapPin, Home } from "lucide-react";
// import SearchBar from "./Searchbar.jsx";
// import PropertyCard from "./Propertycard.jsx";
// import { Backendurl } from "../../App.jsx";
import SearchBar from "../components/properties/Searchbar.jsx";
import PropertyCard from "../components/properties/Propertycard.jsx";
import { Backendurl } from "../App.jsx";

const InvestPage = () => {
  const [viewState, setViewState] = useState({
    isGridView: true,
  });

  const [propertyState, setPropertyState] = useState({
    properties: [],
    loading: true,
    error: null,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const fetchProperties = async () => {
    try {
      setPropertyState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(`${Backendurl}/api/products/list`);
      
      if (response.data.success) {
        // Filter for only approved and investment properties
        const investmentProperties = response.data.property.filter(
          prop => prop.isApproved && ((prop.invest && prop.invest !== "") || prop.isForInvestment)
        );
        
        setPropertyState((prev) => ({
          ...prev,
          properties: investmentProperties,
          error: null,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setPropertyState((prev) => ({
        ...prev,
        error: "Failed to fetch investment properties. Please try again later.",
        loading: false,
      }));
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter properties based on search query
  const filteredProperties = searchQuery 
    ? propertyState.properties.filter(property => 
        [property.title, property.description, property.location]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : propertyState.properties;

  if (propertyState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center"
        >
          <div className="relative mb-6">
            {/* Main loader animation */}
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl flex items-center justify-center relative shadow-lg shadow-amber-400/30"
              animate={{ 
                rotate: [0, 0, 360, 360, 0],
                scale: [1, 0.9, 0.9, 1, 1],
                borderRadius: ["16%", "50%", "50%", "16%", "16%"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Moving dots around the icon */}
            <motion.div 
              className="absolute w-3 h-3 bg-amber-300 rounded-full right-4 bottom-10"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [-30, 0, 30, 0, -30],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div 
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              animate={{
                x: [0, -30, 0, 30, 0],
                y: [30, 0, -30, 0, 30],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
  
            {/* Background pulse effect */}
            <div className="absolute inset-0 bg-amber-400/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
            Loading Investment Properties
          </h3>
          
          <p className="text-gray-600 mb-5 max-w-xs text-center">
            {`We're finding investment opportunities just for you...`}
          </p>
          
          {/* Progress bar with animated gradient */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-size-200 absolute top-0 left-0 right-0"
              animate={{ 
                backgroundPosition: ["0% center", "100% center", "0% center"] 
              }}
              style={{ backgroundSize: "200% 100%" }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          <div className="flex items-center mt-4 text-xs text-amber-500">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"
            />
            <span>Please wait while we find the best investment opportunities</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (propertyState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50 max-w-md"
        >
          <p className="font-medium mb-4">{propertyState.error}</p>
          <button
            onClick={fetchProperties}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 
              transition-colors duration-200"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Investment Properties
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium properties with excellent investment potential
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <SearchBar
                  onSearch={(query) => setSearchQuery(query)}
                  className="flex-1"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewState(prev => ({ ...prev, isGridView: true }))}
                    className={`p-2 rounded-lg ${
                      viewState.isGridView ? "bg-amber-100 text-amber-500" : "hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewState(prev => ({ ...prev, isGridView: false }))}
                    className={`p-2 rounded-lg ${
                      !viewState.isGridView ? "bg-amber-100 text-amber-500" : "hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <motion.div
              layout
              className={`grid gap-6 ${
                viewState.isGridView ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <PropertyCard
                      availability={property.availability}
                      key={property._id}
                      property={property}
                      viewType={viewState.isGridView ? "grid" : "list"}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"
                  >
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No investment properties found
                    </h3>
                    <p className="text-gray-600">
                      Check back later for new investment opportunities
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestPage;