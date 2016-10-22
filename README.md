<style>
img[alt=Network Visualization Example] { width: 400px; }
</style>

# Network Visualization for HTML Canvas

![Network Visualization Example](https://github.com/greenstick/d3-canvas-network/blob/master/img/network-example.png)

### Introduction
A quick, simple JavaScript prototype for visualizing network data using [D3.js](http://d3js.org) and the HTML Canvas API. 

Features include:
* Node sizing and by degree
* Node coloring by degree
* Edge coloring by weight
* Fast rendering with GPU via Canvas API (able to handle 1000+ nodes and 5000+ edges)


### Examples
No arguments are required; to see a randomly generated netowrk call the network and pass an empty arguments object:
```
var network = new Network({});
```

To see an example, clone the repository and open index.html in your browser.

More practically, customize the layout of your network. For example:
```
var network = new Network({
    /*
    Data Arguments
    */

    // Data - Same Format as D3
    nodeData        : [
        {label: 0},
        {label: 1},
        {label: 2},
        {label: 3},
        {label: 4},
        {label: 5},
        {labe": 6},
        {label: 7},
        {label: 8},
        {label: 9}
    ],
    linkData        : [
        {source: 0, target: 3, weight: 0.8},
        {source: 0, target: 2, weight: 0.3},
        {source: 0, target: 7, weight: 0.7},
        {source: 0, target: 8, weight: 0.5},
        {source: 1, target: 3, weight: 0.3},
        {source: 2, target: 4, weight: 0.9},
        {source: 3, target: 9, weight: 0.1},
        {source: 4, target: 3, weight: 0.1},
        {source: 9, target: 2, weight: 0.4}
    ],

    /*
    Default Values For Prototype Properties Below
    */

    // DOM Arguments
    targetElement   : "body",
    graphID         : "#graph",
    width           : window.innerWidth,
    height          : window.innerHeight,
    nodeClass       : ".node",
    linkClass       : ".link",
    // Styling Arguments
    nodeColors      : ["rgb(1,23,29)", "rgb(4,38,47)", "rgb(9,53,65)", "rgb(16,69,82)", "rgb(26,85,100)", "rgb(37,101,118)", "rgb(50,118,136)", "rgb(65,135,154)", "rgb(82,153,172)", "rgb(100,171,190)", "rgb(121,190,207)", "rgb(144,209,225)", "rgb(169,228,243)"],
    nodeBorders     : ["rgb(1,23,29)", "rgb(4,38,47)", "rgb(9,53,65)", "rgb(16,69,82)", "rgb(26,85,100)", "rgb(37,101,118)", "rgb(50,118,136)", "rgb(65,135,154)", "rgb(82,153,172)", "rgb(100,171,190)", "rgb(121,190,207)", "rgb(144,209,225)", "rgb(169,228,243)"],
    linkColors      : ["rgba(68, 20, 0, 0.3)", "rgba(108, 32, 0, 0.4)", "rgba(148, 44, 0, 0.5)", "rgba(204, 68, 0, 0.6)", "rgba(250, 83, 0, 0.7)"],
    nodeSizing      : 5,
    // Transition Arguments
    transition      : "linear",
    duration        : 1000,
    // Force Layout Arguments
    gravity         : 1.9,
    charge          : -1700,
    linkDistance    : 60,
    // Canvas Arguments
    contextType     : "2d",
    smoothImage     : true,
    // Prototype Arguments
    autoInit        : true,
    randomGen       : true,
    graph.randomK   : 160
}
});
```

### Contributing
Pull resquests and issues welcome!