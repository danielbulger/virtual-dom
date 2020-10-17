export class VNode {

	constructor() {
		this.element = null;
	}

	_render() {

	}

	render(parentElement) {

		this._render();

		parentElement.appendChild(this.element);
	}

	remove() {

		if (this.element !== null) {

			this.element.remove();

			this.element = null;

		}

	}

	type() {
	}

}

export class VTextNode extends VNode {

	constructor(value) {
		super();

		this.value = value;
	}

	_render(parentElement) {
		this.element = document.createTextNode(this.getValue());
	}

	type() {
		return 'VTextNode';
	}

	getValue() {
		return this.value.toString();
	}

	matches(otherValue) {
		return this.value === otherValue;
	}
}

export class VElementNode extends VNode {

	constructor(tag, attributes, ...children) {
		super();

		this.tag = tag;

		this.attributes = attributes;

		this.children = children;
	}

	type() {
		return 'VElementNode';
	}

	_renderAttributes() {


		for (let key in this.attributes) {

			if (!this.attributes.hasOwnProperty(key)) {
				continue;
			}

			const value = this.attributes[key];

			if (value === null) {
				this.element.removeAttribute(key);
				continue;
			}

			if (typeof (value) === 'object') {

				for (let childKey in value) {

					if (!value.hasOwnProperty(childKey)) {
						continue;
					}

					this.element[key][childKey] = value[childKey];

				}

			} else {
				this.element.setAttribute(key, value);
			}
		}
	}

	_renderChildren() {

		for (let child of this.children) {

			if (child instanceof VNode) {

				child.render(this.element);

			}
		}
	}

	_render() {
		this.element = document.createElement(this.tag);

		this._renderAttributes();

		this._renderChildren();
	}
}