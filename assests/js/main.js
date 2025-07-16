// js/main.js

document.addEventListener('DOMContentLoaded', function() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarBody = document.querySelector('#calendar tbody');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const totalMonthlyHoursElement = document.getElementById('totalMonthlyHours');
    const dateInput = document.getElementById('dateInput');
    const goToDateButton = document.getElementById('goToDateButton');

    let currentDate = new Date();
    let workData = JSON.parse(localStorage.getItem('workHours')) || {};

    function renderCalendar(highlightDate = null) {
        // This function builds the calendar based on the value of `currentDate`
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearElement.textContent = `${year}年 ${month + 1}月`;
        calendarBody.innerHTML = ''; // Clear previous calendar

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let date = 1;
        let totalMonthlyHours = 0;
        let weeklyHoursArray = new Array(6).fill(0);

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDay || date > daysInMonth) {
                    // Render empty cells
                } else {
                    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    cell.dataset.date = fullDate;

                    // Highlight logic
                    if (fullDate === highlightDate) {
                        cell.classList.add('highlight');
                    }
                    
                    // Date number display
                    const dateDiv = document.createElement('div');
                    dateDiv.className = 'date';
                    dateDiv.textContent = date;
                    cell.appendChild(dateDiv);

                    // --- Your existing logic for calculating and displaying hours ---
                    const dayData = workData[fullDate];
                    let dailyHours = 0;
                    if (dayData && dayData.checkIn && dayData.checkOut) {
                        const checkInTime = new Date(`1970-01-01T${dayData.checkIn}`);
                        const checkOutTime = new Date(`1970-01-01T${dayData.checkOut}`);
                        const rest = parseFloat(dayData.restHours) || 0;
                        dailyHours = (checkOutTime - checkInTime) / (1000 * 60 * 60) - rest;
                        if (dailyHours < 0) dailyHours = 0;
                        
                        totalMonthlyHours += dailyHours;
                        weeklyHoursArray[i] += dailyHours;
                    }

                    const hoursInfoDiv = document.createElement('div');
                    hoursInfoDiv.className = 'hours-info';
                    
                    const dailyHoursSpan = document.createElement('span');
                    dailyHoursSpan.textContent = `日計: ${dailyHours.toFixed(2)}h`;

                    /* --- MODIFIED SECTION --- */
                    // This block applies color based on the working hours.
                    if (dailyHours > 5) {
                        dailyHoursSpan.className = 'red-text';    // Greater than 5 hours
                    } else if (dailyHours > 0) {
                        dailyHoursSpan.className = 'blue-text';   // Less than 5 hours (but more than 0)
                    } else {
                        dailyHoursSpan.className = 'green-text';  // Exactly 0 hours
                    }
                    /* --- END MODIFIED SECTION --- */

                    const weeklyHoursSpan = document.createElement('span');
                    const currentWeekHours = weeklyHoursArray[i];
                    weeklyHoursSpan.textContent = `週計: ${currentWeekHours.toFixed(2)}h`;
                    weeklyHoursSpan.className = currentWeekHours > 28 ? 'red-text' : 'blue-text';

                    hoursInfoDiv.appendChild(dailyHoursSpan);
                    hoursInfoDiv.appendChild(document.createElement('br'));
                    hoursInfoDiv.appendChild(weeklyHoursSpan);
                    cell.appendChild(hoursInfoDiv);
                    // --- End of hours logic ---

                    cell.addEventListener('click', () => {
                        window.location.href = `details.html?date=${fullDate}`;
                    });
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
            if (date > daysInMonth) break;
        }
        totalMonthlyHoursElement.textContent = totalMonthlyHours.toFixed(2);
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    goToDateButton.addEventListener('click', () => {
        const selectedDateStr = dateInput.value;
        if (!selectedDateStr) {
            alert('Please select a date first.');
            return;
        }

        currentDate = new Date(selectedDateStr + 'T00:00:00');
        
        renderCalendar(selectedDateStr);
    });

    // Initial render on page load
    renderCalendar();
});