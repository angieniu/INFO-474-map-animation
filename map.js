
/*
Another way I tried was:
1. change json file to js file through assigning json data to a new variable, such as neighborhoods_json to use as a reference in html and js file.
2. use line generator
// d3's line generator
    const line = d3.line()
      .x(d => albersProjection(d.geometry.coordinates[0])) // set the x values for the line generator
      .y(d => albersProjection(d.geometry.coordinates[1])) // set the y values for the line generator 
    
    // append line to svg
    var path = svg.append("path")
      .datum(points_json.features)
      .attr("d", line) //? data
      .attr("stroke", "darkgrey")
      .attr("stroke-width", "2")
      .attr("fill", "none");

    var totalLength = path.node().getTotalLength();
3. use animation
    // interactivity and animation
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(4000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .on("end", repeat);


The whole version of code is as follows:
<script>
    var width = 700,
      height = 580;

    

    var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

      const g = svg.append('g')

    var neighborhoods = svg.append("g").attr("id", "neighborhoods");

    var albersProjection = d3.geoAlbers()
      .scale(190000)
      .rotate([71.057, 0])
      .center([0, 42.313])
      .translate([width / 2, height / 2]);

    var geoPath = d3.geoPath()
      .projection(albersProjection);

    neighborhoods.selectAll("path")
      .data(neighborhoods_json.features)
      .enter()
      .append("path")
      .attr("d", geoPath);

    var points = svg.append("g").attr("features", "points");

    points.selectAll("path")
      .data(points_json.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("x", function (d) {
        return albersProjection(d.geometry.coordinates)[0] - 30;
      })
      .attr("y", function (d) {
        return albersProjection(d.geometry.coordinates)[1] - 25;
      })
      .attr("width", 60)
      .attr("height", 50);
    //.on( "click", function(){
    //  d3.select(this).remove();
    //});

    // d3's line generator
    const line = d3.line()
      .x(d => albersProjection(d.geometry.coordinates[0])) // set the x values for the line generator
      .y(d => albersProjection(d.geometry.coordinates[1])) // set the y values for the line generator 
    
    // append line to svg
    var path = svg.append("path")
      .datum(points_json.features)
      .attr("d", line) //? data
      .attr("stroke", "darkgrey")
      .attr("stroke-width", "2")
      .attr("fill", "none");

    var totalLength = path.node().getTotalLength();
    
    // interactivity and animation
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(4000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .on("end", repeat);
  </script>
*/
var map = {
    width: 700,
    height: 580
}

var svg = d3.select("body")
    .append('svg')
    .attr('width', map.width)
    .attr('height', map.height)

var g = svg.append('g')

//var neighborhoods = svg.append("g").attr("id", "neighborhoods");

d3.json('neighborhoods.json').then((neighborhoodsdata) => {

    var albersProjection = d3.geoAlbers()
        .scale(190000)
        .rotate([71.057, 0])
        .center([0, 42.313])
        .translate([map.width/2, map.height/2]);

    var geoPath = d3.geoPath()
    .projection(albersProjection);

    

    g.selectAll('path')
    .data(neighborhoodsdata.features)
    .enter()
    .append('path')
        .attr('fill', '#ccc')
        .attr('d', geoPath)
    
    //var points = svg.append("g").attr("features", "points");    
    d3.json('points.json').then((pointsData) => {
        g.selectAll("circle")
        .data(pointsData.features)
            .enter()
            .append("path")
                .attr('class', 'coord')
                .attr('fill', 'purple')
                .attr('d', geoPath)
                .attr("width", 60)
      .attr("height", 50);
        
      // put points to the map with for loop to traverse the data
        var links = [];
        for (let i = 0; i < pointsData.features.length - 1; i++) {
            var start = albersProjection(pointsData.features[i].geometry.coordinates)
            var end = albersProjection(pointsData.features[i + 1].geometry.coordinates)
            links.push({
                type: "LineString",
                coordinates: [
                    [start[0], start[1]],
                    [end[0], end[1]]
                ]
            })
        }
       
        // generate d3's line and append line to svg
        var lines = svg.append('g');
        lines.selectAll('line')
            .data(links)
            .enter()
            .append('line')
                .attr("x1", d=>d.coordinates[0][0])
                .attr("y1", d=>d.coordinates[0][1])
                .attr("x2", d=>d.coordinates[1][0])
                .attr("y2", d=>d.coordinates[1][1])
                .attr("id", function(d, i) { return "line" + i})
                .attr("stroke", "yellow")
                .attr("stroke-width", "2")
      .attr("fill", "none");
      
      
        lines.selectAll('line').style('opacity', 0)
    
    
        d3.selectAll("line").style("opacity", "1")

        // interactivity and animation
        d3.selectAll("line").each(function(d, i) {
            let totalLength = d3.select("#line" + i).node().getTotalLength();
            d3.select("#line" + i)
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1000)
                .delay(220*i)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .style("stroke-width", 3)
                
                
        })

        

    })

    
})
