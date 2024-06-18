// CategoryPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

// WooCommerce API credentials
const consumerKey = 'ck_80c3151c2dcf2f08ea6e5c197eda3f264695d831';
const consumerSecret = 'cs_be4e371172f8cbcd9dcf5ab970b5f4917c7f2011';
const baseURL = 'http://localhost/wordpress-react/wp-json/wc/v3';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categorySlug } = useParams();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // Fetch categories to get category ID for the given slug
        const categoriesResponse = await axios.get(
          `${baseURL}/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&slug=${categorySlug}`
        );
        const categoryId = categoriesResponse.data.length > 0 ? categoriesResponse.data[0].id : null;

        // If category ID is found, fetch products by category ID
        if (categoryId) {
          const productsResponse = await axios.get(
            `${baseURL}/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&category=${categoryId}`
          );
          setProducts(productsResponse.data);
          setLoading(false);
        } else {
          console.error('Category not found:', categorySlug);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products by category:', error);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categorySlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-5 my-5">
      <h1 className="text-2xl font-semibold mb-4">{categorySlug} Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4"><Link to={`/product/${product.id}`}>
            <div className="overflow-hidden mb-4 relative">
        {product.images.slice(0, 2).map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={product.name}
            className={` w-full h-full transition-opacity duration-300 ${
              index > 0 ? 'opacity-0 hover:opacity-100 absolute top-0 left-0' : ''
            }`}
          />
        ))}
      </div></Link>
            <Link to={`/product/${product.id}`} className="text-lg font-semibold">{product.name}</Link>
            <p className="text-gray-500">Price: {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
