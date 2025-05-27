<?php
// Đặt múi giờ Việt Nam
date_default_timezone_set('Asia/Ho_Chi_Minh');

// File để lưu dữ liệu
$dataFile = 'sleep_data.json';

// Đảm bảo file tồn tại
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Đọc dữ liệu hiện tại
$data = json_decode(file_get_contents($dataFile), true);

// Thêm thời gian mới
$newEntry = [
    'date' => date('Y-m-d'),
    'time' => date('H:i:s'),
    'timestamp' => date('Y-m-d H:i:s')
];

$data[] = $newEntry;

// Lưu lại dữ liệu
file_put_contents($dataFile, json_encode($data));

// Trả về thông báo thành công
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'Đã lưu thời gian: ' . date('H:i:s d/m/Y')
]); 
