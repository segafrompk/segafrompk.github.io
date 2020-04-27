<?php
    // Import PHPMailer classes into the global namespace
    // These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    // Load Composer's autoloader
    require 'vendor/autoload.php';
    http_response_code(400);

    $errors = []; // Store all foreseen and unforeseen errors here.

    $fileExtensions = ['pdf','doc','docx']; // Get all the file extensions.


    if (array_key_exists('ime', $_POST) && !empty($_POST['ime'])) {
        $contact['ime'] = trim($_POST['ime']);
        $contact['ime'] = filter_var($contact['ime'], FILTER_SANITIZE_STRING);
    } else {
        $errors[] = "Morate uneti Vaše ime kako biste poslali prijavu za posao.";
    }

    if (array_key_exists('prezime', $_POST) && !empty($_POST['prezime'])) {
        $contact['prezime'] = trim($_POST['prezime']);
        $contact['prezime'] = filter_var($contact['prezime'], FILTER_SANITIZE_STRING);
    } else {
        $errors[] = "Morate uneti Vaše prezime kako biste poslali prijavu za posao.";
    }

    if (array_key_exists('broj', $_POST) && !empty($_POST['broj'])) {
        $contact['broj'] = trim($_POST['broj']);
        $contact['broj'] = filter_var($contact['broj'], FILTER_SANITIZE_NUMBER_INT);
        $validBroj = preg_match('/^((\+?381)|0)[0-9]{8,9}$/', $contact['broj']);
        if ($validBroj == 0 || $validBroj == false) {
            $errors[] = "Molimo unesite broj telefona u formatu +381631111111, 381631111111 ili 0631111111";
        }
    } else {
        $errors[] = "Morate uneti Vaš broj telefona kako biste poslali prijavu za posao.";
    }

    if (array_key_exists('email', $_POST) && !empty($_POST['email'])) {
        $contact['email'] = trim($_POST['email']);
        $validEmail = filter_var($contact['email'], FILTER_VALIDATE_EMAIL);
        if (!$validEmail) {
            $errors[] = "Niste uneli ispravnu e-mail adresu.";
        }
    } else {
        $errors[] = "Morate uneti Vaš e-mail kako biste poslali prijavu za posao.";
    }

    if (array_key_exists('zasto', $_POST) && !empty($_POST['zasto'])) {
        $contact['zasto'] = trim($_POST['zasto']);
        $contact['zasto'] = filter_var($contact['zasto'], FILTER_SANITIZE_STRING);
    } else {
        $errors[] = "Morate napisati zašto smatrate da ste vi pravi kandidat kako biste poslali prijavu za posao.";
    }

    if (isset($_FILES['mojCV']['name'])) {
        $fileName = $_FILES['mojCV']['name'];
        $fileSize = $_FILES['mojCV']['size'];
        $fileTmpName  = $_FILES['mojCV']['tmp_name'];
        $fileType = $_FILES['mojCV']['type'];

        $exploding = explode('.',$fileName);
        $fileExtension = strtolower(end($exploding));

        if (!in_array($fileExtension,$fileExtensions)) {
            $errors[] = "Greška! Priloženi fajl nije u formatu PDF, DOC ili DOCX.";
        }
    
        if ($fileSize > 2097152) {
            $errors[] = "Priloženi fajl ne sme biti veći od 2 MB.";
        }
    
    } else {
        $errors[] = "Morate priložiti Vaš CV kako biste poslali prijavu za posao.";
    }
    

    if (empty($errors)) {
        $applicationSent = createMail($contact, $fileTmpName, $fileName);

        if ($applicationSent) {
            http_response_code(200);
        } else {
            $errors[] = "Došlo je do greške. Molimo pokušajte opet, ukoliko se ponovi kontaktirajte nas preko telefona.";
            echo json_encode($errors);
        }
    } else {
        echo json_encode($errors);
        
    }
    

    function createMail ($contactFunc, $fileTmpNameFunc, $fileNameFunc) {
        // Instantiation and passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Server settings
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
            $mail->isSMTP();                                            // Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                    // Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
            $mail->Username   = 'segafrompk@gmail.com';                     // SMTP username
            $mail->Password   = 'qmypwmrnkvylodzy';                               // SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
            $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

            //Recipients
            $mail->setFrom('segafrompk@gmail.com', 'Milan');
            $mail->addAddress('segafrompk@gmail.com', 'Milan');     // Add a recipient

            $mail->addReplyTo($contactFunc['email'], $contactFunc['ime']." ".$contactFunc['prezime']);



            // Attachments
            
            $mail->addAttachment($fileTmpNameFunc, $fileNameFunc);    // Optional name

            $body = <<<MAIL
            Poštovani, zovem se {$contactFunc['ime']} {$contactFunc['prezime']},<br><br>
            U formularu na Vašem web sajtu napisao sam ovo:<br><br>
            {$contactFunc['zasto']}<br><br>
            Možete me kontaktirati preko ovog broja telefona: <b>{$contactFunc['broj']}</b><br>
            ili preko ove e-mail adrese: <a href="mailto:{$contactFunc['email']}"><b>{$contactFunc['email']}</b></a><br><br>
            U prilogu se nalazi i moj CV.<br>
            Pozdrav,<br>
            {$contactFunc['ime']}
            MAIL;

            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = 'Prijava za posao';
            $mail->Body    = $body;
            $mail->AltBody = strip_tags($body);

            $mail->send();
            return true;
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            return false;
        }
    }