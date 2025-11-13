class CatAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // 动画配置：每个动画的帧数（已根据实际sprite sheet修正）
        this.animations = {
            'Idle': { frames: 10, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Idle.png' },
            'Idle2': { frames: 10, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Idle2.png' },
            'Eating': { frames: 15, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Eating.png' },
            'Dance': { frames: 4, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Dance.png' },
            'Sleep': { frames: 4, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Sleep.png' },
            'Sleepy': { frames: 8, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Sleepy.png' },
            'Excited': { frames: 12, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Excited.png' },
            'Surprised': { frames: 12, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Surprised.png' },
            'Box1': { frames: 4, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Box1.png' },
            'Box2': { frames: 12, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Box2.png' },
            'Box3': { frames: 4, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Box3.png' },
            'Cry': { frames: 4, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Cry.png' },
            'Sad': { frames: 9, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Sad.png' },
            'Waiting': { frames: 6, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/Waiting.png' },
            'LayDown': { frames: 12, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/LayDown.png' },
            'CatSick1': { frames: 5, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/catsick1.png' },
            'CatSick2': { frames: 4, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/catsick2.png' },
            'DeadCat': { frames: 1, path: 'public/CatPackPaid/CatPackPaid/Sprites/Classical/Individual/DeadCat.png' }
        };

        // 状态机配置
        this.states = {
            'Box1': {
                onHover: 'Box2',           // 悬停时进入Box2
                onDragStart: 'Excited',    // 开始拖动时兴奋
                timeout: null              // 无自动转换
            },
            'Box2': {
                onHoverLeave: 'Box1',      // 鼠标离开时回到Box1
                onDragStart: 'Excited',    // 开始拖动时兴奋
                timeout: null
            },
            'Excited': {
                onDragEnd: 'Idle',         // 拖动结束进入待机
                timeout: { state: 'Sleepy', delay: 3000 }  // 3秒后困倦
            },
            'Idle': {
                onHover: 'Idle2',          // 悬停时换个待机姿势
                onDragStart: 'Excited',    // 拖动时兴奋
                onClick: 'Surprised',       // 点击时惊讶
                timeout: { state: 'Sleepy', delay: 5000 }  // 5秒后困倦
            },
            'Idle2': {
                onHoverLeave: 'Idle',      // 离开后回到普通待机
                onDragStart: 'Excited',
                onClick: 'Surprised',
                timeout: { state: 'Sleepy', delay: 5000 }
            },
            'Sleepy': {
                onDragStart: 'Surprised',  // 困倦时拖动会惊讶
                onClick: 'Surprised',
                timeout: { state: 'Sleep', delay: 1000 }  // 1秒后睡觉
            },
            'Sleep': {
                onDragStart: 'Surprised',  // 睡觉时拖动会惊醒
                onClick: 'Surprised',      // 睡觉时点击会惊醒
                timeout: null              // 睡觉不会自动转换
            },
            'Surprised': {
                timeout: { state: 'Idle', delay: 2000 }  // 2秒后回到待机
            },
            'Eating': {
                timeout: { state: 'Sleepy', delay: 5000 }  // 5秒后困倦
            },
            'Dance': {
                timeout: { state: 'Sleepy', delay: 3000 }  // 3秒后困倦
            },
            'Waiting': {
                timeout: { state: 'Idle', delay: 2000 }
            },
            'LayDown': {
                onDragStart: 'Surprised',
                onClick: 'Excited',
                timeout: null  // 持续状态，不会自动转换
            },
            'Cry': {
                timeout: { state: 'Sad', delay: 2000 }
            },
            'Sad': {
                onClick: 'Surprised',
                timeout: { state: 'Idle', delay: 4000 }
            },
            'CatSick1': {
                timeout: { state: 'Sleepy', delay: 5000 }  // 5秒后困倦
            },
            'CatSick2': {
                timeout: { state: 'Sleepy', delay: 3000 }
            }
        };

        // 场景物品热区定义（基于1600x1200画布和ExampleRoom 2，2倍缩放，向右调整）
        this.sceneHotspots = [
            {
                name: '食碗',
                x: 740, y: 960, width: 120, height: 100,
                action: 'Eating',
                description: '拖动到食碗，猫咪会去吃饭',
                snapPoint: { x: 800, y: 950 }  // 吸附点：食碗旁边
            },
            {
                name: '水碗',
                x: 880, y: 920, width: 100, height: 90,
                action: 'CatSick1',
                description: '拖动到水碗，猫咪会喝水（生病）',
                snapPoint: { x: 930, y: 920 }  // 吸附点：水碗旁边
            },
            {
                name: '猫窝',
                x: 660, y: 560, width: 240, height: 160,
                action: 'Sleep',
                description: '拖动到猫窝，猫咪会去睡觉',
                snapPoint: { x: 780, y: 620 }  // 吸附点：猫窝中心
            },
            {
                name: '猫爬架',
                x: 1140, y: 560, width: 200, height: 240,
                action: 'Dance',
                description: '拖动到猫爬架，猫咪会跳舞',
                snapPoint: { x: 1240, y: 650 }  // 吸附点：猫爬架中层
            },
            {
                name: '玩具球',
                x: 500, y: 760, width: 80, height: 80,
                action: 'Dance',
                description: '点击玩具球，猫咪会玩球',
                snapPoint: { x: 540, y: 800 }  // 吸附点：球旁边
            },
            {
                name: '架子',
                x: 300, y: 560, width: 160, height: 200,
                action: 'LayDown',
                description: '拖动到架子，猫咪会躺在上面',
                snapPoint: { x: 380, y: 620 }  // 吸附点：架子上层
            },
            {
                name: '植物',
                x: 440, y: 480, width: 100, height: 140,
                action: 'Surprised',
                description: '点击植物，猫咪会感到好奇'
                // 无snapPoint，不支持吸附
            },
            {
                name: '猫抓板',
                x: 1000, y: 560, width: 100, height: 120,
                action: 'Excited',
                description: '拖动到猫抓板，猫咪会兴奋抓挠',
                snapPoint: { x: 1050, y: 620 }  // 吸附点：猫抓板前
            }
        ];

        this.currentAnimation = 'Box1';  // 初始状态：在箱子里
        this.currentFrame = 0;
        this.frameDelay = 100;
        this.lastFrameTime = Date.now();
        this.images = {};
        this.backgroundImage = null;
        this.isLoading = true;

        // 猫咪位置和缩放（初始在场景中央）
        this.catX = this.canvas.width / 2;
        this.catY = this.canvas.height / 2;
        this.scale = 3;  // 从4缩小到3，相对场景更小

        // 状态管理
        this.stateTimer = null;
        this.isHovering = false;
        this.isDragging = false;
        this.manualControl = false;
        this.hoveredHotspot = null;  // 当前悬停的热区
        this.showHotspots = false;   // 是否显示热区（调试用）
        this.activeSnapZone = null;  // 当前拖动到的吸附区域

        this.preloadAnimations();
    }

    preloadAnimations() {
        // 加载背景图
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            console.log('Background loaded');
        };
        this.backgroundImage.onerror = () => {
            console.error('Failed to load background');
        };
        this.backgroundImage.src = 'public/CatPackPaid/CatPackPaid/ExampleRooms/ExampleRoom 2.png';

        // 加载所有动画
        const animationKeys = Object.keys(this.animations);
        let loadedCount = 0;

        animationKeys.forEach(key => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === animationKeys.length) {
                    this.isLoading = false;
                    this.startAnimation();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${this.animations[key].path}`);
                loadedCount++;
                if (loadedCount === animationKeys.length) {
                    this.isLoading = false;
                    this.startAnimation();
                }
            };
            img.src = this.animations[key].path;
            this.images[key] = img;
        });
    }

    startAnimation() {
        this.animate();
        this.setupStateTimer();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;

        if (deltaTime > this.frameDelay) {
            this.currentFrame++;
            const maxFrames = this.animations[this.currentAnimation].frames;
            if (this.currentFrame >= maxFrames) {
                this.currentFrame = 0;
            }
            this.lastFrameTime = now;
        }

        this.render();
    }

    render() {
        // 清空画布
        this.ctx.fillStyle = '#87CEEB';  // 天空蓝背景
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景场景
        if (this.backgroundImage && this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }

        if (this.isLoading) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        // 绘制热区（调试模式，2倍缩放）
        if (this.showHotspots) {
            this.sceneHotspots.forEach(hotspot => {
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);

                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                this.ctx.fillRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);

                this.ctx.fillStyle = '#fff';
                this.ctx.font = '24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(hotspot.name, hotspot.x + hotspot.width/2, hotspot.y + hotspot.height/2);
            });
        }

        // 高亮悬停的热区（2倍缩放）
        if (this.hoveredHotspot && !this.isDragging) {
            const h = this.hoveredHotspot;
            this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
            this.ctx.lineWidth = 6;
            this.ctx.strokeRect(h.x, h.y, h.width, h.height);

            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
            this.ctx.fillRect(h.x, h.y, h.width, h.height);

            // 显示提示文字（放大2倍）
            const textWidth = h.width + 120;
            const textHeight = 44;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(h.x, h.y - 50, textWidth, textHeight);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(h.description, h.x + textWidth/2, h.y - 20);
        }

        // 绘制吸附虚影（如果正在拖动且在吸附区域内）
        if (this.isDragging && this.activeSnapZone) {
            const snapImg = this.images[this.activeSnapZone.action];
            if (snapImg && snapImg.complete) {
                const snapFrameCount = this.animations[this.activeSnapZone.action].frames;
                const snapFrameWidth = snapImg.width / snapFrameCount;
                const snapFrameHeight = snapImg.height;

                // 使用第一帧作为虚影
                const snapSx = 0;
                const snapSy = 0;

                const snapDrawWidth = snapFrameWidth * this.scale;
                const snapDrawHeight = snapFrameHeight * this.scale;
                const snapDx = this.activeSnapZone.snapPoint.x - snapDrawWidth / 2;
                const snapDy = this.activeSnapZone.snapPoint.y - snapDrawHeight / 2;

                // 绘制半透明虚影
                this.ctx.globalAlpha = 0.4;
                this.ctx.imageSmoothingEnabled = false;

                this.ctx.drawImage(
                    snapImg,
                    snapSx, snapSy, snapFrameWidth, snapFrameHeight,
                    snapDx, snapDy, snapDrawWidth, snapDrawHeight
                );

                // 恢复透明度
                this.ctx.globalAlpha = 1.0;

                // 绘制吸附点标记
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(this.activeSnapZone.snapPoint.x, this.activeSnapZone.snapPoint.y, 15, 0, Math.PI * 2);
                this.ctx.fill();

                // 绘制提示文字
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                this.ctx.fillRect(this.activeSnapZone.snapPoint.x - 100, this.activeSnapZone.snapPoint.y - 60, 200, 40);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '20px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`松开鼠标进入${this.activeSnapZone.name}`, this.activeSnapZone.snapPoint.x, this.activeSnapZone.snapPoint.y - 35);
            }
        }

        // 绘制猫咪
        const img = this.images[this.currentAnimation];
        if (!img || !img.complete) {
            return;
        }

        const frameCount = this.animations[this.currentAnimation].frames;
        const frameWidth = img.width / frameCount;
        const frameHeight = img.height;

        const sx = this.currentFrame * frameWidth;
        const sy = 0;

        const drawWidth = frameWidth * this.scale;
        const drawHeight = frameHeight * this.scale;
        const dx = this.catX - drawWidth / 2;
        const dy = this.catY - drawHeight / 2;

        this.ctx.imageSmoothingEnabled = false;

        this.ctx.drawImage(
            img,
            sx, sy, frameWidth, frameHeight,
            dx, dy, drawWidth, drawHeight
        );

        // 显示状态信息（放大2倍适应新canvas）
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 400, 170);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '28px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`State: ${this.currentAnimation}`, 20, 45);
        this.ctx.fillText(`Frame: ${this.currentFrame + 1}/${frameCount}`, 20, 85);
        this.ctx.fillText(`Mode: ${this.manualControl ? 'Manual' : 'Auto'}`, 20, 125);
        this.ctx.fillText(`Hotspot: ${this.hoveredHotspot?.name || 'None'}`, 20, 165);

        // 悬停在猫咪上的提示
        if (this.isHovering && !this.hoveredHotspot) {
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
            const bounds = this.getCatBounds();
            if (bounds) {
                this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            }
        }
    }

    changeState(newState, reason = 'manual') {
        if (!this.animations[newState]) {
            console.warn(`State "${newState}" not found`);
            return;
        }

        console.log(`State transition: ${this.currentAnimation} → ${newState} (${reason})`);

        this.currentAnimation = newState;
        this.currentFrame = 0;

        const animationLabel = document.getElementById('currentAnimation');
        if (animationLabel) {
            animationLabel.textContent = newState;
        }

        if (this.stateTimer) {
            clearTimeout(this.stateTimer);
            this.stateTimer = null;
        }

        if (!this.manualControl) {
            this.setupStateTimer();
        }
    }

    setupStateTimer() {
        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.timeout) {
            this.stateTimer = setTimeout(() => {
                if (!this.manualControl && !this.isDragging) {
                    this.changeState(currentState.timeout.state, 'auto-timeout');
                }
            }, currentState.timeout.delay);
        }
    }

    handleHover(isHovering) {
        if (this.manualControl || this.isDragging) return;

        const currentState = this.states[this.currentAnimation];
        if (!currentState) return;

        if (isHovering && !this.isHovering && currentState.onHover) {
            this.changeState(currentState.onHover, 'hover');
        } else if (!isHovering && this.isHovering && currentState.onHoverLeave) {
            this.changeState(currentState.onHoverLeave, 'hover-leave');
        }

        this.isHovering = isHovering;
    }

    handleDragStart() {
        if (this.manualControl) return;

        this.isDragging = true;
        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.onDragStart) {
            this.changeState(currentState.onDragStart, 'drag-start');
        }
    }

    handleDragEnd() {
        if (this.manualControl) return;

        this.isDragging = false;

        // 如果在吸附区域，执行吸附
        if (this.activeSnapZone) {
            console.log(`Snapping to ${this.activeSnapZone.name}`);

            // 移动猫咪到吸附点
            this.catX = this.activeSnapZone.snapPoint.x;
            this.catY = this.activeSnapZone.snapPoint.y;

            // 执行对应动作
            this.changeState(this.activeSnapZone.action, `snap-${this.activeSnapZone.name}`);

            // 清除吸附区域
            this.activeSnapZone = null;
        } else {
            // 普通拖动结束
            const currentState = this.states[this.currentAnimation];
            if (currentState && currentState.onDragEnd) {
                this.changeState(currentState.onDragEnd, 'drag-end');
            }
        }
    }

    handleClick() {
        if (this.manualControl || this.isDragging) return;

        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.onClick) {
            this.changeState(currentState.onClick, 'click');
        }
    }

    // 检查点击的热区
    checkHotspotClick(x, y) {
        for (const hotspot of this.sceneHotspots) {
            if (x >= hotspot.x && x <= hotspot.x + hotspot.width &&
                y >= hotspot.y && y <= hotspot.y + hotspot.height) {
                console.log(`Hotspot clicked: ${hotspot.name} → ${hotspot.action}`);
                this.changeState(hotspot.action, `hotspot-${hotspot.name}`);
                return true;
            }
        }
        return false;
    }

    // 检查鼠标悬停的热区
    checkHotspotHover(x, y) {
        for (const hotspot of this.sceneHotspots) {
            if (x >= hotspot.x && x <= hotspot.x + hotspot.width &&
                y >= hotspot.y && y <= hotspot.y + hotspot.height) {
                return hotspot;
            }
        }
        return null;
    }

    changeAnimation(animationName) {
        this.manualControl = true;
        this.changeState(animationName, 'manual-button');

        setTimeout(() => {
            this.manualControl = false;
            this.setupStateTimer();
        }, 5000);
    }

    toggleHotspots() {
        this.showHotspots = !this.showHotspots;
    }

    getCatBounds() {
        const img = this.images[this.currentAnimation];
        if (!img || !img.complete) return null;

        const frameCount = this.animations[this.currentAnimation].frames;
        const frameWidth = img.width / frameCount;
        const frameHeight = img.height;
        const drawWidth = frameWidth * this.scale;
        const drawHeight = frameHeight * this.scale;

        return {
            x: this.catX - drawWidth / 2,
            y: this.catY - drawHeight / 2,
            width: drawWidth,
            height: drawHeight
        };
    }

    isPointInCat(x, y) {
        const bounds = this.getCatBounds();
        if (!bounds) return false;
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    }
}

// 初始化动画和交互
let catAnimation;

window.addEventListener('load', () => {
    catAnimation = new CatAnimation('catCanvas');
    const canvas = document.getElementById('catCanvas');

    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // 鼠标移动事件
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (catAnimation.isDragging) {
            catAnimation.catX = x - dragOffsetX;
            catAnimation.catY = y - dragOffsetY;

            // 检查是否在吸附区域内（只检查有snapPoint的热区）
            const hotspot = catAnimation.checkHotspotHover(x, y);
            const snapZone = hotspot && hotspot.snapPoint ? hotspot : null;
            catAnimation.activeSnapZone = snapZone;

            // 更新鼠标样式
            if (snapZone) {
                canvas.style.cursor = 'copy';  // 表示可以放置
            } else {
                canvas.style.cursor = 'grabbing';
            }
        } else {
            // 检查热区悬停
            const hotspot = catAnimation.checkHotspotHover(x, y);
            catAnimation.hoveredHotspot = hotspot;

            // 如果不在热区上，检查是否在猫咪上
            if (!hotspot) {
                const isHovering = catAnimation.isPointInCat(x, y);
                catAnimation.handleHover(isHovering);
                canvas.style.cursor = isHovering ? 'pointer' : 'default';
            } else {
                canvas.style.cursor = 'pointer';
            }
        }
    });

    // 鼠标按下
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (catAnimation.isPointInCat(x, y)) {
            dragOffsetX = x - catAnimation.catX;
            dragOffsetY = y - catAnimation.catY;
            catAnimation.handleDragStart();
            canvas.style.cursor = 'grabbing';
        }
    });

    // 鼠标释放
    canvas.addEventListener('mouseup', (e) => {
        if (catAnimation.isDragging) {
            catAnimation.handleDragEnd();
            canvas.style.cursor = 'pointer';
        }
    });

    // 鼠标离开画布
    canvas.addEventListener('mouseleave', () => {
        if (catAnimation.isDragging) {
            catAnimation.handleDragEnd();
        }
        catAnimation.handleHover(false);
        catAnimation.hoveredHotspot = null;
        catAnimation.activeSnapZone = null;  // 清除吸附区域
        canvas.style.cursor = 'default';
    });

    // 点击事件
    let mouseDownPos = null;
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseDownPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 检查是否是点击（而非拖动）
        if (mouseDownPos &&
            Math.abs(x - mouseDownPos.x) < 5 &&
            Math.abs(y - mouseDownPos.y) < 5) {

            // 优先检查热区点击
            const hotspotClicked = catAnimation.checkHotspotClick(x, y);

            // 如果没有点击热区，检查是否点击了猫咪
            if (!hotspotClicked && catAnimation.isPointInCat(x, y)) {
                catAnimation.handleClick();
            }
        }
    });
});
