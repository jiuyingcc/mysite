/*
 * @Date: 2023-04-13 14:06:44
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-04 10:55:25
 * @FilePath: \guanwang-new\jy-js\bannerSwiper.js
 */
const bannerSwiper = () => {
    window.addEventListener('pluginSwiperReady', () => {
        let introSwiper = new Swiper('.swiper-container', {
            spaceBetween: 20,
            centeredSlides: false,
            autoHeight: true,
            speed: 3300,
            loop: true,
            autoplay: {
                delay: 1,
                disableOnInteraction: true,
            },
            allowTouchMove: false,
            breakpoints: {
                1: {
                    slidesPerView: 2
                },
                576: {
                    slidesPerView: 3
                },
                768: {
                    slidesPerView: 4
                },
                992: {
                    slidesPerView: 7
                }
            }
        });
    });
}