
type TDrawPosterOptions = {
    root: HTMLElement
    width?: number
    height?: number
    dpi?: number
}

type TDrawTypes = 'image' | 'text' | 'rect' | 'line'

type TDrawConfig = {
    type: TDrawTypes,
    content?: string | number | boolean
    style?: {
        width?: number
        height?: number
        top?: number
        left?: number
        radio?: number
        backgroundColor?: string
        color?: string
        fontSize?: number
        borderColor?: string
        borderWidth?: number
        fillColor?: string
        textAlign?: 'middle'
    }
}

export class DrawPoster {
    private canvas!: HTMLCanvasElement | null;
    private ctx!: CanvasRenderingContext2D | null;
    private root!: HTMLElement;
    private __temp_opts__!: TDrawPosterOptions;
    dpi!: number

    constructor(opts: TDrawPosterOptions) {
        this.createCanvas(opts)
    }

    /**
     * 创建canvas
     */
    private createCanvas(opts: TDrawPosterOptions) {
        if (!opts) return
        this.clear()
        this.__temp_opts__ = opts
        this.root = opts.root
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.dpi = opts.dpi || 1

        if (opts.width || opts.height) {
            if (opts.width) this.canvas.width = opts.width
            if (opts.height) this.canvas.height = opts.height
        } else {
            let { width, height } = this.computerElementSize(opts.root)
            this.canvas.width = width
            this.canvas.height = height
        }

        if(this.dpi >= 1) {
            this.canvas.width = this.canvas.width * this.dpi
            this.canvas.height = this.canvas.height * this.dpi
        }

        this.root.appendChild(this.canvas)
    }

    /**
     * 获取元素的宽高、位置
     */
    private computerElementSize(el: HTMLElement) {
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
            img.setAttribute("crossOrigin", 'Anonymous')
            img.onload = () => {
                if (!this.canvas || !this.ctx) return
                this.ctx.beginPath()
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

                this.ctx.drawImage(
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
            if (!this.canvas || !this.ctx) return resolve(false)
            let top = config.style?.top || 0
            let left = config.style?.left || 0
            let width = config.style?.width || 0
            let height = config.style?.height || 0
            this.ctx?.beginPath()
            this.ctx!.fillStyle = config.style?.fillColor || '#fff'
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
                this.ctx.fill()
                this.ctx.save()
                this.ctx.clip()
                this.ctx?.restore()
            } else {
                this.ctx?.fillRect(left, top, width, height)
            }


            if (config.content) {
                await this.drawText({
                    ...config,
                    style: {
                        fontSize: 12 * this.dpi,
                        ...(config.style || {}),
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
            if (!config.content || !this.ctx || !this.canvas) return

            let top = config.style?.top || 0
            let left = config.style?.left || 0
            this.ctx!.globalCompositeOperation = 'source-over'
            this.ctx!.font = `${config.style?.fontSize || 16}px 宋体`
            this.ctx!.fillStyle = config.style?.color || '#000'
            if (config.style?.textAlign === 'middle') {
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
        if ((!this.canvas || !this.ctx) && this.__temp_opts__) {
            this.createCanvas(this.__temp_opts__)
        }
        this.handleDpi(config)
        for (let i = 0; i < config.length; i++) {
            let item = config[i]
            this.ctx?.restore()
            if (item.type === 'image') await this.drawImage(item)
            if (item.type === 'text') await this.drawText(item)
            if (item.type === 'line') await this.drawLine(item)
            if (item.type === 'rect') await this.drawRect(item)
        }
    }

    /**
     * 导出
     */
    export(type: 'base64' | 'blob' | 'file', filename?: string): File | Blob | string | undefined {
        if (!this.canvas) return

        if (type === 'base64') {
            return this.canvas.toDataURL('image/jpeg')
        }

        if (type === 'blob') {
            let base64 = this.canvas.toDataURL('image/jpeg')
            return this.base64ToBlob(base64)
        }

        if (type === 'file' && filename) {
            let base64 = this.canvas.toDataURL('image/jpeg')
            let blob = this.base64ToBlob(base64)
            return this.blobToFile(blob, `${filename}.jpeg`)
        }
    }

    /**
     * 清空canvas
     */
    clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.canvas.parentNode?.removeChild(this.canvas)
            this.ctx = null
            this.canvas = null
        }
    }

    /**
     * base64转blob
     */
    base64ToBlob(dataurl: string) {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)?.[1] || '',
            bstr = window.atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * blob转file
     */
    blobToFile(blob: any, filename: string) {
        blob.lastModifiedDate = new Date();
        blob.name = filename;
        return blob as File;
    }

    /**
     * file转blob
     */
    fileToBlob(file: File) {
        if (!file) return
        return new Promise<Blob>((resolve) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const blob = new Blob([new Uint8Array(e.target!.result as ArrayBuffer)], { type: file.type });
                resolve(blob)
            };
            reader.readAsArrayBuffer(file);
        })
    }

    /**
     * 浏览器下载
     */
    async download(type: 'base64' | 'file' | 'blob', data: any, filename: string) {
        let blob = data
        if (type === 'base64') blob = this.base64ToBlob(data)
        if (type === 'file') blob = await this.fileToBlob(data)
        if (!(blob instanceof Blob)) throw new TypeError('data type is not base64 || file || blob')
        const url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = filename
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    }

    /**
     * 处理像素dpi
     */
    async handleDpi(config: TDrawConfig[]) {
        if(typeof this.dpi !== 'number' || this.dpi < 1) return
        config.forEach(item => {
            Object.keys(item.style || Object.create(null)).forEach((key) => {
                // @ts-ignore
                if(typeof item.style?.[key] === 'number') {
                    // @ts-ignore
                    item.style[key] = (item.style?.[key] || 0) * this.dpi
                }
            })
        })
    }
}