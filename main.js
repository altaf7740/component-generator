function generateHTML() {
    const jsonInput = document.getElementById('query').value;
    let jsonData;
    try {
        jsonData = JSON.parse(jsonInput);
    } catch (error) {
        alert('Invalid JSON input!');
        return;
    }
    const htmlOutput = document.getElementById('section-render-template');
    htmlOutput.innerHTML = '';
    const html = generateHTMLFromJSON(jsonData);
    htmlOutput.innerHTML = html;
}

function generateHTMLFromJSON(jsonData) {
    if (!jsonData.tag) {
        return '';
    }
    const { tag, is_self_closing_tag, attributes, content, children } = jsonData;
    let html = `<${tag}`;
    if (attributes) {
        if (attributes.style) {
            const styleString = Object.entries(attributes.style)
                .map(([key, value]) => `${key}:${value}`)
                .join('; ');
            html += ` style="${styleString}"`;
            delete attributes.style;
        }
        for (const [key, value] of Object.entries(attributes)) {
            if (typeof value === 'object') {
                const attributeString = Object.entries(value)
                    .map(([k, v]) => `${k}:${v}`)
                    .join(' ');
                html += ` ${key}="${attributeString}"`;
            } else {
                html += ` ${key}="${value}"`;
            }
        }
    }
    if (content) {
        html += `>${content}</${tag}>`;
    } else if (is_self_closing_tag) {
        html += ' />';
    } else {
        html += '>';
        if (children && Array.isArray(children)) {
            for (const child of children) {
                html += generateHTMLFromJSON(child);
            }
        }
        html += `</${tag}>`;
    }
    return html;
}



const textarea = document.getElementById('query');

textarea.value = `
{
    "tag": "div",
    "is_self_closing_tag": false,
    "attributes": {
        "style": {
        "display": "flex",
        "justify-content": "center",
        "align-items": "center"
        }
    },
    "children": [
        {
        "tag": "h1",
        "is_self_closing_tag": false,
        "attributes": {
            "style": {
            "color": "red"
            }
        },
        "content": "Hello World"
        },
        {
        "tag": "h1",
        "is_self_closing_tag": false,
        "attributes": {
            "style": {
            "color": "red"
            }
        },
        "content": "Hello World"
        }
    ]
}
`

// Add event listener for keydown event
textarea.addEventListener('keydown', function (event) {
    // Check if the Ctrl key (or Command key on Mac) is pressed and Enter key is pressed simultaneously
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
        event.preventDefault(); // Prevent the default behavior of Enter key in textarea
        generateHTML()
    }
});



