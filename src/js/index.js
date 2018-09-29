import * as d3 from 'd3';

import '../styles/app.scss';

const api = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 990;
const height = 540;
const padding = 65;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

document.addEventListener("DOMContentLoaded", (event) => {
  fetch(api)
    .then(res => res.json())
    .then(data => {

      console.log(data);

      const actualWidth = +svg.attr('width') - (padding * 2);
      const actualHeight = +svg.attr('height') - (padding * 2);
      const timeFormat = d3.timeFormat('%M:%S');
      const minYears = d3.min(data, (d) => d.Year);
      const maxYears = d3.max(data, (d) => d.Year);
      const minSeconds = d3.min(data, (d) => d.Seconds);
      const maxSeconds = d3.max(data, (d) => d.Seconds);

      let xScale = d3.scaleLinear()
        .domain([minYears, maxYears])
        .range([0, actualWidth])

      let yScale = d3.scaleTime()
        .domain([minSeconds, maxSeconds])
        .range([actualHeight, 0])


      let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))

      let yAxis = d3.axisLeft(yScale)
        .tickFormat(timeFormat)

      svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(${padding}, ${height - padding})`)

      svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, ${padding})`)

    })
});

