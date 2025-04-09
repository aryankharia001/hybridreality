import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Backendurl } from '../App';
import { Upload, X } from 'lucide-react';

const PROPERTY_TYPES = ['House', 'Apartment', 'Farmhouse', 'Villa', 'Commercial Properties', 'Shops', 'Office', 'Plots/Lands'];
const AMENITIES = ['Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock', 'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom', 'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking', 'High-speed internet ready'];

const PropertyForm = () => {
  const [availability, setAvailability] = useState("");
  const [isForInvestment, setIsForInvestment] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    amenities: [],
    images: [],
    invest: ''
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const addImages = (files) => {
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up to prevent memory leaks
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach((image, index) => formdata.append(`image${index + 1}`, image));
        } else {
          formdata.append(key, formData[key]);
        }
      });
      formdata.append('availability', availability);
      formdata.append('isForInvestment', isForInvestment);
      
      const response = await axios.post(`${Backendurl}/api/products/add`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: '', type: '', price: '', location: '', description: '', beds: '', baths: '', sqft: '', phone: '', amenities: [], images: [], invest: ''
        });
        setPreviewUrls([]);
        setAvailability("");
        setIsForInvestment(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl b-solid-green-1 rounded-xl p-20 w-full max-w-4xl">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setAvailability("sell")} className={`px-6 py-3 rounded-lg text-white font-medium ${availability === "sell" ? "bg-[var(--theme-color-3)]" : "bg-gray-400"}`}>
            Sell
          </button>
          <button onClick={() => setAvailability("rent")} className={`px-6 py-3 rounded-lg text-white font-medium ${availability === "rent" ? "bg-[var(--theme-color-1)]" : "bg-gray-400"}`}>
            Rent
          </button>
        </div>
        {availability && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {availability === "sell" ? "Sell a Property" : "Rent a Property"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="title" placeholder="Property Title" value={formData.title} onChange={handleInputChange} className="input w-full" required />
              
              {/* Property Type Dropdown */}
              <select name="type" value={formData.type} onChange={handleInputChange} className="input w-full" required>
                <option value="">Select Property Type</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="input w-full" required />
              
              {/* Investment Toggle (Only show for Sell option) */}
              {availability === "sell" && (
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-700">Is this property for investment?</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsForInvestment(true)}
                      className={`px-6 py-2 rounded-lg text-white font-medium ${isForInvestment ? "bg-[var(--theme-color-3)]" : "bg-gray-400"}`}
                    >
                      Yes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsForInvestment(false)}
                      className={`px-6 py-2 rounded-lg text-white font-medium ${!isForInvestment ? "bg-[var(--theme-color-3)]" : "bg-gray-400"}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
              
              {/* Monthly Rent Field (Only show if Investment is Yes and Sell option is selected) */}
              {availability === "sell" && isForInvestment && (
                <input 
                  type="number" 
                  name="invest" 
                  placeholder="Monthly Rent (₹)" 
                  value={formData.invest} 
                  onChange={handleInputChange} 
                  className="input w-full" 
                  required 
                />
              )}
              
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="input w-full" rows={4} required />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" name="beds" placeholder="Beds" value={formData.beds} onChange={handleInputChange} className="input" required />
                <input type="number" name="baths" placeholder="Baths" value={formData.baths} onChange={handleInputChange} className="input" required />
                <input type="number" name="sqft" placeholder="Sqft" value={formData.sqft} onChange={handleInputChange} className="input" required />
              </div>
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="input w-full" required />
              <input type="tel" name="phone" placeholder="Contact Phone" value={formData.phone} onChange={handleInputChange} className="input w-full" required />
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Property Images <span className="text-xs text-gray-500">(Maximum 4 images)</span>
                </label>
                
                {/* Drag and Drop Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border--500 bg--50' : 'border-gray-300 hover:border--400'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Drag and drop your images here</p>
                  <p className="text-xs text-gray-500">or click to browse files</p>
                </div>
                
                {/* Image Previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-32 bg-gray-100">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button type="submit" className="w-full bg-[var(--theme-color-3)] hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Property'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyForm;