function build_graph(input, cy) {
    _build_graph(null, '_', JSON.parse(input), cy);
}

function node_id(depth, left_depth, right_depth) {
    return `${depth}_${left_depth}_${right_depth}`;
}

function edge_id(source_id, dest_id) {
    return `${source_id}_${dest_id}`;
}

function _build_graph(parent_id, new_node_id, list, cy) {
    var [v, l, r] = list;

    cy.add({ group: 'nodes', data: { label: v, id: new_node_id } });

    if (parent_id !== null) {
        cy.add({
            group: 'edges', data: {
                id: edge_id(new_node_id, parent_id),
                source: parent_id,
                target: new_node_id
            }
        });
    }
    if (l !== null) { _build_graph(new_node_id, new_node_id + 'L', l, cy); }
    if (r !== null) { _build_graph(new_node_id, new_node_id + 'R', r, cy); }
}

var container = document.getElementById('cy');

var cy = cytoscape({
    container: container,
    style: [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(label)'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
            }
        }
    ]
});

const g = (new URL(document.location)).searchParams.get('tree');
try {
    build_graph(g, cy);
} catch (error) {
    alert(`Sorry, can't graph '${g}': ${error}`)
}

cy.layout({ name: 'dagre' }).run();
