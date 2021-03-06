import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Context, {Context as State, defaultContext} from './context'

import About from '../About'
import Contact from '../Contact'
import Footer from '../Footer'
import Home from '../Home'
import Nav from '../Nav'
import PrivacyPolicy from '../PrivacyPolicy'
import WhatWeDo from '../WhatWeDo'

import {fetchCountries} from '../../functions/countries'

import './styles.styl'

const CACHE_UPDATE_FREQUENCY = 1000 * 60 * 60 * 24 // 1 day

// ------------------------------------------------------------------ # Public #

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = defaultContext
  }

  componentDidMount() {
    const cache = JSON.parse(localStorage.getItem('cache') || '{}')
    const now = Date.now()

    /* if (cache.expiry > now) { */
    /*   console.log('Cache loaded.') */
    /*   return this.setState({countries: cache.countries, status: 'READY'}) */
    /* } */

    console.log('Cache updating ...')
    fetchCountries()
      .then(countries => {
        const nextCache = {countries, expiry: now + CACHE_UPDATE_FREQUENCY}
        localStorage.setItem('cache', JSON.stringify(nextCache))
        this.setState({countries, status: 'READY'})
        console.log('Cache updated.')
      })
      .catch(error => {
        console.error('Error while updating cache.')
        console.error(error)
        this.setState({countries: cache.countries || [], status: 'READY'})
      })
  }

  render() {
    return (
      <BrowserRouter>
        <Context.Provider value={this.state}>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/what-we-do" component={WhatWeDo} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
          </Switch>
          <Footer />
        </Context.Provider>
      </BrowserRouter>
    )
  }
}
