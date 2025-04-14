import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import FeedingHistory from "./FeedingHistory";
import { formatDateTime, formatElapsedTime } from "@/lib/time";

export default function FeedingStatus({ 
  lastFeeding, 
  feedingHistory, 
  isLoading 
}) {
  const [elapsedTime, setElapsedTime] = useState("");

  // Update elapsed time every minute
  useEffect(() => {
    // Calculate elapsed time on first render
    if (lastFeeding?.timestamp) {
      const timestamp = new Date(lastFeeding.timestamp);
      setElapsedTime(formatElapsedTime(timestamp));
      
      // Update elapsed time every minute
      const intervalId = setInterval(() => {
        setElapsedTime(formatElapsedTime(timestamp));
      }, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [lastFeeding]);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Feeding Status</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Last Feeding Box */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col min-h-[180px] max-h-[180px]">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Last Feeding:</h3>
          <div className="flex-grow flex flex-col justify-center items-center">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-32" />
              </div>
            ) : lastFeeding ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-3">
                  <div 
                    className="w-8 h-8 rounded-full mr-3" 
                    style={{ backgroundColor: getColorHex(lastFeeding.color) }}
                  />
                  <span className="text-2xl font-bold capitalize">{lastFeeding.color}</span>
                </div>
                <time className="text-lg text-gray-600">
                  {formatDateTime(new Date(lastFeeding.timestamp))}
                </time>
              </div>
            ) : (
              <div className="text-gray-500 text-center">No feeding recorded yet</div>
            )}
          </div>
        </div>
        
        {/* Time Since Last Feeding Box */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col min-h-[180px] max-h-[180px]">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Time Since:</h3>
          <div className="flex-grow flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="h-10 w-48" />
            ) : lastFeeding ? (
              <div className="text-3xl font-bold text-teal-500 text-center">{elapsedTime}</div>
            ) : (
              <div className="text-gray-500 text-center">No feeding recorded yet</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Feeding History - With flex-grow to take remaining space */}
      <div className="flex-grow flex flex-col">
        <FeedingHistory feedings={feedingHistory} isLoading={isLoading} />
      </div>
    </section>
  );
}

// Helper function to get color hex values for inline styles
function getColorHex(color) {
  if (!color) return "#000000";
  
  const colorMap = {
    red: "#ef4444", // Tailwind red-500
    blue: "#3b82f6", // Tailwind blue-500
    purple: "#8b5cf6", // Tailwind purple-500
    orange: "#f97316", // Tailwind orange-500
  };
  
  return colorMap[color] || "#000000";
}