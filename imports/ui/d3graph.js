
// basado en https://github.com/ninjaconcept/d3-force-directed-graph/blob/master/code/index.js
export default class d3graph {

  constructor(el, graph, speciesCallback) {
    const width = el.getBoundingClientRect().width;
    const height = el.getBoundingClientRect().width * 4/5;
    this.svg =  d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', width)
      .attr('height', height);
    this.linkGroup = this.svg.append('g').attr('class', 'links');
    this.nodeGroup = this.svg.append('g').attr('class', 'nodes');
    this.textGroup = this.svg.append('g').attr('class', 'texts');

    this.linkForce = d3.forceLink()
      .id((link) => { return link.id; })
      .strength(1)
      .distance(20);



    this.simulation = d3.forceSimulation()
      .force('link', this.linkForce)
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, 2*height / 3));

    this.startDrag = (node) => {
      node.fx = node.x;
      node.fy = node.y;
    }

    this.continueDrag = (node) => {
      this.simulation.alphaTarget(0.7).restart();
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    }

    this.endDrag = (node) => {
      if (d3.event && !d3.event.active) {
        this.simulation.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
    }

    this.dragDrop = d3.drag().on('start', this.startDrag)
                             .on('drag', this.continueDrag)
                             .on('end', this.endDrag);

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.updateSimulation(graph);
    this.speciesCallback = speciesCallback;
  }

  updateGraph = (graph) => {
    // nodes
    this.nodeElements = this.nodeGroup.selectAll('circle').data(graph.nodes, (node) => { return node.id; });
    this.nodeElements.exit().remove();

    const nodeEnter = this.nodeElements.enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', (node) => { return this.color(node.group); })
      .call(this.dragDrop)
      .call((n) => {
        this.startDrag(n);
        this.simulation.alphaTarget(0.7).restart();
        this.endDrag(n);
      });


    this.nodeElements = nodeEnter.merge(this.nodeElements);

    // links
    this.linkElements = this.linkGroup.selectAll('line').data(graph.links, (link) => { return link.target.id + link.source.id; });
    this.linkElements.exit().remove();

    const linkEnter = this.linkElements.enter().append('line').attr('stroke-width', 1).attr('stroke', 'rgba(50, 50, 50, 0.2)');

    this.linkElements = linkEnter.merge(this.linkElements);

    // texts
    this.textElements = this.textGroup.selectAll('text').data(graph.nodes, (node) => { return node.id; });
    this.textElements.exit().remove();

    const textEnter = this.textElements.enter()
      .append('text')
      .text((node) => { return node.id; })
      .attr('font-size', 10)
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
      this.nodeElements.on('click', (node) => {

        if (node.rank === 'Species' && this.speciesCallback) {
          this.speciesCallback(node.id);
        }
      });
      graph.links.forEach((link) => { link.target.y += k; });
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
