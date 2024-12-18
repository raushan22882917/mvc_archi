class VisualDiagramGenerator {
    constructor(svgId) {
        this.svg = d3.select(`#${svgId}`);
        this.width = 800;
        this.height = 600;
        this.svg.attr('width', this.width).attr('height', this.height);
        
        // Initialize dagre-d3
        this.g = new dagreD3.graphlib.Graph().setGraph({});
        this.render = new dagreD3.render();
        
        // Set up zoom behavior
        this.zoom = d3.zoom().on('zoom', (event) => {
            this.svg.select('g').attr('transform', event.transform);
        });
        
        this.svg.call(this.zoom);
    }

    generateDiagram(data) {
        // Clear previous diagram
        this.svg.selectAll('*').remove();
        this.g = new dagreD3.graphlib.Graph().setGraph({
            rankdir: 'TB',
            marginx: 20,
            marginy: 20,
            ranksep: 50,
            nodesep: 30,
            edgesep: 20
        });

        // Add nodes
        this.addNodes(data);
        
        // Add edges
        this.addEdges(data);

        // Create the renderer
        const svgGroup = this.svg.append('g');
        this.render(svgGroup, this.g);

        // Center the graph
        const initialScale = 0.75;
        const xCenterOffset = (this.width - this.g.graph().width * initialScale) / 2;
        const yCenterOffset = 50;
        this.svg.call(this.zoom.transform, d3.zoomIdentity
            .translate(xCenterOffset, yCenterOffset)
            .scale(initialScale));
    }

    addNodes(data) {
        // Add User node
        this.g.setNode('user', {
            label: 'User',
            shape: 'circle',
            class: 'user-node'
        });

        // Add Database node
        this.g.setNode('db', {
            label: 'Database',
            shape: 'cylinder',
            class: 'db-node'
        });

        // Add component nodes
        ['models', 'views', 'controllers'].forEach((type, typeIndex) => {
            const components = this.parseComponents(data[type]);
            components.forEach((component, index) => {
                const id = `${type}_${index}`;
                this.g.setNode(id, {
                    label: component,
                    class: `${type}-node`,
                    rx: 5,
                    ry: 5
                });
            });
        });

        // Set default styles for all nodes
        this.g.nodes().forEach(v => {
            const node = this.g.node(v);
            node.padding = 10;
        });
    }

    addEdges(data) {
        const models = this.parseComponents(data.models);
        const views = this.parseComponents(data.views);
        const controllers = this.parseComponents(data.controllers);

        // User to Views
        views.forEach((_, index) => {
            this.g.setEdge('user', `views_${index}`, {
                label: 'interacts',
                class: 'edge-label'
            });
        });

        // Views to Controllers
        views.forEach((_, vIndex) => {
            controllers.forEach((_, cIndex) => {
                this.g.setEdge(`views_${vIndex}`, `controllers_${cIndex}`, {
                    label: 'requests',
                    class: 'edge-label'
                });
            });
        });

        // Controllers to Models
        controllers.forEach((_, cIndex) => {
            models.forEach((_, mIndex) => {
                this.g.setEdge(`controllers_${cIndex}`, `models_${mIndex}`, {
                    label: 'manages',
                    class: 'edge-label'
                });
            });
        });

        // Models to Database
        models.forEach((_, index) => {
            this.g.setEdge(`models_${index}`, 'db', {
                label: 'persists',
                class: 'edge-label'
            });
        });

        // Models to Views (updates)
        models.forEach((_, mIndex) => {
            views.forEach((_, vIndex) => {
                this.g.setEdge(`models_${mIndex}`, `views_${vIndex}`, {
                    label: 'updates',
                    class: 'edge-label',
                    curve: d3.curveBasis
                });
            });
        });
    }

    parseComponents(content) {
        if (!content) return [];
        return content
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.trim())
            .filter(line => !line.startsWith('-') && !line.startsWith('*'))
            .map(line => line.split(/[:\(\{]/)[0].trim())
            .filter(name => name.length > 0)
            .slice(0, 5);
    }
}