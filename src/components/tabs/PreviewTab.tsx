import React, { useEffect, useRef, useState } from 'react';
import { useJourney } from '../../context/JourneyContext';
import { Node } from '../../types/journey';
import { X, Settings, Link, Database } from 'lucide-react';

const PreviewTab: React.FC = () => {
  const { journey } = useJourney();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    if (svgRef.current) {
      renderGraph();
    }
  }, [journey]);

  const renderGraph = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;

    // Clear existing content
    svg.innerHTML = '';

    // Create definitions for arrowheads
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#374151');

    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Position nodes in a grid layout
    const nodes = journey.nodes.map((node, index) => {
      const cols = Math.ceil(Math.sqrt(journey.nodes.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = (col + 1) * (width / (cols + 1));
      const y = (row + 1) * (height / (Math.ceil(journey.nodes.length / cols) + 1));
      
      return {
        ...node,
        x: node.x || x,
        y: node.y || y
      };
    });

    // Store node positions for click detection
    const positions: { [key: string]: { x: number; y: number } } = {};
    nodes.forEach(node => {
      positions[node.id] = { x: node.x, y: node.y };
    });
    setNodePositions(positions);

    // Draw edges
    const filteredEdges = journey.edges.filter(edge => {
  const fromNode = journey.nodes.find(n => n.id === edge.fromNodeId);
  return fromNode && fromNode.type !== 'dead_end';
});
filteredEdges.forEach(edge => {
  const fromNode = nodes.find(n => n.id === edge.fromNodeId);
  const toNode = nodes.find(n => n.id === edge.toNodeId);
      // Don't draw edges from dead_end nodes
      if (fromNode && toNode) {
        // Draw line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x.toString());
        line.setAttribute('y1', fromNode.y.toString());
        line.setAttribute('x2', toNode.x.toString());
        line.setAttribute('y2', toNode.y.toString());
        line.setAttribute('stroke', '#374151');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(line);

        // Add condition label if exists
        if (edge.validationCondition) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', midX.toString());
          text.setAttribute('y', (midY - 4).toString());
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('font-size', '12');
          text.setAttribute('fill', '#6B7280');
          text.setAttribute('font-family', 'system-ui, sans-serif');
          text.textContent = edge.validationCondition;
          svg.appendChild(text);
        }
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', '35');
      circle.setAttribute('fill', getNodeColor(node.type));
      circle.setAttribute('stroke', selectedNode?.id === node.id ? '#3B82F6' : '#374151');
      circle.setAttribute('stroke-width', selectedNode?.id === node.id ? '3' : '2');
      circle.setAttribute('cursor', 'pointer');
      circle.addEventListener('click', () => handleNodeClick(node));
      svg.appendChild(circle);

      // Node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x.toString());
      text.setAttribute('y', (node.y + 5).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#1F2937');
      text.setAttribute('font-family', 'system-ui, sans-serif');
      text.setAttribute('cursor', 'pointer');
      text.textContent = node.name;
      text.addEventListener('click', () => handleNodeClick(node));
      svg.appendChild(text);

      // Properties count
      if (node.properties.length > 0) {
        const propText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        propText.setAttribute('x', node.x.toString());
        propText.setAttribute('y', (node.y + 45).toString());
        propText.setAttribute('text-anchor', 'middle');
        propText.setAttribute('font-size', '10');
        propText.setAttribute('fill', '#6B7280');
        propText.setAttribute('font-family', 'system-ui, sans-serif');
        propText.setAttribute('cursor', 'pointer');
        propText.textContent = `${node.properties.length} props`;
        propText.addEventListener('click', () => handleNodeClick(node));
        svg.appendChild(propText);
      }

      // Function mapping indicator
      const mapping = journey.mappings.find(m => m.nodeId === node.id);
      if (mapping) {
        const funcIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        funcIndicator.setAttribute('cx', (node.x + 20).toString());
        funcIndicator.setAttribute('cy', (node.y - 20).toString());
        funcIndicator.setAttribute('r', '8');
        funcIndicator.setAttribute('fill', '#8B5CF6');
        funcIndicator.setAttribute('stroke', '#FFFFFF');
        funcIndicator.setAttribute('stroke-width', '2');
        funcIndicator.setAttribute('cursor', 'pointer');
        funcIndicator.addEventListener('click', () => handleNodeClick(node));
        svg.appendChild(funcIndicator);

        const funcText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        funcText.setAttribute('x', (node.x + 20).toString());
        funcText.setAttribute('y', (node.y - 15).toString());
        funcText.setAttribute('text-anchor', 'middle');
        funcText.setAttribute('font-size', '10');
        funcText.setAttribute('font-weight', 'bold');
        funcText.setAttribute('fill', '#FFFFFF');
        funcText.setAttribute('font-family', 'system-ui, sans-serif');
        funcText.setAttribute('cursor', 'pointer');
        funcText.textContent = 'f';
        funcText.addEventListener('click', () => handleNodeClick(node));
        svg.appendChild(funcText);
      }
    });
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start':
        return '#10B981'; // Green for start
      case 'end':
        return '#EF4444'; // Red for end
      case 'dead_end':
        return '#EF4444';
      case 'custom':
        return '#3B82F6';
      case 'loader':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getNodeProperties = (node: Node) => {
    return node.properties.map(propId => 
      journey.properties.find(p => p.id === propId)
    ).filter(Boolean);
  };

  const getNodeMappings = (node: Node) => {
    return journey.mappings.filter(m => m.nodeId === node.id);
  };

  const getNodeFunctions = (node: Node) => {
    const mappings = getNodeMappings(node);
    return mappings.map(mapping => 
      journey.functions.find(f => f.id === mapping.functionId)
    ).filter(Boolean);
  };

  const getConnectedEdges = (node: Node) => {
    return {
      incoming: journey.edges.filter(e => e.toNodeId === node.id),
      outgoing: journey.edges.filter(e => e.fromNodeId === node.id)
    };
  };

  return (
    <div>
      <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>Nodes: {journey.nodes.length}</span>
        <span>Edges: {journey.edges.length}</span>
        <span>Functions: {journey.functions.length}</span>
        <span>Mappings: {journey.mappings.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">Journey Graph</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Start</span>
          </div>
          <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">End</span>
          </div>
          <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Custom</span>
          </div>
          <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Loader</span>
          </div>
          <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Dead_End</span>
          </div>
          <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Function</span>
          </div>
        </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          style={{ background: '#F9FAFB' }}
        />
        </div>

        {journey.nodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No nodes to display. Create some nodes to see the graph visualization.
        </div>
        )}

        {journey.nodes.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Click on any node to view its details
        </div>
        )}
      </div>
      </div>

      {/* Node Details Panel below the graph */}
      {selectedNode && (
      <div className="mt-8 bg-white rounded-lg border p-6 min-w-3xl mx-auto min-h-[600px]">
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Node Details</h3>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        </div>

        <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
          <Settings size={16} className="text-gray-500" />
          <h4 className="font-medium text-gray-900">Node Information</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between gap-2">
          <div className='w-1/3'>
            <span className="text-sm font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-sm text-gray-900">{selectedNode.name}</span>
          </div>
          <div className='w-1/3'>
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {selectedNode.type}
            </span>
          </div>
            <div className='flex gap-2 w-1/3'>
            <span className="text-sm font-medium text-gray-700">Description:</span>
            <p className="text-sm text-gray-900 break-words">{selectedNode.description ? selectedNode.description : 'No description'}</p>
            </div>
          </div>
          </div>
        </div>

        {/* Properties */}
        <div>
          <div className="flex items-center gap-2 mb-3">
          <Database size={16} className="text-gray-500" />
          <h4 className="font-medium text-gray-900">Properties ({getNodeProperties(selectedNode).length})</h4>
          </div>
          <div className="space-y-2">
          {getNodeProperties(selectedNode).length > 0 ? (
            getNodeProperties(selectedNode).map(property => (
            <div key={property!.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-gray-900">{property!.key}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                {property!.type}
              </span>
              </div>
              {property!.validationCondition && (
              <div className="text-xs text-gray-600">
                <strong>Validation:</strong> {property!.validationCondition}
              </div>
              )}
            </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No properties attached</p>
          )}
          </div>
        </div>

        {/* Functions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
          <Settings size={16} className="text-gray-500" />
          <h4 className="font-medium text-gray-900">Functions ({getNodeFunctions(selectedNode).length})</h4>
          </div>
          <div className="space-y-3">
          {getNodeFunctions(selectedNode).length > 0 ? (
            getNodeFunctions(selectedNode).map((func, index) => {
            const mapping = getNodeMappings(selectedNode)[index];
            return (
              <div key={func!.id} className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">{func!.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                {func!.type}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                <strong>{func!.config.method}</strong> {func!.config.host}{func!.config.path}
              </div>
              {mapping?.condition && (
                <div className="text-xs text-gray-600 mb-2">
                <strong>Condition:</strong> {mapping.condition}
                </div>
              )}
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Inputs: {Object.keys(func!.input_properties).length}</span>
                <span>Outputs: {Object.keys(func!.output_properties).length}</span>
              </div>
              </div>
            );
            })
          ) : (
            <p className="text-sm text-gray-500 italic">No functions mapped</p>
          )}
          </div>
        </div>

        {/* Connections */}
        <div>
          <div className="flex items-center gap-2 mb-3">
          <Link size={16} className="text-gray-500" />
          <h4 className="font-medium text-gray-900">Edges</h4>
          </div>
          <div className="space-y-3">
          {(() => {
            const edges = getConnectedEdges(selectedNode);
            return (
            <>
              {edges.incoming.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Incoming edges ({edges.incoming.length})</h5>
                <div className="space-y-1">
                {edges.incoming.map(edge => {
                  const fromNode = journey.nodes.find(n => n.id === edge.fromNodeId);
                  return (
                  <div key={edge.id} className="bg-green-50 rounded p-2 text-sm">
                    <span className="font-medium">{fromNode?.name || 'Unknown'}</span>
                    {edge.validationCondition && (
                    <div className="text-xs text-gray-600 mt-1">
                      Condition: {edge.validationCondition}
                    </div>
                    )}
                  </div>
                  );
                })}
                </div>
              </div>
              )}
              
              {edges.outgoing.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Outgoing edges ({edges.outgoing.length})</h5>
                <div className="space-y-1">
                {edges.outgoing.map(edge => {
                  const toNode = journey.nodes.find(n => n.id === edge.toNodeId);
                  return (
                  <div key={edge.id} className="bg-blue-50 rounded p-2 text-sm">
                    <span className="font-medium">{toNode?.name || 'Unknown'}</span>
                    {edge.validationCondition && (
                    <div className="text-xs text-gray-600 mt-1">
                      Condition: {edge.validationCondition}
                    </div>
                    )}
                  </div>
                  );
                })}
                </div>
              </div>
              )}
              
              {edges.incoming.length === 0 && edges.outgoing.length === 0 && (
              <p className="text-sm text-gray-500 italic">No connections</p>
              )}
            </>
            );
          })()}
          </div>
        </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PreviewTab;