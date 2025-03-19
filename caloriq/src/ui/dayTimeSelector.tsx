"use client";

import React, { useState } from "react";


interface TimeSlot {
    day: string;
    startTime: string;
    endTime: string;
}


export const WeeklyScheduler = () => {
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tempSlot, setTempSlot] = useState<TimeSlot>({ 
        day: "", 
        startTime: "", 
        endTime: "" 
    });

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate time options for the dropdown
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeOptions.push(time);
        }
    }

    const handleDayClick = (day: string) => {
        setTempSlot({ ...tempSlot, day });
        setShowTimePicker(true);
    };

    const handleTimeSelect = (type: "start" | "end", value: string) => {
        setTempSlot(prev => ({
        ...prev,
        [type === "start" ? "startTime" : "endTime"]: value
        }));
    };

    const saveSlot = () => {
        if (tempSlot.day && tempSlot.startTime && tempSlot.endTime) {
        setSelectedSlots([...selectedSlots, tempSlot]);
        setTempSlot({ day: "", startTime: "", endTime: "" });
        setShowTimePicker(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Week Navigation */}
            <div className="flex justify-between items-center mb-4">
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                >
                ←
                </button>

                <h3 className="font-semibold">
                    Week of {currentDate.toLocaleDateString()}
                </h3>

                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                >
                    →
                </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map(day => (
                    <div
                        key={day}
                        className={`p-2 text-center border rounded cursor-pointer ${
                        tempSlot.day === day ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Time Picker */}
            {showTimePicker && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Start Time</label>
                            <select
                                className="border rounded p-2"
                                value={tempSlot.startTime}
                                onChange={(e) => handleTimeSelect("start", e.target.value)}
                            >
                                <option value="">Select start</option>
                                {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">End Time</label>
                            <select
                                className="border rounded p-2"
                                value={tempSlot.endTime}
                                onChange={(e) => handleTimeSelect("end", e.target.value)}
                            >
                                <option value="">Select end</option>
                                {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={saveSlot}
                    >
                        Add Time Slot
                    </button>
                </div>
            )}

            {/* Selected Slots */}
            <div className="mt-4">
                <h4 className="font-medium mb-2">Selected Availability:</h4>
                {selectedSlots.map((slot, index) => (
                    <div 
                        key={index}
                        className="bg-blue-100 p-2 rounded mb-2 text-sm"
                    >
                        {slot.day} {slot.startTime} - {slot.endTime}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Usage in your survey page:
// Add this component where you want the schedule picker
<WeeklyScheduler />