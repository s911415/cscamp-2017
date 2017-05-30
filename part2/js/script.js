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
    backgroundCtx.drawImage(drawerCanvas, 0, 0);
    drawerCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function prepareCtxStyle() {
    drawerCtx.lineCap = "round";
    drawerCtx.fillStyle = brushFillColor;
    drawerCtx.strokeStyle = brushStrokeColor;
    drawerCtx.lineWidth = brushStrokeWidth;
}

function drawShape() {
    if (shapeFill) {
        drawerCtx.fill();
    }

    if (shapeStroke) {
        drawerCtx.stroke();
    }
}

function handleInvertDirection(info) {
    let start = info.start;
    if (info.width < 0) {
        start.x += info.width;
        info.width *= -1;
    }
    if (info.height < 0) {
        start.y += info.height;
        info.height *= -1;
    }

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

    drawerCtx.rect(info.start.x, info.start.y, info.width, info.height);
}

function drawShapePath_S(info) {
    let newInfo = handleRegularPolygon(info);

    drawShapePath_R(newInfo);
}

function drawShapePath_O(info) {
    info = handleInvertDirection(info);
    const
        radiusX = info.width / 2,
        radiusY = info.height / 2,
        centerX = info.start.x + radiusX,
        centerY = info.start.y + radiusY;

    drawerCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
}

function drawShapePath_C(info) {
    let newInfo = handleRegularPolygon(info);

    drawShapePath_O(newInfo);
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

        console.log(r);
        paths.push({
            x: centerX + r * Math.cos(deg),
            y: centerY + r * Math.sin(deg),
        });
    }
    console.log(paths);
    drawerCtx.moveTo(paths[0].x, paths[0].y);
    for (let i = 1; i < paths.length; i++) {
        drawerCtx.lineTo(paths[i].x, paths[i].y);
    }
}


$("#canvasContainer").bind('mousedown', function (e) {
    isMouseDown = true;
    startPoint = {
        x: e.offsetX,
        y: e.offsetY
    };
}).bind('mousemove', function (e) {
    if (!isMouseDown) return;
    let currentPoint = {
        x: e.offsetX,
        y: e.offsetY
    };

    prepareCtxStyle();

    if (currentMode === 'B') {
        drawerCtx.beginPath();
        drawerCtx.moveTo(startPoint.x, startPoint.y);
        drawerCtx.lineTo(currentPoint.x, currentPoint.y);
        
        drawerCtx.stroke();
        startPoint = currentPoint;
    } else if (currentMode === 'S') {
        let info = {
            width: currentPoint.x - startPoint.x,
            height: currentPoint.y - startPoint.y
        };

        info.start = Object.assign({}, startPoint);

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
    if (!isMouseDown) return;
    applyDrawerToBackground();
    isMouseDown = false;
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
    let dataUrl = backgroundCanvas.toDataURL(type);
    let a = document.createElement('a');
    let fileName = $("#fileName").val() || 'image';
    a.href = dataUrl;
    a.download = fileName + ext;

    a.click();
});

$("#openFile").change(function () {
    let fileInput = this;
    let file = this.files[0];
    if (!file) {
        this.value = '';
    } else {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            let img = new Image();
            img.src = this.result;
            img.onload = function () {
                backgroundCtx.drawImage(this, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                fileInput.value = '';
                setCurrentMode('B');
            };
            img.onerror = function () {
                alert('無法讀取圖檔');
            };
        };
        fileReader.readAsDataURL(file);
    }
});