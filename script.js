var dataG = d3.json("newData.json");

dataG.then(function(data)
{
  console.log("New Data",data);

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

  drawChart2(data,"#chart2", screen, margins);

},

function(err)
{
  console.log(err);
});

var drawChart2 = function(data,idName,screen,margins)
{
  var graphWidth = screen.width-margins.left-margins.right;
  var graphHeight = screen.height-margins.top-margins.bottom;
  var barWidth = graphWidth/data.length;
  var borderWidth = 1;
  var padding = 20;

  // Colors
	var colors = d3.scaleOrdinal(d3.schemeCategory10);

  // SVG
	var svg = d3.select(idName)
				.attr("width", screen.width + margins.left + margins.right)
				.attr("height", screen.height + margins.top + margins.bottom);

  svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({key, value: d[key]})))
      .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", d => color(d.key));

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

}
