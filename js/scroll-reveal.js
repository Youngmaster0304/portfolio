class ScrollReveal {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.15;
        this.rootMargin = options.rootMargin || '0px 0px -50px 0px';
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin,
        });

        this.init();
    }

    init() {
        document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
        document.querySelectorAll('.reveal-left').forEach(el => this.observer.observe(el));
        document.querySelectorAll('.reveal-right').forEach(el => this.observer.observe(el));
        document.querySelectorAll('.reveal-up').forEach(el => this.observer.observe(el));
        document.querySelectorAll('.reveal-scale').forEach(el => this.observer.observe(el));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});
