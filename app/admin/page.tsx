"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminPage() {
  const [stats, setStats] = useState({ positif: 0, negatif: 0 });

  useEffect(() => {
    fetch("http://localhost:8080/api/sentiment/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const data = {
    labels: ["Positifs", "Négatifs"],
    datasets: [
      {
        label: "Nombre d'avis",
        data: [stats.positif, stats.negatif],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Tableau de bord Admin
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <Bar data={data} />
      </div>
    </div>
  );
}