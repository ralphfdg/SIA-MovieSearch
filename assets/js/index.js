const searchClient = algoliasearch(
    window.movieConfig.appId, 
    window.movieConfig.searchKey
);

const search = instantsearch({
    indexName: window.movieConfig.indexName,
    searchClient,
    insights: true,
});

search.addWidgets([
    instantsearch.widgets.searchBox({
        container: '#searchbox',
        placeholder: 'Search movies, genres...',
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
                <div class="glass-card movie-card h-100 d-flex flex-column movie-card-clickable position-relative overflow-hidden">
                    
                    <div class="d-none raw-title">{{title}}</div>
                    <div class="d-none raw-overview">{{overview}}</div>
                    <div class="d-none raw-poster">{{poster_url}}</div>
                    <div class="d-none raw-genre">{{genre}}</div>
                    <div class="d-none raw-rating">{{vote_average}}</div>
                    <div class="d-none raw-date">{{release_date}}</div>

                    <div class="position-relative">
                        <img src="{{poster_url}}" class="movie-poster" alt="{{title}}" onerror="this.src='https://via.placeholder.com/300x450/0a0a0c/f5c518?text=No+Poster'">
                        
                        <div class="position-absolute top-0 end-0 m-3 glass-badge px-3 py-1 rounded-pill small">
                            ⭐ {{vote_average}}
                        </div>

                        <div class="play-overlay d-flex justify-content-center align-items-center">
                            <div class="play-icon">▶</div>
                        </div>
                    </div>

                    <div class="card-body p-4 d-flex flex-column flex-grow-1">
                        <h5 class="fw-bold text-black mb-1 text-truncate" title="{{title}}">
                            {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
                        </h5>
                        <p class="text-black opacity-50 small mb-3 text-uppercase tracking-wider" style="font-size: 0.75rem;">
                            {{release_date}} &bull; {{genre}}
                        </p>
                        <p class="small overview-text flex-grow-1 text-black opacity-75 m-0">{{overview}}</p>
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
            label: 'text-white d-flex justify-content-between align-items-center mb-3 cursor-pointer opacity-75 hover-opacity-100 transition-all',
            checkbox: 'form-check-input me-2 bg-transparent border-secondary',
            count: 'badge glass-badge rounded-pill',
            searchableInput: 'glass-input form-control form-control-sm text-white mb-4'
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

// Modal Logic
document.getElementById('hits').addEventListener('click', function(e) {
    const card = e.target.closest('.movie-card-clickable');
    
    if (card) {
        const title = card.querySelector('.raw-title').innerText;
        const overview = card.querySelector('.raw-overview').innerText;
        let poster = card.querySelector('.raw-poster').innerText;
        const genre = card.querySelector('.raw-genre').innerText;
        const rating = card.querySelector('.raw-rating').innerText;
        const date = card.querySelector('.raw-date').innerText;

        // Extract just the year for the background watermark
        const year = date ? date.split('-')[0] : '';

        if (!poster || poster === '') {
            poster = 'https://via.placeholder.com/600x900/0a0a0c/f5c518?text=No+Poster';
        }

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalOverview').innerText = overview;
        document.getElementById('modalPoster').src = poster;
        document.getElementById('modalGenre').innerText = genre;
        document.getElementById('modalRating').innerText = `⭐ ${rating}`;
        document.getElementById('modalDate').innerText = date;
        document.getElementById('modalYearWatermark').innerText = year;

        const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
        movieModal.show();
    }
});