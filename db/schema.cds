using { cuid, managed, Currency } from '@sap/cds/common';

namespace my.movies;

type Text: String(4000);
type Name: String(255);
type Year: Integer @assert.range: [1995,2025];
type Url: String(2048);

@assert.unique: {
    uniqueEmail: [ email ]
}

entity Users: cuid, managed {
    username: String(60);
    email: String(60) @mandatory @assert.format:'email';
    password: String(255) @mandatory;
    isAdmin: Boolean default false @mandatory;
}

entity Genres: cuid, managed {
    name: localized String(60) @mandatory;
    // descr: localized Text;
}

// entity Roles: cuid, managed {
//     name: localized String(50);
//     descr: localized Text;
// }

entity Movies: cuid, managed {
    title: localized String(100);
    overview: localized Text;
    releaseYear: Year;
    runtimeMin: Integer;
    currency: Currency;
    homepage: Url;
    numReviews: Integer default 0;
    // Relationships -->
    genres: Association to Genres @mandatory;
    ![cast]: array of String;
    reviews: Composition of many Reviews on reviews.movie = $self;
}

entity Reviews: cuid, managed {
    movie: Association to Movies;
    name: Name @mandatory;
    rating: Decimal(2, 1) @mandatory;
    comment: Text;
    user: Association to Users @mandatory;
}



// Many-to-many relationships
// entity MovieGenres {
//     key movie: Association to Movies;
//     key genre: Association to Genres;
// }

// entity Crew: cuid, managed {
//     movie: Association to Movies;
//     role: Association to Roles;   // dir, prod
//     department: String(50);
// }
