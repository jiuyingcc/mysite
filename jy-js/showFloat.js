/*
 * @Date: 2023-05-18 18:53:59
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-18 18:59:43
 * @FilePath: \g-官网\guanwang-new\jy-js\showFloat.js
 */
const showFloat = () => {
    const viewHeight = document.documentElement.clientHeight;
    document.onscroll = (e) => {
        if(document.documentElement.scrollTop > viewHeight) {
            document.getElementById('jy-float').style.display = 'block';
        }else {
            document.getElementById('jy-float').style.display = 'none';
        }
    }
}