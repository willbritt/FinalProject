var dataP = d3.json("formattedData.json");

var screen =
{
  width: 600,
  height: 400
}

var margins =
{
  top: 40,
  bottom: 30,
  left: 50,
  right: 100
}

dataP.then(function(data)
{
  console.log("data",data);

  datasetP = data[0].NBA.Players;
  datasetO = data[0].NBA.Owners;
  datasetC = data[0].NBA.Coaches;
  datasetP2 = data[1].NFL.Players;
  datasetC2 = data[1].NFL.Coaches;
  datasetO2 = data[1].NFL.Admin;
  datasetP3 = data[2].MLB.Players;
  datasetC3 = data[2].MLB.Managers;
  datasetO3 = data[2].MLB.Owners;

  formattedData = [data[0].Players, data[0].Owners, data[0].Coaches]
  //console.log("formatted data", formattedData);
},

function(err)
{
  console.log(err);
});

var drawChart = function(dataset,idName,screen,margins,title)
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

  //Data,series
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
                  // .domain([1990,1991,1992,1993,1994,1995,1996,1997,
                  //           1998,1999,2000,2001,2002,2003,2004,2005,
                  //         2006,2007,2008,2009,2010,2011,2012,2013,
                  //       2014,2015,2016,2017])
                  .range([0,graphWidth + dataset.length]); // Includes paddingInner

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
				.attr("width", screen.width + margins.left + margins.right)
				.attr("height", screen.height + margins.top + margins.bottom);

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
                  .attr("width", barWidth)
                  .attr("height", function(d) { return yScale(d[0])-yScale(d[1]); })
                  .attr("x",function(d,i) { return margins.left + xScale(i); })
                  .attr("y", function(d) { return margins.top + yScale(d[1]); })
                  .append("title")
                  .text(function (d,i){ return "Year: " + (1990 + i) + " Value: " + (d[1]-d[0]) + "%";});

  var xAxisGraphic = svg.append('g')
                          .attr("class", "axis")
                          .attr("transform","translate("+(margins.left) +"," +(margins.top + graphHeight)+")")
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
                    return "translate(" + margins.left + "," + (margins.top) + ")";
                    });

  var chartTitle = groups.append("text")
                      .attr("x", (graphWidth / 2))
                      .attr("y", ((margins.top/2) + 5))
                      .attr("text-anchor", "middle")
                      .style("font-size", "24px")
                      .style("text-decoration", "underline")
                      .style("fill", "Black")
                      .text(title);

  //Tooltip
  toolTip = d3.select("#tooltip");

  rects.on("mouseover", function(d){
          var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
          var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + graphHeight / 2;

  toolTip.style("left", xPosition + "px")
          .style("top", yPosition + "px")
          .classed("hidden", false);
          document.getElementById("tooltip-name").innerText = d.Year;
          document.getElementById("tooltip-value").innerText = yScale(d[0])-yScale(d[1]);
        })
        .on("mouseout", function() {
          toolTip.classed("hidden", true);
        })
        
  // legend
  var legendLineWidth = 10;
  var legendLineHeight = 16;
  var legendLineMargin = 5;
  var legendColorBarWidth = 30;

  var legend = d3.select(idName)
                 .append("g")
                 .attr("font-size", 15)
                 .attr("transform", "translate(" + (graphWidth + margins.left + 10) + ",0)")
                 .classed("legend", true);

  var keys = ["White", "Black", "Latino", "Asian","Other"]

   var legendLines = legend.selectAll("g")
                            .data(keys)
                            .enter()
                            .append("g")
                            .classed("legend-line", true);

        legendLines.append("rect")
                    .attr("x", 50)
                    .attr("y", function(d,i){return i*legendLineHeight + i*legendLineMargin + 30})
                    .attr("width", legendColorBarWidth)
                    .attr("height", legendLineHeight)
                    .style("fill", function(d,i) { return colors(i)})

        legendLines.append("text")
                    .text(function(d){return d;})
                    .attr("x", legendColorBarWidth + 55)
                    .attr("y", function(d, i){return i*legendLineHeight + i*legendLineMargin + 43})
                    .attr("font-size", legendLineHeight)
  }

//Event handlers defined here
var initEventListeners = function(){

  //Players button
    d3.select("#NBA")
      .on("click", function(d){
        console.log("NBA button clicked");
        dataP.then(function(data)
        {
            d3.selectAll("svg > *").remove();
            var dataset = data[0].NBA.Players;
            drawChart(dataset,"#chart1", screen, margins, "NBA Players");
            var dataset = data[0].NBA.Coaches;
            drawChart(dataset,"#chart2", screen, margins, "NBA Head Coaches");
            var dataset = data[0].NBA.Owners;
            drawChart(dataset,"#chart3", screen, margins, "NBA Majority Owners");
        });
      });

  //Coaches button
    d3.select("#NFL")
      .on("click", function(d){
        console.log("Coaches button clicked");
        dataP.then(function(data)
        {
          d3.selectAll("svg > *").remove();
          var dataset = data[1].NFL.Players;
          drawChart(dataset,"#chart1", screen, margins, "NFL Players");
          var dataset = data[1].NFL.Coaches;
          drawChart(dataset,"#chart2", screen, margins, "NFL Head Coaches");
          var dataset = data[1].NFL.Admin;
          drawChart(dataset,"#chart3", screen, margins, "NFL Team Administration");
        });
      });

    //Owners button
      d3.select("#MLB")
        .on("click", function(d){
          console.log("Owners button clicked");
          dataP.then(function(data)
          {
            d3.selectAll("svg > *").remove();
            var dataset = data[2].MLB.Players;
            drawChart(dataset,"#chart1", screen, margins, "MLB Players");
            var dataset = data[2].MLB.Managers;
            drawChart(dataset,"#chart2", screen, margins, "MLB Managers");
            var dataset = data[2].MLB.Owners;
            drawChart(dataset,"#chart3", screen, margins, "MLB Majority Owners");
          });
        });
}

var initGraph = function(){
  dataP.then(function(data)
  {
      drawChart(datasetP,"#chart1", screen, margins, "NBA Players");
      drawChart(datasetC,"#chart2", screen, margins, "NBA Head Coaches");
      drawChart(datasetO,"#chart3", screen, margins, "NBA Majority Owners");
      initEventListeners();
  });
}
initGraph();
