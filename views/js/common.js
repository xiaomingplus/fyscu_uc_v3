/**
 * Created by lanhao on 15/5/17.
 */

(function($){

    var smsHandler = function(){
        var _this = $(this);
        _this.unbind('click');
        var tel = $('#smsTarget').val();
        if(/[0-9]{11,11}/.test(tel)){
            $.post('/access/sms',{
                'tel':tel
            },function(data){
                console.log(data);
                var interval = 60;
                var _t = setInterval(function () {
                    _this.html(interval--);
                    if(interval<0){
                        clearInterval(_t);
                        _this.html('获取');
                        _this.click(smsHandler);
                    }
                },1000);
            });
        }else{
            console.log('error');
        }
    };

    $(document).ready(function(){
        $('#send_btn').click(smsHandler);
    });
})($ || jQuery);