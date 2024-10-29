import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PastExamScores = () => {
  // Data for the chart
  const data = {
    labels: ['Discrete Math', 'Software Engineering', 'Operating System'], // Subjects
    datasets: [
      {
        label: 'Scores (%)',
        data: [85, 90, 78], // Scores for each subject
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'], // Colors for each bar
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Past Exam Scores Details',
      },
    },
  };

  return (
    <div className='past_exam_scores'>
      <h3>Pictorial Representation of Past Exam Scores</h3>
      {/* The Bar chart */}
      <Bar data={data} options={options} style={{ height: '250px', width: '500px' }}/>
    </div>
  );
};

export default PastExamScores;