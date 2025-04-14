/**
 * Format a date to display in a user-friendly format
 * Shows "Today, HH:MM AM/PM" or "Yesterday, HH:MM AM/PM" or "MM/DD/YYYY, HH:MM AM/PM"
 */
export function formatDateTime(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = 
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  
  const isYesterday = 
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  
  // Format time part (HH:MM AM/PM)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
  
  // Format date based on when it occurred
  if (isToday) {
    return `Today, ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeString}`;
  } else {
    // Format as MM/DD/YYYY for older dates
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}, ${timeString}`;
  }
}

/**
 * Calculate elapsed time since a given date and format as "X hours Y minutes"
 */
export function formatElapsedTime(date) {
  const now = new Date();
  const elapsed = now.getTime() - date.getTime();
  
  // Convert to hours and minutes
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  
  let timeText = '';
  
  if (hours > 0) {
    timeText += `${hours} hour${hours !== 1 ? 's' : ''} `;
  }
  
  timeText += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  
  return timeText;
}