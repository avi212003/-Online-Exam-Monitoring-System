import React, { useState, useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AuthContext } from '../contexts/AuthContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PastExamScores = () => {
  const [examData, setExamData] = useState([]);
  const { userDetails } = useContext(AuthContext);

  useEffect(() => {
    if (userDetails && userDetails.exams) {
      // Sort exams by date in descending order
      const sortedExams = [...userDetails.exams].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setExamData(sortedExams);
    }
  }, [userDetails]);

  // Prepare data for the chart
  const data = {
    labels: examData.map(exam => `${exam.subject} - ${exam.title}`),
    datasets: [
      {
        label: 'Scores (%)',
        data: examData.map(exam => exam.score),
        backgroundColor: examData.map(() => 'rgba(75, 192, 192, 0.6)'),
        borderColor: examData.map(() => 'rgba(75, 192, 192, 1)'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Past Exam Scores Details',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const exam = examData[context.dataIndex];
            return [
              `Score: ${exam.score}%`,
              `Date: ${new Date(exam.date).toLocaleDateString()}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="past_exam_scores">
      <h3>Pictorial Representation of Past Exam Scores</h3>
      <div className="h-64 w-full">
        {examData.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No past exam scores available
          </div>
        )}
      </div>
    </div>
  );
};

export default PastExamScores;