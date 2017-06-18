'use strict';

function draw_logic(){
    canvas_buffer.lineWidth = core_storage_data['line-width'];

    for(var object in objects){
        // Draw rectangles if not in only lines mode.
        if(core_mode !== 1){
            canvas_buffer.fillStyle = objects[object]['color'];

            var height = objects[object]['x'] - core_mouse['x'];
            var width = objects[object]['y'] - core_mouse['y'];
            if(core_storage_data['fixed-length'] !== 0){
                height = core_storage_data['fixed-length'];
                width = core_storage_data['fixed-length'];

            }else{
                if(core_storage_data['length-multiplier'] !== 1){
                    height *= core_storage_data['length-multiplier'];
                    width *= core_storage_data['length-multiplier'];
                }

                if(core_storage_data['extra-length'] !== 0){
                    height *= core_storage_data['extra-length'];
                    width *= core_storage_data['extra-length'];
                }
            }

            canvas_buffer.fillRect(
              objects[object]['x'],
              objects[object]['y'],
              height,
              width
            );
        }

        // Draw lines if not in only rectangles mode.
        if(core_mode !== 2){
            var extra_x = 0;
            var extra_y = 0;
            var target_x = core_mouse['x'] - objects[object]['x'];
            var target_y = core_mouse['y'] - objects[object]['y'];

            if(core_storage_data['fixed-length'] !== 0){
                var length = Math.sqrt(
                  target_x * target_x + target_y * target_y
                );

                target_x /= length;
                target_x *= core_storage_data['fixed-length'];
                target_y /= length;
                target_y *= core_storage_data['fixed-length'];
            }

            if(core_storage_data['length-multiplier'] !== 1){
                target_x *= core_storage_data['length-multiplier'];
                target_y *= core_storage_data['length-multiplier'];
            }

            if(core_storage_data['extra-length'] !== 0){
                extra_x = core_mouse['x'] - objects[object]['x'];
                extra_y = core_mouse['y'] - objects[object]['y'];

                var length = Math.sqrt(
                  extra_x * extra_x + extra_y * extra_y
                );

                extra_x /= length;
                extra_x *= core_storage_data['extra-length'];
                extra_y /= length;
                extra_y *= core_storage_data['extra-length'];
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

    var loop_counter = core_storage_data['number-of-objects'] - 1;
    do{
        // Create randomized object.
        objects.push({
          'color': '#' + core_random_hex(),
          'x': core_random_integer({
            'max': canvas_width,
          }),
          'y': core_random_integer({
            'max': canvas_height,
          }),
        });
    }while(loop_counter--);

    canvas_draw();
}

function repo_init(){
    core_repo_init({
      'info': '<a onclick=canvas_setmode({newgame:true})>Both</a><br><a onclick=canvas_setmode({mode:1,newgame:true})>Lines</a><br><a onclick=canvas_setmode({mode:2,newgame:true})>Rectangles</a>',
      'keybinds': {
        72: {
          'todo': function(){
              canvas_setmode({
                'mode': core_mode,
              });
          },
        },
      },
      'menu': true,
      'mousebinds': {
        'mousedown': {},
        'mousemove': {},
      },
      'storage': {
        'extra-length': 0,
        'fixed-length': 0,
        'length-multiplier': 1,
        'line-width': 1,
        'mouse-lock': true,
        'number-of-objects': 100,
      },
      'storage-menu': '<table><tr><td><input id=extra-length><td>Extra Length<tr><td><input id=fixed-length><td>Fixed Length<tr><td><input id=length-multiplier><td>Length Multiplier<tr><td><input id=line-width><td>Line Width<tr><td><input id=mouse-lock type=checkbox><td>Mouse Lock<tr><td><input id=number-of-objects><td>Objects</table>',
      'title': 'Warped.htm',
    });
    canvas_init();
}

function resize_logic(){
    canvas_buffer.lineWidth = core_storage_data['line-width'];
    randomize_objects();
}

var objects = [];
