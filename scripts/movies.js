
// function to fetch movies from the API and display them
async function fetchAndDisplayMovies() {
    try {
        const response = await fetch(ENDPOINTS.movies);
        const movies = await response.json();

        // clear the existing movies list
        const moviesListContainer = document.getElementById('movies-list');
        moviesListContainer.innerHTML = '';

        // loop through the movies and create HTML elements to display them
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('col-md-4');
            movieCard.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title} (${movie.releaseYear})</h5>
                        <p class="card-text">Director: ${movie.director}</p>
                        <p class="card-text">${movie.description}</p>
                        <button class="btn btn-primary edit-button" data-id="${movie.id}">Edit</button>
                        <button class="btn btn-danger delete-button" data-id="${movie.id}">Delete</button>
                    </div>
                </div>
            `;
            moviesListContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error fetching and displaying movies:', error);
    }
}
// event listener for form submission
document.getElementById('createMovieForm').addEventListener('submit', async (event) => {

    event.preventDefault();

    try {
        // collect data from form fields
        const title = document.getElementById('title').value;
        const director = document.getElementById('director').value;
        const description = document.getElementById('description').value;
        const genre = document.getElementById('genre').value;
        const year = document.getElementById('year').value;

        // ceate a new movie object with collected data
        const newMovie = { title, director, description, genre, ReleaseYear: year };

        // send a POST request to the server to create the new movie
        const response = await fetch(ENDPOINTS.createMovie, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMovie)
        });

        // check if the request was successful
        if (response.ok) {
            // movie created successfully, refreshes the movie list
            fetchAndDisplayMovies();
            // clear the form fields after successful creation
            document.getElementById('createMovieForm').reset();
        } else {
            // if response status unaccepted, throw an error to be caught below
            throw new Error(`Failed to create movie: ${response.statusText}`);
        }
    } catch (error) {
        // display an error message based on the caught error
        console.error(error.message);
    }
});



// event delegation to handle delete button clicks
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const movieId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                const response = await fetch(ENDPOINTS.deleteMovie(movieId), {
                    method: 'DELETE'
                });
                if (response.ok) {
                    // movie deleted successfully
                    fetchAndDisplayMovies();
                } else {
                    console.error('Failed to delete movie:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    }
});

// event delgation to handle edit button clicks
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-button')) {
        const movieId = event.target.dataset.id;

        // fetch movie details by ID
        try {
            const response = await fetch(ENDPOINTS.movies + movieId);
            const movie = await response.json();

            // populate the edit modal with movie details
            document.getElementById('editTitle').value = movie.title;
            document.getElementById('editDirector').value = movie.director;
            document.getElementById('editDescription').value = movie.description;
            document.getElementById('editGenre').value = movie.genre;
            document.getElementById('editYear').value = movie.releaseYear;

            // set the movie ID as a hidden input value in the edit form
            document.getElementById('editMovieId').value = movieId;

            // show the edit modal
            $('#editModal').modal('show');

        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }
});

// event listener for edit form submission
document.getElementById('editMovieForm').addEventListener('submit', async (event) => {
    // prevent the default form submission behavior
    event.preventDefault();

    try {
        // collect data from edit form fields
        const id = document.getElementById('editMovieId').value;
        const title = document.getElementById('editTitle').value;
        const director = document.getElementById('editDirector').value;
        const description = document.getElementById('editDescription').value;
        const genre = document.getElementById('editGenre').value;
        const year = document.getElementById('editYear').value;

        // create a new movie object with the collected data
        const updatedMovie = { id, title, director, description, genre, releaseYear: year };

        // send a PUT request to the server to update the movie
        const response = await fetch(ENDPOINTS.editMovie(id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedMovie)
        });

        // check if the request was successful
        if (response.ok) {
            // movie updated successfully, close the modal and optionally refresh the movie list or update UI
            $('#editModal').modal('hide');
            fetchAndDisplayMovies(); // Assuming you have a function to fetch and display movies
        } else {
            // if response status is not okay, throw an error to be caught below
            throw new Error(`Failed to update movie: ${response.statusText}`);
        }
    } catch (error) {
        // display an error message based on the caught error
        console.error(error.message);
    }
});

// add an event listener to the movieIdInput field
document.getElementById('movieIdInput').addEventListener('change', async () => {
    try {
        // get the movie ID from the input field
        const movieId = document.getElementById('movieIdInput').value.trim();

        // cll the function to fetch and display the details of the specified movie
        await fetchAndDisplayMovieById(movieId);
    } catch (error) {
        console.error('Error fetching and displaying movie details:', error);
    }
});

// function to fetch and display movie details by ID
async function fetchAndDisplayMovieById(movieId) {
    try {
        // fetch movie details by ID
        const response = await fetch(ENDPOINTS.movies + movieId);
        if (response.status === 404) {
            // if movie is not found, display a message
            displayErrorMessage('There is no movie with this ID.');
            return;
        }
        const movie = await response.json();

        // display movie details
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching and displaying movie details:', error);
        displayErrorMessage('An error occurred while fetching movie details.');
    }
}

// function to display an error message
function displayErrorMessage(message) {
    // clear previous movie details
    const movieDetailsContainer = document.getElementById('movie-details');
    movieDetailsContainer.innerHTML = '';

    // create HTML element for the error message
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('alert', 'alert-danger');
    errorMessage.textContent = message;

    // append error message to the container
    movieDetailsContainer.appendChild(errorMessage);
}


// function to display movie details
function displayMovieDetails(movie) {
    // clear previous movie details
    const movieDetailsContainer = document.getElementById('movie-details');
    movieDetailsContainer.innerHTML = '';

    // create HTML elements to display movie details
    const movieDetailsCard = document.createElement('div');
    movieDetailsCard.classList.add('card');
    movieDetailsCard.innerHTML = `
    <div class="card mb-4 shadow-sm">
    <div class="card-body">
        <h5 class="card-title">${movie.title} (${movie.releaseYear})</h5>
        <p class="card-text">Director: ${movie.director}</p>
        <p class="card-text">${movie.description}</p>
        <button class="btn btn-primary edit-button" data-id="${movie.id}">Edit</button>
        <button class="btn btn-danger delete-button" data-id="${movie.id}">Delete</button>
    </div>
</div>
    `;

    // append movie details to the container
    movieDetailsContainer.appendChild(movieDetailsCard);
}

let moviesDisplayed = false;

// function to display all movies
function toggleMovies() {
    if (moviesDisplayed) {
        // Clear the movies list
        document.getElementById('movies-list').innerHTML = '';
        moviesDisplayed = false;
    } else {
        // Display all movies
        fetchAndDisplayMovies();
        moviesDisplayed = true;
    }
}

//  event listener for toggling movies button
document.getElementById('toggleMoviesButton').addEventListener('click', toggleMovies);
