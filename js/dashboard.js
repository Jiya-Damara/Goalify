document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("signedInUser");
  const email = localStorage.getItem("userEmail");

  if (!username || !email) {
    // Redirect to login if not logged in
    window.location.href = "index.html";
  }

  document.getElementById("username-display").innerText = username;
  document.getElementById("email-display").innerText = email;
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.clear();  // or remove only specific keys
    window.location.href = "index.html";
  }
});

const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        const doneClass = event.done ? 'done' : '';
        events += `<div class="event ${doneClass}" data-title="${event.title}">
            <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
                <span class="time-display">${event.time}</span>
                <div class="event-actions">
                    <button class="edit material-symbols-outlined">edit</button>
                    <button class="done material-symbols-outlined">done</button>
                    <button class="delete material-symbols-outlined">delete</button>
                </div>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle.trim() === "" || eventTimeFrom.trim() === "" || eventTimeTo.trim() === "") {
    alert("Please fill all the fields");
    return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Event already added");
    return;
  }

  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
    done: false
};

  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

// Handle Done, Edit and Delete in goal events (like TODO)
eventsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const parentEvent = button.closest('.event');
    if (!parentEvent) return;

    const eventTitle = parentEvent.getAttribute('data-title');

    // Find the event in array
    let targetEvent = null;
    let targetDayObj = null;
    
    eventsArr.forEach((dayObj) => {
        if (
            dayObj.day === activeDay &&
            dayObj.month === month + 1 &&
            dayObj.year === year
        ) {
            dayObj.events.forEach(ev => {
                if (ev.title === eventTitle) {
                    targetEvent = ev;
                    targetDayObj = dayObj;
                }
            });
        }
    });

    if (!targetEvent) return;

    // Edit event
    if (button.classList.contains('edit')) {
        const titleEl = parentEvent.querySelector('.event-title');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = targetEvent.title;
        input.style.cssText = 'width: 100%; background: transparent; border: none; outline: none; font-size: 14px; font-weight: 600; color: #333;';
        
        titleEl.replaceWith(input);
        input.focus();
        input.select();

        const saveEdit = () => {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== targetEvent.title) {
                targetEvent.title = newTitle;
                parentEvent.setAttribute('data-title', newTitle);
            }
            updateEvents(activeDay);
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
        return;
    }

    // Mark as done
    if (button.classList.contains('done')) {
        targetEvent.done = !targetEvent.done;
        parentEvent.classList.toggle('done');
        saveEvents();
        return;
    }

    // Delete event
    if (button.classList.contains('delete')) {
        targetDayObj.events = targetDayObj.events.filter(ev => ev.title !== eventTitle);
        
        if (targetDayObj.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(targetDayObj), 1);
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl && activeDayEl.classList.contains("event")) {
                activeDayEl.classList.remove("event");
            }
        }
        updateEvents(activeDay);
        return;
    }
});


//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];

  const newTodoForm = document.querySelector("#new-todo-form");

  newTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoContent = e.target.elements.content.value.trim();

if (!todoContent) {
  alert("Please enter a task!");
  return;
}

const todo = {
  content: todoContent,
  category: e.target.elements.category.value,
  deadline: e.target.elements.deadline.value,
  done: false,
  createdAt: new Date().getTime(),
};

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    e.target.reset();

    DisplayTodos();
  });
  DisplayTodos();
});

function DisplayTodos() {
  const todoList = document.querySelector("#todo-list");

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const topRow = document.createElement("div");
    topRow.classList.add("top-row");

    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const content = document.createElement("div");
    
    const bottomRow = document.createElement("div");
    bottomRow.classList.add("bottom-row");
    
    const actions = document.createElement("div");
    const edit = document.createElement("button");
    const deleteButton = document.createElement("button");
    const deadline = document.createElement("div");

    input.type = "checkbox";
    input.checked = todo.done;
    span.classList.add("bubble");

    if (todo.category) {
        switch (todo.category) {
            case 'study':
                span.classList.add('business');
                break;
            case 'college':
                span.classList.add('personal');
                break;
            case 'extra':
                span.classList.add('extra-curricular');
                break;
            case 'improvement':
                span.classList.add('improvement');
                break;
        }
    }

    content.classList.add("todo-content");
    actions.classList.add("actions");
    edit.classList.add("edit", "material-symbols-outlined");
    deleteButton.classList.add("delete", "material-symbols-outlined");
    edit.innerHTML = "edit";
    deleteButton.innerHTML = "delete";

    content.innerHTML = `<input type = "text" value = "${todo.content}" readonly>`;
    deadline.classList.add("deadline");
    deadline.innerHTML = `Deadline: ${todo.deadline}`;

    label.appendChild(input);
    label.appendChild(span);
    topRow.appendChild(label);
    topRow.appendChild(content);
    
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    bottomRow.appendChild(deadline);
    bottomRow.appendChild(actions);
    
    todoItem.appendChild(topRow);
    todoItem.appendChild(bottomRow);

    todoList.appendChild(todoItem);

    if (todo.done) {
        todoItem.classList.add("done");
    }

    input.addEventListener("click", (e) => {
      todo.done = e.target.checked;
      localStorage.setItem("todos", JSON.stringify(todos));

      if (todo.done) {
        todoItem.classList.add("done");
      } else {
        todoItem.classList.remove("done");
      }

      DisplayTodos();
    });

    edit.addEventListener("click", (e) => {
    const input = content.querySelector("input");
    if (input.readOnly) {
        input.readOnly = false;
        input.focus();
        input.select();
        edit.innerHTML = "save";
    } else {
        input.readOnly = true;
        todo.content = input.value;
        localStorage.setItem("todos", JSON.stringify(todos));
        edit.innerHTML = "edit";
    }
});

    deleteButton.addEventListener("click", (e) => {
      todos = todos.filter((t) => t != todo);
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    });
  });
}