function fetchData() {

    fetch("data.json")
    .then((response) => {
        if (response.ok) {
        return response.json()
        } else {
            console.log("Error")
        }
    })
    .then((data) => {
        const Completed = [];
        const Pending = [];

        data.todos.forEach(todo => {
            console.log(todo);
            if (todo.isCompleted) {
                Completed.push(todo);
            } else {
                Pending.push(todo);
            }
        })

        const C = Completed.map(todo => {
                return `
                <div class ="todo__item-container">
                    <svg class ="arrow" width ="50px" fill ="#4caf50" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIcon" aria-label="fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    <li class ="todo ${todo.isCompleted}"> ${todo.content} </li>
                    <svg class = "edit" width ="50px" fill ="#008cba" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg class ="trash" width ="50px" fill ="#c94c4c" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                </div>`
        }).join("");

        const P = Pending.map(todo => {
                return `
                <div class ="todo__item-container">
                    <li class ="todo ${todo.isCompleted}"> ${todo.content} </li>
                    <svg class = "edit" width ="50px" fill ="#008cba" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg class ="trash" width ="50px" fill ="#c94c4c" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                    <svg class = "arrow" width ="50px" fill ="#4caf50"focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                </div>`
        }).join("");

        document.querySelector('#completed__todos').innerHTML = C;
        document.querySelector('#pending__todos').innerHTML = P;
    })
    .catch((error) => console.log("Error"));
}

fetchData();

const submit = document.getElementById('submit')
const inputbox = document.getElementById('todolist__input')
submit.addEventListener('click', () => {
    const todoItem = `
        <li class ="todo false"> ${inputbox.value} </li>
        <svg class = "edit" width ="50px" fill ="#008cba" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
        <svg class ="trash" width ="50px" fill ="#c94c4c" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        <svg class = "arrow" width ="50px" fill ="#4caf50"focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
    `
    let tmp = document.createElement("div");
    tmp.setAttribute("class", "todo__item-container");
    tmp.innerHTML = todoItem;
    document.querySelector('#pending__todos').appendChild(tmp);
    inputbox.value = "";
})

const completedList = document.querySelector('#completed__todos');
const pendingList = document.querySelector("#pending__todos");

completedList.addEventListener('click', deleteToDo);
pendingList.addEventListener('click', deleteToDo);

completedList.addEventListener('click', completedEditToDo);
pendingList.addEventListener('click', pendingEditToDo);

pendingList.addEventListener('click', pendingSwap);
completedList.addEventListener('click', completedSwap);

function completedEditToDo(e) {
    const item = e.target;
    console.log(item)
    if (item.classList[0] === "edit" && !(item.parentElement.classList.contains('editing'))) {
        const parent = item.parentElement;
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('todo');
        input.classList.add('false');
        input.value = parent.childNodes[3].innerHTML;
        parent.replaceChild(input, parent.childNodes[3]);
        parent.classList.toggle('editing');
    } else if (item.classList[0] === "edit" && item.parentElement.classList.contains('editing')) {
        const parent = item.parentElement;
        const li = document.createElement('li');
        li.classList.add('todo');
        li.classList.add('false');
        li.innerHTML = parent.childNodes[3].value;
        parent.replaceChild(li, parent.childNodes[3]);
        parent.classList.toggle('editing');
    }
}

function pendingEditToDo(e) {
    const item = e.target;
    if (item.classList[0] === "edit" && !(item.parentElement.classList.contains('editing'))) {
        const parent = item.parentElement;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = parent.childNodes[1].innerHTML;
        input.classList.add('todo');
        input.classList.add('false');
        parent.replaceChild(input, parent.childNodes[1]);
        parent.classList.toggle('editing');
    } else if (item.classList[0] === "edit" && item.parentElement.classList.contains('editing')) {
        const parent = item.parentElement;
        const li = document.createElement('li');
        li.classList.add('todo');
        li.classList.add('false');
        li.innerHTML = parent.childNodes[1].value;
        parent.replaceChild(li, parent.childNodes[1]);
        parent.classList.toggle('editing');
    }
}

function completedSwap(e) {
    const item = e.target;
    const parent = item.parentElement;
    if (item.classList[0] === "arrow" && !(item.parentElement.classList.contains('editing'))) {
        parent.remove();
        const todoItem = `
                    <li class ="todo true"> ${parent.childNodes[3].innerHTML} </li>
                    <svg class = "edit" width ="50px" fill ="#008cba" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg class ="trash" width ="50px" fill ="#c94c4c" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                    <svg class = "arrow" width ="50px" fill ="#4caf50"focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                `;
        let tmp = document.createElement("div");
        tmp.setAttribute("class", "todo__item-container");
        tmp.innerHTML = todoItem;
        pendingList.appendChild(tmp)
    }
}

function pendingSwap(e) {
    const item = e.target;
    const parent = item.parentElement;
    if (item.classList[0] === "arrow" && !(item.parentElement.classList.contains('editing'))) {
        parent.remove();
        const todoItem = `
                    <svg class ="arrow" width ="50px" fill ="#4caf50" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIcon" aria-label="fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    <li class ="todo true"> ${parent.childNodes[1].innerHTML} </li>
                    <svg class = "edit" width ="50px" fill ="#008cba" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg class ="trash" width ="50px" fill ="#c94c4c" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                `;
        let tmp = document.createElement("div");
        tmp.setAttribute("class", "todo__item-container");
        tmp.innerHTML = todoItem;
        completedList.appendChild(tmp);
    }
}

function deleteToDo(e) {
    const item = e.target;
    if (item.classList[0] === "trash") {
        item.parentElement.remove();
    }
}
