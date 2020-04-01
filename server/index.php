<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function ($request, $response, $args) {
    // if(isset($_GET['code'])){
    //     $code = $_GET['code'];
    //     $url = 'http://104.211.140.20:3000/?code='. $code;
    //     // $user_data = json_encode(main());
        
    //     // $response->getBody()->write($user_data);
    //     // return $response
    //     //   ->withHeader('Content-Type', 'application/json');
       
    //     return $response
    //         ->withHeader('Location', $url);
    // }else{
        
    // }
    
    $file = __DIR__.'/index.html';
    echo file_get_contents($file);
    if (file_exists($file)) {
        $response->getBody()->write(file_get_contents($file));
        $response = $response->withHeader('Content-Type', 'text/html');
        return $response;
    }else{
        $response->getBody()->write("Some thing break down try reloading");
        return $response;
    }
    
});

$app->get('/login', function ($request, $response, $args) {
    return $response
        ->withHeader('Location', 'https://api.codechef.com/oauth/authorize?response_type=code&client_id=339259dc16c29a7f4dae446ec5a873b0&state=xyz&redirect_uri=http://104.211.140.20:80/')
        ->withStatus(302);
});

$app->get('/auth/', function ($request, $response, $args) {
    if(isset($_GET['code'])){
        $payload = json_encode(main());
        $response->getBody()->write($payload);
        return $response
          ->withHeader('Content-Type', 'application/json');
    }
    
});

$app->get('/contests/{userName}', function ($request, $response, $args) {
    $payload = json_encode(make_contests_list_api_request($args['userName']));
    $response->getBody()->write($payload);
    return $response
      ->withHeader('Content-Type', 'application/json');;
});

$app->get('/contests/{contestCode}/{userName}', function ($request, $response, $args) {
    $payload = json_encode(make_contest_details_api_request($args['userName'], $args['contestCode']));
    $response->getBody()->write($payload);
    return $response
      ->withHeader('Content-Type', 'application/json');
});

$app->get('/rankings/{contestCode}/{userName}', function ($request, $response, $args) {
    $payload = json_encode(make_contest_ranklist_api_request($args['userName'], $args['contestCode']));
    $response->getBody()->write($payload);
    return $response
      ->withHeader('Content-Type', 'application/json');
});

$app->get('/contests/{contestCode}/problems/{problemCode}/{userName}', function ($request, $response, $args) {
    $payload = json_encode(make_contest_problem_api_request($args['userName'], $args['problemCode'], $args['contestCode']));
    $response->getBody()->write($payload);
    return $response
      ->withHeader('Content-Type', 'application/json');;
});

$app->get('/submissions/{problemId}/{userName}', function ($request, $response, $args) {
    $payload = json_encode(make_submissions_api_request($args['userName'], $args['problemId']));
    $response->getBody()->write($payload);
    return $response
      ->withHeader('Content-Type', 'application/json');;
});

/* ******************************************************ROUTES ENDED************************************************************ */

function make_submissions_api_request($user_name, $problem_ID){
    $config = get_config();
    $path = $config['api_endpoint']."submissions/?result=AC&problemCode=".$problem_ID;
    $response = json_decode(make_api_request($user_name, $path));
    return $response;
}

function make_contest_problem_api_request($user_name, $problem_code, $contest_code){
    $config = get_config();
    $path = $config['api_endpoint']."contests/".$contest_code."/problems/".$problem_code;
    $response = json_decode(make_api_request($user_name, $path));
    return $response;
}

function make_contest_ranklist_api_request($user_name, $contest_code){
    $config = get_config();
    $path = $config['api_endpoint']."rankings/".$contest_code;
    $response = json_decode(make_api_request($user_name, $path));
    return $response;
}

function make_contests_list_api_request($user_name){
    $config = get_config();
    $path = $config['api_endpoint']."contests";
    $response = json_decode(make_api_request($user_name, $path));
    return $response;
}

function make_contest_details_api_request($user_name, $contest_code){
    $config = get_config();
    $path = $config['api_endpoint']."contests/".$contest_code;
    $response = json_decode(make_api_request($user_name, $path));
    return $response;
}

//updates or inserts the user username accessToken and refreshToken
function update_or_set_user_details_to_db($oauth_details, $user_name){
    include __DIR__."/app/database/dbconnect.php";
    
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    } 
    $access_token = $oauth_details['access_token'];
    $refresh_token = $oauth_details['refresh_token'];
    
    $sql = "SELECT * FROM userInfo WHERE userName='".$user_name."'";
    $user_query = mysqli_query($mysqli, $sql);
    // echo json_encode($user_query);
    if ($user_query->num_rows != null) {
        
        $sql = "UPDATE `userInfo` SET `accessToken` = '".$access_token."', `refreshToken` = '".$refresh_token."' WHERE `userName` = '".$user_name."'";
    
        if (mysqli_query($mysqli, $sql)) {
            $query = "SELECT * FROM userInfo";
            // echo "Record Updated successfully";
            // echo json_encode(mysqli_query($mysqli, $query)->fetch_assoc());
        } else {
            echo "Error: " . $sql . "" . mysqli_error($mysqli);
        }
    } else {
    
        $sql = "INSERT INTO `userInfo`(userName, accessToken, refreshToken)VALUES ('".$user_name."', '".$access_token."', '".$refresh_token."')";
    
        if (mysqli_query($mysqli, $sql)) {
            $query = "SELECT * FROM userInfo";
            // echo "New record created successfully";
            // echo json_encode(mysqli_query($mysqli, $query)->fetch_assoc());
        } else {
            echo "Error: " . $sql . "" . mysqli_error($mysqli);
        }
    }
    
    $mysqli->close();   
}

//Returns oauth details saved in db
function get_oauth_details_from_db($user_name){
    include __DIR__."/app/database/dbconnect.php";
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    $sql = "SELECT accessToken, refreshToken FROM userInfo where userName = '".$user_name."'";

    $data = mysqli_query($mysqli, $sql)->fetch_assoc();
    $oauth_details = array(
        'authorization_code' => '',
        'access_token' => $data['accessToken'],
        'refresh_token' => $data['refreshToken']
    );
    return $oauth_details;

}

function make_api_request($user_name, $path){
    $oauth_details = get_oauth_details_from_db($user_name);
    $oauth_details = generate_access_token_from_refresh_token($oauth_details);
    update_or_set_user_details_to_db($oauth_details, $user_name);
    $headers[] = 'Authorization: Bearer ' . $oauth_details['access_token'];
    return make_curl_request($path, false, $headers);
}

function make_curl_request($url, $post = FALSE, $headers = array()){
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    if ($post) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
    }

    $headers[] = 'content-Type: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    return $response;
}

// Return config details whereever required
function get_config(){
    $config = array('client_id'=> '339259dc16c29a7f4dae446ec5a873b0',
    'client_secret' => '4ec05f3bc1e5cca3b602a400d9c24b39',
    'api_endpoint'=> 'https://api.codechef.com/',
    'authorization_code_endpoint'=> 'https://api.codechef.com/oauth/authorize',
    'access_token_endpoint'=> 'https://api.codechef.com/oauth/token',
    'redirect_uri'=> 'http://104.211.140.20:80/',
    'website_base_url' => 'http://104.211.140.20:80/');

    return $config;
}

function get_current_user_data($config, $oauth_details){
    $path = $config['api_endpoint']."users/me";
    $headers[] = 'Authorization: Bearer ' . $oauth_details['access_token'];
    return make_curl_request($path, false, $headers);
}

//Generated new access token with the refresh token and returns oauth details
function generate_access_token_from_refresh_token($oauth_details){
    $config = get_config();
    $oauth_config = array(
        'grant_type' => 'refresh_token',
        'refresh_token'=> $oauth_details['refresh_token'], 
        'client_id' => $config['client_id'],
        'client_secret' => $config['client_secret']
    );
    $response = json_decode(make_curl_request($config['access_token_endpoint'], $oauth_config), true);
    $result = $response['result']['data'];
    
    $oauth_details['access_token'] = $result['access_token'];
    $oauth_details['refresh_token'] = $result['refresh_token'];
    $oauth_details['scope'] = $result['scope'];

    return $oauth_details;

}

//generates access token for the first time
function generate_access_token_first_time($config, $oauth_details){
    $oauth_config = array('grant_type' => 'authorization_code', 'code'=> $oauth_details['authorization_code'], 'client_id' => $config['client_id'],
                          'client_secret' => $config['client_secret'], 'redirect_uri'=> $config['redirect_uri']);
    $response = json_decode(make_curl_request($config['access_token_endpoint'], $oauth_config), true);
    $result = $response['result']['data'];

    $oauth_details['access_token'] = $result['access_token'];
    $oauth_details['refresh_token'] = $result['refresh_token'];
    $oauth_details['scope'] = $result['scope'];

    return $oauth_details;
}

function take_user_to_codechef_permissions_page($config){

    $params = array('response_type'=>'code', 'client_id'=> $config['client_id'], 'redirect_uri'=> $config['redirect_uri'], 'state'=> 'xyz');
    header('Location: ' . $config['authorization_code_endpoint'] . '?' . http_build_query($params));
    // $app->redirect('/login', 'https://api.codechef.com/oauth/authorize?response_type=code&client_id=ad65745b99e00211dd613e8bb4cd9a76&state=xyz&redirect_uri=http://104.211.140.20:88/', 301);
    die();
}

//This function is for first time login purpose
function main(){
    $config = get_config();
    
    $oauth_details = array(
        'authorization_code' => '',
        'access_token' => '',
        'refresh_token' => ''
    );
    
    $oauth_details['authorization_code'] = $_GET['code'];
    $oauth_details = generate_access_token_first_time($config, $oauth_details);
    $user_data = get_current_user_data($config, $oauth_details);
    $user_data_json = json_decode($user_data);
    $user_name = $user_data_json->result->data->content->username;
    update_or_set_user_details_to_db($oauth_details, $user_name);

    return $user_data_json;

}

$app->run();
