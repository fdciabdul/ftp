
<?php
//
// A very simple PHP example that sends a HTTP POST to a remote site
//

$ch = curl_init();
$headers = [
    "accept: application/json, text/javascript, */*",
    "accept-language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control: no-cache",
    "content-type: application/x-www-form-urlencoded",
    "pragma: no-cache",
    "sec-ch-ua: \"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
    "sec-ch-ua-mobile: ?0",
    "sec-ch-ua-platform: \"Windows\"",
    "sec-fetch-dest: empty",
    "sec-fetch-mode: cors",
    "sec-fetch-site: same-origin",
    "x-requested-with: XMLHttpRequest",
];

curl_setopt($ch, CURLOPT_URL,"https://p-store.net/ajax/check-bank.php");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "bank_code=MEGA&account_number=010430021000599");

// In real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS, 
//          http_build_query(array('postvar1' => 'value1')));

// Receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close ($ch);

// Further processing ...
print_r($server_output);
?>