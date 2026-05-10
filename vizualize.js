let showProcessing = (elementId)=>{                   // delay and processing animation deactivated for now
    let parent = document.querySelector(elementId);
    let img = document.createElement('img');
    // img.setAttribute('src', '');
    // img.style.position = 'absolute';
    // img.width = '200';
    // img.style.left = '15%';
    // img.style.top = '15%';
    // parent.appendChild(img);
    return img;
}

function delay() {
  var promise = new Promise(function(resolve, reject) {
    window.setTimeout(function() {
      resolve();
    },0); // delay
  });
  return promise;
}
let clearProcessing = (elem)=>{
  elem.style.display = "none";
}


let Plot_Input = (nnInput, ctx) =>{

  // displaying the proprocessed input in the second box
  let inputLayerCtx = document.getElementById('input_layer_canvas').getContext('2d');
  inputLayerCtx.clearRect(0, 0, canvas.width, canvas.height);

  for (var y = 0; y < 28; y++) {
    for (var x = 0; x < 28; x++) {
      var block = ctx.getImageData(x * 10, y * 10, 10, 10);
      var newVal = 255 * (0.5 - nnInput[x*28+y]/2);
      newVal = 255 - newVal;   // invert greyscale for new color scale; using if-else for the scale
      for (var i = 0; i < 4 * 10 * 10; i+=4) {    // range: '#000','#352f70', '#3347cc', '#2187ff','#00ffff'
        if (newVal < 51){           // block.data represents rgba values of the image
          block.data[i] = 0;
          block.data[i+1] = 0;
          block.data[i+2] = 0;
        }
        else if (newVal < 102) {
          block.data[i] = 53;
          block.data[i+1] = 47;
          block.data[i+2] = 112;
        }
        else if (newVal < 153) {
          block.data[i] = 51;
          block.data[i+1] = 71;
          block.data[i+2] = 204;
        }
        else if (newVal < 204) {
          block.data[i] = 33;
          block.data[i+1] = 135;
          block.data[i+2] = 255;
        }
        else {
          block.data[i] = 0;
          block.data[i+1] = 255;
          block.data[i+2] = 255;
        }
        block.data[i+3] = 230; // opacity = 0.8
      }
      inputLayerCtx.putImageData(block, x*10, y *10);
      //ctx.putImageData(block, x*10, y *10);
    }
  }
}

let Plot = (activations,dim,elementId) => {
     
    document.querySelector(elementId).innerHTML = "";

    activations = activations.map((p,i)=>{
        let s = Math.floor(i/dim)*dim;
        let e = Math.floor((i/dim) + 1 ) * dim;

        return {
            variable: s.toString() +" - " + e.toString(),
            group: Math.floor((i%dim)).toString(),
            value: p.toString()
        }
    })


// set the dimensions and margins of the graph
var margin = {top: 80, right: 25, bottom: 30, left: 40}, // might change
  width = 280,
  height = 280;

// append the svg object to the body of the page
var svg = d3.select(elementId)
.append("svg")
  .attr("width", 280)
  .attr("height", 280)
.append("g")
  .attr("transform",
        "translate(" + 0 + "," + 0 + ")");

//Read the data
let data = activations;

console.log(data)

var myGroups = d3.map(data, function(d){return d.group;}).keys()
  var myVars = d3.map(data, function(d){return d.variable;}).keys()

  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0);
    

  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0);
  

  var myColor = d3.scaleLinear()
    .domain([0,0.25,0.5,0.75,1])
    .range([ '#000','#352f70', '#3347cc', '#2187ff','#00ffff']);


  var tooltip = d3.select(elementId)

  var mouseover = function(d) {}
  var mousemove = function(d) {}
  var mouseleave = function(d) {}

  svg.selectAll()
    .data(data, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.9)
      .style("border","none")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}


// plotting output layer as a vertical vector instead of a square
let Plot_Softmax = (activations,dim,elementId) => {     // l3 is called by: Plot_Softmax(output.slice(0),4,"#layer3");
     
  document.querySelector(elementId).innerHTML = "";

  activations = activations.map((p,i)=>{
      let s = Math.floor(i/dim)*dim;
      let e = Math.floor((i/dim) + 1 ) * dim;

      return {
          variable: s.toString() +" - " + e.toString(),
          group: Math.floor((i%dim)).toString(),
          value: p.toString()
      }
  })

// set the dimensions and margins of the graph
var margin = {top: 80, right: 25, bottom: 30, left: 40}, // might change
width = 28;
height = 280;

// append the svg object to the body of the page
var svg = d3.select(elementId)
.append("svg")
.attr("width", 28)
.attr("height", 280)
.append("g")
.attr("transform",
      "translate(" + 0 + "," + 0 + ")");

//Read the data
let data = activations;

console.log(data)

var myGroups = d3.map(data, function(d){return d.group;}).keys()
var myVars = d3.map(data, function(d){return d.variable;}).keys()

var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0);
  

var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0);


var myColor = d3.scaleLinear()
  .domain([0,0.25,0.5,0.75,1])
  .range([ '#000','#352f70', '#3347cc', '#2187ff','#00ffff']);// original: (['#ed6c72','#e75665', '#e73735', '#d7322f','#d80909']);


var tooltip = d3.select(elementId)

var mouseover = function(d) {}
var mousemove = function(d) {}
var mouseleave = function(d) {}

svg.selectAll()
  .data(data, function(d) {return d.group+':'+d.variable;})
  .enter()
  .append("rect")
    .attr("x", function(d) { return 0 }) //return x(d.group) })
    .attr("y", function(d) { return y(d.variable) })
    .attr("rx", 0)
    .attr("ry", 0)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth())
    .style("fill", function(d) { return myColor(d.value)} )
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity",0.9)
    .style("border","none")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
}
