import { useState, useEffect } from "react";

const CurrentTime = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weekday = currentDate.toLocaleDateString("en-US", { weekday: "long" });
  const month = currentDate.toLocaleDateString("en-US", { month: "long" });
  const day = currentDate.toLocaleDateString("en-US", { day: "numeric" });
  const year = currentDate.toLocaleDateString("en-US", { year: "numeric" });
  const hours = currentDate.getHours() % 12 || 12;
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const amPm = currentDate.getHours() >= 12 ? "PM" : "AM";
  const timeString = `${hours}:${minutes}:${seconds} ${amPm}`;

  return (
    <div className="text-sm text-gray-800 mt-1">
      {`${weekday}, ${month} ${day}, ${year} ${timeString}`}
    </div>
  );
};

export default CurrentTime;