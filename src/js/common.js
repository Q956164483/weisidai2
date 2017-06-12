/*
 * 发送ajax请求
 * @param {string} obj  请求参数
 */
function AJAX(obj){
    var baseUrl = 'http://10.0.5.164:6888/ormrpc/RestServer';
    $.ajax({
        url : (baseUrl+obj.url),
        data : (obj.data?obj.data:''),
        type : (obj.type?obj.type:'GET'),
        contentType: (obj.contentType?obj.contentType:false),
        dataType : 'json',
        success : function(data, status, requestCode, response, xhr){
            console.log(obj.data.method+'>>>'+JSON.stringify(data));
            var errCode = data.code;
            if(errCode == "80302" || errCode == 14504){ //请求为通过mas应用认证时返回14504状态码
                //ueppscript('root', 'content', 'initialize()');
            }else if(errCode == "80901"){
                openToast('服务器异常，请稍后再试','3000','1');
            }else{
                //存在成功回调则执行成功回调
                if(obj.success)
                    obj.success(data, status, requestCode, response, xhr);
            }
        },
        error : function(xhr,erroType,error,msg) {
            if(obj.error){
                obj.error(xhr,erroType,error,msg);
            }else{
                errorCallBack(xhr,erroType,error,msg);
            }
        }
    })
}
/*
 * ajax公用失败回调
 */
function errorCallBack(xhr,erroType,error,msg,URL){
    try{
        appcan.window.resetBounceView(0);
        appcan.window.resetBounceView(1);
    }catch(e){}
    uexWindow.closeToast();
    closeMask();
    checkNet(function(connectSta){
        if(connectSta==-1){
            uexWindow.toast(0, '5', '网络请求失败,请检查您的网络！', 3000);
        }else{
            uexWindow.toast(0, '5', '网络繁忙，请稍后再试', 3000);
        }
    });
}

/**
 * 去除字符串中的空格
 * @param String s
 */
function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 判断是否是空
 * @param value
 */
function isDefine(value){
    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined'){
        return false;
    }
    else{
        value = value+"";
        value = value.replace(/\s/g,"");
        if(value == ""){
            return false;
        }
        return true;
    }
}
/**
 * json对象转为string
 * @param {Object} j
 */
function json2str(j){
    return JSON.stringify(j);
}
/**
 * string转为json对象
 * @param String s
 */
function str2json(s){
    return JSON.parse(s);
}
/**
 * 获取链接后面的参数
 * @param String name 需要获取的参数名字
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    return r != null ? unescape(r[2]) : null;
}
/**
 * 获取元素距离文档顶部的距离
 * @param 
 */
function getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
    return offset;
}
/**
 * 遮罩层
 *  * @param String opacity  遮罩透明度，不传则为0.40
 */
function openMask(opacity){
    if(!document.getElementById("mask")){
        var newMask = document.createElement("div");
        newMask.id = "mask";
        newMask.style.position = "absolute";
        newMask.style.zIndex = "8888888";
        var _scrollWidth = Math.max(document.body.scrollWidth,document.documentElement.scrollWidth);
        var _scrollHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
        newMask.style.width = _scrollWidth + "px";
        newMask.style.height = _scrollHeight + "px";
        newMask.style.top = "0px";
        newMask.style.left = "0px";
        newMask.style.background = '#000';
        newMask.style.opacity = opacity?opacity : '0.40';
        document.body.appendChild(newMask);
    } 
}
function closeMask(){
    if(document.getElementById("mask")){
        document.body.removeChild(document.getElementById("mask"));
    }
}
/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key,value){
    window.localStorage[key] = value;
}
/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key){
    if(window.localStorage[key])
        return window.localStorage[key];
    else
        return "";
}

/**
 * 清除localStorage
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function clearLocVal(key){
    if(key)
        window.localStorage.removeItem(key);
    else
        window.localStorage.clear();
}
/**
 * 滑到底部加载
 * @param String  ele 容器的ID 必传
 * @param String  distance 滚动条距离底部多少px时加载 不传则默认为0
 * @param function  callback 回调函数
 * 调用方法 slideBotLoad('ele', '0', function(){ alert("ok") })
 */
function slideBotLoad(ele, distance, callback){
     var ele = document.getElementById(ele);
     var top1 =  ele.scrollTop;
     var h2 = ele.offsetHeight;
     ele.onscroll = function(event){
        //event.preventDefault(); 
        var h1 = ele.scrollTop;
        var h3 = ele.scrollHeight;
        var top2 = ele.scrollTop;
        //distance = 0;
        if((h1+h2 >= h3)&&(top2-top1>0)){
            callback();
        }
        top1 =  ele.scrollTop;
    }
} 
//input限制
var inputManger = {
    getNum:function(value){
        var newValue = value.replace(/[^0-9]/g,'');
        return newValue;
    },
    testPhone:function(value){
        var r=/^((0\d{2,3}-\d{7,8})|(1[235874]\d{9}))$/;
        return r.test(value);
    },
    getPwd: function(value){
        var newValue = value.replace(/[^0-9a-zA-Z]/g,'');
        return newValue;
    },
    testPwd: function(value){
        
    }
}
//从数组删除指定元素
function deleteContentFromArr(Arr, content){
    var len = Arr.length;
    for(var i=0; i<len; i++) {
        if (Arr[i] == content) {
            Arr.splice(i, 1);
            return;//如果要删除内容全部为content的数据，就删除return
        }
    }
}
//公司介绍页面跳转
 $(".company_list_cont").click(function(){
        var index = $(this).index()+"";
        switch(index){
            case "0":
            location.href="../company_introduction.html";
            break;
             case "1":
            location.href="../environment.html";
            break;
             case "2":
            location.href="../device.html";
            break;
             case "3":
            location.href="news.html";
            break;
             case "4":
            location.href="../expert.html";
            break;
             case "5":
            location.href="../aesthetics_team.html";
            break;
             case "6":
            location.href="../contact_us.html";
            break;
             case "7":
            location.href="news.html";
            break;
        }
    })