// Enhanced Phone Store Script - Local Database
// This script handles fetching, displaying, searching, and viewing details for phones from a local JSON server.
// It also manages dark mode and UI interactivity for a single-page application experience.
// This version is for a review site (no stock or buying logic).

// Declare a global variable to store all phone objects fetched from the server
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
function initDarkMode() { // Define a function named initDarkMode
    const darkModeToggle = document.getElementById('darkModeToggle'); // Get the button with id 'darkModeToggle' from the HTML
    const html = document.documentElement; // Get the <html> element (the root of the document)
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light'; // Try to get the saved theme from localStorage, or use 'light' if not found
    html.setAttribute('data-theme', savedTheme); // Set the 'data-theme' attribute on the <html> element to the saved theme
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', () => { // Add a click event listener to the toggle button
        const currentTheme = html.getAttribute('data-theme'); // Get the current theme from the <html> element
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; // If the current theme is 'dark', set newTheme to 'light', otherwise 'dark'
        
        html.setAttribute('data-theme', newTheme); // Update the <html> element with the new theme
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage so it persists
        
        // Add smooth transition effect for theme change
        html.style.transition = 'all 0.3s ease'; // Set a CSS transition for smoothness
        setTimeout(() => { // Use setTimeout to remove the transition after 300 milliseconds
            html.style.transition = ''; // Remove the transition style
        }, 300); // 300 milliseconds = 0.3 seconds
    }); // End of click event listener
} // End of initDarkMode function

// Initialize dark mode when DOM is loaded
// Ensures theme is set before any UI is shown
// (DOMContentLoaded is a distinct event listener)
document.addEventListener('DOMContentLoaded', initDarkMode); // When the HTML is fully loaded, call initDarkMode

// ---------------------------------------------
// Function to create a phone card element
// ---------------------------------------------
/**
 * Creates a DOM element representing a phone card with summary info.
 * Adds click and hover event listeners for interactivity.
 * @param {Object} phone - The phone object to display
 * @returns {HTMLElement} - The card element
 */
function createPhoneCard(phone) { // Define a function that takes a phone object as a parameter
    const card = document.createElement('div'); // Create a new <div> element for the card
    card.className = 'phone-card'; // Set the class of the div to 'phone-card' for styling
    
    // Card HTML structure with phone summary
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
    `; // Use a template literal (backticks) to insert phone properties into the HTML
    // ${phone.image} means insert the value of phone.image here
    // onerror sets a placeholder image if the original fails to load

    // Add click event to show details modal for this phone
    card.addEventListener('click', (e) => { // When the card is clicked
        showPhoneDetails(phone); // Call showPhoneDetails and pass the phone object
    });

    // Add hover effects for better UX (mouseover/mouseout are distinct events)
    card.addEventListener('mouseover', () => { // When mouse is over the card
        card.style.transform = 'translateY(-5px)'; // Move the card up slightly
        card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'; // Add a stronger shadow
    });
    card.addEventListener('mouseout', () => { // When mouse leaves the card
        card.style.transform = 'translateY(0)'; // Move the card back to original position
        card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; // Restore original shadow
    });

    return card; // Return the card element
} // End of createPhoneCard function

// ---------------------------------------------
// Function to render all phones to the page
// ---------------------------------------------
/**
 * Renders an array of phone objects as cards in the #results container.
 * @param {Array} phones - Array of phone objects to display
 */
function renderPhones(phones) { // Define a function that takes an array of phones
    const results = document.getElementById('results'); // Get the element with id 'results'
    results.innerHTML = ''; // Clear previous results by setting innerHTML to an empty string
    
    // Show message if no phones match the filter/search
    if (phones.length === 0) { // If the phones array is empty
        results.innerHTML = '<div class="no-results">No phones found matching your search.</div>'; // Show a message
        return; // Exit the function
    }
    
    // Iterate over phones and append each card
    phones.forEach(phone => { // For each phone in the array
        results.appendChild(createPhoneCard(phone)); // Create a card and add it to the results
    });
} // End of renderPhones function

// ---------------------------------------------
// Function to show detailed phone information
// ---------------------------------------------
/**
 * Displays a modal with detailed information about a phone.
 * @param {Object} phone - The phone object to show details for
 */
function showPhoneDetails(phone) { // Define a function that takes a phone object
    const details = document.getElementById('details'); // Get the element with id 'details'
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
    `; // Use template literals to insert phone properties into the modal HTML
    details.style.display = 'block'; // Show the details modal by setting display to 'block'
} // End of showPhoneDetails function

// ---------------------------------------------
// Function to close details modal
// ---------------------------------------------
/**
 * Hides the phone details modal.
 */
function closeDetails() { // Define a function to close the details modal
    const details = document.getElementById('details'); // Get the element with id 'details'
    details.style.display = 'none'; // Hide the modal by setting display to 'none'
} // End of closeDetails function

// ---------------------------------------------
// Fetch phones from local JSON server
// ---------------------------------------------
/**
 * Fetches phone data from the local JSON server and renders the phone cards.
 * Handles errors if the server is not running.
 */
fetch('http://localhost:3000/phones') // Use fetch to get data from the local server
    .then(response => { // When the server responds
        if (!response.ok) { // If the response is not OK (status not 200)
            throw new Error('Server not running. Please start the JSON server.'); // Throw an error
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => { // When the data is parsed
        allPhones = data; // Store the data in the global allPhones variable
        console.log(`Loaded ${allPhones.length} phones from local server`); // Log how many phones were loaded
        
        renderPhones(allPhones); // Render all the phones on the page
    })
    .catch(error => { // If there was an error fetching the data
        console.error('Error fetching phones:', error); // Log the error to the console
        document.getElementById('results').innerHTML = `
            <div class="error-message">
                <h3>⚠️ Server Not Running</h3>
                <p>Please start the JSON server to view phones.</p>
                <p>Run: <code>npm start</code> or use your start-server.bat file</p>
            </div>
        `; // Show an error message on the page
    });

// ---------------------------------------------
// Enhanced search functionality
// ---------------------------------------------
/**
 * Filters the phone list as the user types in the search bar.
 * Listens for 'input' events on the search input field.
 * (This is a distinct event type for requirements)
 */
document.getElementById('searchInput').addEventListener('input', function() { // Get the search input and listen for input events
    const searchValue = this.value.toLowerCase(); // Get the value typed by the user and convert to lowercase
    // Filter phones by name, brand, description, or processor
    const filteredPhones = allPhones.filter(phone => // Filter the allPhones array
        phone.name.toLowerCase().includes(searchValue) || // Check if name includes the search value
        phone.brand.toLowerCase().includes(searchValue) || // Or brand
        phone.description.toLowerCase().includes(searchValue) || // Or description
        phone.processor.toLowerCase().includes(searchValue) // Or processor
    );
    renderPhones(filteredPhones); // Show only the filtered phones
});

// ---------------------------------------------
// Close details modal when clicking outside
// ---------------------------------------------
/**
 * Closes the details modal if the user clicks outside the modal content.
 * Listens for 'click' events on the document.
 */
document.addEventListener('click', function(event) { // Listen for clicks anywhere on the page
    const details = document.getElementById('details'); // Get the details modal
    // Only close if the click is directly on the overlay (not inside modal)
    if (event.target === details) { // If the clicked element is the modal overlay
        closeDetails(); // Close the modal
    }
});

// End of script.js - All code is now thoroughly commented for beginners
