'use strict';

function load_data(){
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
}
