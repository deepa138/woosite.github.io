// src/components/Products.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from './Paginations';

// WooCommerce API credentials
const consumerKey = 'ck_80c3151c2dcf2f08ea6e5c197eda3f264695d831';
const consumerSecret = 'cs_be4e371172f8cbcd9dcf5ab970b5f4917c7f2011';
const baseURL = 'http://localhost/wordpress-react/wp-json/wc/v3';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=${perPage}&page=${page}`
        );
        setProducts(response.data);
        const total = parseInt(response.headers['x-wp-totalpages'], 10);
        setTotalPages(total);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container m-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <li key={product.id} className="border rounded-lg p-4 shadow-lg">
            <Link to={`/product/${product.id}`} className="text-xl font-semibold mb-2">
              <div className="overflow-hidden mb-4 relative">
                {product.images.slice(0, 2).map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={product.name}
                    className={`w-full h-full transition-opacity duration-300 ${
                      index > 0 ? 'opacity-0 hover:opacity-100 absolute top-0 left-0' : ''
                    }`}
                  />
                ))}
              </div>
              {product.name}
            </Link>
            <p className="text-gray-700 mb-2">
              {product.regular_price && product.sale_price ? (
                <span style={{ textDecoration: 'line-through' }}>${product.regular_price}</span>
              ) : (
                product.regular_price && <span>${product.regular_price}</span>
              )}
              {product.sale_price && <span className='mx-2'>$ {product.sale_price}</span>}
            </p>
            <div className="mb-4">
              <p className="text-gray-600">
                Categories: {product.categories.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} className="text-gray-600 hover:underline text-xl">{cat.name}</Link>
                )).reduce((prev, curr) => [prev, ', ', curr])}
              </p>
              <p className="text-gray-600 text-xl">Tags: {product.tags.map(tag => tag.name).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Products;
