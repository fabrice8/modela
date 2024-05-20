( function( global, factory ){
  // Current version
  const version = '0.0.1'

  // AMD. Register as an anonymous module. ( require jQuery )
  if( typeof define === 'function' && define.amd )
    define( ['jQuery', ], [], function ( jQuery ){ return factory( global, version ) })

	else if( typeof module === 'object' && module.exports )
		/**
     * For CommonJS and CommonJS-like environments where a proper `window`
     * is present, execute the factory and get window.
     * 
     * For environments that do not have a `window` with a `document`
     * (such as Node.js), expose a factory as module.exports.
     * This accentuates the need for the creation of a real `window`.
     * 
     * e.g. var Modela = require("modela")(window);
     * See ticket #14549 for more info.
     */
		( module.exports = global.document ) || global.jQuery ?
          			factory( global, version, true )
          			: function( gbl ){
            				if( !gbl.document )
            					throw new Error('Modela editor requires a window with a document and jQuery')

            				return factory( gbl, version )
            			}

  // Browser global
	else {
     if( !global.jQuery )
      throw new Error('Modela editor requires jQueryJS module')

     factory( global, version )
  }

  // Pass this if window is not defined yet
}( typeof window !== 'undefined' ? window : this, function( window, version, nodeGlobal ){
  let
  /**
   * Number of views identified by modela: Value
   * increase when a view instance is created
   */
  NODES_COUNT = 0,

  /**
   * Sass library cache
   */
  SassLib = null,

  /**
   * JQuery element of the root container of the
   * editor.
   * 
   * Default: null
   */
  $root = null,
  $modela = null

  const
  CONTROL_ROOT = '#modela',
  /**
   * Common selector use to identify view elements
   * in the DOM.
   * 
   * Could be `classname` or `tagname` or `data-*`
   */
  VIEW_IDENTIFIER = '.view',

  VIEW_KEY_SELECTOR = 'mv-key',
  VIEW_NAME_SELECTOR = 'mv-name',
  VIEW_STYLE_SELECTOR = 'mv-style',
  VIEW_ACTIVE_SELECTOR = 'mv-active',
  VIEW_CAPTION_SELECTOR = 'mv-caption',
  VIEW_PLACEHOLDER_SELECTOR = 'mv-placeholder',
  VIEW_TYPES_ALLOWED_SELECTOR = 'mv-types-allowed',

  /**
   * View control options
   */
  VIEW_CONTROL_OPTIONS = [
    { 
      icon: 'bx bx-edit-alt',
      label: false,
      title: 'Attributes',
      event: {
        type: 'show',
        attr: 'attributes',
        params: false,
        shortcut: 'command + alt + a'
      },
      disabled: true
    },
    { 
      icon: 'bx bx-duplicate',
      label: false,
      title: 'Duplicate',
      event: {
        type: 'action',
        attr: 'duplicate',
        params: false,
        shortcut: 'command + shift + d'
      }
    },
    { 
      icon: 'bx bx-trash',
      label: false,
      title: 'Delete',
      event: {
        type: 'action',
        attr: 'delete',
        params: false,
        shortcut: 'command + alt + d'
      }
    },
  ],

  /**
   * Control layer element selector
   * 
   * NOTE: Only custom attributes
   */
  CONTROL_PANEL_SELECTOR = 'mv-panel',
  CONTROL_TOOLBAR_SELECTOR = 'mv-toolbar',
  CONTROL_BLOCK_SELECTOR = 'mv-control-block',

  CONTROL_EDGE_MARGIN = 15,
  CONTROL_TOOLBAR_MARGIN = 6,

  /**
   * Global control options
   */
  GLOBAL_CONTROL_OPTIONS = [
    { 
      icon: 'bx bx-undo',
      label: false,
      title: 'Undo',
      event: {
        type: 'action',
        attr: 'undo',
        params: false,
        shortcut: 'command + z'
      },
      disabled: true
    },
    { 
      icon: 'bx bx-redo',
      label: false,
      title: 'Redo',
      event: {
        type: 'action',
        attr: 'redo',
        params: false,
        shortcut: 'command + y'
      },
      disabled: true
    },
    { 
      icon: 'bx bx-devices',
      label: false,
      title: 'Device Screens',
      event: {
        type: 'toggle',
        attr: 'sub',
        params: 'screen-mode'
      },
      disabled: false,
      sub: [
        { 
          icon: 'bx bx-mobile-alt',
          label: false,
          title: 'Mobile',
          event: {
            type: 'action',
            attr: 'screen-mode',
            params: 'mobile'
          },
          disabled: false
        },
        { 
          icon: 'bx bx-tab',
          label: false,
          title: 'Tablet',
          event: {
            type: 'action',
            attr: 'screen-mode',
            params: 'tablet'
          },
          disabled: false
        },
        { 
          icon: 'bx bx-desktop',
          label: false,
          title: 'Desktop',
          event: {
            type: 'action',
            attr: 'screen-mode',
            params: 'desktop'
          },
          disabled: false
        },
        { 
          icon: 'bx bx-tv',
          label: false,
          title: 'Tv',
          event: {
            type: 'action',
            attr: 'screen-mode',
            params: 'tv'
          },
          disabled: false
        }
      ]
    },
    { 
      icon: 'bx bx-cog',
      label: false,
      title: 'Settings',
      event: {
        type: 'show',
        attr: 'global',
        params: 'settings',
        shortcut: 'command + shift + s'
      },
      disabled: false
    },
    { 
      icon: 'bx bxs-brush',
      label: false,
      title: 'Styles',
      event: {
        type: 'show',
        attr: 'global',
        params: 'styles',
        shortcut: 'command + shift + c'
      },
      disabled: false,
      extra: true
    },
    { 
      icon: 'bx bx-landscape',
      label: false,
      title: 'Assets',
      event: {
        type: 'show',
        attr: 'global',
        params: 'assets',
        shortcut: 'command + shift + a'
      },
      disabled: false,
      extra: true
    }
  ],

  /**
   * UI blocks factory
   */
  BlockFactory = {
    /**
     * Process toolbar options into HTML content
     */
    createToolbar( key, options, editing = false ){
      if( typeof key !== 'string' 
          || !Array.isArray( options ) 
          || !options.length )
        throw new Error('Invalid createToolbar Arguments')

      let 
      mainOptions = '',
      extraOptions = '',
      subOptions = []

      const
      composeSubLi = ({ icon, label, title, event, disabled }) => {
        let attrs = `${disabled ? 'class="disabled"' : ''}`
        
        // Trigger event type & params attributes
        if( event ){
          if( event.type && event.attr ) attrs += ` ${event.type}="${event.attr}"`
          if( event.params ) attrs += ` params="${event.params}"`
        }

        // Add title attributes
        if( title ) attrs += ` title="${title}"`

        return `<li ${attrs}><i class="${icon}"></i></li>`
      },
      composeLi = ({ icon, label, title, event, disabled, extra, sub }) => {
        let attrs = `${disabled ? 'class="disabled"' : ''}`
        
        // Trigger event type & params attributes
        if( event ){
          if( event.type && event.attr ) attrs += ` ${event.type}="${event.attr}"`
          if( event.params ) attrs += ` params="${event.params}"`

          // Create a sub options
          if( Array.isArray( sub ) && sub.length )
            subOptions.push(`<div options="sub" extends="${event.params}">
                              <li dismiss="sub"><i class="bx bx-chevron-left"></i></li>
                              <li class="label"><i class="${icon}"></i><label>${label || title}</label></li>
                              ${sub.map( composeSubLi ).join('')}
                            </div>`)
        }

        // Add title attributes
        if( label ) attrs += ` class="label"`
        if( title ) attrs += ` title="${title}"`

        const optionLi = `<li ${attrs}><i class="${icon}"></i><label>${label ? ` ${label}` : ''}</label></li>`
        extra ?
            extraOptions += optionLi
            : mainOptions += optionLi
      }
      
      // Generate HTML menu
      options.forEach( composeLi )

      if( !mainOptions )
        throw new Error('Undefined main options')

      return `<div ${CONTROL_TOOLBAR_SELECTOR}="${key}" ${editing ? 'class="editing"' : ''}>
        <div>
          <ul>
            <div options="main">
              ${mainOptions}
              ${extraOptions ? `<li toggle="extra"><i class="bx bx-dots-horizontal-rounded"></i></li>` : ''}
            </div>

            ${ extraOptions ?
                  `<div options="extra">
                    ${extraOptions}
                    <li dismiss="extra"><i class="bx bx-chevron-left"></i></li>
                  </div>` : ''
            }

            ${subOptions.length ? subOptions.join('') : ''}
          </ul>

          ${ editing ? 
                `<ul>
                  <div options="control">
                    ${VIEW_CONTROL_OPTIONS.map( composeSubLi ).join('')}
                  </div>
                </ul>`: ''
          }
        </div>
      </div>`
    },

    createPanel( key, props, editin = false ){

      return `<div ${CONTROL_PANEL_SELECTOR}="${key}">
        <div>
          <div class="label">
            <i class="bx bx-paragraph"></i>
            <label>Paragraph</label>
          </div>

          <ul options="tabs">
            <li class="active"><i class="bx bx-edit-alt"></i></li>
            <li ><i class="bx bxs-brush"></i></li>
            <li><i class="bx bxs-zap"></i></li>

            <!-- <li><i class="bx bx-accessibility"></i></li> -->
            <li><i class="bx bx-info-circle"></i></li>
            <li><i class="bx bx-dots-horizontal-rounded"></i></li>
            <li dismiss="global"><i class="bx bx-x"></i></li>
          </ul>
          
          <div class="body">
            
          </div>
        </div>
      </div>`
    }
  }

  function initialState(){

    const state = {}

    /**
     * List of native views supported by modela
     * and there default specs.
     */
    state.STORE = {
      components: {},
      templates: {}
    }

    /**
     * Global style settings
     */
    state.STYLES = {
      primaryColor: {
        group: 'palette',
        label: 'Primary Color',
        value: 1,
        options: [
          { value: 0, hint: 'None', shape: true, apply: ['background-color: transparent'] },
          { value: 1, hint: '#ff7028', shape: true, apply: ['background-color: #ff7028'] },
          { value: 2, hint: '#ff894e', shape: true, apply: ['background-color: #ff894e'] },
          { value: 3, hint: '#ffab82', shape: true, apply: ['background-color: #ffab82'] }
        ],
        display: 'inline',
        customizable: true
      },
      secondaryColor: {
        group: 'palette',
        label: 'Secondary Color',
        value: 1,
        options: [
          { value: 0, hint: 'None', shape: true, apply: ['background-color: transparent'] },
          { value: 1, hint: '#116b1a', shape: true, apply: ['background-color: #116b1a'] },
          { value: 2, hint: '#318e3a', shape: true, apply: ['background-color: #318e3a'] },
          { value: 3, hint: '#4ea957', shape: true, apply: ['background-color: #4ea957'] }
        ],
        display: 'inline',
        customizable: true
      },
      ambiantColor: {
        group: 'palette',
        label: 'Ambiant Color',
        value: 1,
        options: [
          { value: 0, hint: 'None', shape: true, apply: ['background-color: transparent'] },
          { value: 1, hint: '#696969', shape: true, apply: ['background-color: #696969'] },
          { value: 2, hint: '#a0a0a0', shape: true, apply: ['background-color: #a0a0a0'] },
          { value: 3, hint: '#e7e7e7', shape: true, apply: ['background-color: #e7e7e7'] }
        ],
        display: 'inline',
        customizable: true
      },

      fontFamily: {
        group: 'font',
        label: 'Font Family',
        value: 'Lexend, Lexend+Deca, Lato, Rubik, sans-serif',
        options: [
          { value: 'Lexend, Rubik, sans-serif', apply: ['font-family: Lexend'] },
          { value: 'Lexend+Deca, Lato, sans-serif', apply: ['font-family: Lexend+Deca'] },
          { value: 'Lato, Rubik, sans-serif', apply: ['font-family: Lato'] },
          { value: 'Rubik, sans-serif', apply: ['font-family: Rubik'] },
          { value: 'sans-serif', apply: ['font-family: sans-serif'] }
        ],
        applyOnly: 'body',
        display: 'dropdown',
        customizable: true
      },
      fontSize: {
        group: 'font',
        label: 'Font Size',
        values: {
          '*': 'inherit',
          'XXL': 'inherit',
          'XL': 'inherit',
          'LG': 'inherit',
          'MD': 'inherit',
          'SM': 'inherit',
          'XS': 'inherit'
        },
        options: [
          { value: 'inherit', label: 'Auto' },
          { value: 'font-lg', label: 'LG' },
          { value: 'font-md', label: 'MD' },
          { value: 'font-sm', label: 'SM' }
        ],
        applyOnly: 'body',
        display: 'inline',
        customizable: true
      },
      fontWeight: {
        group: 'font',
        label: 'Font Weight',
        value: '400',
        options: [
          { value: '100', hint: 'Thin' },
          { value: '200', hint: 'Extra Light' },
          { value: '300', hint: 'Light' },
          { value: '400', hint: 'Regular' },
          { value: '500', hint: 'Medium' },
          { value: '600', hint: 'Semi Bold' },
          { value: '700', hint: 'Bold' },
          { value: '800', hint: 'Extra Bold' },
          { value: '900', hint: 'Black' }
        ],
        featuredOptions: [ 0, 2, 3, 4, 6 ],
        applyOnly: 'body',
        display: 'inline',
        customizable: true
      },
      lineHeight: {
        group: 'font',
        label: 'Line Spacement (line-height)',
        value: 1,
        options: [
          { value: 0, hint: 'None' },
          { value: 1, hint: '1' },
          { value: 2, hint: '1.2' },
          { value: 3, hint: '1.3' },
          { value: 4, hint: '1.4' },
          { value: 5, hint: '1.5' },
        ],
        applyOnly: 'body',
        display: 'inline',
        customizable: true
      },

      padding: {
        group: 'spacement',
        label: 'Padding',
        values: {
          '*': 0,
          'XXL': 0,
          'XL': 0,
          'LG': 0,
          'MD': 0,
          'SM': 0,
          'XS': 0
        },
        options: [
          { value: 0, hint: 'None' },
          { value: 1, hint: '1rem' },
          { value: 2, hint: '1.5rem' },
          { value: 3, hint: '3rem' },
          { value: 4, hint: '3.5rem' },
          { value: 5, hint: '4rem' },
        ],
        display: 'inline',
        customizable: true
      },
      margin: {
        group: 'spacement',
        label: 'Margin',
        values: {
          '*': 0,
          'XXL': 0,
          'XL': 0,
          'LG': 0,
          'MD': 0,
          'SM': 0,
          'XS': 0
        },
        options: [
          { value: 0, hint: 'None' },
          { value: 1, hint: '1rem' },
          { value: 2, hint: '1.5rem' },
          { value: 3, hint: '3rem' },
          { value: 4, hint: '3.5rem' },
          { value: 5, hint: '4rem' },
        ],
        display: 'inline',
        customizable: true
      },

      borderColor: {
        group: 'border',
        label: 'Border Color',
        value: '#2e2e2e',
        palette: [
          { value: 'none', hint: 'None' },
          { value: '#2e2e2e', hint: '#2e2e2e' },
          { value: '#656565', hint: '#656565' },
          { value: '#a9a9a9', hint: '#a9a9a9' }
        ],
        display: 'inline',
        customizable: true
      },
      borderWidth: {
        group: 'border',
        label: 'Border Size',
        value: 0,
        options: [
          { value: 0, hint: 'None' },
          { value: 1, hint: '1px' },
          { value: 2, hint: '2px' },
          { value: 3, hint: '3px' }
        ],
        display: 'inline',
        customizable: true
      },
      borderRadius: {
        group: 'border',
        label: 'Rounded Corner (Border Radius)',
        value: 0,
        options: [
          { value: 'none', hint: 'None' },
          { value: 'circle', hint: '50%' },
          { value: 'rounded', hint: '4px' },
          { value: 'rounded-sm', hint: '2px' },
          { value: 'rounded-lg', hint: '10px' },
          { value: 'rounded-xl', hint: '15px' }
        ],
        featuredOptions: [ 0, 1, 2, 3, 4 ],
        display: 'inline',
        customizable: true
      }
    }

    /**
     * Global assets store
     */
    state.ASSETS = {}

    // Must be new object memory
    return { ...state }
  }

  let { STORE, STYLES, ASSETS } = initialState()

  class Utils {
    /**
     * Debug logger
     */
    log( ...args ){ this.debug && console.debug('[debug]:', ...args ) }

    /**
     * Internationalization support function
     */
    i18n( text ){

      return text
    }

    /**
     * Define view block props as HTML comment.
     */
    defineProperties( props ){
      if( typeof props !== 'object'
          || !Object.keys( props ).length )
        throw new Error('Invalid props. Non-empty object expected')

      return `<!--${JSON.stringify( props )}-->`
    }
    /**
     * Extract defined view block props from HTML comment
     * format to object.
     */
    extractProperties( element ){
      const extracted = element.match(/<!--{(.+)}-->/g)
      if( !extracted.length ) return []

      return extracted.map( each => {
        try { return JSON.parse( each.replace(/^<!--/, '').replace(/-->$/, '') ) }
        catch( error ){ return null }
      } )
    }
    
    /**
     * Generate unique view key
     */
    generateKey(){
      NODES_COUNT++
      return Date.now() + String( NODES_COUNT )
    }

    /**
     * Return allowed global properties & methods
     */
    getGlobal(){
      return {
        styles: STYLES,
        assets: ASSETS,
        i18n: this.i18n.bind(this),
        defineProperties: this.defineProperties.bind(this)
      }
    }
    
    /**
     * Create common placeholder block
     */
    createPlaceholder(){
      if( !this.settings.enablePlaceholders ) return ''
      return `<div ${VIEW_PLACEHOLDER_SELECTOR}="active" ${VIEW_KEY_SELECTOR}="${this.generateKey()}"></div>`
    }

    /**
     * Set general state of placeholders
     * 
     * - active: Enable add-view placeholders highlighting during editing
     * - inert: Disable add-view placeholders
     */
    setPlaceholders( status = 'active' ){
      if( !this.settings.enablePlaceholders ) return
      $(`[${VIEW_PLACEHOLDER_SELECTOR}]`).attr( VIEW_PLACEHOLDER_SELECTOR, status )
    }
  }

  class Stylesheet {
    constructor({ nsp, key, props }){
      /**
       * Async load Sass Dart library or use 
       * cached.
       */
      !SassLib && import('https://jspm.dev/sass').then( sm => SassLib = sm )

      if( typeof nsp !== 'string' && typeof key !== 'string' ) 
        throw new Error('Undefined or invalid styles attachement element(s) identifier')

      /**
       * Unique identifier of targeted views/elements
       * 
       * - mv-key (for group of views)
       * - mv-namespace (for global elements)
       */
      this.nsp = nsp

      /**
       * Unique identifier of targeted view
       * 
       * - mv-key (for single views)
       */
      this.key = key

      /**
       * Styles properties
       * 
       * - predefined
       * - custom
       */
      this.props = props
    }

    /**
     * Compile Sass style string to CSS string
     */
    compile( str ){
      if( !SassLib )
        throw new Error('CSS processor library not found')
      
      return SassLib.compileString( str )
    }

    /**
     * Compile and inject a style chunk in the DOM
     * using `<style mv-style="*">...</style>` tag
     */
    inject( id, str, custom = false ){
      if( !id || !str )
        throw new Error('Invalid injection arguments')

      const 
      selector = `${VIEW_STYLE_SELECTOR}="${id}"`,
      /**
       * Defined css by a specific view or group of views or elements
       * by wrapping in a closure using the unique view-key as root 
       * selector.
       * 
       * [mv-name="global"] {
       *    font-size: 12px;
       *    &:hover {
       *      color: #000; 
       *    }
       * }
       * 
       * [mv-key="1234567890"] {
       *    font-size: 12px;
       *    &:hover {
       *      color: #000; 
       *    }
       * }
       */
      result = this.compile(`[${custom ? VIEW_KEY_SELECTOR : VIEW_NAME_SELECTOR}="${id}"] { ${str} }`)

      if( !result || !result.css )
        throw new Error(`<view:${id}> ${custom ? 'custom' : 'predefined'} style injection failed`)

      $(`head style[${selector}]`).length ?
                      // Replace existing content
                      $(`head style[${selector}]`).html( result.css )
                      // Inject new style
                      : $('head').append(`<style ${selector}>${result.css}</style>`)
    }

    /**
     * Run the defined `styles()` method of the component
     * to get initial style properties.
     */
    load( props ){
      this.props = props || this.props

      if( typeof this.props !== 'object' )
        throw new Error('Undefined styles properties')
      
      /**
       * Predefined styles affect all instance of 
       * the same view in the DOM.
       */
      this.props.predefined
      && this.props.predefined.css 
      && this.inject( this.nsp, this.props.predefined.css )

      /**
       * Custom styles affect only a unique view with a unique
       * view-key in the DOM.
       */
      this.key
      && this.props.custom 
      && this.props.custom.css 
      && this.inject( this.key, this.props.custom.css, true )
    }

    /**
     * Retreive this view's main node styles including natively 
     * defined ones.
     */
    get(){
      
    }

    /**
     * Remove all injected styles from the DOM
     */
    clear(){
      // Remove predefined styles by namespace
      this.nsp && $(`head style[${VIEW_STYLE_SELECTOR}="${this.nsp}"]`).remove()
      // Remove custom styles by views/elements
      this.key && $(`head style[${VIEW_STYLE_SELECTOR}="${this.key}"]`).remove()
    }
  }

  class View extends Utils {
    constructor( settings = {}, debug = false ){
      super()
      
      /**
       * Set editor to debuging more: log editing
       * operations details
       */
      this.debug = debug

      /**
       * Set of settings inherited from Modela
       */
      this.settings = settings

      /**
       * View's styles application handler
       */
      this.styles = null

      /**
       * 
       */
      this.$parent = null
    }

    inspect( element, name ){
      this.element = element
      this.log('current target - ', element )

      this.$ = $(element)
      if( !this.$.length )
        throw new Error('Invalid View Element')
      
      /**
       * Mount view without key: Not inspected prior
       */
      const isMounted = this.$.attr( VIEW_KEY_SELECTOR ) !== undefined
      if( !isMounted ){
        /**
         * Generate and assign view tracking key
         */
        this.key = this.generateKey()

        this.$.attr({
          [VIEW_KEY_SELECTOR]: this.key, // Set view key
          [VIEW_NAME_SELECTOR]: name // Set view node name identify
        })
        
        // Set view specifications
        this.setSpecs( STORE.components[ name ] )
        // Initialize view properties
        this.initialize()
      }

      // Auto-trigger current view
      this.trigger()
    }
    mount( specs, to, isPlaceholder = true ){
      /**
       * `to` field should only be a model-view-key to be
       * sure the destination view is within editor control
       * scope.
       */
      const $to = $(`[${VIEW_KEY_SELECTOR}="${to}"]`)
      if( !$to.length )
        throw new Error(`Invalid destination view - <key:${to}>`)
      
      // Make sure of default specs params
      specs = {
        attributes: {},
        styles: {},
        actions: {},
        ...specs
      }

      if( typeof specs.render !== 'function' )
        throw new Error(`<${specs.name}> render function not specified`)
      
      /**
       * Render new element with default specs and 
       * defined global settings
       */
      this.element = specs.render( specs, this.getGlobal() )
      this.log('mount view - ', this.element )

      // Add view to the DOM
      this.$ = $(this.element)
      $to[ isPlaceholder ? 'after' : 'append' ]( this.$ )

      // Attach a next placeholder to the new view element
      this.$.after( this.createPlaceholder() )

      /**
       * Generate and assign tracking key to the 
       * new view
       */
      this.key = this.generateKey()

      this.$.attr({
        [VIEW_KEY_SELECTOR]: this.key, // Set view key
        [VIEW_NAME_SELECTOR]: specs.name // Set view node name identify
      })

      /**
       * Extract defined view blocks props
       */
      const renderingProps = this.extractProperties( this.element )
      this.inject( renderingProps )

      // Set view specifications
      this.setSpecs( specs )
      // Initialize view properties
      this.initialize()
      // Auto-trigger current view
      this.trigger()
    }
    mirror( viewInstance ){
      /**
       * Argument must be a new instance of view class
       */
      if( typeof viewInstance !== 'object' 
          || !viewInstance.key
          || this.key )
        return

      // Clone view element
      this.element = viewInstance.$.clone().get(0)
      this.log('mirror view - ', this.element )

      // Add duplicated view to the DOM
      this.$ = $(this.element)
      viewInstance.$.parent().append( this.$ )

      // Attach a next placeholder to the new view element
      this.$.after( this.createPlaceholder() )

      /**
       * Generate and assign view tracking key
       */
      this.key = this.generateKey()
      this.$.attr( VIEW_KEY_SELECTOR, this.key )

      // Clone view specifications
      this.setSpecs( viewInstance.getSpecs() )
      // Initialize view properties
      this.initialize()
    }

    setSpecs( values ){
      this.specs = { ...this.specs, ...values }
      this.log('specs - ', this.specs )
    }
    getSpecs( type ){
      return type ? this.specs[ type ] : this.specs
    }

    /**
     * Run initial 
     */
    initialize(){
      try {
        /**
         * Initialize default styles of the view
         */
        const { name, styles } = this.getSpecs()
        if( name && typeof styles === 'function' ){
          this.styles = new Stylesheet({
            nsp: name,
            key: this.key,
            /**
             * Run the defined `styles()` method of the component
             * to get initial style properties.
             */
            props: styles( this.getGlobal() )
          })

          this.styles.load()
        }

        /**
         * 
         */
      }
      catch( error ){ this.log( error.message ) }
    }

    setParent( parent ){
      this.$parent = $(parent)
      this.log('parent target - ', parent )

      // Get parent's default specs

      // Auto-trigger current view's parent
      this.triggerParent()
    }
    getParent(){
      return this.$parent
    }

    getTopography( $view ){
      $view = $view || this.$
      
      /**
       * View position coordinates in the DOM base on
       * which related triggers will be positionned.
       */
      const { left, top } = $view.offset()

      return { 
        x: left,
        y: top,
        width: $view.width(),
        height: $view.height()
      }
    }

    inject( props ){
      if( !Array.isArray( props ) || !props.length ) return

      props.forEach( each => {
        if( !each.selector ){
          each.caption && this.$.data( VIEW_CAPTION_SELECTOR, each.caption )
          each.allowedViewTypes && this.$.data( VIEW_TYPES_ALLOWED_SELECTOR, each.allowedViewTypes )
          each.addView && this.$.append( this.createPlaceholder() )

          return
        }

        /**
         * Assign props to specified content blocks
         */
        const $block = this.$.find( each.selector )

        each.caption && $block.data( VIEW_CAPTION_SELECTOR, each.caption )
        each.allowedViewTypes && $block.data( VIEW_TYPES_ALLOWED_SELECTOR, each.allowedViewTypes )
        each.addView && $block.append( this.createPlaceholder() )
      } )
    }
    update( type, dataset ){
      typeof this.specs.apply == 'function'
      && this.specs.apply({ type, dataset, view: this })
    }
    destroy(){
      // Remove placeholder attached to the view
      this.$.next(`[${VIEW_PLACEHOLDER_SELECTOR}]`).remove()
      this.$.remove()

      // Clear all styles attached from the DOM
      this.styles.clear()

      this.$ = null
      this.key = null
      this.specs = null
      this.styles = null
      this.$parent = null
    }

    /**
     * Show view's editing toolbar
     */
    showToolbar(){
      if( $root.find(`[${CONTROL_TOOLBAR_SELECTOR}="${this.key}]"`).length ) 
        return

      const options = this.getSpecs('toolbar')
      if( !options ) return

      const $toolbar = $(BlockFactory.createToolbar( this.key, options, true ))

      let { x, y, height } = this.getTopography()
      this.log('show view toolbar: ', x, y )

      // Adjust by left edges
      if( x < 15 ) x = CONTROL_EDGE_MARGIN

      $toolbar.css({ left: `${x}px`, top: `${y}px` })
      $root.append( $toolbar )

      /**
       * Push slightly on top of element in normal position
       * but adjust below the element if it's to close to 
       * the top edge.
       */
      if( y < CONTROL_EDGE_MARGIN ) y = height + CONTROL_TOOLBAR_MARGIN
      else y -= $toolbar.height() + CONTROL_TOOLBAR_MARGIN

      // Adjust by right & bottom edges
      const
      dWidth = $(window).width(),
      dHeight = $(window).height()

      if( x > (dWidth - $toolbar.width()) ) x = dWidth - $toolbar.width() - CONTROL_EDGE_MARGIN
      if( y > (dHeight - $toolbar.height()) ) y = dHeight - $toolbar.height() - CONTROL_EDGE_MARGIN

      $toolbar.css({ left: `${x}px`, top: `${y}px` })
    }

    trigger(){
      if( !this.key ) return
      this.log('trigger view')

      /**
       * Highlight triggered view: Delay due to 
       * pre-unhighlight effect.
       */
      setTimeout( () => this.$.attr( VIEW_ACTIVE_SELECTOR, true ), 200 )

      /**
       * Fire activation function provided with 
       * component/view specs.
       */
      const activate = this.getSpecs('activate')
      typeof activate === 'function' && activate({ view: this.$ }, this.getGlobal() )
    }
    triggerParent(){
      if( !this.key ) return
      this.log('trigger parent view')
      
    }

    dismiss(){
      // Unhighlight triggered views
      $(`[${VIEW_KEY_SELECTOR}="${this.key}"]`).removeAttr( VIEW_ACTIVE_SELECTOR )
      // Remove editing options menu if active
      $root.find(`[${CONTROL_TOOLBAR_SELECTOR}="${this.key}"]`).remove()

      /**
       * Fire dismiss function provided with 
       * component/view specs.
       */
      const dismiss = this.getSpecs('dismiss')
      typeof dismiss === 'function' && dismiss({ view: this.$ }, this.getGlobal() )
    }
    dismissParent(){
      
    }
  }

  class StoreManager extends Utils {
    constructor( settings = {}, debug = false ){
      super()

      this.debug = debug

      /**
       * General settings inherited from Modela
       */
      this.settings = settings
    }

    addComponent( specs ){
      if( !specs )
        throw new Error('Undefined view component specs')

      // TODO: Check all other mandatory view specs params

      if( STORE.components[ specs.name ] )
        throw new Error(`<${specs.name}> view component already exists`)

      STORE.components[ specs.name ] = specs
      this.log('view component registered - ', specs.name )
    }
    removeComponent( name ){
      if( STORE.components[ name ] )
        throw new Error(`<${specs}> view component already exists`)

      delete STORE.components[ name ]
      this.log('view component unregistered - ', name )
    }

    drop(){
      STORE = {}
    }
  }

  class ViewsManager extends Utils {
    constructor( settings = {}, debug = false ){
      super()

      this.debug = debug

      /**
       * General settings inherited from Modela
       */
      this.settings = settings

      /**
       * Set of modela settings extend-able to view
       */
      this.viewSettings = {
        enablePlaceholders: this.settings.enablePlaceholders
      }

      /**
       * List of actively mapped views
       */
      this.list = {}

      /**
       * Default view state
       */
      this.currentView = null
    }

    has( key ){
      return this.list[ key ] && this.list[ key ].key === key
    }
    get( key ){
      return this.list[ key ]
    }
    set( view ){
      if( !view.key ) return
      this.list[ view.key ] = view
    }
    clear(){
      this.list = {}
    }
    add( name, to, isPlaceholder = true ){
      if( !STORE.components[ name ] )
        throw new Error(`Unknown <${name}> view`)

      this.currentView = new View( this.viewSettings, this.debug )
      this.currentView.mount({ ...STORE.components[ name ] }, to, isPlaceholder )

      /**
       * Set this view in global namespace
       */
      this.set( this.currentView )
    }
    lookup( e ){
      if( this.currentView && e.target == this.currentView.element ){
        /**
         * Identify parent of target by `e.currentTarget`
         * that are different from `e.target`: Upward cascade
         * triggered elements
         * 
         * Retain the last triggered parent for top view
         * highlighting reference.
         */
        if( e.target == e.currentTarget ) return
        this.currentView.setParent( e.currentTarget )

        return
      }

      /**
       * Mount current view with only known tags or 
       * components
       */
      const $currentTarget = $(e.currentTarget)
      // Identify component name or its HTML nodeName
      let cname = $currentTarget.attr( VIEW_NAME_SELECTOR )
                  || $currentTarget.prop('nodeName').toLowerCase()

      /**
       * Get components specs by name or HTML nodeName
       * 
       * NOTE: Components are registered with their canonical
       * name not by nodeName.
       */
      const specs = STORE.components[ cname ] 
                    || Object.values( STORE.components ).filter( each => (each.node == cname) )[0]

      if( !specs || this.currentView && e.currentTarget == this.currentView.element )
        return
      
      /**
       * Component's name can be the same as its HTML 
       * nodeName identifier.
       * 
       * Eg. `fieldset` name for <fieldset> tag/nodeName
       * 
       * If not, then preempt to the component's actual name 
       * instead of the HTML nodeName.
       * 
       * Eg. `text` for <span> tag/nodeName
       */
      cname = specs.name
      
      // Dismiss all active views
      Object
      .values( this.list )
      .map( view => view.dismiss() )

      /**
       * Inspect view
       */
      this.currentView = $currentTarget.attr( VIEW_KEY_SELECTOR ) ?
                                      this.get( $currentTarget.attr( VIEW_KEY_SELECTOR ) )
                                      : new View( this.viewSettings, this.debug )
      this.currentView.inspect( e.currentTarget, cname )

      /**
       * Set this view in global namespace
       */
      this.set( this.currentView )
    }
    remove( key ){
      if( !this.has( key ) ) return
      
      const view = this.get( key )
      view.destroy()

      delete this.list[ key ]
    }
    duplicate( key ){
      if( !this.has( key ) ) return

      const duplicateView = new View( this.viewSettings, this.debug )
      duplicateView.mirror( this.get( key ) )

      /**
       * Set this view in global namespace
       */
      this.set( duplicateView )
    }
  }

  class Controls extends Utils {
    constructor( settings, debug = true ){
      super()

      this.debug = debug
      this.settings = settings

      this.$globalBlock = null
    }
    
    /**
     * Enable control actions' event listeners
     */
    enable( viewsManager ){
      if( typeof viewsManager !== 'object' )
        throw new Error('Undefined views manager')

      this.views = viewsManager

      $modela = $(CONTROL_ROOT)

      this.$globalToolbar = $(`${CONTROL_ROOT} [${CONTROL_TOOLBAR_SELECTOR}="global"]`)
      this.$globalBlock = $(`${CONTROL_ROOT} [${CONTROL_BLOCK_SELECTOR}="global"]`)

      // Initialize event listeners
      this.events()
    }

    events(){
      if( !$modela.length || !$root.length ) return
      const self = this

      /**
       * Listen to View components or any editable tag
       */
      const selectors = `${this.settings.viewOnly ? VIEW_IDENTIFIER : '*'}:not([${VIEW_PLACEHOLDER_SELECTOR}])`
      this.settings.hoverSelect ?
                $root.on('mouseover', selectors, this.views.lookup.bind( this.views ) )
                : $root.on('click', selectors, this.views.lookup.bind( this.views ) )

      function onToolbarToggle(){
        const
        $this = $(this),
        /**
         * Lookup the DOM from the main parent perspective
         * make it easier to find different options blocks
         */
        $parent = $this.parents(`[${CONTROL_TOOLBAR_SELECTOR}]`)

        console.log('---- in', $this.attr('toggle') )


        switch( $this.attr('toggle') ){
          // Show extra options
          case 'extra': {
            $parent.find('[options="extra"]').addClass('active')
            $this.hide() // Hide toggle
          } break

          // Show sub options
          case 'sub': {
            $parent.find('[options="sub"]').addClass('active')
            /**
             * Hide the main options to give space to 
             * sub options: Usually long
             */
            $parent.find('[options="main"]').hide()

            // Auto-dismiss extra options if exist
            $parent.find('[options="extra"]').removeClass('active')
            $parent.find('[toggle="extra"]').show() // Restore toggle
          } break
        }
      }

      function onToolbarDismiss(){
        const
        $this = $(this),
        /**
         * Lookup the DOM from the main parent perspective
         * make it easier to find different options blocks
         */
        $parent = $this.parents(`[${CONTROL_TOOLBAR_SELECTOR}]`)

        switch( $this.attr('dismiss') ){
          // Dismiss extra options
          case 'extra': {
            $parent.find('[options="extra"]').removeClass('active')
            $parent.find('[toggle="extra"]').show() // Restore toggle
          } break

          // Dismiss sub options
          case 'sub': {
            $parent.find('[options="sub"]').removeClass('active')
            // Restore main options to default
            $parent.find('[options="main"]').show()
          } break
        }
      }

      function onToolbarShow(){
        const view = self.views.get( $(this).attr( VIEW_KEY_SELECTOR ) )

        // Show toolbar
        view && view.showToolbar()
      }

      function onControlBlockShow(){
        const $this = $(this)
        
        switch( $(this).attr('show') ){
          case 'global': {
            self.$globalToolbar.hide()
            self.$globalBlock.show()
          } break
        }
      }

      function onControlBlockDismiss(){
        const $this = $(this)
        
        switch( $(this).attr('dismiss') ){
          case 'global': {
            self.$globalToolbar.show()
            self.$globalBlock.hide()
          } break
        }
      }

      function onViewStoreShow( e ){
        this.views.add('card', $(e.target).attr( VIEW_KEY_SELECTOR ), true )
      }

      $root
      /**
       * Show extra and sub toolbar options
       */
      .on('click', `[${VIEW_ACTIVE_SELECTOR}]`, onToolbarShow )
      /**
       * Listen to placeholder add-view trigger
       */
      .on('click', `[${VIEW_PLACEHOLDER_SELECTOR}]`, onViewStoreShow )

      /**
       * Show extra and sub toolbar options
       */
      .on('click', `[${CONTROL_TOOLBAR_SELECTOR}] [toggle]`, onToolbarToggle )
      /**
       * Dismiss extra and sub toolbar options
       */
      .on('click', `[${CONTROL_TOOLBAR_SELECTOR}] [dismiss]`, onToolbarDismiss )


      $modela
      /**
       * Show extra and sub toolbar options
       */
      .on('click', `[${CONTROL_TOOLBAR_SELECTOR}] [toggle]`, onToolbarToggle )
      /**
       * Dismiss extra and sub toolbar options
       */
      .on('click', `[${CONTROL_TOOLBAR_SELECTOR}] [dismiss]`, onToolbarDismiss )

      /**
       * Show control blocks
       */
      .on('click', `[${CONTROL_TOOLBAR_SELECTOR}] [show], [${CONTROL_BLOCK_SELECTOR}] [show]`, onControlBlockShow )
      /**
       * Dismiss control blocks
       */
      .on('click', `[${CONTROL_TOOLBAR_SELECTOR}] [dismiss], [${CONTROL_BLOCK_SELECTOR}] [dismiss]`, onControlBlockDismiss )
    }

    destroy(){
      $modela.off()
      $modela.remove()

      $root.off()
    }
  }

  class Modela extends Utils {
    constructor( settings = {}, debug = true ){
      super()

      /**
       * Set editor to debuging more: log editing
       * operations details
       * 
       * Default: false
       */
      this.debug = debug

      /**
       * State set to enable external methods to 
       * respond to API calls or not.
       * 
       * 1. Manually set Modela interface calls off
       * 2. Help avoid unnecessary crashing of Modela 
       *    when it got dismissed but its instance methods 
       *    still get called.
       */
      this.enabled = true

      /**
       * Default language
       */
      this.lang = 'en'

      /**
       * Default editor settings: Crucial in case user
       * want to reset settings to default.
       */
      const defaultSettings = {
        /**
         * Listen to click event on only element that
         * has `.view` class name.
         * 
         * `.view` class name identify view components
         * 
         * Default: Any `html` tag/element editable by modela
         */
        viewOnly: false,

        /**
         * Enable selection of view when overed by a cursor
         * 
         * Default: false
         */
        hoverSelect: false,

        /**
         * Allow placeholder to indicate where to add
         * new views.
         */
        enablePlaceholders: true
      }
      this.settings = { ...defaultSettings, ...settings }

      /**
       * Manage store elements
       * 
       * - view components
       * - templates
       * - etc
       */
      this.store = new StoreManager( this.settings, this.debug )

      /**
       * Manage supported views
       */
      this.views = new ViewsManager( this.settings, this.debug )

      /**
       * Initialize modela controls
       */
      this.controls = new Controls( this.settings, this.debug )

      /**
       * Initialize global styles
       */
      this.styles = new Stylesheet({ nsp: 'global', props: {} }, this.debug )
    }

    render(){
      if( !this.enabled ){
        this.log('Modela functions disabled')
        return
      }
      
      const
      storeBlock = `<div mv-control-block="store">
      </div>`,
      /**
       * 
       */
      storeControl = `<div class="modela-store">
        <span show="store"><i class="bx bx-dots-vertical-rounded"></i></span>

        ${storeBlock}
      </div>`,
      
      /**
       * 
       */
      globalTabs = `<ul options="tabs">
        <li show="global" target="settings"><i class="bx bx-cog"></i></li>
        <li show="global" target="styles"><i class="bx bxs-brush"></i></li>
        <li show="global" target="assets"><i class="bx bx-landscape"></i></li>
        <li dismiss="global"><i class="bx bx-x"></i></li>
      </ul>`,
      globalBody = `<div>

      </div>`,
      globalControlBlock = `<div mv-control-block="global">
        ${globalTabs}
        ${globalBody}
      </div>`,

      globalControl = `<div class="modela-global">
        ${BlockFactory.createToolbar( 'global', GLOBAL_CONTROL_OPTIONS )}
        ${globalControlBlock}
      </div>`

      return `<div id="modela">
        ${storeControl}
        ${globalControl}
      </div>`
    }

    mount( selector ){
      if( !this.enabled ){
        this.log('Modela functions disabled')
        return
      }

      $root = $(`${selector}`)
      if( !$root.length )
        throw new Error(`Root <${selector}> element not found`)
      
      // Process initial content
      const initialContent = $root.html()
      if( initialContent ){

      }
      
      // Add editor controls to root container in the DOM
      $('body').prepend( this.render() )
      // Activate all inert add-view placeholders
      this.setPlaceholders('active')

      // Enable modela controls
      this.controls.enable( this.views )

      $root.prepend( BlockFactory.createPanel('1234567890', {}) )
    }

    propagateUpdate( type, updates, applyOnly = false ){
      if( !this.enabled ){
        this.log('Modela functions disabled')
        return
      }

      /**
       * CSS top level styles application
       * 
       * NOTE: No need to apply this to views
       * directly. The expected effect should be handle 
       * the stylesheet way.
       */
      if( applyOnly ){
        $root.css({})
        return
      }

      // Apply to all active views
      Object
      .values( this.views.list )
      .map( view => view.update( type, updates ) )
    }

    dismiss(){
      if( !this.enabled ){
        this.log('Modela functions disabled')
        return
      }

      // Disable add-view placeholders
      this.setPlaceholders('inert')

      // Clear views meta data
      this.views.clear()
      this.views = null

      // Remove controls
      this.controls.destroy()
      this.controls = null

      // Drop store functions
      this.store.drop()
      this.store = null

      /**
       * Return global definitions and variables
       * to their initial states
       */
      const initials = initialState()

      STORE = initials.STORE
      STYLES = initials.STYLES
      ASSETS = initials.ASSETS

      /**
       * Prevent any other functions still available
       * via API to respond to calls.
       */
      this.enabled = false
    }
  }

  if( !nodeGlobal ) window.Modela = Modela
  else return Modela
}) )