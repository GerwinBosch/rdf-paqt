/* eslint-disable react/jsx-filename-extension */
import 'jsdom-global/register'; // at the top of file , even  , before importing react
import React from 'react';
import { mount, shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  mount(<App />);
});


it('datastore did mount', () => {
  const wrapper = mount(<App />);
  expect(wrapper.state().store).toBeDefined();
});

it('load data in defaultgraph', (done) => {
  const wrapper = mount(<App />);
  const query = 'INSERT DATA { GRAPH <dataset-uris> {\n' +
      '<http://gerwinbosch.nl> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
      '<http://gerwinbosch.nl> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
      '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/age> "23"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
      '<http://gerwinbosch.nl> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q992"@en .\n' +
      '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/lastName> "Bosch"@en .\n' +
      '<http://gerwinbosch.nl> <http://xmlns.com/foaf/0.1/firstName> "Gerwin"@en .\n' +
      '<http://gerwinbosch.nl/Company> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://vivoweb.org/ontology/core#Company> .\n' +
      '<http://gerwinbosch.nl/Company> <http://www.w3.org/2000/01/rdf-schema#label> "Bosch Programming"@en .\n' +
      '<http://gerwinbosch.nl/Company> <http://www.w3.org/2000/01/rdf-schema#seealso> "asd Programming"@en .\n' +
      '<http://www.toosenhenk.nl/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
      '<http://www.toosenhenk.nl/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
      '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/age> "43"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
      '<http://www.toosenhenk.nl/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q10001"@en .\n' +
      '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/lastName> "Henk"@en .\n' +
      '<http://www.toosenhenk.nl/> <http://xmlns.com/foaf/0.1/firstName> "Toos"@en .\n' +
      '<http://datingforgeeks.tumblr.com/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
      '<http://datingforgeeks.tumblr.com/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
      '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/age> "25"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
      '<http://datingforgeeks.tumblr.com/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q10020"@en .\n' +
      '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/lastName> "Yvon"@en .\n' +
      '<http://datingforgeeks.tumblr.com/> <http://xmlns.com/foaf/0.1/firstName> "Jasper"@en .\n' +
      '<http://dirkjan.nl/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n' +
      '<http://dirkjan.nl/> <http://schema.org/worksFor> <http://gerwinbosch.nl/Company> .\n' +
      '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/age> "39"^^<https://www.w3.org/2001/XMLSchema#integer> .\n' +
      '<http://dirkjan.nl/> <http://dbpedia.org/ontology/birthPlace> "https://www.wikidata.org/wiki/Q803"@en .\n' +
      '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/lastName> "Jan"@en .\n' +
      '<http://dirkjan.nl/> <http://xmlns.com/foaf/0.1/firstName> "Dirk"@en .\n' +
      '}}';
  wrapper.instance().executeSparql(query, () => {
    // Wait until the dataset it is loaded
    console.log('Done loading');
    const queryAll = '' +
        'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
        'PREFIX : <http://example.org/>\n' +
        'SELECT ?s WHERE { GRAPH <dataset-uris> { ?s ?p ?o } }' +
        ' LIMIT 100';
    wrapper.instance().executeSparql(queryAll, (error, result) => {
      expect(result.length).toBe(27);
      done();
    });
  });
});

