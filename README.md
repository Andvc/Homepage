# 🐱 Cat Interactive Homepage

一个可爱的猫咪互动个人主页，使用像素风格的动画。

## 功能特性

- ✅ **动态猫咪动画**：支持多种动画状态（待机、吃饭、跳舞、睡觉等）
- ✅ **点击交互**：点击猫咪会触发随机反应动画
- ✅ **拖拽功能**：可以拖动猫咪到画布的任意位置
- ✅ **流畅动画**：基于Canvas的sprite sheet动画系统

## 技术栈

- HTML5 Canvas
- 原生JavaScript（无依赖）
- 像素艺术风格（Pixel Art）

## 本地运行

```bash
# 启动本地服务器
python3 -m http.server 8000

# 然后在浏览器打开
# http://localhost:8000
```

## 项目结构

```
Homepage/
├── index.html              # 主页面
├── catAnimation.js         # 动画引擎
└── public/
    └── CatPackPaid/        # 猫咪资源包
        ├── Sprites/        # 精灵图
        ├── CatItems/       # 场景物品
        └── ExampleRooms/   # 示例房间
```

## 可用动画

- Idle - 待机
- Eating - 吃饭
- Dance - 跳舞
- Sleep - 睡觉
- Excited - 兴奋
- Surprised - 惊讶
- Box1/2/3 - 在箱子里
- Cry - 哭泣
- Sad - 悲伤
- Waiting - 等待
- LayDown - 躺下

## 下一步计划

- [ ] 添加房间场景背景
- [ ] 实现场景物品交互（点击跳转到作品集、联系方式等）
- [ ] 添加更多猫咪行为（随机动作、自动移动等）
- [ ] 响应式设计
- [ ] 音效系统