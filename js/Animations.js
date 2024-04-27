class Animations_v_slide_in {
    constructor() {
        // 实现元素滚动到视窗底部时，自动播放动画效果
        this.DISTANCE = 100;
        this.DURATION = 800;
        this.animationMap = new WeakMap()
        this.ob = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const animation = this.animationMap.get(entry.target);
                    animation.play();
                    this.ob.unobserve(entry.target);
                }
            }
        })
    }

    isBelowViewport(el) {
        const rect = el.getBoundingClientRect()
        return rect.top > window.innerHeight;
    }

    SetSlideInEl_mounted(el) {
        if (!this.isBelowViewport(el)) {
            return;
        }
        const animation = el.animate([
            {
                transform: `translateY(${this.DISTANCE}px)`,
                opacity: 0.5
            },
            {
                transform: 'translateY(0)',
                opacity: 1
            }
        ], {
            duration: this.DURATION,
            easing: 'ease'
        })
        animation.pause();
        this.animationMap.set(el, animation);
        this.ob.observe(el)
    }
    SetSlideInEl_unmounted(el) {
        this.ob.unobserve(el)
    }


}
