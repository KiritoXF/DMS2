# DMS2
Daily Management System 2.0

使用 antdesign pro 脚手架搭建的个人日报管理系统。

技术栈： React + Ant Design4 + Umi + DvaJS 

数据存在 IndexedDB 里，可以在 F12 的 Application 里找到。

## Demo
https://kiritoxf.github.io/

如果你曾经打开过这个链接，可能会需要多按几次 ctrl + shift + R 强制刷新，不然页面还是上一次的缓存。

## 安装依赖

Install `node_modules`:

```bash
npm install
```

## 启动

```bash
npm start
```

## 打包部署

1. 
```bash
npm run build
```

2. 将内容拷到专门发布 demo 的本地仓库，如果有 `CNAME`，删除掉。

3. 提交并推送上去。

## 清空数据库（IndexedDB）

1. 在 DMS 页面上按 F12，在 Application 选项卡里找到 `Storage` 下的 `IndexedDB` 
2. 选择 `daily - https://kiritoxf.github.io`，点击 `Delete database`即可删掉本地的数据库
