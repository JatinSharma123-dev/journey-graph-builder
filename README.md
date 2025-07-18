# Journey Graph Builder

A React-based application for creating and managing journey flows with visual graph representation.

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── journey/         # Journey-specific components
│   └── tabs/            # Tab components for different sections
├── context/             # React Context for state management
├── hooks/               # Custom React hooks
├── lib/                 # External library configurations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── constants/           # Application constants
```

## Key Concepts

### Journey
A journey represents a complete workflow with nodes, edges, functions, and properties.

### Nodes
Individual steps or decision points in the journey flow.

### Edges
Connections between nodes that define the flow direction.

### Functions
External API calls or operations that can be executed at nodes.

### Properties
Data fields that flow through the journey.

### Mappings
Connections between nodes and functions that define when functions should execute.

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to view the application

## Usage

1. **Create Journey**: Start by creating a new journey with name and description
2. **Add Properties**: Define data fields that will be used throughout the journey
3. **Create Nodes**: Add workflow steps and decision points
4. **Define Functions**: Set up API calls and external operations
5. **Map Functions to Nodes**: Connect functions to specific nodes
6. **Create Edges**: Define the flow between nodes
7. **Preview**: Visualize the complete journey graph