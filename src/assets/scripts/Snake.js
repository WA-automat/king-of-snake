import {GameObject} from "@/assets/scripts/GameObject";
import {Cell} from "@/assets/scripts/Cell";

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();

        // 获取基本信息
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        // 存放蛇的身体，cells[0]存放蛇头
        this.cells = [new Cell(info.r, info.c)];
        this.next_cell = null;  //下一步的目的地

        // 蛇的速度：每秒钟走n个格子
        this.speed = 5;

        // 记录指令，-1表示没有指令，0,1,2,3表示上右下左
        this.direction = -1;

        // 记录状态，“idle”表示静止，“move”表示移动，"die"表示已经死亡
        this.status = "idle";

        // 记录方向偏移量
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, 1, 0, -1];

        // 当前的回合数
        this.step = 0;

        // 设置允许接受的误差大小
        this.eps = 1e-2;

        // 左下角蛇初始朝上，右下角蛇朝下
        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;

        // 蛇眼睛不同方向的偏移量
        this.eye_dx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1]
        ];
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [-1, 1]
        ];
    }

    start() {

    }

    // 检测当前回合，蛇的长度是否增加
    check_tail_increasing() {
        if (this.step <= 10) return true;
        return this.step % 3 === 1;
    }

    // 设置方向的接口
    set_direction(d) {
        this.direction = d;
    }

    // 将蛇的状态变为走下一步
    next_step() {
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);

        // 改变眼睛的方向
        this.eye_direction = d;

        this.direction = -1;
        this.status = "move";
        this.step++;

        // 将每一个cell都向后复制一份
        const k = this.cells.length;
        for (let i = k; i > 0; i--) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        // 下一步操作非法
        if (!this.gamemap.check_valid(this.next_cell)) {
            this.status = "die";
        }
    }

    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 走到目标点
        if (distance < this.eps) {
            this.cells[0] = this.next_cell; // 创建新蛇头
            this.next_cell = null;
            this.status = "idle";           //走完了，停下来

            // 砍掉蛇尾
            if (!this.check_tail_increasing()) {
                this.cells.pop();
            }

        } else {
            const move_distance = this.speed * this.timedelta / 1000;
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            // 蛇尾移动
            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        // 每一帧进行渲染与移动
        if (this.status === "move") {
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;

        // 当蛇死亡，更换颜色
        if (this.status === "die") {
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        // 绘制眼睛
        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i++) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}