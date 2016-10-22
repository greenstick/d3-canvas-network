/*
Network Prototype
*/

// Network Module
Network = function (args) {
    return this.__init__(args);
};

Network.prototype = {

    /*
    Initialization
    */

    __init__       : function (args) {

        var network = this;

        // Set References
        network.container       = document.createElement("data-container"),
        network.maxDegree       = 0,        // Minimum Possible Maximum Degree
        network.minDegree       = 1000000,  // Practically Impossible Minimum Degree

        // Assign Arguments
        network.nodeData        = typeof args.nodes         === "object"    ? args.nodes            : [],
        network.linkData        = typeof args.links         === "object"    ? args.links            : [],
        network.targetElement   = typeof args.targetElement === "string"    ? args.targetElement    : "body",
        network.networkID       = typeof args.elementID     === "string"    ? args.elementID        : "#network",
        network.nodeClass       = typeof args.nodeClass     === "string"    ? args.nodeClass        : ".node",
        network.linkClass       = typeof args.linkClass     === "string"    ? args.linkClass        : ".link",
        network.nodeColors      = typeof args.nodeColors    === "object"    ? args.nodeColors       : ["rgb(1,23,29)", "rgb(4,38,47)", "rgb(9,53,65)", "rgb(16,69,82)", "rgb(26,85,100)", "rgb(37,101,118)", "rgb(50,118,136)", "rgb(65,135,154)", "rgb(82,153,172)", "rgb(100,171,190)", "rgb(121,190,207)", "rgb(144,209,225)", "rgb(169,228,243)"],
        network.nodeBorders     = typeof args.nodeBorders   === "object"    ? args.nodeBorders      : ["rgb(1,23,29)", "rgb(4,38,47)", "rgb(9,53,65)", "rgb(16,69,82)", "rgb(26,85,100)", "rgb(37,101,118)", "rgb(50,118,136)", "rgb(65,135,154)", "rgb(82,153,172)", "rgb(100,171,190)", "rgb(121,190,207)", "rgb(144,209,225)", "rgb(169,228,243)"],
        network.linkColors      = typeof args.linkColors    === "object"    ? args.linkColors       : ["rgba(68, 20, 0, 0.3)", "rgba(108, 32, 0, 0.4)", "rgba(148, 44, 0, 0.5)", "rgba(204, 68, 0, 0.6)", "rgba(250, 83, 0, 0.7)"],
        network.nodeSizing      = typeof args.nodeSizing    === "number"    ? args.nodeSizing       : 5,
        network.width           = typeof args.width         === "number"    ? args.width            : window.innerWidth,
        network.height          = typeof args.height        === "number"    ? args.height           : window.innerHeight,
        network.transition      = typeof args.transition    === "string"    ? args.transition       : "linear",
        network.duration        = typeof args.duration      === "number"    ? args.duration         : 1000,
        network.gravity         = typeof args.gravity       === "number"    ? args.gravity          : 1.9,
        network.charge          = typeof args.charge        === "number"    ? args.charge           : -1700,
        network.linkDistance    = typeof args.linkDistance  === "number"    ? args.linkDistance     : 60,
        network.contextType     = typeof args.contextType   === "string"    ? args.contextType      : "2d",
        network.smoothImage     = typeof args.smoothImage   === "boolean"   ? args.smoothImage      : true,
        network.autoInit        = typeof args.autoInit      === "boolean"   ? args.autoInit         : true,
        network.randomGen       = typeof args.randomGen     === "boolean"   ? args.randomGen        : true,
        network.randomK         = typeof args.randomK       === "number"    ? args.randomK          : 160;

        // Generate Random Graph if No Data
        if ((network.nodeData.length < 1) && network.randomGen) {
            network.generateRandomNetwork();
        }

        /*
        D3 Computations
        */

        // Set Canvas ID & Attributes
        network.canvas      = d3.select(network.targetElement).append("canvas")
                                .attr("id", network.networkID.split("#")[1])
                                .attr("width", network.width)
                                .attr("height", network.height);

        // Set Context
        network.setContext();

        // Set Graph Layout
        network.layout      = d3.layout.force()
                                .size([network.width, network.height]);

        // Initialize Force Layout
        network.force       = network.layout.nodes(network.nodeData).links(network.linkData)
                                .linkDistance(network.linkDistance)
                                .gravity(network.gravity)
                                .charge(network.charge)
                                .start();

        // Interconnect Nodes via Links
        network.generateLinks();

        // Set Node Metadata
        network.setDegreeMetrics();

        // Map Node & Link Colors
        network.mapNodeColors();
        network.mapLinkColors();

        /*
        D3 Element Generation
        */

        // Set Element to Render Graph To
        network.renderSpace   = d3.select(network.container);

        // Generate Link Elements
        network.links       = network.renderSpace.selectAll(network.linkClass)
                                .data(network.linkData).enter().append("line")
                                .attr("class", network.linkClass.split(".")[1])
                                .attr("lineWidth", function (d) { if (d.hasOwnProperty("weight")) {return Math.ceil(d.weight * network.linkColors.length)} return 0})
                                .attr("strokeStyle", function (d) {return d.color});

        // Generate Node Elements
        network.nodes       = network.renderSpace.selectAll(network.nodeClass)
                                .data(network.nodeData).enter().append("circle")
                                .attr("class", function (d) {return network.nodeClass.split(".")[1] + " " + network.nodeClass.split(".")[1] + "-" + d.index})
                                .attr("r", function (d) {return d.degree * network.nodeSizing})
                                .attr("fillStyle", function (d) {return d.fill})
                                .attr("strokeStyle", function (d) {return d.border});

        // If Auto Initialization Set, Render
        if (network.autoInit) {
            network.render();
        }

        return network;

    },

    /*
    Canvas Management Methods
    */

    // Set Canvas Context
    setContext              : function () {
        var network = this;
        network.context = network.canvas.node().getContext(network.contextType);
        network.context.imageSmoothingEnabled = network.smoothImage;
        return network;
    },

    // Refresh (Clear) Canvas
    refresh                 : function () {
        var network = this;
        network.canvas.style.opacity = 1.0;
        network.context.clearRect(0, 0, network.width, network.height);
        return network;
    },

    /*
    Network Utility Functions
    */

    // Generate Random Network - Simple, Imperfect Algorithm
    generateRandomNetwork   : function () {
        var network = this,
            kLinks = Math.floor(network.randomK ^ (Math.random() * 2));
        for (var i = 0; i < network.randomK; i++) {
            network.nodeData.push({label: i});
        }
        for (var i = 0; i < kLinks; i++) {
            var nodeA = Math.floor(Math.sqrt(Math.random()) * network.randomK) % network.randomK,
                nodeB = Math.floor(Math.sqrt(Math.random()) * network.randomK) % network.randomK;
            network.linkData.push({source: nodeA, target: nodeB, weight: (Math.floor(10 * Math.random()) / 10)});
        }
        return network;
    },

    // Generate Connections Between Nodes
    generateLinks           : function () {
        var network     = this;
        for (var i = 0, nl = network.nodeData.length; i < nl; i++ ) {
            var node        = network.nodeData[i];
                node.links  = [];
                node.degree = 0;
            for (var j = 0, ll = network.linkData.length; j < ll; j++ ) {
                var link    = network.linkData[j];
                if ((link.source && link.source.index == node.index) || (link.target && link.target.index == node.index)) {
                    node.links.push(node);
                    node.degree += 1;
                }
            }
        }
        return network;
    },

    // Set Network Degree Metrics
    setDegreeMetrics        : function () {
        var network = this;
        for (var i = 0, l = network.nodeData.length; i < l; i++ ) {
            var node = network.nodeData[i];
            if (node.degree > network.maxDegree) {
                network.maxDegree = node.degree;
            }
            if (node.degree < network.minDegree) {
                network.minDegree = node.degree;
            }
        }
        network.rangeDegree = network.maxDegree - network.minDegree;
        return network;
    },

    /*
    Data Binding Methods
    */

    // Map Node to Color by Degree
    mapNodeColors           : function () {
        var network = this,
            nNodeColors = network.nodeColors.length,
            nStrokeColors = network.nodeBorders.length;
        for (var i = 0, l = network.nodeData.length; i < l; i++) {
            var node    = network.nodeData[i],
            gravity     = (node.degree - network.minDegree) / (network.rangeDegree);
            node.fill   = network.nodeColors[Math.floor(gravity * nNodeColors)];
            node.border = network.nodeBorders[Math.floor(gravity * nStrokeColors)];
        }
        return network;
    },

    // Map Link to Color by Weight
    mapLinkColors           : function () {
        var network = this,
            nLinkColors = network.linkColors.length;
        for (var i = 0, l = network.linkData.length; i < l; i++) {
            var link    = network.linkData[i];
            link.color  = network.linkColors[Math.floor(link.weight * nLinkColors)];
        }
    },

    /*
    Canvas Rendering Methods
    */

    // Render Nodes
    renderNodes             : function () {
        var network = this;
        // Render Loop
        for (var i = 0, l = network.nodeData.length; i < l; i++ ) {
            var node    = network.nodeData[i];
                node.x_ = Math.max(30, Math.min(network.width - 30, node.x));
                node.y_ = Math.max(30, Math.min(network.height - 30, node.y));
            network.context.fillStyle     = node.fill;
            network.context.strokeStyle   = node.border;
            network.context.beginPath();
            network.context.moveTo(node.x, node.y);
            network.context.arc(node.x_, node.y_, node.degree * network.nodeSizing, 0, (2 * Math.PI));
            network.context.stroke();
            network.context.fill();
            network.context.closePath();
        }
        return network;
    },

    // Render Network Links
    renderLinks             : function () {
        var network = this,
            nLinkColors = network.linkColors.length;

        // Render Loop
        for (var i = 0, l = network.linkData.length; i < l; i++ ) {
            var link = network.linkData[i];
            network.context.lineWidth = Math.floor(link.weight * nLinkColors) + 1; // Use Length of Link Colors as Maximum Stroke Width
            network.context.strokeStyle = link.color;
            network.context.beginPath();
            network.context.moveTo(link.source.x, link.source.y);
            network.context.lineTo(link.target.x, link.target.y);
            network.context.globalAlpha = 0.9
            network.context.stroke();
            network.context.closePath();
        }
        return network;
    },

    // Render Macro
    render                  : function () {
        var network = this;
        // Render on D3 Timer / Animation Frame
        d3.timer(function () {
            network.refresh();
            network.renderLinks();
            network.renderNodes();
        });
        return network;
    }

};