//Api
const Api = (() => {
    const baseUrl = "http://localhost:3000";
    const path = "todos";

    const getTodos = () =>
        fetch([baseUrl, path].join("/")).then((response) => response.json());

    const deleteTodo = (id) =>
        fetch([baseUrl, path, id].join("/"), {
            method: "DELETE",
        });

    const postTodo = (todo) =>
        fetch([baseUrl, path].join("/"), {
            method: "POST",
            body: JSON.stringify(todo),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json());

    const swapTodo = (todo) => {
        todo.isCompleted = !todo.isCompleted;
        return fetch([baseUrl, path, todo.id].join("/"), {
            method: "PUT",
            body: JSON.stringify(todo),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json());
    }

    const editTodo = (todo) => {
        return fetch([baseUrl, path, todo.id].join("/"), {
            method: "PUT",
            body: JSON.stringify(todo),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json());
    }
        

    return {
        getTodos,
        deleteTodo,
        postTodo,
        swapTodo,
        editTodo
    };
})();


//View
const View = (() => {
    const domstr = {
        pendinglistsection: ".todolist__pending",
        completedlistsection: ".todolist__completed",
        pendinglist: "#pending__todos",
        completedlist: "#completed__todos",
        submitbtn: "#submit",
        inputbox: "#todolist__input",
        deletebtn: ".trash",
        swapbtn: ".arrow",
        editbtn: ".edit"
    };

    const render = (ele, tmp) => {
        ele.innerHTML = tmp;
    };
    const createPending = (arr) => {
        let tmp = "";
        arr.forEach((todo) => {
            tmp += `
            <div class ="todo__item-container" id =${todo.id}>
                <li class ="todo ${todo.isCompleted}"> ${todo.content} </li>
                <svg class = "edit" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                <svg class ="trash" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                <svg class = "arrow" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
            </div>
            `;
        });
        return tmp;
    };

    const createCompleted = (arr) => {
        let tmp = "";
        arr.forEach((todo) => {
            tmp += `
            <div class ="todo__item-container" id =${todo.id}>
                <svg class ="arrow" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIcon" aria-label="fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                <li class ="todo ${todo.isCompleted}"> ${todo.content} </li>
                <svg class = "edit" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                <svg class ="trash" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </div>
            `;
        });
        return tmp;
    };
    return {
        render,
        createPending,
        createCompleted,
        domstr,
    };
})();


//Model
const Model = ((api, view) => {
    class Todo {
        constructor(content) {
            this.content = content;
            this.isCompleted = false;
        }
    }

    class State {
        #pendinglist = [];
        #completedlist = [];

        get pendinglist() {
            return this.#pendinglist;
        }
        set pendinglist(newtodos) {
            this.#pendinglist = [...newtodos];
            const container = document.querySelector(view.domstr.pendinglist);
            const tmp = view.createPending(this.#pendinglist);
            view.render(container, tmp);
        }

        get completedlist() {
            return this.#completedlist;
        }
        set completedlist(newtodos) {
            this.#completedlist = [...newtodos];
            const container = document.querySelector(view.domstr.completedlist);
            const tmp = view.createCompleted(this.#completedlist);
            view.render(container, tmp);
        }
    }

    const getTodos = api.getTodos;
    const deleteTodo = api.deleteTodo;
    const postTodo = api.postTodo;
    const swapTodo = api.swapTodo;
    const editTodo = api.editTodo;

    return {
        getTodos,
        deleteTodo,
        postTodo,
        swapTodo,
        editTodo,
        State,
        Todo,
    };
})(Api, View);


//Controller
const Controller = ((model, view) => {
    const state = new model.State();

    const postTodo = () => {
        const submit = document.querySelector(view.domstr.submitbtn);
        const inputbox = document.querySelector(view.domstr.inputbox);
        submit.addEventListener('click', () => {
            if (inputbox.value.length > 0) {
                const newtodo = new model.Todo(inputbox.value);
                model.postTodo(newtodo).then((todo) => {
                    state.pendinglist = [todo, ...state.pendinglist];
                });
            inputbox.value = ""
            }
        })
    };

    const swapTodo = () => {
        const pendingSection = document.querySelector(view.domstr.pendinglistsection);
        const completedSection = document.querySelector(view.domstr.completedlistsection);
        const pendingList = document.querySelector(view.domstr.pendinglist);
        const completedList = document.querySelector(view.domstr.completedlist);

        pendingSection.addEventListener('click', (event) => {
            const item = event.target;
            const parent = item.parentElement;
            if (item.classList[0] === "arrow" && !(item.parentElement.classList.contains('editing'))) {
                const todoItem = `
                            <svg class ="arrow" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIcon" aria-label="fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                            <li class ="todo true"> ${parent.childNodes[1].innerHTML} </li>
                            <svg class = "edit" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                            <svg class ="trash" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                        `;
                let tmp = document.createElement("div");
                tmp.setAttribute("class", "todo__item-container");
                tmp.setAttribute("id", parent.id)
                tmp.innerHTML = todoItem;


                //update database and #private lists
                const todo = state.pendinglist.filter(
                    (todo) => +todo.id === +parent.id
                )
                model.swapTodo(todo[0]).then(() => init());

                parent.remove();
                completedList.appendChild(tmp);
            }
        });

        completedSection.addEventListener('click', (event) => {
            const item = event.target;
            const parent = item.parentElement;
            if (item.classList[0] === "arrow" && !(item.parentElement.classList.contains('editing'))) {
                const todoItem = `
                            <li class ="todo true"> ${parent.childNodes[3].innerHTML} </li>
                            <svg class = "edit" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                            <svg class ="trash" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                            <svg class = "arrow" width ="50px" fill ="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                        `;
                let tmp = document.createElement("div");
                tmp.setAttribute("class", "todo__item-container");
                tmp.setAttribute("id", parent.id);
                tmp.innerHTML = todoItem;


                //update database and #private lists
                const todo = state.completedlist.filter(
                    (todo) => +todo.id === +parent.id
                )
                model.swapTodo(todo[0]).then(() => init());

                parent.remove();
                pendingList.appendChild(tmp);
            }
        });
    }

    const editTodo = () => {
        const pendingSection = document.querySelector(view.domstr.pendinglistsection);
        const completedSection = document.querySelector(view.domstr.completedlistsection);

        pendingSection.addEventListener('click', (event) => {
            const item = event.target;
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

                //update database and #private lists
                const todo = state.pendinglist.filter(
                    (todo) => +todo.id === +parent.id
                )
                todo[0].content = parent.childNodes[1].value;
                        
                model.editTodo(todo[0]).then(() => init());

                parent.replaceChild(li, parent.childNodes[1]);
                parent.classList.toggle('editing');
            }
        })

        completedSection.addEventListener('click', (event) => {
            const item = event.target;
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

                //update database and #private lists
                const todo = state.completedlist.filter(
                    (todo) => +todo.id === +parent.id
                )
                todo[0].content = parent.childNodes[3].value;
                        
                model.editTodo(todo[0]).then(() => init());

                parent.replaceChild(li, parent.childNodes[3]);
                parent.classList.toggle('editing');
            }
        })
    }

    const deleteTodo = () => {
        const pendingSection = document.querySelector(view.domstr.pendinglistsection);
        const completedSection = document.querySelector(view.domstr.completedlistsection);
    
        pendingSection.addEventListener('click', (event) => {
            const item = event.target;

            if (item.classList[0] === "trash") {
                item.parentElement.remove();
                model.deleteTodo(item.parentElement.id);
                state.pendinglist = state.pendinglist.filter(
                    (todo) => +todo.id !== +item.parentElement.id
                );
            }
        });

        completedSection.addEventListener('click', (event) => {
            const item = event.target;

            if (item.classList[0] === "trash") {
                item.parentElement.remove();
                model.deleteTodo(item.parentElement.id);
                state.completedlist = state.completedlist.filter(
                    (todo) => +todo.id !== +item.parentElement.id
                );
            }
        });
    };

    const init = () => {
        model.getTodos().then((data) => {
            const Completed = [];
            const Pending = [];

            data.forEach(todo => {
                console.log(todo.isCompleted);
                if (todo.isCompleted) {
                    Completed.push(todo);
                } else {
                    Pending.push(todo);
                }
            })

            state.completedlist = Completed;
            state.pendinglist = Pending; 
            console.log("completed list:", state.completedlist)   
            console.log("pending list:", state.pendinglist)
        });
    };

    const bootstrap = () => {
        init();
        deleteTodo();
        postTodo();
        swapTodo();
        editTodo();
    };

    return { bootstrap };
})(Model, View);

Controller.bootstrap();
