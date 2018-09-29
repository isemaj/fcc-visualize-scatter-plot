import * as d3 from 'd3';

import '../styles/app.scss';

const api = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const width = 990;
const height = 540;
const padding = 65;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const tooltip = d3.select('#chart')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', .8)


document.addEventListener("DOMContentLoaded", (event) => {
  fetch(api)
    .then(res => res.json())
    .then(data => {

      const actualWidth = +svg.attr('width') - (padding * 2);
      const actualHeight = +svg.attr('height') - (padding * 2);
      const barWidth = actualWidth / data.data.length;

      const years = data.data.map((data) => data[0].substring(0,4))
      const GDP = data.data.map((data) => data[1])


      const minGDP = d3.min(GDP);
      const maxGDP = d3.max(GDP);

      let quarter = (receive) => {
        let dataquarter = data.data[receive][0].substring(5,7)       
        if (dataquarter === '01') {
          return 'Q1'
        }
        else if (dataquarter === '04') {
          return 'Q2'
        }
        else if (dataquarter === '07') {
          return 'Q3'
        }
        else if (dataquarter === '10') {
          return 'Q4'
        }
      }

      let xScale = d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, actualWidth])

      let yScale = d3.scaleLinear()
        .domain([minGDP, maxGDP])
        .range([`${height-padding}`, `${(minGDP/maxGDP) * height + padding}`])

      let xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('d'));

      let yAxis = d3.axisLeft()
        .scale(yScale)

      let barScale = d3.scaleLinear()
        .domain([minGDP, maxGDP])
        .range([(minGDP / maxGDP) * actualHeight, actualHeight])

      let colorRange = d3.scaleLinear()
        .domain([0, GDP.length])
        .range(['#FFC688', '#A57EFF'])

      let scaledGDP = GDP.map((d) => barScale(d));

      svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(${padding}, ${height - padding})`)

      svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)


      d3.select('svg').selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', (d, i) => d[0])
        .attr('data-gdp', (d, i) => d[1])
        .attr('x', (d, i) => i * barWidth + padding)
        .attr('y', (d, i) => (actualHeight - d) + (padding))
        .attr('width', barWidth)
        .attr('height', (d,i) => d)
        .style('fill', (d,i) => colorRange(i))
        .on('mouseover', (d, i) => {
          const quarterYear = quarter(i);
          tooltip.transition()
            .duration(0)
            .style('opacity', .8)
          // tooltip.html(`${quarterYear} $ ${GDP[i]} Billion <br> ${years[i]}`)
          tooltip.html(`${years[i]} ${quarterYear} <br> $ ${GDP[i]} Billion`)
            .style('opacity', 1)
            .style('height', 80)
            .style('width', 150)
            .style('top', actualHeight - 10)
            .style('left', (i * barWidth + (padding * 2)) + 100 )
            .style('color', 'white')
        })
        .on('mouseout', (d) => {
          tooltip.transition()
            .duration(0)
            .style('opacity', 0)
        })

    })
});

