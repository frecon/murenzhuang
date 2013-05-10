test( "output node color test", function() {
    var output = new_output("file_68");
    equal( output.generate_shape_dot_code("black"),
	   'file_68[shape=note,color=black]', 
	   "Passed!" )
});

test( "output node dot_code test", function() {
    var output = new_output("file_69");
    equal( output.generate_dot_code(),
	   'file_69',
	   "Passed")
});

test( "edge node shape code test", function() {
    var node = new_edge_node("STDIN", "house");
    equal( node.generate_shape_dot_code(),
	   'STDIN[shape=house];',
	   "Passed")
});

test( "edge node dot code test", function() {
    var node = new_edge_node("STDOUT", "invhouse");
    equal( node.generate_dot_code(),
	   'STDOUT',
	   "Passed")
});

test( "mutator dot code test", function() {
    var mutator = new_mutator("mutator_1");
    equal( mutator.generate_dot_code(),
	   'mutator_1',
	   "Passed")
});

test( "mutator shape dot code test", function() {
    var mutator = new_mutator("mutator_2");
    mutator.buffer = 2;
    mutator.transform = "order";
    mutator.args = [1,2];
    equal( mutator.generate_shape_dot_code("black"),
	   'mutator_2[label="Buffer:2\\nTransform:order\\n[x_i]:1,2",color=black,shape=hexagon]',
	   "Passed")
});

test( "action distribution - nothing to remove test", function() {
    var mutators = 0;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 1.0, "Passed");
    equal( distribution.add_output,  0.0, "Passed");
    equal( distribution.remove,      0.0, "Passed");
});

test( "action distribution - after one mutator added", function() {
    var mutators = 1;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 0.9, "Passed");
    equal( distribution.add_output,  0.1, "Passed");
    equal( distribution.remove,      0.0, "Passed");    
});

test( "action distribution - after 5 mutators added", function() {
    var mutators = 5;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 0.7, "Passed");
    equal( distribution.add_output,  0.2, "Passed");
    equal( distribution.remove,      0.1, "Passed");
});

test( "action - distribution - after 10 mutators added", function() {
    var mutators = 10;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 0.6, "Passed");
    equal( distribution.add_output,  0.2, "Passed");
    equal( distribution.remove,      0.2, "Passed");    
});

test( "action distribution - after 15 mutators added", function() {
    var mutators = 15;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 0.4, "Passed");
    equal( distribution.add_output,  0.2, "Passed");
    equal( distribution.remove,      0.4, "Passed");
});

test( "action distribution - after 20 mutators added", function() {
    var mutators = 20;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 0.3, "Passed");
    equal( distribution.add_output,  0.1, "Passed");
    equal( distribution.remove,      0.6, "Passed");
})

test( "action distribution - after 25 mutators added", function() {
    var mutators = 25;
    var distribution = action_probabilities(mutators);
    equal( distribution.add_mutator, 0.05, "Passed");
    equal( distribution.add_output,  0.05, "Passed");
    equal( distribution.remove,      0.90, "Passed");
});

test( "choose action test distr - mutators: 0", function() {
    var mutators = 0;
    var res = measure_1000_times_and_calculate_percentage(mutators);
    equal( res.add_mutator,
	   1.0,
	   "Passed");
});

test( "choose action test distr - mutators: 1", function() {
    var mutators = 1;
    var res = measure_1000_times_and_calculate_percentage(mutators);
    equal( res.add_mutator, 0.9, "Passed");
    equal( res.add_output, 0.1, "Passed");
});

test( "choose action test distr - mutators: 5", function() {
    var mutators = 5;
    var res = measure_1000_times_and_calculate_percentage(mutators);
    equal( res.add_mutator, 0.7, "Passed");
    equal( res.add_output, 0.2, "Passed");    
});

test( "choose action test distr - mutators: 10", function() {
    var mutators = 10;
    var res = measure_1000_times_and_calculate_percentage(mutators);
    equal( res.add_mutator, 0.6, "Passed");
    equal( res.add_output, 0.2, "Passed");
});

function measure_1000_times_and_calculate_percentage(mutators) {
    var add_mutator = 0;
    var add_output = 0;
    var remove = 0;
    for (var i=0; i < 1000; i++) {
	switch (choose_action(mutators)) {
	case ADD_MUTATOR:
	    add_mutator++;
	    break;
	case ADD_OUTPUT:
	    add_output++;
	    break;
	case REMOVE:
	    remove++;
	    break;
	}
    }
    return obj = { add_mutator: (add_mutator/1000).toFixed(1),
		   add_output: (add_output/1000).toFixed(1),
		   remove: (remove/1000).toFixed(1)
		 };
}