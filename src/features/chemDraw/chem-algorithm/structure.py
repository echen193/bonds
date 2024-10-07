from typing import List, Dict, Tuple
import uuid

class Node:
    def __init__(self, label: str):
        self.id = str(uuid.uuid4())
        self.label = label
        self.x = 0
        self.y = 0
        self.selected = False

class Edge:
    def __init__(self, from_node: str, to_node: str, bond_type: str):
        self.id = str(uuid.uuid4())
        self.from_node = from_node
        self.to_node = to_node
        self.bond_type = bond_type
        self.selected = False


def get_adjacent_nodes(node_id: str, edges: List[Edge], nodes: List[Node]) -> List[Tuple[Node, str]]:
    adjacent = []
    for edge in edges:
        if edge.from_node == node_id:
            adjacent.append((find_node_by_id(edge.to_node, nodes), edge.bond_type))
        elif edge.to_node == node_id:
            adjacent.append((find_node_by_id(edge.from_node, nodes), edge.bond_type))
    return adjacent

def find_node_by_id(node_id: str, nodes: List[Node]) -> Node:
    for node in nodes:
        if node.id == node_id:
            return node
    return None

def generate_smiles(nodes: List[Node], edges: List[Edge]) -> str:
    visited = set()
    smiles = ""
    ring_closures = {}
    current_ring_label = 1

    def visit(node: Node, bond: str = ""):
        nonlocal smiles, current_ring_label
        if node.id in visited:
            if node.id not in ring_closures:
                ring_closures[node.id] = current_ring_label
                current_ring_label += 1
            smiles += bond + str(ring_closures[node.id])
            return
        visited.add(node.id)
        smiles += bond + node.label
        adjacent_nodes = get_adjacent_nodes(node.id, edges, nodes)
        branches = []
        for adj_node, bond_type in adjacent_nodes:
            if adj_node.id not in visited:
                branches.append((adj_node, bond_type))
        for i, (adj_node, bond_type) in enumerate(branches):
            if i > 0:
                smiles += "("
            visit(adj_node, bond_type)
            if i > 0:
                smiles += ")"

    start_node = nodes[0]  # Start from the first node
    visit(start_node)

    return smiles

if __name__ == "__main__":
    # Example nodes and edges for cyclohexane (C1CCCCC1)
    nodes = [
        Node(label="C"),
        Node(label="C"),
        Node(label="C"),
        Node(label="C"),
        Node(label="C"),
        Node(label="C"),
    ]
    nodes[0].id = "1"
    nodes[1].id = "2"
    nodes[2].id = "3"
    nodes[3].id = "4"
    nodes[4].id = "5"
    nodes[5].id = "6"
    
    edges = [
        Edge(from_node="1", to_node="2", bond_type="-"),
        Edge(from_node="2", to_node="3", bond_type="-"),
        Edge(from_node="3", to_node="4", bond_type="-"),
        Edge(from_node="4", to_node="5", bond_type="-"),
        Edge(from_node="5", to_node="6", bond_type="-"),
        Edge(from_node="6", to_node="1", bond_type="-"),
    ]

    smiles = generate_smiles(nodes, edges)
    print("SMILES:", smiles)