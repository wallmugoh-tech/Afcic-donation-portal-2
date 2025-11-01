<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = 'localhost';
$db   = 'afcic_db';    // <-- Change to your actual database name if different
$user = 'root';        // <-- Change to your actual MySQL user
$pass = '';            // <-- Change to your actual MySQL password

$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$phone = $input['phone'] ?? '';
$amount = $input['amount'] ?? 0;

if (!$phone || !$amount) {
    echo json_encode(['success' => false, 'message' => 'Missing phone or amount']);
    exit;
}

$stmt = $mysqli->prepare("INSERT INTO donations (phone, amount, donated_at) VALUES (?, ?, NOW())");
$stmt->bind_param('si', $phone, $amount);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'DB insert failed']);
}
$stmt->close();
$mysqli->close();
?>