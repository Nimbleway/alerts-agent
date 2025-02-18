"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/databricks-query');
        const result = await response.json();
        if (result?.result?.result?.data_array) {
          setData(result.result.result.data_array);
        } else {
          console.warn("No data returned from API");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (productId: string) => {
    router.push(`/graph/${productId}`);
  };

  return (
    <div className="min-h-screen bg-[#E0E7FF] font-sans overflow-x-auto">
      {/* Toolbar */}
      <nav className="bg-[#000000] text-white flex items-center justify-between p-4 shadow-md">
        <div className="text-xl font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
          Agent Board
        </div>
        <div className="space-x-4">
          <button className="bg-[#6D6FE2] px-4 py-2 rounded hover:bg-[#7c8dff]">Home</button>
          <button className="bg-[#6D6FE2] px-4 py-2 rounded hover:bg-[#7c8dff]">Reports</button>
          <button className="bg-[#6D6FE2] px-4 py-2 rounded hover:bg-[#7c8dff]">Settings</button>
        </div>
      </nav>

      {/* Table Section */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-[#000000]">Products Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-[#6D6FE2] text-white">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Notification Name</th>
                <th className="p-4 text-left">Competitor Product ID</th>
                <th className="p-4 text-left">Competitor Product Name</th>
                <th className="p-4 text-left">Product Category</th>
                <th className="p-4 text-left">My Product Rank</th>
                <th className="p-4 text-left">My Product Name</th>
                <th className="p-4 text-left">My Product ID</th>
                <th className="p-4 text-left">Competitor Rank</th>
                <th className="p-4 text-left">Competitor Availability Yesterday</th>
                <th className="p-4 text-left">Competitor Availability Today</th>
                <th className="p-4 text-left">Is Alert</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const parsedItem = JSON.parse(item[2]);
                const productId = parsedItem.my_product_id;

                return (
                  <tr
                    key={index}
                    className="bg-white hover:bg-[#C7D2FE] cursor-pointer border-b border-gray-200"
                    onClick={() => handleRowClick(productId)}
                  >
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{item[0]}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{item[1]}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.competitor_product_id}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.competitor_product_name}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.product_category}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.my_product_rank}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.my_product_name}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.my_product_id}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.competitor_rank}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.competitor_availability_yesterday ? 'Yes' : 'No'}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{parsedItem.competitor_availability_today ? 'Yes' : 'No'}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{item[3] ? 'Yes' : 'No'}</td>
                    <td className="p-4">
                      <button className="bg-[#6D6FE2] text-white px-3 py-1 rounded hover:bg-[#5a5ecf]">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="text-center text-[#1F2937] mt-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;