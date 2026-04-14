// 1. Initialize the Algolia Search Client using the global config object
const searchClient = algoliasearch(
    window.movieConfig.appId, 
    window.movieConfig.searchKey
);

const search = instantsearch({
    indexName: window.movieConfig.indexName,
    searchClient,
    insights: true,
});

// 2. Add Widgets
search.addWidgets([
    instantsearch.widgets.searchBox({
        container: '#searchbox',
        placeholder: 'Search for movies, genres, or keywords...',
        showSubmit: false,
        showReset: true,
        cssClasses: {
            input: 'glass-input form-control text-white', 
        }
    }),


    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
            item: `
                <div class="glass-card movie-card h-100 d-flex flex-column movie-card-clickable position-relative">
                    
                    <div class="d-none raw-title">{{title}}</div>
                    <div class="d-none raw-overview">{{overview}}</div>
                    <div class="d-none raw-poster">{{poster_url}}</div>
                    <div class="d-none raw-genre">{{genre}}</div>
                    <div class="d-none raw-rating">{{vote_average}}</div>
                    <div class="d-none raw-date">{{release_date}}</div>

                    <img src="{{poster_url}}" class="movie-poster" alt="{{title}}" onerror="this.src='https://via.placeholder.com/300x450/e9ecef/6c757d?text=No+Poster'">
                    
                    <div class="play-overlay d-flex justify-content-center align-items-center">
                        <div class="play-icon">▶</div>
                    </div>

                    <div class="card-body p-3 d-flex flex-column flex-grow-1">
                        <h5 class="fw-bold text-dark mb-2">
                            {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
                        </h5>
                        <p class="small overview-text flex-grow-1">{{overview}}</p>
                        <div class="mt-auto pt-3 border-top border-light">
                            <div class="d-flex justify-content-between align-items-center small text-dark">
                                <span class="badge glass-badge">{{genre}}</span>
                                <span class="fw-semibold">⭐ {{vote_average}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
        },
    }),

    instantsearch.widgets.refinementList({
        container: '#genre-list',
        attribute: 'genre', 
        searchable: true,
        searchablePlaceholder: 'Find a genre...',
        cssClasses: {
            label: 'text-dark d-flex justify-content-between align-items-center mb-2 cursor-pointer',
            checkbox: 'form-check-input me-2 bg-transparent border-dark opacity-50',
            count: 'badge glass-badge rounded-pill',
            searchableInput: 'glass-input form-control form-control-sm text-dark mb-3'
        }
    }),


    instantsearch.widgets.pagination({
        container: '#pagination',
        cssClasses: {
            list: 'pagination custom-pagination',
            item: 'page-item',
            link: 'page-link glass-btn'
        }
    })
]);

search.start();

// 3. Modal Interaction Logic (Event Delegation)
// We attach the click listener to the #hits container because the movie cards are rendered dynamically
document.getElementById('hits').addEventListener('click', function(e) {
    // Find the closest movie card that was clicked
    const card = e.target.closest('.movie-card-clickable');
    
    if (card) {
        // Extract data from the hidden fields inside the clicked card
        const title = card.querySelector('.raw-title').innerText;
        const overview = card.querySelector('.raw-overview').innerText;
        let poster = card.querySelector('.raw-poster').innerText;
        const genre = card.querySelector('.raw-genre').innerText;
        const rating = card.querySelector('.raw-rating').innerText;
        const date = card.querySelector('.raw-date').innerText;

        // Handle broken image links fallback
        if (!poster || poster === '') {
            poster = 'https://via.placeholder.com/600x900/1a1a2e/ffffff?text=No+Poster';
        }

        // Inject data into the Modal DOM
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalOverview').innerText = overview;
        document.getElementById('modalPoster').src = poster;
        document.getElementById('modalGenre').innerText = genre;
        document.getElementById('modalRating').innerText = `⭐ ${rating} / 10`;
        document.getElementById('modalDate').innerText = date;

        // Initialize and show the Bootstrap Modal
        const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
        movieModal.show();
    }
});

