const todoList = [];

function addTodo() {
    const todoInput = document.querySelector('.todo-input');
    
    if (todoInput.value !== '') todoList.push(todoInput.value);
    showAllTodos();
    todoInput.value = '';
}

function showAllTodos() {
    let todoListHTML = '';
    
    for (let i = 0; i < todoList.length; i++) {
        const todoItem = todoList[i];
        let html = `<p>${todoItem}</p>`;
        todoListHTML += html;
    }

    document.querySelector('.js-todo-list').innerHTML = todoListHTML;
}

function handleInputEventListener(event) {
    if (event.key === 'Enter') addTodo();
}