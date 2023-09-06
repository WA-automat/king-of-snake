import {GameObject} from "@/assets/scripts/GameObject";

// 墙体对象(障碍物)
export class Wall extends GameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#B37226";
    }

    update() {
        this.render();
    }

    // 渲染墙
    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}