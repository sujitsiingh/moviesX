using CatalogService as service from '../../srv/catalog-service';
annotate service.Movies with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'overview',
                Value : overview,
            },
            {
                $Type : 'UI.DataField',
                Label : 'releaseYear',
                Value : releaseYear,
            },
            {
                $Type : 'UI.DataField',
                Label : 'runtimeMin',
                Value : runtimeMin,
            },
            {
                $Type : 'UI.DataField',
                Label : 'currency_code',
                Value : currency_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'homepage',
                Value : homepage,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'title',
            Value : title,
        },
        {
            $Type : 'UI.DataField',
            Label : 'overview',
            Value : overview,
        },
        {
            $Type : 'UI.DataField',
            Label : 'releaseYear',
            Value : releaseYear,
        },
        {
            $Type : 'UI.DataField',
            Label : 'runtimeMin',
            Value : runtimeMin,
        },
        {
            $Type : 'UI.DataField',
            Label : 'currency_code',
            Value : currency_code,
        },
    ],
);

