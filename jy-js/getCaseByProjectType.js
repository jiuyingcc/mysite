/*
 * @Date: 2023-05-17 14:14:43
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-23 09:51:38
 * @FilePath: \guanwang-new\jy-js\getCaseByProjectType.js
 */
// 获取 解决方案 的精选案例
// 获取案例根据解决方案类型
getCaseByProjectType = (type) => {
  tpj.post({
    url: `${baseUrl}getJiuyingCasesByProjectType`,
    data: {
      pageNo: 1,
      pageSize: 1000,
      type,
    },
    success: function (res) {
      let casesList = res.data; // 数据
      let str = ""; // 定义一个空字符串存放模板
      const showCases = document.getElementById("showCases"); // 获取外层盒子dom
      casesList.forEach( item => {
        // 根据数据渲染
        str += `<article class="portfolio-item col-lg-4 col-md-4 col-sm-6 col-12 pf-illustrations">
                    <div class="jy-article-img portfolio-image">
                        <a href="${item.htmlUrl}">
                            <img src="${item.caseImg}">
                        </a>
                    </div>
                    <div class="portfolio-desc">
                        <h4 style="font-weight: normal;">${item.caseName}</h4>
                    </div>
                </article>`;
      });
      showCases.innerHTML = str;
    },
  });
};
