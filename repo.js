'use strict';

function load_data(){
    canvas_setproperties({
      'lineWidth': core_storage_data['line-width'],
    });

    let loop_counter = core_storage_data['number-of-entities'] - 1;
    do{
        entity_create({
          'properties': {
            'color': '#' + core_random_hex(),
            'x': core_random_integer({
              'max': canvas_properties['width'],
            }),
            'y': core_random_integer({
              'max': canvas_properties['height'],
            }),
          },
        });
    }while(loop_counter--);
}

function repo_drawlogic(){
    if(core_storage_data['mouse-lock']
      || core_mouse['down-0']){
        mouse_x = core_mouse['x'];
        mouse_y = core_mouse['y'];
    }

    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          if(core_storage_data['mode'] !== 'lines'){
              canvas_setproperties({
                'fillStyle': entity_entities[entity]['color'],
              });

              let height = entity_entities[entity]['x'] - mouse_x;
              let width = entity_entities[entity]['y'] - mouse_y;
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
                entity_entities[entity]['x'],
                entity_entities[entity]['y'],
                height,
                width
              );
          }

          if(core_storage_data['mode'] !== 'rectangles'){
              let extra_x = 0;
              let extra_y = 0;
              let target_x = mouse_x - entity_entities[entity]['x'];
              let target_y = mouse_y - entity_entities[entity]['y'];

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
                  extra_x = mouse_x - entity_entities[entity]['x'];
                  extra_y = mouse_y - entity_entities[entity]['y'];

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
                  'strokeStyle': entity_entities[entity]['color'],
                },
                'style': 'stroke',
                'vertices': [
                  {
                    'type': 'moveTo',
                    'x': entity_entities[entity]['x'],
                    'y': entity_entities[entity]['y'],
                  },
                  {
                    'x': entity_entities[entity]['x'] + target_x + extra_x,
                    'y': entity_entities[entity]['y'] + target_y + extra_y,
                  },
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
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'mouse_x': 0,
        'mouse_y': 0,
      },
      'info': '<button id=randomize type=button>Randomize</button>',
      'mousebinds': {
        'mousedown': {},
        'mousemove': {},
      },
      'reset': canvas_setmode,
      'storage': {
        'extra-length': 0,
        'fixed-length': 0,
        'length-multiplier': 1,
        'line-width': 1,
        'mode': 'both',
        'mouse-lock': true,
        'number-of-entities': 100,
      },
      'storage-menu': '<table><tr><td><input class=mini id=number-of-entities min=1 step=any type=number><td>Entities'
        + '<tr><td><input class=mini id=extra-length step=any type=number><td>Extra Length'
        + '<tr><td><input class=mini id=fixed-length step=any type=number><td>Fixed Length'
        + '<tr><td><input class=mini id=length-multiplier step=any type=number><td>Length Multiplier'
        + '<tr><td><input class=mini id=line-width step=any type=number><td>Line Width'
        + '<tr><td><select id=mode><option value=both>Both<option value=lines>Lines<option value=rectangles>Rectangles</select><td>Mode'
        + '<tr><td><input id=mouse-lock type=checkbox><td>Mouse Lock</table>',
      'title': 'Warped.htm',
    });
    canvas_init({
      'cursor': 'pointer',
    });
}

function repo_logic(){
}
