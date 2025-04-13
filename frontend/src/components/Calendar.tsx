// src/components/Calendar.tsx

import React from "react";

// A simple type for the onDateSelect callback: 
// The component will pass a date (in YYYY-MM-DD format)
interface CalendarProps {
  onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  // For demonstration, list a couple of hard-coded dates.
  const dates = ["2025-03-23", "2025-03-24"];

  return (
    <div className="calendar">
      <h4>Calendar</h4>
      <ul>
        {dates.map((date) => (
          <li key={date}>
            {/* When clicked, notify the parent with the selected date */}
            <button onClick={() => onDateSelect(date)}>
              {date}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;