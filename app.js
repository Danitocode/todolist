const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#add-todo-form');
const updateBtn = document.querySelector('#update');
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

let newTitle = '';
let updateId = null;
let currentUser = null;

//Interactive buttons
function setupUI(user){
    if(user){
        loginItems.forEach(item => item.style.display = 'block');
        logoutItems.forEach(item => item.style.display = 'none');
    }else{
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'block');

    }
}

//Render li div to document
function renderList(doc){

    //Initializing list 
    let li = document.createElement('li');
    li.className = "collection-item";
    li.setAttribute('data-id', doc.id);

    //Initializing div 
    let div = document.createElement('div');

    
    //Initializing span 
    let title = document.createElement('span');
    title.textContent = doc.data().title;

    //Hiperlink attr.
    let anchor = document.createElement('a');
    anchor.href = "#modal-edit";
    anchor.className = "modal-trigger secondary-content";

    //Not italized item ;)
    let editBtn = document.createElement('i');
    editBtn.className = "material-icons";
    editBtn.innerText = "edit";

    //Initializing delete button
    let deleteBtn = document.createElement('i');
    deleteBtn.type= "button"
    deleteBtn.className = "material-icons secondary-content btn-flat";
    deleteBtn.innerText = "delete";

    //Creating DOM tree structure
    anchor.appendChild(editBtn);
    div.appendChild(title);
    div.appendChild(deleteBtn);
    div.appendChild(anchor);
    li.appendChild(div);

    //Events to delete and update edited things

    deleteBtn.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('todos').doc(id).delete();
    })

    editBtn.addEventListener('click', e => {
        updateId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
    })

    todoList.append(li);
}

//Taking the title value on the input site
updateBtn.addEventListener('click', e => {
    newTitle = document.getElementsByName('newtitle')[0].value;
    db.collection('todos').doc(updateId).update({
        title: newTitle
    })
})

//To add the new title to the firebase
form.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('todos').add({
        title: form.title.value
    })
    form.title.value = '';
})

function getTodos(){
    todoList.innnerHTML = ''
    currentUser = auth.currentUser;

    if(currentUser === null){
        todoList.innerHTML = '<h3>Please, login to get all TODOS</h3>'
    }

    db.collection('todos').orderBy('title').onSnapshot(snapshot => {

        //Initializing elements that are in firebase
        let changes = snapshot.docChanges()
    
        //Populate elements of firebase
        changes.forEach(change => {
            if (change.type == 'added') {
                renderList(change.doc);
            } else if (change.type == 'removed') {
                let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
                todoList.removeChild(li);
            } else if (change.type == 'modified') {
                let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
                li.getElementsByTagName('span')[0].textContent = newTitle;
                newTitle = '';
            }
        });
    })
}
