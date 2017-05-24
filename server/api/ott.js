import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


const ott = 'https://api.opentreeoflife.org/v3/tnrs/match_names';
const lineage = 'https://api.opentreeoflife.org/v3/taxonomy/taxon_info';

// acá conexiones con apis
Meteor.methods({
	'api.getSpeciesId': function getSpeciesId(name) {
		check(name, String);
    let data = {
        'do_approximate_matching': false,
        'names': [name]
    };
    try{
      let req = Meteor.http.call('POST', ott, { data });
      if (req.data.results[0].matches[0].taxon.rank !== 'species') {
        throw new Meteor.Error('The given name isn\'t a species');
      }
      return { 
        id: req.data.results[0].matches[0].taxon.ott_id,
        unique_name: req.data.results[0].matches[0].taxon.unique_name
      };
    } catch (e) {
      console.log('error: '+e);
      throw new Meteor.Error('Cant\'t find that species (species name: '+name+')');
    }
	},
	'api.getLineageFromId': function getLineageFromId(speciesId) {
		check(speciesId, Number);
    let data = {
        ott_id: speciesId,
        include_lineage: true,
    }
    try{
      let req = Meteor.http.call('POST', lineage, { data });
      return req.data.lineage;
    } catch (e) {
      console.log('error: '+e);
      throw new Meteor.Error('Cant\'t find that species lineage (species id: '+speciesId+')');
    }
	},
	'api.getSpeciesInfo': function getSpeciesInfo(name) {
		check(name, String);
		// TODO
	},
	
});
