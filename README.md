# Description（描述）

    实现图片懒加载的组件，
    手Q等浏览器使用老版本兼容，
    其它平台使用新版本

# Design（实现原理）

## 实现曝光逻辑

#### 老版本

    检测节点的getBoundingClientRect()返回值判断位置

#### 新版本

    使用IntersectionObserver
    https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill 用来适配低版本浏览器

## 自动绑定load

    使用MutationObserver，
    对于不支持MutationObserver的浏览器采用DOMNodeInserted事件替代

# Usage(用法)

引入
```
    import lazyLoad from "lazyload-io";

```

图片src里的地址放到data-src里,如
```
    <img src="" data-src="https://www.flypie.cn/images/avatar.jpg" />
```

如果需要手动刷新lazy缓存，需要手动调用(仅限老版本,新版本无此问题)
```
    lazyLoad.refreshLazyload();
```

在某些情况下 如果lazyload没有初始化完成或者没有事件响应,重新渲染(仅限老版本,新版本无此问题)
```
    lazyLoad.currentLazy();
```

# 兼容性

## PC: 

IE8以上

Chrome 48+

Firefox 49+

Opera 42+

Opera Mini 不支持

## mobile: 

Android 4.3以上 , Safari 9以上

QQ,UC,微信 新版本均支持，老版本尚未测试

# Demo(Path)

js
```
    import lazyLoad from "@mfelibs/base-tools-lazyload";

```

html
```
    <img src="" data-src="https://www.flypie.cn/images/avatar.jpg" />
```

# Screenshots（快照）



# Properties(对外属性)：
类型：（Array，Number，String，Boolean，（asc,desc））

| 属性名称           | 类型           | 默认值          |get|set
| :-------------- | :------------ |:------------ |:------------ |:------------ |
| 测试属性 | String | '' | √ | √ |


# Methods(对外方法)


| 方法名称           | 类型           | 描述          |返回值
| :-------------- | :------------ |:------------ |:------------ |
| currentLazy(仅限老版本) | 无 | pageload的时候触发，在某些情况下 如果lazyload没有初始化完成或者没有事件响应 | 无 |
| refreshLazyload(仅限老版本) | 无 | 重新刷新lazyload初始化，用在动态添加元素之后。如果被添加元素中包含有lz的需要手动重新初始化lz | 无 |


# Events(对外事件)


| 事件名称          | 参数           | 描述          |返回值
| :-------------- | :------------ |:------------ |:------------ |
| TestEvent | 测试参数 | 测试描述 | 无 |
| TestEvent | 测试参数 | 测试描述 | 无 |
 