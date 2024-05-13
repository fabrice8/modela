( () => {
  const DefaultViews = {}

  /**
   * Inline view (span) 
   */
  DefaultViews.inline = {
    name: 'inline',
    node: 'span',
    attributes: {},
    styles: {
      predefined: {},
      custom: {
        enabled: true,
        required: [],
        options: [],
        values: {
          ':default': {},
          ':hover': {},
          ':active': {}
        }
      }
    },
    actions: {},
    render(){
      return `<span>Loren upsum</span>`
    },
    apply( e ){
      /**
       * e.type
       * e.dataset
       * e.view
       */
      console.log( e.view.key )

      switch( e.type ){
        case 'view.styles': {
          e.view.$.css( e.dataset )
        } break

        case 'global.styles': {
          e.view.$.css( e.dataset )
        } break


      }
      
    },
    activate(){

    }
  }

  /**
   * Inline view (span) 
   */
  DefaultViews.paragraph = {
    name: 'paragraph',
    node: 'p',
    attributes: {},
    styles: {},
    actions: {}
  },

  /**
   * Inline view (span) 
   */
  DefaultViews.button = {
    name: 'button',
    node: 'button',
    attributes: {},
    styles: {},
    actions: {}
  }

  window.ModelaViewLoader = ( modela, list = [] ) => {
    /**
     * Modela object instance is required to load
     * the views.
     */
    if( !modela
        || !modela.store 
        || typeof modela.store.addComponent !== 'function' )
      return

    // Register default views
    Object
    .values( DefaultViews )
    .map( view => {
      // Load only defined views
      if( Array.isArray( list ) 
          && list.length
          && !list.includes( view.name ) ) return
        
      modela.store.addComponent( view )
    } )
  }
} )()