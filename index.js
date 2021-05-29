
const svg = d3.select('.canvas')
    .append('svg')
        .attr('width',600)
        .attr('height', 600);

//create margin of chart
const margin = {top : 20, right : 20, bottom: 100, left : 100};
const graphWidth = 600 - margin.left - margin.right ; 
const graphHeight = 600 - margin.top - margin.bottom;

// append the svg to chart
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height' , graphHeight)
    .attr('transform' ,`translate(${margin.left}, ${margin.top})`)

//connect firebase
db.collection('menu').get().then(res => {
    var data = [];
    res.docs.forEach(doc => {
        data.push(doc.data());
    });

//Scale the chart height
//connect with json
//d3.json('menu.json').then(data => {
    const y =  d3.scaleLinear()
    .domain([0,d3.max(data, d => d.order)]) // change 1000 to the max value in data
    .range([graphHeight,0]); // frame height\
    
 //Scale the chart width on each bar   
    const x = d3.scaleBand()
    .domain(data.map(item => item.name))
    .range([0,500])
    .paddingInner(0.2)
    .paddingOuter(0.2);
    const min = d3.min(data, d => d.order);
    const max = d3.max(data, d => d.order);
    const extent = d3.extent(data, d => d.order); // make the array
    //console.log(min, max ,extent);



//Create axis 
    const xAxisGroup = graph.append('g')
        .attr('transform',`translate(0,${graphHeight})`);
    const yAxisGroup = graph.append('g');

//console.log(data.map(item => item.name))
// join data to rects
    const rects = graph.selectAll('rect') // change svg to graph
        .data(data)


    rects.attr('width', x.bandwidth)
        .attr('height', d =>  graphHeight - y(d.order)) // hegiht of chart will be hight deduct margin - order scale
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.order))
        ;

    rects.enter()
        .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d.order))
            .attr('fill', 'orange')
            .attr('x',  d => x(d.name))
            .attr('y', d => y(d.order)) // sepecify string point of svg
            ;

// create and call axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
        .ticks(20)
        .tickFormat(d => d + ' orders');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', 'orange');

})

