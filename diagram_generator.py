from graphviz import Digraph
import os

class DiagramGenerator:
    @staticmethod
    def generate_mvc_diagram(components):
        dot = Digraph(comment='MVC Architecture')
        dot.attr(rankdir='TB', splines='ortho')
        
        # Node styles
        dot.attr('node', shape='box', style='rounded,filled', fontname='Arial')
        
        # Create clusters (subgraphs)
        with dot.subgraph(name='cluster_0') as c:
            c.attr(label='Views', style='rounded', color='blue', bgcolor='lightblue:white')
            for i, view in enumerate(components.get('views', [])):
                c.node(f'view_{i}', view, fillcolor='lightblue')
        
        with dot.subgraph(name='cluster_1') as c:
            c.attr(label='Controllers', style='rounded', color='green', bgcolor='lightgreen:white')
            for i, controller in enumerate(components.get('controllers', [])):
                c.node(f'ctrl_{i}', controller, fillcolor='lightgreen')
        
        with dot.subgraph(name='cluster_2') as c:
            c.attr(label='Models', style='rounded', color='red', bgcolor='lightpink:white')
            for i, model in enumerate(components.get('models', [])):
                c.node(f'model_{i}', model, fillcolor='lightpink')
        
        # Add special nodes
        dot.node('user', 'User', shape='circle', style='filled', fillcolor='lightyellow')
        dot.node('db', 'Database', shape='cylinder', style='filled', fillcolor='lightgray')
        
        # Add edges
        for i in range(len(components.get('views', []))):
            dot.edge('user', f'view_{i}')
            for j in range(len(components.get('controllers', []))):
                dot.edge(f'view_{i}', f'ctrl_{j}')
        
        for i in range(len(components.get('controllers', []))):
            for j in range(len(components.get('models', []))):
                dot.edge(f'ctrl_{i}', f'model_{j}')
        
        for i in range(len(components.get('models', []))):
            dot.edge(f'model_{i}', 'db')
            # Add feedback loop to views
            if i < len(components.get('views', [])):
                dot.edge(f'model_{i}', f'view_{i}', 'updates')
        
        return dot

    @staticmethod
    def save_diagram(components):
        try:
            static_dir = os.path.join('static', 'diagrams')
            os.makedirs(static_dir, exist_ok=True)
            
            dot = DiagramGenerator.generate_mvc_diagram(components)
            filename = os.path.join(static_dir, 'mvc_architecture')
            dot.render(filename, format='png', cleanup=True)
            
            return 'diagrams/mvc_architecture.png'
        except Exception as e:
            print(f"Error generating diagram: {str(e)}")
            return None