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

        this.currentAnimation = 'Idle';
        this.currentFrame = 0;
        this.frameDelay = 100; // 每帧延迟（毫秒）
        this.lastFrameTime = Date.now();
        this.images = {}; // 存储已加载的图片
        this.isLoading = true;

        // 猫咪位置和缩放
        this.catX = this.canvas.width / 2;
        this.catY = this.canvas.height / 2;
        this.scale = 4; // 放大倍数（像素艺术）

        // 预加载所有动画
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
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;

        // 更新帧
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
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.isLoading) {
            // 显示加载信息
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

        // 计算源帧位置
        const sx = this.currentFrame * frameWidth;
        const sy = 0;

        // 计算目标绘制位置（居中）
        const drawWidth = frameWidth * this.scale;
        const drawHeight = frameHeight * this.scale;
        const dx = this.catX - drawWidth / 2;
        const dy = this.catY - drawHeight / 2;

        // 禁用图像平滑以保持像素风格
        this.ctx.imageSmoothingEnabled = false;

        // 绘制当前帧
        this.ctx.drawImage(
            img,
            sx, sy, frameWidth, frameHeight,
            dx, dy, drawWidth, drawHeight
        );

        // 显示调试信息
        this.ctx.fillStyle = '#666';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Animation: ${this.currentAnimation}`, 10, 20);
        this.ctx.fillText(`Frame: ${this.currentFrame + 1}/${frameCount}`, 10, 40);
    }

    changeAnimation(animationName) {
        if (this.animations[animationName]) {
            this.currentAnimation = animationName;
            this.currentFrame = 0;

            // 更新显示的动画名称
            const animationLabel = document.getElementById('currentAnimation');
            if (animationLabel) {
                animationLabel.textContent = animationName;
            }
        } else {
            console.warn(`Animation "${animationName}" not found`);
        }
    }

    // 获取猫咪的边界框（用于点击检测）
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
}

// 初始化动画
let catAnimation;

window.addEventListener('load', () => {
    catAnimation = new CatAnimation('catCanvas');

    // 添加点击事件
    const canvas = document.getElementById('catCanvas');
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const bounds = catAnimation.getCatBounds();
        if (bounds &&
            x >= bounds.x && x <= bounds.x + bounds.width &&
            y >= bounds.y && y <= bounds.y + bounds.height) {

            // 点击猫咪时切换到惊讶动画
            const reactions = ['Surprised', 'Excited', 'Dance'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            catAnimation.changeAnimation(randomReaction);

            // 2秒后回到待机状态
            setTimeout(() => {
                catAnimation.changeAnimation('Idle');
            }, 2000);
        }
    });

    // 添加拖拽功能
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const bounds = catAnimation.getCatBounds();
        if (bounds &&
            x >= bounds.x && x <= bounds.x + bounds.width &&
            y >= bounds.y && y <= bounds.y + bounds.height) {

            isDragging = true;
            dragOffsetX = x - catAnimation.catX;
            dragOffsetY = y - catAnimation.catY;
            canvas.style.cursor = 'grabbing';
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            catAnimation.catX = x - dragOffsetX;
            catAnimation.catY = y - dragOffsetY;
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'pointer';
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'pointer';
        }
    });
});
