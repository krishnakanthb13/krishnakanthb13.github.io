// Initialize Vue app
const app = new Vue({
  el: '#app',
  data: {
    resumeData: { /* Your resume JSON data */ }
  },
  mounted() {
    // D3.js code for rendering the mind map
    // Example structure, you'll need to adapt this based on your resume JSON
    const svg = d3.select('#app').append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    const nodes = svg.selectAll('circle')
      .data(['Skills', 'Experience', 'Education']) // Example top-level nodes
      .enter().append('circle')
      .attr('cx', (d, i) => 100 * (i + 1))
      .attr('cy', 100)
      .attr('r', 50)
      .style('fill', '#65a30d')
      .on('click', d => {
        // Handle click event (expand node or show details)
        console.log('Clicked on node:', d);
      });

    nodes.append('title').text(d => d);
  }
});
