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

    private $_account = null;

    private  $_token = null;

    public function __construct($appId,$appKey){
        $this->_appId = $appId;
        $this->_appKey = $appKey;
    }

    private function appInfo(){

    }

    /**
     * @param bool|true $redirect 是否直接跳转,false时将返回 login_url
     * @return string url
     */
    public function login($callback,$redirect = true){
        $url = self::UC_HOST.'/?appId='.$this->_appId.'&callback='.urlencode($callback);
        if($redirect){
            header('location:'.$url);
        }else{
            return $url;
        }
    }

    public function processCallback(){
        $this->_account = $_GET['account'];
        $this->_token = $_GET['token'];
        if($this->_account && $this->_token){
            return true;
        }else{
            return false;
        }
    }

    public function getUserInfo($path){
        $url = self::UC_HOST.'/api';
        $ret = httpAgent::GET($url,array(
            'appid'=>$this->_appId,
            'appkey'=>$this->_appKey,
            'account'=>$this->_account,
            'token'=>$this->_token
        ),array(
            'path'=>$path
        ));
        return $ret;
    }
}

class httpAgent{

    public static function GET($url,$headers = array(),$data = array()){
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

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

$r = new FYUC(1000,'29322987bd616276e8d4da9754cb0903');
$_GET = array(
    'account'=>'18688124774',
    'token'=>'c5d224579e296603cb1e4d30483e3842'
);
$r->processCallback();

var_dump($r->getUserInfo('/contact/tel'));