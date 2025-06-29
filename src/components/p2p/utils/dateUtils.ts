
/**
 * Format a date to a human-readable time difference (e.g. "2 hours ago", "just now")
 */
export function formatTimeDifference(date: Date): string {
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (differenceInSeconds < 60) {
    return "just now";
  }
  
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} ${differenceInMinutes === 1 ? "minute" : "minutes"} ago`;
  }
  
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return `${differenceInHours} ${differenceInHours === 1 ? "hour" : "hours"} ago`;
  }
  
  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 7) {
    return `${differenceInDays} ${differenceInDays === 1 ? "day" : "days"} ago`;
  }
  
  // For older dates, return formatted date
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}
