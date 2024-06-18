import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faPinterest, faLinkedin } from '@fortawesome/free-brands-svg-icons';

// WooCommerce API credentials
const consumerKey = 'ck_80c3151c2dcf2f08ea6e5c197eda3f264695d831';
const consumerSecret = 'cs_be4e371172f8cbcd9dcf5ab970b5f4917c7f2011';
const baseURL = 'http://localhost/wordpress-react/wp-json/wc/v3';

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/products/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
        );
        setProduct(response.data);
        setSelectedImage(response.data.images[0].src);

        const relatedIds = response.data.related_ids;
        const relatedResponse = await axios.get(
          `${baseURL}/products?include=${relatedIds.join(',')}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
        );
        setRelatedProducts(relatedResponse.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleThumbnailClick = (src) => {
    setSelectedImage(src);
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + amount;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === product.id);

    if (itemIndex >= 0) {
      cart[itemIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setSuccessMessage('Product added to cart!');
    
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const renderTabContent = () => {
    if (!product) {
      return null;
    }
    switch (activeTab) {
      case 'description':
        return <div dangerouslySetInnerHTML={{ __html: product.description }} />;
      case 'additional-info':
        return <div>Additional Information content</div>;
      case 'reviews':
        return <div>Reviews content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <img src={selectedImage} alt={product.name} className="w-full h-auto mb-4" />
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={product.name}
                  className={`w-16 h-16 cursor-pointer ${selectedImage === image.src ? 'border-2 border-gray-800' : ''}`}
                  onClick={() => handleThumbnailClick(image.src)}
                />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-red-500 text-xl mb-2">€{product.price}</p>
            {product.regular_price && (
              <p className="line-through text-gray-500 mb-2">€{product.regular_price}</p>
            )}
            <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }}></p>
            <div className="flex items-center mb-4">
              <button
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-l"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <input type="number" value={quantity} className="w-12 text-center" readOnly />
              <button
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-r"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <button className="bg-black text-white py-2 px-4 rounded mb-4" onClick={handleAddToCart}>
              Add to Cart
            </button>
            {successMessage && (
              <div className="text-green-500 mb-4">
                {successMessage}
              </div>
            )}
            <div className="mb-4">
              <p className="text-gray-600">Categories: {product.categories.map(cat => cat.name).join(', ')}</p>
              <p className="text-gray-600">Tags: {product.tags.map(tag => tag.name).join(', ')}</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="text-gray-600">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-gray-600">
                <FontAwesomeIcon icon={faPinterest} />
              </a>
              <a href="#" className="text-gray-600">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div className="mt-8">
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'additional-info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('additional-info')}
            >
              Additional Information
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </nav>
        </div>
        <div>
          {renderTabContent()}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="border p-4 rounded-md">
              <img src={relatedProduct.images[0]?.src} alt={relatedProduct.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-lg font-semibold">{relatedProduct.name}</h3>
              <p className="text-red-500">€{relatedProduct.price}</p>
              {relatedProduct.regular_price && (
                <p className="line-through text-gray-500">€{relatedProduct.regular_price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
