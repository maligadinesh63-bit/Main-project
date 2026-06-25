let selectedDay = "Monday";

let plannerData = JSON.parse(localStorage.getItem("weeklyPlanner")) || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

function savePlanner() {
    localStorage.setItem("weeklyPlanner", JSON.stringify(plannerData));
}

function formatDateTime() {
    let now = new Date();
    return now.toLocaleString();
}

function selectDay(day) {
    selectedDay = day;
    document.getElementById("selectedDayTitle").textContent = day + " Planner";

    document.querySelectorAll(".day-list li").forEach(li => {
        li.classList.remove("active-day");
    });
    document.getElementById("day-" + day).classList.add("active-day");

    renderTasks();
}

function updateStats() {
    let tasks = plannerData[selectedDay];
    let total = tasks.length;
    let completed = tasks.filter(task => task.done).length;
    let pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("emptyMessage").style.display = total === 0 ? "block" : "none";
}

function renderTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let tasks = plannerData[selectedDay];

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        let leftDiv = document.createElement("div");
        leftDiv.classList.add("task-left");

        let taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.classList.add("task-text");
        if (task.done) taskText.classList.add("completed");

        let taskTime = document.createElement("span");
        taskTime.textContent = task.time;
        taskTime.classList.add("task-time");

        leftDiv.appendChild(taskText);
        leftDiv.appendChild(taskTime);

        let buttonDiv = document.createElement("div");
        buttonDiv.classList.add("task-buttons");

        let completeBtn = document.createElement("button");
        completeBtn.textContent = task.done ? "Undo" : "Done";
        completeBtn.classList.add("complete-btn");
        completeBtn.onclick = function() {
            plannerData[selectedDay][index].done = !plannerData[selectedDay][index].done;
            savePlanner();
            renderTasks();
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function() {
            plannerData[selectedDay].splice(index, 1);
            savePlanner();
            renderTasks();
        };

        buttonDiv.appendChild(completeBtn);
        buttonDiv.appendChild(deleteBtn);

        li.appendChild(leftDiv);
        li.appendChild(buttonDiv);

        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    plannerData[selectedDay].push({
        text: taskText,
        time: formatDateTime(),
        done: false
    });

    taskInput.value = "";
    savePlanner();
    renderTasks();
}

selectDay("Monday");