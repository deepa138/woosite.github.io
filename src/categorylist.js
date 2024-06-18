import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Paginations'; // Assuming the Pagination component is in a separate file
import { Link, useParams } from 'react-router-dom';

// WooCommerce API credentials
const consumerKey = 'ck_80c3151c2dcf2f08ea6e5c197eda3f264695d831';
const consumerSecret = 'cs_be4e371172f8cbcd9dcf5ab970b5f4917c7f2011';
const baseURL = 'http://localhost/wordpress-react/wp-json/wc/v3';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 30;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=${categoriesPerPage}&page=${currentPage}`
        );
        setCategories(response.data);
        setTotalCategories(response.headers['x-wp-total']);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCategories / categoriesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-5 my-5">
      <h1 className="text-2xl font-semibold mb-4">All Categories</h1>
      <p className="mb-4">Total Categories: {totalCategories}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="border p-4">
            <Link to={`/category/${category.slug}`} className="text-lg font-semibold">{category.name}</Link>
            <p className="text-gray-500">No. of Products: {category.count}</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default AllCategories;
