export type TDrawPosterOptions = {
    root: HTMLElement
    width?: number
    height?: number
}

export type TDrawTypes = 'image' | 'text' | 'rect' | 'line'

export type TDrawConfig = {
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