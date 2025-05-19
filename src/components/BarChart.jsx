// BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BarChart({ yearly }) {
  const data = {
    labels: yearly.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Amount Saved (VND)',
        data: yearly.map(item => item.value),
        backgroundColor: '#00cfff',
        borderRadius: 5,
      }
    ]
  };

  const options = {
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' ₫';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
