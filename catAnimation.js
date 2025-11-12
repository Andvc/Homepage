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
                timeout: null
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
                timeout: { state: 'Sleep', delay: 3000 }  // 3秒后睡觉
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
                timeout: { state: 'Idle', delay: 3000 }  // 吃完3秒后待机
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

        this.currentAnimation = 'Box1';  // 初始状态：在箱子里
        this.currentFrame = 0;
        this.frameDelay = 100;
        this.lastFrameTime = Date.now();
        this.images = {};
        this.isLoading = true;

        // 猫咪位置和缩放
        this.catX = this.canvas.width / 2;
        this.catY = this.canvas.height / 2;
        this.scale = 4;

        // 状态管理
        this.stateTimer = null;        // 状态转换定时器
        this.isHovering = false;       // 是否悬停在猫咪上
        this.isDragging = false;       // 是否正在拖动
        this.manualControl = false;    // 手动控制模式（按钮触发）

        this.preloadAnimations();
    }

    preloadAnimations() {
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
        this.setupStateTimer();  // 设置状态定时器
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
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.isLoading) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading cat animations...', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

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
        this.ctx.fillStyle = '#666';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`State: ${this.currentAnimation}`, 10, 20);
        this.ctx.fillText(`Frame: ${this.currentFrame + 1}/${frameCount}`, 10, 40);
        this.ctx.fillText(`Mode: ${this.manualControl ? 'Manual' : 'Auto'}`, 10, 60);

        // 悬停提示
        if (this.isHovering) {
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
            const bounds = this.getCatBounds();
            if (bounds) {
                this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            }
        }
    }

    // 状态转换方法
    changeState(newState, reason = 'manual') {
        if (!this.animations[newState]) {
            console.warn(`State "${newState}" not found`);
            return;
        }

        console.log(`State transition: ${this.currentAnimation} → ${newState} (${reason})`);

        this.currentAnimation = newState;
        this.currentFrame = 0;

        // 更新UI显示
        const animationLabel = document.getElementById('currentAnimation');
        if (animationLabel) {
            animationLabel.textContent = newState;
        }

        // 清除旧的定时器
        if (this.stateTimer) {
            clearTimeout(this.stateTimer);
            this.stateTimer = null;
        }

        // 设置新的状态定时器
        if (!this.manualControl) {
            this.setupStateTimer();
        }
    }

    // 设置状态转换定时器
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

    // 处理悬停事件
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

    // 处理拖动开始
    handleDragStart() {
        if (this.manualControl) return;

        this.isDragging = true;
        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.onDragStart) {
            this.changeState(currentState.onDragStart, 'drag-start');
        }
    }

    // 处理拖动结束
    handleDragEnd() {
        if (this.manualControl) return;

        this.isDragging = false;
        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.onDragEnd) {
            this.changeState(currentState.onDragEnd, 'drag-end');
        }
    }

    // 处理点击事件
    handleClick() {
        if (this.manualControl || this.isDragging) return;

        const currentState = this.states[this.currentAnimation];
        if (currentState && currentState.onClick) {
            this.changeState(currentState.onClick, 'click');
        }
    }

    // 手动控制模式（从按钮触发）
    changeAnimation(animationName) {
        this.manualControl = true;
        this.changeState(animationName, 'manual-button');

        // 5秒后退出手动模式
        setTimeout(() => {
            this.manualControl = false;
            this.setupStateTimer();
        }, 5000);
    }

    // 获取猫咪的边界框
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

    // 检查点是否在猫咪范围内
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

    // 鼠标移动事件（用于悬停检测和拖动）
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (catAnimation.isDragging) {
            // 拖动猫咪
            catAnimation.catX = x - dragOffsetX;
            catAnimation.catY = y - dragOffsetY;
        } else {
            // 悬停检测
            const isHovering = catAnimation.isPointInCat(x, y);
            catAnimation.handleHover(isHovering);
            canvas.style.cursor = isHovering ? 'pointer' : 'default';
        }
    });

    // 鼠标按下（开始拖动）
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

    // 鼠标释放（结束拖动）
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
        canvas.style.cursor = 'default';
    });

    // 点击事件（不拖动的点击）
    let mouseDownPos = null;
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseDownPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 如果鼠标没有移动太多，算作点击
        if (mouseDownPos &&
            Math.abs(x - mouseDownPos.x) < 5 &&
            Math.abs(y - mouseDownPos.y) < 5 &&
            catAnimation.isPointInCat(x, y)) {
            catAnimation.handleClick();
        }
    });
});
