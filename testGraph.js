class Graph {
  constructor() {
    this.neighbors = {}
    this.rawEdges = []
  }

  addEdge(u, v) {
    if (!this.neighbors[u]) this.neighbors[u] = []
    this.neighbors[u].push(v)

    this.rawEdges.push([u, v])
  }

  bfs(start) {
    if (!this.neighbors[start] || !this.neighbors[start].length) {
      return [start]
    }

    var results = {"nodes": []},
        queue = this.neighbors[start],
        count = 1

    while(queue.length) {
      var node = queue.shift()
      if (!results[node] || !results[node].visited) {
        results[node] = {visited: true, steps: count}
        results["nodes"].push(node)
        if (this.neighbors[node]) {
          if (this.neighbors[node].length) {
            count++
            queue.push(...this.neighbors[node])
          } else {
            continue
          }
        }
      }
    }
    return results
  }

  shortestPath(start, end) {
    if (start == end) {
      return [start, end]
    }

    var queue = [start],
        visited = {},
        predecessor = {},
        tail = 0,
        path

    while(tail < queue.length) {
      var u = queue[tail++]
      if (!this.neighbors[u]) {
        continue
      }

      var neighbors = this.neighbors[u]
      for(var i = 0; i < neighbors.length; ++i) {
        var v = neighbors[i]
        if (visited[v]) {
          continue
        }
        visited[v] = true
        if (v === end) {   // Check if the path is complete.
          path = [ v ]   // If so, backtrack through the path.
          while (u !== start) {
            path.push(u)
            u = predecessor[u]
          }
          path.push(u)
          path.reverse()
          return path
        }
        predecessor[v] = u
        queue.push(v)
      }
    }

    return path
  }

  // Breadth First Search using adjacency list
  bfsAdjancyList(v, adjlist, visited) {
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
  }

  getGraphConnectedComponents() {
    const groups = []
    const adjlist = this.convertEdgelistToAdjlist(this.rawEdges)
    const visited = {}

    for (let v in adjlist) {
      if (adjlist.hasOwnProperty(v) && !visited[v]) {
        groups.push(this.bfsAdjancyList(v, adjlist, visited));
      }
    }

    return groups
  }

  convertEdgelistToAdjlist(edgelist) {
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

  getBiggestGraphConnectedComponent() {
    const groups = this.getGraphConnectedComponents()

    const sortedDesc = groups.sort((a,b) => b.length - a.length)
    const max = sortedDesc[0]

    return max
  }
}


  
  // start -> [A]→[B]→[C]→[D] [E]
  //           ↓   ↑       ↓
  //          [F]→[G]→[H] [I]→[J]
  //                   ↓   ↓   ↓
  //          [K]→[L]→[M] [N] [O] -> end
  //           ↓       ↓       ↑
  //          [P]→[Q]→[R]→[S]→[T]
  // Shortest Path 6 A→B→C→D→I→J→O
  
  var createGraph = function() {
    var g = new Graph()
    g.addEdge('A', 'B')
    g.addEdge('B', 'C')
    g.addEdge('C', 'D')
    g.addEdge('D', 'I')
  
    g.addEdge('A', 'F')
    g.addEdge('G', 'B')
    g.addEdge('G', 'H')
    g.addEdge('H', 'M')
    g.addEdge('I', 'N')
    g.addEdge('I', 'J')
    g.addEdge('J', 'O')
  
    g.addEdge('K', 'L')
    g.addEdge('K', 'P')
    g.addEdge('L', 'M')
    g.addEdge('M', 'R')
  
    g.addEdge('P', 'Q')
    g.addEdge('Q', 'R')
    g.addEdge('R', 'S')
    g.addEdge('S', 'T')
    g.addEdge('T', 'O')

    g.addEdge('A', 'B')
    g.addEdge('B', 'C')
    g.addEdge('E', 'D')
    g.addEdge('F', 'G')
    g.addEdge('H', 'F')
    g.addEdge('H', 'G')
    g.addEdge('G', 'D')
    g.addEdge('D', 'C')

    return g
}

const bfsGraph = createGraph()
console.log('bfsGraph.getBiggestGraphConnectedComponent()', bfsGraph.getBiggestGraphConnectedComponent())
const path = bfsGraph.shortestPath('A', 'O')

console.log('path: ', path)

