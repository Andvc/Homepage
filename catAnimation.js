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
                onHover: 'Box2',
                onDragStart: 'Excited',
                timeout: null
            },
            'Box2': {
                onHoverLeave: 'Box1',
                onDragStart: 'Excited',
                timeout: null
            },
            'Excited': {
                onDragEnd: 'Idle',
                timeout: null
            },
            'Idle': {
                onHover: 'Idle2',
                onDragStart: 'Excited',
                onClick: 'Surprised',
                timeout: { state: 'Sleepy', delay: 5000 }
            },
            'Idle2': {
                onHoverLeave: 'Idle',
                onDragStart: 'Excited',
                onClick: 'Surprised',
                timeout: { state: 'Sleepy', delay: 5000 }
            },
            'Sleepy': {
                onDragStart: 'Surprised',
                onClick: 'Surprised',
                timeout: { state: 'Sleep', delay: 1000 }  // 修改为1秒
            },
            'Sleep': {
                onDragStart: 'Surprised',
                onClick: 'Surprised',
                timeout: null
            },
            'Surprised': {
                timeout: { state: 'Idle', delay: 2000 }
            },
            'Eating': {
                timeout: { state: 'Idle', delay: 3000 }
            },
            'Dance': {
                timeout: { state: 'Idle', delay: 2000 }
            },
            'Waiting': {
                timeout: { state: 'Idle', delay: 2000 }
            },
            'LayDown': {
                onDragStart: 'Surprised',
                onClick: 'Excited',
                timeout: { state: 'Sleepy', delay: 4000 }
            },
            'Cry': {
                timeout: { state: 'Sad', delay: 2000 }
            },
            'Sad': {
                onClick: 'Surprised',
                timeout: { state: 'Idle', delay: 4000 }
            }
        };

        // 场景物品热区定义（基于800x600画布和ExampleRoom 2）
        this.sceneHotspots = [
            {
                name: '食碗',
                x: 320, y: 480, width: 60, height: 50,
                action: 'Eating',
                description: '点击食碗，猫咪会去吃饭'
            },
            {
                name: '水碗',
                x: 390, y: 460, width: 50, height: 45,
                action: 'Eating',
                description: '点击水碗，猫咪会去喝水'
            },
            {
                name: '猫窝',
                x: 280, y: 280, width: 120, height: 80,
                action: 'Sleep',
                description: '点击猫窝，猫咪会去睡觉'
            },
            {
                name: '猫爬架',
                x: 520, y: 280, width: 100, height: 120,
                action: 'Excited',
                description: '点击猫爬架，猫咪会兴奋地玩耍'
            },
            {
                name: '玩具球',
                x: 200, y: 380, width: 40, height: 40,
                action: 'Dance',
                description: '点击玩具球，猫咪会玩球'
            },
            {
                name: '架子',
                x: 100, y: 280, width: 80, height: 100,
                action: 'LayDown',
                description: '点击架子，猫咪会躺在上面'
            },
            {
                name: '植物',
                x: 170, y: 240, width: 50, height: 70,
                action: 'Surprised',
                description: '点击植物，猫咪会感到好奇'
            },
            {
                name: '猫抓板',
                x: 450, y: 280, width: 50, height: 60,
                action: 'Waiting',
                description: '点击猫抓板，猫咪会去抓挠'
            }
        ];

        this.currentAnimation = 'Idle';  // 初始状态改为待机
        this.currentFrame = 0;
        this.frameDelay = 100;
        this.lastFrameTime = Date.now();
        this.images = {};
        this.backgroundImage = null;
        this.isLoading = true;

        // 猫咪位置和缩放
        this.catX = this.canvas.width / 2;
        this.catY = this.canvas.height / 2;
        this.scale = 4;

        // 状态管理
        this.stateTimer = null;
        this.isHovering = false;
        this.isDragging = false;
        this.manualControl = false;
        this.hoveredHotspot = null;  // 当前悬停的热区
        this.showHotspots = false;   // 是否显示热区（调试用）

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

        // 绘制热区（调试模式）
        if (this.showHotspots) {
            this.sceneHotspots.forEach(hotspot => {
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);

                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                this.ctx.fillRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);

                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(hotspot.name, hotspot.x + hotspot.width/2, hotspot.y + hotspot.height/2);
            });
        }

        // 高亮悬停的热区
        if (this.hoveredHotspot && !this.isDragging) {
            const h = this.hoveredHotspot;
            this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(h.x, h.y, h.width, h.height);

            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
            this.ctx.fillRect(h.x, h.y, h.width, h.height);

            // 显示提示文字
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(h.x, h.y - 25, h.width + 60, 22);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(h.description, h.x + h.width/2 + 30, h.y - 10);
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

        // 显示状态信息
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(5, 5, 200, 85);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`State: ${this.currentAnimation}`, 10, 20);
        this.ctx.fillText(`Frame: ${this.currentFrame + 1}/${frameCount}`, 10, 40);
        this.ctx.fillText(`Mode: ${this.manualControl ? 'Manual' : 'Auto'}`, 10, 60);
        this.ctx.fillText(`Hotspot: ${this.hoveredHotspot?.name || 'None'}`, 10, 80);

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
        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.onDragEnd) {
            this.changeState(currentState.onDragEnd, 'drag-end');
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
