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

const tooltip = d3.select("body")
  .append('div')
  .attr('id', 'tooltip')

document.addEventListener("DOMContentLoaded", (event) => {
  fetch(api)
    .then(res => res.json())
    .then(data => {

      const actualWidth = +svg.attr('width') - (padding * 2);
      const actualHeight = +svg.attr('height') - (padding * 2);
      const timeFormat = d3.timeFormat('%M:%S');
      const parseTime = d3.timeParse('%M:%S');
      const minYears = d3.min(data, (d) => d.Year);
      const maxYears = d3.max(data, (d) => d.Year);
      // const minSeconds = d3.min(data, (d) => d.Seconds);
      // const maxSeconds = d3.max(data, (d) => d.Seconds);
      // const minTime = d3.min(data, (d) => parseTime(d.Time);
      const minTime = d3.min(data, (d) => parseTime(d.Time));
      const maxTime = d3.max(data, (d) => parseTime(d.Time));
      // const minTimetoSeconds = new Date().getTime(minTime);
      // const maxTimetoSeconds = new Date().getTime(maxTime);
      const colorOrdinal = d3.scaleOrdinal(d3.schemeSet2); 

      let xScale = d3.scaleLinear()
        .domain([minYears - 1, maxYears + 1])
        .range([padding, width - padding])

      // console.log(d3.extent(data, (d) => d.Seconds))

      let yScale = d3.scaleTime()
        .domain([minTime, maxTime])
        // .domain([minSeconds, maxSeconds])
        .range([padding, height - padding])


      let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))

      let yAxis = d3.axisLeft(yScale)
        .tickFormat(timeFormat)

      svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)

      svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)

      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('id', 'dot')
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => yScale(parseTime(d.Time)))
        .attr('r', 6)
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => d.Time)
        .style('fill', (d) => colorOrdinal(d.Doping != ""))
        .style('opacity', 0.9)
        .on('mouseover', (d,i) => {
          tooltip.html(d.Name + ' (' + d.Nationality + ') ' + '<br>Place: ' + d.Place + '<br>Time: ' + d.Time + ' ' + 'Year: ' + d.Year + (d.Doping ? '<br><br>' + d.Doping : "") )
            .style('left', d3.event.clientX)
            .style('top', d3.event.clientY)
            .style('opacity', .9)
        })
        .on('mouseout', (d) => {
          tooltip.style('opacity', 0)
        })

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .text('Time in Minutes')
        .attr('y', 84)
        .attr('x', -192)

    })
});

