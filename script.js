// Enhanced Phone Store Script - Local Database
// This script handles fetching, displaying, searching, and viewing details for phones from a local JSON server.
// It also manages dark mode and UI interactivity for a single-page application experience.
// This version is for a review site (no stock or buying logic).

let allPhones = []; // Store all phones globally for filtering and rendering

// ----------------------
// Dark Mode Functionality
// ----------------------
/**
 * Initializes dark mode toggle functionality.
 * - Reads saved theme from localStorage or defaults to light mode.
 * - Sets the data-theme attribute on the <html> element.
 * - Adds a click event listener to the toggle button to switch themes.
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add smooth transition effect for theme change
        html.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            html.style.transition = '';
        }, 300);
    });
}

// Initialize dark mode when DOM is loaded
// Ensures theme is set before any UI is shown
// (DOMContentLoaded is a distinct event listener)
document.addEventListener('DOMContentLoaded', initDarkMode);

// ---------------------------------------------
// Function to create a phone card element
// ---------------------------------------------
/**
 * Creates a DOM element representing a phone card with summary info.
 * Adds click and hover event listeners for interactivity.
 * @param {Object} phone - The phone object to display
 * @returns {HTMLElement} - The card element
 */
function createPhoneCard(phone) {
    const card = document.createElement('div');
    card.className = 'phone-card';
    
    // Initialize reviews array if it doesn't exist
    if (!phone.reviews) {
        phone.reviews = [];
    }
    
    // Card HTML structure with phone summary and review section
    card.innerHTML = `
        <div class="phone-image">
            <img src="${phone.image}" alt="${phone.name}" onerror="this.src='https://via.placeholder.com/300x400?text=${phone.name}'">
        </div>
        <div class="phone-info">
            <h3 class="phone-name">${phone.name}</h3>
            <div class="phone-brand">${phone.brand}</div>
            <div class="phone-rating">⭐ ${phone.rating}/5</div>  
            <div class="phone-specs">
                <span class="spec">📱 ${phone.screen}</span>
                <span class="spec">💾 ${phone.storage}</span>
                <span class="spec">📷 ${phone.camera}</span>
            </div>
        </div>
        <div class="review-section">
            <div class="reviews-header">
                <h4>Reviews (${phone.reviews.length})</h4>
                <button class="add-review-btn" onclick="toggleReviewForm(${phone.id})">Add Review</button>
            </div>
            <div class="review-form" id="reviewForm-${phone.id}" style="display: none;">
                <textarea placeholder="Write your review here..." id="reviewText-${phone.id}"></textarea>
                <div class="review-form-controls">
                    <button onclick="submitReview(${phone.id})">Submit Review</button>
                    <button onclick="toggleReviewForm(${phone.id})" class="cancel-btn">Cancel</button>
                </div>
            </div>
            <div class="reviews-list" id="reviewsList-${phone.id}">
                ${renderReviews(phone.reviews)}
            </div>
        </div>
    `;

    // Add click event to show details modal for this phone
    card.addEventListener('click', (e) => {
        // Don't trigger modal if clicking on review elements
        if (!e.target.closest('.review-section')) {
            showPhoneDetails(phone);
        }
    });

    // Add hover effects for better UX (mouseover/mouseout are distinct events)
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
 * Renders the reviews list for a phone
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
 * Shows or hides the review form for a specific phone
 * @param {number} phoneId - The ID of the phone
 */
function toggleReviewForm(phoneId) {
    const form = document.getElementById(`reviewForm-${phoneId}`);
    const textarea = document.getElementById(`reviewText-${phoneId}`);
    
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
 * Submits a new review for a phone
 * @param {number} phoneId - The ID of the phone
 */
function submitReview(phoneId) {
    const textarea = document.getElementById(`reviewText-${phoneId}`);
    const reviewText = textarea.value.trim();
    
    if (!reviewText) {
        alert('Please write a review before submitting.');
        return;
    }
    
    // Find the phone in the global array
    const phone = allPhones.find(p => p.id === phoneId);
    if (!phone) return;
    
    // Initialize reviews array if it doesn't exist
    if (!phone.reviews) {
        phone.reviews = [];
    }
    
    // Create new review object
    const newReview = {
        id: Date.now(), // Simple ID generation
        text: reviewText,
        reviewerName: 'Anonymous', // Could be enhanced with user system
        date: new Date().toISOString()
    };
    
    // Add review to phone
    phone.reviews.push(newReview);
    
    // Update the reviews list display
    const reviewsList = document.getElementById(`reviewsList-${phoneId}`);
    reviewsList.innerHTML = renderReviews(phone.reviews);
    
    // Update the reviews count in header
    const reviewsHeader = reviewsList.previousElementSibling.previousElementSibling;
    const countElement = reviewsHeader.querySelector('h4');
    countElement.textContent = `Reviews (${phone.reviews.length})`;
    
    // Hide the form and clear the textarea
    toggleReviewForm(phoneId);
    
    // Save to localStorage for persistence (since we're not updating the server)
    saveReviewsToLocalStorage();
    
    // Show success message
    alert('Review submitted successfully!');
}

// ---------------------------------------------
// Function to save reviews to localStorage
// ---------------------------------------------
/**
 * Saves all phone reviews to localStorage for persistence
 */
function saveReviewsToLocalStorage() {
    const reviewsData = {};
    allPhones.forEach(phone => {
        if (phone.reviews && phone.reviews.length > 0) {
            reviewsData[phone.id] = phone.reviews;
        }
    });
    localStorage.setItem('phoneReviews', JSON.stringify(reviewsData));
}

// ---------------------------------------------
// Function to load reviews from localStorage
// ---------------------------------------------
/**
 * Loads reviews from localStorage and applies them to phones
 */
function loadReviewsFromLocalStorage() {
    const reviewsData = localStorage.getItem('phoneReviews');
    if (reviewsData) {
        const reviews = JSON.parse(reviewsData);
        allPhones.forEach(phone => {
            if (reviews[phone.id]) {
                phone.reviews = reviews[phone.id];
            }
        });
    }
}

// ---------------------------------------------
// Function to render all phones to the page
// ---------------------------------------------
/**
 * Renders an array of phone objects as cards in the #results container.
 * @param {Array} phones - Array of phone objects to display
 */
function renderPhones(phones) {
    const results = document.getElementById('results');
    results.innerHTML = ''; // Clear previous results
    
    // Show message if no phones match the filter/search
    if (phones.length === 0) {
        results.innerHTML = '<div class="no-results">No phones found matching your search.</div>';
        return;
    }
    
    // Iterate over phones and append each card
    phones.forEach(phone => {
        results.appendChild(createPhoneCard(phone));
    });
}

// ---------------------------------------------
// Function to show detailed phone information
// ---------------------------------------------
/**
 * Displays a modal with detailed information about a phone.
 * @param {Object} phone - The phone object to show details for
 */
function showPhoneDetails(phone) {
    const details = document.getElementById('details');
    details.innerHTML = `
        <div class="details-modal">
            <div class="details-content">
                <button class="close-btn" onclick="closeDetails()">×</button>
                <div class="details-header">
                    <img src="${phone.image}" alt="${phone.name}" onerror="this.src='https://via.placeholder.com/400x500?text=${phone.name}'">
                    <div class="details-title">
                        <h2>${phone.name}</h2>
                        <div class="brand-year">${phone.brand} • ${phone.releaseYear}</div>
                        <div class="rating">⭐ ${phone.rating}/5</div>
                    </div>
                </div>
                <div class="details-body">
                    <div class="price-section">
                        <div class="price">$${phone.price.toLocaleString()}</div>
                    </div>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">📱 Display</span>
                            <span class="spec-value">${phone.screen}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">💾 Storage</span>
                            <span class="spec-value">${phone.storage}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">🧠 RAM</span>
                            <span class="spec-value">${phone.ram}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">📷 Camera</span>
                            <span class="spec-value">${phone.camera}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">🔋 Battery</span>
                            <span class="spec-value">${phone.battery}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">⚡ Processor</span>
                            <span class="spec-value">${phone.processor}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">🖥️ OS</span>
                            <span class="spec-value">${phone.os}</span>
                        </div>
                    </div>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${phone.description}</p>
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
 * Hides the phone details modal.
 */
function closeDetails() {
    const details = document.getElementById('details');
    details.style.display = 'none';
}

// ---------------------------------------------
// Fetch phones from local JSON server
// ---------------------------------------------
/**
 * Fetches phone data from the local JSON server and renders the phone cards.
 * Handles errors if the server is not running.
 */
fetch('http://localhost:3000/phones')
    .then(response => {
        if (!response.ok) {
            throw new Error('Server not running. Please start the JSON server.');
        }
        return response.json();
    })
    .then(data => {
        allPhones = data;
        console.log(`Loaded ${allPhones.length} phones from local server`);
        
        // Load saved reviews from localStorage
        loadReviewsFromLocalStorage();
        
        renderPhones(allPhones);
    })
    .catch(error => {
        console.error('Error fetching phones:', error);
        document.getElementById('results').innerHTML = `
            <div class="error-message">
                <h3>⚠️ Server Not Running</h3>
                <p>Please start the JSON server to view phones.</p>
                <p>Run: <code>npm start</code> or use your start-server.bat file</p>
            </div>
        `;
    });

// ---------------------------------------------
// Enhanced search functionality
// ---------------------------------------------
/**
 * Filters the phone list as the user types in the search bar.
 * Listens for 'input' events on the search input field.
 * (This is a distinct event type for requirements)
 */
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    // Filter phones by name, brand, description, or processor
    const filteredPhones = allPhones.filter(phone =>
        phone.name.toLowerCase().includes(searchValue) ||
        phone.brand.toLowerCase().includes(searchValue) ||
        phone.description.toLowerCase().includes(searchValue) ||
        phone.processor.toLowerCase().includes(searchValue)
    );
    renderPhones(filteredPhones);
});

// ---------------------------------------------
// Close details modal when clicking outside
// ---------------------------------------------
/**
 * Closes the details modal if the user clicks outside the modal content.
 * Listens for 'click' events on the document.
 */
document.addEventListener('click', function(event) {
    const details = document.getElementById('details');
    // Only close if the click is directly on the overlay (not inside modal)
    if (event.target === details) {
        closeDetails();
    }
});
