document.addEventListener('DOMContentLoaded', function() {
    // 轮播图功能
    const carousel = document.querySelector('.carousel-container');
    const carouselImages = carousel.querySelectorAll('img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    const totalImages = carouselImages.length;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 按钮事件监听
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 图片筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            galleryGrid.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 点赞功能
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('liked');
            if (this.classList.contains('liked')) {
                this.style.background = '#ff6b81';
            } else {
                this.style.background = '#ff4757';
            }
        });
    });

    // 图片懒加载
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    galleryImages.forEach(img => {
        if (img.src) {
            img.dataset.src = img.src;
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 占位图
            imageObserver.observe(img);
        }
    });

    // 图片点击放大预览
    const previewImages = document.querySelectorAll('.gallery-item img');
    previewImages.forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <img src="${this.src}" alt="${this.alt}">
                    <button class="modal-close">×</button>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close').onclick = () => modal.remove();
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
        });
    });

    // 添加返回顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // 返回顶部点击事件
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 获取所有section元素（只声明一次）
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // 页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // 导航栏活动项目高亮
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 活动报名功能
    const joinButtons = document.querySelectorAll('.join-activity');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityItem = this.closest('.activity-item');
            const activityName = activityItem.querySelector('h4').textContent;
            const participants = activityItem.querySelector('.participants');
            const [current, total] = participants.textContent.match(/\d+/g);
            
            if (parseInt(current) < parseInt(total)) {
                if (!this.classList.contains('joined')) {
                    this.classList.add('joined');
                    this.textContent = '已报名';
                    participants.textContent = `已报名：${parseInt(current) + 1}/${total}人`;
                    alert(`恭喜您成功报名"${activityName}"活动！`);
                } else {
                    alert('您已经报名过这个活动了！');
                }
            } else {
                alert('抱歉，该活动报名人数已满！');
            }
        });
    });

    // 私信系统
    const messageIcon = document.querySelector('.message-icon');
    const messageSystem = document.getElementById('messageSystem');
    const closeMessages = document.querySelector('.close-messages');

    messageIcon.addEventListener('click', () => {
        messageSystem.style.display = messageSystem.style.display === 'none' ? 'block' : 'none';
    });

    closeMessages.addEventListener('click', () => {
        messageSystem.style.display = 'none';
    });

    // 发消息功能
    const sendButton = document.querySelector('.send-message');
    const messageInput = document.querySelector('.message-input input');
    const messageList = document.querySelector('.message-list');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const messageHTML = `
                <div class="message-item">
                    <img src="images/user-avatar.jpg" alt="我的头像">
                    <div class="message-content">
                        <h4>我</h4>
                        <p>${message}</p>
                        <span class="message-time">刚刚</span>
                    </div>
                </div>
            `;
            messageList.insertAdjacentHTML('beforeend', messageHTML);
            messageInput.value = '';
            messageList.scrollTop = messageList.scrollHeight;
        }
    });

    // QQ客服功能
    const qqContactBtn = document.querySelector('.social-link.qq-contact');
    const qqService = document.querySelector('.qq-service');
    const closeQQService = document.querySelector('.close-qq-service');

    qqContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        qqService.style.display = qqService.style.display === 'none' ? 'block' : 'none';
    });

    closeQQService.addEventListener('click', () => {
        qqService.style.display = 'none';
    });

    // QQ链接点击统计
    const qqLinks = document.querySelectorAll('.qq-contact-btn');
    qqLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 这里可以添加统计代码
            console.log('QQ联系点击：', this.href);
        });
    });

    // 加入我们按钮功能
    const joinModal = document.getElementById('joinModal');
    const joinBtn = document.getElementById('joinUsBtn');
    const closeModal = document.querySelector('.close-modal');
    const joinForm = document.getElementById('joinForm');

    joinBtn.addEventListener('click', () => {
        joinModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        joinModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === joinModal) {
            joinModal.style.display = 'none';
        }
    });

    // 表单提交处理
    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(joinForm);
        const data = Object.fromEntries(formData);
        
        // 这里可以添加表单数据的处理逻辑
        console.log('提交的表单数据：', data);
        
        // 显示成功消息
        alert('申请提交成功！我们会尽快与您联系。');
        joinModal.style.display = 'none';
        joinForm.reset();
    });

    // 登录/注册功能
    const loginBtn = document.querySelector('.login-btn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.querySelector('.close-auth-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // 打开模态框
    loginBtn.addEventListener('click', () => {
        authModal.style.display = 'block';
    });

    // 关闭模态框
    closeAuthModal.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // 切换标签
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签和表单的active类
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // 添加active类到当前标签和对应表单
            tab.classList.add('active');
            const formId = tab.dataset.tab + 'Form';
            document.getElementById(formId).classList.add('active');
        });
    });

    // 处理登录表单提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('[name="email"]').value;
        const password = loginForm.querySelector('[name="password"]').value;
        
        // 这里添加登录逻辑
        console.log('登录:', { email, password });
        alert('登录成功！');
        authModal.style.display = 'none';
    });

    // 处理注册表单提交
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('[name="name"]').value;
        const email = registerForm.querySelector('[name="email"]').value;
        const password = registerForm.querySelector('[name="password"]').value;
        const confirmPassword = registerForm.querySelector('[name="confirmPassword"]').value;

        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        
        // 这里添加注册逻辑
        console.log('注册:', { name, email, password });
        alert('注册成功！');
        authModal.style.display = 'none';
    });
}); 