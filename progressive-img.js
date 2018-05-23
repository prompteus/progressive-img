import { html, PolymerElement } from '@polymer/polymer/polymer-element'
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status'


class ProgressiveImg extends PolymerElement {
  static get is() {
    return 'progressive-img'
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      
        div {
          overflow: hidden;
          position: relative;
        }
                         
        img {
          display: block;
          width: 100%;
        }
          
        img.placeholder {
          filter: blur(10px) saturate(1.2);
          transform: scale(1.1);
        }
          
        img.final {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          opacity: 0;
          will-change: opacity;
          transition: opacity ease-in .15s;
        }
                        
        img.final[loaded] {
          opacity: 1;
        }
      </style>
  
      <div>
          <img class="placeholder" src$="[[placeholder]]" alt$="[[alt]]" loaded$="[[loaded]]">
          <img class="final" src$="[[finalSrc]]" srcset$="[[finalSrcset]]" alt$="[[alt]]" loaded$="[[loaded]]" on-load="finalLoaded">
      </div>
    `
  }

  constructor() {
    super()
    afterNextRender(this, () => {
      this.finalSrc = this.src
      this.finalSrcset = this.srcset
    })
  }

  finalLoaded() {
    this.loaded = true
  }

  static get properties() {
    return {
      placeholder: String,
      src: String,
      srcset: String,
      alt: String,
      finalSrc: String,
      finalSrcset: String,
      loaded: {
        type: Boolean,
        value: false
      }
    }
  }
}

window.customElements.define(ProgressiveImg.is, ProgressiveImg)
