import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import md1 from '../note/guqin.md'
import Cent from './Cent'
import Frequency from './Frequency'
import Pure from './Pure'
import Pythagorean from './Pythagorean'
import Fret2Leng from './Fret2Leng'
import Equal12 from './Equal12'
import Tuning from './Tuning'
import Position2Pitch from './Position2Pitch'

export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      md: ''
    };
  }
  componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section className='modulo'>
          <h2>音律計算法</h2>
          <Cent />
          <br />
          <Frequency />
          <h2>生律之什</h2>
          <Pythagorean />
          <Pure />
          <Equal12 />
          <h2>調弦之什</h2>
          <Fret2Leng />
          <Tuning />
          <h2>打譜第一步</h2>
          <Position2Pitch />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw, gfm]} children={md} />
        </article>
      </>
    )
  }
}