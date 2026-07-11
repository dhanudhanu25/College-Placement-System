import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components once (controllers + elements + scales + plugins)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
);

const gridColor = "rgba(148, 163, 184, 0.2)";
const tickColor = "#94a3b8";

const BarChart = ({ labels, data, label = "Count", color = "#4f46e5" }) => (
  <Bar
    data={{
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: color,
          borderRadius: 6,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor } },
        y: { grid: { color: gridColor }, ticks: { color: tickColor }, beginAtZero: true },
      },
    }}
  />
);

const LineChart = ({ labels, data, label = "Count", color = "#0ea5e9" }) => (
  <Line
    data={{
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          backgroundColor: "rgba(14,165,233,0.15)",
          fill: true,
          tension: 0.3,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor } },
        y: { grid: { color: gridColor }, ticks: { color: tickColor }, beginAtZero: true },
      },
    }}
  />
);

const DoughnutChart = ({ labels, data, colors }) => (
  <Doughnut
    data={{
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors || ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          borderWidth: 0,
        },
      ],
    }}
    options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
  />
);

export { BarChart, LineChart, DoughnutChart };
