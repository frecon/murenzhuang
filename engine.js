var STDIN="STDIN";
var STDOUT="STDOUT";

var paths;
var files;
var mutators;

function initialize()
{
    files=[];
    paths=[];
    mutators=[];
    paths.push([STDIN,STDOUT]);
}

function add_mutator_from_input()
{ 
    var mutator=create_new_mutator();
    add_node_between(STDIN,mutator,STDOUT);
}
  
function add_output_node_from_input()
{
    var output_file=create_new_output_file();
    add_node_from(STDIN,output_file);
}

function add_mutator_randomly_on_edge()
{
    var mutator=create_new_mutator();
    var rand_i=Math.floor(Math.random()*paths.length);
    var chosen=paths[(rand_i > 0 ? rand_i -1 : rand_i)];
    var possible_points=chosen.length-1;           
    var point=Math.floor(Math.random()*possible_points+1);
    paths.push(chosen.splice(point,0,mutator));
}

function add_output_node_randomly_from_input_node_or_mutator_node()
{
    if (Math.round(Math.random()) == 0)
	{
	    add_output_node_from_input();
	}else
	{
	    add_output_node_from_random_mutator_node();
	}
}
 
function add_output_node_from_random_mutator_node()
{
    var output_file=create_new_output_file();
    var rand_i=Math.floor(Math.random()*mutators.length);
    var chosen=mutators[(rand_i > 0 ? rand_i -1 : rand_i)];
    paths.push([chosen,output_file]);
}

function add_node_from(source,new_node)
{
    paths.push([source,new_node]);
}
 
function add_node_between(source,new_node,end)
{
    paths.push([source,new_node,end]);
}

function create_new_mutator()
{
    var name=random_mutator_name();
    while( mutator_name_is_used(name) )
	{
	    name=random_mutator_name();
	}
    mutators.push(name);
    return name;           
}

function mutator_name_is_used(name)
{
    return $.inArray(name, mutators) != -1
	}

function random_mutator_name()
{
    return "mutator_"+Math.floor((Math.random()*100)+1);
}

function create_new_output_file()
{
    var file_name=random_file_name();
    while( file_name_is_used(file_name) )
	{
	    file_name=random_file_name();
	}
    files.push(file_name);
    return file_name;
}      

function file_name_is_used(file_name)
{
    return $.inArray(file_name, files) != -1
	}

function random_file_name()
{
    return "file_"+Math.floor((Math.random()*100)+1);
}

function create_output_shape_dot_code()
{
    var output="";
    var length = files.length, element = null;
    for(var i = 0; i < length; i++)
	{
	    output+=files[i]+'[shape="note"];'
		}
    return output;
}

function create_dot_code_from_paths()
{          
    var length = paths.length, element = null;
    var dot_paths=[];
    for (var i = 0; i < length; i++)
	{
	    element = paths[i];
	    var parts = element.length, subpart = null;
	    for (var j = 1; j < parts; j++)
		{
		    dot_paths.push(element[j-1]+"->"+element[j]);
		}
	}
    var dot_code="";
    var length = dot_paths.length, element = null;
    for (var i = 0; i < length; i++)
	{
	    dot_code+=dot_paths[i]+";";
	}
    return dot_code;
}

function make_graphviz_graph()
{                        
    output_shapes = create_output_shape_dot_code();
    path_dot_code = create_dot_code_from_paths();
    dot_code = 'digraph gr{ ' + output_shapes + path_dot_code + ' }';
    options = {cht: "gv", chl: dot_code };
    request = "https://chart.googleapis.com/chart?"+$.param(options);
    $('#graph_img').attr('src',request);
}
