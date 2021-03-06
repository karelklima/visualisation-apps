export const select = ({ graph }) => `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <http://schema.org/>
PREFIX dct: <http://purl.org/dc/terms/>
CONSTRUCT {
  ?resource
    a ?type ;
    dct:title ?title ;
    dct:date ?date ;
    schema:startDate ?startDate ;
    schema:endDate ?endDate .
}
FROM <${graph}>
WHERE {
  SELECT ?resource ?title ?startDate ?endDate ?date ?type
  WHERE {
    {
      ?resource
        schema:startDate ?startDate ;
        schema:endDate ?endDate .
    }
    UNION
    {
      ?resource dct:date ?date .
    }
    OPTIONAL {
      ?resource dct:title ?title .
    }
    OPTIONAL {
      ?original
        ?x ?resource ;
        a ?type .
    }
  }
  LIMIT 10000
}
`;

export const context = {
  '@context': {
    //dct: 'http://purl.org/dc/terms/',
    //schema: 'http://schema.org/'
  }
};
