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

    private $_http_headers = array();

    public function __construct($appId,$appKey){
        $this->_appId = $appId;
        $this->_appKey = $appKey;
        $this->_http_headers['appid'] = $appId;
        $this->_http_headers['appkey'] = $appKey;
    }

    private function appInfo(){

    }

    /**
     * @param bool|true $redirect 是否直接跳转,false时将返回 login_url
     * @return string url
     */
    public function loginUrl($callback,$redirect = true){
        $url = self::UC_HOST.'/?appId='.$this->_appId.'&callback='.urlencode($callback);
        if($redirect){
            header('location:'.$url);
        }else{
            return $url;
        }
    }

    /**
     * @return bool
     */
    public function processCallback(){
        $this->_account = $_GET['account'];
        $this->_token = $_GET['token'];
        if($this->_account && $this->_token){
            $this->_http_headers['account'] = $this->_account;
            $this->_http_headers['token'] = $this->_token;
            return true;
        }else{
            return false;
        }
    }

    /**
     * @param $path dPath
     * @return mixed
     */
    public function getUserInfo($path){
        $url = self::UC_HOST.'/api';
        $ret = httpAgent::GET($url,$this->_http_headers,array(
            'path'=>$path
        ));
        return $ret;
    }

    /**
     * @param $path dPath
     * @param $data string|number|mixed
     * @return boolean
     */
    public function modifyUserInfo($path,$data){
        $url = self::UC_HOST.'/api';
        $ret = httpAgent::PUT($url,$this->_http_headers,array(
            'path'=>$path,
            'data'=>$data
        ));
        return $ret;
    }

    /**
     * @param $path
     * @param $data
     * @return mixed
     */
    public function appendUserInfo($path,$data){
        $url = self::UC_HOST.'/api';
        $ret = httpAgent::POST($url,$this->_http_headers,array(
            'path'=>$path,
            'data'=>$data
        ));
        return $ret;
    }

    public function deleteUserInfo($path){
        $url = self::UC_HOST.'/api';
        $ret = httpAgent::DELETE($url,$this->_http_headers,array(
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

        curl_setopt($ch, CURLOPT_TIMEOUT,10);

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

        curl_setopt($ch, CURLOPT_TIMEOUT,10);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
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

    public static function PUT($url,$headers = array(),$data = array()){
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_TIMEOUT,10);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
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

    public static function DELETE($url,$headers = array(),$data = array()){
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_TIMEOUT,10);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");

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

//var_dump($r->getUserInfo('/contact/tel'));

//var_dump($r->deleteUserInfo('/contact/tel/2'));