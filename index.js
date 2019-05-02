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
  var padding = 20;

  var stack = d3.stack()
                .keys(["White","Black", "Latino", "Asian", "Other"]);
  //Data, stacked
  var series = stack(dataset);

  //console.log("Normal", dataset);
  console.log("Series",series);

  //Set up scales
  var xScale = d3.scaleBand()
                  .domain(d3.range(dataset.length))
                  .range([0, graphWidth])
                  .paddingInner(.8);

  var yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d) {	return d.White + d.Black + d.Latino + d.Asian + d.Other;})
                  ])
                  .range([graphHeight, 0]);

	var xAxisScale = d3.scaleOrdinal()
                  .domain([d3.min(dataset, function(d) { return d.Year; }),d3.max(dataset, function(d) { return d.Year; })])
                  // .domain(["1990","1991","1992","1993","1994","1995","1996","1997",
                  //           "1998","1999","2000","2001","2002","2003","2004","2005",
                  //         "2006","2007","2008","2009","2010","2011","2012","2013",
                  //       "2014","2015","2016","2017"])
                  .range([0,graphWidth + 27]); // Includes paddingInner

	var yAxisScale = d3.scaleLinear()
              		.domain([0, d3.max(dataset, function(d) {	return d.White + d.Black + d.Latino + d.Asian + d.Other;})             		])
              		.range([graphHeight,2.1]);

  var xAxis = d3.axisBottom()
                .scale(xAxisScale)
                .ticks(28);

  var yAxis = d3.axisLeft()
                .scale(yAxisScale);

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

  var xAxisGraphic = svg.append('g')
                          .attr("class", "axis")
                          .attr("transform","translate("+(margins.left) +"," +(graphHeight)+")")
                          .call(xAxis)
                          .selectAll("text")
                          .style("text-anchor", "end")
                          .attr("dx", "-.8em")
                          .attr("dy", ".15em")
                          .attr("transform", "rotate(-65)" );

  var yAxisGraphic = groups.append("g")
                    .attr("class", "axis")
                    .call(yAxis)
                    .attr("transform", function(){
                    return "translate(" + margins.left + "," + (margins.top - 20) + ")";
                    });
}
