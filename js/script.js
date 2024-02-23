var isCurIn = false;
var isCurInLink = false;
var ClickDiv;
var NowMouseX;
var NowMouseY;
var TitleMain = '';
var SetWeather = 2;
var TimerDelay = 100;

function isMobile() {
            let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            return flag;
}

function AddSettingButton() {
    var SettingButton = document.createElement("input");
    SettingButton.type = "button";
    SettingButton.className = "SettingButton";
    SettingButton.onclick = SettingButton_onclick;
    document.body.appendChild(SettingButton);
}
function SettingButton_onclick(event) {
    var SettingButton = document.querySelector(".SettingButton");
    switch (SetWeather) {
        case 0: //晴天 设置为雨天
            SetWeather += 1;
            SettingButton.style.cssText = "background: url('image/Weather_Rain.svg') no-repeat center rgba(255, 255, 255,0.5);";
            TimerDelay = 30;
            break;
        case 1: //雨天 设置为雪天
            SetWeather += 1;
            SettingButton.style.cssText = "background: url('image/Weather_Snow.svg') no-repeat center rgba(255, 255, 255,0.5);";
            TimerDelay = 100;
            break;
        case 2: //雪天 设置为晴天
            SetWeather = 0;
            SettingButton.style.cssText = "background: url('image/Weather_Sunny.svg') no-repeat center rgba(255, 255, 255,0.5);";
            break;
    }
    console.log(SetWeather)
}

function RemoveLoader() {
    console.log("removeLoader");
    document.querySelector("body").style.cssText = "overflow: auto;";
    document.querySelector(".LoaderMask").style.cssText += "height:0px;opacity: 0;pointer-events: none;";
    document.querySelector(".LoaderCircle").style.cssText += "height:0px;opacity: 0;";
}

function StartSnow() {
    let Timer = setInterval(() => {
        new Snow();
        clearInterval(Timer);
        StartSnow();
    }, TimerDelay)
}

window.addEventListener('load', () => {
    var cursor = document.querySelectorAll(".link");
    for (let i = 0; i < cursor.length; i++) {
        cursor[i].addEventListener("mouseover", function () {
            isCurInLink = true;
        });
        cursor[i].addEventListener("mouseout", function () {
            isCurInLink = false;
        });
    }
    
    

    if (isMobile()) {
        var pathname = window.location.pathname;
        console.log("isMobile");
        if (pathname.indexOf("/articles/") == -1) {//非文章主页面
            TitleChanger();
            setTimeout(() => RemoveLoader(), 300);
            StartSnow();
            AddSettingButton();
        } else {
            
        }
        
    } else { //PC
        var pathname = window.location.pathname;
        if (pathname.indexOf("/articles/") == -1) {//非文章主页面
            document.querySelector(".Main").style.cssText += 'width:500px;margin: auto;';
            TitleChanger();
            setTimeout(() => RemoveLoader(), 300);
            StartSnow();
            AddSettingButton();
        } else {
            document.querySelector("body").style.cssText = "overflow: auto;";
        }
        
        var list = document.querySelectorAll(".article")
        for (let i = 0; i < list.length; i++) {
            list[i].style.cssText += "width: 500px;margin: auto;";
        }
        
    }
    

})

function setTitle(a) {
    var Title = document.querySelector(".title");
    if (a == -1) {
        Title.innerHTML = TitleMain;
        return;
    }
    Title.innerHTML = TitleMain.substr(0,a) + String.fromCharCode(getRandom([33,125]));
}

function getRandom(rangeArray, toFixed) {
    let min = rangeArray[0]
    let max = rangeArray[1]
    let range = max - min
    let rand = Math.random()
    if (toFixed) {
        return Number((min + rand * range).toFixed(toFixed))
    } else {
        return min + Math.round(rand * range)
    }
}

function TitleChanger() {
    var init_delay = 300;
    var Title = document.querySelector(".title");
    var charloopTime = 10;
    var charNum = Title.innerHTML.length;
    var TitleBefore = Title.innerHTML;
    var sleepTime = 16;
    TitleMain = TitleBefore;
    for (let a = 0; a < charNum; a++) {
        for (let i = 0; i < charloopTime; i++) {
            setTimeout(() => setTitle(a), init_delay + sleepTime * i + a * (sleepTime * charNum))
           if (i == charloopTime - 1 & a == charNum -1) {
                setTimeout(() => setTitle(-1), init_delay + sleepTime * (i + 1) + a * (sleepTime * charNum))
            }
        }
    }
   
    
}

window.addEventListener('mousedown', (event) => {
    if (event.button == 0) {
        var ClickDivsBefore = document.querySelectorAll(".ClickDiv");
        for (let i = 0; i < ClickDivsBefore.length; i++) {
            ClickDivsBefore[i].remove()
        }
        
        ClickDiv = document.createElement("div");
        ClickDiv.className = "ClickDiv";
        let DrawCur = document.getElementById("DrawCur");
        document.body.insertBefore(ClickDiv, DrawCur);
        ClickDiv.style.width = "36px";
        ClickDiv.style.height = "36px";
        if (isCurInLink) {
            ClickDiv.style.width = "26px";
            ClickDiv.style.height = "26px";
        }
        
        ClickDiv.style.left = NowMouseX - ClickDiv.clientHeight / 2 + 4 + "px";
        ClickDiv.style.top = NowMouseY - ClickDiv.clientWidth / 2 + 3 + "px";
        ClickDiv.style.cssText += 'opacity: 0;';

    }
})

document.onmousemove = function drawcur(e) {
    NowMouseX = e.clientX;
    NowMouseY = e.clientY;
    if (!e) {
        e = window.event;
    }
    if (isMobile()) {
		return ;
	}
    const drawcur = document.getElementById("DrawCur");
    
    if (isCurInLink) {
        drawcur.style.width = '26px';
        drawcur.style.height = '26px';
        drawcur.style.background = 'rgba(255,255,255,0.3)'
    } else {
        drawcur.style.width = '36px';
        drawcur.style.height = '36px';
        drawcur.style.background = 'none'
    }
    drawcur.style.display = "block";
    drawcur.style.left = e.clientX - drawcur.clientHeight / 2 + 3 + "px";
    drawcur.style.top = e.clientY - drawcur.clientWidth / 2 + 2 + "px";
    return ;

}

class Snow {
    constructor(el = 'body', flake = '❄') {
        
        this.stage = document.querySelector(el)
        this.snow = document.createElement('span')
        this.flake = flake
        this.color = '#fff'
        this.sizeRange = [20, 60]
        this.topRange = [-this.sizeRange[1], this.stage.clientHeight - this.sizeRange[1]]
        this.leftRange = [0, this.stage.clientWidth - this.sizeRange[1]]
        this.Xdirection = parseInt(Math.random() * 10) % 2
        this.speed = this.getRandom([1, 5])
        this.opacityRange = [0.4, 1]
        this.durationTime = this.getRandom([8000, 11000])
       
        switch (SetWeather) {
            case 0:

                break
            case 1:
                this.Xdirection = parseInt(Math.random() * 10) % 2;
                this.rainOffset = new Date().getMinutes() % 5 - 2;
                this.speed = this.getRandom([25, 35])
                this.flake = '|'
                break
            case 2:
                this.Xdirection = parseInt(Math.random() * 10) % 2
                this.flake = '❄'
                break
        }
        this.render()
        if (SetWeather != 0) {
            this.autoDestroy()
        } else {
            this.destroy()
        }
        
    }
    style() {
        return `color: ${this.color};
            position: absolute;
            left: ${this.left}px;
            top: ${this.top}px;
            font-size: ${this.size}px;
            opacity: ${this.opacity};
            pointer-events: none;
            `
    }
    render() {
        this.left = this.getRandom(this.leftRange)
        this.top = this.topRange[0]
        this.size = this.getRandom(this.sizeRange)
        this.opacity = this.getRandom(this.opacityRange, 1)
        this.snow.style = this.style()
        this.snow.innerHTML = this.flake
        this.stage.append(this.snow)
        this.animate()
    }
    updateStyle() {
        if (this.top < this.topRange[1] && this.left > this.leftRange[0] && this.left < this.leftRange[1]) {
            if (this.flake == '|') {
                this.left = this.left + this.rainOffset;
                this.top += this.speed

            } else if (this.flake == '❄') {
                this.left = this.Xdirection ? this.left + this.speed : this.left - this.speed
                this.top += this.speed

            } else {
                this.left = this.Xdirection ? this.left + this.speed : this.left - this.speed
                this.top += this.speed
            }
            if (this.snow) this.snow.style = this.style()
        } else {
            this.destroy()
        }
    }
    animate() {
        if (requestAnimationFrame) {
            this.updateStyle()
            this.snow && requestAnimationFrame(this.animate.bind(this))
        } else {
            let timer = setInterval(() => {
                this.updateStyle()
                if (!this.snow) clearTimeout(timer)
            }, 16)
        }
    }
    autoDestroy() {
        let timer = setTimeout(() => {
            this.snow && this.destroy()
            clearTimeout(timer)
        }, this.durationTime)
    }
    destroy() {
        if (this.snow)
            this.stage.removeChild(this.snow)
        this.snow = null
    }
    getRandom(rangeArray, toFixed) {
        let min = rangeArray[0]
        let max = rangeArray[1]
        let range = max - min
        let rand = Math.random()
        if (toFixed) {
            return Number((min + rand * range).toFixed(toFixed))
        } else {
            return min + Math.round(rand * range)
        }
    }
}