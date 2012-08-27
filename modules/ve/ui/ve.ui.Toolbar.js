/**
 * VisualEditor user interface Toolbar class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * Editing toolbar.
 *
 * @class
 * @constructor
 */
ve.ui.Toolbar = function ( $container, surfaceView, config ) {
	// Inheritance TODO: Do we still need it?
	ve.EventEmitter.call( this );
	if ( !surfaceView ) {
		return;
	}

	// Properties
	this.surfaceView = surfaceView;
	this.$ = $container;
	this.$groups = $( '<div class="ve-ui-toolbarGroups"></div>' ).prependTo( this.$ );
	this.tools = [];

	// Update tools on selection and all transactions.
	this.surfaceView.model.on( 'change', ve.bind( this.updateTools, this ) );

	this.config = config || [
		{ 'name': 'history', 'items' : ['undo', 'redo'] },
		{ 'name': 'textStyle', 'items' : ['format'] },
		{ 'name': 'textStyle', 'items' : ['bold', 'italic', 'link', 'clear'] },
		{ 'name': 'list', 'items' : ['number', 'bullet', 'outdent', 'indent'] }
	];
	this.setup();
};

/* Methods */

/**
 * Triggers update events on all tools.
 *
 * @method
 */
ve.ui.Toolbar.prototype.updateTools = function () {
	var model = this.surfaceView.getModel(),
		doc = model.getDocument(),
		annotations,
		nodes = [],
		range = model.getSelection(),
		startNode,
		endNode,
		tool = this,
		i;

	if ( range !== null ) {
		if ( range.from === range.to ) {
			nodes.push( doc.getNodeFromOffset( range.from ) );
		} else {
			startNode = doc.getNodeFromOffset( range.from );
			endNode = doc.getNodeFromOffset ( range.end );

			if(startNode.type === 'document' || endNode.type === 'document') {
				// Clear state
				for ( i = 0; i < this.tools.length; i++ ) {
					this.tools[i].clearState();
				}
				return;
			}

			// These should be different, alas just in case.
			if ( startNode === endNode ) {
				nodes.push( startNode );
			} else {
				model.getDocument().getDocumentNode().traverseLeafNodes( function ( node ) {
					nodes.push( node );
					if( node === endNode ) {
						return false;
					}
				}, startNode );
			}
		}

		if ( range.getLength() > 0 ) {
			annotations = doc.getAnnotationsFromRange( range );
		} else {
			// Clear context
			tool.surfaceView.contextView.clear();
			annotations = doc.getAnnotationsFromOffset(
				doc.getNearestContentOffset( range.start - 1 )
			);
		}
		// Update state
		for ( i = 0; i < this.tools.length; i++ ) {
			this.tools[i].updateState( annotations, nodes );
		}
	} else {
		// Clear state
		for ( i = 0; i < this.tools.length; i++ ) {
			this.tools[i].clearState();
		}
	}
};

ve.ui.Toolbar.prototype.getSurfaceView = function () {
	return this.surfaceView;
};

ve.ui.Toolbar.prototype.setup = function () {
	var i, j, $group, tool, toolDefintion;
	for ( i = 0; i < this.config.length; i++ ) {
		$group = $( '<div>' )
			.addClass( 've-ui-toolbarGroup' )
			.addClass( 've-ui-toolbarGroup-' + this.config[i].name );
		if ( this.config[i].label ) {
			$group.append(
				$( '<div>' ).addClass( 've-ui-toolbarLabel' ).html( this.config[i].label )
			);
		}

		for ( j = 0; j < this.config[i].items.length; j++ ) {
			toolDefintion = ve.ui.Tool.tools[ this.config[i].items[j] ];
			if ( toolDefintion ) {
				tool = new toolDefintion.constructor(
					this, toolDefintion.name, toolDefintion.title, toolDefintion.data
				);
				this.tools.push( tool );
				$group.append( tool.$ );
			}
		}

		this.$groups.append( $group );
	}

};

ve.extendClass( ve.ui.Toolbar, ve.EventEmitter );
