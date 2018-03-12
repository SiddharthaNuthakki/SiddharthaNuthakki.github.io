var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40
    },
    width = 850 - margin.left - margin.right,
    height = 180 - margin.top - margin.bottom;

var y = d3.scale.linear()
    .range([height, 0]);

var x = d3.scale.ordinal()	
		.rangeRoundBands([-50, width], .4);

var xAxisScale = d3.time.scale()//.scale.linear()
	.domain([new Date(2018, 0, 1), new Date(2018, 11, 31)])
    //.domain([Jan, Dec])
    .range([50, width]);

var xAxis = d3.svg.axis()
    .scale(xAxisScale)
    .orient("bottom")
	.ticks(d3.time.months)
	.tickSize(5, 0)
    //.tickFormat(d3.format("d"));
	.tickFormat(d3.time.format("%B"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart1 = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//DstYearMonth1957
d3.csv("DstYearMonth2016.csv", type, function(error, data) {
	//console.log("avg"+isNaN(d.Avg));
	
	
    x.domain(data.map(function(d) {
        console.log("Cal"+d.DstYear);
		return d.DstYear;
    }));
	
    y.domain(d3.extent(data, function(d) {
        console.log("avg"+(d.Tavg));
		return d.Tavg*1.25;
		
    }))	.nice();


    chart1.selectAll(".eachBar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) {
            if (d.Tavg < 0){
                return "eachBar negative";
            } else {
                return "eachBar positive";
            }

        })
        .attr("data-yr", function(d){
            return d.DstYear;
        })
        .attr("data-c", function(d){
            return d.Tavg;
        })
        .attr("title", function(d){
            return (d.DstYear + ": " + d.Tavg)
        })
        .attr("y", function(d) {

            if (d.Tavg > 0){
                return y(d.Tavg);
            } else {
                return y(0);
            }

        })
        .attr("x", function(d) {
            return x(d.DstYear);
        })
        .attr("width", x.rangeBand())
        .attr("height", function(d) {
            return Math.abs(y(d.Tavg) - y(0));
        })
        .on("mouseover", function(d){
            // alert("DstYear: " + d.DstYear + ": " + d.Tavg + " Tavg");
            d3.select("#dstDate")
                .text("Day: " +d.date+","+d.month+" "+d.year);
            d3.select("#dstInfo")
                .text("Dst Index per day->Avg:"+d.Tavg+" Min:"+d.min+" Max:"+d.max);
			
        });

    chart1.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart1.append("g")
        .attr("class", "y axis")
        .append("text")
        .text("Dst Avg")
        .attr("transform", "translate(-30, 40), rotate(-90)")

    chart1.append("g")
        .attr("class", "X axis")
        .attr("transform", "translate(" + (margin.left - 6.5) + "," + height + ")")
        .call(xAxis);

    chart1.append("g")
        .attr("class", "x axis")
        .append("line")
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("x2", width);

    chart1.append("g")
        .attr("class", "dstDetails")
        .attr("transform", "translate(30, 5)")
        .append("text")
        .attr("id", "dstDate");

    chart1.append("g")
        .attr("class", "dstDetails")
        .attr("transform", "translate(170,5)")
        .append("text")
        .attr("id","dstInfo");
	
	//chart.exit().remove();

});


function type(d) {
    d.Tavg = +d.Tavg;
    return d;
}