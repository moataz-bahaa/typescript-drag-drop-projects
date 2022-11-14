"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project type
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find((p) => p.id === projectId);
        if (!project || project.status === newStatus)
            return;
        project.status = newStatus;
        this.updateListeners();
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email.toLowerCase());
};
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid && (isValid = validatableInput.value.toString().trim().length !== 0);
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid && (isValid = validatableInput.value.trim().length >= validatableInput.minLength);
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid && (isValid = validatableInput.value.trim().length <= validatableInput.maxLength);
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid && (isValid = validatableInput.value >= validatableInput.min);
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid && (isValid = validatableInput.value <= validatableInput.max);
    }
    if (validatableInput.isEmail) {
        isValid && (isValid = typeof validatableInput.value === 'string' && validateEmail(validatableInput.value));
    }
    return isValid;
}
// autho bind decorator
function Autobind(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
// Component base class
class Component {
    constructor(templateId, hostElmentId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElmentId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBegaining) {
        // rendering element in the dom
        this.hostElement.insertAdjacentElement(insertAtBegaining ? 'afterbegin' : 'beforeend', this.element);
    }
}
// Project item class
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        return this.project.people === 1 ? '1 person' : `${this.project.people} persons`;
    }
    dragStartHandler(event) {
        var _a;
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_) {
        console.log('Drag end');
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
        this.element.querySelector('p').textContent = this.project.description;
    }
}
__decorate([
    Autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    Autobind
], ProjectItem.prototype, "dragEndHandler", null);
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault(); // default is disabling drop
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHandler(event) {
        const projectId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    dragLeaveHandler(event) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + 'PROJECTS';
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects) => {
            this.assignedProjects = projects.filter((project) => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            });
            this.renderProjects();
        });
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const projItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul').id, projItem);
        }
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    gatherUserInput() {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = this.peopleInputElement.value;
        const titleValidatable = {
            value: title,
            required: true,
        };
        const descriptionValidatable = {
            value: description,
            required: true,
            minLength: 2,
            maxLength: 10,
        };
        const peopleValidatable = {
            value: +people,
            required: true,
            min: 1,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('Invalid input, please try again!');
        }
        else {
            return [title, description, +people];
        }
    }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
