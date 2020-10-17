import {
	VElementNode,
	VNode,
	VTextNode
} from './vnode.js';

import {
	AppendNodePatch,
	AttributePatch,
	RemoveNodePatch,
	ReplaceNodePatch,
	UpdateTextPatch
} from './patch.js';

function diffTextNodes(oldNode, newNode, patches) {

	// Since the node can node longer change, we reuse the existing DOM element.
	newNode.element = oldNode.element;

	if (!oldNode.matches(patches)) {
		patches.push(new UpdateTextPatch(oldNode, newNode));
	}

}

function compareAttribute(oldValue, newValue) {

	if (typeof (oldValue) === 'object' && typeof (newValue) === 'object') {
		return JSON.stringify(oldValue) === JSON.stringify(newValue);
	} else {
		return oldValue === newValue;
	}

}

function diffAttributes(oldNode, newNode) {

	const attributes = {};

	let changed = false;

	const oldAttributes = oldNode.attributes;

	const newAttributes = newNode.attributes;

	// First find any values that have changed/removed.
	for (let key in oldAttributes) {

		if (!oldAttributes.hasOwnProperty(key)) {
			continue;
		}

		if (!compareAttribute(oldAttributes[key], newAttributes[key])) {
			attributes[key] = newAttributes[key];

			changed = true;
		}

	}

	// Now find any values that have been added.
	for (let key in newAttributes) {

		if (!newAttributes.hasOwnProperty(key)) {
			continue;
		}

		if (!oldAttributes.hasOwnProperty(key)) {
			attributes[key] = newAttributes[key];

			changed = true;
		}

	}

	return [changed, attributes];

}

function diffChildren(oldNode, newNode, patches) {

	const oldChildren = oldNode.children;

	const newChildren = newNode.children;

	let i = 0;

	for (; i < oldChildren.length; ++i) {

		if (newChildren.length <= i) {

			// There are no more children in the new list. From this point on, they all need to be removed.
			patches.push(new RemoveNodePatch(oldChildren[i]));
		} else {
			walk(oldChildren[i], newChildren[i], patches);
		}

	}

	// Append any more children that may have been added
	for (; i < newChildren.length; ++i) {
		patches.push(new AppendNodePatch(oldNode, newChildren[i]));
	}

}

function diffElementNodes(oldNode, newNode, patches) {

	if (oldNode.tag !== newNode.tag) {

		// The tags don't match so we throw everything away
		patches.push(new ReplaceNodePatch(
			oldNode,
			newNode
		));

		return;
	}

	// Since the node can node longer change, we reuse the existing DOM element.
	newNode.element = oldNode.element;

	const [changed, attributes] = diffAttributes(oldNode, newNode);

	if (changed) {
		patches.push(new AttributePatch(oldNode, newNode, attributes));
	}

	diffChildren(oldNode, newNode, patches);

}

function walk(oldNode, newNode, patches) {

	if (newNode === null) {
		patches.push(new RemoveNodePatch(oldNode));
		return;
	}

	if (!(newNode instanceof VNode)) {
		throw new Error('Invalid node arg');
	}

	if (newNode.type() !== oldNode.type()) {

		// Completely different trees.
		patches.push(new ReplaceNodePatch(
			oldNode,
			newNode
		));

		return;
	}

	if (oldNode instanceof VTextNode) {

		diffTextNodes(oldNode, newNode, patches);

	} else if (oldNode instanceof VElementNode) {

		diffElementNodes(oldNode, newNode, patches);

	}

}

export function diff(oldTree, newTree) {

	const patches = [];

	walk(oldTree, newTree, patches);

	return patches;

}