'use strict';

function load_data(){
    core_entity_remove_all();

    var loop_counter = core_storage_data['number-of-entities'] - 1;
    do{
        // Create randomized entity.
        core_entity_create({
          'properties': {
            'color': '#' + core_random_hex(),
            'x': core_random_integer({
              'max': canvas_width,
            }),
            'y': core_random_integer({
              'max': canvas_height,
            }),
          },
        });
    }while(loop_counter--);
}
