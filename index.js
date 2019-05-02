var dataP = d3.json("formattedData.json");

dataP.then(function(data)
{
  console.log("data",data);

  var screen =
  {
    width: 1000,
    height: 500
  }

  var margins =
  {
    top: 20,
    bottom: 30,
    left: 50,
    right: 100
  }

  dataset = data[0].Players;

  drawChart(dataset,"#chart", screen, margins);

},

function(err)
{
  console.log(err);
});

var drawChart = function(dataset,idName,screen,margins)
{
  console.log("dataset", dataset);

  var graphWidth = screen.width-margins.left-margins.right;
  var graphHeight = screen.height-margins.top-margins.bottom;
  var barWidth = graphWidth/dataset.length;
  var borderWidth = 1;

  var stack = d3.stack()
                .keys(["White","Black", "Latino", "Asian", "Other"]);
  //Data, stacked
  var series = stack(dataset);

  console.log("Normal", dataset);
  console.log("Series",series);

  //Set up scales
	var xScale = d3.scaleBand()
		.domain(d3.range(dataset.length))
		.range([0, graphWidth])
		.paddingInner(.8);

	var yScale = d3.scaleLinear()
		.domain([0,
			d3.max(dataset, function(d) {
				return d.White + d.Black + d.Latino + d.Asian + d.Other;
			})
		])
		.range([graphHeight, 0]);

  var yAxisScale = d3.scaleLinear()
                .domain([0, 100])
                .range([graphHeight, 0]);

  var yAxis = d3.axisLeft().scale(yAxisScale);

  var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickValues([]);

	// Colors
	var colors = d3.scaleOrdinal(d3.schemeCategory10);

  // SVG
	var svg = d3.select(idName)
				.attr("width", screen.width)
				.attr("height", screen.height);

  // Add a group for each row of data
  var groups = svg.selectAll("g")
                  .data(series)
                  .enter()
                  .append("g")
                  .style("fill", function(d,i) { return colors(i)});

// Add a rect for each data value
 var rects = groups.selectAll("rect")
                  .data(function(d) { return d; })
                  .enter()
                  .append('rect')
                  //.attr("width", xScale.bandwidth())
                  .attr("width", barWidth)
                  .attr("height", function(d) { return yScale(d[0])-yScale(d[1]); })
                  .attr("x",function(d,i) { return margins.left + xScale(i); })
                  .attr("y", function(d) { return yScale(d[1]); });

      svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       .text(function(d) { return d.Year;})
       .attr("x",function(d,i) { return xScale(i); })
       .attr("y",function(d) {return graphHeight + 15})
       //.attr("transform", "translate(" )
       .attr("fill", function(d)
          {return "black";})
       //.attr("font-weight", "bold")
  var xAxisGraphic = svg.append('g')
                        .call(xAxis)
                        .attr("transform","translate("+(margins.left) +"," +(graphHeight)+")");

  var yAxisGraphic = svg.append("g")
                    .call(yAxis)
                    .attr("transform", function(){
                    return "translate(" + margins.left + "," + (margins.top - 20) + ")";
                    });

    // graphBorder = svg.append("rect")
    //                   .attr("border-style", "solid")
    //                   .attr("x", margins.left)
    //                   .attr("y", margins.top)
    //                   .attr("width", graphWidth)
    //                   .attr("height", graphHeight + 15)
    //                   .attr("fill", "white")
    //                   .style("stroke", "black")
    //                   .style("stroke-width", borderWidth)
    //                   .classed("graph-border", true);

}
