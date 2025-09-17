using my.movies from '../db/schema';

service CatalogService {
    entity Movies as projection on movies.Movies excluding {
        createdAt, createdBy, modifiedAt, modifiedBy
    };
    entity Genres as projection on movies.Genres excluding {
        createdAt, createdBy, modifiedAt, modifiedBy
    };
    entity Reviews as projection on movies.Reviews;
    entity Users as projection on movies.Users;
}