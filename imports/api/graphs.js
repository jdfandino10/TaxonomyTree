import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Graphs = new Mongo.Collection('graphs');
export default Graphs;
/*
graph: {
  id: id del grafo,
  owner: id creador,
  nodes: [] lista de nodos del arbol,
  links: [] lista de enlaces del arbol,
  dateCreated: fecha cracion,
  name: nombre del grafo
}
*/
if (Meteor.isServer) {
  Meteor.publish('graphs', function graphPublication() {
    return Graphs.find({ 'owner': { $eq: this.userId } });
  });
}

Meteor.methods({
  'graphs.newGraph': function newGraph(name, ownerId, nodes, links) {
    check(name, String);
    check(ownerId, String);
    check(nodes, Array);
    check(links, Array);
    const id = new Meteor.Collection.ObjectID().valueOf();
    const owner = ownerId;
    const dateCreated = new Date();
    const graph = { id, owner, nodes, links, dateCreated, name };
    Graphs.insert(graph);
  },
  'graphs.updateGraph': function updateGraph(graphId, name, nodes, links) {
    check(graphId, String);
    check(name, String);
    check(nodes, Array);
    check(links, Array);
    const graph = Graphs.findOne(graphId);
    if (!graph) throw new Meteor.Error('Can\'t update graph', 'Graph couldn\'t be found.');
    if (graph.owner !== this.userId) throw new Meteor.Error('Can\'t update graph', 'You don\'t have permission to modify this graph.');
    Graphs.update(graphId, { $set: { name, nodes, links } });
  },
  'graphs.deleteGraph': function deleteGraph(graphId) {
    check(graphId, String);
    const graph = Graphs.findOne(graphId);
    if (!graph) throw new Meteor.Error('Can\'t update graph', 'Graph couldn\'t be found');
    if (graph.owner !== this.userId) throw new Meteor.Error('Can\'t update graph', 'You don\'t have permission to modify this graph.');
    Graphs.deleteOne(graphId);
  },
});