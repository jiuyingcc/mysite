/*
 * @Author: sxw s9x9w9@163.com
 * @Date: 2023-03-20 14:27:10
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-03-21 20:16:25
 * @FilePath: \DEMO2-20230317\jy-js\tempCase.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 废弃



// 案例是否显示
let isShowTempCases = false;
let caseStr = ''; // 案例 item DOM
let typeStr = ''; // 类型 item DOM
const casesShow = document.getElementById('portfolio'); // 案例列表盒子DOM
const casesFilter = document.getElementById('cases-filter'); // 案例类型盒子DOM

// 首屏数据
getTempCases = () => {
    let caseList = tempTopCaseList;

    typeStr += ` <li class="activeFilter"><a style="padding: 10px 13px;" id="activeFilter" data-filter=".jyzqxxhxt" href="javaScript:void(0);">精选案例</a></li>`;
// 案例列表渲染模板
for (let i = 0; i < caseList.length; i++) {
    caseStr += `<article class="portfolio-item col-lg-3 col-md-4 col-sm-6 col-12 pf-illustrations jyzqxxhxt">
                        <div class="jy-article-img portfolio-image">
                            <a href="portfolio-single.html">
                                <img src="${caseList[i].caseImg}">
                            </a>
                        </div>
                        <div class="portfolio-desc">
                            <h4 style="font-weight: normal;">${caseList[i].caseName}</h4>
                        </div>
                </article>`;
}
// 根据类型获取案例
getTempCasesByType();
}
// 根据类型获取案例列表(一次性获取全部)
getTempCasesByType = () => {
    let tempList = tempOtherCaseList; // 案例类型列表数据
    let caseTypeList = Object.entries(tempList).map(([key, value], index) => ({
        title: key,
        key: 'jytemptype' + index,
        value
    })) // 改造数据结构

    for (let j = 0; j < caseTypeList.length; j++) {
        let caseListByType = caseTypeList[j].value; // 案例列表
        // 分类列表渲染模板
        typeStr += ` <li class=""><a style="padding: 10px 13px;" onclick="showTempCase()" href="#" data-filter=".${caseTypeList[j].key}">${caseTypeList[j].title}</a></li>`;
        // 案例列表渲染模板
        for (let i = 0; i < caseListByType.length; i++) {
            caseStr += `<article class="portfolio-item col-lg-3 col-md-4 col-sm-6 col-12 pf-illustrations ${caseTypeList[j].key} tempClass">
                            <div class="jy-article-img portfolio-image">
                                <a href="portfolio-single.html">
                                    <img src="${caseListByType[i].caseImg}">
                                </a>
                            </div>
                            <div class="portfolio-desc">
                            <h4 style="font-weight: normal;">${caseListByType[i].caseName}</h4>
                            </div>
                    </article>`;
        }
    }
    casesFilter.innerHTML += typeStr;
    casesShow.innerHTML += caseStr;
    // 展示dom
    // casesShow.classList.remove('tempClass');
}
// 展示案例
showTempCase = () => {
    // 避免重复执行
    if (isShowTempCases) return;
    let noshowcase = document.querySelectorAll('.tempClass');
    for (let i = 0; i < noshowcase.length; i++) {
        noshowcase[i].classList.remove('tempClass');
    }
    // 全局变量
    isShowTempCases = true;
}