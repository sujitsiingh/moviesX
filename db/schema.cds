using { cuid, managed, Currency } from '@sap/cds/common';

namespace my.movies;

type Text: String(4000);
type Name: String(255);
type Year: Integer @assert.range: [1995,2025];
type Url: String(2048);

entity Roles: cuid, managed {
    name: localized String(50);
    descr: localized Text;
}

entity Movies: managed {
    key ID: UUID;
    title: localized String(100);
    overview: localized Text;
    releaseYear: Year;
    runtimeMin: Integer;
    currency: Currency;
    homepage: Url;
    // Relationships -->
    castings: Composition of many Castings on castings.movie = $self;
    genres: Association to many MovieGenres on genres.movie = $self;
    crew: Association to many Crew on crew.movie = $self;
}

entity Castings: cuid, managed {
    movie: Association to Movies;
    role: Association to Roles;
    characterName: String(150);
}

entity Genres: managed {
    key ID: UUID;
    name: localized String(60);
    descr: localized Text;
}

// Many-to-many relationships
entity MovieGenres {
    key movie: Association to Movies;
    key genre: Association to Genres;
}

entity Crew: cuid, managed {
    movie: Association to Movies;
    role: Association to Roles;   // dir, prod
    department: String(50);
}
