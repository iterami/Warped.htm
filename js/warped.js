'use strict';

function draw_logic(){
    canvas_buffer.lineWidth = core_storage_data['line-width'];

    core_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          // Draw rectangles if not in only lines mode.
          if(core_mode !== 1){
              canvas_buffer.fillStyle = core_entities[entity]['color'];

              var height = core_entities[entity]['x'] - core_mouse['x'];
              var width = core_entities[entity]['y'] - core_mouse['y'];
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
                core_entities[entity]['x'],
                core_entities[entity]['y'],
                height,
                width
              );
          }

          // Draw lines if not in only rectangles mode.
          if(core_mode !== 2){
              var extra_x = 0;
              var extra_y = 0;
              var target_x = core_mouse['x'] - core_entities[entity]['x'];
              var target_y = core_mouse['y'] - core_entities[entity]['y'];

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
                  extra_x = core_mouse['x'] - core_entities[entity]['x'];
                  extra_y = core_mouse['y'] - core_entities[entity]['y'];

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
                  'strokeStyle': core_entities[entity]['color'],
                },
                'style': 'stroke',
                'vertices': [
                  {
                    'type': 'moveTo',
                    'x': core_entities[entity]['x'],
                    'y': core_entities[entity]['y'],
                  },
                  {
                    'x': core_entities[entity]['x'] + target_x + extra_x,
                    'y': core_entities[entity]['y'] + target_y + extra_y,
                  },
                ],
              });
          }
      },
    });
}

function repo_init(){
    core_repo_init({
      'info': '<input onclick=canvas_setmode({newgame:true}) type=button value=Both><input onclick=canvas_setmode({mode:1,newgame:true}) type=button value=Lines><input onclick=canvas_setmode({mode:2,newgame:true}) type=button value=Rectangles>',
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
        'number-of-entities': 100,
      },
      'storage-menu': '<table><tr><td><input id=extra-length><td>Extra Length<tr><td><input id=fixed-length><td>Fixed Length<tr><td><input id=length-multiplier><td>Length Multiplier<tr><td><input id=line-width><td>Line Width<tr><td><input id=mouse-lock type=checkbox><td>Mouse Lock<tr><td><input id=number-of-entities><td>Entities</table>',
      'title': 'Warped.htm',
    });
    canvas_init();
}

function resize_logic(){
    canvas_buffer.lineWidth = core_storage_data['line-width'];
}
