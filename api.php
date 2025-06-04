<?php
$DATA_FILE = __DIR__ . '/vehicles.json';
$UPLOAD_DIR = __DIR__ . '/uploads/';
if (!is_dir($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0777, true);
}

function readData($file) {
    if (!file_exists($file)) return [];
    $json = file_get_contents($file);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function writeData($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function saveImage($field, $dir) {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    $name = uniqid() . '_' . basename($_FILES[$field]['name']);
    $dest = $dir . $name;
    if (move_uploaded_file($_FILES[$field]['tmp_name'], $dest)) {
        return 'uploads/' . $name;
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

header('Content-Type: application/json');
$data = readData($DATA_FILE);

switch($method) {
    case 'GET':
        echo json_encode($data);
        break;
    case 'POST':
        $vehicle = [
            'id' => time(),
            'title' => $_POST['title'] ?? '',
            'subtitle' => $_POST['subtitle'] ?? '',
            'price' => $_POST['price'] ?? '',
            'mainImage' => saveImage('mainImage', $UPLOAD_DIR),
            'thumbnails' => [
                saveImage('thumb1', $UPLOAD_DIR),
                saveImage('thumb2', $UPLOAD_DIR),
                saveImage('thumb3', $UPLOAD_DIR)
            ],
            'brandLogo' => saveImage('brandLogo', $UPLOAD_DIR),
            'year' => $_POST['year'] ?? '',
            'mileage' => $_POST['mileage'] ?? '',
            'transmission' => $_POST['transmission'] ?? '',
            'fuel' => $_POST['fuel'] ?? '',
            'description' => $_POST['description'] ?? ''
        ];
        $data[] = $vehicle;
        writeData($DATA_FILE, $data);
        echo json_encode($vehicle);
        break;
    case 'PUT':
        parse_str(file_get_contents('php://input'), $putVars);
        $id = $putVars['id'] ?? null;
        if (!$id) { http_response_code(400); break; }
        foreach ($data as &$v) {
            if ($v['id'] == $id) {
                foreach(['title','subtitle','price','year','mileage','transmission','fuel','description'] as $field) {
                    if (isset($putVars[$field])) $v[$field] = $putVars[$field];
                }
                writeData($DATA_FILE, $data);
                echo json_encode($v);
                return;
            }
        }
        http_response_code(404);
        break;
    case 'DELETE':
        parse_str(file_get_contents('php://input'), $delVars);
        $id = $delVars['id'] ?? null;
        if (!$id) { http_response_code(400); break; }
        foreach ($data as $i => $v) {
            if ($v['id'] == $id) {
                array_splice($data, $i, 1);
                writeData($DATA_FILE, $data);
                http_response_code(204);
                return;
            }
        }
        http_response_code(404);
        break;
    default:
        http_response_code(405);
}
?>
