'use strict';

window.addEventListener('load', initializeCalendar);


var date = new Date();
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var activeYear = date.getFullYear();
var activeMonth = date.getMonth();
var activeDay = date.getDate();

var index = activeMonth;

calendar(activeMonth, activeYear);

function initializeCalendar() {

    loadCalendar();
    loadEvents();

    document.querySelector('#prev').addEventListener('click', previousMonth);
    document.querySelector('#next').addEventListener('click', nextMonth);
    document.querySelector('#addBtn').addEventListener('click', saveEventToDB);

}

///////////////////////////////////////////////////////////////////////

function startTime() {
    var currentTime = new Date();
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();
    minute = checkTime(minute);

    document.getElementById('calendarTime').innerHTML = hour + ":" + minute;
    var t = setTimeout(startTime, 500);
}

// add zero in front of numbers < 10
function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}

/*
Add and display day name and current date on webpage
*/
function setText(id, val) {
    document.getElementById(id).innerHTML = val;
}

///////////////////////////////////////////////////////////////////////

function loadCalendar() {

    startTime();

    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    setText('calendarDay', day[date.getDay()]);

    if (date.getDate() < 10 && (date.getMonth() + 1) < 10) {
        setText('calendarDate', "0" + date.getDate() + '/' + "0" + (date.getMonth() + 1) + '/' + date.getFullYear());
    } else if (date.getDate() < 10 && (date.getMonth() + 1) > 10) {
        setText('calendarDate', "0" + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    } else if (date.getDate() > 10 && (date.getMonth() + 1) < 10) {
        setText('calendarDate', date.getDate() + '/' + "0" + (date.getMonth() + 1) + '/' + date.getFullYear());
    } else {
        setText('calendarDate', date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    }

    window.month.innerHTML = monthNames[activeMonth] + " " + activeYear;

}



/* Toggle time panel - opening/closing calendar panel*/

function toggleFullCalendar() {

    var toggleCalendar = document.getElementById('calendarContainer');
    if (toggleCalendar.style.display === 'block') {
        toggleCalendar.style.display = 'none';
    } else {
        toggleCalendar.style.display = 'block';
    }
}


function calendar(activeMonth, activeYear) {

    var weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var weekLen = weekDayNames.length;

    var firstDayOfMonth = new Date(activeYear, activeMonth, 1);
    var lastDayOfMonth = new Date(activeYear, activeMonth + 1, 0);
    var weekedaysLength = window.weekdays.children.length;
    var dayId = 1;

    // create empty li elements before first day
    for (var i = 1; i < (firstDayOfMonth.getDay()); i++) {
        var li = document.createElement("li");
        var days = document.getElementById("days");
        days.appendChild(li);
    }
    // creates number of day in a month

    for (var i = 1; i <= lastDayOfMonth.getDate(); i++) {

        var li = document.createElement("li");
        var days = document.getElementById("days");
        days.appendChild(li);
        li.id = "day" + dayId;
        dayId++;

        // TUTAJ do przerobienia

        var num = document.createTextNode(i);
        li.appendChild(num);

        if (i === activeDay) {
            li.className = "today";
        }



    }
    days.addEventListener("click", newEventPanel);
}

function updateCalendar() {
    window.month.innerHTML = monthNames[activeMonth] + " " + activeYear;
    window.days.innerHTML = " ";
}

function previousMonth() {

    window.month.innerHTML = " ";

    if (activeMonth == 0) {
        activeMonth = monthNames.length - 1;
        activeYear--;

    } else {
        activeMonth--;
    }

    updateCalendar();
    calendar(activeMonth, activeYear);
}

function nextMonth() {
    index++;

    if (activeMonth == monthNames.length - 1) {
        activeMonth = 0;
        activeYear++;
    } else {
        activeMonth++;
    }

    updateCalendar();
    calendar(activeMonth, activeYear);
}


// -------------------------------EVENTS---SCHEDULE--------------------------------

function newEventPanel(e) {



    var selectedDate = e.target.textContent;
    var selectedDateId = e.target.id;

    window.addBtn.dataset.id = selectedDateId;


    var eventPanel = document.getElementById('newEvent');
    eventPanel.classList.remove('hiddenEvent');

    var eventCancel = document.getElementById('cancelBtn');
    eventCancel.addEventListener("click", cancelBtn);

    var select = document.getElementById("selectedDateSpan");
    select.textContent = activeYear + "-" + (activeMonth + 1) + "-" + selectedDate;
}

function cancelBtn(e) {

    var elem = document.getElementById("newEvent");
        elem.classList.add('hiddenEvent');
}

function loadEvents() {


    var url = '/api/getEvents';
    var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
          if (xhr.status === 200) {
            putCalendarEventsInPage(JSON.parse(xhr.responseText)); // notes parameter

            backlight(JSON.parse(xhr.responseText));
          } else {
            document.querySelector('body > main').innerHTML = 'sorry, something went wrong...';
          }
        }
        xhr.send();




}

function putCalendarEventsInPage(events) {


  window.calendarEvent.innerHTML = "";  // niby dziala ?
    events.forEach(function(ev) {
        var section = document.createElement('section');
        var div     = document.createElement("div");
        var sHour   = document.createElement("p");
        var eHour   = document.createElement("p");
        var todo    = document.createElement("p");
        var delBtn  = document.createElement("div");

        section.id = "calendarSection";

         delBtn.className ="deleteEvent";
         delBtn.id = ev.id;
         delBtn.textContent = "X";
         sHour.textContent = "Start hour: " + ev.start_Hour;
         eHour.textContent = "End hour: " + ev.end_Hour;
         todo.textContent = "Your task: " + ev.task;

         div.appendChild(delBtn);
         div.appendChild(sHour);
         div.appendChild(eHour);
         div.appendChild(todo);
         section.appendChild(div);
         window.calendarEvent.appendChild(section);

        document.querySelector('.deleteEvent').addEventListener('click', deleteEventFromDB);
    });

}


function saveEventToDB(e) {

    var btnDayID = e.target.dataset.id;

    var newCalendarEvent = {
        id: btnDayID,
        selected_Date: window.selectedDateSpan.innerText,
        start_Hour: window.startHour.value,
        end_Hour: window.endHour.value,
        task: window.task.value
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/api/newEvent/save', true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(newCalendarEvent));


    loadEvents();
    clearTask();
}
/// musze rowniez sprawdzac miesiace nie tylko dni eh
function backlight(e) {



    var index = 0;
    e.forEach(function(ev) {
        var objectID = e[index].id;
        var li = document.getElementById(objectID);
        li.className = "clickedDay";
        index++;
    });
}

function x() {
  var j = document.querySelectorAll("#days li");
  j.forEach(function(ev) {
    if(ev.className == "clickedDay") {
      ev.classList.remove("clickedDay");
    }
  });
}

function deleteEventFromDB(e) {


  var eventDataID = e.target.id;


    if(e.target.id && window.confirm('Do you want delete this note?')) {

      var xhr = new XMLHttpRequest();

      xhr.open('DELETE', '/api/delEvent/' + eventDataID, true);
      xhr.send();

      loadEvents();

    }
}

function clearTask() {
  window.task.value = "";
}
