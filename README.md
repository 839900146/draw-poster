## 安装
```bash
npm i draw-poster -S
```

## 用法
```ts
// 导入依赖
import { DrawPoster } from 'draw-poster'

// 传递容器并实例化对象
const draw = new DrawPoster({
    root: document.querySelector('.draw-area')
})

// 传递绘制参数并执行绘制
draw.draw([])
```

## 构造参数
也就是实例化对象时所需要传递的参数，其类型定义如下：
```ts
export type TDrawPosterOptions = {
    // 容器
    root: HTMLElement
    // canvas的宽度
    width?: number
    // canvas的高度
    height?: number
}
```
>如果不传递width或height，则默认采用容器的width、height


---


## 绘制参数
`绘制参数`是一个数组对象，数组里的每一个对象就是一个需要绘制的元素，其类型定义如下：
```ts
// 可绘制的类型：图片、文字、图形、线
export type TDrawTypes = 'image' | 'text' | 'rect' | 'line'

export type TDrawConfig = {
    // 绘制类型
    type: TDrawTypes,
    // 绘制的内容
    content?: string | number | boolean
    // 样式定义
    style?: {
        // 宽度
        width?: number
        // 高度
        height?: number
        // Y坐标
        top?: number
        // X坐标
        left?: number
        // 圆角
        radio?: number
        // 背景色
        backgroundColor?: string
        // 文字颜色
        color?: string
        // 文字大小
        fontSize?: number
        // 边框颜色
        borderColor?: string
        // 边框宽度
        borderWidth?: number
        // 填充颜色
        fillColor?: string
        // 文字对齐
        textAlign?: 'middle'
    }
}
```
>当执行绘制时，会按照绘制参数的顺序进行绘制生成


## 实例方法

- **draw**：绘制
```ts
// 类型定义
type draw = (config: TDrawConfig[]) => void
```

---

- **export**：导出
```ts
// 类型定义
type export = (type: 'base64' | 'file' | 'blob', filename?: string) => void

// 导出为base64
let base64 = draw.export('base64')

// 导出为file对象
let file = draw.export('file', 'test')

// 导出为blob对象
let blob = draw.export('blob')
```
>如果导出的是一个file对象，则必须要传递第2个参数作为文件名

---


- **clear**：清空画布
```ts
// 直接调用即可清空canvas
draw.clear()
```
>清空后，canvas也会随之销毁，如果想要再重新绘制，有2中方法
>1. 再次执行 `draw([绘制参数, ...])`，内部会自动启用上一次的构造参数来创建一个新的canvas实例，其实就相当于“重绘”
>2. 重新 `new DrawPoster(...)` 并得到一个新的实例

---

- **download**：下载图像
```ts
// draw.download(数据类型，数据，文件名)
type TDownload = (type: 'base64' | 'file' | 'blob', data: any, filename: string) => void

let blob = draw.export('blob')

draw.download('blob', blob, 'test-blob.jpeg')
```
>1. type是要下载的这个数据的类型
>2. data是要下载的数据
>3. 文件名，**必须要写文件后缀**

---

- **base64ToBlob**：base64转blob
```ts
type base64ToBlob = (dataurl: string) => Blob

draw.base64ToBlob('base64 str...')
```

---

- **blobToFile**：blob转file对象
```ts
type blobToFile = (blob: any, filename: string) => File

draw.blobToFile(new Blob(['abc']), 'test1.txt')
```

---

- **fileToBlob**：file转blob对象
```ts
type fileToBlob = (file: File) => Promise<Blob>

draw.fileToBlob(/** file文件对象 */, 'test1.txt')
```

---

## 示例

- 完整实例可参考：[点击跳转](https://github.com/839900146/draw-poster/tree/main/public)

```ts
import { DrawPoster } from '../dist/index.js'
window.onload = () => {
    const draw = new DrawPoster({
        root: document.querySelector('.draw-area')
    })

    draw.draw([
        { // 背景
            type: 'image',
            content: 'https://img.emoz.cloud/static/63a1a6a60eecde0cf08293943b16ff01.png',
            style: {
                width: 400,
                height: 700,
                top: 0,
                left: 0,
                level: 'bottom',
            }
        },
        { // 二维码
            type: 'image',
            content: 'https://img.emoz.cloud/share_qrcode/6bb5064e-5cb8-43e7-a6c5-d9848be5d664.png',
            style: {
                width: 110,
                height: 110,
                left: 145,
                top: 520,
            }
        },
        { // 剧本封面
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 80,
                height: 110,
                left: 50,
                top: 200,
                radio: 6
            }
        },
        { // 剧本名
            type: 'text',
            content: '剧本杀',
            style: {
                left: 140,
                top: 220,
                fontSize: 18,
                color: '#333'
            }
        },
        { // 人物昵称
            type: 'text',
            content: 'DM黄某',
            style: {
                left: 165,
                top: 245,
                fontSize: 14,
                color: '#333'
            }
        },
        { // 人物头像
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 20,
                height: 20,
                left: 140,
                top: 230,
                radio: 10
            }
        },
        {// 时间
            type: 'text',
            content: '今天19:00',
            style: {
                left: 140,
                top: 270,
                fontSize: 14,
                color: '#333'
            }
        },
        { // 时长
            type: 'text',
            content: '5.5小时',
            style: {
                left: 240,
                top: 270,
                fontSize: 14,
                color: '#999'
            }
        },
        { // 标签
            type: 'rect',
            content: '机制',
            style: {
                width: 40,
                height: 20,
                left: 190,
                top: 285,
                fillColor: '#fff',
                textAlign: 'middle',
            }
        },
        { // 标签
            type: 'rect',
            content: '情感',
            style: {
                width: 40,
                height: 20,
                left: 140,
                top: 285,
                fillColor: '#fff',
                textAlign: 'middle',
            }
        },
        { // 标签
            type: 'rect',
            content: '都市',
            style: {
                width: 40,
                height: 20,
                left: 240,
                top: 285,
                fillColor: '#fff',
                textAlign: 'middle',
            }
        },
        { // 玩家1
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 50,
                top: 340,
                radio: 18
            }
        },
        { // 玩家2
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 92,
                top: 340,
                radio: 18
            }
        },
        { // 玩家3
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 134,
                top: 340,
                radio: 18
            }
        },
        { // 玩家4
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 176,
                top: 340,
                radio: 18
            }
        },
        { // 玩家5
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 218,
                top: 340,
                radio: 18
            }
        },
        { // 玩家6
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 260,
                top: 340,
                radio: 18
            }
        },
        { // 玩家7
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 302,
                top: 340,
                radio: 18
            }
        },
        { // 玩家8
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 50,
                top: 390,
                radio: 18
            }
        },
        { // 玩家9
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 92,
                top: 390,
                radio: 18
            }
        },
        { // 玩家10
            type: 'image',
            content: 'https://img.emoz.cloud/drama_cover/c8617dbc62127e3c011ada388b22e1e4.jpg?imageMogr2/format/jpg/quality/70/thumbnail/!70p',
            style: {
                width: 35,
                height: 35,
                left: 134,
                top: 390,
                radio: 18
            }
        },
    ])
}
```