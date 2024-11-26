const blogsContainer = document.getElementById('blogs-container');
const newBlogForm = document.getElementById('new-blog-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const submitButton = document.getElementById('submit-btn');
const titleError = document.getElementById('title-error');
const descriptionError = document.getElementById('description-error');

const BASE_URL = 'http://localhost:4000/blogs';

const fetchBlogs = async () => {
    try {
        const response = await fetch(BASE_URL, { method: 'GET', });
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const blogs = await response.json();
        displayBlogs(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
};

const displayBlogs = (blogs) => {
    blogsContainer.innerHTML = ''; 
    blogs.forEach((blog) => {
        const blogCard = `
            <div class="blogs-card">
                <div class="details">
                    <h2>${blog.title}</h2>
                    <p>${blog.description}</p>
                </div>
                <button class="delete-btn" onclick="deleteBlog(${blog.id})">Delete</button>
            </div>
        `;
        blogsContainer.innerHTML += blogCard;
    });
};

const addBlog = async (blog) => {
    try {
        const newId = Math.floor(Math.random() * 1000).toString(); 
        const newBlog = { id: newId, ...blog };
        await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBlog),
        });
        fetchBlogs();
    } catch (error) {
        console.error('Error adding blog:', error);
    }
};

const deleteBlog = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete blog');
        await fetchBlogs(); 
    } catch (error) {
        console.error('Error deleting blog:', error);
    }
};

const validateTitle = (title) => {
    const titleRegex = /^[A-Z][a-zA-Z\s]{0,49}$/;
    if (title.length > 50) {
        titleError.textContent = 'Title must not exceed 50 characters.';
        return false;
    } else if (!titleRegex.test(title)) {
        if (/[^a-zA-Z\s]/.test(title)) {
            titleError.textContent = 'Title must contain only English letters and spaces.';
        } else if (/^[a-z]/.test(title)) {
            titleError.textContent = 'Title must start with an uppercase letter.';
        } else if (title.trim() === '') {
            titleError.textContent = 'Title cannot be empty.';
        }
        return false;
    }
    titleError.textContent = '';
    return true;
};

const validateDescription = (description) => {
    const descriptionRegex = /^[a-zA-Z\s]{0,1000}$/;
    if (description.length > 1000) {
        descriptionError.textContent = 'Description must not exceed 1000 characters.';
        return false;
    } else if (!descriptionRegex.test(description)) {
        descriptionError.textContent = 'Description must contain only English letters and spaces.';
        return false;
    } else if (description.trim() === '') {
        descriptionError.textContent = 'Description cannot be empty.';
        return false;
    }
    descriptionError.textContent = '';
    return true;
};

titleInput.addEventListener('input', () => {
    const isValidTitle = validateTitle(titleInput.value.trim());
    if (isValidTitle) {
        titleInput.classList.add('valid-border');
        titleInput.classList.remove('error-border');
    } else {
        titleInput.classList.add('error-border');
        titleInput.classList.remove('valid-border');
    }
    checkFormValidity();
});

descriptionInput.addEventListener('input', () => {
    const isValidDescription = validateDescription(descriptionInput.value.trim());
    if (isValidDescription) {
        descriptionInput.classList.add('valid-border');
        descriptionInput.classList.remove('error-border');
    } else {
        descriptionInput.classList.add('error-border');
        descriptionInput.classList.remove('valid-border');
    }
    checkFormValidity();
});

const checkFormValidity = () => {
    const isValidForm =
        validateTitle(titleInput.value.trim()) && validateDescription(descriptionInput.value.trim());
    submitButton.disabled = !isValidForm;
    if (isValidForm) {
        submitButton.classList.add('enabled-submit');
        submitButton.classList.remove('disabled-submit');
    } else {
        submitButton.classList.add('disabled-submit');
        submitButton.classList.remove('enabled-submit');
    }
};

newBlogForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    const isValidTitle = validateTitle(title);
    const isValidDescription = validateDescription(description);

    if (isValidTitle && isValidDescription) {
        addBlog({ title, description });
        newBlogForm.reset();
        titleInput.classList.remove('valid-border', 'error-border');
        descriptionInput.classList.remove('valid-border', 'error-border');
        descriptionInput.disabled = true;
        submitButton.disabled = true;
    } else {
        alert('Please correct the errors in the form.');
    }
});

fetchBlogs();



