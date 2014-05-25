function draw(){
    if(settings[3]){// clear?
        buffer.clearRect(
          0,
          0,
          width,
          height
        );
    }

    buffer.lineWidth = settings[0];
    var loop_counter = objects.length - 1;
    do{
        // draw rectangles if not in lines mode
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

        // draw lines if not in rectangles mode
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

    if(settings[3]){// clear?
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

    var loop_counter = settings[1] - 1;// number of objects
    do{
        // create random object with x, y, and random rgb color
        objects.push([
          Math.floor(Math.random() * width),
          Math.floor(Math.random() * height),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255)
        ]);
    }while(loop_counter--);

    draw();
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('clear').checked = 1;
        document.getElementById('line-width').value = 1;
        document.getElementById('mouse-lock').checked = 1;
        document.getElementById('number-of-objects').value = 100;
        document.getElementById('randomize-key').value = 'R';
        save();
    }
}

function resize(){
    if(mode > 0){
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
}

function save(){
    // save settings into localStorage if differ from default

    if(document.getElementById('randomize-key').value === 'R'){
        window.localStorage.removeItem('warped-2');
        settings[2] = 'R';

    }else{
        settings[2] = document.getElementById('randomize-key').value;
        window.localStorage.setItem(
          'warped-2',
          settings[2]
        );
    }

    var loop_counter = 1;
    do{
        j = [
          'line-width',
          'number-of-objects'
        ][loop_counter];
        if(document.getElementById(j).value === [1, 100][loop_counter]
          || isNaN(document.getElementById(j).value)
          || document.getElementById(j).value < 1){
            window.localStorage.removeItem('warped-' + loop_counter);
            settings[loop_counter] = [
              1,
              100
            ][loop_counter];
            document.getElementById(j).value = settings[loop_counter];

        }else{
            settings[loop_counter] = parseInt(document.getElementById(j).value);
            window.localStorage.setItem(
              'warped-' + loop_counter,
              settings[loop_counter]
            );
        }

        settings[3 + loop_counter] = document.getElementById(['clear', 'mouse-lock'][loop_counter]).checked;
        if(settings[3 + loop_counter]){
            window.localStorage.removeItem('warped-' + (3 + loop_counter));

        }else{
            window.localStorage.setItem(
              'warped-' + (3 + loop_counter),
              0
            );
        }
    }while(loop_counter--);
}

function setmode(newmode){
    mode = newmode;

    // new visualization mode
    if(mode > 0){
        save();

        document.getElementById('page').innerHTML = '<canvas id=canvas></canvas>';
        buffer = document.getElementById('buffer').getContext('2d');
        canvas = document.getElementById('canvas').getContext('2d');

        resize();

    // main menu mode
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Warped</b></div><hr><div class=c style=color:#f00>SEIZURE WARNING!<br>FLASHING COLORS!</div><hr><div class=c><ul><li><a onclick=setmode(3)>Both</a><li><a onclick=setmode(1)>Lines</a><li><a onclick=setmode(2)>Rectangles</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=randomize-key maxlength=1 value='
          + settings[2] + '>Randomize</div><hr><div class=c><label><input '
          + (settings[3] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=line-width value='
          + settings[0] + '>Line Width<br><label><input '
          + (settings[4] ? 'checked ' : '') + 'id=mouse-lock type=checkbox>Mouse Lock</label><br><input id=number-of-objects value='
          + settings[1] + '>Objects<br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

var buffer = 0;
var canvas = 0;
var height = 0;
var j = 0;
var objects = [];
var mode = 0;
var mouse_x = 0;
var mouse_y = 0;
var settings = [
  window.localStorage.getItem('warped-0') === null
    ? 1
    : parseInt(window.localStorage.getItem('warped-0')),// line width
  window.localStorage.getItem('warped-1') === null
    ? 100
    : parseInt(window.localStorage.getItem('warped-1')),// number of lines
  window.localStorage.getItem('warped-2') === null
    ? 'R'
    : window.localStorage.getItem('warped-2'),// randomize key
  window.localStorage.getItem('warped-3') === null,// clear?
  window.localStorage.getItem('warped-4') === null// mouse lock?
];
var x = 0;
var width = 0;
var y = 0;

resize();
setmode(0);

window.onkeydown = function(e){
    if(mode > 0){
        var key = window.event ? event : e;
        key = key.charCode ? key.charCode : key.keyCode;

        if(String.fromCharCode(key) === settings[2]){// randomize key
            randomize_objects();

        }else if(key === 27){// ESC
            setmode(0);
        }
    }
};

window.onmousedown = function(e){
    if(mode > 0
      && !settings[4]){// mouse not locked
        mouse_x = e.pageX;
        mouse_y = e.pageY;

        draw();
    }
};

window.onmousemove = function(e){
    if(mode > 0
      && settings[4]){// mouse locked
        mouse_x = e.pageX;
        mouse_y = e.pageY;

        draw();
    }
}

window.onresize = resize;
