'use strict';

function draw_logic(){
    for(var object in objects){
        // Draw rectangles if not in lines mode.
        if(canvas_mode != 1){
            canvas_buffer.fillStyle = objects[object]['color'];

            var height = objects[object]['x'] - mouse_x;
            var width = objects[object]['y'] - mouse_y;
            if(settings_settings['fixed-length'] !== 0){
                height = settings_settings['fixed-length'];
                width = settings_settings['fixed-length'];

            }else{
                if(settings_settings['length-multiplier'] !== 1){
                    height *= settings_settings['length-multiplier'];
                    width *= settings_settings['length-multiplier'];
                }

                if(settings_settings['extra-length'] !== 0){
                    height *= settings_settings['extra-length'];
                    width *= settings_settings['extra-length'];
                }
            }

            canvas_buffer.fillRect(
              objects[object]['x'],
              objects[object]['y'],
              height,
              width
            );
        }

        // Draw lines if not in rectangles mode.
        if(canvas_mode != 2){
            var extra_x = 0;
            var extra_y = 0;
            var target_x = mouse_x - objects[object]['x'];
            var target_y = mouse_y - objects[object]['y'];

            if(settings_settings['fixed-length'] !== 0){
                var length = Math.sqrt(
                  target_x * target_x + target_y * target_y
                );

                target_x /= length;
                target_x *= settings_settings['fixed-length'];
                target_y /= length;
                target_y *= settings_settings['fixed-length'];
            }

            if(settings_settings['length-multiplier'] !== 1){
                target_x *= settings_settings['length-multiplier'];
                target_y *= settings_settings['length-multiplier'];
            }

            if(settings_settings['extra-length'] !== 0){
                extra_x = mouse_x - objects[object]['x'];
                extra_y = mouse_y - objects[object]['y'];

                var length = Math.sqrt(
                  extra_x * extra_x + extra_y * extra_y
                );

                extra_x /= length;
                extra_x *= settings_settings['extra-length'];
                extra_y /= length;
                extra_y *= settings_settings['extra-length'];
            }

            canvas_draw_path({
              'properties': {
                'strokeStyle': objects[object]['color'],
              },
              'style': 'stroke',
              'vertices': [
                {
                  'type': 'moveTo',
                  'x': objects[object]['x'],
                  'y': objects[object]['y'],
                },
                {
                  'x': objects[object]['x'] + target_x + extra_x,
                  'y': objects[object]['y'] + target_y + extra_y,
                },
              ],
            });
        }
    }
}

function randomize_objects(){
    objects.length = 0;

    var loop_counter = settings_settings['number-of-objects'] - 1;
    do{
        // Create randomized object.
        objects.push({
          'color': random_hex(),
          'x': random_integer({
            'max': canvas_width,
          }),
          'y': random_integer({
            'max': canvas_height,
          }),
        });
    }while(loop_counter--);

    canvas_draw();
}

function resize_logic(){
    mouse_y = canvas_y;
    mouse_x = canvas_x;

    canvas_buffer.lineWidth = settings_settings['line-width'];
    mouse_drag = false;
    randomize_objects();
}

function setmode_logic(){
    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick=canvas_setmode({mode:3,newgame:true})>Both</a><br>'
          + '<a onclick=canvas_setmode({mode:1,newgame:true})>Lines</a><br><a onclick=canvas_setmode({mode:2,newgame:true})>Rectangles</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Main Menu<br>'
          + '<input id=randomize-key maxlength=1>Randomize</div><hr>'
          + '<div><input id=extra-length>Extra Length<br>'
          + '<input id=fixed-length>Fixed Length<br>'
          + '<input id=length-multiplier>Length Multiplier<br>'
          + '<input id=line-width>Line Width<br>'
          + '<label><input id=mouse-lock type=checkbox>Mouse Lock</label><br>'
          + '<input id=number-of-objects>Objects<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // Visualization mode.
    }else{
        settings_save();
    }
}

var mouse_drag = false;
var mouse_x = 0;
var mouse_y = 0;
var objects = [];

window.onkeydown = function(e){
    if(canvas_mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // settings_settings['randomize-key']: randomize current objects.
    if(String.fromCharCode(key) === settings_settings['randomize-key']){
        randomize_objects();

    // ESC: return to the main menu.
    }else if(key === 27){
        canvas_setmode({
          'mode': 0,
        });
    }
};

window.onload = function(){
    settings_init({
      'prefix': 'Warped.htm-',
      'settings': {
        'extra-length': 0,
        'fixed-length': 0,
        'length-multiplier': 1,
        'line-width': 1,
        'mouse-lock': true,
        'number-of-objects': 100,
        'randomize-key': 'R',
      },
    });
    canvas_init();

    window.onmousedown =
      window.ontouchstart = function(e){
        if(canvas_mode <= 0){
            return;
        }

        mouse_drag = true;
        mouse_x = e.pageX;
        mouse_y = e.pageY;

        canvas_draw();
    };

    window.onmousemove = function(e){
        if(canvas_mode <= 0
          || (!settings_settings['mouse-lock'] && !mouse_drag)){
            return;
        }

        mouse_x = e.pageX;
        mouse_y = e.pageY;

        canvas_draw();
    };

    window.onmouseup = function(e){
        mouse_drag = false;
    };
};
