export class Patch {

	constructor(oldNode, newNode) {
		this.oldNode = oldNode;
		this.newNode = newNode;
	}

	patch() {
	}
}

export class RemoveNodePatch extends Patch {

	constructor(oldNode) {
		super(oldNode, null);
	}

	patch() {
		this.oldNode.remove();
	}
}

export class ReplaceNodePatch extends Patch {

	constructor(oldNode, newNode) {
		super(oldNode, newNode);
	}

	patch() {
		this.oldNode.element.replaceWith(this.newNode._render());
	}
}

export class UpdateTextPatch extends Patch {

	constructor(oldNode, newNode) {
		super(oldNode, newNode);
	}

	patch() {
		this.newNode.element.textContent = this.newNode.getValue();
	}
}

export class AttributePatch extends Patch {

	constructor(oldNode, newNode, attributes) {
		super(oldNode, newNode);

		this.attributes = attributes;
	}

	patch() {

		this.newNode.attributes = this.attributes;

		this.newNode._renderAttributes();

	}
}

export class AppendNodePatch extends Patch {

	constructor(parent, newNode) {
		super(null, newNode);

		this.parent = parent;
	}

	patch() {
		this.newNode.render(this.parent.element);
	}
}