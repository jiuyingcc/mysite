/*
 * @Author: sxw s9x9w9@163.com
 * @Date: 2023-06-06 20:50:48
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-06-15 10:24:37
 * @FilePath: \guanwang-new\jy-js\baidu-qiao.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function autot() {
    if (document.readyState == "complete")
        setTimeout(function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                document.getElementById("nb_invite_ok").click();
            }
        }, 2000);
};

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?9baf6faf281a66f89f8697aad1e01989";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

window._agl = window._agl || [];
(function () {
    _agl.push(
        ['production', '_f7L2XwGXjyszb4d1e2oxPybgD']
    );
    (function () {
        var agl = document.createElement('script');
        agl.type = 'text/javascript';
        agl.async = true;
        agl.src = 'https://fxgate.baidu.com/angelia/fcagl.js?production=_f7L2XwGXjyszb4d1e2oxPybgD';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(agl, s);
    })();
})();

// var _hmt = _hmt || [];
// (function () {
//     var hm = document.createElement("script");
//     hm.src = "https://hm.baidu.com/hm.js?9baf6faf281a66f89f8697aad1e01989";
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(hm, s);
// })();

// var _hmt = _hmt || [];
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?1d5d44ed3f0b716b27ba5f2fba63c99f";
//   var s = document.getElementsByTagName("script")[0];
//   s.parentNode.insertBefore(hm, s);
// })();

// var _hmt = _hmt || [];
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?59bb3926c74a8b7fe13ec35d8fb210fb";
//   var s = document.getElementsByTagName("script")[0];
//   s.parentNode.insertBefore(hm, s);
// })();

// window._agl = window._agl || [];
// (function () {
//     _agl.push(
//     ['production', '_f7L2XwGXjyszb4d1e2oxPybgD']
//     );
//     (function () {
//     var agl = document.createElement('script');
//     agl.type = 'text/javascript';
//     agl.async = true;
//     agl.src = 'https://fxgate.baidu.com/angelia/fcagl.js?production=_f7L2XwGXjyszb4d1e2oxPybgD';
//     var s = document.getElementsByTagName('script')[0];
//     s.parentNode.insertBefore(agl, s);
//     })();
// })();