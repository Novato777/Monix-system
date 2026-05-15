import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const FinancialChart = ({ expenses }) => {
  const categories = [...new Set(expenses.map(e => e.category))];
  const dataByCategory = categories.map(cat => {
    return expenses
      .filter(e => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
  });

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: dataByCategory,
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(244, 63, 94, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(168, 85, 247, 0.6)',
        ],
        borderColor: [
          '#6366f1',
          '#10b981',
          '#f43f5e',
          '#f59e0b',
          '#a855f7',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
    },
  };

  return (
    <div className="chart-container">
      {expenses.length > 0 ? (
        <Pie data={pieData} options={options} />
      ) : (
        <div style={{ color: 'var(--text-muted)' }}>No hay datos para mostrar</div>
      )}
    </div>
  );
};

export default FinancialChart;
