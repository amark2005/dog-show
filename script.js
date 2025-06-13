document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const breedSelect = document.getElementById('breed-select');
    const dogDisplay = document.getElementById('dog-display');
    const displayBreedName = document.getElementById('display-breed-name');
    const dogImage = document.getElementById('dog-image');
    const showAnotherBtn = document.getElementById('show-another-btn');
    const loadingBreedsMessage = document.getElementById('loading-breeds-message');
    const loadingImageText = document.getElementById('loading-image-text');
    const initialInstructionMessage = document.getElementById('initial-instruction-message');

    // --- State Variables (Mimicking React's useState) ---
    let breeds = [];
    let selectedBreed = '';
    let isLoading = false; // To manage overall loading (breeds or image)

    // --- Utility Function: Capitalize First Letter ---
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // --- Function to Fetch All Dog Breeds ---
    async function fetchBreeds() {
        isLoading = true;
        loadingBreedsMessage.classList.remove('hidden'); // Show loading message
        breedSelect.disabled = true; // Disable dropdown during loading

        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            const data = await response.json();

            if (data.status === 'success') {
                breeds = Object.keys(data.message);
                populateBreedSelect();
                loadingBreedsMessage.classList.add('hidden'); // Hide loading message
                breedSelect.disabled = false; // Enable dropdown
                initialInstructionMessage.classList.remove('hidden'); // Show instruction message
            } else {
                console.error("Failed to fetch breeds:", data.message);
                loadingBreedsMessage.textContent = 'Failed to load breeds. Please try again.';
            }
        } catch (error) {
            console.error("Error fetching breeds:", error);
            loadingBreedsMessage.textContent = 'Error connecting to the dog API. Please check your internet.';
        } finally {
            isLoading = false;
        }
    }

    // --- Function to Populate the Breed Select Dropdown ---
    function populateBreedSelect() {
        // Clear existing options (except the default one)
        breedSelect.innerHTML = '<option value="">-- Select a Breed --</option>';
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            option.textContent = capitalizeFirstLetter(breed);
            breedSelect.appendChild(option);
        });
    }

    // --- Function to Fetch and Display a Dog Image ---
    async function fetchDogImage(breed) {
        if (!breed) return;

        selectedBreed = breed; // Update the global selectedBreed state
        isLoading = true;
        dogDisplay.classList.remove('hidden'); // Ensure display section is visible
        loadingImageText.classList.remove('hidden'); // Show image loading text
        dogImage.src = ''; // Clear previous image
        dogImage.alt = '';
        showAnotherBtn.disabled = true; // Disable button during load

        // Hide initial instruction if it's still visible
        initialInstructionMessage.classList.add('hidden');

        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            const data = await response.json();

            if (data.status === 'success') {
                dogImage.src = data.message;
                dogImage.alt = `A ${capitalizeFirstLetter(breed)} dog`;
                displayBreedName.textContent = `Showing: ${capitalizeFirstLetter(breed)}`;
            } else {
                console.error(`Failed to fetch image for ${breed}:`, data.message);
                dogImage.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                dogImage.alt = 'Image not found';
            }
        } catch (error) {
            console.error(`Error fetching image for ${breed}:`, error);
            dogImage.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
            dogImage.alt = 'Error loading image';
        } finally {
            isLoading = false;
            loadingImageText.classList.add('hidden'); // Hide image loading text
            showAnotherBtn.disabled = false; // Enable button
        }
    }

    // --- Event Listeners ---

    // When the breed dropdown value changes
    breedSelect.addEventListener('change', (event) => {
        const breed = event.target.value;
        if (breed) {
            fetchDogImage(breed);
        } else {
            // If "Select a Breed" is chosen
            dogDisplay.classList.add('hidden'); // Hide the display section
            initialInstructionMessage.classList.remove('hidden'); // Show initial instruction
            selectedBreed = ''; // Clear selected breed
        }
    });

    // When "Show Another" button is clicked
    showAnotherBtn.addEventListener('click', () => {
        if (selectedBreed && !isLoading) { // Ensure a breed is selected and not already loading
            fetchDogImage(selectedBreed);
        }
    });

    // --- Initial Load ---
    fetchBreeds(); // Start by fetching the list of breeds
});