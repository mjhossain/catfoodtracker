import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/time";

export default function FeedingHistory({ feedings, isLoading }) {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3 text-gray-800">Recent Feeding History</h3>
      <div className="bg-gray-50 rounded-lg border border-gray-200 flex-grow flex flex-col">
        {isLoading ? (
          <ul className="divide-y divide-gray-200">
            {[...Array(4)].map((_, index) => (
              <li key={index} className="p-4">
                <div className="flex items-center">
                  <Skeleton className="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : feedings && feedings.length > 0 ? (
          <ScrollArea className="h-[calc(4*5rem)]">
            <ul className="divide-y divide-gray-200">
              {feedings.map((feeding) => (
                <li key={feeding.id} className="p-4 flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full mr-3 flex-shrink-0" 
                    style={{ backgroundColor: getColorHex(feeding.color) }}
                  />
                  <div>
                    <div className="font-bold text-lg capitalize">{feeding.color}</div>
                    <time className="text-sm text-gray-600">
                      {formatDateTime(new Date(feeding.timestamp))}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="p-4 text-gray-500 text-center flex items-center justify-center h-full">
            No feeding history available
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get color hex values for inline styles
function getColorHex(color) {
  const colorMap = {
    red: "#ef4444", // Tailwind red-500
    blue: "#3b82f6", // Tailwind blue-500
    purple: "#8b5cf6", // Tailwind purple-500
    orange: "#f97316", // Tailwind orange-500
  };
  
  return colorMap[color] || "#000000";
}