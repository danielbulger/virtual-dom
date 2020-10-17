import {VElementNode, VTextNode} from '../vdom/vnode.js';
import {diff} from '../vdom/diff.js';

const counter = function (count) {

	const children = [];

	for(let i = 0; i < count; ++i) {
		children.push(new VElementNode('li', null, new VTextNode(Math.random() * 100)));
	}

	return new VElementNode('div', null, new VElementNode('ul', null, ...children));
}

let tree = counter(0);

const root = document.getElementById('app');

tree.render(root);

setInterval(() => {

	const newTree = counter(Math.trunc(Math.random() * 10));

	const patches = diff(tree, newTree);

	for(const p of patches) {
		p.patch();
	}

	tree = newTree;

}, 2_000);