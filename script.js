'use strict';

const API_BASE_URL = 'https://portfolio-j3hj.onrender.com';

// Project descriptions and dates can be edited here.
const projects = [
  {
    "id": "portfolio",
    "title": "Full-stack web portfolio",
    "short": "Full-stack portfolio",
    "subtitle": "A deployed portfolio with a Spring Boot API.",
    "description": "A responsive public website, project suggestions, and a private admin workflow.",
    "tags": [
      "Java",
      "Spring Boot",
      "JavaScript",
      "Docker"
    ],
    "status": "Live",
    "idea": "Build a place to share my work and accept project ideas, with a private workflow for reviewing submissions.",
    "approach": "Deploy the frontend on Vercel and the Spring Boot backend on Render. Send JSON requests from the browser and protect admin actions with expiring bearer tokens.",
    "learning": "API routes, CORS configuration, environment variables, and authentication. Project submissions and admin login have passed live tests.",
    "url": "https://github.com/germanantonelli11-cloud/Portfolio",
    "link": "View source"
  },
  {
    "id": "inventory",
    "title": "Business inventory tracker",
    "short": "Inventory tracker",
    "subtitle": "Organizing inventory, materials, and everyday operations.",
    "description": "A Java application for tracking inventory, material costs, and labor records.",
    "tags": [
      "Java",
      "OOP",
      "File I/O"
    ],
    "status": "In development &#183; Target Dec 2026",
    "idea": "Bring inventory, material costs, labor schedules, and transactions into one place for a small business.",
    "approach": "Model the business with Java objects and store records using file I/O. The browser preview below explores the inventory interaction.",
    "learning": "Object-oriented design, encapsulation, and reliable data handling."
  },
  {
    "id": "matrix",
    "title": "Matrix & linear algebra solver",
    "short": "Matrix solver",
    "subtitle": "Turning mathematical concepts into useful Python tools.",
    "description": "A Python command-line tool for matrix operations and linear equation systems.",
    "tags": [
      "Python",
      "Data Structures",
      "Linear Algebra"
    ],
    "status": "In development &#183; Target Jan 2027",
    "idea": "Translate concepts from mathematics coursework into a tool for exploring matrices and solving linear equations.",
    "approach": "Build a Python command-line tool for determinants, transformations, and systems. This browser preview demonstrates a two-variable system.",
    "learning": "Matrix operations, numerical calculations, and recognizing systems without a unique solution."
  },
  {
    "id": "resources",
    "title": "System resource allocation simulator",
    "short": "Resource simulator",
    "subtitle": "Exploring resource limits and bottlenecks.",
    "description": "A C simulator for resource allocation using sequential updates and conditional logic.",
    "tags": [
      "C",
      "Simulation",
      "Computer Systems"
    ],
    "status": "In development &#183; Target Mar 2027",
    "idea": "Make resource constraints visible and explore what happens when several tasks compete for a limited capacity.",
    "approach": "Build a command-line simulation in C using sequential updates and conditional logic. This browser preview illustrates demand compared with capacity.",
    "learning": "Resource allocation, bottlenecks, and clear state updates."
  }
];

const initialInventory = [
  { name: 'Laptop', category: 'Electronics', quantity: 5 },
  { name: 'Keyboard', category: 'Electronics', quantity: 12 },
  { name: 'Office chair', category: 'Furniture', quantity: 8 },
  { name: 'Notebook', category: 'Supplies', quantity: 50 },
  { name: 'Monitor', category: 'Electronics', quantity: 6 }
];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });
}

function tagsHTML(project) {
  return project.tags
    .map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`)
    .join('');
}

function statusHTML(project) {
  const liveClass = project.status === 'Live' ? 'green' : '';
  return `
    <div class="status">
      <span class="dot ${liveClass}" aria-hidden="true"></span>
      ${project.status}
    </div>
  `;
}

function previewHTML(id) {
  if (id === 'portfolio') {
    return `
      <div class="mini-nav">
        <strong>german<span class="blue">.</span></strong>
        <span>Home &nbsp; Projects &nbsp; About</span>
      </div>
      <div class="mini-home">
        <div>
          <h4>Build.<br>Learn.<br>Create.</h4>
          <small>A software engineering portfolio, built one feature at a time.</small>
          <span class="mini-pill">Explore projects &#8599;</span>
        </div>
        <div class="mini-shape"></div>
      </div>
    `;
  }

  if (id === 'inventory') {
    const rows = initialInventory.map((item) => `
      <tr>
        <td>${escapeHTML(item.name)}</td>
        <td>${escapeHTML(item.category)}</td>
        <td>${item.quantity}</td>
      </tr>
    `).join('');

    return `
      <div class="mini-inventory">
        <div class="mini-side">
          <b>Inventory Tracker</b>
          <span>Items</span>
          <span>Add item</span>
          <span>Categories</span>
          <span>File storage</span>
        </div>
        <div class="mini-main">
          <h4>Inventory <span class="blue">+</span></h4>
          <div class="mini-search">Search items...</div>
          <table class="mini-table">
            <thead>
              <tr><th>Name</th><th>Category</th><th>Qty</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (id === 'matrix') {
    // Preserve deliberate newlines inside the terminal preview.
    return `
      <div class="terminal">
        <div class="window-bar">
          <span class="traffic"></span>
          <span class="traffic"></span>
          <span class="traffic"></span>
          <span class="window-label">python solver.py</span>
        </div>
        <pre>Matrix A:
[ 2  1 ]
[ 1 -1 ]

Vector b: [ 5  1 ]

Solution (x):
x1 = 2.0000
x2 = 1.0000
&gt; </pre>
      </div>
    `;
  }

  return `
    <div class="mini-resources">
      <h4>Resource allocation</h4>
      <div class="resource-line">
        Task A &#183; 35%
        <div class="meter"><span style="width: 35%"></span></div>
      </div>
      <div class="resource-line">
        Task B &#183; 45%
        <div class="meter"><span style="width: 45%"></span></div>
      </div>
      <div class="resource-line">
        Available &#183; 20%
        <div class="meter">
          <span style="width: 20%; background: #62c7a7"></span>
        </div>
      </div>
    </div>
  `;
}

function renderProjects() {
  document.getElementById('home-projects').innerHTML = projects
    .slice(0, 3)
    .map((project, index) => `
      <button
        class="project-card"
        data-project-link="${project.id}"
        aria-label="Explore ${escapeHTML(project.title)}"
      >
        <div class="preview" aria-hidden="true">${previewHTML(project.id)}</div>
        <div class="card-body">
          <div class="card-title">
            <span>
              <span class="number">0${index + 1} / </span>
              ${escapeHTML(project.short)}
            </span>
            <span aria-hidden="true">&#8599;</span>
          </div>
          <p>${escapeHTML(project.description)}</p>
          <div class="stack">${project.tags.map(escapeHTML).join(' / ')}</div>
          ${statusHTML(project)}
        </div>
      </button>
    `).join('');

  document.getElementById('project-list').innerHTML = projects
    .map((project, index) => `
      <article class="project-entry" id="project-${project.id}">
        <button
          class="project-row"
          id="toggle-${project.id}"
          data-project-toggle="${project.id}"
          aria-expanded="false"
          aria-controls="panel-${project.id}"
        >
          <div class="preview" aria-hidden="true">${previewHTML(project.id)}</div>
          <div>
            <div class="project-number">0${index + 1} /</div>
            <h2>${escapeHTML(project.title)}</h2>
            <p>${escapeHTML(project.subtitle)}</p>
            <div class="tags">${tagsHTML(project)}</div>
            ${statusHTML(project)}
          </div>
          <div class="row-cta">
            <span class="plus" aria-hidden="true">+</span>
            <span class="toggle-label">View project &#8599;</span>
          </div>
        </button>
        <div
          class="project-panel"
          id="panel-${project.id}"
          role="region"
          aria-labelledby="toggle-${project.id}"
          hidden
        ></div>
      </article>
    `).join('');
}

function route() {
  const requested = location.hash.slice(1);
  const pages = ['home', 'projects', 'about', 'contact'];
  const page = pages.includes(requested) ? requested : 'home';

  document.querySelectorAll('.view').forEach((view) => {
    view.hidden = view.id !== page;
  });

  document.querySelectorAll('nav a').forEach((link) => {
    if (link.dataset.page === page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const title = page === 'home'
    ? 'German Antonelli'
    : `${page.charAt(0).toUpperCase()}${page.slice(1)} | German Antonelli`;
  document.title = `${title} | Portfolio`;
  window.scrollTo(0, 0);
}

let openProjectId = null;
let pendingProjectId = null;

function closeProject() {
  if (!openProjectId) {
    return;
  }

  const id = openProjectId;
  const button = document.getElementById(`toggle-${id}`);
  const panel = document.getElementById(`panel-${id}`);
  button.setAttribute('aria-expanded', 'false');
  button.querySelector('.plus').textContent = '+';
  button.querySelector('.toggle-label').innerHTML = 'View project &#8599;';
  document.getElementById(`project-${id}`).classList.remove('is-open');
  panel.hidden = true;
  panel.replaceChildren();
  openProjectId = null;
}

function openProject(id) {
  if (openProjectId === id) {
    closeProject();
    return;
  }

  closeProject();
  const project = projects.find((item) => item.id === id);
  if (!project) {
    return;
  }

  const panel = document.getElementById(`panel-${id}`);
  const button = document.getElementById(`toggle-${id}`);
  const sourceLink = project.url ? `
    <div class="actions">
      <a class="btn" href="${project.url}" target="_blank" rel="noopener noreferrer">
        ${escapeHTML(project.link)} &#8599;
      </a>
    </div>
  ` : '';

  panel.innerHTML = `
    <div class="project-detail-grid">
      <div class="demo" id="demo"></div>
      <div class="details">
        <h3>The idea</h3>
        <p>${escapeHTML(project.idea)}</p>
        <h3>The approach</h3>
        <p>${escapeHTML(project.approach)}</p>
        <h3>What I'm exploring</h3>
        <p>${escapeHTML(project.learning)}</p>
        ${statusHTML(project)}
        ${sourceLink}
      </div>
    </div>
    <p class="project-panel-note">Click the project heading again to collapse.</p>
  `;

  panel.hidden = false;
  document.getElementById(`project-${id}`).classList.add('is-open');
  button.setAttribute('aria-expanded', 'true');
  button.querySelector('.plus').textContent = '\u2212';
  button.querySelector('.toggle-label').textContent = 'Close project';
  openProjectId = id;
  renderDemo(id);
}

function demoShell(title, content, caption) {
  return `
    <div class="demo-head">
      <span>${title}</span>
      <span>INTERACTIVE PREVIEW</span>
    </div>
    <div class="demo-content">${content}</div>
    <div class="demo-caption">${caption}</div>
  `;
}

function renderDemo(id) {
  const demo = document.getElementById('demo');
  if (id === 'portfolio') {
    renderPortfolioDemo(demo);
  } else if (id === 'inventory') {
    renderInventoryDemo(demo);
  } else if (id === 'matrix') {
    renderMatrixDemo(demo);
  } else {
    renderResourceDemo(demo);
  }
}

function renderPortfolioDemo(demo) {
  demo.innerHTML = demoShell('From request to response', `
    <h3>How the pieces connect</h3>
    <div class="flow-demo">
      <button type="button" data-step="0" aria-pressed="true">
        01 Browser &#8594; JSON request
      </button>
      <button type="button" data-step="1" aria-pressed="false">
        02 Spring Boot &#8594; API handler
      </button>
      <button type="button" data-step="2" aria-pressed="false">
        03 Response &#8594; Interface update
      </button>
    </div>
    <p class="flow-description" id="flow-description" role="status"></p>
  `, 'Architecture illustration. Select a step to explore the request flow.');

  const descriptions = [
    'The frontend sends a projectName value as JSON to POST /api/add-project on the Render backend.',
    'Spring Boot checks the submitted name and creates a pending project. Admin review requests require authorization.',
    'The browser checks the HTTP response and displays confirmation or an error.'
  ];
  const buttons = demo.querySelectorAll('[data-step]');

  function selectStep(index) {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.step) === index));
    });
    demo.querySelector('#flow-description').textContent = descriptions[index];
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => selectStep(Number(button.dataset.step)));
  });
  selectStep(0);
}

function renderInventoryDemo(demo) {
  demo.innerHTML = demoShell('Inventory tracker', `
    <h3>Inventory</h3>
    <label for="inventory-search">Search items</label>
    <input id="inventory-search" class="field" placeholder="Try keyboard...">
    <div class="table-scroll">
      <table class="inventory-table">
        <thead>
          <tr><th>Item</th><th>Quantity</th><th>Action</th></tr>
        </thead>
        <tbody id="inventory-items"></tbody>
      </table>
    </div>
    <p id="inventory-count" class="demo-hint" role="status"></p>
    <form id="add-item" class="add-form">
      <div>
        <label for="item-name">New item</label>
        <input id="item-name" class="field" required maxlength="60" placeholder="Item name">
      </div>
      <div>
        <label for="item-qty">Quantity</label>
        <input id="item-qty" class="field" type="number" min="1" max="999999" value="1" required>
      </div>
      <button class="btn primary small" type="submit">+ Add item</button>
    </form>
  `, 'Browser concept demo. Changes reset when this project closes; the Java application is in development.');

  const items = initialInventory.map((item) => ({ ...item }));
  const search = demo.querySelector('#inventory-search');
  const body = demo.querySelector('#inventory-items');

  function draw() {
    const query = search.value.trim().toLowerCase();
    body.replaceChildren();

    items.forEach((item, index) => {
      if (!item.name.toLowerCase().includes(query)) {
        return;
      }

      const row = document.createElement('tr');
      const name = document.createElement('td');
      const quantity = document.createElement('td');
      const action = document.createElement('td');
      const remove = document.createElement('button');
      name.textContent = item.name;
      quantity.textContent = item.quantity;
      remove.type = 'button';
      remove.className = 'delete-item';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${item.name}`);
      remove.addEventListener('click', () => {
        items.splice(index, 1);
        draw();
      });
      action.append(remove);
      row.append(name, quantity, action);
      body.append(row);
    });

    demo.querySelector('#inventory-count').textContent =
      `${body.children.length} of ${items.length} items shown`;
  }

  search.addEventListener('input', draw);
  demo.querySelector('#add-item').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = demo.querySelector('#item-name').value.trim();
    const quantity = Number(demo.querySelector('#item-qty').value);
    if (!name || !Number.isInteger(quantity) || quantity < 1 || quantity > 999999) {
      return;
    }
    items.push({ name, quantity });
    event.currentTarget.reset();
    draw();
  });
  draw();
}

function renderMatrixDemo(demo) {
  demo.innerHTML = demoShell('Matrix solver', `
    <h3>Solve a linear system</h3>
    <p class="demo-hint">Enter the coefficients for A x = b.</p>
    <form id="matrix-form">
      <div class="matrix-inputs">
        <div class="matrix-grid">
          <input id="a" type="number" step="any" value="2" required aria-label="Row 1 coefficient of x">
          <input id="b" type="number" step="any" value="1" required aria-label="Row 1 coefficient of y">
          <input id="c" type="number" step="any" value="1" required aria-label="Row 2 coefficient of x">
          <input id="d" type="number" step="any" value="-1" required aria-label="Row 2 coefficient of y">
        </div>
        <span aria-hidden="true">=</span>
        <div class="matrix-vector">
          <input id="e" type="number" step="any" value="5" required aria-label="Row 1 result">
          <input id="f" type="number" step="any" value="1" required aria-label="Row 2 result">
        </div>
      </div>
      <button class="btn primary small" type="submit">Solve system &#8594;</button>
    </form>
    <div class="matrix-result" id="matrix-result" role="status" aria-live="polite"></div>
  `, 'Browser demo of a 2 x 2 solver. The Python command-line project is in development.');

  function solve() {
    const values = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) =>
      Number(demo.querySelector(`#${id}`).value)
    );
    const [a, b, c, d, e, f] = values;
    const determinant = a * d - b * c;
    const result = demo.querySelector('#matrix-result');
    const scale = Math.max(Math.abs(a * d), Math.abs(b * c), Number.MIN_VALUE);

    if (![...values, determinant].every(Number.isFinite)) {
      result.textContent = 'Use finite numbers within the supported numeric range.';
      return;
    }
    if (Math.abs(determinant) <= Number.EPSILON * 16 * scale) {
      result.textContent = 'No stable unique solution. The coefficients are singular or nearly singular.';
      return;
    }

    const x = (e * d - b * f) / determinant;
    const y = (a * f - e * c) / determinant;
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      result.textContent = 'The result exceeds the supported numeric range.';
      return;
    }
    result.textContent = `x = ${x.toFixed(4)}; y = ${y.toFixed(4)}\nDeterminant = ${determinant.toFixed(4)}`;
  }

  demo.querySelector('#matrix-form').addEventListener('submit', (event) => {
    event.preventDefault();
    solve();
  });
  solve();
}

function renderResourceDemo(demo) {
  demo.innerHTML = demoShell('Resource allocation', `
    <h3>When demand meets a limit</h3>
    <p class="demo-hint">Total capacity: 100 units. Adjust each task's request.</p>
    <div class="simulation-row">
      <label for="task-a">Task A: <output id="task-a-value">35</output> units</label>
      <input id="task-a" type="range" min="0" max="100" value="35">
      <div class="meter"><span id="task-a-meter"></span></div>
    </div>
    <div class="simulation-row">
      <label for="task-b">Task B: <output id="task-b-value">45</output> units</label>
      <input id="task-b" type="range" min="0" max="100" value="45">
      <div class="meter"><span id="task-b-meter"></span></div>
    </div>
    <div class="matrix-result" id="resource-result" role="status" aria-live="polite"></div>
  `, 'Browser concept demo. The C command-line simulator is in development.');

  function simulate() {
    const a = Number(demo.querySelector('#task-a').value);
    const b = Number(demo.querySelector('#task-b').value);
    demo.querySelector('#task-a-value').value = a;
    demo.querySelector('#task-b-value').value = b;
    demo.querySelector('#task-a-meter').style.width = `${a}%`;
    demo.querySelector('#task-b-meter').style.width = `${b}%`;
    demo.querySelector('#resource-result').textContent = a + b > 100
      ? `Demand: ${a + b} units. Bottleneck: ${a + b - 100} units over capacity.`
      : `Demand: ${a + b} units. Available capacity: ${100 - a - b} units.`;
  }

  demo.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', simulate);
  });
  simulate();
}

// This form uses the existing API. Preview demos run locally in the browser.
document.getElementById('idea-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const idea = form.elements.idea.value.trim();
  const status = document.getElementById('form-status');
  if (!idea) {
    status.textContent = 'Please enter a project idea.';
    return;
  }

  const button = form.querySelector('button');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  button.disabled = true;
  status.textContent = 'Submitting your idea... The backend may take a moment to wake up.';

  try {
    const response = await fetch(`${API_BASE_URL}/api/add-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName: idea }),
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    status.textContent = 'Thanks! Your idea has been submitted for review.';
    form.reset();
  } catch (error) {
    status.textContent = error.name === 'AbortError'
      ? 'The request timed out. Please try again.'
      : 'Could not submit your idea. Please try again or email me.';
  } finally {
    clearTimeout(timer);
    button.disabled = false;
  }
});

renderProjects();
route();

window.addEventListener('hashchange', () => {
  route();
  document.getElementById('main').focus({ preventScroll: true });
  if (pendingProjectId) {
    openProject(pendingProjectId);
    document.getElementById(`toggle-${pendingProjectId}`).focus();
    pendingProjectId = null;
  }
});

document.querySelectorAll('[data-project-toggle]').forEach((button) => {
  button.addEventListener('click', () => openProject(button.dataset.projectToggle));
});

document.querySelectorAll('[data-project-link]').forEach((button) => {
  button.addEventListener('click', () => {
    if (location.hash !== '#projects') {
      pendingProjectId = button.dataset.projectLink;
      location.hash = 'projects';
    } else {
      openProject(button.dataset.projectLink);
      document.getElementById(`toggle-${button.dataset.projectLink}`).focus();
    }
  });
});
