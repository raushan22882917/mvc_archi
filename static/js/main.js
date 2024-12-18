document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
        }
    });

    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('promptInput');
    const modelsOutput = document.getElementById('modelsOutput');
    const viewsOutput = document.getElementById('viewsOutput');
    const controllersOutput = document.getElementById('controllersOutput');
    const mvcDiagram = document.getElementById('mvcDiagram');

    generateBtn.addEventListener('click', async function() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        try {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            generateBtn.classList.add('loading');

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update text outputs
                modelsOutput.textContent = data.models || 'No models generated';
                viewsOutput.textContent = data.views || 'No views generated';
                controllersOutput.textContent = data.controllers || 'No controllers generated';

                // Generate diagram
                updateDiagram(data);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert('Error generating MVC structure');
            console.error('Error:', error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate MVC Structure';
            generateBtn.classList.remove('loading');
        }
    });

    function updateDiagram(data) {
        const models = parseComponents(data.models);
        const views = parseComponents(data.views);
        const controllers = parseComponents(data.controllers);

        const diagramDefinition = `
        graph TD
            User((User))
            DB[(Database)]

            subgraph Views
                ${views.map((view, i) => `V${i}[${view}]`).join('\n                ')}
            end

            subgraph Controllers
                ${controllers.map((ctrl, i) => `C${i}[${ctrl}]`).join('\n                ')}
            end

            subgraph Models
                ${models.map((model, i) => `M${i}[${model}]`).join('\n                ')}
            end

            User --> Views
            ${views.map((_, i) => `V${i} --> Controllers`).join('\n            ')}
            ${controllers.map((_, i) => `C${i} --> Models`).join('\n            ')}
            ${models.map((_, i) => `M${i} --> DB`).join('\n            ')}
            ${models.map((_, i) => `M${i} --> Views`).join('\n            ')}

            classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
            classDef userNode fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
            classDef dbNode fill:#f1f8e9,stroke:#689f38,stroke-width:2px;
            classDef viewNode fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
            classDef controllerNode fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
            classDef modelNode fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
            
            class User userNode;
            class DB dbNode;
            ${views.map((_, i) => `class V${i} viewNode`).join(';\n            ')};
            ${controllers.map((_, i) => `class C${i} controllerNode`).join(';\n            ')};
            ${models.map((_, i) => `class M${i} modelNode`).join(';\n            ')};
        `;

        mvcDiagram.innerHTML = diagramDefinition;
        mermaid.contentLoaded();
    }

    function parseComponents(content) {
        if (!content) return [];
        
        return content
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.trim())
            .filter(line => !line.startsWith('-') && !line.startsWith('*'))
            .map(line => {
                const name = line.split(/[:\(\{]/)[0].trim();
                return name.replace(/[^a-zA-Z0-9 ]/g, '');
            })
            .filter(name => name.length > 0)
            .slice(0, 5);
    }
});


