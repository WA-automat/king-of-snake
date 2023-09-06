import {GameObject} from "./GameObject";
import {Wall} from "@/assets/scripts/Wall";
import {Snake} from "@/assets/scripts/Snake";

// 游戏地图类
export class GameMap extends GameObject {
    constructor(ctx, parent) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;

        // 行数列数
        this.rows = 13;
        this.cols = 14;

        // 内部障碍物数量
        this.inner_wall_count = 20;

        // 存放墙的数组
        this.walls = []

        // 引入两条蛇
        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this)
        ]
    }

    // 判断两蛇是否连通
    check_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }
        return false;
    }

    // 创建墙的函数
    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r++) {
            g[r] = [];
            for (let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c++) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建内部的墙
        for (let i = 0; i < this.inner_wall_count / 2; i++) {
            // 防止出现重叠
            for (let j = 0; j < 1000; j++) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue;

                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        // 判断是否连通
        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;

        // 创建墙对象
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }

    // 监听键盘操作事件
    add_listening_events() {
        this.ctx.canvas.focus();

        // 设置两蛇的方向
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        })
    }

    start() {
        // 当创建了可连通的墙后，可以结束创建
        for (let i = 0; i < 1000; i++) {
            if (this.create_walls()) break;
        }

        // 开启获取事件
        this.add_listening_events();
    }

    update_size() {
        // 求出游戏区域小方格的边长
        this.L = parseInt(Math.min(this.parent.clientWidth / this.rows, this.parent.clientHeight / this.cols))

        // 获取对象的大小
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    // 让两条蛇进入下一个回合
    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    // 判断两条蛇是否都准备好了
    check_ready() {
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    // 检测下一个格子是否合法
    // 即，不能撞到蛇的身体
    // 并且不能撞到墙
    check_valid(cell) {
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
        }

        return true;
    }

    update() {
        // 每一帧进行渲染
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    // 渲染函数
    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                // canvas使用不同的坐标系
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}