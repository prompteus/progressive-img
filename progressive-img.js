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
          --placeholder-filter: blur(10px) saturate(1.2);
          --placeholder-scale: 1.1;
          --transition-duration: .2s;
          --transition-timing-function: ease-in;
        }
      
        .container {
          overflow: hidden;
          position: relative;
        }
                         
        img {
          display: block;
          width: 100%;
        }
          
        img.placeholder {
          filter: var(--placeholder-filter);
          transform: scale(var(--placeholder-scale));
          will-change: transform;
          transition-property: transform;
          transition-timing-function: linear;
          transition-duration: calc(var(--transition-duration) * 2);
        }
          
        [loaded] .placeholder {
          transform: scale(1);
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
          transition-property: opacity;
          transition-duration: var(--transition-duration);
          transition-timing-function: var(--transition-timing-function);
        }
                        
        [loaded] .final {
          opacity: 1;
        }
        
      </style>
  
      <div class="container" on-click="loadLarge" loaded$="[[_loaded]]">
          <img class="placeholder" src$="[[placeholder]]" alt$="[[alt]]">
          <img class="final" src$="[[_finalSrc]]" srcset$="[[_finalSrcset]]" alt$="[[alt]]" on-load="finalLoaded">
      </div>
    `
  }

  constructor() {
    super()
    afterNextRender(this, () => {
      if (this.load === 'immediately') {
        this.loadLarge()
      } else if (this.load === 'on-visible') {
        this.observeVisibility()
      }
    })
  }

  loadLarge() {
    this._finalSrc = this.src
    this._finalSrcset = this.srcset
  }

  observeVisibility() {
    this.observer = new IntersectionObserver((nodes) => {
      if (nodes[0].isIntersecting) {
        this.loadLarge()
        this.observer.disconnect()
      }
    })
    this.observer.observe(this.shadowRoot.querySelector('.placeholder'))
  }

  finalLoaded() {
    this._loaded = true
  }

  static get properties() {
    return {
      placeholder: String,

      src: String,
      srcset: String,

      alt: String,

      load: String,

      _finalSrc: String,
      _finalSrcset: String,
      _loaded: {
        type: Boolean,
        value: false
      }
    }
  }
}

window.customElements.define(ProgressiveImg.is, ProgressiveImg)