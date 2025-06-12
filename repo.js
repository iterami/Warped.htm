'use strict';

function load_data(){
    canvas_setproperties({
      'lineWidth': core_storage_data['line-width'],
    });

    let loop_counter = Math.floor(core_storage_data['number-of-entities']) - 1;
    do{
        entity_create({
          'properties': {
            'color': '#' + core_random_hex(),
            'x': core_random_integer(canvas_properties['width']),
            'y': core_random_integer(canvas_properties['height']),
          },
        });
    }while(loop_counter--);
}

function repo_drawlogic(){
    if(core_storage_data['pointer-lock']
      || core_pointer['down-0']){
        pointer_x = core_pointer['x'];
        pointer_y = core_pointer['y'];
    }

    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          if(core_storage_data['mode'] !== 'lines'){
              canvas_setproperties({
                'fillStyle': entity['color'],
              });

              let height = entity['x'] - pointer_x;
              let width = entity['y'] - pointer_y;
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

              canvas.fillRect(
                entity['x'],
                entity['y'],
                height,
                width
              );
          }

          if(core_storage_data['mode'] !== 'rectangles'){
              let extra_x = 0;
              let extra_y = 0;
              let target_x = pointer_x - entity['x'];
              let target_y = pointer_y - entity['y'];

              if(core_storage_data['fixed-length'] !== 0){
                  const length = Math.sqrt(
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
                  extra_x = pointer_x - entity['x'];
                  extra_y = pointer_y - entity['y'];

                  const length = Math.sqrt(
                    extra_x * extra_x + extra_y * extra_y
                  );

                  extra_x /= length;
                  extra_x *= core_storage_data['extra-length'];
                  extra_y /= length;
                  extra_y *= core_storage_data['extra-length'];
              }

              canvas_draw_path({
                'properties': {
                  'strokeStyle': entity['color'],
                },
                'style': 'stroke',
                'vertices': [
                  [
                    'moveTo',
                    entity['x'],
                    entity['y'],
                  ],
                  [
                    'lineTo',
                    entity['x'] + target_x + extra_x,
                    entity['y'] + target_y + extra_y,
                  ],
                ],
              });
          }
      },
    });
}

function repo_init(){
    core_repo_init({
      'events': {
        'randomize': {
          'onclick': function(){
              canvas_setmode();
              canvas_draw();
          },
        },
      },
      'globals': {
        'pointer_x': 0,
        'pointer_y': 0,
      },
      'info': '<button id=randomize type=button>Randomize</button>',
      'pointerbinds': {
        'pointerdown': {
          'todo': canvas_draw,
        },
        'pointermove': {
          'todo': function(){
              if(core_storage_data['pointer-lock']
                || core_pointer['down-0']){
                  canvas_draw();
              }
          },
        },
      },
      'storage': {
        'extra-length': 0,
        'fixed-length': 0,
        'length-multiplier': 1,
        'line-width': 1,
        'mode': 'both',
        'number-of-entities': 100,
        'pointer-lock': true,
      },
      'storage-menu': '<table><tr><td><input class=mini id=number-of-entities min=1 step=1 type=number><td>Entities'
        + '<tr><td><input class=mini id=extra-length step=any type=number><td>Extra Length'
        + '<tr><td><input class=mini id=fixed-length step=any type=number><td>Fixed Length'
        + '<tr><td><input class=mini id=length-multiplier step=any type=number><td>Length Multiplier'
        + '<tr><td><input class=mini id=line-width step=any type=number><td>Line Width'
        + '<tr><td><select id=mode><option value=both>Both<option value=lines>Lines<option value=rectangles>Rectangles</select><td>Mode'
        + '<tr><td><input id=pointer-lock type=checkbox><td>Pointer Lock</table>',
      'title': 'Warped.htm',
    });
    canvas_init({
      'cursor': 'pointer',
      'interval': false,
    });
}
