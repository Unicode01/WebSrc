var isCurIn = false;
var isCurInLink = false;
var ClickDiv;
var NowMouseX;
var NowMouseY;
var TitleMain = '';
var SetWeather = 2;
var TimerDelay = 100;
var _Player_List = [];


function isMobile() {
    let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return flag;
}

function CreatePhotoViewer(link) {
    var Photo = document.createElement("img");
    var PhotoContainer = document.createElement("div");
    PhotoContainer.className = "PhotoViewer";
    Photo.className = "PhotoViewer";
    Photo.src = link;
    PhotoContainer.style.cssText += "position:fixed;background-color:rgba(0,0,0,0.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);left:0px;top:0px;height:100%;width:100%;transition: .4s;max-width: 100%;max-height: 100%;display: flex;flex-wrap: wrap;justify-content: center;align-content: center;";
    Photo.style.cssText += "max-width: 100%;max-height: 100%;margin: auto;display: block;overflow:hidden;"
    document.body.appendChild(PhotoContainer);
    PhotoContainer.appendChild(Photo);
}

function RemovePhotoViewer() {
    var PhotoViewer = document.querySelector(".PhotoViewer");
    PhotoViewer.remove();

}

function AddSettingButton() {
    var SettingButton = document.createElement("input");
    SettingButton.type = "button";
    SettingButton.className = "SettingButton link";
    SettingButton.onclick = SettingButton_onclick;
    document.body.appendChild(SettingButton);
    Weather_Reset(SetWeather);
}
function Weather_Reset(Weather) {
    var SettingButton = document.querySelector(".SettingButton");
    switch (Weather) {
        case 2: //雨天
            SettingButton.style.cssText = "background: url('image/Weather_Rain.svg') no-repeat center rgba(255, 255, 255,0.5);";
            TimerDelay = 30;
            break;
        case 3: //雪天
            SettingButton.style.cssText = "background: url('image/Weather_Snow.svg') no-repeat center rgba(255, 255, 255,0.5);";
            TimerDelay = 100;
            break;
        case 1: //晴天
            SettingButton.style.cssText = "background: url('image/Weather_Sunny.svg') no-repeat center rgba(255, 255, 255,0.5);";
            break;
    }
}
function SettingButton_onclick(event) {
    switch (SetWeather) {
        case 1: //晴天 设置为雨天
            SetWeather += 1;
            break;
        case 2: //雨天 设置为雪天
            SetWeather += 1;
            break;
        case 3: //雪天 设置为晴天
            SetWeather = 1;
            break;
    }
    Weather_Reset(SetWeather);

    //设置存储
    new Local_Config().SetConfig('Web_Weather', String(SetWeather));

}

function RemoveLoader() {
    console.log("removeLoader");
    document.querySelector("body").style.cssText = "overflow: auto;";
    document.querySelector(".LoaderMask").style.cssText += "height:0px;opacity: 0;pointer-events: none;";
    document.querySelector(".LoaderCircle").style.cssText += "height:0px;opacity: 0;";
}

function AddLoader() {
    console.log("addmoveLoader");
    document.querySelector("body").style.cssText = "overflow: hidden;";
    if (document.querySelector(".LoaderMask") == null) {
        var newLoaderMask = document.createElement("div");
        newLoaderMask.id = "LoaderMask";
        newLoaderMask.className = "LoaderMask";

        var newLoaderCircle = document.createElement("div");
        newLoaderCircle.className = "LoaderCircle";
        document.body.appendChild(newLoaderMask);
        newLoaderMask.appendChild(newLoaderCircle);


    }
    document.querySelector(".LoaderMask").style.cssText += "height:100%;opacity: 1;pointer-events: auto;";
    document.querySelector(".LoaderCircle").style.cssText += "height:0px;opacity: 1;";

}

function StartSnow() {
    let Timer = setInterval(() => {
        new Snow();
        clearInterval(Timer);
        StartSnow();
    }, TimerDelay)
}


window.addEventListener('load', () => {
    SetWeather = parseInt(new Local_Config().GetConfig('Web_Weather'));
    if (!SetWeather) {
        SetWeather = 3;
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
            getSmooth();
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
            getSmooth();
        }

        var list = document.querySelectorAll(".article")
        for (let i = 0; i < list.length; i++) {
            list[i].style.cssText += "width: 500px;margin: auto;";
        }

    }
    var cursor = document.querySelectorAll(".link");
    for (let i = 0; i < cursor.length; i++) {
        cursor[i].addEventListener("mouseover", function () {
            isCurInLink = true;
        });
        cursor[i].addEventListener("mouseout", function () {
            isCurInLink = false;
        });
    }

});

function getSmooth() {
    const drawcur = document.getElementById("DrawCur");
    drawcur.style.cssText += "transition: background-color 0.3s, width 0.3s, height 0.3s, left 0.1s, top 0.1s;";
}

function setTitle(a) {
    var Title = document.querySelector(".title");
    if (a == -1) {
        Title.innerHTML = TitleMain;
        return;
    }
    Title.innerHTML = TitleMain.slice(0, a) + String.fromCharCode(getRandom([33, 125]));
};

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
};

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
            if (i == charloopTime - 1 & a == charNum - 1) {
                setTimeout(() => setTitle(-1), init_delay + sleepTime * (i + 1) + a * (sleepTime * charNum))
            }
        }
    }


};

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

        ClickDiv.style.left = NowMouseX - ClickDiv.clientHeight / 2 + "px";
        ClickDiv.style.top = NowMouseY - ClickDiv.clientWidth / 2 + "px";
        ClickDiv.style.cssText += 'opacity: 0;';
        console.log(event.target.tagName)
        if (event.target.className == "PhotoViewer") {
            RemovePhotoViewer();
        } else if (event.target.tagName == "IMG" & event.target.className != "smallimg") {
            CreatePhotoViewer(event.target.src);
        }
    }
});

document.onmousemove = function drawcur(e) {

    NowMouseX = e.clientX;
    NowMouseY = e.clientY;
    if (isMobile()) {
        return;
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
    drawcur.style.left = e.clientX - drawcur.clientHeight / 2 - 1 + "px";
    drawcur.style.top = e.clientY - drawcur.clientWidth / 2 - 1 + "px";
    return;

};

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
            case 1:

                break
            case 2:
                this.Xdirection = parseInt(Math.random() * 10) % 2;
                this.rainOffset = new Date().getMinutes() % 5 - 2;
                this.speed = this.getRandom([25, 35])
                this.flake = '|'
                break
            case 3:
                this.Xdirection = parseInt(Math.random() * 10) % 2
                this.flake = '❄'
                break
        }
        this.render()
        if (SetWeather != 1) {
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
};

class Player {
    constructor(El, src, irc, cover, mainColor, btncolor, Title) {
        this.Element = El;
        this.MusicUrl = src;
        this.MusicCover = cover;
        this.MusicIRC = irc;
        this.MainColor = mainColor;
        this.BtnColor = btncolor;
        this.MusicTitle = Title;
        this.isMusicPlaying = false;
        this.isMuted = false;
        this.isLoop = true;
        this.isLoadMusicOK = false;
        this.isFirstStart = true;
        this.MusicDuration = 100;
        this.ThreadTimerDelay = 100;
        this.MusicCoverDeg = 0;
        this.audio = document.createElement("audio");
        this.Music_Title = document.createElement("div");
        this.Music_Progress = document.createElement("div");
        this.Music_Controller = document.createElement("div");
        this.Music_Cover = document.createElement("div");
        this.Music_PlayBtn = document.createElement("div");
        this.Music_LoopBtn = document.createElement("div");
        this.Music_MuteBtn = document.createElement("div");
        this.audio.src = this.MusicUrl;
        this.audio.loop = true;
        this._timer;

        this.ChangePlayer_Background();
        this.ChangePlayer_toBox();
        this.Create_Player();
        _Player_List.push(this);
    }

    ChangePlayer_Background() {

        this.Element.style.cssText += `
        background: ${this.MainColor} no-repeat center;
        background-size: 100% 100%;
        
        `
    }
    ChangePlayer_toBox() {
        this.Element.style.cssText += `
        border-radius:20px;
        box-shadow: 0 0 0 2px white, 0.8em 0.8em 2em rgb(200 0 0 / 60%);
        `
    }
    Create_Player() {


        this.Element.appendChild(this.Music_Controller);
        this.Element.appendChild(this.Music_Progress)
        this.Element.appendChild(this.Music_Cover);
        this.Element.appendChild(this.Music_Title);
        this.Music_Controller.appendChild(this.Music_PlayBtn);
        this.Music_Controller.appendChild(this.Music_LoopBtn);
        this.Music_Controller.appendChild(this.Music_MuteBtn);

        this.Music_Controller.className = 'MusicController';
        this.Music_Title.className = 'MusicTitle';
        this.Music_Progress.className = 'MusicProgress';
        this.Music_Cover.className = 'MusicCover';
        this.Music_PlayBtn.className = 'PlayBtn';
        this.Music_LoopBtn.className = 'LoopBtn';
        this.Music_MuteBtn.className = 'MuteBtn';

        this.Element.style.cssText += `
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: space-between;
        `;
        this.Music_Controller.style.cssText += `
        position: static;
        width:100%;
        height: 15%;
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        `;
        this.Music_Progress.style.cssText += `
        position: static;
        width:80%;
        height: 2%;
        margin: 1% 0;
        background: no-repeat;
        border-radius: 10px;
        background-image: linear-gradient(90deg, ${this.BtnColor} 0, ${this.BtnColor} 0% , rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4));
        transition: .4s;
        `;
        this.Music_Cover.style.cssText += `
        position: static;
        width: 70%;
        height: 70%;
        border-radius: 50%;
        background-image: url(${this.MusicCover});
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transition: .4s;
        `;
        this.Music_Title.style.cssText += `
        position: static;
        width:100%;
        white-space:nowrap;
        height: 8%;
        font-size: ${this.Element.clientHeight / 20}px;
        text-shadow: 1px 3px 2px rgba(0, 0, 0, 0.711);
        color: ${this.BtnColor};
        text-align: center;
        overflow: hidden;
        padding: 3% 0 0 0;
        `;
        this.Music_PlayBtn.style.cssText += `
        height: 70%;
        width: 15%;
        order: 1;
        transition: .4s;
        `;
        this.Music_LoopBtn.style.cssText += `
        height: 70%;
        width: 15%;
        order: 0;
        transition: .4s;
        `;
        this.Music_MuteBtn.style.cssText += `
        height: 70%;
        width: 15%;
        order: 2;
        transition: .4s;
        `;

        this.Music_PlayBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="${this.BtnColor}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.6457 10.4384L8.6663 4.75864C8.65924 4.75419 8.65163 4.74975 8.64456 4.74531C8.09402 4.41584 7.4125 4.41807 6.86359 4.75308C6.33098 5.07921 6 5.6798 6 6.31984V17.6788C6 18.3194 6.33098 18.9194 6.86467 19.2467C7.13587 19.4122 7.44565 19.5 7.76087 19.5C8.07174 19.5 8.37772 19.4144 8.6663 19.24L17.6223 13.5752C18.1641 13.2513 18.5 12.648 18.5 11.9996C18.5 11.3534 18.1647 10.7506 17.6457 10.4384Z" fill="${this.BtnColor}"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.6457 10.4384L8.6663 4.75864C8.65924 4.75419 8.65163 4.74975 8.64456 4.74531C8.09402 4.41584 7.4125 4.41807 6.86359 4.75308C6.33098 5.07921 6 5.6798 6 6.31984V17.6788C6 18.3194 6.33098 18.9194 6.86467 19.2467C7.13587 19.4122 7.44565 19.5 7.76087 19.5C8.07174 19.5 8.37772 19.4144 8.6663 19.24L17.6223 13.5752C18.1641 13.2513 18.5 12.648 18.5 11.9996C18.5 11.3534 18.1647 10.7506 17.6457 10.4384Z" fill="${this.BtnColor}"></path></svg>
        `;
        this.Music_MuteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true"><defs><clipPath id="i478"><rect x="0" y="0" width="24" height="24" rx="0"></rect></clipPath></defs><g clip-path="url(#i478)"><g><path d="M2.1,14.4704L2.1,12L2.1,9.52965Q2.1,8.33029,2.9484921,7.469Q3.804576,6.6,5.0077,6.6L6.05589,6.6Q6.396380000000001,6.6,6.68139,6.396929999999999L9.31986,4.5170200000000005L10.86833,3.413739Q11.79597,2.752793,12.82491,3.234175Q13.9,3.737143,13.9,4.9154L13.9,12L13.9,19.0846Q13.9,20.2629,12.82491,20.7658Q11.79597,21.2472,10.86832,20.5863L9.31986,19.483L6.68139,17.603099999999998Q6.396380000000001,17.4,6.05589,17.4L5.0077,17.4Q3.804577,17.4,2.9484918,16.531Q2.1,15.6697,2.1,14.4703L2.1,14.4704ZM3.9,14.4703Q3.9,14.932,4.23078,15.2678Q4.55807,15.6,5.0077,15.6L6.05589,15.6Q6.97204,15.6,7.72588,16.1371L10.36435,18.017L11.91282,19.1203Q11.98482,19.1716,12.06215,19.1354Q12.1,19.1177,12.1,19.0846L12.1,12L12.1,4.9154Q12.1,4.88228,12.06215,4.8645700000000005Q11.98482,4.82839,11.91282,4.8797L10.36435,5.9829799999999995L7.72588,7.86289Q6.97204,8.4,6.05589,8.4L5.0077,8.4Q4.55806,8.4,4.23078,8.732230000000001Q3.9,9.06799,3.9,9.52965L3.9,12L3.9,14.4704L3.9,14.4703Z" fill="${this.BtnColor}" fill-opacity="1"></path></g><g><path d="M15.503372,16.24943Q16.148908,15.8223,16.817291,15.04419Q18.1,13.55091,18.1,12Q18.1,10.4491,16.817291,8.95581Q16.148908,8.1777,15.503372,7.750573Q15.429447,7.701659,15.366485,7.639263Q15.303523,7.576868,15.253944,7.503388Q15.204364,7.429907,15.170073,7.348167Q15.135781,7.266426,15.118095,7.179566Q15.10041,7.0927063,15.100009,7.00406498Q15.099609,6.9154237,15.116509,6.828407Q15.13341,6.741391,15.166961,6.659344Q15.200513,6.577297,15.249427,6.503372Q15.29834,6.429447,15.360736,6.366485Q15.423132,6.303523,15.496612,6.253944Q15.570092,6.204364,15.651833,6.170073Q15.733573,6.135781,15.820433,6.118095Q15.9072935,6.100409,15.99593486,6.100009Q16.0845762,6.099608,16.171592,6.116509Q16.258609,6.133409,16.340656,6.166961Q16.422703,6.200512,16.496628,6.249426Q17.35109,6.814793,18.18271,7.782936Q19.9,9.78215,19.9,12Q19.9,14.21785,18.18271,16.21706Q17.35109,17.185200000000002,16.496628,17.7506Q16.422703,17.799500000000002,16.340656,17.833Q16.258609,17.8666,16.171593,17.883499999999998Q16.0845763,17.900399999999998,15.995935,17.9Q15.9072936,17.8996,15.820434,17.8819Q15.733574,17.8642,15.651833,17.829900000000002Q15.570092,17.7956,15.496612,17.7461Q15.423132,17.6965,15.360736,17.633499999999998Q15.29834,17.5706,15.249427,17.4966Q15.200513,17.4227,15.166961,17.3407Q15.13341,17.2586,15.116509,17.171599999999998Q15.099609,17.084600000000002,15.100009,16.99593Q15.10041,16.90729,15.118095,16.82043Q15.135781,16.73357,15.170073,16.65183Q15.204364,16.57009,15.253944,16.49661Q15.303523,16.42313,15.366485,16.36073Q15.429447,16.29834,15.503372,16.24943ZM16.9,17Q16.9,17.0886,16.882707,17.1756Q16.865413,17.2625,16.831491,17.3444Q16.79757,17.426299999999998,16.748322,17.5Q16.699076,17.573700000000002,16.636396,17.636400000000002Q16.573716,17.6991,16.500013,17.7483Q16.42631,17.7976,16.344415,17.8315Q16.26252,17.8654,16.175581,17.8827Q16.0886422,17.9,16,17.9Q15.9113578,17.9,15.824419,17.8827Q15.73748,17.8654,15.655585,17.8315Q15.57369,17.7976,15.499987,17.7483Q15.426284,17.6991,15.363604,17.636400000000002Q15.300924,17.573700000000002,15.251677,17.5Q15.20243,17.426299999999998,15.168509,17.3444Q15.134587,17.2625,15.117293,17.1756Q15.1,17.0886,15.1,17Q15.1,16.911360000000002,15.117293,16.82442Q15.134587,16.737479999999998,15.168509,16.65558Q15.20243,16.57369,15.251678,16.49999Q15.300924,16.42628,15.363604,16.363599999999998Q15.426284,16.300919999999998,15.499987,16.25168Q15.57369,16.20243,15.655585,16.168509999999998Q15.73748,16.13459,15.824419,16.11729Q15.9113578,16.1,16,16.1Q16.0886422,16.1,16.175581,16.11729Q16.26252,16.13459,16.344415,16.168509999999998Q16.42631,16.20243,16.500013,16.25168Q16.573716,16.300919999999998,16.636396,16.363599999999998Q16.699076,16.42628,16.748323,16.49999Q16.79757,16.57369,16.831491,16.65558Q16.865413,16.737479999999998,16.882707,16.82442Q16.9,16.911360000000002,16.9,17ZM16.9,7Q16.9,7.0886422,16.882707,7.175581Q16.865413,7.26252,16.831491,7.344415Q16.79757,7.42631,16.748322,7.500013Q16.699076,7.573716,16.636396,7.6363959999999995Q16.573716,7.699076,16.500013,7.748323Q16.42631,7.79757,16.344415,7.831491Q16.26252,7.865413,16.175581,7.882707Q16.0886422,7.9,16,7.9Q15.9113578,7.9,15.824419,7.882707Q15.73748,7.865413,15.655585,7.831491Q15.57369,7.79757,15.499987,7.748322Q15.426284,7.699076,15.363604,7.6363959999999995Q15.300924,7.573716,15.251677,7.500013Q15.20243,7.42631,15.168509,7.344415Q15.134587,7.26252,15.117293,7.175581Q15.1,7.0886422,15.1,7Q15.1,6.9113578,15.117293,6.824419Q15.134587,6.73748,15.168509,6.655585Q15.20243,6.57369,15.251678,6.499987Q15.300924,6.426284,15.363604,6.3636040000000005Q15.426284,6.300924,15.499987,6.251677Q15.57369,6.20243,15.655585,6.168509Q15.73748,6.134587,15.824419,6.117293Q15.9113578,6.1,16,6.1Q16.0886422,6.1,16.175581,6.117293Q16.26252,6.134587,16.344415,6.168509Q16.42631,6.20243,16.500013,6.251678Q16.573716,6.300924,16.636396,6.3636040000000005Q16.699076,6.426284,16.748323,6.499987Q16.79757,6.57369,16.831491,6.655585Q16.865413,6.73748,16.882707,6.824419Q16.9,6.9113578,16.9,7Z" fill="${this.BtnColor}" fill-opacity="1"></path></g></g></svg>
        `;
        this.Music_LoopBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true"><g><g><path d="M15.74279765625,7.853043046874999L18.49559765625,6.441233046875C18.85809765625,6.255353046874999,18.85809765625,5.745393046875,18.49559765625,5.559513046875L15.74279765625,4.147706546875C15.40999765625,3.977068046875,14.99999765625,4.193972046875,14.99999765625,4.567901046875L14.99999765625,5.101143046875L9.27052765625,5.115173046875Q6.31367765625,5.115173046875,4.21554765625,7.119553046875Q2.09999966625,9.140573046875,2.10000050065,12.007623046875Q2.10000002385,14.874723046875,4.21554765625,16.895723046875Q6.31367765625,18.900123046875002,9.27272765625,18.900123046875002L14.72729765625,18.900123046875002Q17.686297656249998,18.900123046875002,19.78449765625,16.895723046875Q21.89999765625,14.874623046875,21.89999765625,12.007623046875C21.89999765625,11.510573046874999,21.49709765625,11.107623046875,20.99999765625,11.107623046875C20.50289765625,11.107623046875,20.09999765625,11.510573046874999,20.09999765625,12.007623046875Q20.09999765625,14.104923046875,18.54109765625,15.594123046875Q16.96469765625,17.100123046874998,14.72729765625,17.100123046874998L9.27272765625,17.100123046874998Q7.03527765625,17.100123046874998,5.45892765625,15.594123046875Q3.89999765625,14.104923046875,3.89999765625,12.007623046875Q3.89999765625,9.910363046875,5.45892765625,8.421093046875Q7.03527765625,6.915173046875,9.27492765625,6.915173046875L14.99999765625,6.901153046875001L14.99999765625,7.432843046875C14.99999765625,7.806773046875,15.40999765625,8.023683046875,15.74279765625,7.853043046874999ZM11.59999765625,14.500123046875L11.59999765625,11.181743046874999L11.49922765625,11.248923046875C11.35367765625,11.345953046875,11.18300765625,11.398473046875,11.00807765625,11.400043046875L10.99999765625,11.400073046875C10.69907765625,11.400073046875,10.41807765625,11.249683046874999,10.25115765625,10.999303046875C10.16046765625,10.863283046875,10.10854765625,10.705123046875,10.10096765625,10.541813046875C10.10032765625,10.527913046875,10.09999765625,10.513993046875001,10.09999765625,10.500073046875C10.09999765625,10.440813046875,10.10585765625,10.381683046875,10.11747765625,10.323573046875001C10.16428765625,10.089513046875,10.30216765625,9.883633046875001,10.50076765625,9.751233046875L12.00076765625,8.751233046875C12.14859765625,8.652673046875,12.32229765625,8.600073046875,12.49999765625,8.600073046875C12.99709765625,8.600073046875,13.39999765625,9.003023046875,13.39999765625,9.500073046875L13.39999765625,14.500123046875C13.39999765625,14.997123046875,12.99709765625,15.400123046875,12.49999765625,15.400123046875C12.00294765625,15.400123046875,11.59999765625,14.997123046875,11.59999765625,14.500123046875Z" fill-rule="evenodd" fill="${this.BtnColor}" fill-opacity="1"></path></g></g></svg>
        `;
        this.Music_Title.innerHTML = `${this.MusicTitle}`
        this.Music_PlayBtn.addEventListener('click', () => {
            this.Music_Play();
        });
        this.Music_MuteBtn.addEventListener('click', () => {
            this.Music_Mute();
        });
        this.Music_LoopBtn.addEventListener('click', () => {
            this.Music_Loop();
        });
        this.Music_Progress.addEventListener('click', (event) => {
            this.Music_ChangeProgress(event);
        });

        this.Music_PlayBtn.addEventListener("mouseover", function () {
            isCurInLink = true;
        });
        this.Music_PlayBtn.addEventListener("mouseout", function () {
            isCurInLink = false;
        });
        this.Music_MuteBtn.addEventListener("mouseover", function () {
            isCurInLink = true;
        });
        this.Music_MuteBtn.addEventListener("mouseout", function () {
            isCurInLink = false;
        });
        this.Music_LoopBtn.addEventListener("mouseover", function () {
            isCurInLink = true;
        });
        this.Music_LoopBtn.addEventListener("mouseout", function () {
            isCurInLink = false;
        });
        this.Music_Progress.addEventListener("mouseover", function () {
            isCurInLink = true;
        });
        this.Music_Progress.addEventListener("mouseout", function () {
            isCurInLink = false;
        });


        this.audio.addEventListener("canplay", () => {
            this.isLoadMusicOK = true;
            this.MusicDuration = parseInt(this.audio.duration);

        });
        this.audio.addEventListener('ended', () => {

            for (let i = 0; i < _Player_List.length; i++) {

                if (_Player_List[i].Element == this.Element && i < _Player_List.length - 1) {
                    if (_Player_List[i + 1].isLoop) {
                        _Player_List[i + 1].Music_Loop();
                    }
                    _Player_List[i + 1].Music_Play();
                    break;
                }
                if (i == _Player_List.length - 1 && _Player_List.length > 0) {
                    if (_Player_List[0].isLoop) {
                        _Player_List[0].Music_Loop();
                    }
                    _Player_List[0].Music_Play();
                    break;
                }
            }
            this.Music_Play();
            this.MusicCoverDeg = 0;
            this.Music_Cover.style.cssText += `
                transform : rotate(${this.MusicCoverDeg}deg);
                `
        });


    }

    Music_Play() {
        if (this.isMusicPlaying == false) {
            this.audio.play();
            if (this.isFirstStart) {
                this.ThreadTimerDelay = 100;
                this.Music_ListenLoop();
            }

            this.Music_PlayBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 4.5C6.44772 4.5 6 4.94772 6 5.5V18.5C6 19.0523 6.44772 19.5 7 19.5H9C9.55228 19.5 10 19.0523 10 18.5V5.5C10 4.94772 9.55228 4.5 9 4.5H7ZM15 4.5C14.4477 4.5 14 4.94772 14 5.5V18.5C14 19.0523 14.4477 19.5 15 19.5H17C17.5523 19.5 18 19.0523 18 18.5V5.5C18 4.94772 17.5523 4.5 17 4.5H15Z" fill="${this.BtnColor}"></path></svg>`;

        } else {
            this.audio.pause();
            clearInterval(this._timer);
            this.Music_PlayBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="${this.BtnColor}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.6457 10.4384L8.6663 4.75864C8.65924 4.75419 8.65163 4.74975 8.64456 4.74531C8.09402 4.41584 7.4125 4.41807 6.86359 4.75308C6.33098 5.07921 6 5.6798 6 6.31984V17.6788C6 18.3194 6.33098 18.9194 6.86467 19.2467C7.13587 19.4122 7.44565 19.5 7.76087 19.5C8.07174 19.5 8.37772 19.4144 8.6663 19.24L17.6223 13.5752C18.1641 13.2513 18.5 12.648 18.5 11.9996C18.5 11.3534 18.1647 10.7506 17.6457 10.4384Z" fill="${this.BtnColor}"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.6457 10.4384L8.6663 4.75864C8.65924 4.75419 8.65163 4.74975 8.64456 4.74531C8.09402 4.41584 7.4125 4.41807 6.86359 4.75308C6.33098 5.07921 6 5.6798 6 6.31984V17.6788C6 18.3194 6.33098 18.9194 6.86467 19.2467C7.13587 19.4122 7.44565 19.5 7.76087 19.5C8.07174 19.5 8.37772 19.4144 8.6663 19.24L17.6223 13.5752C18.1641 13.2513 18.5 12.648 18.5 11.9996C18.5 11.3534 18.1647 10.7506 17.6457 10.4384Z" fill="${this.BtnColor}"></path></svg>`;

        }
        this.isMusicPlaying = !this.isMusicPlaying;
    }

    Music_Mute() {
        if (this.isMuted) {
            this.audio.muted = false;
            this.Music_MuteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true"><defs><clipPath id="i478"><rect x="0" y="0" width="24" height="24" rx="0"></rect></clipPath></defs><g clip-path="url(#i478)"><g><path d="M2.1,14.4704L2.1,12L2.1,9.52965Q2.1,8.33029,2.9484921,7.469Q3.804576,6.6,5.0077,6.6L6.05589,6.6Q6.396380000000001,6.6,6.68139,6.396929999999999L9.31986,4.5170200000000005L10.86833,3.413739Q11.79597,2.752793,12.82491,3.234175Q13.9,3.737143,13.9,4.9154L13.9,12L13.9,19.0846Q13.9,20.2629,12.82491,20.7658Q11.79597,21.2472,10.86832,20.5863L9.31986,19.483L6.68139,17.603099999999998Q6.396380000000001,17.4,6.05589,17.4L5.0077,17.4Q3.804577,17.4,2.9484918,16.531Q2.1,15.6697,2.1,14.4703L2.1,14.4704ZM3.9,14.4703Q3.9,14.932,4.23078,15.2678Q4.55807,15.6,5.0077,15.6L6.05589,15.6Q6.97204,15.6,7.72588,16.1371L10.36435,18.017L11.91282,19.1203Q11.98482,19.1716,12.06215,19.1354Q12.1,19.1177,12.1,19.0846L12.1,12L12.1,4.9154Q12.1,4.88228,12.06215,4.8645700000000005Q11.98482,4.82839,11.91282,4.8797L10.36435,5.9829799999999995L7.72588,7.86289Q6.97204,8.4,6.05589,8.4L5.0077,8.4Q4.55806,8.4,4.23078,8.732230000000001Q3.9,9.06799,3.9,9.52965L3.9,12L3.9,14.4704L3.9,14.4703Z" fill="${this.BtnColor}" fill-opacity="1"></path></g><g><path d="M15.503372,16.24943Q16.148908,15.8223,16.817291,15.04419Q18.1,13.55091,18.1,12Q18.1,10.4491,16.817291,8.95581Q16.148908,8.1777,15.503372,7.750573Q15.429447,7.701659,15.366485,7.639263Q15.303523,7.576868,15.253944,7.503388Q15.204364,7.429907,15.170073,7.348167Q15.135781,7.266426,15.118095,7.179566Q15.10041,7.0927063,15.100009,7.00406498Q15.099609,6.9154237,15.116509,6.828407Q15.13341,6.741391,15.166961,6.659344Q15.200513,6.577297,15.249427,6.503372Q15.29834,6.429447,15.360736,6.366485Q15.423132,6.303523,15.496612,6.253944Q15.570092,6.204364,15.651833,6.170073Q15.733573,6.135781,15.820433,6.118095Q15.9072935,6.100409,15.99593486,6.100009Q16.0845762,6.099608,16.171592,6.116509Q16.258609,6.133409,16.340656,6.166961Q16.422703,6.200512,16.496628,6.249426Q17.35109,6.814793,18.18271,7.782936Q19.9,9.78215,19.9,12Q19.9,14.21785,18.18271,16.21706Q17.35109,17.185200000000002,16.496628,17.7506Q16.422703,17.799500000000002,16.340656,17.833Q16.258609,17.8666,16.171593,17.883499999999998Q16.0845763,17.900399999999998,15.995935,17.9Q15.9072936,17.8996,15.820434,17.8819Q15.733574,17.8642,15.651833,17.829900000000002Q15.570092,17.7956,15.496612,17.7461Q15.423132,17.6965,15.360736,17.633499999999998Q15.29834,17.5706,15.249427,17.4966Q15.200513,17.4227,15.166961,17.3407Q15.13341,17.2586,15.116509,17.171599999999998Q15.099609,17.084600000000002,15.100009,16.99593Q15.10041,16.90729,15.118095,16.82043Q15.135781,16.73357,15.170073,16.65183Q15.204364,16.57009,15.253944,16.49661Q15.303523,16.42313,15.366485,16.36073Q15.429447,16.29834,15.503372,16.24943ZM16.9,17Q16.9,17.0886,16.882707,17.1756Q16.865413,17.2625,16.831491,17.3444Q16.79757,17.426299999999998,16.748322,17.5Q16.699076,17.573700000000002,16.636396,17.636400000000002Q16.573716,17.6991,16.500013,17.7483Q16.42631,17.7976,16.344415,17.8315Q16.26252,17.8654,16.175581,17.8827Q16.0886422,17.9,16,17.9Q15.9113578,17.9,15.824419,17.8827Q15.73748,17.8654,15.655585,17.8315Q15.57369,17.7976,15.499987,17.7483Q15.426284,17.6991,15.363604,17.636400000000002Q15.300924,17.573700000000002,15.251677,17.5Q15.20243,17.426299999999998,15.168509,17.3444Q15.134587,17.2625,15.117293,17.1756Q15.1,17.0886,15.1,17Q15.1,16.911360000000002,15.117293,16.82442Q15.134587,16.737479999999998,15.168509,16.65558Q15.20243,16.57369,15.251678,16.49999Q15.300924,16.42628,15.363604,16.363599999999998Q15.426284,16.300919999999998,15.499987,16.25168Q15.57369,16.20243,15.655585,16.168509999999998Q15.73748,16.13459,15.824419,16.11729Q15.9113578,16.1,16,16.1Q16.0886422,16.1,16.175581,16.11729Q16.26252,16.13459,16.344415,16.168509999999998Q16.42631,16.20243,16.500013,16.25168Q16.573716,16.300919999999998,16.636396,16.363599999999998Q16.699076,16.42628,16.748323,16.49999Q16.79757,16.57369,16.831491,16.65558Q16.865413,16.737479999999998,16.882707,16.82442Q16.9,16.911360000000002,16.9,17ZM16.9,7Q16.9,7.0886422,16.882707,7.175581Q16.865413,7.26252,16.831491,7.344415Q16.79757,7.42631,16.748322,7.500013Q16.699076,7.573716,16.636396,7.6363959999999995Q16.573716,7.699076,16.500013,7.748323Q16.42631,7.79757,16.344415,7.831491Q16.26252,7.865413,16.175581,7.882707Q16.0886422,7.9,16,7.9Q15.9113578,7.9,15.824419,7.882707Q15.73748,7.865413,15.655585,7.831491Q15.57369,7.79757,15.499987,7.748322Q15.426284,7.699076,15.363604,7.6363959999999995Q15.300924,7.573716,15.251677,7.500013Q15.20243,7.42631,15.168509,7.344415Q15.134587,7.26252,15.117293,7.175581Q15.1,7.0886422,15.1,7Q15.1,6.9113578,15.117293,6.824419Q15.134587,6.73748,15.168509,6.655585Q15.20243,6.57369,15.251678,6.499987Q15.300924,6.426284,15.363604,6.3636040000000005Q15.426284,6.300924,15.499987,6.251677Q15.57369,6.20243,15.655585,6.168509Q15.73748,6.134587,15.824419,6.117293Q15.9113578,6.1,16,6.1Q16.0886422,6.1,16.175581,6.117293Q16.26252,6.134587,16.344415,6.168509Q16.42631,6.20243,16.500013,6.251678Q16.573716,6.300924,16.636396,6.3636040000000005Q16.699076,6.426284,16.748323,6.499987Q16.79757,6.57369,16.831491,6.655585Q16.865413,6.73748,16.882707,6.824419Q16.9,6.9113578,16.9,7Z" fill="${this.BtnColor}" fill-opacity="1"></path></g></g></svg>`
        } else {
            this.audio.muted = true;
            this.Music_MuteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" focusable="false" aria-hidden="true"><path d="M3 9.5C3 8.39543 3.89543 7.5 5 7.5H6.04459C6.46062 7.5 6.8663 7.37026 7.20513 7.12884L11.4197 4.12595C12.0817 3.65428 13 4.12754 13 4.94037V19.0596C13 19.8725 12.0817 20.3457 11.4197 19.8741L7.20514 16.8712C6.86631 16.6297 6.46062 16.5 6.04459 16.5H5C3.89543 16.5 3 15.6046 3 14.5V9.5Z" stroke="${this.BtnColor}" stroke-linecap="square" stroke-linejoin="round"></path><path d="M16 9L22 15" stroke="${this.BtnColor}" stroke-linecap="round"></path><path d="M22 9L16 15" stroke="${this.BtnColor}" stroke-linecap="round"></path></svg>`
        }
        this.isMuted = !this.isMuted;

    }
    Music_Loop() {
        if (this.isLoop) {
            this.audio.loop = false;
            this.Music_LoopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true"><g><g><path d="M20.65791982650757,7.266700579223633C20.948319826507568,7.068150579223633,20.948319826507568,6.639780579223633,20.65791982650757,6.441230579223633L18.77731982650757,5.155264679223633C18.44551982650757,4.9283435792236325,17.99511982650757,5.165978979223633,17.99511982650757,5.567996579223633L17.99511982650757,5.993234579223633L3.9929198265075683,5.993234579223633C3.4958638265075686,5.993234579223633,3.0929198265075684,6.396180579223633,3.0929198265075684,6.893230579223633C3.0929198265075684,7.390290579223633,3.4958638265075686,7.793230579223633,3.9929198265075683,7.793230579223633L17.99511982650757,7.793230579223633L17.99511982650757,8.139930579223632C17.99511982650757,8.541950579223633,18.44551982650757,8.779590579223633,18.77731982650757,8.552670579223633L20.65791982650757,7.266700579223633ZM20.65791982650757,17.559340579223633C20.948319826507568,17.360840579223634,20.948319826507568,16.93244057922363,20.65791982650757,16.733940579223635L18.77731982650757,15.447940579223634C18.44551982650757,15.221040579223633,17.99511982650757,15.458640579223633,17.99511982650757,15.860640579223633L17.99511982650757,16.280740579223632L3.9999998265075685,16.280740579223632C3.5029438265075683,16.280740579223632,3.0999999065075685,16.683640579223635,3.0999999065075685,17.18074057922363C3.0999999065075685,17.677840579223634,3.5029438265075683,18.080740579223633,3.9999998265075685,18.080740579223633L17.99511982650757,18.080740579223633L17.99511982650757,18.432640579223634C17.99511982650757,18.83464057922363,18.44551982650757,19.07224057922363,18.77731982650757,18.84534057922363L20.65791982650757,17.559340579223633Z" fill-rule="evenodd" fill="${this.BtnColor}" fill-opacity="1"></path></g></g></svg>`
        } else {
            this.audio.loop = true;
            this.Music_LoopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true"><g><g><path d="M15.74279765625,7.853043046874999L18.49559765625,6.441233046875C18.85809765625,6.255353046874999,18.85809765625,5.745393046875,18.49559765625,5.559513046875L15.74279765625,4.147706546875C15.40999765625,3.977068046875,14.99999765625,4.193972046875,14.99999765625,4.567901046875L14.99999765625,5.101143046875L9.27052765625,5.115173046875Q6.31367765625,5.115173046875,4.21554765625,7.119553046875Q2.09999966625,9.140573046875,2.10000050065,12.007623046875Q2.10000002385,14.874723046875,4.21554765625,16.895723046875Q6.31367765625,18.900123046875002,9.27272765625,18.900123046875002L14.72729765625,18.900123046875002Q17.686297656249998,18.900123046875002,19.78449765625,16.895723046875Q21.89999765625,14.874623046875,21.89999765625,12.007623046875C21.89999765625,11.510573046874999,21.49709765625,11.107623046875,20.99999765625,11.107623046875C20.50289765625,11.107623046875,20.09999765625,11.510573046874999,20.09999765625,12.007623046875Q20.09999765625,14.104923046875,18.54109765625,15.594123046875Q16.96469765625,17.100123046874998,14.72729765625,17.100123046874998L9.27272765625,17.100123046874998Q7.03527765625,17.100123046874998,5.45892765625,15.594123046875Q3.89999765625,14.104923046875,3.89999765625,12.007623046875Q3.89999765625,9.910363046875,5.45892765625,8.421093046875Q7.03527765625,6.915173046875,9.27492765625,6.915173046875L14.99999765625,6.901153046875001L14.99999765625,7.432843046875C14.99999765625,7.806773046875,15.40999765625,8.023683046875,15.74279765625,7.853043046874999ZM11.59999765625,14.500123046875L11.59999765625,11.181743046874999L11.49922765625,11.248923046875C11.35367765625,11.345953046875,11.18300765625,11.398473046875,11.00807765625,11.400043046875L10.99999765625,11.400073046875C10.69907765625,11.400073046875,10.41807765625,11.249683046874999,10.25115765625,10.999303046875C10.16046765625,10.863283046875,10.10854765625,10.705123046875,10.10096765625,10.541813046875C10.10032765625,10.527913046875,10.09999765625,10.513993046875001,10.09999765625,10.500073046875C10.09999765625,10.440813046875,10.10585765625,10.381683046875,10.11747765625,10.323573046875001C10.16428765625,10.089513046875,10.30216765625,9.883633046875001,10.50076765625,9.751233046875L12.00076765625,8.751233046875C12.14859765625,8.652673046875,12.32229765625,8.600073046875,12.49999765625,8.600073046875C12.99709765625,8.600073046875,13.39999765625,9.003023046875,13.39999765625,9.500073046875L13.39999765625,14.500123046875C13.39999765625,14.997123046875,12.99709765625,15.400123046875,12.49999765625,15.400123046875C12.00294765625,15.400123046875,11.59999765625,14.997123046875,11.59999765625,14.500123046875Z" fill-rule="evenodd" fill="${this.BtnColor}" fill-opacity="1"></path></g></g></svg>`
        }
        this.isLoop = !this.isLoop;
    }
    Music_ChangeProgress(event) {
        if (this.isLoadMusicOK) {
            this.audio.currentTime = this.MusicDuration * (event.offsetX / this.Music_Progress.clientWidth);
        }
        this.Music_Progress.style.cssText += `
            background-image: linear-gradient(90deg, ${this.BtnColor} 0, ${this.BtnColor} ${this.audio.currentTime / this.MusicDuration * 100}%, rgba(255,255,255,0.4) 0 , rgba(255,255,255,0.4));
        `

    }
    Music_ListenLoop() {
        this._timer = setInterval(() => {
            if (this.isMusicPlaying) {

                this.Music_Cover.style.cssText += `
                transform : rotate(${this.MusicCoverDeg}deg);
                `
                this.MusicCoverDeg += 0.7;
            }
            this.Music_Progress.style.cssText += `
            background-image: linear-gradient(90deg, ${this.BtnColor} 0, ${this.BtnColor} ${this.audio.currentTime / this.MusicDuration * 100}%, rgba(255,255,255,0.4) 0 , rgba(255,255,255,0.4));
            `

            clearInterval(this._timer);
            this.Music_ListenLoop();
        }, this.ThreadTimerDelay)
    }
};

class Local_Config {
    constructor(method = 0) {
        this.method = method;
    }
    SetConfig(key, value) {
        switch (this.method) {
            case 0:
                localStorage.setItem(key, value);
                break

        }

    }
    GetConfig(key) {

        switch (this.method) {
            case 0:

                return localStorage.getItem(key);


        }
        return ''
    }
    ClearAllConfigs() {
        switch (this.method) {
            case 0:
                localStorage.clear();
        }
    }
    RemoveConfig(key) {
        switch (this.method) {
            case 0:
                localStorage.removeItem(key);
        }
    }
}
