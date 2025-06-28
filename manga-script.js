// Enhanced Manga Store Script
// This script handles fetching, displaying, and searching manga from a local JSON server.
// It includes error handling, loading states, and improved user experience.

let allManga = []; // Store all manga globally for filtering and rendering

// ---------------------------------------------
// Function to create a manga card element
// ---------------------------------------------
/**
 * Creates a DOM element representing a manga card with summary info.
 * @param {Object} manga - The manga object to display
 * @returns {HTMLElement} - The card element
 */
function createMangaCard(manga) {
    const card = document.createElement('div');
    card.className = 'manga-card';
    
    // Initialize reviews array if it doesn't exist
    if (!manga.reviews) {
        manga.reviews = [];
    }
    
    card.innerHTML = `
        <div class="manga-image">
            <img src="${manga.image}" alt="${manga.title}" onerror="this.src='https://via.placeholder.com/300x400?text=${manga.title}'">
        </div>
        <div class="manga-info">
            <h3 class="manga-title">${manga.title}</h3>
            <div class="manga-author">${manga.author}</div>
            <div class="manga-rating">⭐ ${manga.rating}/5</div>
            <div class="manga-genre">${manga.genre}</div>
            <div class="manga-published">Published: ${manga.published}</div>
            <p class="manga-description">${manga.description.substring(0, 100)}${manga.description.length > 100 ? '...' : ''}</p>
        </div>
        <div class="review-section">
            <div class="reviews-header">
                <h4>Reviews (${manga.reviews.length})</h4>
                <button class="add-review-btn" onclick="toggleReviewForm(${manga.id})">Add Review</button>
            </div>
            <div class="review-form" id="reviewForm-${manga.id}" style="display: none;">
                <textarea placeholder="Write your review here..." id="reviewText-${manga.id}"></textarea>
                <div class="review-form-controls">
                    <button onclick="submitReview(${manga.id})">Submit Review</button>
                    <button onclick="toggleReviewForm(${manga.id})" class="cancel-btn">Cancel</button>
                </div>
            </div>
            <div class="reviews-list" id="reviewsList-${manga.id}">
                ${renderReviews(manga.reviews)}
            </div>
        </div>
    `;

    // Add click event to show details modal for this manga
    card.addEventListener('click', (e) => {
        // Don't trigger modal if clicking on review elements
        if (!e.target.closest('.review-section')) {
            showMangaDetails(manga);
        }
    });

    // Add hover effects for better UX
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    });

    return card;
}

// ---------------------------------------------
// Function to render reviews
// ---------------------------------------------
/**
 * Renders the reviews list for a manga
 * @param {Array} reviews - Array of review objects
 * @returns {string} - HTML string of reviews
 */
function renderReviews(reviews) {
    if (reviews.length === 0) {
        return '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
    }
    
    return reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="reviewer-name">${review.reviewerName || 'Anonymous'}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

// ---------------------------------------------
// Function to toggle review form
// ---------------------------------------------
/**
 * Shows or hides the review form for a specific manga
 * @param {number} mangaId - The ID of the manga
 */
function toggleReviewForm(mangaId) {
    const form = document.getElementById(`reviewForm-${mangaId}`);
    const textarea = document.getElementById(`reviewText-${mangaId}`);
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        textarea.focus();
    } else {
        form.style.display = 'none';
        textarea.value = '';
    }
}

// ---------------------------------------------
// Function to submit a review
// ---------------------------------------------
/**
 * Submits a new review for a manga
 * @param {number} mangaId - The ID of the manga
 */
function submitReview(mangaId) {
    const textarea = document.getElementById(`reviewText-${mangaId}`);
    const reviewText = textarea.value.trim();
    
    if (!reviewText) {
        alert('Please write a review before submitting.');
        return;
    }
    
    // Find the manga in the global array
    const manga = allManga.find(m => m.id === mangaId);
    if (!manga) return;
    
    // Initialize reviews array if it doesn't exist
    if (!manga.reviews) {
        manga.reviews = [];
    }
    
    // Create new review object
    const newReview = {
        id: Date.now(), // Simple ID generation
        text: reviewText,
        reviewerName: 'Anonymous', // Could be enhanced with user system
        date: new Date().toISOString()
    };
    
    // Add review to manga
    manga.reviews.push(newReview);
    
    // Update the reviews list display
    const reviewsList = document.getElementById(`reviewsList-${mangaId}`);
    reviewsList.innerHTML = renderReviews(manga.reviews);
    
    // Update the reviews count in header - correct DOM navigation
    const reviewsHeader = reviewsList.previousElementSibling.previousElementSibling;
    const countElement = reviewsHeader.querySelector('h4');
    countElement.textContent = `Reviews (${manga.reviews.length})`;
    
    // Hide the form and clear the textarea
    toggleReviewForm(mangaId);
    
    // Save to localStorage for persistence
    saveReviewsToLocalStorage();
    
    // Show success message
    alert('Review submitted successfully!');
}

// ---------------------------------------------
// Function to save reviews to localStorage
// ---------------------------------------------
/**
 * Saves all manga reviews to localStorage for persistence
 */
function saveReviewsToLocalStorage() {
    const reviewsData = {};
    allManga.forEach(manga => {
        if (manga.reviews && manga.reviews.length > 0) {
            reviewsData[manga.id] = manga.reviews;
        }
    });
    localStorage.setItem('mangaReviews', JSON.stringify(reviewsData));
}

// ---------------------------------------------
// Function to load reviews from localStorage
// ---------------------------------------------
/**
 * Loads reviews from localStorage and applies them to manga
 */
function loadReviewsFromLocalStorage() {
    const reviewsData = localStorage.getItem('mangaReviews');
    if (reviewsData) {
        const reviews = JSON.parse(reviewsData);
        allManga.forEach(manga => {
            if (reviews[manga.id]) {
                manga.reviews = reviews[manga.id];
            }
        });
    }
}

// ---------------------------------------------
// Function to render all manga to the page
// ---------------------------------------------
/**
 * Renders an array of manga objects as cards in the #manga-list container.
 * @param {Array} manga - Array of manga objects to display
 */
function renderManga(manga) {
    const mangaList = document.getElementById('manga-list');
    mangaList.innerHTML = ''; // Clear previous results
    
    // Show message if no manga match the filter/search
    if (manga.length === 0) {
        mangaList.innerHTML = '<div class="no-results">No manga found matching your search.</div>';
        return;
    }
    
    // Iterate over manga and append each card
    manga.forEach(mangaItem => {
        mangaList.appendChild(createMangaCard(mangaItem));
    });
}

// ---------------------------------------------
// Function to show detailed manga information
// ---------------------------------------------
/**
 * Displays a modal with detailed information about a manga.
 * @param {Object} manga - The manga object to show details for
 */
function showMangaDetails(manga) {
    const details = document.getElementById('details');
    details.innerHTML = `
        <div class="details-modal">
            <div class="details-content">
                <button class="close-btn" onclick="closeDetails()">×</button>
                <div class="details-header">
                    <img src="${manga.image}" alt="${manga.title}" onerror="this.src='https://via.placeholder.com/400x500?text=${manga.title}'">
                    <div class="details-title">
                        <h2>${manga.title}</h2>
                        <div class="author-genre">${manga.author} • ${manga.genre}</div>
                        <div class="rating">⭐ ${manga.rating}/5</div>
                    </div>
                </div>
                <div class="details-body">
                    <div class="published-section">
                        <div class="published">Published: ${manga.published}</div>
                    </div>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${manga.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    details.style.display = 'block';
}

// ---------------------------------------------
// Function to close details modal
// ---------------------------------------------
/**
 * Hides the manga details modal.
 */
function closeDetails() {
    const details = document.getElementById('details');
    details.style.display = 'none';
}

// ---------------------------------------------
// Fetch manga from local JSON server
// ---------------------------------------------
/**
 * Fetches manga data from the local JSON server and renders the manga cards.
 * Handles errors if the server is not running.
 */
function fetchManga() {
    // Show loading state
    const mangaList = document.getElementById('manga-list');
    mangaList.innerHTML = '<div class="loading">Loading manga...</div>';
    
    fetch('http://localhost:3000/Manga')
        .then(response => {
            if (!response.ok) {
                throw new Error('Server not running. Please start the JSON server.');
            }
            return response.json();
        })
        .then(data => {
            allManga = data;
            console.log(`Loaded ${allManga.length} manga from local server`);
            
            // Load saved reviews from localStorage
            loadReviewsFromLocalStorage();
            
            renderManga(allManga);
        })
        .catch(error => {
            console.error('Error fetching manga:', error);
            mangaList.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Server Not Running</h3>
                    <p>Please start the JSON server to view manga.</p>
                    <p>Run: <code>npm start</code> or use your start-server.bat file</p>
                </div>
            `;
        });
}

// ---------------------------------------------
// Search functionality
// ---------------------------------------------
/**
 * Filters the manga list as the user types in the search bar.
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            // Filter manga by title, author, genre, or description
            const filteredManga = allManga.filter(manga =>
                manga.title.toLowerCase().includes(searchValue) ||
                manga.author.toLowerCase().includes(searchValue) ||
                manga.genre.toLowerCase().includes(searchValue) ||
                manga.description.toLowerCase().includes(searchValue)
            );
            renderManga(filteredManga);
        });
    }
}

// ---------------------------------------------
// Close details modal when clicking outside
// ---------------------------------------------
/**
 * Closes the details modal if the user clicks outside the modal content.
 */
document.addEventListener('click', function(event) {
    const details = document.getElementById('details');
    if (details && event.target === details) {
        closeDetails();
    }
});

// ---------------------------------------------
// Initialize the application
// ---------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    fetchManga();
    initSearch();
}); 