import React, {Component} from 'react'

// @ts-ignore
import styles from './Animation.styl'

// ----------------------------------------------------------------- # Private #

interface Props {
  name: string
  composition: string
}

// ------------------------------------------------------------------ # Public #

export default class Animation extends Component<Props, {}> {
  private container: HTMLDivElement    | null = null
  private animation: HTMLCanvasElement | null = null

  private constructor(props: Props) {
    super(props)
  }

  public componentDidMount() {
    const {composition, name} = this.props
    const {createjs, AdobeAn} = window as any

    const comp = AdobeAn.getComposition(composition)
    const loader = new createjs.LoadQueue(false)

    loader.addEventListener('fileload', (evt: any) => {
      const images = comp.getImages()

      if (evt && (evt.item.type === 'image')) {
        images[evt.item.id] = evt.result
      }
    })

    loader.addEventListener('complete', (evt: any) => {
      const lib = comp.getLibrary()
      const ss = comp.getSpriteSheet()
      const queue = evt.target
      const root = lib[name]

      for (const ss_metadata of lib.ssMetadata) {
        ss[ss_metadata.name] = new createjs.SpriteSheet({
          frames: ss_metadata.frames,
          images: [queue.getResult(ss_metadata.name)],
        })
      }

      const stage = new lib.Stage(this.animation)
      stage.enableMouseOver()

      const fnStartAnimation = () => {
        stage.addChild(new root())
        createjs.Ticker.setFPS(lib.properties.fps)
        createjs.Ticker.addEventListener('tick', stage)
      }

      let lastW: number
      let lastS = 1

      const resize_canvas = () => {
        const w = lib.properties.width
        const h = lib.properties.height
        const iw = window.innerWidth
        const ih = window.innerHeight
        const pRatio = window.devicePixelRatio || 1
        const xRatio = iw / w
        const yRatio = ih / h
        let sRatio = 1

        if (lastW === iw) {
          sRatio = lastS
        } else {
          sRatio = Math.max(xRatio, yRatio)
        }

        if (this.animation && this.container) {
          this.animation.width = w * pRatio * sRatio
          this.animation.height = h * pRatio * sRatio
          this.animation.style.width = this.container.style.width =  w * sRatio + 'px'
          this.animation.style.height = this.container.style.height = h * sRatio + 'px'
        }

        stage.scaleX = pRatio * sRatio
        stage.scaleY = pRatio * sRatio
        lastW = iw
        lastS = sRatio
        stage.tickOnUpdate = false
        stage.update()
        stage.tickOnUpdate = true
      }

      window.addEventListener('resize', resize_canvas)
      resize_canvas()

      AdobeAn.compositionLoaded(lib.properties.id)
      fnStartAnimation()
    })

    loader.loadManifest(comp.getLibrary().properties.manifest)
  }

  public render() {
    return (
      <section className={styles.section}>
        <div className={styles.container} ref={ref => this.container = ref}>
          <canvas
            className={styles.animation}
            ref={ref => this.animation = ref}
          />
        </div>

        <div className={styles.content}>
          {this.props.children}
        </div>
      </section>
    )
  }
}
