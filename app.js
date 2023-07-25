const { Component, mount, xml, useState } = owl;

// Book Component
class Book extends Component {
    static template = xml /* xml */ `
        <tr>
            <th scope="row"><t t-esc="props.book.id" /></th>
            <td><t t-esc="props.book.title" /></td>
            <td><t t-esc="props.book.author" /></td>
            <td><t t-esc="props.book.isbn" /></td>
            <td>
                <button class="btn btn-sm btn-warning m-1">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger m-1">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `;

    static props = ["book"];
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
                    <button type="submit" class="btn btn-primary text-right" t-on-click="addBook">
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
                    <Book book="book" />
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
        });

        this.books = useState([]);
    }

    addBook(event) {
        event.preventDefault();
        console.log("Add book CLICKED!")
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
}

mount(Root, document.getElementById("root"));