<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$uploadDir = 'uploads/';

// انشاء المجلد اذا لم يكن موجودا
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$response = [
    'success' => true,
    'files' => []
];

foreach ($_FILES as $key => $file) {
    if ($file['error'] === UPLOAD_ERR_OK) {
        $tempName = $file['tmp_name'];
        $originalName = basename($file['name']);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        
        // توليد اسم فريد لتجنب تكرار الاسماء
        $newName = uniqid('img_', true) . '.' . $extension;
        $targetPath = $uploadDir . $newName;

        if (move_uploaded_file($tempName, $targetPath)) {
            $response['files'][$key] = $newName;
        } else {
            $response['success'] = false;
            $response['error'] = 'فشل في حفظ الملف: ' . $key;
            break;
        }
    }
}

echo json_encode($response);
?>
