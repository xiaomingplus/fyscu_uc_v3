<?php
/**
 * Created by PhpStorm.
 * User: lanhao
 * Date: 16/3/9
 * Time: 下午6:08
 */

namespace Blues;


class HttpClient
{
    //curl handler
    private $ch = null;

    public static $instance = null;

    public function __construct() {
        $this->ch = curl_init();
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($this->ch, CURLOPT_TIMEOUT,10);
    }

    public function __destruct()
    {
        curl_close($this->ch);
    }

    public static function getInstance(){
        if(self::$instance === null){
            self::$instance = new HttpClient();
        }
        return self::$instance;
    }

    /**
     * @param $data array headers数组
     * @return $this
     */
    public function headers($data){
        if(is_array($data) && count($data)){
            $headers = [];
            foreach($data as $key=>$value){
                $headers[] = $key.':'.$value;
            }
            curl_setopt($this->ch, CURLOPT_HTTPHEADER, $headers);
        }
        return $this;
    }

    /**
     * @param $data mixed request body
     * @return $this
     */
    public function body($data){
        if(is_array($data)){
            $data = json_encode($data);
        }
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $data);
        return $this;
    }

    /**
     * @param $url
     * @return mixed
     */
    public function get($url){
        curl_setopt($this->ch, CURLOPT_URL, $url);
        curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, "GET");
        return curl_exec($this->ch);
    }

    /**
     * @param $url
     * @return mixed
     */
    public function post($url){
        curl_setopt($this->ch, CURLOPT_URL, $url);
        curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, "POST");
        return curl_exec($this->ch);
    }


}
/*
USAGE

$ret = HttpClient::getInstance()
        ->headers(['content-type'=>'any'])
        ->body(['a'=>'b'])
        ->post('http://127.0.0.1:3001?_t=123');

*/