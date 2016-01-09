<?php

/**
 * Created by PhpStorm.
 * User: lanhao
 * Date: 16/1/8
 * Time: 下午5:31
 */
class FYUC
{
    const UC_HOST = 'http://127.0.0.1:9528';

    private $_appId = null;

    private $_appKey = null;

    public function __construct($appId,$appKey){
        $this->_appId = $appId;
        $this->_appKey = $appKey;
    }

    private function appInfo(){

    }

    /**
     * @param bool|true $redirect 是否直接跳转,false时将返回 login_url
     */
    public function login($callback,$redirect = true){
        
    }

}

class httpAgent{

    public static function GET($url,$headers = array(),$data = array()){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    public static function POST($url,$headers = array(),$data = array()){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        $CURL_HEADERS = array('Content-Type: application/json');
        if(is_array($headers)){
            foreach($headers as $k=>$v){
                $CURL_HEADERS[] = $k.':'.$v;
            }
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $CURL_HEADERS);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }
}

$r = httpAgent::POST('http://127.0.0.1:9528/index/debug',array(
    'appid'=>1000,
    'appkey'=>'29322987bd616276e8d4da9754cb0903'
),array(
    'a'=>11
));
echo $r.PHP_EOL;