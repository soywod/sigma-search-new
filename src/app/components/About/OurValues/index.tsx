import React, {Fragment} from 'react'

import Container from '../../Container'

// @ts-ignore
import styles from './styles.styl'

// ----------------------------------------------------------------- # Private #

interface State {
  top: number
}

// ------------------------------------------------------------------ # Public #

export default class OurValues extends React.Component<{}, State> {
  ref: HTMLDivElement | null = null

  constructor(props: {}) {
    super(props)
    this.state = {
      top: 0,
    }
  }

  onScroll = () => {
    if (! this.ref) return

    const scrollBeforeRef =
      window.scrollY + window.innerHeight <= this.ref.offsetTop

    const scrollAfterRef =
      window.scrollY >= this.ref.offsetTop + this.ref.clientHeight

    if (scrollBeforeRef || scrollAfterRef) return

    const scroll =
      window.scrollY + window.innerHeight - this.ref.offsetTop

    const ratio = 1 - scroll / this.ref.clientHeight
    const top = this.ref.clientHeight * .4 * ratio

    this.setState({top})
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  render() {
    const {top} = this.state
    return (
      <Fragment>
        <div id="our-values" className={styles.frame} ref={ref => this.ref = ref} />
        <section className={styles.section} style={{top}}>
          <Container className={styles.container}>
            <h2>Our values</h2>
            <p>
              In all our business dealings Sigma Search Partners adhere to a
              strict code of practice. We:
            </p>

            <div className={styles.content}>
              <ul>
                <li>
                  Only accept assignments which we are confident we can deliver
                  to an excellent standard
                </li>
                <li>
                  Guarantee that all data on the client company are handled with
                  complete confidentiality
                </li>
                <li>
                  Present candidate information in confidence only after
                  interviewing and/or with the permission of the individual
                  involved
                </li>
                <li>
                  Introduce a candidate to only one client at a time
                </li>
              </ul>

              <ul>
                <li>
                  Keep the client and candidates informed of the progress of a
                  search assignment
                </li>
                <li>
                  Follow up the appointment to confirm that both the appointed
                  executive and the client are satisfied
                </li>
                <li>
                  Do not represent job seekers. Sigma Search Partners give
                  informal advice to job seekers and candidates but act only for
                  the client companies which retain us
                </li>
              </ul>
            </div>
          </Container>
        </section>
      </Fragment>
    )
  }
}
