"use client";
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ProductDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.productId;
  const productName = searchParams.get('name') || 'Unknown Product';
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [llmResponse, setLlmResponse] = useState('');

  useEffect(() => {
    console.log('Product ID:', productId);
    console.log('Product name:', productName);
    if (productId) {
      fetch(`/api/databricks-query-product/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched data:', data);
          if (data.success && data.result) {
            console.log('Data array:', data.result.data_array);
            setChartData(data.result);

            // Extract product description only
            const productDescription = productName;

            // Send product description to LLM with hard-coded prompt
            const prompt = `Please give all context about this product description in social media: "${productDescription}"`;

            fetch('/api/llm-analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            })
              .then(res => res.json())
              .then(response => setLlmResponse(response.message))
              .catch(err => console.error('LLM request failed:', err));
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch chart data:', error);
          setLoading(false);
        });
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E0E7FF]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        <span className="ml-4 text-xl font-semibold text-blue-600">Loading chart data...</span>
      </div>
    );
  }

  const data = {
    labels: chartData?.result?.data_array.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Rank Over 7 Days',
        data: chartData?.result?.data_array.map(item => item[1]),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: '#1F2937',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        ticks: {
          color: '#1F2937',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#E0E7FF] font-sans">
      <nav className="bg-[#000000] text-white flex items-center justify-between p-4 shadow-md">
        <div className="text-xl font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
          Agent Board
        </div>
      </nav>

      <div className="p-6 flex flex-col md:flex-row gap-6">
        {chartData ? (
          <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <Line data={data} options={options} />
          </div>
        ) : (
          <p className="text-center text-[#1F2937] mt-4">No data available</p>
        )}

        <div className="w-80 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Additional Product Details</h3>
          <p><strong>Product ID:</strong> {productId}</p>
          <p><strong>Total Data Points:</strong> {chartData?.result?.data_array.length}</p>
          <p><strong>Highest Rank:</strong> {Math.max(...chartData?.result?.data_array.map(item => item[1]))}</p>
          <p><strong>Lowest Rank:</strong> {Math.min(...chartData?.result?.data_array.map(item => item[1]))}</p>

          <h3 className="text-xl font-bold mt-6 mb-4">LLM Insights</h3>
          <p className="text-gray-700 whitespace-pre-line">{llmResponse || 'Loading insights...'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


