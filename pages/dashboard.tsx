import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from 'next';
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar'; // Import the Layout component

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface Dashboard {
  _id: string;
  timestamp: string;
  total_threats: number;
  high_severity_threats: number;
  medium_severity_threats: number;
  low_severity_threats: number;
  active_incidents: number;
  resolved_incidents: number;
  unresolved_alerts: number;
  resolved_alerts: number;
  system_uptime: number;
  performance_score: number;
  vulnerabilities: number;
}

interface DashboardsProps {
  dashboards: Dashboard[];
}

const Dashboards: React.FC<DashboardsProps> = ({ dashboards }) => {
  // Dummy data for charts
  const timestamps = ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05'];
  const totalThreats = [10, 20, 30, 40, 50];
  const highSeverityThreats = [5, 10, 15, 20, 25];
  const mediumSeverityThreats = [3, 6, 9, 12, 15];
  const lowSeverityThreats = [2, 4, 6, 8, 10];

  // Dummy data for activity logs
  const activityLogs = [
    { timestamp: '2023-01-01 10:00', activity: 'Login attempt from IP 192.168.1.1' },
    { timestamp: '2023-01-01 10:05', activity: 'File uploaded to server' },
    { timestamp: '2023-01-01 10:10', activity: 'User created: john_doe' },
    { timestamp: '2023-01-01 10:15', activity: 'Password changed for user admin' },
    { timestamp: '2023-01-01 10:20', activity: 'Failed login attempt from IP 192.168.1.2' },
  ];

  // Bar Chart Data
  const barData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Total Threats',
        data: totalThreats,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data
  const lineData = {
    labels: timestamps,
    datasets: [
      {
        label: 'High Severity Threats',
        data: highSeverityThreats,
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
      {
        label: 'Medium Severity Threats',
        data: mediumSeverityThreats,
        fill: false,
        borderColor: 'rgba(255, 206, 86, 1)',
        tension: 0.1,
      },
      {
        label: 'Low Severity Threats',
        data: lowSeverityThreats,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: ['High Severity', 'Medium Severity', 'Low Severity'],
    datasets: [
      {
        data: [75, 45, 30],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
      },
    ],
  };

  return (
    <>
    <div>
      <Navbar />
    </div>
      <div className="min-h-screen bg-gray-900 text-white p-10">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-teal-400">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-teal-400">Total Threats Over Time</h2>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-teal-400">Severity Threats Over Time</h2>
            <Line data={lineData} options={{ responsive: true }} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-teal-400">Threats Severity Distribution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <div style={{ width: '80%' }}>
                  <Pie data={pieData} options={{ responsive: true }} />
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-teal-400">Current Activity Logs</h2>
                <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 text-left font-medium bg-gray-700 text-teal-300">Timestamp</th>
                      <th className="py-4 px-6 text-left font-medium bg-gray-700 text-teal-300">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log, index) => (
                      <tr key={index} className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} hover:bg-teal-600 hover:text-gray-100 transition-all duration-200`}>
                        <td className="py-4 px-6">{log.timestamp}</td>
                        <td className="py-4 px-6">{log.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboards;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("vulnerability");
    const dashboards = await db
      .collection("dashboard")
      .find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();
    return {
      props: { dashboards: JSON.parse(JSON.stringify(dashboards)) },
    };
  } catch (e) {
    console.error(e);
    return { props: { dashboards: [] } };
  }
};