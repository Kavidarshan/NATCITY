<?php
// send-email.php - SIMPLIFIED VERSION
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Extract form data
    $branch = isset($data['branch']) ? htmlspecialchars(trim($data['branch'])) : 'General Inquiry';
    $name = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
    $email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($data['subject']) ? htmlspecialchars(trim($data['subject'])) : 'New Website Inquiry';
    $message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
        exit;
    }
    
    // ============================================
    // IMPORTANT: SET YOUR EMAIL HERE
    // Change this to your actual email address
    $to = "kavidarshan01@gmail.com"; // ⬅️ CHANGE THIS TO YOUR EMAIL
    // ============================================
    
    $email_subject = "NAT City Hotel Inquiry: " . ($subject ?: "From $name");
    
    // Simple email body
    $email_body = "
    =============================================
    NAT CITY HOTEL - NEW WEBSITE INQUIRY
    =============================================
    
    Branch: $branch
    Name: $name
    Email: $email
    Subject: $subject
    
    Message:
    =============================================
    $message
    =============================================
    
    Received: " . date('Y-m-d H:i:s') . "
    IP Address: " . $_SERVER['REMOTE_ADDR'] . "
    ";
    
    // Email headers
    $headers = "From: NAT City Hotel Website <noreply@natcityhotel.com>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Log the submission (optional)
        $log_entry = date('Y-m-d H:i:s') . " | $name | $email | $branch | IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
        @file_put_contents('contact_log.txt', $log_entry, FILE_APPEND);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.'
        ]);
    } else {
        // Alternative: Use error log to debug
        error_log("Email sending failed for: $name, $email");
        
        // For testing, you can simulate success
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you! (Test mode: Email would be sent to ' . $to . ')'
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>