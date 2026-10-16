# 晴耕小院

静态网页，图片均随仓库提供。无需构建、依赖或服务器。

## 发布到 GitHub Pages

1. 解压后，把本目录内的文件和 `assets` 文件夹上传到 GitHub 仓库根目录（不要只上传 ZIP）。
2. 在仓库 Settings → Pages → Build and deployment 中选择 Deploy from a branch，分支选 `main`，目录选 `/ (root)` 并保存。
3. 等待部署完成，打开 Pages 地址。用户存档保存在当前浏览器；换域名后可从游戏里导出并导入存档。

本包使用相对路径，仓库 Pages 地址和自定义域名均可加载图片。直接双击本地 `index.html` 可能受浏览器模块限制，请通过 Pages 访问。
