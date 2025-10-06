using { managed, Currency } from '@sap/cds/common';

namespace my.movies;

type Text: String(4000);
type Name: String(255);
type Year: Integer @assert.range: [1995,2025];
type Url: String(2048);

@assert.unique: {
    uniqueEmail: [ email ]
}

entity Users: managed {
    key ID: UUID;
    username: String(60);
    email: String(60) @mandatory;
    password: String(255) @mandatory;
    isAdmin: Boolean default false @mandatory;
}

entity Genres: managed {
    key ID: UUID;
    name: localized String(60);
}


entity Movies: managed {
    key ID: UUID;
    title: localized String(100);
    overview: localized Text;
    releaseYear: Year;
    runtimeMin: Integer;
    currency: Currency;
    homepage: Url;
    numReviews: Integer default 0;
    // Relationships -->
    genres: Association to Genres;
    casting: array of String;
    reviews: Composition of many Reviews on reviews.movie = $self;
}

entity Reviews: managed {
    key ID: UUID;
    movie: Association to Movies;
    name: Name;
    rating: Decimal(2, 1) @mandatory;
    comment: Text;
    user: Association to Users @mandatory;
}
