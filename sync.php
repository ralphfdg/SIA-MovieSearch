<?php
require_once __DIR__ . '/vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$appId = $_ENV['ALGOLIA_APP_ID']; 
$apiKey = $_ENV['ALGOLIA_WRITE_API_KEY']; 
$indexName = $_ENV['INDEX_NAME'];

$client = \Algolia\AlgoliaSearch\Api\SearchClient::create($appId, $apiKey);

$host = $_ENV['DB_HOST'];
$db   = $_ENV['DB_NAME']; 
$user = $_ENV['DB_USER'];               
$pass = $_ENV['DB_PASS'];                   
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}


$stmt = $pdo->query('SELECT * FROM moviedb'); 
$movies = [];

while ($row = $stmt->fetch()) {
    if (isset($row['id'])) {
        $row['objectID'] = (string) $row['id']; // Algolia prefers objectID as a string
    }
    $movies[] = $row;
}

if (!empty($movies)) {
    try {
        $client->saveObjects($indexName, $movies);
        echo "Success: " . count($movies) . " movie records have been synced to Algolia!";
    } catch (Exception $e) {
        echo "Algolia Sync Error: " . $e->getMessage();
    }
} else {
    echo "No records found in the local database to sync.";
}
?>