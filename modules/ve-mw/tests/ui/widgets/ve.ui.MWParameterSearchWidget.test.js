( function () {

	/**
	 * @param {string[]} knownParameters
	 * @return {ve.dm.MWTemplateModel} but it's a mock
	 */
	function makeTemplateMock( knownParameters ) {
		const spec = {
			getKnownParameterNames: () => knownParameters,
			getParameterLabel: () => '',
			getParameterAliases: () => [],
			getParameterDescription: () => '',
			isParameterDeprecated: () => false
		};
		return {
			connect: () => {},
			getSpec: () => spec,
			hasParameter: () => false
		};
	}

	QUnit.module( 've.ui.MWParameterSearchWidget' );

	QUnit.test( 'Unknown parameter partly matches a known parameter', ( assert ) => {
		const template = makeTemplateMock( [ 'abbreviation' ] ),
			widget = new ve.ui.MWParameterSearchWidget( template );

		widget.query.setValue( 'abbr' );
		widget.addResults();
		const items = widget.results.getItems();

		assert.strictEqual( items.length, 2 );
		assert.strictEqual( items[ 0 ].getData().name, 'abbr' );
		assert.strictEqual( items[ 0 ].getData().description, 'visualeditor-parameter-search-unknown' );
		assert.strictEqual( items[ 1 ].getData().name, 'abbreviation' );
	} );

}() );
