/*
 * @Author: sxw s9x9w9@163.com
 * @Date: 2023-03-23 10:11:57
 * @LastEditors: sxw s9x9w9@163.com
 * @LastEditTime: 2023-05-22 16:32:44
 * @FilePath: \guanwang-new\jy-js\globalVariable.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const baseUrl = 'https://www.9shadow.com/server/';
// Banner 电话号码提交
const submitBannerPhone = () => {
    let isnext = true;
    if (!isnext) return;
    isnext = false;
    
    const phone = document.getElementById('banner-phone-input').value.trim();
    
    if (phone == "" || phone == undefined) {
        alert("请输入手机号码！");
        isnext = true;
        return;
    }
    
    const p = new RegExp(/(^(1[0-9][0-9])[0-9]{8}$)/);
    const p1 = new RegExp(/(^(\(0\d{2,3}\)-|0\d{2,3}-)?\d{7,8}$)/);
    
    if (!p.test(phone) && !p1.test(phone)) {
        alert("请输入规范的手机号码！");
        isnext = true;
        return;
    }
    
    const params = { 
        demand: null, 
        msgCompany: null, 
        msgName: null, 
        msgPhone: phone 
    };
    
    tpj.post({
        url: `${baseUrl}addMsg`,
        data: params,
        success: res => {
            if (res && res.success) {
                alert("需求已成功提交！专属业务顾问将在 1-2 个工作日内与您联系，为您提供专业定制方案，敬请留意来电～");
                document.getElementById('banner-phone-input').value = "";
            } else {
                alert("提交失败，请稍后重试！");
                isnext = true;
            }
        },
        error: () => {
            alert("提交失败，请稍后重试！");
            isnext = true;
        }
    });
};

// 获取网站留资
const loadAddMsg = () => {
    let isnext = true;
    if (!isnext) return;
    isnext = false;
    const name = tpj("#template-contactform-name").val().trim();
    if (name == undefined || name == "") {
        alert("请输入姓名！");
        isnext = true;
        return
    }
    const company = tpj('#template-contactform-email').val().trim();
    const phone = tpj("#template-contactform-phone").val().trim();
    if (phone == "" || phone == undefined) {
        alert("请输入手机或电话号码！");
        isnext = true;
        return;
    }
    const p = new RegExp(/(^(1[0-9][0-9])[0-9]{8}$)/);
    const p1 = new RegExp(/(^(\(0\d{2,3}\)-|0\d{2,3}-)?\d{7,8}$)/);
    if (phone != "" || phone != undefined) {
        if (!p.test(phone) && !p1.test(phone)) {
            alert("请输入规范的手机或电话号码！");
            isnext = true;
            return;
        }
    }
    const content = tpj("#template-contactform-message").val();
    if (content == "" || content == undefined) {
        alert("请输入内容！");
        isnext = true;
        return;
    }
    const params = { demand: content, msgCompany: company, msgName: name, msgPhone: phone }
    tpj.post({
        url: `${baseUrl}addMsg`,
        data: params,
        success: res => {
            if (res && res.success) {
                alert("留言成功！")
                tpj("#template-contactform-email").val("");
                tpj("#template-contactform-name").val("");
                tpj("#template-contactform-phone").val("");
                tpj("#template-contactform-message").val("");
            } else {
                alert("留言失败！");
                isnext = true
            }
        }
    })
};

const showFloat = () => {
    const viewHeight = document.documentElement.clientHeight;
    document.onscroll = (e) => {
        if (!document.getElementById('jy-float')) return;
        if (document.documentElement.scrollTop > viewHeight) {
            document.getElementById('jy-float').style.display = 'block';
        } else {
            document.getElementById('jy-float').style.display = 'none';
        }
    }
}


const jumpToPage = (e) => {
    console.log(window.location.href.includes('game'), e.dataset);
    
    // window.location.href = e.dataset.htmlurl;
    if(window.location.href.includes('game')) {
        window.open(e.dataset.gamehtmlurl || e.dataset.htmlurl);
    }else {
        window.open(e.dataset.htmlurl);
    }
}

const ensureHeaderAiServiceEntryFallbackStyles = () => {
    const styleId = 'jy-ai-service-entry-fallback-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '#logo .jy-logo-group{display:flex;align-items:center;gap:22px;}#logo .jy-logo-link{width:auto;display:flex;align-items:center;flex:0 0 auto;}#logo .jy-ai-service-entry{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto;margin-left:8px;padding:9px 16px;border-radius:999px;background:#0072ff;box-shadow:0 8px 22px -10px rgba(95,178,255,.8);color:#fff !important;font-size:13px;font-weight:500;line-height:1;text-decoration:none;flex:0 0 auto;transition:background 0.25s ease,transform 0.25s ease,box-shadow 0.25s ease;}#logo .jy-ai-service-entry:hover{background:#005ed6;color:#fff !important;transform:translateY(-1px);box-shadow:0 14px 28px -12px rgba(95,178,255,.9);}#logo .jy-ai-service-entry-icon{width:14px;height:14px;display:inline-block;flex:0 0 auto;}#logo .jy-ai-service-entry-text{display:block;white-space:nowrap;letter-spacing:0.02em;}#logo .jy-ai-service-entry-badge{position:absolute;top:-7px;right:-10px;font-family:"JetBrains Mono",monospace;font-size:9px;font-weight:700;letter-spacing:0.12em;color:#06112a;background:#7df9c4;padding:3px 7px 2px;border-radius:999px;box-shadow:0 6px 14px -4px rgba(125,249,196,.6);transform:rotate(6deg);line-height:1;}@media (max-width:767.98px){#logo .jy-logo-group{gap:12px;}#logo .jy-ai-service-entry{width:auto;margin-left:4px;padding:7px 12px;gap:6px;font-size:11.5px;}#logo .jy-ai-service-entry-icon{width:12px;height:12px;}#logo .jy-ai-service-entry-badge{top:-6px;right:-8px;font-size:8px;}}';
    document.head.appendChild(style);
}

const headerAiServiceEntryNeedsFallback = (logoGroup, aiEntry) => {
    if (!logoGroup || !aiEntry || !window.getComputedStyle) return true;

    const icon = aiEntry.querySelector('.jy-ai-service-entry-icon');
    const badge = aiEntry.querySelector('.jy-ai-service-entry-badge');
    if (!icon || !badge) return true;

    const logoGroupStyle = window.getComputedStyle(logoGroup);
    const aiEntryStyle = window.getComputedStyle(aiEntry);
    const iconStyle = window.getComputedStyle(icon);
    const badgeStyle = window.getComputedStyle(badge);

    return logoGroupStyle.display !== 'flex'
        || aiEntryStyle.display !== 'inline-flex'
        || aiEntryStyle.backgroundColor === 'rgba(0, 0, 0, 0)'
        || parseFloat(iconStyle.width) > 20
        || badgeStyle.position !== 'absolute';
}

const ensureHeaderAiServiceEntry = () => {
    const header = document.getElementById('header');
    const logoRoot = document.getElementById('logo');
    if (!header || !logoRoot) return;

    let logoGroup = logoRoot.querySelector('.jy-logo-group');
    if (!logoGroup) {
        logoGroup = document.createElement('div');
        logoGroup.className = 'jy-logo-group';
        while (logoRoot.firstChild) {
            logoGroup.appendChild(logoRoot.firstChild);
        }
        logoRoot.appendChild(logoGroup);
    }

    const logoLink = logoGroup.querySelector('a:not(.jy-ai-service-entry)');
    if (logoLink && !logoLink.classList.contains('jy-logo-link')) {
        logoLink.classList.add('jy-logo-link');
    }

    let aiEntry = logoGroup.querySelector('.jy-ai-service-entry');
    if (!aiEntry) {
        aiEntry = document.createElement('a');
        aiEntry.className = 'jy-ai-service-entry';
        logoGroup.appendChild(aiEntry);
    }

    aiEntry.href = 'https://www.9shadow.com/EnterpriseAI/';
    aiEntry.target = '_blank';
    aiEntry.rel = 'noopener noreferrer';
    aiEntry.setAttribute('aria-label', '查看 AI 服务');
    aiEntry.innerHTML = '<svg class="jy-ai-service-entry-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"></path><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"></path></svg><span class="jy-ai-service-entry-text">AI 服务</span><span class="jy-ai-service-entry-badge">NEW</span>';

    if (headerAiServiceEntryNeedsFallback(logoGroup, aiEntry)) {
        ensureHeaderAiServiceEntryFallbackStyles();
    }

    if (!aiEntry.dataset.aiTrackerBound) {
        aiEntry.addEventListener('click', function () {
            if (window.JYTracker) {
                window.JYTracker.trackClick('header_ai_service_entry', { targetPage: 'https://www.9shadow.com/EnterpriseAI/' });
            }
        });
        aiEntry.dataset.aiTrackerBound = '1';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureHeaderAiServiceEntry);
} else {
    ensureHeaderAiServiceEntry();
}

// showFloat();

const videoLimit = () => {
    // 获取<video> 且ID为media 的元素
    const videoElement = document.querySelector('video#media');

    // 检查videoElement是否已经存在  
    if (videoElement) {
        // 1. 设置controlslist属性为"nodownload"  
        videoElement.setAttribute('controlslist', 'nodownload');

        // 如果你想验证属性是否已正确设置，可以打印出来看看  
        // console.log(videoElement.getAttribute('controlslist')); // 这应该输出 "nodownload"  


        // 2. 为<video>元素添加contextmenu事件监听器  
        videoElement.addEventListener('contextmenu', function (event) {
            // 阻止contextmenu事件的默认行为（即显示上下文菜单）  
            event.preventDefault();

            // 可选：你可以在这里添加其他逻辑，比如显示一个消息  
            // console.log('鼠标右键点击已被禁用');
        });
    } else {
        // console.error('未能找到<video>元素');
    }
}

videoLimit();