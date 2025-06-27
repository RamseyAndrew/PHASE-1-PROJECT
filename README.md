# 📱 Phone Store - Interactive Review Platform

A modern, responsive web application for browsing and reviewing smartphones. Built with vanilla JavaScript, CSS3, and HTML5, featuring a local JSON server backend for data management.

![Phone Store Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Dark/Light Mode Toggle** - Seamless theme switching with localStorage persistence
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Hover effects, transitions, and interactive elements
- **Card-based Layout** - Clean, modern phone card design with rounded corners

### 🔍 **Smart Search & Filtering**
- **Real-time Search** - Instant filtering as you type
- **Multi-field Search** - Search by phone name, brand, description, or processor
- **Dynamic Results** - Live updates without page refresh

### 📱 **Phone Information Display**
- **Comprehensive Details** - Full specifications including RAM, storage, camera, battery
- **High-quality Images** - Professional phone images with fallback placeholders
- **Rating System** - Star ratings for each phone
- **Modal Details View** - Click any phone for detailed specifications

### 💬 **Interactive Review System**
- **User Reviews** - Add written reviews to any phone
- **Review Management** - View, add, and manage reviews per phone
- **Local Storage** - Reviews persist between sessions
- **Review Counter** - Track number of reviews per phone
- **Timestamp Display** - Shows when reviews were posted

### 🛠 **Technical Features**
- **Local JSON Server** - RESTful API for data management
- **Error Handling** - Graceful handling of server issues
- **Performance Optimized** - Efficient DOM manipulation and event handling
- **Cross-browser Compatible** - Works on all modern browsers

## 🚀 Quick Start

### Prerequisites
- Node.js (for JSON server)
- Modern web browser
- Git (for cloning)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:RamseyAndrew/PHASE-1-PROJECT.git
   cd phone-store
   ```

2. **Install JSON Server** (if not already installed)
   ```bash
   npm install -g json-server
   ```

3. **Start the JSON Server**
   ```bash
   # Option 1: Using the provided batch file (Windows)
   start-server.bat
   
   # Option 2: Using npm command
   json-server --watch db.json
   ```

4. **Open the Application**
   - Open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```

5. **Access the Application**
   - Navigate to `http://localhost:3000` (JSON server)
   - Open `index.html` in your browser

## 📁 Project Structure

```
phone-store/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with dark mode support
├── script.js           # JavaScript functionality
├── db.json             # JSON database with phone data
├── start-server.bat    # Windows batch file to start server
└── README.md           # This file
```

## 🎯 Core Functionality

### Phone Display
- **Card Layout**: Each phone displayed in an interactive card
- **Image Gallery**: High-quality phone images with error handling
- **Specifications**: Key specs displayed on each card
- **Click Interaction**: Click cards to view detailed information

### Search System
```javascript
// Real-time search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const filteredPhones = allPhones.filter(phone =>
        phone.name.toLowerCase().includes(searchValue) ||
        phone.brand.toLowerCase().includes(searchValue) ||
        phone.description.toLowerCase().includes(searchValue) ||
        phone.processor.toLowerCase().includes(searchValue)
    );
    renderPhones(filteredPhones);
});
```

### Review System
```javascript
// Add review functionality
function submitReview(phoneId) {
    const reviewText = document.getElementById(`reviewText-${phoneId}`).value.trim();
    if (!reviewText) {
        alert('Please write a review before submitting.');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        text: reviewText,
        reviewerName: 'Anonymous',
        date: new Date().toISOString()
    };
    
    // Add to phone reviews and save to localStorage
    phone.reviews.push(newReview);
    saveReviewsToLocalStorage();
}
```

### Dark Mode Implementation
```css
/* CSS Variables for theming */
:root {
    --bg-primary: #f5f5dc;
    --bg-secondary: #ffffff;
    --text-primary: #333333;
    /* ... more variables */
}

[data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    /* ... dark theme variables */
}
```

## 📊 Data Structure

### Phone Object
```json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "brand": "Apple",
  "image": "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg",
  "price": 1199,
  "ram": "8GB",
  "storage": "256GB",
  "camera": "48MP Triple",
  "battery": "4441mAh",
  "screen": "6.7\" OLED",
  "rating": 4.8,
  "releaseYear": 2023,
  "os": "iOS 17",
  "processor": "Apple A17 Pro",
  "description": "The iPhone 15 Pro Max features...",
  "reviews": []
}
```

### Review Object
```json
{
  "id": 1703123456789,
  "text": "Amazing phone with great camera!",
  "reviewerName": "Anonymous",
  "date": "2023-12-21T10:30:45.123Z"
}
```

## 🎨 Design Features

### Color Scheme
- **Light Mode**: Clean whites and beiges with blue accents
- **Dark Mode**: Deep grays and blacks with blue highlights
- **Responsive**: Smooth transitions between themes

### Typography
- **Font Family**: Arial, Helvetica, sans-serif
- **Hierarchy**: Clear heading structure (h1-h4)
- **Readability**: Optimized line heights and spacing

### Layout
- **Grid System**: Flexbox-based responsive layout
- **Card Design**: Rounded corners with subtle shadows
- **Spacing**: Consistent padding and margins throughout

## 🔧 Customization

### Adding New Phones
1. Open `db.json`
2. Add a new phone object to the `phones` array
3. Include all required fields (id, name, brand, etc.)
4. Restart the JSON server

### Modifying Styles
- Edit `styles.css` to change colors, fonts, or layout
- CSS variables make theme customization easy
- Responsive breakpoints at 700px

### Extending Functionality
- Add new features in `script.js`
- Follow the existing code structure and commenting style
- Test thoroughly across different browsers

## 🌟 Key Features in Detail

### 1. **Responsive Design**
- Mobile-first approach
- Flexible card layouts
- Adaptive typography
- Touch-friendly interactions

### 2. **Performance Optimized**
- Efficient DOM queries
- Event delegation
- Minimal reflows/repaints
- Optimized image loading

### 3. **User Experience**
- Intuitive navigation
- Clear visual hierarchy
- Consistent interaction patterns
- Helpful error messages

### 4. **Data Management**
- Local storage for user data
- JSON server for phone data
- Error handling for network issues
- Graceful degradation

## 🐛 Troubleshooting

### Common Issues

**Server Not Running**
```
Error: Server not running. Please start the JSON server.
```
**Solution**: Run `start-server.bat` or `json-server --watch db.json`

**Images Not Loading**
- Check internet connection
- Images have fallback placeholders
- Verify image URLs in `db.json`

**Reviews Not Saving**
- Check browser localStorage support
- Clear browser cache if needed
- Verify JavaScript console for errors

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+


## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/RamseyAndrew)

## 🙏 Acknowledgments

- **GSM Arena** for phone images and specifications
- **JSON Server** for the local API solution
- **CSS Variables** for the theming system
- **Modern JavaScript** for the interactive features
---

⭐ **Star this repository if you found it helpful!**

🔗 **Live Demo**: [https://ramseyandrew.github.io/PHASE-1-PROJECT/]
   **Remember to run the server first!**

📧 **Contact**: anti.xe17@gmail.com

---

*Built with ❤️ using vanilla JavaScript, CSS3, and HTML5*
