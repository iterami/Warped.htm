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
    var loop_counter = objects.length - 1;
    do{
        // Draw rectangles if not in lines mode.
        if(mode != 1){
            buffer.fillStyle = 'rgb('
              + objects[loop_counter][2] + ', '
              + objects[loop_counter][3] + ', '
              + objects[loop_counter][4] + ')';

            buffer.fillRect(
              objects[loop_counter][0],
              objects[loop_counter][1],
              objects[loop_counter][0] - mouse_x,
              objects[loop_counter][1] - mouse_y
            );
        }

        // Draw lines if not in rectangles mode.
        if(mode != 2){
            buffer.beginPath();
            buffer.moveTo(
              objects[loop_counter][0],
              objects[loop_counter][1]
            );
            buffer.lineTo(
              mouse_x,
              mouse_y
            );
            buffer.closePath();
            buffer.strokeStyle = 'rgb('
              + objects[loop_counter][2] + ', '
              + objects[loop_counter][3] + ', '
              + objects[loop_counter][4] + ')';
            buffer.stroke();
        }
    }while(loop_counter--);

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

function randomize_objects(){
    objects.length = 0;

    var loop_counter = settings['number-of-objects'] - 1;
    do{
        // Create randomized object.
        objects.push([
          Math.floor(Math.random() * width),// X
          Math.floor(Math.random() * height),// Y
          Math.floor(Math.random() * 255),// (Red)GB
          Math.floor(Math.random() * 255),// R(Green)B
          Math.floor(Math.random() * 255),// RG(Blue)
        ]);
    }while(loop_counter--);

    draw();
}

function reset(){
    if(!confirm('Reset settings?')){
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

// Save settings into window.localStorage
//   if they differ from default settings.
function save(){
    // Save clear setting.
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

    // Save line-width setting.
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

    // Save randomization key setting.
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

    // Save mouse-lock setting.
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

    // Save number-of-objects setting.
    if(document.getElementById('number-of-objects').value === 100
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

        document.getElementById('page').innerHTML = '<canvas id=canvas></canvas><canvas id=buffer style=display:none></canvas>';

        buffer = document.getElementById('buffer').getContext('2d');
        canvas = document.getElementById('canvas').getContext('2d');

        resize();

    // Main menu mode.
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Warped.htm</b></div><hr><div class=c style=color:#f00>SEIZURE WARNING!<br>FLASHING COLORS!</div><hr><div class=c><ul><li><a onclick=setmode(3)>Both</a><li><a onclick=setmode(1)>Lines</a><li><a onclick=setmode(2)>Rectangles</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=randomize-key maxlength=1 value='
          + settings['randomize-key'] + '>Randomize</div><hr><div class=c><label><input '
          + (settings['clear'] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=line-width value='
          + settings['line-width'] + '>Line Width<br><label><input '
          + (settings['mouse-lock'] ? 'checked ' : '') + 'id=mouse-lock type=checkbox>Mouse Lock</label><br><input id=number-of-objects value='
          + settings['number-of-objects'] + '>Objects<br><a onclick=reset()>Reset Settings</a></div></div>';
    }
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
  'line-width' : window.localStorage.getItem('Warped.htm-line-width') === null
    ? 1
    : parseInt(window.localStorage.getItem('Warped.htm-line-width')),
  'randomize-key': window.localStorage.getItem('Warped.htm-randomize-key') === null
    ? 'R'
    : window.localStorage.getItem('Warped.htm-randomize-key'),
  'mouse-lock': window.localStorage.getItem('Warped.htm-mouse-lock') === null,
  'number-of-objects': window.localStorage.getItem('Warped.htm-number-of-objects') === null
    ? 100
    : parseInt(window.localStorage.getItem('Warped.htm-number-of-objects')),
};
var x = 0;
var width = 0;
var y = 0;

resize();
setmode(0);

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
