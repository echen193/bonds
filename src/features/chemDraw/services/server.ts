import axios from 'axios'

export const retrieveNodeEdgeData = (nodes: any[], edges: any[]): Promise<any> => {
  console.log("Sending nodes:", nodes);
  console.log("Sending edges:", edges);
  return axios.post("http://localhost:5000/get_smiles", {
    nodes,
    edges,
  });
};

export const retrieveNodeEdgeDataUvi = (nodes: any[], edges: any[]): Promise<any> => {
  console.log("Sending nodes:", nodes);
  console.log("Sending edges:", edges);
  return axios.post("http://localhost:8000/get_smiles", {
    nodes,
    edges,
  });
};

