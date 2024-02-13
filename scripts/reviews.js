// flag to keep track of whether event listeners are attached
let eventListenersAttached = false;

// function to attach event listeners
function attachEventListeners() {
  if (!eventListenersAttached) {
    // event listener for the form submission
    document
      .getElementById("addReviewForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault(); // prevent default form submission behavior

        try {
          // collect data from the form fields
          const movieId = document.getElementById("movieIdInput").value;
          const reviewText = document.getElementById("review").value;
          const rating = document.getElementById("rating").value;

          // create a new review object with the userID included
          const newReview = {
            movieId: movieId,
            comment: reviewText,
            rating: rating,
          };

          // submit the review to the API
          const response = await fetch(ENDPOINTS.addReview, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReview),
          });

          if (response.ok) {
            // review added successfully, fetch and display updated reviews
            fetchAndDisplayReviews();
            // close the modal after successful submission
            $("#addReviewModal").modal("hide");
          } else {
            console.error("Failed to add review:", response.statusText);
          }
        } catch (error) {
          console.error("Error adding review:", error);
        }
      });

    // event listener for deleting reviews
    document.addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete-button")) {
        const reviewId = event.target.dataset.reviewId;
        if (confirm("Are you sure you want to delete this review?")) {
          try {
            const response = await fetch(ENDPOINTS.deleteReview(reviewId), {
              method: "DELETE",
            });
            if (response.ok) {
              // review deleted successfully, fetch and display updated reviews
              fetchAndDisplayReviews();
            } else {
              console.error("Failed to delete review:", response.statusText);
            }
          } catch (error) {
            console.error("Error deleting review:", error);
          }
        }
      }
    });

    // event listener for toggling reviews
    document
      .getElementById("toggleReviewsButton")
      .addEventListener("click", toggleReviews);

    eventListenersAttached = true;
  }
}

// function to fetch and display reviews from the API
async function fetchAndDisplayReviews() {
  attachEventListeners(); // make surees event listeners are attached only once

  try {
    const response = await fetch(ENDPOINTS.reviews);
    const reviews = await response.json();

    // clear the existing reviews list
    const reviewsListContainer = document.getElementById("reviews-list");
    reviewsListContainer.innerHTML = "";

    // loop through the reviews and create HTML elements to display them
    reviews.forEach((review) => {
      displayReviewDetails(review);
    });
  } catch (error) {
    console.error("Error fetching and displaying reviews:", error);
  }
}

// function to display review details within Bootstrap cards
async function displayReviewDetails(review) {
  try {
    // fetch the associated movie details
    const movieResponse = await fetch(ENDPOINTS.movies + review.movieId);
    const movie = await movieResponse.json();

    // create a Bootstrap card for the review
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");

    // create card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // movie title
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = movie.title;

    // rating
    const rating = document.createElement("p");
    rating.classList.add("card-text");
    rating.innerHTML = `<strong>Rating:</strong> ${review.rating}`;

    // review text
    const reviewText = document.createElement("p");
    reviewText.classList.add("card-text");
    reviewText.innerHTML = `<strong>Review:</strong> ${review.comment}`;

    // edit button
    const editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-primary", "edit-button");
    editButton.textContent = "Edit";
    editButton.setAttribute("data-review-id", review.id); // Assuming the ID field is 'id'

    // delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-review-id", review.id); // Assuming the ID field is 'id'

    // append elements to card body
    cardBody.appendChild(title);
    cardBody.appendChild(rating);
    cardBody.appendChild(reviewText);
    cardBody.appendChild(editButton);
    cardBody.appendChild(deleteButton);

    // append card body to card
    card.appendChild(cardBody);

    // append card to reviews list
    const reviewsListContainer = document.getElementById("reviews-list");
    reviewsListContainer.appendChild(card);
  } catch (error) {
    console.error("Error displaying review details:", error);
  }
}

// add an event listener to the reviewIdInput field
document
  .getElementById("reviewIdInput")
  .addEventListener("change", async () => {
    try {
      // get the review ID from the input field
      const reviewId = document.getElementById("reviewIdInput").value.trim();

      // call the function to fetch and display the details of the specified review
      await fetchAndDisplayReviewById(reviewId);
    } catch (error) {
      console.error("Error fetching and displaying review details:", error);
    }
  });

// function to fetch and display review details by ID
async function fetchAndDisplayReviewById(reviewId) {
  try {
    // fetch review details by ID
    const response = await fetch(ENDPOINTS.reviews + reviewId);
    if (response.status === 404) {
      // if review is not found, it clears the reviews list container and display a message
      const reviewsListContainer = document.getElementById("reviews-list");
      reviewsListContainer.innerHTML = "";
      displayErrorMessage("There is no review with this ID.");
      return;
    }
    const review = await response.json();

    // clear the reviews list container
    const reviewsListContainer = document.getElementById("reviews-list");
    reviewsListContainer.innerHTML = "";

    // display review details
    displayReviewDetails(review);
  } catch (error) {
    console.error("Error fetching and displaying review details:", error);
    displayErrorMessage("An error occurred while fetching review details.");
  }
}

// fffwunction to display an error message for reviews
function displayErrorMessage(message) {
  // clear previous review details
  const reviewDetailsContainer = document.getElementById("review-details");
  reviewDetailsContainer.innerHTML = "";

  // create HTML element for the error message
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("alert", "alert-danger");
  errorMessage.textContent = message;

  // append error message to the container
  reviewDetailsContainer.appendChild(errorMessage);
}

// function to toggle displaying all reviews
function toggleReviews() {
  const reviewsListContainer = document.getElementById("reviews-list");
  // check if the reviews are currently displayed
  if (reviewsListContainer.innerHTML.trim() !== "") {
    // reviews are currently displayed, so hide them
    reviewsListContainer.innerHTML = "";
  } else {
    // reviews are currently hidden, so fetch and display them
    fetchAndDisplayReviews();
  }
}

let reviewsDisplayed = false;

// fetch and display reviews when the page loads
fetchAndDisplayReviews();
