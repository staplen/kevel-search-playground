<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['query'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Query parameter is required']);
    exit;
}

$networkId = $data['networkId'] ?? '';
$siteId = $data['siteId'] ?? '';
$adTypes = $data['adTypes'] ?? '';
$count = $data['count'] ?? 1;
$fieldName = $data['fieldName'] ?? '';
$phraseMatch = $data['phraseMatch'] ?? false;
$userKey = $data['userKey'] ?? '';

$adzerkRequestBody = [
    'enableBotFiltering' => true,
    'consent' => ['gdpr' => true],
    'placements' => [[
        'divName' => 'results',
        'networkId' => $networkId,
        'siteId' => $siteId,
        'adTypes' => array_map('intval', explode(',', $adTypes)),
        'count' => (int)$count,
        'adQuery' => ['ct' . $fieldName => ['eq' => $data['query'], 'phraseMatch' => $phraseMatch]]
    ]]
];

if ($userKey) {
    $adzerkRequestBody['user'] = ['key' => $userKey];
}

$ch = curl_init("https://e-{$networkId}.adzerk.net/api/v2");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($adzerkRequestBody));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response; 