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