
// basado en https://github.com/ninjaconcept/d3-force-directed-graph/blob/master/code/index.js
export default class d3graph {

  constructor(el, graph) {
    const width = 300;
    const height = 800;
    this.svg =  d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', width)
      .attr('height', height);
    this.linkGroup = this.svg.append('g').attr('class', 'links');
    this.nodeGroup = this.svg.append('g').attr('class', 'nodes');
    this.textGroup = this.svg.append('g').attr('class', 'texts');

    this.linkForce = d3.forceLink()
      .id((link) => { return link.id; })
      .strength((link) => { return link.value; })
      .distance(20);



    this.simulation = d3.forceSimulation()
      .force('link', this.linkForce)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 3));

    this.dragDrop = d3.drag().on('start', (node) => {
      node.fx = node.x;
      node.fy = node.y;
    }).on('drag', (node) => {
      this.simulation.alphaTarget(0.7).restart();
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    }).on('end', (node) => {
      if (!d3.event.active) {
        this.simulation.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
    });

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.updateSimulation(graph);
  }

  updateGraph = (graph) => {
    // links
    this.linkElements = this.linkGroup.selectAll('line').data(graph.links, (link) => { return link.target.id + link.source.id; });
    this.linkElements.exit().remove();

    const linkEnter = this.linkElements.enter().append('line').attr('stroke-width', 1).attr('stroke', 'rgba(50, 50, 50, 0.2)');

    this.linkElements = linkEnter.merge(this.linkElements);

    // nodes
    this.nodeElements = this.nodeGroup.selectAll('circle').data(graph.nodes, (node) => { return node.id; });
    this.nodeElements.exit().remove();

    const nodeEnter = this.nodeElements.enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', (node) => { return this.color(node.group); })
      .call(this.dragDrop);

    this.nodeElements = nodeEnter.merge(this.nodeElements);

    // texts
    this.textElements = this.textGroup.selectAll('text').data(graph.nodes, (node) => { return node.id; });
    this.textElements.exit().remove();

    const textEnter = this.textElements.enter()
      .append('text')
      .text((node) => { return node.id; })
      .attr('font-size', 15)
      .attr('dx', 15)
      .attr('dy', 4);

    this.textElements = textEnter.merge(this.textElements);

  }

  updateSimulation = (graph) => {
    this.updateGraph(graph);

    this.simulation.nodes(graph.nodes).on('tick', () => {
      let k = 25 * this.simulation.alpha();
      this.nodeElements.attr('cx', (node) => { return node.x; }).attr('cy', (node) => { return node.y; });
      this.textElements.attr('x', (node) => { return node.x; }).attr('y', (node) => { return node.y; });

      graph.links.forEach((link) => { link.source.y -= k, link.target.y += k; });
      this.linkElements
        .attr('x1', (link) => { return link.source.x; })
        .attr('y1', (link) => { return link.source.y; })
        .attr('x2', (link) => { return link.target.x; })
        .attr('y2', (link) => { return link.target.y; });
    });
    this.simulation.force('link').links(graph.links);
    this.simulation.restart();
  }
}
/*
d3graph.create = function(el, graph) {
  this.svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', '100%')
      .attr('height', '100%');
  this.color = d3.scaleOrdinal(d3.schemeCategory20);
  this.simulation = d3.forceSimulation()
    .force('link', d3.forceLink()
      .id((d) => { return d.id; })
      .strength((s) => { return d.value }))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(this.svg.attr('width') / 2, this.svg.attr('height') / 2));
  this.update(el, graph);
};

d3graph.update = function(el, graph) {
  console.log(graph);
  let link = this.svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter().append('line')
    .attr('stroke-width', (d) => { return Math.sqrt(d.value); });

  let node = this.svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(graph.nodes)
    .enter().append('circle')
    .attr('r', 10)
    .attr('fill', (d) => { return this.color(d.group); })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.append('h1')
    .text((d) => { return d.id; });

  node.append('title')
    .text((d) => { return d.rank; });

  this.simulation
    .nodes(graph.nodes)
    .on('tick', () => {
      link
        .attr('x1', (d) => { return d.source.x; })
        .attr('y1', (d) => { return d.source.y; })
        .attr('x2', (d) => { return d.target.x; })
        .attr('y2', (d) => { return d.target.y; });
      node
        .attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; });
    });

  this.simulation.force('link')
    .links(graph.links);
};

d3graph.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

function dragstarted(d) {
  if (!d3.event.active) d3graph.simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) d3graph.simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

export default d3graph;
*/
