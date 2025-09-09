using my.movies from '../db/schema';

service CatalogService {
    entity Movies as projection on movies.Movies excluding {
        createdAt, createdBy, modifiedAt, modifiedBy
    };
    entity Genres as projection on movies.Genres excluding {
        createdAt, createdBy, modifiedAt, modifiedBy
    };
    entity Roles as projection on movies.Roles;
    entity Castings as projection on movies.Castings;
    entity MovieGenres as projection on movies.MovieGenres {
        genre, movie
    }
}