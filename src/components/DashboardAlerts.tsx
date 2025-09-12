"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

interface Prediction {
  district: string;
  risk_level: string;
  predicted_cases: number;
  timestamp: number;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Prediction[]>([]);

  useEffect(() => {
    const predictionsRef = ref(db, "predictions/");
    const unsubscribe = onValue(predictionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.values(data) as Prediction[];
        parsed.sort((a, b) => b.timestamp - a.timestamp); // latest first
        setAlerts(parsed);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Disease Alerts</h1>
      {alerts.length === 0 ? (
        <p className="text-gray-500">✅ No alerts yet</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl shadow-md border"
            >
              <h2 className="text-xl font-semibold">{alert.district}</h2>
              <p>
                <span className="font-bold">Risk:</span>{" "}
                <span
                  className={
                    alert.risk_level === "High"
                      ? "text-red-600 font-semibold"
                      : alert.risk_level === "Medium"
                      ? "text-yellow-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {alert.risk_level}
                </span>
              </p>
              <p>
                <span className="font-bold">Predicted Cases:</span>{" "}
                {alert.predicted_cases}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
