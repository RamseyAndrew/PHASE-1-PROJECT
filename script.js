// Enhanced Phone Store Script - Local Database
// This script handles fetching, displaying, searching, and viewing details for phones from a local JSON server.
// It also manages dark mode and UI interactivity for a single-page application experience.

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
    
    // Determine stock status and class for styling
    const stockStatus = phone.stock > 10 ? 'In Stock' : 
                       phone.stock > 0 ? 'Low Stock' : 'Out of Stock';
    const stockClass = phone.stock > 10 ? 'in-stock' : 
                      phone.stock > 0 ? 'low-stock' : 'out-of-stock';
    
    // Card HTML structure with phone summary
    card.innerHTML = `
        <div class="phone-image">
            <img src="${phone.image}" alt="${phone.name}" onerror="this.src='https://via.placeholder.com/300x400?text=${phone.name}'">
        </div>
        <div class="phone-info">
            <h3 class="phone-name">${phone.name}</h3>
            <div class="phone-brand">${phone.brand}</div>
            <div class="phone-rating">⭐ ${phone.rating}/5</div>
            <div class="phone-price">$${phone.price.toLocaleString()}</div>
            <div class="phone-specs">
                <span class="spec">📱 ${phone.screen}</span>
                <span class="spec">💾 ${phone.storage}</span>
                <span class="spec">📷 ${phone.camera}</span>
            </div>
            <div class="phone-stock ${stockClass}">${stockStatus} (${phone.stock})</div>
        </div>
    `;

    // Add click event to show details modal for this phone
    card.addEventListener('click', () => {
        showPhoneDetails(phone);
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
    // Determine stock status and class for styling
    const stockStatus = phone.stock > 10 ? 'In Stock' : 
                       phone.stock > 0 ? 'Low Stock' : 'Out of Stock';
    const stockClass = phone.stock > 10 ? 'in-stock' : 
                      phone.stock > 0 ? 'low-stock' : 'out-of-stock';
    
    // Modal HTML structure with all phone details
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
                        <div class="stock ${stockClass}">${stockStatus} (${phone.stock} available)</div>
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
    
    details.style.display = 'block'; // Show the modal
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
