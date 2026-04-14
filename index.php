<?php
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$appId = $_ENV['ALGOLIA_APP_ID'];
$searchApiKey = $_ENV['ALGOLIA_SEARCH_API_KEY'];
$indexName = $_ENV['INDEX_NAME'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Search System</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@8.1.0/themes/satellite-min.css">
    
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>

    <nav class="navbar sticky-top glass-navbar py-3 mb-4">
        <div class="container d-flex justify-content-between align-items-center">
            <a class="navbar-brand fw-bold text-dark mb-0 fs-4" href="#">🎬 Movie Finder</a>
            <div id="searchbox" class="flex-grow-1 ms-4" style="max-width: 600px;"></div>
        </div>
    </nav>

    <div class="container mb-5">
        <div class="row g-4">
            <div class="col-md-3">
                <div class="glass-card p-3">
                    <h5 class="fw-bold mb-3 pb-2 border-bottom border-light text-dark">Filter by Genre</h5>
                    <div id="genre-list"></div>
                </div>
            </div>

            <div class="col-md-9">
                <div id="hits"></div>
                <div id="pagination" class="mt-5 d-flex justify-content-center"></div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="movieModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content glass-card border-0 text-dark">
                <div class="modal-body p-0">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3 z-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="row g-0">
                        <div class="col-md-5 d-none d-md-block">
                            <img id="modalPoster" src="" class="img-fluid rounded-start h-100 object-fit-cover" alt="Movie Poster">
                        </div>
                        <div class="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
                            <h2 id="modalTitle" class="fw-bold mb-1">Movie Title</h2>
                            <div class="d-flex align-items-center gap-3 mb-4 small text-muted">
                                <span id="modalDate">2023</span>
                                <span class="badge glass-badge" id="modalGenre">Action</span>
                                <span id="modalRating">⭐ 8.5 / 10</span>
                            </div>
                            <h6 class="fw-bold text-uppercase text-secondary mb-2">Overview</h6>
                            <p id="modalOverview" class="text-dark opacity-75 lh-lg mb-4">Movie description goes here...</p>
                            
                            <button class="btn btn-primary glass-btn-primary py-2 px-4 rounded-pill fw-bold w-100" data-bs-dismiss="modal">
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.movieConfig = {
            appId: '<?php echo htmlspecialchars($appId, ENT_QUOTES, 'UTF-8'); ?>',
            searchKey: '<?php echo htmlspecialchars($searchApiKey, ENT_QUOTES, 'UTF-8'); ?>',
            indexName: '<?php echo htmlspecialchars($indexName, ENT_QUOTES, 'UTF-8'); ?>'
        };
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/algoliasearch@4.20.0/dist/algoliasearch-lite.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.60.0/dist/instantsearch.production.min.js"></script>
    
    <script src="assets/js/index.js"></script>
</body>
</html>