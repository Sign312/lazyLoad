import './intersection-observer'

let lazyLoad = {}

//手Q浏览器用老版本兼容
if (navigator.userAgent.indexOf("QQ") > -1) {

    var doc = document
    var win = window

    lazyLoad = {
        lazyImgAttr: "data-src",
        lazyClsClass: "data-class",
        marginHeight: 25,
        lazyCss: true,
        lazyClsAttr: "lazycls",
        _lazyHandler: null,
        _lazyImgCache: [],
        _lazyClsCache: [],
        init: function () {
            this._lazyHandler = null;
            this._lazyImgCache = [];
            this._lazyClsCache = [];
            this._refreshLazyItems();
            this._initEvent();
            this._loadLazy();
            this._listenDomChange(ele => {
                this._refreshLazyItems()
            })
        },
        _listenDomChange: function (cb) {
            if ('MutationObserver' in window) {
                let observer = new MutationObserver(ms => {
                    ms.forEach(m => {
                        m.addedNodes && m.addedNodes[0] && cb(m.addedNodes[0])
                    })
                });
                observer.observe(document.querySelector('body'), {
                    'childList': true,
                    'subtree': true
                })
            } else {
                document.addEventListener("DOMNodeInserted", m => {
                    cb(m.target)
                })
            }
        },
        currentLazy: function () {
            this._loadLazy();
        },
        refreshLazyload: function () {
            this._refreshLazyItems()
        },
        _refreshLazyItems: function () {
            var me = this;
            this._lazyImgCache = [];
            this._lazyClsCache = [];

            Array.prototype.forEach.call(doc.querySelectorAll("img"), function (img) {
                img.getAttribute(me.lazyImgAttr) && me._lazyImgCache.push(img);
            });
            me.lazyCss && Array.prototype.forEach.call(doc.querySelectorAll("." + me.lazyClsAttr), function (ele) {
                ele.getAttribute(me.lazyClsClass) && me._lazyClsCache.push(ele);
            });
        },
        _loadLazy: function () {
            var me = this;
            if (this._lazyHandler) {
                clearTimeout(this._lazyHandler);
                this._lazyHandler = null;
            }
            this._lazyHandler = setTimeout(function () {
                var dd = doc.documentElement;
                var viewHeight = win.innerHeight || dd.clientHeight || doc.body.clientHeight || 0;
                var removeArray = [];
                me._refreshLazyItems();

                //给cache里的img添加图片地址
                for (var i = 0; i < me._lazyImgCache.length; i++) {
                    var img = me._lazyImgCache[i];
                    var posInfo = img.getBoundingClientRect();
                    if (posInfo && toString.call(posInfo.top) === "[object Number]" && posInfo.top > -me.marginHeight && posInfo.top < (viewHeight + me.marginHeight)) {
                        img.setAttribute('src', img.getAttribute(me.lazyImgAttr));
                        img.removeAttribute(me.lazyImgAttr);
                        removeArray.push(i);
                    }
                }

                //维护cache
                for (var i = removeArray.length - 1; i >= 0; i--) {
                    me._lazyImgCache.splice(removeArray[i], 1)
                }

                removeArray = []

                //给cache里的元素添加样式
                for (var i = 0; i < me._lazyClsCache.length; i++) {
                    var ele = me._lazyClsCache[i];
                    var posInfo = ele.getBoundingClientRect();
                    if (posInfo && toString.call(posInfo.top) === "[object Number]" && posInfo.top > -me.marginHeight && posInfo.top < (viewHeight + me.marginHeight)) {
                        ele.classList.add(ele.getAttribute(me.lazyClsClass))
                        removeArray.push(i);
                    }
                }

                //维护cache
                for (var i = removeArray.length - 1; i >= 0; i--) {
                    me._lazyClsCache.splice(removeArray[i], 1)
                }
            }, 100)
        },
        _initEvent: function () {
            win.addEventListener('scroll', this._loadLazy.bind(this), false);
            win.addEventListener('resize', this._loadLazy.bind(this), false);
            win.addEventListener('orientationchange', this._loadLazy.bind(this), false);
        }
    };


} else {

    lazyLoad = {
        me: {
            lazyImgAttr: "data-src",
        },
        init: function (opt) {
            Object.assign(this.me, opt)
            let io = new IntersectionObserver(this._entry.bind(this))
            let imgs = document.querySelectorAll('img')
            let temp = [] //过滤后的图片元素们
            for (let i = 0; i < imgs.length; ++i) {
                let ele = imgs[i]
                if (ele.hasAttribute(this.me.lazyImgAttr)) {
                    temp.push(ele)
                }
            }
            temp.forEach(ele => {
                io.observe(ele)
            })
            this._listenDomChange(ele => {
                if (ele && ele.localName == 'img' && ele.getAttribute(this.me.lazyImgAttr)) {
                    io.observe(ele)
                }
            })
        },
        //新版本不用手动重新加载和定位当前加载,为了统一API
        refreshLazyload: function () {},
        currentLazy: function () {},
        _listenDomChange: function (cb) {
            if ('MutationObserver' in window) {
                let observer = new MutationObserver(ms => {
                    ms.forEach(m => {
                        m.addedNodes && m.addedNodes[0] && cb(m.addedNodes[0])
                    })
                });
                observer.observe(document.querySelector('body'), {
                    'childList': true,
                    'subtree': true
                })
            } else {
                document.addEventListener("DOMNodeInserted", m => {
                    cb(m.target)
                })
            }
        },
        _entry: function (entries) {
            entries.forEach(item => {
                let ele = item.target
                ele.getAttribute(this.me.lazyImgAttr) && this._load(ele)
            })
        },
        _load: function (ele) {
            setTimeout(() => {
                ele.setAttribute('src', ele.getAttribute(this.me.lazyImgAttr))
                ele.removeAttribute(this.me.lazyImgAttr)
            }, 100);
        }
    }
}

lazyLoad.init()

export default lazyLoad