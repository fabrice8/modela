( () => {
  const DefaultViews = {}

  /**
   * Text view (span) 
   */
  DefaultViews.text = {
    name: 'text',
    node: 'span',
    attributes: {},
    toolbar: [
      { 
        icon: 'bx bx-bold',
        label: false,
        title: 'Bold',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'bold',
          shortcut: 'command + alt + b'
        }
      },
      { 
        icon: 'bx bx-italic',
        label: false,
        title: 'Italic',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'italic',
          shortcut: 'command + alt + i'
        }
      },
      { 
        icon: 'bx bx-underline',
        label: false,
        title: 'Underline',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'underline',
          shortcut: 'command + alt + u'
        }
      },
      {
        icon: 'bx bx-strikethrough',
        label: false,
        title: 'Stike',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'strikethrough',
          shortcut: 'command + alt + s'
        }
      },
      {
        icon: 'bx bx-font-color',
        label: false,
        title: 'Font Color',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'font-color',
          shortcut: 'command + alt + c'
        }
      },
      { 
        icon: 'bx bx-align-justify',
        label: false,
        title: 'Alignment',
        event: {
          type: 'toggle',
          attr: 'sub',
          params: 'alignment'
        },
        sub: [
          {
            icon: 'bx bx-align-left',
            label: false,
            title: 'Align Left',
            event: {
              type: 'action',
              attr: 'align',
              params: 'left'
            }
          },
          {
            icon: 'bx bx-align-middle',
            label: false,
            title: 'Align Center',
            event: {
              type: 'action',
              attr: 'align',
              params: 'center'
            }
          },
          {
            icon: 'bx bx-align-right',
            label: false,
            title: 'Align Right',
            event: {
              type: 'action',
              attr: 'align',
              params: 'right'
            }
          },
          {
            icon: 'bx bx-align-justify',
            label: false,
            title: 'Align Justify',
            event: {
              type: 'action',
              attr: 'align',
              params: 'justify'
            }
          }
        ]
      }
    ],
    styles( global ){
      return {
        predefined: {
          options: [],
          css: `
            min-width: 1.3rem;
            font-size: inherit;
            display: inline-block;
            content: "Loren upsum";
            
            &[mv-active="true"]:not([mv-placeholder]) {
              border-radius: var(--me-placeholder-radius);
              background: var(--me-primary-color-fade);
              transition: var(--me-active-transition);
            }
            &[contenteditable] { outline: none; }
          `
        },
        custom: {
          enabled: true,
          required: [],
          options: [],
          css: `
            font-weight: bold;

            &:active { color: green; }
          `
        }
      }
    },
    render( props, global ){
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
    activate( e, global ){ e.view.attr('contenteditable', true ) },
    dismiss( e, global ){ e.view.removeAttr('contenteditable') },
    actions(){}
  }

  /**
   * Paragraph view (p) 
   */
  DefaultViews.paragraph = {
    name: 'paragraph',
    node: 'p',
    attributes: {},
    toolbar: [
      { 
        icon: 'bx bx-bold',
        label: false,
        title: 'Bold',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'bold',
          shortcut: 'command + alt + b'
        }
      },
      { 
        icon: 'bx bx-italic',
        label: false,
        title: 'Italic',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'italic',
          shortcut: 'command + alt + i'
        }
      },
      { 
        icon: 'bx bx-underline',
        label: false,
        title: 'Underline',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'underline',
          shortcut: 'command + alt + u'
        }
      },
      {
        icon: 'bx bx-strikethrough',
        label: false,
        title: 'Stike',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'strikethrough',
          shortcut: 'command + alt + s'
        }
      },
      {
        icon: 'bx bx-font-color',
        label: false,
        title: 'Font Color',
        event: {
          type: 'action',
          attr: 'apply',
          params: 'font-color',
          shortcut: 'command + alt + c'
        }
      },
      { 
        icon: 'bx bx-align-justify',
        label: false,
        title: 'Alignment',
        event: {
          type: 'toggle',
          attr: 'sub',
          params: 'alignment'
        },
        sub: [
          {
            icon: 'bx bx-align-left',
            label: false,
            title: 'Align Left',
            event: {
              type: 'action',
              attr: 'align',
              params: 'left'
            }
          },
          {
            icon: 'bx bx-align-middle',
            label: false,
            title: 'Align Center',
            event: {
              type: 'action',
              attr: 'align',
              params: 'center'
            }
          },
          {
            icon: 'bx bx-align-right',
            label: false,
            title: 'Align Right',
            event: {
              type: 'action',
              attr: 'align',
              params: 'right'
            }
          },
          {
            icon: 'bx bx-align-justify',
            label: false,
            title: 'Align Justify',
            event: {
              type: 'action',
              attr: 'align',
              params: 'justify'
            }
          }
        ]
      }
    ],
    styles( global ){
      return {
        predefined: {
          options: [],
          css: `
            width: 100%;
            font-size: inherit;
            content: "Loren upsum";

            &[mv-active="true"]:not([mv-placeholder]) {
              background: var(--me-primary-color-fade);
              border-radius: var(--me-placeholder-radius);
              transition: var(--me-active-transition);
            }
            &[contenteditable] { outline: none; }
          `
        },
        custom: {
          enabled: true,
          required: [],
          options: [],
          css: `
            font-weight: italic;

            &:active { color: red; }
          `
        }
      }
    },
    render( props, global ){
      return `<p>Loren upsum</p>`
    },
    activate( e, global ){ e.view.attr('contenteditable', true ) },
    dismiss( e, global ){ e.view.removeAttr('contenteditable') },
    actions(){}
  }

  /**
   * Button view (button) 
   */
  DefaultViews.button = {
    name: 'button',
    node: 'button',
    attributes: {}
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