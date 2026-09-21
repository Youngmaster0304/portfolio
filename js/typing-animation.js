class TextType {
    constructor(element, options) {
        this.element = element;
        this.texts = options.text || [];
        this.typingSpeed = options.typingSpeed || 75;
        this.pauseDuration = options.pauseDuration || 1000;
        this.deletingSpeed = options.deletingSpeed || 50;
        this.showCursor = options.showCursor !== undefined ? options.showCursor : true;
        this.cursorCharacter = options.cursorCharacter || '|';
        this.loop = options.loop !== undefined ? options.loop : true;
        this.initialDelay = options.initialDelay || 0;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.cursorVisible = true;

        if (this.showCursor) {
            this.cursorSpan = document.createElement('span');
            this.cursorSpan.className = 'typing-cursor';
            this.cursorSpan.textContent = this.cursorCharacter;
            this.cursorSpan.style.color = '#ff0077';
            this.cursorSpan.style.fontWeight = 'bold';
            this.cursorSpan.style.marginLeft = '2px';
            this.element.appendChild(this.cursorSpan);
            this.startCursorBlink();
        }

        setTimeout(() => this.type(), this.initialDelay);
    }

    type() {
        const currentText = this.texts[this.textIndex];
        const displayText = this.element;
        const cursorSpan = this.cursorSpan;

        if (this.isDeleting) {
            this.charIndex--;
            const textNode = document.createTextNode(currentText.substring(0, this.charIndex));
            if (cursorSpan) {
                displayText.innerHTML = '';
                displayText.appendChild(document.createTextNode(currentText.substring(0, this.charIndex)));
                displayText.appendChild(cursorSpan);
            } else {
                displayText.textContent = currentText.substring(0, this.charIndex);
            }
        } else {
            this.charIndex++;
            if (cursorSpan) {
                displayText.innerHTML = '';
                displayText.appendChild(document.createTextNode(currentText.substring(0, this.charIndex)));
                displayText.appendChild(cursorSpan);
            } else {
                displayText.textContent = currentText.substring(0, this.charIndex);
            }
        }

        let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            speed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            if (this.textIndex === 0 && !this.loop) {
                return;
            }
            speed = this.typingSpeed;
        }

        setTimeout(() => this.type(), speed);
    }

    startCursorBlink() {
        setInterval(() => {
            if (this.cursorSpan) {
                this.cursorVisible = !this.cursorVisible;
                this.cursorSpan.style.opacity = this.cursorVisible ? '1' : '0';
            }
        }, 530);
    }
}
