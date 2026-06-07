/*
 * @Author: sxw s9x9w9@163.com
 * @Date: 2023-03-17 17:34:33
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-06-15 14:41:23
 * @FilePath: \guanwang-new\jy-js\home.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 获取首页资讯
getHomeArticles = function () {
	
	console.log("首页资讯");
	tpj.post({
		url: `${baseUrl}getMainArticles`,
		success: (res) => {
			let articleList = res.data.slice(0, 4); // 数据
			let str = ''; // 定义一个空字符串存放模板
			const jyarticle = document.getElementById('jyarticle'); // 获取外层盒子dom
			articleList.forEach((item) => {
				str += `<div class="col-lg-3 col-md-6">
                        <div class="entry">
                            <div class="entry-image jy-article-img">
                                <a href="${item.htmlUrl}">
                                    <img style="height: 11rem; object-fit: cover;" data-src="${item.articleMain}" alt="Image" class="rounded lozad" loading="lazy">
                                </a>
                            </div>
                            <div class="entry-title title-xs text-transform-none px-2" style="min-height: 3rem;">
                                <h3><a href="blog-single.html">${item.articleTitle}</a></h3>
                            </div>
                            <div class="entry-meta px-2">
                                <ul>
                                <li><i class="uil uil-schedule"></i>${item.createDate}</li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
			}); // 根据数据渲染

			// setTimeout(() => {
			jyarticle.innerHTML = str;
			const observer = lozad();
			observer.observe(jyarticle);
			
		},
	});
};

// 获取精选案例列表
/*
 *tips:
 *为了保留框架渲染动画，需要适应框架渲染逻辑；
 *框架渲染逻辑为 根据点击分类按钮所绑定的 data-filter 去渲染拥有同名类名的dom;
 */
// 案例是否显示
let isShowCases = false;
let caseStr = ''; // 案例 item DOM
let typeStr = ''; // 类型 item DOM
// const casesShow = document.getElementById('portfolio'); // 案例列表盒子DOM
const casesShow = document.getElementById('customPortfolio'); // 案例列表盒子DOM
const casesFilter = document.getElementById('cases-filter'); // 案例类型盒子DOM

const caseTypeList = ['精选案例', '政企信息化系统', '数据可视化 · 3D展示', '元宇宙 · AI · 区块链', '微信/小程序', '教育教学系统', '新零售电商', '品牌营销H5', '移动App', '品牌网站定制'];
let caseListMap = {};
// 首屏数据(精选案例)
getHomeCases = () => {
	tpj.post({
		url: `${baseUrl}getJiuyingCasesByPage`,
		data: {
			pageNo: 1,
			pageSize: 9,
		},
		success: (res) => {			
			caseListMap = { '精选案例': res.data.reverse() };
			// let topCaseList = res.data;

			// typeStr = `<li class="activeFilter"><a style="padding: 10px 13px;" id="activeFilter" data-filter=".jyzqxxhxt" href="javaScript:void(0);">精选案例</a></li>`;
			// 案例列表渲染模板
			// topCaseList.forEach((item) => {
			// 	caseStr += `
      //               <article class="portfolio-item col-lg-4 col-md-4 col-sm-6 col-12 pf-illustrations jyzqxxhxt">
      //                   <div class="jy-article-img portfolio-image">
      //                       <a href="${item.htmlUrl}">
      //                           <img style="aspect-ratio: 3/2;" data-src="${item.caseImg}" class="lozad" loading="lazy">
      //                       </a>
      //                   </div>
      //                   <div class="portfolio-desc">
      //                       <h4 style="font-weight: normal;">${item.caseName}</h4>
      //                   </div>
      //               </article>
      //           `;
			// });
			// // 根据类型获取案例
			getCasesType();
		},
	});
};

getCasesType = () => {
	tpj.post({
		url: `${baseUrl}getJiuyingCasesByIndex`,
		success: (res) => {
			for (let key in res.data) {
				if (caseTypeList.includes(key)) {
					res.data[key].reverse().slice(0, 9);
				} else {
					delete res.data[key];
				}
			}
			caseListMap = { ...caseListMap, ...res.data };
			changeCaseBytype('精选案例');
		},
	});
};

changeCaseBytype = (key) => {	
	caseStr = '';
	typeStr = '';
	const list = caseListMap[key];
	caseTypeList.forEach(item => {
		typeStr += `<li class="${key == item ? 'activeFilter' : ''}"><a style="padding: 10px 13px;" onclick="changeCaseBytype('${item}')" href="javaScript:void(0);">${item}</a></li>`;
	})
	list.forEach((item) => {
		caseStr += `
								<article class="portfolio-item col-lg-4 col-md-4 col-sm-6 col-12 pf-illustrations jyzqxxhxt">
										<div class="jy-article-img portfolio-image">
												<a href="${item.htmlUrl}">
														<img style="aspect-ratio: 3/2;" data-src="${item.caseImg}" class="lozad" loading="lazy">
												</a>
										</div>
										<div class="portfolio-desc">
												<h4 style="font-weight: normal;">${item.caseName}</h4>
										</div>
								</article>
						`;
	});
	casesFilter.innerHTML = typeStr;
	// casesShow.innerHTML = caseStr;
	casesShow.innerHTML = `
		<div id="portfolio" class="portfolio row grid-container" data-layout="fitRows">
				${caseStr}         
		</div>
	`;
	const observer = lozad();
	observer.observe(casesShow);
}

// 展示案例
showCase = () => {
	// 避免重复执行
	if (isShowCases) return;
	let noshowcase = document.querySelectorAll('.tempClass');
	for (let i = 0; i < noshowcase.length; i++) {
		noshowcase[i].classList.remove('tempClass');
	}
	// 全局变量
	isShowCases = true;
};

// 合作伙伴轮播图
function setHomeSwiper() {
	const arr2 = ['image-jy/index/logo_cjdx.png', 'image-jy/index/logo_dym.png', 'image-jy/index/logo_gq.png', 'image-jy/index/logo_hjjsdx.png', 'image-jy/index/logo_shdq.png', 'image-jy/index/logo_shjgjt.png', 'image-jy/index/logo_shjgjt2.png', 'image-jy/index/logo_sqdz.png', 'image-jy/index/logo_tjdx.png', 'image-jy/index/logo_ybx.png'];
	const arr1 = ['image-jy/index/logo_hzzyjt.png', 'image-jy/index/logo_hp.png', 'image-jy/index/logo_kb.png', 'image-jy/index/logo_shkjg.png', 'image-jy/index/logo_ctxy.png', 'image-jy/index/logo_ww.png', 'image-jy/index/logo_mn.png', 'image-jy/index/logo_yz.png', 'image-jy/index/logo_jddj.png', 'image-jy/index/logo_bq.png'];
	const arr3 = ['image-jy/index/logo_gjdw.png', 'image-jy/index/logo_cb.png', 'image-jy/index/logo_shlsq.png', 'image-jy/index/logo_eppendof.png', 'image-jy/index/logo_ss.png', 'image-jy/index/logo_ppd.png', 'image-jy/index/logo_slt.png', 'image-jy/index/logo_jlqc.png', 'image-jy/index/logo_shfm.png', 'image-jy/index/logo_hz.png'];
	initSwiper('swiper1', 'wrapper1', arr1);
	initSwiper('swiper2', 'wrapper2', arr2);
	initSwiper('swiper3', 'wrapper3', arr3);
}

function initSwiper(nodeIdName, wrapper, dataArr) {
	let swiperDom = document.getElementById(nodeIdName);
	swiperItemsHtml = ``;
	for (let index = 0; index < dataArr.length; index++) {
		swiperItemsHtml += `<div class="swiper-slide"><a><img src="${dataArr[index]}" alt="Clients"></a></div>`;
	}
	document.getElementById(wrapper).innerHTML = swiperItemsHtml;
	new Swiper('#' + nodeIdName, {
		direction: 'horizontal',
		loop: true,
		slidesPerView: 6,
		speed: 5000, //匀速时间
		autoplay: {
			delay: 0,
			stopOnLastSlide: false,
			disableOnInteraction: false,
		},
		breakpoints: {
			320: {
				//当屏幕宽度大于等于320
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 3,
			},
			1280: {
				slidesPerView: 6,
			},
		},
	});
}
