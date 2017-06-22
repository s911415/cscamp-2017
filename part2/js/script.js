"use strict";
const
    CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 600;

const
    actionBar = $('#actionBar'),
    actionBtns = actionBar.find('button[data-type]'),
    canvasContainer = document.getElementById('canvasContainer'),
    drawerCanvas = document.getElementById('drawer'),
    backgroundCanvas = document.getElementById('background'),
    drawerCtx = drawerCanvas.getContext('2d'),
    backgroundCtx = backgroundCanvas.getContext('2d');

drawerCanvas.width = backgroundCanvas.width = CANVAS_WIDTH;
drawerCanvas.height = backgroundCanvas.height = CANVAS_HEIGHT;
canvasContainer.style.width = CANVAS_WIDTH + 'px';
canvasContainer.style.height = CANVAS_HEIGHT + 'px';
backgroundCtx.fillStyle = "#FFFFFF";
backgroundCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


let currentMode;

function setCurrentMode(mode) {
    currentMode = mode;
    actionBar.attr('mode', mode);
    actionBtns.prop('disabled', false);
    actionBtns.filter('[data-type="' + mode + '"]').prop('disabled', true);
}

setCurrentMode('B');

actionBtns.click(function () {
    let mode = this.getAttribute('data-type');

    setCurrentMode(mode);
});


let brushFillColor = '#000000',
    brushStrokeColor = '#000000',
    brushStrokeWidth = 3;
let isMouseDown = false, startPoint;
let currentShape = 'R',
    shapeStroke = false,
    shapeFill = true;


function applyDrawerToBackground() {
    //TODO: Merge foreground and background

}

function prepareCtxStyle() {
    drawerCtx.lineCap = "round";
    drawerCtx.fillStyle = brushFillColor;
    drawerCtx.strokeStyle = brushStrokeColor;
    drawerCtx.lineWidth = brushStrokeWidth;
}

function drawShape() {
    //TODO: draw shape according to shapeStroke and shapeFill

    drawerCtx.fill();
    drawerCtx.stroke();
}

function handleInvertDirection(info) {
    info = Object.assign({}, info);
    //TODO: handle invert direction

    return info;
}

function handleRegularPolygon(info) {
    let newInfo = Object.assign({}, info);
    let length = Math.max(Math.abs(info.width), Math.abs(info.height));
    newInfo.width = newInfo.height = length;

    if (info.width < 0) {
        newInfo.start.x = info.start.x - length;
    }

    if (info.height < 0) {
        newInfo.start.y = info.start.y - length;
    }

    return newInfo;
}

function drawShapePath_R(info) {
    info = handleInvertDirection(info);
    //TODO: Draw Rectangle
}

function drawShapePath_S(info) {
    info = handleRegularPolygon(info);
    //TODO: Draw square

}

function drawShapePath_O(info) {
    info = handleInvertDirection(info);
    //TODO: Draw oval

}

function drawShapePath_C(info) {
    info = handleRegularPolygon(info);

    //TODO: Draw circle
}


function drawShapePath_Star(info) {
    info = handleRegularPolygon(info);

    const
        edgeCount = 5,
        degStep = Math.PI / edgeCount,
        radius = info.width / 2,
        halfRadius = radius * 0.5;

    const
        centerX = info.start.x + radius,
        centerY = info.start.y + radius;
    let paths = [];

    for (let i = 0, deg = -0.5 * Math.PI; i < edgeCount * 2; i++, deg += degStep) {
        let r = radius;
        if (i % 2 === 1) r = halfRadius;

        //TODO: Push point into paths

    }

    //TODO: Show paths
    console.log(paths);

    //TODO: Draw Star by paths

}


$("#canvasContainer").bind('mousedown', function (e) {
    //TODO: Do something when mouse down

}).bind('mousemove', function (e) {
    //TODO: Do something when mouse down and moving

    //TODO: Is mouse down?

    //TODO: Get current mouse position
    let currentPoint = {
        x: 0,
        y: 0
    };

    prepareCtxStyle();


    if (currentMode === 'B') {
        //TODO: Do something when mode is brush
    } else if (currentMode === 'S') {
        //TODO: Get width and height of shape
        let info = {
            width: 0,
            height: 0
        };

        info.start = Object.assign({}, startPoint);

        //Clear foreground
        drawerCtx.clearRect(0, 0, drawerCanvas.width, drawerCanvas.height);
        drawerCtx.beginPath();


        if (currentShape === 'R') {
            drawShapePath_R(info);
        } else if (currentShape === 'S') {
            drawShapePath_S(info);
        } else if (currentShape === 'O') {
            drawShapePath_O(info);
        } else if (currentShape === 'C') {
            drawShapePath_C(info);
        } else if (currentShape === 'Star') {
            drawShapePath_Star(info);
        }
        drawerCtx.closePath();
        drawShape();
    }

}).bind('mouseup mouseleave', function () {
    //TODO: merge foreground and background

});

//Bind Event
$("#fillColor").bind('input change', function () {
    brushFillColor = this.value;
});
$("#strokeColor").bind('input change', function () {
    brushStrokeColor = this.value;
});

$("#lineWidth").bind('input change', function () {
    $("#lineWidthVal").text(this.value);
    brushStrokeWidth = parseInt(this.value, 10);
});

$("input[name='shape']").change(function () {
    if (this.checked) currentShape = this.value;
});

$("#strokeShape").change(function () {
    shapeStroke = this.checked;
});

$("#fillShape").change(function () {
    shapeFill = this.checked;
});

$("#save").click(function () {
    const fileTypeDom = document.getElementById('fileType');
    let type = fileTypeDom.value;
    let ext = fileTypeDom.options[fileTypeDom.selectedIndex].getAttribute('data-ext');

    //TODO: Set href and download attributes, and click it
    let a = document.createElement('a');
    let fileName = $("#fileName").val() || 'image';

});

$("#openFile").change(function () {
    let fileInput = this;
    let file = this.files[0];
    if (!file) {
        this.value = '';
    } else {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            //TODO: callback when file read from file reader

        };
        fileReader.readAsDataURL(file);
    }
});