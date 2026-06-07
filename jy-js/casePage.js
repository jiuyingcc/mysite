/*
 * @Date: 2023-05-17 14:14:43
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-23 09:51:01
 * @FilePath: \guanwang-new\jy-js\casePage.js
 */
// 案例列表页 

let caseStr = ''; // 案例 item DOM
let typeStr = ''; // 类型 item DOM
const casesShow = document.getElementById('customPortfolio'); // 案例列表盒子DOM
const casesFilter = document.getElementById('cases-filter'); // 案例类型盒子DOM

// 获取案例参数
const formdata = {
    pageNo: 1,
    pageSize: 21,
    type: 0,
};
// 分页器部分
let pageOffset = 5;
// 数据总数
let total = null;

// 首屏数据
const showFirstCaseData = type => {
    const params = new URLSearchParams(window.location.search);
    const caseTypeId = params.get('caseTypeId');
    const casePageNo = params.get('casePageNo');
    // if(type !== window.sessionStorage.getItem('saveTypeId')) {
    //     formdata.pageNo = 1;
    //     window.sessionStorage.setItem('savePageNo', 1);
    // }
    // window.sessionStorage.setItem('saveTypeId', type);
    if(caseTypeId || (caseTypeId === 0)) {
        formdata.type = caseTypeId;
        formdata.pageNo = casePageNo || 1;
    } else {
        formdata.type = type;
    }
    typeStr = `<li class="${formdata.type == 0 ? 'activeFilter' : ''}"><a style="padding: 10px 13px;" id="activeFilter" onclick="getCaseData(0)" data-filter="*" href="javaScript:void(0);">精选案例</a></li>`;
    getCaseType();
    getCaseListByType(type);
}

const getCaseData = type => {
    if((type || (type === 0)) && (type !== formdata.type)) formdata.pageNo = 1;
    if(type || (type === 0)) formdata.type = type;
    const url = window.location.origin + window.location.pathname;
    const newUrl = url + '?caseTypeId=' + formdata.type + '&casePageNo=' + formdata.pageNo;
    history.pushState('', '', newUrl);
    typeStr = `<li class="${formdata.type == 0 ? 'activeFilter' : ''}"><a style="padding: 10px 13px;" id="activeFilter" onclick="getCaseData(0)" data-filter="*" href="javaScript:void(0);">精选案例</a></li>`;
    getCaseType();
    getCaseListByType(type);
}

// 获取案例类型
const getCaseType = () => {
    tpj.post({
        url: `${baseUrl}getJiuyingTypes`,
        success: res => {
            const gameCaseType = ['政企信息化系统', '数据可视化 · 3D展示', '元宇宙 · AI · 区块链', '微信/小程序', '教育教学系统', '新零售电商', '品牌营销H5', '移动App', '品牌网站定制'];
            res.data = res.data.filter(item => gameCaseType.includes(item.typeName));
            // 监听点击事件触发 showFirstCaseData函数， 参数为id
            res.data.forEach(item => {
                typeStr += `<li class="${formdata.type == item.id ? 'activeFilter' : ''}"><a style="padding: 10px 13px;" id="activeFilter" onclick="getCaseData('${item.id}')" href="javaScript:void(0);">${item.typeName}</a></li>`;
            })
            casesFilter.innerHTML = typeStr;
        }
    })
}

// 通过类型获取案例
const getCaseListByType = () => {
    tpj.post({
        url: `${baseUrl}${formdata.type == 0 ? 'getJiuyingCasesByPage' : 'getJiuyingCasesByType'}`,
        data: formdata,
        success: res => {
            caseStr = ''; // 清空缓存
            total = res.count;
            res.data.forEach(item => {
                caseStr += `
                <article class="portfolio-item col-lg-4 col-md-4 col-sm-6 col-12 pf-illustrations">
                        <div class="jy-article-img portfolio-image">
                            <a href="${item.htmlUrl}">
                                <img src="${item.caseImg}">
                            </a>
                        </div>
                        <div class="portfolio-desc">
                            <h4 style="font-weight: normal;">${item.caseName}</h4>
                        </div>
                </article>
                `;
            });
            casesShow.innerHTML = `
            <div id="portfolio" class="portfolio row grid-container" data-layout="fitRows">
                ${caseStr}         
            </div>
            `;
            pageBar();
        }
    })
}

// 分页器
const pageBarItem = (page, active) => {
    return `<li class="page-item ${active ? 'active' : ''}"><a class="page-link" href="javascript:;">${page}</a></li>`
}
const pageBar = () => {
    console.log(
        formdata.pageNo,
    );
    let pageHtml = ``;
    let totalPages = Math.ceil(total / formdata.pageSize);
    console.log(total);
    let startPage = Math.max(1, formdata.pageNo - pageOffset);
    let endPage = 0;
    // formdata.pageNo < 5 ? endPage = totalPages : endPage = Math.min(totalPages, formdata.pageNo + pageOffset);
    if(totalPages > 10){
        if (formdata.pageNo < pageOffset) {
            endPage = 10
        } else {
            // 尾页10条处理
            if (totalPages>10&&formdata.pageNo>pageOffset) endPage = Math.min(totalPages, formdata.pageNo + pageOffset) - 1;
            else endPage = Math.min(totalPages, formdata.pageNo + pageOffset);
            
            if ((totalPages - formdata.pageNo) < pageOffset) startPage = totalPages - 10;
        }
    }else{
        startPage = 1;
        formdata.pageNo < 5 ? endPage = totalPages : endPage = Math.min(totalPages, formdata.pageNo + pageOffset);
    }
    for (var i = startPage; i <= endPage; i++) {
        pageHtml += pageBarItem(i, i == formdata.pageNo)
    }
    if(totalPages > 1) {
        document.getElementById("pagination").innerHTML = `<li id="prePage" class="page-item"><a class="page-link" href="javascript:;" aria-label="Previous"> <span aria-hidden="true">&laquo;</span></a></li>` + pageHtml + `<li id="nextPage" class="page-item"><a class="page-link" href="javascript:;" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`;
    } else {
        document.getElementById("pagination").innerHTML = '';
    }
    

    let pageNodes = document.getElementById('pagination').children;
    pageNodes = Array.from(pageNodes);
    pageNodes.forEach((item, index) => {
        item.addEventListener("click", (e) => {
            if (index == 0) formdata.pageNo == 1 ? '' : formdata.pageNo = formdata.pageNo - 1;
            else if (index == pageNodes.length - 1) formdata.pageNo < Math.ceil(total / formdata.pageSize) ? formdata.pageNo = formdata.pageNo + 1 : '';
            else {
                // window.sessionStorage.setItem('savePageNo', Number(e.target.innerHTML));
                formdata.pageNo = Number(e.target.innerHTML);
            }
            // getCaseListByType();
            getCaseData();
        })
    })
}