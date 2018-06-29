<?php
include_once "definitions.php";

/*
* br() is a function used to create line breaks in HTML.
*/
function br() {return "<br>";}

/*
* dump() is a function used print out variables. used in debugging/testing.
*/
function dump($v) { echo var_dump($v); }

/*
* readFromFile() is a function used to read the contents of a CSV file.
*/
function readFromFile($filename) {
	$contents = [];
	$file = fopen($filename, "r") or die("file not found.");
	while(!feof($file)) {
		$contents[] = fgetcsv($file);
	}
	fclose($file);
	return $contents;
}

/*
* getHTML() is a function which collects the HTML data from a given URL.
*/
function getHTML($url) {
    //trim the url
    $url = trim($url);
    //begin the collection.
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true); 
	curl_setopt($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt($curl, CURLOPT_REFERER, 'http://www.google.com'); 
	curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0');
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($curl);
    //check for errors.
	if(curl_error($curl)) {
		echo 'error: '.curl_error($curl).br().$url.br();
    }
    //close the connection.
	curl_close($curl);
	
	return $result;
}

/**
* sec_session_start() begins a new PHP session, except doesn't call the native session_start()
* function in PHP upon every page loading. It is only called once.
*/
function sec_session_start() {
    $session_name = 'sec_session_id';   // Set a custom session name 
    $secure = SECURE;
    // This stops JavaScript being able to access the session id.
    $httponly = true;
    // Forces sessions to only use cookies.
    if (ini_set('session.use_only_cookies', 1) === FALSE) {
        header("Location: ../error.php?err=Could not initiate a safe session (ini_set)");
        exit();
    }
    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);
    // Sets the session name to the one set above.
    session_name($session_name);
    session_start();            // Start the PHP session 
    session_regenerate_id();    // regenerated the session, delete the old one. 
}

/**
* login() is used to collect and verify the user's data to see if they are eligible to login.
*/
function login($email, $password, $mysqli) {
    // Using prepared statements means that SQL injection is not possible. 
    if ($stmt = $mysqli->prepare("SELECT id, username, password FROM members WHERE email = ? LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();
 
        // get variables from result.
        $stmt->bind_result($user_id, $username, $db_password);
        $stmt->fetch();
 
        if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked 
                // Send an email to user saying their account is locked
                return false;
            } 
			else {
                // Check if the password in the database matches
                // the password the user submitted. We are using
                // the password_verify function to avoid timing attacks.
                if (password_verify($password, $db_password)) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;
                    // XSS protection as we might print this value
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);
                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', $db_password . $user_browser);
                    // Login successful.
                    return true;
                } 
				else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts(user_id, time) VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } 
		else {
            // No user exists.
            return false;
        }
    }
}

/**
* checkbrute() is used to prevent brute force logins.
*/
function checkbrute($user_id, $mysqli) {
    // Get timestamp of current time 
    $now = time();
 
    // All login attempts are counted from the past 2 hours. 
    $valid_attempts = $now - (2 * 60 * 60);
 
    if ($stmt = $mysqli->prepare("SELECT time FROM login_attempts WHERE user_id = ? AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
 
        // Execute the prepared query. 
        $stmt->execute();
        $stmt->store_result();
 
        // If there have been more than 5 failed logins 
        if ($stmt->num_rows > 5) return true;
        return false;
    }
}

/**
* login_check() simply checks to see if the user is logged in on this session.
*/
function login_check($mysqli) {
    // Check if all session variables are set 
    if(isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['login_string'])) {
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $username = $_SESSION['username'];
 
        // Get the user-agent string of the user.
        $user_browser = $_SERVER['HTTP_USER_AGENT'];
 
        if($stmt = $mysqli->prepare("SELECT password FROM members WHERE id = ? LIMIT 1")) {
            // Bind "$user_id" to parameter. 
            $stmt->bind_param('i', $user_id);
            $stmt->execute();   // Execute the prepared query.
            $stmt->store_result();
 
            if($stmt->num_rows == 1) {
                // If the user exists get variables from result.
                $stmt->bind_result($password);
                $stmt->fetch();
                $login_check = hash('sha512', $password . $user_browser);
 
                if (hash_equals($login_check, $login_string)) return true;
                return false;
            } 
			else {
                // Not logged in 
                return false;
            }
        } 
		else {
            // Not logged in 
            return false;
        }
    } 
	else {
        // Not logged in 
        return false;
    }
}

/**
* esc_url() prevents any nasty injections into the URL during login. This strips out any 
* unnecessary characters.
*/
function esc_url($url) {
    if ('' == $url) return $url;
    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;
    $count = 1;
    while ($count) $url = str_replace($strip, '', $url, $count);

    $url = str_replace(';//', '://', $url);
    $url = htmlentities($url);
    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);
 
	// We're only interested in relative links from $_SERVER['PHP_SELF']
    if ($url[0] !== '/') return '';
	return $url;
}
?>