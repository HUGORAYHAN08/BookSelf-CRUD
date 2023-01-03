const dataBook = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'book_APPS';

//local penyimpanan 

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(dataBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const loadDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (data !== null) {
        for (const item of data) {
            dataBook.push(item);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
};


// logic
const makeId = () => {
    return +new Date();
}

const TodoObject = (id, judul, penulis, tahun, isCompleted) => {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted
    }
}

const addBook = () => {
    const makeJudul = document.getElementById('inputBookTitle').value;
    const makePenulis = document.getElementById('inputBookAuthor').value;
    const makeTahun = document.getElementById('inputBookYear').value;
    const makeStatus = document.getElementById('inputBookIsComplete');
    let status;
    if (makeStatus.checked) {
        status = true;
    } else {
        status = false;
    }
    const MakeID = makeId();
    const todoObject = TodoObject(MakeID, makeJudul, makePenulis, makeTahun, status);
    dataBook.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        addBook();
    })
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

// view data
const findBook = (BookId) => {
    for (const bookSItem of dataBook) {
        if (bookSItem.id === BookId) {
            return bookSItem;
        }
    }
}
const findBookIndex = (bookId) => {
    for (const index in dataBook) {
        if (dataBook[index].id === bookId) {
            return index;
        }
    }
    return -1
}

const addText = (BookId) => {
    const bookTarget = findBook(BookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undoText = (BookId) => {
    const bookTarget = findBook(BookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const removeText = (BookId) => {
    const bookTarget = findBookIndex(BookId);

    if (bookTarget === -1) return;
    dataBook.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const MakeBook = (BookObject) => {
    const textJudul = document.createElement('h3');
    textJudul.innerText = BookObject.judul;

    const textPenulis = document.createElement('h4');
    textPenulis.innerText = `${BookObject.penulis}   (${BookObject.tahun})`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(textJudul, textPenulis);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${BookObject.id}`);

    if (BookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoText(BookObject.id);
        })

        const removeButton = document.createElement('button');
        removeButton.classList.add('trash-button');

        removeButton.addEventListener('click', function () {
            removeText(BookObject.id);
        })
        container.append(undoButton, removeButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addText(BookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('trash-button');

        removeButton.addEventListener('click', function () {
            removeText(BookObject.id);
        });

        container.append(checkButton, removeButton);
    }
    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(dataBook);
    const completeTextBook = document.getElementById('incompleteBookshelfList');
    completeTextBook.innerHTML = '';

    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';

    for (const bookSItem of dataBook) {
        const bookElement = MakeBook(bookSItem);
        if (!bookSItem.isCompleted) {
            completeTextBook.append(bookElement);
        } else {
            completeBook.append(bookElement);
        }
    }
});

