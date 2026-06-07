/*
 * @Date: 2023-05-17 14:14:43
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-18 15:44:47
 * @FilePath: \g-官网\guanwang-new\js\functions.js
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).SEMICOLON =
        t());
})(this, () => {
  "use strict";
  const r = {
      pageTransition: !1,
      cursor: !1,
      headerSticky: !0,
      headerMobileSticky: !1,
      menuBreakpoint: 992,
      pageMenuBreakpoint: 992,
      gmapAPI: "",
      scrollOffset: 60,
      scrollExternalLinks: !0,
    },
    l = {
      baseEl: document,
      elRoot: document.documentElement,
      elHead: document.head,
      elBody: document.body,
      hash: window.location.hash,
      topScrollOffset: 0,
      elWrapper: document.getElementById("wrapper"),
      elHeader: document.getElementById("header"),
      headerClasses: "",
      elHeaderWrap: document.getElementById("header-wrap"),
      headerWrapClasses: "",
      headerHeight: 0,
      headerOffset: 0,
      headerWrapHeight: 0,
      headerWrapOffset: 0,
      elPrimaryMenus: document.querySelectorAll(".primary-menu"),
      elPrimaryMenuTriggers: document.querySelectorAll(".primary-menu-trigger"),
      elPageMenu: document.getElementById("page-menu"),
      pageMenuOffset: 0,
      elSlider: document.getElementById("slider"),
      elFooter: document.getElementById("footer"),
      portfolioAjax: {},
      sliderParallax: {
        el: document.querySelector(".slider-parallax"),
        caption: document.querySelector(".slider-parallax .slider-caption"),
        inner: document.querySelector(".slider-inner"),
        offset: 0,
      },
      get menuBreakpoint() {
        return (
          this.elBody.getAttribute("data-menu-breakpoint") || r.menuBreakpoint
        );
      },
      get pageMenuBreakpoint() {
        return (
          this.elBody.getAttribute("data-pagemenu-breakpoint") ||
          r.pageMenuBreakpoint
        );
      },
      get customCursor() {
        var e = this.elBody.getAttribute("data-custom-cursor") || r.cursor;
        return "true" == e || !0 === e;
      },
      get pageTransition() {
        var e =
          this.elBody.classList.contains("page-transition") || r.pageTransition;
        return "true" == e || !0 === e;
      },
      scrollPos: { x: 0, y: 0 },
      $jq: "undefined" != typeof jQuery ? jQuery.noConflict() : "",
      resizers: {},
      recalls: {},
      debounced: !1,
      events: {},
      modules: {},
      fn: {},
      required: {
        jQuery: {
          plugin: "jquery",
          fn: () => "undefined" != typeof jQuery,
          file: "js/jquery.js",
          id: "canvas-jquery",
        },
      },
      fnInit: () => {
        s.init(), d.init(), a.init();
      },
    },
    n = {
      getOptions: r,
      getVars: l,
      run: (e) => {
        Object.values(e).map((e) => "function" == typeof e && e.call());
      },
      runBase: () => {
        n.run(e);
      },
      runModules: () => {
        n.run(t);
      },
      runContainerModules: (e) => {
        if (void 0 === e) return !1;
        (n.getVars.baseEl = e), n.runModules(), (n.getVars.baseEl = document);
      },
      breakpoints: () => {
        let t = n.viewport().width;
        const r = {
          xxl: { enter: 1400, exit: 99999 },
          xl: { enter: 1200, exit: 1399 },
          lg: { enter: 992, exit: 1199.98 },
          md: { enter: 768, exit: 991.98 },
          sm: { enter: 576, exit: 767.98 },
          xs: { enter: 0, exit: 575.98 },
        };
        let i = "";
        Object.keys(r).forEach((e) => {
          t > r[e].enter && t <= r[e].exit
            ? l.elBody.classList.add("device-" + e)
            : (l.elBody.classList.remove("device-" + e),
              "" != i && l.elBody.classList.remove("device-down-" + i)),
            t <= r[e].exit &&
              "" != i &&
              l.elBody.classList.add("device-down-" + i),
            (i = e),
            t > r[e].enter
              ? l.elBody.classList.add("device-up-" + e)
              : l.elBody.classList.remove("device-up-" + e);
        });
      },
      throttle: (e, t) => {
        let r;
        e(), (r = !0), setTimeout(function () {}, t);
      },
      debounce: (e, t) => {
        clearTimeout(l.debounced), (l.debounced = setTimeout(e, t));
      },
      addEvent: (e, t, r = {}) => {
        void 0 !== e &&
          void 0 !== t &&
          ((r = new CustomEvent(t, { detail: r })),
          e.dispatchEvent(r),
          (l.events[t] = !0));
      },
      scrollEnd: (e, t = 199) => {
        e &&
          "function" == typeof e &&
          window.addEventListener(
            "scroll",
            () => {
              n.debounce(e, t);
            },
            { passive: !0 }
          );
      },
      viewport: () => {
        return {
          width: window.innerWidth || l.elRoot.clientWidth,
          height: window.innerHeight || l.elRoot.clientHeight,
        };
      },
      getSelector: (e, t = !0, r = !0) => (
        t
          ? ((e =
              n.getVars.baseEl !== document
                ? jQuery(n.getVars.baseEl).find(e)
                : jQuery(e)),
            r &&
              (e =
                "string" == typeof r
                  ? e.filter(":not(" + r + ")")
                  : e.filter(":not(.customjs)")))
          : (e = r
              ? "string" == typeof r
                ? n.getVars.baseEl.querySelectorAll(e + ":not(" + r + ")")
                : n.getVars.baseEl.querySelectorAll(e + ":not(.customjs)")
              : n.getVars.baseEl.querySelectorAll(e)),
        e
      ),
      onResize: (e, t = 333) => {
        e &&
          "function" == typeof e &&
          (window.onresize = () => {
            n.debounce(e, t);
          });
      },
      imagesLoaded: (e) => {
        let t = e.getElementsByTagName("img") || document.images,
          r = t.length,
          i = 0;
        r < 1 && n.addEvent(e, "CanvasImagesLoaded");
        async function o() {
          i++, i === r && n.addEvent(e, "CanvasImagesLoaded");
        }
        [].forEach.call(t, function (e) {
          e.complete ? o() : e.addEventListener("load", o, !1);
        });
      },
      contains: (e, t) => {
        let r = e.split(" "),
          i = !1;
        return (
          r.forEach((e) => {
            l.elBody.classList.contains(e) && (i = !0);
          }),
          i
        );
      },
      has: (e, t) => [...e].filter((e) => e.querySelector(t)),
      filtered: (e, t) => [...e].filter((e) => e.matches(t)),
      siblings: (t, e = !1) =>
        e
          ? [...e].filter((e) => e !== t)
          : [...t.parentNode.children].filter((e) => e !== t),
      getNext: (e, t) => {
        let r = e.nextElementSibling;
        return !t || (r && r.matches(t)) ? r : null;
      },
      offset: (e) => {
        var t = e.getBoundingClientRect(),
          r = window.pageXOffset || document.documentElement.scrollLeft,
          e = window.pageYOffset || document.documentElement.scrollTop;
        return { top: t.top + e, left: t.left + r };
      },
      slideUp: (e, t = 500, r = !1) => {
        (e.style.transitionProperty = "height, margin, padding"),
          (e.style.transitionDuration = t + "ms"),
          (e.style.boxSizing = "border-box"),
          (e.style.height = e.offsetHeight + "px"),
          e.offsetHeight,
          (e.style.overflow = "hidden"),
          (e.style.height = 0),
          (e.style.paddingTop = 0),
          (e.style.paddingBottom = 0),
          (e.style.marginTop = 0),
          (e.style.marginBottom = 0),
          window.setTimeout(() => {
            (e.style.display = "none"),
              e.style.removeProperty("height"),
              e.style.removeProperty("padding-top"),
              e.style.removeProperty("padding-bottom"),
              e.style.removeProperty("margin-top"),
              e.style.removeProperty("margin-bottom"),
              e.style.removeProperty("overflow"),
              e.style.removeProperty("transition-duration"),
              e.style.removeProperty("transition-property"),
              "function" == typeof r && r();
          }, t);
      },
      slideDown: (e, t = 500, r = !1) => {
        e.style.removeProperty("display");
        let i = window.getComputedStyle(e).display;
        "none" === i && (i = "block"), (e.style.display = i);
        var o = e.offsetHeight;
        (e.style.overflow = "hidden"),
          (e.style.height = 0),
          (e.style.paddingTop = 0),
          (e.style.paddingBottom = 0),
          (e.style.marginTop = 0),
          (e.style.marginBottom = 0),
          e.offsetHeight,
          (e.style.boxSizing = "border-box"),
          (e.style.transitionProperty = "height, margin, padding"),
          (e.style.transitionDuration = t + "ms"),
          (e.style.height = o + "px"),
          e.style.removeProperty("padding-top"),
          e.style.removeProperty("padding-bottom"),
          e.style.removeProperty("margin-top"),
          e.style.removeProperty("margin-bottom"),
          window.setTimeout(() => {
            e.style.removeProperty("height"),
              e.style.removeProperty("overflow"),
              e.style.removeProperty("transition-duration"),
              e.style.removeProperty("transition-property"),
              "function" == typeof r && r();
          }, t);
      },
      slideToggle: (e, t = 500, r = !1) =>
        "none" === window.getComputedStyle(e).display
          ? n.slideDown(e, t, r)
          : n.slideUp(e, t, r),
      classesFn: (t, e, r) => {
        let i = e.split(" ");
        i.forEach((e) => {
          "add" == t
            ? r.classList.add(e)
            : "toggle" == t
            ? r.classList.toggle(e)
            : r.classList.remove(e);
        });
      },
      loadCSS: (e) => {
        var t = e.file,
          e = e.id || !1;
        if (!t) return !1;
        if (e && document.getElementById(e)) return !1;
        const r = document.createElement("link");
        return (
          (r.id = e),
          (r.href = t),
          (r.rel = "stylesheet"),
          (r.type = "text/css"),
          l.elHead.appendChild(r),
          !0
        );
      },
      loadJS: (e) => {
        var t = e.file,
          r = e.id || !1,
          i = e.callback,
          o = e.async || !0,
          e = e.defer || !0;
        if (!t) return !1;
        if (r && document.getElementById(r)) return !1;
        const n = document.createElement("script");
        if (void 0 !== i) {
          if ("function" != typeof i) throw new Error("Not a valid callback!");
          n.onload = i;
        }
        return (
          (n.id = r),
          (n.src = t),
          (n.async = !!o),
          (n.defer = !!e),
          l.elBody.appendChild(n),
          !0
        );
      },
      isFuncTrue: async (i) => {
        if ("function" != typeof i) return !1;
        var o = 0;
        return new Promise((e, t) => {
          var r = setInterval(() => {
            i()
              ? (clearInterval(r), e(!0))
              : 30 < o && (clearInterval(r), t(!0)),
              o++;
          }, 333);
        }).catch((e) => console.log("Function does not exist: " + i));
      },
      initFunction: (e) => {
        l.elBody.classList.add(e.class),
          n.addEvent(window, e.event),
          (l.events[e.event] = !0);
      },
      runModule: (t) => {
        var e = "http:" !== window.location.protocol ? "fn" : "module";
        // 强制增加https://www.9shadow.com/js/ 前缀 
        // 解决服务端渲染的静态页面无法通过相对路径加载静态资源
        // let r = ("fn" == e ? "js/" : "./") + e + "." + t.plugin + ".js";
        let r = ("https://www.9shadow.com/js/") + e + "." + t.plugin + ".js";
        return (
          t.file && (r = t.file),
          "module" == e
            ? import(r)
                .then((e) => e.default(t.selector))
                .catch((e) => {
                  console.log(t.plugin + ": Module could not be loaded"),
                    console.log(e);
                })
            : (n.loadJS({ file: r, id: "canvas-" + t.plugin + "-fn" }),
              n
                .isFuncTrue(() => void 0 !== n.getVars.fn[t.plugin])
                .then((e) => !!e && void n.getVars.fn[t.plugin](t.selector))),
          !0
        );
      },
      initModule: (t) => {
        if (
          "dependent" != t.selector &&
          ("object" == typeof t.selector
            ? (t.selector instanceof jQuery && (t.selector = t.selector[0]),
              t.selector)
            : n.getVars.baseEl.querySelectorAll(t.selector)
          ).length < 1
        )
          return !1;
        var i,
          o = !0,
          e = !0;
        return (
          t.required &&
            Array.isArray(t.required) &&
            ((i = {}),
            t.required.forEach((e) => (i[e.plugin] = !!e.fn())),
            t.required.forEach((r) => {
              r.fn() ||
                ((o = !1),
                (async function () {
                  n.loadJS({ file: r.file, id: r.id });
                  var e = new Promise((e) => {
                    var t = setInterval(() => {
                      r.fn() &&
                        ((i[r.plugin] = !0),
                        Object.values(i).every((e) => !0 === e) &&
                          (clearInterval(t), e(!0)));
                    }, 333);
                  });
                  (o = await e), n.runModule(t);
                })());
            })),
          void 0 !== t.dependency &&
            "function" == typeof t.dependency &&
            ((e = !1),
            (e = (async function () {
              return new Promise((e) => {
                1 == t.dependency.call(t, "dependent") && e(!0);
              });
            })())),
          o && e && n.runModule(t),
          !0
        );
      },
      topScrollOffset: () => {
        let e = 0,
          t = l.elPageMenu?.querySelector("#page-menu-wrap")?.offsetHeight || 0;
        l.elBody.classList.contains("is-expanded-menu") &&
          (l.elHeader?.classList.contains("sticky-header") &&
            (e = l.elHeaderWrap.offsetHeight),
          l.elPageMenu?.classList.contains("dots-menu") && (t = 0)),
          (e += t),
          (n.getVars.topScrollOffset = e + r.scrollOffset);
      },
    },
    e = {
      init: () => {
        SEMICOLON.Mobile.any() && l.elBody.classList.add("device-touch");
      },
      menuBreakpoint: () => {
        n.getVars.menuBreakpoint <= n.viewport().width
          ? l.elBody.classList.add("is-expanded-menu")
          : l.elBody.classList.remove("is-expanded-menu"),
          l.elPageMenu &&
            (void 0 === n.getVars.pageMenuBreakpoint &&
              (n.getVars.pageMenuBreakpoint = n.getVars.menuBreakpoint),
            n.getVars.pageMenuBreakpoint <= n.viewport().width
              ? l.elBody.classList.add("is-expanded-pagemenu")
              : l.elBody.classList.remove("is-expanded-pagemenu"));
      },
      goToTop: () => n.initModule({ selector: "#gotoTop", plugin: "gototop" }),
      stickFooterOnSmall: () =>
        n.initModule({ selector: "#footer", plugin: "stickfooteronsmall" }),
      logo: () => n.initModule({ selector: "#logo", plugin: "logo" }),
      setHeaderClasses: () => {
        (n.getVars.headerClasses = l.elHeader?.className || ""),
          (n.getVars.headerWrapClasses = l.elHeaderWrap?.className || "");
      },
      headers: () => n.initModule({ selector: "#header", plugin: "headers" }),
      menus: () => n.initModule({ selector: "#header", plugin: "menus" }),
      pageMenu: () =>
        n.initModule({ selector: "#page-menu", plugin: "pagemenu" }),
      sliderDimensions: () =>
        n.initModule({
          selector: ".slider-element",
          plugin: "sliderdimensions",
        }),
      sliderMenuClass: () =>
        n.initModule({
          selector:
            ".transparent-header + .swiper_wrapper,.swiper_wrapper + .transparent-header,.transparent-header + .revslider-wrap,.revslider-wrap + .transparent-header",
          plugin: "slidermenuclass",
        }),
      topSearch: () =>
        n.initModule({ selector: "#top-search-trigger", plugin: "search" }),
      topCart: () => n.initModule({ selector: "#top-cart", plugin: "topcart" }),
      sidePanel: () =>
        n.initModule({ selector: "#side-panel", plugin: "sidepanel" }),
      adaptiveColorScheme: () =>
        n.initModule({
          selector: ".adaptive-color-scheme",
          plugin: "adaptivecolorscheme",
        }),
      portfolioAjax: () =>
        n.initModule({ selector: ".portfolio-ajax", plugin: "ajaxportfolio" }),
      cursor: () => {
        if (l.customCursor)
          return n.initModule({ selector: "body", plugin: "cursor" });
      },
      setBSTheme: () => {
        l.elBody.classList.contains("dark")
          ? document.querySelector("html").setAttribute("data-bs-theme", "dark")
          : (document.querySelector("html").removeAttribute("data-bs-theme"),
            document
              .querySelectorAll(".dark")
              ?.forEach((e) => e.setAttribute("data-bs-theme", "dark"))),
          l.elBody
            .querySelectorAll(".not-dark")
            ?.forEach((e) => e.setAttribute("data-bs-theme", "light"));
      },
    },
    t = {
      easing: () =>
        n.initModule({
          selector: "[data-easing]",
          plugin: "easing",
          required: [l.required.jQuery],
        }),
      bootstrap: () => {
        let t = !0;
        l.elBody.querySelectorAll("*").forEach(
          (e) =>
            t &&
            e.getAttributeNames().some((e) => {
              if (e.includes("data-bs"))
                return (
                  (t = !1),
                  n.initModule({ selector: "body", plugin: "bootstrap" })
                );
            })
        );
      },
      resizeVideos: (e) =>
        n.initModule({
          selector:
            e ||
            'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]',
          plugin: "fitvids",
          required: [l.required.jQuery],
        }),
      pageTransition: () => {
        if (l.pageTransition)
          return n.initModule({ selector: "body", plugin: "pagetransition" });
      },
      lazyLoad: (e) =>
        n.initModule({
          selector: e || ".lazy:not(.lazy-loaded)",
          plugin: "lazyload",
        }),
      dataClasses: () =>
        n.initModule({ selector: "[data-class]", plugin: "dataclasses" }),
      dataHeights: () =>
        n.initModule({
          selector:
            "[data-height-xxl],[data-height-xl],[data-height-lg],[data-height-md],[data-height-sm],[data-height-xs]",
          plugin: "dataheights",
        }),
      lightbox: (e) =>
        n.initModule({
          selector: e || "[data-lightbox]",
          plugin: "lightbox",
          required: [l.required.jQuery],
        }),
      modal: (e) =>
        n.initModule({
          selector: e || ".modal-on-load",
          plugin: "modal",
          required: [l.required.jQuery],
        }),
      parallax: (e) =>
        n.initModule({
          selector: e || ".parallax .parallax-bg,.parallax .parallax-element",
          plugin: "parallax",
        }),
      animations: (e) =>
        n.initModule({ selector: e || "[data-animate]", plugin: "animations" }),
      hoverAnimations: (e) =>
        n.initModule({
          selector: e || "[data-hover-animate]",
          plugin: "hoveranimation",
        }),
      gridInit: (e) =>
        n.initModule({
          selector: e || ".grid-container",
          plugin: "isotope",
          required: [l.required.jQuery],
        }),
      filterInit: (e) =>
        n.initModule({
          selector: e || ".grid-filter,.custom-filter",
          plugin: "gridfilter",
          required: [l.required.jQuery],
        }),
      canvasSlider: (e) =>
        n.initModule({ selector: e || ".swiper_wrapper", plugin: "swiper" }),
      sliderParallax: () =>
        n.initModule({
          selector: ".slider-parallax",
          plugin: "sliderparallax",
        }),
      flexSlider: (e) =>
        n.initModule({
          selector: e || ".fslider",
          plugin: "flexslider",
          required: [l.required.jQuery],
        }),
      html5Video: (e) =>
        n.initModule({ selector: e || ".video-wrap", plugin: "html5video" }),
      youtubeBgVideo: (e) =>
        n.initModule({
          selector: e || ".yt-bg-player",
          plugin: "youtube",
          required: [l.required.jQuery],
        }),
      toggle: (e) =>
        n.initModule({ selector: e || ".toggle", plugin: "toggles" }),
      accordion: (e) =>
        n.initModule({
          selector: e || ".accordion",
          plugin: "accordions",
          required: [l.required.jQuery],
        }),
      counter: (e) =>
        n.initModule({
          selector: e || ".counter",
          plugin: "counter",
          required: [l.required.jQuery],
        }),
      countdown: (e) =>
        n.initModule({
          selector: e || ".countdown",
          plugin: "countdown",
          required: [l.required.jQuery],
        }),
      gmap: (e) =>
        n.initModule({
          selector: e || ".gmap",
          plugin: "gmap",
          required: [l.required.jQuery],
        }),
      roundedSkill: (e) =>
        n.initModule({
          selector: e || ".rounded-skill",
          plugin: "piechart",
          required: [l.required.jQuery],
        }),
      progress: (e) =>
        n.initModule({ selector: e || ".skill-progress", plugin: "progress" }),
      twitterFeed: (e) =>
        n.initModule({
          selector: e || ".twitter-feed",
          plugin: "twitter",
          required: [l.required.jQuery],
        }),
      flickrFeed: (e) =>
        n.initModule({
          selector: e || ".flickr-feed",
          plugin: "flickrfeed",
          required: [l.required.jQuery],
        }),
      instagram: (e) =>
        n.initModule({
          selector: e || ".instagram-photos",
          plugin: "instagram",
        }),
      navTree: (e) =>
        n.initModule({
          selector: e || ".nav-tree",
          plugin: "navtree",
          required: [l.required.jQuery],
        }),
      carousel: (e) =>
        n.initModule({
          selector: e || ".carousel-widget",
          plugin: "carousel",
          required: [l.required.jQuery],
        }),
      masonryThumbs: (e) =>
        n.initModule({
          selector: e || ".masonry-thumbs",
          plugin: "masonrythumbs",
          required: [l.required.jQuery],
        }),
      notifications: (e) =>
        n.initModule({
          selector: e || !1,
          plugin: "notify",
          required: [l.required.jQuery],
        }),
      textRotator: (e) =>
        n.initModule({
          selector: e || ".text-rotater",
          plugin: "textrotator",
          required: [l.required.jQuery],
        }),
      onePage: (e) =>
        n.initModule({
          selector: e || "[data-scrollto],.one-page-menu",
          plugin: "onepage",
        }),
      ajaxForm: (e) =>
        n.initModule({
          selector: e || ".form-widget",
          plugin: "ajaxform",
          required: [l.required.jQuery],
        }),
      subscribe: (e) =>
        n.initModule({
          selector: e || ".subscribe-widget",
          plugin: "subscribe",
          required: [l.required.jQuery],
        }),
      conditional: (e) =>
        n.initModule({
          selector: e || ".form-group[data-condition]",
          plugin: "conditional",
        }),
      shapeDivider: (e) =>
        n.initModule({
          selector: e || ".shape-divider",
          plugin: "shapedivider",
        }),
      stickySidebar: (e) =>
        n.initModule({
          selector: e || ".sticky-sidebar-wrap",
          plugin: "stickysidebar",
          required: [l.required.jQuery],
        }),
      cookies: (e) =>
        n.initModule({
          selector: e || ".gdpr-settings,[data-cookies]",
          plugin: "cookie",
        }),
      quantity: (e) =>
        n.initModule({ selector: e || ".quantity", plugin: "quantity" }),
      readmore: (e) =>
        n.initModule({ selector: e || "[data-readmore]", plugin: "readmore" }),
      pricingSwitcher: (e) =>
        n.initModule({
          selector: e || ".pts-switcher",
          plugin: "pricingswitcher",
        }),
      ajaxButton: (e) =>
        n.initModule({
          selector: e || "[data-ajax-loader]",
          plugin: "ajaxbutton",
        }),
      videoFacade: (e) =>
        n.initModule({ selector: e || ".video-facade", plugin: "videofacade" }),
      schemeToggler: (e) =>
        n.initModule({
          selector: e || ".body-scheme-toggle",
          plugin: "schemetoggler",
        }),
      clipboardCopy: (e) =>
        n.initModule({ selector: e || ".clipboard-copy", plugin: "clipboard" }),
      codeHighlight: (e) =>
        n.initModule({
          selector: e || ".code-highlight",
          plugin: "codehighlight",
        }),
      viewportDetect: (e) =>
        n.initModule({
          selector: e || ".viewport-detect",
          plugin: "viewportdetect",
        }),
      bsComponents: (e) =>
        n.initModule({
          selector:
            e ||
            '[data-bs-toggle="tooltip"],[data-bs-toggle="popover"],[data-bs-toggle="tab"],[data-bs-toggle="pill"],.style-msg',
          plugin: "bscomponents",
        }),
    },
    i = {
      Android: () => navigator.userAgent.match(/Android/i),
      BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
      iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
      Opera: () => navigator.userAgent.match(/Opera Mini/i),
      Windows: () => navigator.userAgent.match(/IEMobile/i),
      any: () =>
        i.Android() || i.BlackBerry() || i.iOS() || i.Opera() || i.Windows(),
    },
    o = { onReady: () => {}, onLoad: () => {}, onResize: () => {} },
    a = {
      init: () => {
        (l.resizers.viewport = () => n.viewport()),
          (l.resizers.breakpoints = () => n.breakpoints()),
          (l.resizers.menuBreakpoint = () => e.menuBreakpoint()),
          n.run(l.resizers),
          o.onResize(),
          n.addEvent(window, "cnvsResize");
      },
    },
    s = {
      init: () => {
        n.breakpoints(),
          n.runBase(),
          n.runModules(),
          n.topScrollOffset(),
          s.windowscroll(),
          o.onReady();
      },
      windowscroll: () => {
        n.scrollEnd(() => {
          e.pageMenu();
        });
      },
    },
    d = {
      init: () => {
        o.onLoad();
      },
    };
  return (
    document.addEventListener("DOMContentLoaded", () => {
      s.init();
    }),
    (window.onload = () => {
      d.init();
    }),
    n.onResize(() => {
      a.init();
    }),
    { Core: n, Base: e, Modules: t, Mobile: i, Custom: o }
  );
});
