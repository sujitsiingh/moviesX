sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"movies/test/integration/pages/MoviesList",
	"movies/test/integration/pages/MoviesObjectPage"
], function (JourneyRunner, MoviesList, MoviesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('movies') + '/index.html',
        pages: {
			onTheMoviesList: MoviesList,
			onTheMoviesObjectPage: MoviesObjectPage
        },
        async: true
    });

    return runner;
});

