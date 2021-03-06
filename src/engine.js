var STDIN = new_edge_node("STDIN","house");
var STDOUT = new_edge_node("STDOUT","invhouse");

function new_graph() { 

    var graph = {

	paths: [[STDIN,STDOUT]],
	files: [],
	mutators: [],
	history: [],

	newly_added_mutator:[],
	newly_added_file:[],
	newly_added_path:[],
	newly_removed_mutator:[],
	newly_removed_files:[],
	newly_removed_path:[],

	next_step_and_draw: function() {
	    this.next_step();
	    this.make_graphviz_graph();
	    this.display_level();
	    this.display_history();
	    switch_the_button_into_done_button();
	},

	done_and_draw: function() {
	    this.done();
	    this.make_graphviz_graph();
	    switch_the_button_into_next_step_button();
	},

	display_level: function() {
	    $('#left').html( mrz_level(this.history.length) );
	},

	display_history: function() {
	    $('#left').append(this.history.join('</br>'));
	},


	next_step: function() {
	    var action = choose_action(this.mutators.length, 
				       this.files.length);
	    this.next_step_based_on_action(action);
	    this.history.unshift(action);
	},

	next_step_based_on_action: function(action) {
	    switch(action) {
	    case ADD_MUTATOR:
		this.add_mutator_randomly_on_edge();
		break;
	    case ADD_OUTPUT:
		this.add_output_node_randomly_from_input_node_or_mutator_node();
		break;
	    case REMOVE_MUTATOR:
		this.remove_random_mutator_node();
		break;
	    case REMOVE_OUTPUT:
		this.remove_random_output_node();
		break;
	    }
	},

	add_mutator_randomly_on_edge: function() {
	    var mutator = this.create_new_mutator();
	    var chosen = this.randomly_choose_existing_path();
	    var point = Math.floor(Math.random()*(chosen.length-1))+1;
	    var new_path = copy_path(chosen);
	    new_path.splice(point,0,mutator);
	    this.add_new_path_to_list(new_path);
	},

	add_new_path_to_list: function(new_path) {
	    this.newly_added_path.push(new_path);
	},
	
	create_new_mutator: function() {
	    var name = random_mutator_name();
	    while( this.mutator_name_is_used(name) ) {
		name = random_mutator_name();
	    }
	    var mutator = new_mutator(name);
	    this.add_new_mutator_to_list(mutator);
	    return mutator;
	},

	add_new_mutator_to_list: function(new_mutator) {
	    this.newly_added_mutator.push(new_mutator);
	},
	
	done: function() {
	    this.copy_mutators_from_new_to_existing();
	    this.copy_files_from_new_to_existing();
	    this.copy_paths_from_new_to_existing();
	    this.reset_waiting_lists();
	    this.remove_duplicate_paths();
	},

	copy_mutators_from_new_to_existing: function() {
	    this.mutators.push.apply(this.mutators,
				     this.newly_added_mutator);
	},

	copy_files_from_new_to_existing: function() {
	    this.files.push.apply(this.files,
				  this.newly_added_file);
	},

	copy_paths_from_new_to_existing: function() {
	    this.paths.push.apply(this.paths,
				  this.newly_added_path);
	},

	reset_waiting_lists: function() {
	    this.reset_newly_added_lists();
	    this.reset_newly_removed_lists();
	},
	
	remove_duplicate_paths: function() {
	    var unique = this.paths.filter( function(itm,i,a) 
					    {
						return i == a.indexOf(itm);
					    });
	    this.paths = unique;
	},

	reset_newly_added_lists: function() {
	    this.newly_added_mutator = [];
	    this.newly_added_file = [];
	    this.newly_added_path = [];
	},

	reset_newly_removed_lists: function() {
	    this.newly_removed_mutator = [];
	    this.newly_removed_files = [];
	    this.newly_removed_path = [];
	},

	mutator_name_is_used: function(name) {
	    return $.inArray(name, this.mutators) != -1;
	},

	create_dot_code_from_paths: function() {
	    return black_dot_code_paths(this.paths);
	},

	create_dot_code_for_newly_added_paths: function() {
	    return green_dot_code_paths(this.newly_added_path);
	},
	
	create_dot_code_for_newly_removed_paths: function() {
	    return red_dot_code_paths(this.newly_removed_path);
	},

	file_name_is_used: function(file_name) {
	    return $.inArray(file_name, this.files) != -1;
	},

	create_new_output_file: function() {
	    var name = random_file_name();
	    while( this.file_name_is_used(name) ) {
		name = random_file_name();
	    }
	    var output = new_output(name);
	    this.add_new_file_to_list(output);
	    return output;
	},

	add_new_file_to_list: function(new_file) {
	    this.newly_added_file.push(new_file);
	},
	
	add_node_from: function(source,new_node) {
	    this.paths.push([source,new_node]);
	},

	choose_random_mutator: function() {
	    return choose_one_randomly(this.mutators);
	},
	
	add_output_node_from_random_mutator_node: function() {
	    var chosen = this.choose_random_mutator();
	    var path_indices = [];
	    var len = this.paths.length;
	    for(var i = 0; i < len; i++) {
		var index = this.paths[i].indexOf(chosen);
		if ( index != -1 ) {
		    path_indices.push(i);
		}
	    }
	    var path_index = choose_one_randomly(path_indices);
	    var output_file = this.create_new_output_file(); 
	    var copy = copy_path(this.paths[path_index]);
	    var mutator_index = copy.indexOf(chosen);
	    copy.splice(mutator_index+1,0,output_file);
	    copy.splice(mutator_index+2,copy.length-mutator_index-2);
	    this.add_new_path_to_list(copy);
	},

	randomly_choose_existing_path: function() {
	    return choose_one_randomly(this.paths);
	},
	
	remove_chosen_from_files: function(chosen) {
	    var index=this.files.indexOf(chosen);
	    this.add_output_node_to_remove_list(this.files[index]);
	    this.files.splice(index,1);
	},

	add_output_node_to_remove_list: function(file) {
	    this.newly_removed_files.push(file);
	},
	
	pick_random_output_node: function() {
	    return choose_one_randomly(this.files);
	},

	remove_random_output_node: function() { 
	    var chosen=this.pick_random_output_node();
	    this.remove_all_paths_with_node(chosen);
	    this.remove_chosen_from_files(chosen);
	},

	remove_chosen_node_from_mutators: function(chosen) {
	    var index=this.mutators.indexOf(chosen);
	    this.add_mutator_to_remove_list(this.mutators[index]);
	    this.mutators.splice(index,1);
	},

	add_mutator_to_remove_list: function(mutator) {
	    this.newly_removed_mutator.push(mutator);
	},

	path_is_dummy_path: function(index) {
	    return ((this.paths[index][0] == STDIN) && 
		    (this.paths[index][1] == STDOUT) && 
		    (this.paths[index].length == 2));
	},
	
	path_is_single_node: function(index) {
	    return (this.paths[index].length == 1);
	},

	path_should_be_removed: function(index) {
	    return (this.path_is_single_node(index) || 
		    this.path_is_dummy_path(index));
	},
	
	remove_chosen_node_from_all_paths: function(chosen) { 
	    var len=this.paths.length;
	    while(len--) {
		var i=len;
		var index=this.paths[i].indexOf(chosen);
		if ( index != -1 ) {
		    this.add_path_to_newly_removed(copy_path(this.paths[i]));
		    this.paths[i].splice(index,1);
		    if ( this.path_should_be_removed(i) ) { 
			this.paths.splice(i,1);
		    }
		}
	    }
	},

	remove_all_paths_with_node: function(chosen) {  
	    var len = this.paths.length;
	    var elem = null;
	    while(len--) {
		elem = this.paths[len];
		var index = elem.indexOf(chosen);
		if ( index != -1 ) {
		    this.remove_mutators_that_are_not_in_other_paths(elem);
		    this.add_path_to_newly_removed(elem);
		    this.paths.splice(len,1);
		}
	    }
	},

	remove_mutators_that_are_not_in_other_paths: function(path) {
	    var len = path.length, elem = null;
	    for (var i = 0; i < len; i++ ) { 
		elem = path[i];
		if ( this.is_mutator(elem) && 
		     this.is_not_in_other_paths(path,elem) ) {
		    this.remove_chosen_node_from_mutators(elem);		    
		}
	    }
	},

	is_mutator: function(node) { 
	    return ( this.mutators.indexOf(node) != -1);
	},

	is_not_in_other_paths: function(ignore_path,node) {
	    var len = this.paths.length, elem = null;
	    for (var i = 0; i < len; i++) {
		elem = this.paths[i];
		if ( elem == ignore_path ) { 
		    continue; 
		}
		if ( elem.indexOf(node) != -1 ) {
		    return false;
		}
	    }
	    return true;
	},
	
	add_path_to_newly_removed: function(path) {
	    this.newly_removed_path.push(path);
	},
	
	pick_random_mutator_node: function() {
	    return choose_one_randomly(this.mutators);
	},
	
	remove_random_mutator_node: function() {
	    var chosen=this.pick_random_mutator_node();
	    this.remove_chosen_node_from_all_paths(chosen);
	    this.remove_chosen_node_from_mutators(chosen);
	},

	there_are_any_output_nodes: function() {
	    return (this.files.length > 0);
	},
	
	there_are_any_mutator_nodes: function() {
	    return (this.mutators.length > 0);
	},

        determine_possible_to_remove: function() {
	    var possibles=[];
	    if (this.there_are_any_output_nodes()) {
		possibles.push('output');
	    }
	    if (this.there_are_any_mutator_nodes()) {
		possibles.push('mutator');
	    }
	    return possibles;
	},
	
	add_output_node_randomly_from_input_node_or_mutator_node: function() {
	    var possibles=['stdin'];
	    if (this.there_are_any_mutator_nodes()) {
		possibles.push('mutator');
	    }
	    var chosen=choose_one_randomly(possibles);
	    if ( chosen == 'stdin' ) {
		this.add_output_node_from_input();
	    }else{
		this.add_output_node_from_random_mutator_node();
	    }
	},
	
	add_output_node_from_input: function() {
	    this.add_new_path_to_list([STDIN,this.create_new_output_file()]);
	},

	create_output_shapes_dot_code: function() {
	    return create_shape_dot_code(this.files,"black");
	},
	
	create_newly_added_output_shapes_dot_code: function() {
	    return create_shape_dot_code(this.newly_added_file,"green");
	},

	create_newly_removed_output_shapes_dot_code: function() {
	    return create_shape_dot_code(this.newly_removed_files,"red");
	},

	create_mutator_shapes_dot_code: function() {
	    return create_shape_dot_code(this.mutators,"black");
	},

	create_newly_added_mutator_shapes_dot_code: function() {
	    return create_shape_dot_code(this.newly_added_mutator,"green");
	},

	create_newly_removed_mutator_shapes_dot_code: function() {
	    return create_shape_dot_code(this.newly_removed_mutator,"red");
	},	

	generate_shape_dot_code: function() {
	    return create_edge_shape_dot_code() 
	        +  this.create_output_shapes_dot_code()
		+  this.create_newly_added_output_shapes_dot_code()
		+  this.create_newly_removed_output_shapes_dot_code()
	        +  this.create_mutator_shapes_dot_code() 
	        +  this.create_newly_added_mutator_shapes_dot_code() 
	        +  this.create_newly_removed_mutator_shapes_dot_code();
	},

	generate_paths_dot_code: function() { 	    
	    return this.create_dot_code_for_newly_added_paths()
		+  this.create_dot_code_for_newly_removed_paths()
	        +  this.create_dot_code_from_paths();
	},

	make_graphviz_graph: function()
	{
	    var URL = 'https://chart.googleapis.com/chart';
	    var shape_dot_code = this.generate_shape_dot_code();
	    var paths_dot_code = this.generate_paths_dot_code();
	    var dot_code = 'strict digraph gr{ '
		+ shape_dot_code
		+ paths_dot_code
		+ ' }';
	    $("<form action="+URL+" method='POST' target='graph_frame'></form>")
	    	.append("<input type='hidden' name='cht' value='gv'/>")
	    	.append("<input type='hidden' name='chl' value='"+dot_code+"'/>")
	    	.appendTo('body')
	    	.submit()
	    	.remove();
	}
    };
    return graph;
}

var graph = new_graph();

function switch_the_button_into_done_button() {
    $('#the_button').attr('value',"Done");
    $('#the_button').attr('onclick','graph.done_and_draw()');
}

function switch_the_button_into_next_step_button() {
    $('#the_button').attr('value',"Next step");
    $('#the_button').attr('onclick','graph.next_step_and_draw()');
}

function black_dot_code_paths(path) {
    return colored_paths(path,"black");
}

function green_dot_code_paths(path) {
    return colored_paths(path,"green");
}

function red_dot_code_paths(path) {
    return colored_paths(path,"red");
}

function colored_paths(path,color) {
    var len = path.length, elem = null;
    var dot_code = [];
    for (var i = 0; i < len; i++) {
	elem = path[i];
	var nodes = elem.length;
	for (var j = 1; j < nodes; j++) {
	    dot_code.push(elem[j-1].generate_dot_code() 
			  + '->'
			  + elem[j].generate_dot_code() 
			  + '[color='+color+'];');
	}
    }
    return dot_code.join(';');
}

function red_elements(array) {
    return colored_elements(array,"red");
}

function green_elements(array) {
    return colored_elements(array,"green");
}

function colored_elements(array,color) {
    var len = array.length, elem = null;
    var dot_code = [];
    for (var i = 0; i < len; i++) {
	elem = array[i];
	dot_code.push(elem.generate_dot_code(color));
    }	    
    return dot_code.join(';');
}

function copy_path(chosen) {
    var new_edge=[];
    for(var i = 0; i < chosen.length; i++) {
	new_edge[i] = chosen[i];
    }
    return new_edge;
}


function random_mutator_name() {
    return "mutator_"+Math.floor((Math.random()*100)+1);
}

function random_file_name() {
    return "file_"+Math.floor((Math.random()*100)+1);
}

function create_edge_shape_dot_code() {
    return STDIN.generate_shape_dot_code() + 
	STDOUT.generate_shape_dot_code();
}

function create_shape_dot_code(nodes,color) {
    var len = nodes.length;
    var result = [];
    var elem = null;
    for (var i = 0; i < len; i++) {	
	elem = nodes[i];
	result.push( elem.generate_shape_dot_code(color) );
    }
    return result.join(';');
}

function mrz_level(rounds) {
    var titles = ["n00b","beginner","novice","apprentice","journeyman","craftsman","master","grandmaster"];
    var chosen = "";
    var level = 0;
    if (rounds < 5) { 
	chosen = titles[0];
    } else if (rounds >= 5  && rounds < 10) { chosen = titles[1];
    } else if (rounds >= 10 && rounds < 15) { chosen = titles[2];
    } else if (rounds >= 15 && rounds < 20) { chosen = titles[3];
    } else if (rounds >= 20 && rounds < 25) { chosen = titles[4];
    } else if (rounds >= 25 && rounds < 30) { chosen = titles[5];
    } else if (rounds >= 30 && rounds < 35) { chosen = titles[6];
    } else {
	chosen = titles[7];
    }
    if (rounds >= 35) {
	level = rounds - 35;
    } else {
	level = rounds % 5;
    }
    return ("<b>{ level "+level+" "+chosen+" }</b><br/>");
}