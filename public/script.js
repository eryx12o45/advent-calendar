// Advent Calendar Script
document.addEventListener('DOMContentLoaded', function() {
    // Password protection
    const passwordScreen = document.getElementById('passwordScreen');
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const calendarContent = document.getElementById('calendarContent');
    
    // Year selector
    const yearSelector = document.getElementById('yearSelector');
    let availableYears = [];
    let currentYear = null;
    
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('adventAuth') === 'true';
    
    if (isAuthenticated) {
        showCalendar();
    }
    
    // Password form submission
    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const enteredPassword = passwordInput.value;
        
        try {
            // Send password to server for verification
            const response = await fetch('/api/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: enteredPassword })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Correct password
                sessionStorage.setItem('adventAuth', 'true');
                passwordError.style.display = 'none';
                showCalendar();
            } else {
                // Wrong password
                passwordError.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
                
                // Shake animation
                passwordForm.style.animation = 'none';
                setTimeout(() => {
                    passwordForm.style.animation = '';
                }, 10);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            passwordError.textContent = '❌ Fehler bei der Überprüfung. Bitte versuchen Sie es erneut.';
            passwordError.style.display = 'block';
        }
    });
    
    function showCalendar() {
        passwordScreen.style.display = 'none';
        calendarContent.style.display = 'block';
        loadAvailableYears();
    }
    
    // Load available years from server
    async function loadAvailableYears() {
        try {
            const response = await fetch('/api/years');
            const data = await response.json();
            
            if (data.success && data.years.length > 0) {
                availableYears = data.years;
                populateYearSelector();
                
                // Get current year
                const now = new Date();
                const currentYearNum = now.getFullYear().toString();
                
                // Load saved year or default to current year if available, otherwise most recent
                const savedYear = localStorage.getItem('selectedYear');
                if (savedYear && availableYears.includes(savedYear)) {
                    currentYear = savedYear;
                } else if (availableYears.includes(currentYearNum)) {
                    currentYear = currentYearNum;
                } else {
                    currentYear = availableYears[0]; // Most recent year
                }
                
                yearSelector.value = currentYear;
                applyYearTheme(currentYear);
                initializeCalendar();
            } else {
                console.error('No years available');
                yearSelector.innerHTML = '<option value="">Keine Jahre verfügbar</option>';
            }
        } catch (error) {
            console.error('Error loading years:', error);
            yearSelector.innerHTML = '<option value="">Fehler beim Laden</option>';
        }
    }
    
    // Populate year selector dropdown
    function populateYearSelector() {
        yearSelector.innerHTML = '';
        availableYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelector.appendChild(option);
        });
    }
    
    // Handle year selection change
    yearSelector.addEventListener('change', function() {
        const selectedYear = this.value;
        if (selectedYear && selectedYear !== currentYear) {
            currentYear = selectedYear;
            localStorage.setItem('selectedYear', currentYear);
            applyYearTheme(currentYear);
            
            // Reload calendar for new year
            const calendarGrid = document.querySelector('.calendar-grid');
            calendarGrid.innerHTML = '';
            initializeCalendar();
        }
    });
    
    // Apply year-specific theme
    function applyYearTheme(year) {
        document.body.setAttribute('data-year', year);
    }
    
    function initializeCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('closeBtn');
        const doorNumberSpan = document.getElementById('doorNumber');
        const audioPlayer = document.getElementById('audioPlayer');
        const audioSource = document.getElementById('audioSource');
        
        // Create snowflakes
        createSnowflakes();
        
        // Generate 24 doors in random order (persisted in localStorage)
        let doorNumbers;
        const savedOrder = localStorage.getItem('adventCalendarOrder');
        
        if (savedOrder) {
            // Use saved order
            doorNumbers = JSON.parse(savedOrder);
        } else {
            // Create new random order
            doorNumbers = Array.from({length: 24}, (_, i) => i + 1);
            // Shuffle the array using Fisher-Yates algorithm
            for (let i = doorNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [doorNumbers[i], doorNumbers[j]] = [doorNumbers[j], doorNumbers[i]];
            }
            // Save the order to localStorage
            localStorage.setItem('adventCalendarOrder', JSON.stringify(doorNumbers));
        }
        
        // Create doors in shuffled order
        doorNumbers.forEach(number => {
            const door = createDoor(number);
            calendarGrid.appendChild(door);
        });
        
        // Close overlay handlers
        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeOverlay();
            }
        });
        
        function createDoor(number) {
            const door = document.createElement('div');
            door.className = 'door';
            door.dataset.day = number;
            
            const doorNumber = document.createElement('div');
            doorNumber.className = 'door-number';
            doorNumber.textContent = number;
            
            door.appendChild(doorNumber);
            
            // Check if door should be unlocked
            if (isDoorUnlocked(number)) {
                door.classList.add('unlocked');
                door.addEventListener('click', () => openDoor(number));
            } else {
                door.classList.add('locked');
                door.addEventListener('click', () => showLockedMessage(number));
            }
            
            return door;
        }
        
        function isDoorUnlocked(dayNumber) {
            const today = new Date();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth() + 1; // January is 0
            const todayDay = today.getDate();
            
            const selectedYear = parseInt(currentYear);
            
            // If selected year is in the future, all doors are locked
            if (selectedYear > todayYear) {
                return false;
            }
            
            // If selected year is in the past, all doors are unlocked
            if (selectedYear < todayYear) {
                return true;
            }
            
            // Selected year is the current year
            // Check if we're in December of the selected year
            if (todayMonth === 12) {
                // Door is unlocked if current day is >= door number
                return todayDay >= dayNumber;
            }
            
            // If we're past December of the selected year, all doors are unlocked
            if (todayMonth > 12) {
                return true;
            }
            
            // Before December of the selected year, all doors are locked
            return false;
        }
        
        function openDoor(dayNumber) {
            // Set door number in overlay
            doorNumberSpan.textContent = dayNumber;
            
            // Set audio source with year path
            audioSource.src = `audio/${currentYear}/day${dayNumber}.mp3`;
            audioPlayer.load();
            
            // Load and display image if it exists (using same naming as audio files)
            const storyImageContainer = document.getElementById('storyImageContainer');
            const storyImage = document.getElementById('storyImage');
            const imagePath = `images/${currentYear}/day${dayNumber}.png`;
            
            // Create a new image to test if it exists
            const testImage = new Image();
            testImage.onload = function() {
                // Image exists, show it
                storyImage.src = imagePath;
                storyImageContainer.style.display = 'block';
            };
            testImage.onerror = function() {
                // Image doesn't exist, hide the container
                storyImageContainer.style.display = 'none';
            };
            testImage.src = imagePath;
            
            // Show overlay
            overlay.classList.add('active');
            
            // Pause any playing audio and reset
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        
        function closeOverlay() {
            overlay.classList.remove('active');
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        
        function showLockedMessage(dayNumber) {
            // Calculate when this door will unlock based on selected year
            const selectedYear = parseInt(currentYear);
            const unlockDate = new Date(selectedYear, 11, dayNumber); // December of selected year (month 11 = December)
            
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = unlockDate.toLocaleDateString('de-DE', options);
            
            alert(`🔒 Türchen ${dayNumber} ist noch verschlossen!\n\nEs öffnet sich am ${dateString}.`);
        }
        
        function createSnowflakes() {
            const snowContainer = document.querySelector('.snow-container');
            snowContainer.innerHTML = ''; // Clear existing elements
            const numberOfFlakes = 50;
            
            // Define different falling elements for each year
            const yearThemes = {
                '2025': ['❄', '❄', '❄', '⭐', '✨'], // Classic snowflakes and stars
                '2026': ['🎁', '🎁', '📦', '🎀', '🎄'], // Gift boxes and presents
                '2027': ['🔔', '🕯️', '🔔', '⭐', '✨'], // Bells and candles
                '2028': ['🎅', '🤶', '🦌', '⛄', '❄'], // Santa, reindeer, snowman
                '2029': ['🍪', '🥛', '🍭', '🎂', '🧁'], // Cookies and treats
                '2030': ['🌟', '✨', '💫', '⭐', '🌠']  // Stars and sparkles
            };
            
            const elements = yearThemes[currentYear] || yearThemes['2025'];
            
            for (let i = 0; i < numberOfFlakes; i++) {
                const flake = document.createElement('div');
                flake.style.position = 'absolute';
                flake.style.color = 'white';
                flake.style.fontSize = Math.random() * 15 + 12 + 'px';
                flake.style.left = Math.random() * 100 + '%';
                flake.style.animationName = 'snowfall';
                flake.style.animationDuration = Math.random() * 4 + 3 + 's';
                flake.style.animationDelay = Math.random() * 5 + 's';
                flake.style.animationIterationCount = 'infinite';
                flake.style.animationTimingFunction = 'linear';
                flake.textContent = elements[Math.floor(Math.random() * elements.length)];
                flake.style.opacity = Math.random() * 0.5 + 0.4;
                
                snowContainer.appendChild(flake);
            }
        }
    }
});
