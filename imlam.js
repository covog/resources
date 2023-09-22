// 聊天窗口
document.addEventListener('DOMContentLoaded', function() {
  const chatIcon = document.getElementById('chat-icon');
  const chatPopup = document.getElementById('chat-popup');

  chatIcon.addEventListener('click', function() {
    if (chatPopup.style.display === 'none' || chatPopup.style.display === '') {
      chatPopup.style.display = 'block';
    } else {
      chatPopup.style.display = 'none';
    }
  });
});

// 鼠标点击图片切换效果
let currentImageIndex = 1;

function changeImage() {
  const imageElement = document.getElementById("gif-image");

  // 定义图像路径数组
  const imagePaths = [
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/7.6kyg1m3nb0g0.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/8.4abct4c54ey0.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/1.4nzrvh696q00.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/2.6mz7kx8f5rk0.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/3.3a1tkr81h2w0.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/4.5yrerqr67ro0.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/5.31lgw9960vk0.gif",
    "https://raw.gitmirror.com/covog/picx-images-hosting/master/20230913/6.5ec2x4dioc80.gif"
  ];

  // 更新当前图像的索引
  currentImageIndex = (currentImageIndex + 1) % imagePaths.length;

  // 更新图像的 src 属性
  imageElement.src = imagePaths[currentImageIndex];
}

// 鼠标点击烟花效果
class Circle {
  constructor({ origin, speed, color, angle, context }) {
    this.origin = origin;
    this.position = { ...this.origin };
    this.color = color;
    this.speed = speed;
    this.angle = angle;
    this.context = context;
    this.renderCount = 0;
  }

  draw() {
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
    this.context.fill();
  }

  move() {
    this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x;
    this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3);
    this.renderCount++;
  }
}

class Boom {
  constructor({ origin, context, circleCount = 16, area }) {
    this.origin = origin;
    this.context = context;
    this.circleCount = circleCount;
    this.area = area;
    this.stop = false;
    this.circles = [];
  }

  randomArray(range) {
    const length = range.length;
    const randomIndex = Math.floor(length * Math.random());
    return range[randomIndex];
  }

  randomColor() {
    const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range);
  }

  randomRange(start, end) {
    return (end - start) * Math.random() + start;
  }

  init() {
    for (let i = 0; i < this.circleCount; i++) {
      const circle = new Circle({
        context: this.context,
        origin: this.origin,
        color: this.randomColor(),
        angle: this.randomRange(Math.PI - 1, Math.PI + 1),
        speed: this.randomRange(1, 6)
      });
      this.circles.push(circle);
    }
  }

  move() {
    this.circles.forEach((circle, index) => {
      if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
        return this.circles.splice(index, 1);
      }
      circle.move();
    });
    if (this.circles.length == 0) {
      this.stop = true;
    }
  }

  draw() {
    this.circles.forEach(circle => circle.draw());
  }
}

class CursorSpecialEffects {
  constructor() {
    this.computerCanvas = document.createElement('canvas');
    this.renderCanvas = document.createElement('canvas');

    this.computerContext = this.computerCanvas.getContext('2d');
    this.renderContext = this.renderCanvas.getContext('2d');

    this.globalWidth = window.innerWidth;
    this.globalHeight = window.innerHeight;

    this.booms = [];
    this.running = false;
  }

  handleMouseDown(e) {
    const boom = new Boom({
      origin: { x: e.clientX, y: e.clientY },
      context: this.computerContext,
      area: {
        width: this.globalWidth,
        height: this.globalHeight
      }
    });
    boom.init();
    this.booms.push(boom);
    this.running || this.run();
  }

  handlePageHide() {
    this.booms = [];
    this.running = false;
  }

  init() {
    const style = this.renderCanvas.style;
    style.position = 'fixed';
    style.top = style.left = 0;
    style.zIndex = '999999999999999999999999999999999999999999';
    style.pointerEvents = 'none';

    style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth;
    style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight;

    document.body.append(this.renderCanvas);

    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('pagehide', this.handlePageHide.bind(this));
  }

  run() {
    this.running = true;
    if (this.booms.length == 0) {
      return this.running = false;
    }

    requestAnimationFrame(this.run.bind(this));

    this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight);
    this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight);

    this.booms.forEach((boom, index) => {
      if (boom.stop) {
        return this.booms.splice(index, 1);
      }
      boom.move();
      boom.draw();
    });
    this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight);
  }
}

const cursorSpecialEffects = new CursorSpecialEffects();
cursorSpecialEffects.init();

// 博客运行时间
var now = new Date();
function createtime() {
  var grt = new Date("01/18/2023 06:50:00");
  now.setTime(now.getTime() + 250);
  days = (now - grt) / 1000 / 60 / 60 / 24;
  dnum = Math.floor(days);
  hours = (now - grt) / 1000 / 60 / 60 - (24 * dnum);
  hnum = Math.floor(hours);
  if (String(hnum).length == 1) {
    hnum = "0" + hnum;
  }
  minutes = (now - grt) / 1000 / 60 - (24 * 60 * dnum) - (60 * hnum);
  mnum = Math.floor(minutes);
  if (String(mnum).length == 1) {
    mnum = "0" + mnum;
  }
  seconds = (now - grt) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
  snum = Math.round(seconds);
  if (String(snum).length == 1) {
    snum = "0" + snum;
  }
  document.getElementById("timeDate").innerHTML = "🔰小破站在風雨中運行了 " + dnum + " 天 ";
  document.getElementById("times").innerHTML = hnum + " 小时 " + mnum + " 分 " + snum + " 秒";
}
setInterval("createtime()", 250);

// 搞怪标签
var OriginTitile = document.title;
var titleTime;

var leaveText = "╭(°A°`)╮ 页面崩溃啦~";
var enterText = "(ฅ>ω<*ฅ) 噫又好了~";

document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    document.title = leaveText + OriginTitile;
    clearTimeout(titleTime);
  } else {
    document.title = enterText + OriginTitile;
    titleTime = setTimeout(function() {
      document.title = OriginTitile;
    }, 2000);
  }
});
