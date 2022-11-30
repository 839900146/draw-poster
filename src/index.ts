import type { TDrawPosterOptions, TDrawConfig } from './index.d';

export class DrawPoster {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D | null;
    root!: HTMLElement;

    constructor(opts: TDrawPosterOptions) {
        this.createCanvas(opts)
    }

    /**
     * 创建canvas
     */
    createCanvas(opts: TDrawPosterOptions) {
        this.root = opts.root
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')

        if (opts.width || opts.height) {
            if (opts.width) this.canvas.width = opts.width
            if (opts.height) this.canvas.height = opts.height
        } else {
            let { width, height } = this.computerElementSize(opts.root)
            this.canvas.width = width
            this.canvas.height = height
        }
        this.root.appendChild(this.canvas)
    }

    /**
     * 获取元素的宽高、位置
     */
    computerElementSize(el: HTMLElement) {
        let { offsetWidth, offsetHeight, offsetLeft, offsetTop } = el
        return {
            height: offsetHeight,
            width: offsetWidth,
            left: offsetLeft,
            top: offsetTop
        }
    }

    /**
     * 绘制圆角矩形
     */
    drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI)
        ctx.lineTo(x + width, y + height - radius)
        ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI)
        ctx.lineTo(x + radius, y + height)
        ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
        ctx.lineTo(x, y + radius)
        ctx.arc(x + radius, y + radius, radius, 1 * Math.PI, 1.5 * Math.PI)
    }

    /**
     * 绘制图片
     */
    drawImage(config: TDrawConfig) {
        return new Promise((resolve) => {
            if (!config.content || typeof config.content !== 'string') return
            let img = new Image()
            img.src = config.content
            img.onload = () => {
                this.ctx?.beginPath()
                if (config.style?.radio) {
                    if (!this.ctx) return
                    this.drawRoundedRect(
                        this.ctx,
                        config.style?.left || 0,
                        config.style?.top || 0,
                        config.style?.width || this.canvas.width,
                        config.style?.height || this.canvas.height,
                        config.style?.radio || 0
                    )
                    this.ctx.save()
                    this.ctx.clip()
                }

                this.ctx?.drawImage(
                    img,
                    config.style?.left || 0,
                    config.style?.top || 0,
                    config.style?.width || this.canvas.width,
                    config.style?.height || this.canvas.height
                )

                resolve(true)
            }
        })
    }

    /**
     * 绘制线条
     */
    drawLine(config: TDrawConfig) {
        return new Promise((resolve) => {
            let top = config.style?.top || 0
            let left = config.style?.left || 0
            let width = config.style?.width || 0
            let height = config.style?.height || 0

            this.ctx?.beginPath()
            // 左上角
            this.ctx?.lineTo(left, top)
            // 右上角
            this.ctx?.lineTo(left + width, top)
            // 右下角
            this.ctx?.lineTo(left + width, height + top)
            // 左下角
            this.ctx?.lineTo(left, height + top)

            this.ctx!.lineWidth = config.style?.borderWidth || 1
            this.ctx!.strokeStyle = config.style?.borderColor || '#fff'

            this.ctx?.stroke()
            resolve(true)
        })
    }

    /**
     * 绘制矩形
     */
    drawRect(config: TDrawConfig) {
        return new Promise(async (resolve) => {
            let top = config.style?.top || 0
            let left = config.style?.left || 0
            let width = config.style?.width || 0
            let height = config.style?.height || 0
            this.ctx?.beginPath()
            this.ctx!.fillStyle = config.style?.fillColor || '#fff'
            this.ctx?.fillRect(left, top, width, height)

            if (config.content) {
                await this.drawText({
                    ...config,
                    style: {
                        ...(config.style || {}),
                        fontSize: 12
                    }
                })
            }

            resolve(true)
        })
    }

    /**
     * 绘制文字
     */
    drawText(config: TDrawConfig) {
        return new Promise((resolve) => {
            if (!config.content || !this.ctx) return

            let top = config.style?.top || 0
            let left = config.style?.left || 0
            this.ctx!.globalCompositeOperation = 'source-over'
            this.ctx!.font = `${config.style?.fontSize || 16}px 宋体`
            this.ctx!.fillStyle = config.style?.color || '#000'
            if(config.style?.textAlign === 'middle') {
                this.ctx!.textBaseline = "middle"
                let fix = this.ctx.measureText(String(config.content)).actualBoundingBoxDescent
                this.ctx?.fillText(
                    String(config.content),
                    left + fix + 2,
                    top + fix + 2,
                    this.canvas.width
                )
            } else {
                this.ctx?.fillText(
                    String(config.content),
                    left,
                    top,
                    this.canvas.width
                )
            }
            this.ctx!.globalCompositeOperation = 'source-over'
            resolve(true)
        })
    }

    /**
     * 绘制方法入口
     */
    async draw(config: TDrawConfig[]) {
        for (let i = 0; i < config.length; i++) {
            let item = config[i]
            this.ctx?.restore()

            if (item.type === 'image') await this.drawImage(item)
            if (item.type === 'text') await this.drawText(item)
            if (item.type === 'line') await this.drawLine(item)
            if (item.type === 'rect') await this.drawRect(item)
        }
    }

}