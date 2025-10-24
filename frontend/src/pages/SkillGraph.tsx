import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { 
  Brain, 
  Target, 
  Users, 
  Zap, 
  TrendingUp,
  Filter,
  Search,
  Settings,
  Download,
  Maximize2
} from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  level: number;
  category: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SkillLink {
  source: string;
  target: string;
  strength: number;
  type: string;
}

const SkillGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [links, setLinks] = useState<SkillLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    minLevel: 0,
    maxLevel: 10
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockNodes: SkillNode[] = [
      { id: 'python', name: 'Python', level: 8, category: 'programming' },
      { id: 'javascript', name: 'JavaScript', level: 7, category: 'programming' },
      { id: 'react', name: 'React', level: 6, category: 'frontend' },
      { id: 'nodejs', name: 'Node.js', level: 5, category: 'backend' },
      { id: 'sql', name: 'SQL', level: 7, category: 'database' },
      { id: 'machine_learning', name: 'Machine Learning', level: 4, category: 'ai' },
      { id: 'data_science', name: 'Data Science', level: 5, category: 'analytics' },
      { id: 'aws', name: 'AWS', level: 3, category: 'cloud' },
      { id: 'docker', name: 'Docker', level: 4, category: 'devops' },
      { id: 'git', name: 'Git', level: 8, category: 'tools' },
      { id: 'typescript', name: 'TypeScript', level: 5, category: 'programming' },
      { id: 'graphql', name: 'GraphQL', level: 3, category: 'api' }
    ];

    const mockLinks: SkillLink[] = [
      { source: 'python', target: 'machine_learning', strength: 0.9, type: 'prerequisite' },
      { source: 'python', target: 'data_science', strength: 0.8, type: 'related' },
      { source: 'javascript', target: 'react', strength: 0.9, type: 'prerequisite' },
      { source: 'javascript', target: 'nodejs', strength: 0.8, type: 'related' },
      { source: 'react', target: 'typescript', strength: 0.7, type: 'related' },
      { source: 'nodejs', target: 'aws', strength: 0.6, type: 'related' },
      { source: 'sql', target: 'data_science', strength: 0.8, type: 'prerequisite' },
      { source: 'machine_learning', target: 'data_science', strength: 0.9, type: 'related' },
      { source: 'docker', target: 'aws', strength: 0.7, type: 'related' },
      { source: 'git', target: 'docker', strength: 0.5, type: 'related' }
    ];

    setNodes(mockNodes);
    setLinks(mockLinks);
  }, []);

  useEffect(() => {
    if (nodes.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Filter nodes and links based on current filters
    const filteredNodes = nodes.filter(node => {
      if (filters.category !== 'all' && node.category !== filters.category) return false;
      if (node.level < filters.minLevel || node.level > filters.maxLevel) return false;
      return true;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(link => 
      filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );

    // Create force simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force("link", d3.forceLink(filteredLinks).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter().append("line")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", d => Math.sqrt(d.strength * 5))
      .attr("stroke-opacity", d => d.strength * 0.6);

    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(filteredNodes)
      .enter().append("circle")
      .attr("r", d => Math.max(15, d.level * 3))
      .attr("fill", d => {
        const colors = {
          programming: "#3b82f6",
          frontend: "#8b5cf6",
          backend: "#10b981",
          database: "#f59e0b",
          ai: "#ef4444",
          analytics: "#06b6d4",
          cloud: "#84cc16",
          devops: "#f97316",
          tools: "#6366f1",
          api: "#ec4899"
        };
        return colors[d.category as keyof typeof colors] || "#6b7280";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "#3b82f6").attr("stroke-width", 3);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("stroke", "#ffffff").attr("stroke-width", 2);
      });

    // Add labels
    const labels = svg.append("g")
      .selectAll("text")
      .data(filteredNodes)
      .enter().append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "#374151")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
    };
  }, [nodes, links, filters]);

  const categories = [
    { id: 'all', name: 'All Categories', color: '#6b7280' },
    { id: 'programming', name: 'Programming', color: '#3b82f6' },
    { id: 'frontend', name: 'Frontend', color: '#8b5cf6' },
    { id: 'backend', name: 'Backend', color: '#10b981' },
    { id: 'database', name: 'Database', color: '#f59e0b' },
    { id: 'ai', name: 'AI/ML', color: '#ef4444' },
    { id: 'analytics', name: 'Analytics', color: '#06b6d4' },
    { id: 'cloud', name: 'Cloud', color: '#84cc16' },
    { id: 'devops', name: 'DevOps', color: '#f97316' },
    { id: 'tools', name: 'Tools', color: '#6366f1' }
  ];

  const getNodeDetails = (node: SkillNode) => {
    const relatedSkills = links
      .filter(link => link.source === node.id || link.target === node.id)
      .map(link => {
        const relatedId = link.source === node.id ? link.target : link.source;
        const relatedNode = nodes.find(n => n.id === relatedId);
        return { ...relatedNode, strength: link.strength, type: link.type };
      })
      .filter(Boolean);

    return {
      ...node,
      relatedSkills,
      totalConnections: relatedSkills.length,
      averageStrength: relatedSkills.reduce((sum, skill) => sum + skill.strength, 0) / relatedSkills.length
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Graph</h1>
              <p className="text-gray-600">
                Visualize your skill network and discover learning connections
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="btn-outline flex items-center"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </button>
              <button className="btn-outline flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input w-full"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filters.minLevel}
                    onChange={(e) => setFilters({ ...filters, minLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {filters.minLevel}</span>
                    <span>Max: {filters.maxLevel}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filters.maxLevel}
                    onChange={(e) => setFilters({ ...filters, maxLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Node size = Skill level</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span>Line thickness = Connection strength</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Skills:</span>
                  <span className="font-medium">{nodes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Connections:</span>
                  <span className="font-medium">{links.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Filtered:</span>
                  <span className="font-medium">
                    {nodes.filter(node => {
                      if (filters.category !== 'all' && node.category !== filters.category) return false;
                      if (node.level < filters.minLevel || node.level > filters.maxLevel) return false;
                      return true;
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Graph Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`lg:col-span-3 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
          >
            <div className={`card p-0 ${isFullscreen ? 'h-screen' : 'h-96'}`}>
              <svg
                ref={svgRef}
                width="100%"
                height={isFullscreen ? '100%' : '100%'}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Node Details Modal */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedNode.name}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span className="font-medium">{selectedNode.level}/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{selectedNode.category}</span>
                </div>

                {(() => {
                  const details = getNodeDetails(selectedNode);
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Connections:</span>
                        <span className="font-medium">{details.totalConnections}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg. Strength:</span>
                        <span className="font-medium">
                          {Math.round(details.averageStrength * 100)}%
                        </span>
                      </div>

                      {details.relatedSkills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Related Skills:
                          </h4>
                          <div className="space-y-1">
                            {details.relatedSkills.slice(0, 5).map((skill, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span>{skill.name}</span>
                                <span className="text-gray-500">
                                  {Math.round(skill.strength * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkillGraph;

