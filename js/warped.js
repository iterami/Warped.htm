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

            var extra_x = 0;
            var extra_y = 0;
            var target_x = mouse_x - objects[object]['x'];
            var target_y = mouse_y - objects[object]['y'];

            if(settings['line-fixed-length'] !== 0){
                var length = Math.sqrt(
                  target_x * target_x + target_y * target_y
                );

                target_x /= length;
                target_x *= settings['line-fixed-length'];
                target_y /= length;
                target_y *= settings['line-fixed-length'];
            }

            if(settings['line-length-multiplier'] !== 1){
                target_x *= settings['line-length-multiplier'];
                target_y *= settings['line-length-multiplier'];
            }

            if(settings['line-extra-length'] !== 0){
                extra_x = mouse_x - objects[object]['x'];
                extra_y = mouse_y - objects[object]['y'];

                var length = Math.sqrt(
                  extra_x * extra_x + extra_y * extra_y
                );

                extra_x /= length;
                extra_x *= settings['line-extra-length'];
                extra_y /= length;
                extra_y *= settings['line-extra-length'];
            }

            buffer.lineTo(
              objects[object]['x'] + target_x + extra_x,
              objects[object]['y'] + target_y + extra_y
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

    var ids = {
      'clear': true,
      'mouse-lock': true,
    };
    for(var id in ids){
        document.getElementById(id).value = ids[id];
    }

    ids = {
      'line-extra-length': 0,
      'line-fixed-length': 0,
      'line-length-multiplier': 1,
      'line-width': 1,
      'number-of-objects': 100,
      'randomize-key': 'R',
    };
    for(var id in ids){
        document.getElementById(id).value = ids[id];
    }

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

    buffer.lineWidth = settings['line-width'];
    mouse_drag = false;
    randomize_objects();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = [
      'clear',
      'mouse-lock',
    ];
    for(var id in ids){
        var checked = document.getElementById(ids[id]).checked;
        settings[ids[id]] = checked;

        if(checked){
            window.localStorage.removeItem('Warped.htm-' + ids[id]);

        }else{
            window.localStorage.setItem(
              'Warped.htm-' + ids[id],
              1
            );
        }
    }

    ids = {
      'line-extra-length': 0,
      'line-fixed-length': 0,
      'line-length-multiplier': 1,
      'line-width': 1,
    };
    for(id in ids){
        var value = document.getElementById(id).value;
        if(value == ids[id]
          || isNaN(value)){
            window.localStorage.removeItem('Warped.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(value);
            window.localStorage.setItem(
              'Warped.htm-' + id,
              settings[id]
            );
        }
    }

    var randomize_key = document.getElementById('randomize-key').value;
    if(randomize_key === 'R'){
        window.localStorage.removeItem('Warped.htm-randomize-key');
        settings['randomize-key'] = 'R';

    }else{
        settings['randomize-key'] = randomize_key;
        window.localStorage.setItem(
          'Warped.htm-randomize-key',
          settings['randomize-key']
        );
    }

    var number_of_objects = document.getElementById('number-of-objects').value;
    if(number_of_objects == 100
      || isNaN(number_of_objects)
      || number_of_objects < 1){
        window.localStorage.removeItem('Warped.htm-number-of-objects');
        settings['number-of-objects'] = 100;

    }else{
        settings['number-of-objects'] = parseInt(number_of_objects);
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
      + (settings['clear'] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=line-extra-length value='
      + settings['line-extra-length'] + '>Line Extra Length<br><input id=line-fixed-length value='
      + settings['line-fixed-length'] + '>Line Fixed Length<br><input id=line-length-multiplier value='
      + settings['line-length-multiplier'] + '>Line Length Multiplier<br><input id=line-width value='
      + settings['line-width'] + '>Line Width<br><label><input '
      + (settings['mouse-lock'] ? 'checked ' : '') + 'id=mouse-lock type=checkbox>Mouse Lock</label><br><input id=number-of-objects value='
      + settings['number-of-objects'] + '>Objects<br><a onclick=reset()>Reset Settings</a></div></div>';
}

var buffer = 0;
var canvas = 0;
var height = 0;
var objects = [];
var mode = 0;
var mouse_drag = false;
var mouse_x = 0;
var mouse_y = 0;
var settings = {
  'clear': window.localStorage.getItem('Warped.htm-clear') === null,
  'line-extra-length': parseInt(window.localStorage.getItem('Warped.htm-line-extra-length')) || 0,
  'line-fixed-length': parseInt(window.localStorage.getItem('Warped.htm-line-fixed-length')) || 0,
  'line-length-multiplier': parseInt(window.localStorage.getItem('Warped.htm-line-length-multiplier')) || 1,
  'line-width': parseInt(window.localStorage.getItem('Warped.htm-line-width')) || 1,
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

    mouse_drag = true;
    mouse_x = e.pageX;
    mouse_y = e.pageY;

    draw();
};

window.onmousemove = function(e){
    if(mode <= 0
      || (!settings['mouse-lock'] && !mouse_drag)){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    draw();
};

window.onmouseup = function(e){
    mouse_drag = false;
};

window.onresize = resize;
