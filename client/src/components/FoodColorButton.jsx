export default function FoodColorButton({ 
  color, 
  label, 
  selected, 
  onClick 
}) {
  // Construct color-specific classes
  const getBackgroundColor = (color) => {
    const colorMap = {
      red: "bg-red-100 hover:bg-red-200 border-red-500 text-red-700",
      blue: "bg-blue-100 hover:bg-blue-200 border-blue-500 text-blue-700",
      purple: "bg-purple-100 hover:bg-purple-200 border-purple-500 text-purple-700",
      orange: "bg-orange-100 hover:bg-orange-200 border-orange-500 text-orange-700",
    };
    
    return colorMap[color] || "";
  };
  
  const getColorDot = (color) => {
    const colorMap = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500", 
      orange: "bg-orange-500",
    };
    
    return colorMap[color] || "";
  };

  return (
    <button 
      className={`${getBackgroundColor(color)} border-2 rounded-lg p-4 h-24 text-xl font-bold transition-colors flex items-center justify-center ${selected ? 'ring-4' : ''}`}
      onClick={onClick}
      aria-selected={selected}
    >
      <div className={`w-6 h-6 rounded-full ${getColorDot(color)} mr-3`}></div>
      {label}
    </button>
  );
}