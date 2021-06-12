// Converts an edgelist to an adjacency list representation
// In this program, we use a dictionary as an adjacency list,
// where each key is a vertex, and each value is a list of all
// vertices adjacent to that vertex
var convert_edgelist_to_adjlist = function(edgelist) {
    var adjlist = {};
    var i, len, pair, u, v;
    for (i = 0, len = edgelist.length; i < len; i += 1) {
      pair = edgelist[i];
      u = pair[0];
      v = pair[1];
      if (adjlist[u]) {
        // append vertex v to edgelist of vertex u
        adjlist[u].push(v);
      } else {
        // vertex u is not in adjlist, create new adjacency list for it
        adjlist[u] = [v];
      }
      if (adjlist[v]) {
        adjlist[v].push(u);
      } else {
        adjlist[v] = [u];
      }
    }
    return adjlist;
  };
  
  // Breadth First Search using adjacency list
  var bfs = function(v, adjlist, visited) {
    var q = [];
    var current_group = [];
    var i, len, adjV, nextVertex;
    q.push(v);
    visited[v] = true;
    while (q.length > 0) {
      v = q.shift();
      current_group.push(v);
      // Go through adjacency list of vertex v, and push any unvisited
      // vertex onto the queue.
      // This is more efficient than our earlier approach of going
      // through an edge list.
      adjV = adjlist[v];
      for (i = 0, len = adjV.length; i < len; i += 1) {
        nextVertex = adjV[i];
        if (!visited[nextVertex]) {
          q.push(nextVertex);
          visited[nextVertex] = true;
        }
      }
    }
    return current_group;
  };
  
  var pairs = [
    ["A", "B"],
    ["B", "C"],
    ["E", "D"],
    ["F", "G"],
    ["H", "F"],
    ["H", "G"],
    ["G", "D"],
    ["D", "C"]
  ];
  
  var groups = [];
  var visited = {};
  var v;

  var adjlist = convert_edgelist_to_adjlist(pairs);

  console.log('adjlist: ', adjlist)
  
  for (v in adjlist) {
    if (adjlist.hasOwnProperty(v) && !visited[v]) {
      groups.push(bfs(v, adjlist, visited));
    }
  }
  
  console.log(groups);