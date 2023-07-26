const { Component, mount, xml, useState } = owl;

// Book Component
class Book extends Component {
    static template = xml /* xml */ `
        <tr>
            <th scope="row"><t t-esc="props.book.id" /></th>
            <td>
                <input t-if="state.isEditing" type="text" class="form-control" 
                    aria-describedby="titleHelp" t-model="state.title"/>
                <t t-if="!state.isEditing" t-esc="props.book.title" />
            </td>
            <td>
                <input t-if="state.isEditing" type="text" class="form-control" 
                    aria-describedby="titleHelp" t-model="state.author"/>
                <t t-if="!state.isEditing" t-esc="props.book.author" />
            </td>
            <td>
                <input t-if="state.isEditing" type="text" class="form-control" 
                    aria-describedby="titleHelp" t-model="state.isbn"/>
                <t t-if="!state.isEditing" t-esc="props.book.isbn" />
            </td>
            <td>
                <button t-if="state.isEditing" class="btn btn-sm btn-info m-1"
                    t-on-click="saveBook">
                    <i class="bi bi-save"></i>
                </button>
                <button t-if="!state.isEditing" class="btn btn-sm btn-warning m-1"
                    t-on-click="editBook">
                    <i class="bi bi-pencil"></i>
                </button>
                <button t-if="state.isEditing" class="btn btn-sm btn-secondary m-1"
                    t-on-click="cancelBook">
                    <i class="bi bi-x"></i>
                </button>
                <button t-if="!state.isEditing" class="btn btn-sm btn-danger m-1"
                    t-on-click="deleteBook">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `;

    static props = ["book", "onDelete", "onEdit"];

    setup() {
        this.state = useState({
            isEditing: false,
            id: this.props.book.id,
            title: this.props.book.title,
            author: this.props.book.author,
            isbn: this.props.book.isbn,
        })
    }

    editBook() {
        this.state.isEditing = true;
    }

    saveBook() {
        this.state.isEditing = false;

        // validate fields
        if(!this.state.title || !this.state.author || !this.state.isbn) {
            alert("All fields are required!");
            this.state.isEditing = true;
            return
        } else {
            this.props.onEdit(this.state);
        }

    }

    deleteBook() {
        this.props.onDelete(this.props.book);
    }

    cancelBook() {
        this.state.isEditing = false;
        this.state.title = this.props.book.title
        this.state.author = this.props.book.author
        this.state.isbn = this.props.book.isbn
    }
}

// Root Component
class Root extends Component {
    static template = xml /* xml */ `
        <div class="mb-5">
            <form>
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" 
                        aria-describedby="titleHelp" t-model="state.title"/>
                </div>
                <div class="mb-3">
                    <label for="author" class="form-label">Author</label>
                    <input type="text" class="form-control" id="author" 
                        aria-describedby="authorHelp" t-model="state.author"/>
                </div>
                <div class="mb-3">
                    <label for="isbn" class="form-label">ISBN</label>
                    <input type="text" class="form-control" id="isbn" 
                        aria-describedby="isbnHelp" t-model="state.isbn"/>
                </div>
                <div class="mb-3 text-end">
                    <button type="submit" class="btn btn-primary text-right" 
                        t-on-click="addBook">
                        <i class="bi bi-plus"></i> Add Book
                    </button>
                </div>
            </form>
        </div>
        <!-- Table -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">ISBN</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <t t-foreach="books" t-as="book" t-key="book.id">
                    <Book book="book" onDelete.bind="deleteBook"
                        onEdit.bind="editBook" />
                </t>
            </tbody>
        </table>
    `;

    static components = { Book };

    setup() {
        this.state = useState({
            title: "",
            author: "",
            isbn: "",
            isEditing: false,
        });

        this.books = useState([]);
    }

    // Add book
    addBook(event) {
        // Prevent reloading when submitting the form
        event.preventDefault();
        
        // validate fields
        if(!this.state.title || !this.state.author || !this.state.isbn) {
            alert("All fields are required!");
            return
        }

        // random unique id
        const id = Math.random().toString().substring(2,7);

        // add new book
        this.books.push({
            id,
            title: this.state.title,
            author: this.state.author,
            isbn: this.state.isbn,
        });

        // reset states after saving
        this.state.title = ""
        this.state.author = ""
        this.state.isbn = ""
    }

    // Edit book
    editBook(book) {
        const index = this.books.findIndex((b) => b.id === book.id);
        this.books.splice(index, 1, book)
    }

    // Delete book
    deleteBook(book) {
        const index = this.books.findIndex(b => b.id === book.id);
        this.books.splice(index, 1);
    }
}

mount(Root, document.getElementById("root"));