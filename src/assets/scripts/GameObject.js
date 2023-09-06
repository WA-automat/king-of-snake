const GAME_OBJECT = [];

// 游戏控件的基类对象
export class GameObject {
    constructor() {
        GAME_OBJECT.push(this);
        this.timedelta = 0;
        this.has_called_start = false;
    }

    // 只执行一次
    start() {}

    // 每一帧执行一次(除了第一次之外)
    update() {}

    // 删除之前执行
    on_destory() {}

    // 将当前对象从数组中删除
    destory() {
        this.on_destory();

        for (let i in GAME_OBJECT) {
            const obj = GAME_OBJECT[i];
            if (obj === this) {
                GAME_OBJECT.splice(i);
                break;
            }
        }
    }
}


let last_timestamp; // 上一次执行的时刻
const step = timestamp => {
    for (let obj of GAME_OBJECT) {
        if (!obj.has_called_start) {
            // 当start函数未被执行过
            obj.has_called_start = true;
            obj.start();
        } else {
            // 当已经执行过start
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    // 更新timestamp
    last_timestamp = timestamp;

    // 递归调用，使得每一帧都会调用step函数
    requestAnimationFrame(step);
}

// 使得每次浏览器渲染之前调用step这个函数
// 默认一般为每秒刷新60次，即60帧
requestAnimationFrame(step)