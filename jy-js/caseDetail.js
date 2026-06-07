/*
 * @Author: sxw s9x9w9@163.com
 * @Date: 2023-03-28 10:23:05
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-12 12:17:32
 * @FilePath: \guanwang-new\jy-js\caseDetail.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 案例详情页
const headerDom = document.getElementById('jy-caseheader'); // headerDom
const videoDom = document.getElementById('jy-video'); // videoDom
const introduceDom = document.getElementById('jy-introduce'); // introduceDom

const photoDom = document.getElementById('clickSwiper'); // photoDom
let photoStr = '';

const changeDom = document.getElementById('jy-change-case'); // changeDom

// swiper配置
const swiperSet = () => {
    let swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        slidesPerView: 'auto', //slidePerView,
        spaceBetween: 20,
        autoplay: false,
        speed: 800,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        loop: false,
        breakpoints: {
            1200: {
                slidesPerView: 'auto',
                spaceBetween: 20
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 20
            },
            640: {
                slidesPerView: 'auto',
                spaceBetween: 10
            }
        }
    });
    layer.photos({
        photos: '#clickSwiper',
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    });
}

// 获取案例详情数据
const getCaseDetail = (id) => {
    tpj.post({
        url: `${baseUrl}getJiuyingCasesDetails`,
        data: {
            id
        },
        success: res => {
            const cases = res.data.cases;
            const imgs = res.data.imgs;
            const previous = res.data.previous;
            const next = res.data.next;
            // header (标题)
            headerDom.innerHTML = `
            <div class="caseTitle">
                <div class="page-title-content">
                    <h1>${cases.caseName}</h1>
                    <span>${cases.caseType.typeName}</span>
                </div>
            </div>
            `;

            // introduce (介绍, 图片)
            introduceDom.innerHTML = `
            <div class="col-lg-7 col-xl-8 portfolio-single-image" style="width: 50%;">
                <a href="#">
                    <img src="${cases.caseImg}" alt="Image" class="rounded-6">
                </a>
            </div>

            <div class="col-lg-5 col-xl-4 portfolio-single-content px-5 ps-xl-5 pt-xl-4" style="flex: 1;">

                <h2 class="fs-3 fw-bold">项目介绍</h2>
                <p style="font-size: 17px;letter-spacing: 1px;line-height: 25px;">${cases.caseDescribe}</p>

            </div>
            `;

            // video（演示视频）
            videoDom.innerHTML = `
            <video poster="https://official-images.oss-cn-shanghai.aliyuncs.com/uploads/video_main/ea2e6f9d22114d348881c87c828fca70.png" src="${cases.caseVideo}" id="media"  controls="controls"></video>
            `;

            // imgs (图片列表) item.caseImgUrl
            imgs.forEach(item => {
                photoStr += `
                <div class="swiper-slide" style="width: auto;">
                    <a href="javascript:;"><img src="${item.caseImgUrl}"
                    layer-src="${item.caseImgUrl}"></a>
                </div>
                `;
            })

            photoDom.innerHTML = photoStr;

            // change (切换案例)
            changeDom.innerHTML = `
                <div class="col">
                    <a href="caseDetail.html?id=${previous.id}" class="d-inline-flex align-items-center text-dark h-text-color"><i
                            class="uil uil-angle-left-b fs-3 me-1"></i><span>上一个</span></a>
                </div>
                <div class="col text-center">
                    <a title="返回列表" href="case.html"
                        class="d-inline-flex align-items-center text-dark h-text-color"><i
                            class="bi-grid fs-3"></i></a>
                </div>
                <div class="col text-end">
                    <a href="caseDetail.html?id=${next.id}" class="d-inline-flex align-items-center text-dark h-text-color"><span>下一个</span><i
                            class="uil uil-angle-right-b fs-3 ms-1"></i></a>
                </div>
            `

            swiperSet(); // 配置swiper
        }
    })
}

