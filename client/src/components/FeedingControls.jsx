import { useState } from "react";
import FoodColorButton from "./FoodColorButton";
import { Button } from "@/components/ui/button";

export default function FeedingControls({ onSubmit, isPending }) {
  const [selectedFood, setSelectedFood] = useState(null);

  const handleFoodSelect = (color) => {
    setSelectedFood(color);
  };

  const handleSubmit = () => {
    if (selectedFood) {
      onSubmit(selectedFood);
      setSelectedFood(null); // Reset selection after submission
    }
  };

  const foodColors = [
    { id: "red", label: "Red" },
    { id: "blue", label: "Blue" },
    { id: "purple", label: "Purple" },
    { id: "orange", label: "Orange" }
  ];

  return (
    <section className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Select Food Type</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {foodColors.map(food => (
          <FoodColorButton
            key={food.id}
            color={food.id}
            label={food.label}
            selected={selectedFood === food.id}
            onClick={() => handleFoodSelect(food.id)}
          />
        ))}
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px] flex flex-col justify-center">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Selected Food:</h3>
        <div className="text-xl font-bold flex items-center justify-center min-h-[40px]">
          {selectedFood ? (
            <>
              <div 
                className="w-8 h-8 rounded-full mr-3" 
                style={{ backgroundColor: getColorHex(selectedFood) }}
              />
              <span className="text-2xl capitalize">{selectedFood}</span>
            </>
          ) : (
            <span className="text-gray-400">No food selected</span>
          )}
        </div>
      </div>
      
      <Button
        className="bg-teal-500 hover:bg-teal-600 text-white text-2xl font-bold p-6 rounded-lg shadow transition-colors mt-auto h-auto"
        disabled={!selectedFood || isPending}
        onClick={handleSubmit}
      >
        {isPending ? "Recording..." : "Enter"}
      </Button>
    </section>
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