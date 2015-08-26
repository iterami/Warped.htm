'use strict';

function draw(){
    if(settings['clear']){
        buffer.clearRect(
          0,
          0,
          width,
          height
        );
    }

    buffer.lineWidth = settings['line-width'];
    for(var object in objects){
        // Draw rectangles if not in lines mode.
        if(mode != 1){
            buffer.fillStyle = objects[object]['color'];
            buffer.fillRect(
              objects[object]['x'],
              objects[object]['y'],
              objects[object]['x'] - mouse_x,
              objects[object]['y'] - mouse_y
            );
        }

        // Draw lines if not in rectangles mode.
        if(mode != 2){
            buffer.beginPath();
            buffer.moveTo(
              objects[object]['x'],
              objects[object]['y']
            );
            buffer.lineTo(
              mouse_x,
              mouse_y
            );
            buffer.closePath();
            buffer.strokeStyle = objects[object]['color'];
            buffer.stroke();
        }
    }

    if(settings['clear']){
        canvas.clearRect(
          0,
          0,
          width,
          height
        );
    }
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );
}

function random_hex(){
    var choices = '0123456789abcdef';
    return '#'
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16));
}

function randomize_objects(){
    objects.length = 0;

    var loop_counter = settings['number-of-objects'] - 1;
    do{
        // Create randomized object.
        objects.push({
          'color': random_hex(),
          'x': Math.floor(Math.random() * width),
          'y': Math.floor(Math.random() * height),
        });
    }while(loop_counter--);

    draw();
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('clear').checked = true;
    document.getElementById('line-width').value = 1;
    document.getElementById('mouse-lock').checked = true;
    document.getElementById('number-of-objects').value = 100;
    document.getElementById('randomize-key').value = 'R';

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;
    mouse_y = y;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
    mouse_x = x;

    randomize_objects();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    if(document.getElementById('clear').checked){
        window.localStorage.removeItem('Warped.htm-clear');
        settings['clear'] = true;

    }else{
        settings['clear'] = false;
        window.localStorage.setItem(
          'Warped.htm-clear',
          1
        );
    }

    if(isNaN(document.getElementById('line-width').value)
      || document.getElementById('line-width').value < 2){
        window.localStorage.removeItem('Warped.htm-line-width');
        settings['line-width'] = 1;

    }else{
        settings['line-width'] = parseInt(document.getElementById('line-width').value);
        window.localStorage.setItem(
          'Warped.htm-line-width',
          settings['line-width']
        );
    }

    if(document.getElementById('randomize-key').value === 'R'){
        window.localStorage.removeItem('Warped.htm-randomize-key');
        settings['randomize-key'] = 'R';

    }else{
        settings['randomize-key'] = document.getElementById('randomize-key').value;
        window.localStorage.setItem(
          'Warped.htm-randomize-key',
          settings['randomize-key']
        );
    }

    if(document.getElementById('mouse-lock').checked){
        window.localStorage.removeItem('Warped.htm-mouse-lock');
        settings['mouse-lock'] = true;

    }else{
        settings['mouse-lock'] = false;
        window.localStorage.setItem(
          'Warped.htm-mouse-lock',
          1
        );
    }

    if(document.getElementById('number-of-objects').value == 100
      || isNaN(document.getElementById('number-of-objects').value)
      || document.getElementById('number-of-objects').value < 1){
        window.localStorage.removeItem('Warped.htm-number-of-objects');
        settings['number-of-objects'] = 100;

    }else{
        settings['number-of-objects'] = parseInt(document.getElementById('number-of-objects').value);
        window.localStorage.setItem(
          'Warped.htm-number-of-objects',
          settings['number-of-objects']
        );
    }
}

function setmode(newmode){
    mode = newmode;

    // Visualization mode.
    if(mode > 0){
        save();

        document.body.innerHTML =
          '<canvas id=canvas></canvas><canvas id=buffer></canvas>';

        var contextAttributes = {
          'alpha': false,
        };
        buffer = document.getElementById('buffer').getContext(
          '2d',
          contextAttributes
        );
        canvas = document.getElementById('canvas').getContext(
          '2d',
          contextAttributes
        );

        resize();

        return;
    }

    // Main menu mode.
    buffer = 0;
    canvas = 0;

    document.body.innerHTML = '<div><div><a onclick=setmode(3)>Both</a><br><a onclick=setmode(1)>Lines</a><br><a onclick=setmode(2)>Rectangles</a></div></div><div class=right><div><input disabled value=ESC>Main Menu<br><input id=randomize-key maxlength=1 value='
      + settings['randomize-key'] + '>Randomize</div><hr><div><label><input '
      + (settings['clear'] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=line-width value='
      + settings['line-width'] + '>Line Width<br><label><input '
      + (settings['mouse-lock'] ? 'checked ' : '') + 'id=mouse-lock type=checkbox>Mouse Lock</label><br><input id=number-of-objects value='
      + settings['number-of-objects'] + '>Objects<br><a onclick=reset()>Reset Settings</a></div></div>';
}

var buffer = 0;
var canvas = 0;
var height = 0;
var objects = [];
var mode = 0;
var mouse_x = 0;
var mouse_y = 0;
var settings = {
  'clear': window.localStorage.getItem('Warped.htm-clear') === null,
  'line-width' : parseInt(window.localStorage.getItem('Warped.htm-line-width')) || 1,
  'randomize-key': window.localStorage.getItem('Warped.htm-randomize-key') || 'R',
  'mouse-lock': window.localStorage.getItem('Warped.htm-mouse-lock') === null,
  'number-of-objects': parseInt(window.localStorage.getItem('Warped.htm-number-of-objects')) || 100,
};
var x = 0;
var width = 0;
var y = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // settings['randomize-key']: randomize current objects.
    if(String.fromCharCode(key) === settings['randomize-key']){
        randomize_objects();

    // ESC: return to the main menu.
    }else if(key === 27){
        setmode(0);
    }
};

window.onload = function(e){
    resize();
    setmode(0);
};

window.onmousedown =
  window.ontouchstart = function(e){
    if(mode <= 0){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    draw();
};

window.onmousemove = function(e){
    if(mode <= 0
      || !settings['mouse-lock']){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    draw();
};

window.onresize = resize;
