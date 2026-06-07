/**
 * 九影官网埋点SDK
 * 功能：会话ID、设备ID、页面浏览、点击事件、心跳上报
 */
(function(window) {
  'use strict';

  var JYTracker = {
    // 配置
    config: {
      // apiUrl: 'http://192.168.0.30:8080/api/events',
      apiUrl: 'https://treasure.9shadow.com/nineshadow-track/api/events',
      appKey: 'nineshadow-web',
      heartbeatInterval: 15, // 心跳间隔（秒）
      debug: true
    },

    // 防重入标志
    _initialized: false,

    // 会话ID（每次打开页面生成，关闭前保持不变）
    sessionId: null,

    // 设备ID（持久化存储，同一设备始终相同）
    deviceId: null,

    // 页面进入时间
    _enterTime: null,

    // 心跳定时器
    _heartbeatTimer: null,

    // 离开事件是否已上报
    _leaveReported: false,

    // 绑定的事件处理函数引用（用于防止重复绑定）
    _boundReportLeave: null,
    _boundVisibilityChange: null,

    /**
     * 初始化
     * @param {Object} options - 配置项
     */
    init: function(options) {
      // 防止重复初始化
      if (this._initialized) {
        this._log('已初始化，跳过重复调用');
        return;
      }
      this._initialized = true;

      // 合并配置
      if (options) {
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            this.config[key] = options[key];
          }
        }
      }

      // 记录进入时间
      this._enterTime = Date.now();
      this._leaveReported = false;

      // 生成会话ID
      this.sessionId = this._getSessionId();

      // 生成设备ID
      this.deviceId = this._getDeviceId();

      // 自动上报页面浏览
      this._trackPageView();

      // 监听页面离开
      this._bindLeaveEvents();

      // 启动心跳
      this._startHeartbeat();

      this._log('JYTracker 初始化完成', {
        sessionId: this.sessionId,
        deviceId: this.deviceId
      });
    },

    /**
     * 获取或生成会话ID
     */
    _getSessionId: function() {
      var sid = sessionStorage.getItem('jy_session_id');
      if (!sid) {
        sid = 'S_' + Date.now() + '_' + this._randomStr(8);
        sessionStorage.setItem('jy_session_id', sid);
      }
      return sid;
    },

    /**
     * 获取或生成设备ID
     */
    _getDeviceId: function() {
      var did = localStorage.getItem('jy_device_id');
      if (!did) {
        did = 'D_' + this._generateFingerprint() + '_' + this._randomStr(6);
        localStorage.setItem('jy_device_id', did);
      }
      return did;
    },

    /**
     * 生成简单的设备指纹
     */
    _generateFingerprint: function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('JYTracker', 2, 2);

      var fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ].join('|');

      return this._hashCode(fingerprint);
    },

    /**
     * 字符串哈希
     */
    _hashCode: function(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    },

    /**
     * 生成随机字符串
     */
    _randomStr: function(len) {
      var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for (var i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    /**
     * 上报页面浏览事件（防止重复上报）
     */
    _trackPageView: function() {
      var pageKey = 'jy_pv_' + window.location.pathname;
      if (sessionStorage.getItem(pageKey)) {
        this._log('page_view 已上报，跳过重复上报');
        return;
      }
      sessionStorage.setItem(pageKey, '1');

      this.track('page_view', {
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        pageTitle: document.title,
        referrer: document.referrer || '直接访问',
        stayDuration: null
      });
    },

    /**
     * 启动心跳机制
     * 定时将最后活跃时间写入 sessionStorage，作为停留时长的兜底
     */
    _startHeartbeat: function() {
      // 防止重复启动
      if (this._heartbeatTimer) return;

      var self = this;
      var intervalMs = this.config.heartbeatInterval * 1000;
      var storageKey = 'jy_heartbeat_' + window.location.pathname;

      // 立即写入一次
      sessionStorage.setItem(storageKey, JSON.stringify({
        enterTime: this._enterTime,
        lastActive: Date.now(),
        pageUrl: window.location.href,
        pagePath: window.location.pathname
      }));

      // 定时更新
      this._heartbeatTimer = setInterval(function() {
        sessionStorage.setItem(storageKey, JSON.stringify({
          enterTime: self._enterTime,
          lastActive: Date.now(),
          pageUrl: window.location.href,
          pagePath: window.location.pathname
        }));
        self._log('心跳更新');
      }, intervalMs);
    },

    /**
     * 停止心跳
     */
    _stopHeartbeat: function() {
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = null;
      }
    },

    /**
     * 监听页面离开（统一绑定，防止重复）
     * - beforeunload / pagehide：真正离开，上报 page_leave
     * - visibilitychange：仅暂停/恢复心跳，不上报离开
     */
    _bindLeaveEvents: function() {
      var self = this;

      // 真正离开时上报
      this._boundReportLeave = function() {
        self._reportLeave();
      };

      // 切 tab / 锁屏时只暂停心跳，切回来恢复
      this._boundVisibilityChange = function() {
        if (document.visibilityState === 'hidden') {
          self._stopHeartbeat();
          self._log('页面隐藏，暂停心跳');
        } else if (document.visibilityState === 'visible') {
          // 页面切回来，恢复心跳（只在未离开时恢复）
          if (!self._leaveReported) {
            self._startHeartbeat();
            self._log('页面恢复，重启心跳');
          }
        }
      };

      window.addEventListener('beforeunload', this._boundReportLeave);
      window.addEventListener('pagehide', this._boundReportLeave);
      document.addEventListener('visibilitychange', this._boundVisibilityChange);
    },

    /**
     * 上报离开事件（带防重复）
     */
    _reportLeave: function() {
      if (this._leaveReported) return;
      this._leaveReported = true;

      // 停止心跳
      this._stopHeartbeat();

      // 计算停留时长
      var stayDuration = Math.round((Date.now() - this._enterTime) / 1000);

      this.track('page_leave', {
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        pageTitle: null,
        referrer: null,
        stayDuration: stayDuration
      });

      // 清理心跳存储
      var storageKey = 'jy_heartbeat_' + window.location.pathname;
      sessionStorage.removeItem(storageKey);

      this._log('page_leave 已上报，停留 ' + stayDuration + ' 秒');
    },

    /**
     * 上报事件（核心方法）
     * @param {String} eventCode - 事件编码
     * @param {Object} eventData - 事件数据
     */
    track: function(eventCode, eventData) {
      var data = {
        // 基础信息
        appKey: this.config.appKey,
        sessionId: this.sessionId,
        deviceId: this.deviceId,

        // 事件信息
        eventCode: eventCode,
        eventData: eventData || {},
        eventTime: new Date().toISOString(),

        // 设备信息
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform || '',
          language: navigator.language,
          screenWidth: screen.width,
          screenHeight: screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        }
      };

      this._send(data);
    },

    /**
     * 点击事件上报（手动调用）
     * @param {String} buttonCode - 按钮编码
     * @param {Object} extra - 额外数据
     */
    trackClick: function(buttonCode, extra) {
      this.track('button_click', {
        button_code: buttonCode,
        page_url: window.location.href,
        extra: extra || {}
      });
    },

    /**
     * 发送数据到后端
     */
    _send: function(data) {
      var self = this;

      // 优先使用 sendBeacon（页面关闭时也能发送）
      if (navigator.sendBeacon) {
        var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        var success = navigator.sendBeacon(this.config.apiUrl, blob);
        if (success) {
          this._log('上报成功 (sendBeacon)', JSON.stringify(data));
          return;
        }
      }

      // 降级使用 fetch
      fetch(this.config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).then(function() {
        self._log('上报成功 (fetch)', data);
      }).catch(function(err) {
        self._log('上报失败', err);
      });
    },

    /**
     * 调试日志
     */
    _log: function(msg, data) {
      if (this.config.debug) {
        console.log('[JYTracker]', msg, data || '');
      }
    }
  };

  // 暴露到全局
  window.JYTracker = JYTracker;

})(window);
