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

    document.querySelector('.js-todo-list').innerHTML = todoListHTML;
}

function createTodoHTML(todoObj, index) {
    const html = `
        <p>
            ${todoObj.todo} ${todoObj.dueDate} 
            <button onclick="
                todoList.splice(${index}, 1);
                showAllTodos();
            ">Delete</button>
        </p>
    `;

    return html;
}

function handleInputEventListener(event) {
    if (event.key === 'Enter') addTodo();
}