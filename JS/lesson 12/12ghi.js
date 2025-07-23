let messages = 0;

function changeTitle() {
    if (messages === 0) document.title = 'App';
    else document.title = `(${messages}) New messages`;
}

function increaseMessages() {
    messages++;
    changeTitle();
}

function decreaseMessages() {
    if (messages !== 0) {
        document.title = `(${--messages}) New messages`;
        changeTitle();
    }
}