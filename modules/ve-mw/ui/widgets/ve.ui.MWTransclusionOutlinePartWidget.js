/**
 * Common base class for top-level items (a.k.a. "parts") in the template editor sidebar. Subclasses
 * should exist for all subclasses of {@see ve.dm.MWTransclusionPartModel}:
 * - {@see ve.dm.MWTemplateModel}
 * - {@see ve.dm.MWTemplatePlaceholderModel}
 * - {@see ve.dm.MWTransclusionContentModel}
 *
 * This is inspired by and meant to replace {@see OO.ui.DecoratedOptionWidget} in the context of the
 * template dialog. Also see {@see OO.ui.ButtonWidget} for inspiration.
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config]
 * @cfg {string} [icon='']
 * @cfg {string} [label]
 */
ve.ui.MWTransclusionOutlinePartWidget = function VeUiMWTransclusionOutlinePartWidget( config ) {
	// Parent constructor
	ve.ui.MWTransclusionOutlinePartWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );

	this.$header = $( '<div>' )
		.addClass( 've-ui-mwTransclusionOutlinePartWidget-header' )
		.prepend( this.$icon, this.$label );
	this.$element
		.addClass( 've-ui-mwTransclusionOutlinePartWidget' )
		.prepend( this.$header );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWTransclusionOutlinePartWidget, OO.ui.Widget );
OO.mixinClass( ve.ui.MWTransclusionOutlinePartWidget, OO.ui.mixin.IconElement );
OO.mixinClass( ve.ui.MWTransclusionOutlinePartWidget, OO.ui.mixin.LabelElement );
// TODO: Add OO.ui.mixin.AccessKeyedElement?
// TODO: Add OO.ui.mixin.TitledElement?