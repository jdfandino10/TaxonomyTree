/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off"*/
/* eslint func-names: "off"*/
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/
/* eslint "import/no-unresolved": [0]*/
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Graphs } from '../api/graphs.js';

if (Meteor.isServer) {
  describe('Graphs', function () {
    const userId = Random.id();
    const username = 'user1';
    beforeEach(function () {
      resetDatabase();
    });

    function create(name, ownerId, nodes, links) {
      const createGraph = Meteor.server.method_handlers['graphs.newGraph'];
      const invocation = { userId, username };
      createGraph.apply(invocation, [name, ownerId, nodes, links]);
    }

    function update(graphId, name, nodes, links) {
      const updateGraph = Meteor.server.method_handlers['graphs.updateGraph'];
      const invocation = { userId, username };
      updateGraph.apply(invocation, [graphId, name, nodes, links]);
    }

    function deleteGraph(graphId) {
      const deleteGraph = Meteor.server.method_handlers['graphs.deleteGraph'];
      const invocation = { userId, username };
      deleteGraph.apply(invocation, [graphId]);
    }

    it('can create a graph', function () {
      create('test_graph', userId, [{ id: 'Life', rank: 'Life', group: 0 }], []);
      assert.equal(Graphs.find({ $and: [
        { name: 'test_graph' },
        { owner: userId },
        { nodes: [{ id: 'Life', rank: 'Life', group: 0 }] },
        { links: [] }
      ] }).count(), 1);
    });

    it('can update a graph', function () {
      create('test_graph', userId, [{ id: 'Life', rank: 'Life', group: 0 }], []);
      let id = Graphs.find({ owner: userId }).fetch()[0]._id;
      update(id, 'new_name', [], []);
      assert.equal(Graphs.find({ $and: [
        { name: 'new_name' },
        { owner: userId },
        { nodes: [] },
        { links: [] }
      ] }).count(), 1);
    });

    it('can delete a graph', function () {
      create('test_graph', userId, [{ id: 'Life', rank: 'Life', group: 0 }], []);
      let id = Graphs.find({ owner: userId }).fetch()[0]._id;
      deleteGraph(id);
      const g = Graphs.find({ owner: userId});
      assert.equal(g.count(), 0);
    });

  });
}
