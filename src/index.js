let
/**
 * Number of views identified by modela: Value
 * increase when a view instance is created
 */
NODES_COUNT = 0

const
/**
 * Common selector use to identify view elements
 * in the DOM.
 * 
 * Could be `classname` or `tagname` or `data-*`
 */
VIEW_IDENTIFIER = '.view',

VIEW_KEY_SELECTOR = 'modela-key',
VIEW_NAME_SELECTOR = 'modela-view',

VIEW_ACTIVE_SELECTOR = 'mv-active',
VIEW_CAPTION_SELECTOR = 'mv-caption',
VIEW_PLACEHOLDER_SELECTOR = 'mv-placeholder',
VIEW_TYPES_ALLOWED_SELECTOR = 'mv-types-allowed',

/**
 * Control layer element selector
 * 
 * NOTE: Only custom attributes
 */
CONTROL_PANEL_SELECTOR = 'mv-control-panel',
CONTROL_BLOCK_SELECTOR = 'mv-control-block',

/**
 * List of native views supported by modela
 * and there default specs.
 */
STORE = {
  components: {},
  templates: {}
},

/**
 * Global style settings
 */
GLOBAL_STYLES = {
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
},

/**
 * Global assets store
 */
GLOBAL_ASSETS = {}

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
  define( props ){
    if( typeof props !== 'object'
        || !Object.keys( props ).length )
      throw new Error('Invalid props. Non-empty object expected')

    return `<!--${JSON.stringify( props )}-->`
  }
  /**
   * Extract defined view block props from HTML comment
   * format to object.
   */
  extract( element ){
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
   * Create common placeholder block
   */
  createPlaceholder(){
    if( !this.settings.enablePlaceholders ) return ''
    return `<div ${VIEW_PLACEHOLDER_SELECTOR}="active" data-${VIEW_KEY_SELECTOR}="${this.generateKey()}"></div>`
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
    const isMounted = this.$.data( VIEW_KEY_SELECTOR ) !== undefined
    if( !isMounted ){
      /**
       * Generate and assign view tracking key
       */
      this.key = this.generateKey()

      this.$.data({
        [VIEW_KEY_SELECTOR]: this.key, // Set view key
        [VIEW_NAME_SELECTOR]: name // Set view node name identify
      })
      
      // Set view specifications
      this.setSpecs( STORE.components[ name ] )
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
    const $to = $(`[data-${VIEW_KEY_SELECTOR}="${to}"]`)
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
    this.element = specs.render( specs, {
      styles: GLOBAL_STYLES,
      assets: GLOBAL_ASSETS,
      i18n: this.i18n.bind(this),
      define: this.define.bind(this)
    })
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

    this.$.data({
      [VIEW_KEY_SELECTOR]: this.key, // Set view key
      [VIEW_NAME_SELECTOR]: specs.name // Set view node name identify
    })

    /**
     * Extract defined view blocks props
     */
    const renderingProps = this.extract( this.element )
    this.inject( renderingProps )

    // Set view specifications
    this.setSpecs( specs )
    // Auto-trigger mounted view
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
    this.$.data( VIEW_KEY_SELECTOR, this.key )

    // Clone view specifications
    this.setSpecs( viewInstance.getSpecs() )
  }

  setSpecs( values ){
    this.specs = { ...this.specs, ...values }
    this.log('specs - ', this.specs )
  }
  getSpecs( type ){
    return type ? this.specs[ type ] : this.specs
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

    this.$ = null
    this.key = null
    this.specs = null
    this.$parent = null
  }
  
  trigger(){
    if( !this.key ) return

    const position = this.getTopography( this.$ )
    this.log('trigger view', position )

    /**
     * Highlight triggered view: Delay due to 
     * pre-unhighlight effect.
     */
    setTimeout( () => this.$.attr( VIEW_ACTIVE_SELECTOR, true ), 200 )
  }
  triggerParent(){
    if( !this.key ) return
    
    const position = this.getTopography( this.$parent )
    this.log('trigger parent view', position )
  }
  dismiss(){

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
    const
    $currentTarget = $(e.currentTarget),
    name = $currentTarget.data( VIEW_NAME_SELECTOR )
            || $currentTarget.prop('nodeName').toLowerCase(),
    /**
     * Get views specs by view-name or view's node-name
     * 
     * NOTE: Views are registered with their canonical
     * name not by nodeName.
     */
    specs = STORE.components[ name ] || Object.values( STORE.components ).filter( each => (each.node == name) )[0]

    if( !specs || this.currentView && e.currentTarget == this.currentView.element )
      return
    
    // Unhighlight triggered views
    $(`[${VIEW_ACTIVE_SELECTOR}]`).removeAttr( VIEW_ACTIVE_SELECTOR )

    /**
     * Inspect view
     */
    this.currentView = $currentTarget.data( VIEW_KEY_SELECTOR ) ?
                                    this.get( $currentTarget.data( VIEW_KEY_SELECTOR ) )
                                    : new View( this.viewSettings, this.debug )
    this.currentView.inspect( e.currentTarget, name )

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

    this.$root = null
    this.$globalBlock = null
  }
  
  /**
   * Enable control actions' event listeners
   */
  enable( $root, viewsManager ){
    if( !$root.length )
      throw new Error('Undefined $root element')
    
    if( typeof viewsManager !== 'object' )
      throw new Error('Undefined views manager')

    this.views = viewsManager

    this.$root = $root
    this.$globalBlock = this.$root.find(`[${CONTROL_BLOCK_SELECTOR}]`)

    // Initialize event listeners
    this.events()
  }

  events(){
    if( !this.$root.length ) return
    const self = this

    /**
     * Listen to View components or any editable tag
     */
    const selectors = `${this.settings.viewOnly ? VIEW_IDENTIFIER : '*'}:not([${VIEW_PLACEHOLDER_SELECTOR}])`
    this.settings.hoverSelect ?
              this.$root.on('mouseover', selectors, this.views.lookup.bind( this.views ) )
              : this.$root.on('click', selectors, this.views.lookup.bind( this.views ) )

    
    this.$root

    /**
     * Listen to placeholder add-view trigger
     */
    .on('click', `[${VIEW_PLACEHOLDER_SELECTOR}]`, e => {
      this.views.add('card', $(e.target).attr(`data-${VIEW_KEY_SELECTOR}`), true )
    } )

    /**
     * Show extra and sub panel options
     */
    .on('click', `[${CONTROL_PANEL_SELECTOR}] [toggle]`, function(){
      const
      $this = $(this),
      /**
       * Lookup the DOM from the main parent perspective
       * make it easier to find different options blocks
       */
      $parent = $this.parents(`[${CONTROL_PANEL_SELECTOR}]`)

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
    })

    /**
     * Dismiss extra and sub panel options
     */
    .on('click', `[${CONTROL_PANEL_SELECTOR}] [dismiss]`, function(){
      const
      $this = $(this),
      /**
       * Lookup the DOM from the main parent perspective
       * make it easier to find different options blocks
       */
      $parent = $this.parents(`[${CONTROL_PANEL_SELECTOR}]`)

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
    })

    .on('click', `[${CONTROL_PANEL_SELECTOR}] [show], [${CONTROL_BLOCK_SELECTOR}] [show]`, function(){
      const $this = $(this)
      
      switch( $(this).attr('show') ){
        case 'global': {
          self.$globalBlock.show()
        } break
      }
    })

    .on('click', `[${CONTROL_PANEL_SELECTOR}] [dismiss], [${CONTROL_BLOCK_SELECTOR}] [dismiss]`, function(){
      const $this = $(this)
      
      switch( $(this).attr('dismiss') ){
        case 'global': self.$globalBlock.hide(); break
      }
    })
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
     * Default language
     */
    this.lang = 'en',

    /**
     * JQuery element of the root container of the
     * editor.
     * 
     * Default: null
     */
    this.$root = null

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
  }

  render(){
    const 
    /**
     * 
     */
    storeControl = `<div class="--modela-store">
      <i class="bx bx-dots-vertical-rounded"></i>
    </div>`,
    
    /**
     * 
     */
    globalsTabs = `<ul options="tabs">
      <li show="global" target="settings"><i class="bx bx-cog"></i></li>
      <li show="global" target="styles"><i class="bx bxs-brush"></i></li>
      <li show="global" target="assets"><i class="bx bx-landscape"></i></li>
      <li dismiss="global"><i class="bx bx-x"></i></li>
    </ul>`,
    globalsBody = `<div>
      Hello there!
    </div>`,
    globalsControlBlock = `<div mv-control-block="globals">
      ${globalsTabs}
      ${globalsBody}
    </div>`,

    globalsControl = `<div class="--modela-globals">
      <ul mv-control-panel="globals">
        <div options="main">
          <li action="undo" class="disabled"><i class="bx bx-undo"></i></li>
          <li action="redo" class="disabled"><i class="bx bx-redo"></i></li>
          <li toggle="sub"><i class="bx bx-devices"></i></li>
          <li show="global" target="settings"><i class="bx bx-cog"></i></li>
          <li toggle="extra"><i class="bx bx-dots-horizontal-rounded"></i></li>
        </div>

        <div options="extra">
          <li show="global" target="styles"><i class="bx bxs-brush"></i></li>
          <li show="global" target="assets"><i class="bx bx-landscape"></i></li>
          <li dismiss="extra"><i class="bx bx-chevron-left"></i></li>
        </div>

        <div options="sub">
          <li action="screen-mode" params="mobile"><i class="bx bx-mobile-alt"></i></li>
          <li action="screen-mode" params="tablet"><i class="bx bx-desktop"></i></li>
          <li action="screen-mode" params="desktop"><i class="bx bx-tv"></i></li>
          <li dismiss="sub"><i class="bx bx-x"></i></li>
        </div>
      </ul>

      ${globalsControlBlock}
    </div>`

    return `<div class="modela">
      ${storeControl}
      ${globalsControl}
    </div>`
  }

  mount( id ){
    this.$root = $(`#${id}`)
    if( !this.$root.length )
      throw new Error(`Root <#${id}> element not found`)
    
    // Process initial content
    const initialContent = this.$root.html()
    if( initialContent ){

    }
    
    // Add editor controls to root container in the DOM
    this.$root.prepend( this.render() )
    // Activate all inert add-view placeholders
    this.setPlaceholders('active')

    // Enable modela controls
    this.controls.enable( this.$root, this.views )
  }

  propagateUpdate( type, updates, applyOnly = false ){
    /**
     * CSS top level styles application
     * 
     * NOTE: No need to apply this to views
     * directly. The expected effect should be handle 
     * the stylesheet way.
     */
    if( applyOnly ){
      this.$root.css({})
      return
    }

    // Apply to all active views
    Object
    .values( this.views.list )
    .map( view => view.update( type, updates ) )
  }

  dismiss(){
    // Disable add-view placeholders
    this.setPlaceholders('inert')


  }
}