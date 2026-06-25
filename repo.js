'use strict';

function draw_shapes(entity){
    if(core_storage_data.mode !== 'lines'){
        canvas_setproperties({
          'fillStyle': entity.color,
        });

        let height = entity.x - pointer_x;
        let width = entity.y - pointer_y;
        if(core_storage_data.fixed_length !== 0){
            height = core_storage_data.fixed_length;
            width = core_storage_data.fixed_length;

        }else{
            if(core_storage_data.length_multiplier !== 1){
                height *= core_storage_data.length_multiplier;
                width *= core_storage_data.length_multiplier;
            }

            if(core_storage_data.extra_length !== 0){
                height *= core_storage_data.extra_length;
                width *= core_storage_data.extra_length;
            }
        }

        canvas.fillRect(
          entity.x,
          entity.y,
          height,
          width
        );
    }

    if(core_storage_data.mode !== 'rectangles'){
        let extra_x = 0;
        let extra_y = 0;
        let target_x = pointer_x - entity.x;
        let target_y = pointer_y - entity.y;

        if(core_storage_data.fixed_length !== 0){
            const length = Math.hypot(target_x, target_y);
            target_x /= length;
            target_x *= core_storage_data.fixed_length;
            target_y /= length;
            target_y *= core_storage_data.fixed_length;
        }

        if(core_storage_data.length_multiplier !== 1){
            target_x *= core_storage_data.length_multiplier;
            target_y *= core_storage_data.length_multiplier;
        }

        if(core_storage_data.extra_length !== 0){
            extra_x = pointer_x - entity.x;
            extra_y = pointer_y - entity.y;

            const length = Math.hypot(extra_x, extra_y);
            extra_x /= length;
            extra_x *= core_storage_data.extra_length;
            extra_y /= length;
            extra_y *= core_storage_data.extra_length;
        }

        canvas_draw_path({
          'properties': {
            'strokeStyle': entity.color,
          },
          'style': 'stroke',
          'vertices': [
            [
              'moveTo',
              entity.x,
              entity.y,
            ],
            [
              'lineTo',
              entity.x + target_x + extra_x,
              entity.y + target_y + extra_y,
            ],
          ],
        });
    }
}

function repo_drawlogic(){
    if(core_storage_data.pointer_lock
      || core_pointer.down_0){
        pointer_x = core_pointer.x;
        pointer_y = core_pointer.y;
    }

    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': draw_shapes,
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
      'info': '<button class=medium id=randomize type=button>Randomize</button>',
      'pointerbinds': {
        'pointerdown': {
          'todo': canvas_draw,
        },
        'pointermove': {
          'todo': function(){
              if(core_storage_data.pointer_lock
                || core_pointer.down_0){
                  canvas_draw();
              }
          },
        },
      },
      'storage': {
        'extra_length': 0,
        'fixed_length': 0,
        'length_multiplier': 1,
        'line_width': 1,
        'mode': 'both',
        'number_of_entities': 100,
        'pointer_lock': true,
      },
      'storage_menu': '<table><tr><td><input class=mini id=number_of_entities min=1 step=1 type=number><td>Entities'
        + '<tr><td><input class=mini id=extra_length step=any type=number><td>Extra Length'
        + '<tr><td><input class=mini id=fixed_length step=any type=number><td>Fixed Length'
        + '<tr><td><input class=mini id=length_multiplier step=any type=number><td>Length Multiplier'
        + '<tr><td><input class=mini id=line_width min=.01 step=any type=number><td>Line Width'
        + '<tr><td><select id=mode><option value=both>Both<option value=lines>Lines<option value=rectangles>Rectangles</select><td>Mode'
        + '<tr><td class=right><input id=pointer_lock type=checkbox><td><label for=pointer_lock>Pointer Lock</label></table>',
      'title': 'Warped.htm',
    });
    canvas_init({
      'cursor': 'pointer',
      'interval': false,
    });
}

function repo_load(){
    canvas_setproperties({
      'lineWidth': core_storage_data.line_width,
    });

    for(let i = 0; i < core_storage_data.number_of_entities; i++){
        entity_create({
          'properties': {
            'color': '#' + core_random_hex(),
            'x': core_random_integer(canvas_properties.width),
            'y': core_random_integer(canvas_properties.height),
          },
        });
    }
}
