import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Graphs = new Mongo.Collection('graphs');
export default Graphs;
/*
graph: {
  id: id del grafo,
  owner: id creador,
  p: true si es privado,
  nodes: [] lista de nodos del arbol,
  links: [] lista de enlaces del arbol
}
*/
if (Meteor.isServer) {
  Meteor.publish('graphs', function graphPublication() {
    return Graphs.find({ $or: [
      { 'owner': { $eq: this.userId } },
      { 'p': { $ne: true } }
    ]});
  });
}

Meteor.methods({
  'graphs.newGraph': function newGraph(p = true) {
    check(p, Boolean);
    // TODO
  },
  'graphs.updateGraph': function updateGraph(graphId, nodes, links, p) {
    check(graphId, String);
    check(nodes, Array);
    check(links, Array);
    check(p, Boolean);
    // TODO
  },
  'graphs.deleteGraph': function deleteGraph(graphId) {
    check(graphId, String);
    // TODO
  },
});
