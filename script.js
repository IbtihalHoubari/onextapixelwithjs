const blogsContainer = document.getElementById('blogs-container');
const newBlogForm = document.getElementById('new-blog-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');

const BASE_URL = 'http://localhost:4000/blogs';

const fetchBlogs = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const blogs = await response.json();
        console.log('Blogs fetched:', blogs);
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
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blog),
        });
        if (!response.ok) throw new Error('Failed to add blog');
        await fetchBlogs(); 
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

const validateInputs = (title, description) => {
    const titleRegex = /^[A-Z][a-zA-Z\s]{0,49}$/;
    const descriptionRegex = /^[a-zA-Z\s]{0,999}$/;

    if (!titleRegex.test(title)) {
        alert('Invalid title. Use English letters, less than 50 characters, start with a capital letter.');
        return false;
    }
    if (!descriptionRegex.test(description)) {
        alert('Invalid description. Use English letters, less than 1000 characters.');
        return false;
    }
    return true;
};

newBlogForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (validateInputs(title, description)) {
        addBlog({ title, description }); 
        newBlogForm.reset(); 
    }
});

fetchBlogs();



