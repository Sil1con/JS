const todoList = [];

function addTodo() {
    const todoInput = document.querySelector('.todo-input');
    const todoDueDate = document.querySelector('.due-date');
    
    const todoObj = {todo: todoInput.value, dueDate: todoDueDate.value};

    if (todoInput.value !== '' && todoDueDate.value !== '') {
        todoList.push(todoObj);
    }
    showAllTodos();
    todoInput.value = '';
}

function showAllTodos() {
    let todoListHTML = '';
    
    for (let i = 0; i < todoList.length; i++) {
        const todoObj = todoList[i];
        let html = createTodoHTML(todoObj, i);
        todoListHTML += html;
    }

    document.querySelector('.js-todo-list-grid').innerHTML = todoListHTML;
}

function createTodoHTML(todoObj, index) {
    const html = `
        <div>${todoObj.todo}</div>
        <div>${todoObj.dueDate}</div>    
        <button class="delete-btn" onclick="
            todoList.splice(${index}, 1);
            showAllTodos();
        ">Delete</button>
    `;

    return html;
}

function handleInputEventListener(event) {
    if (event.key === 'Enter') addTodo();
}