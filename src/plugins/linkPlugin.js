// Code written by Siobhan Mahoney
// Source: https://medium.com/@siobhanpmahoney/building-a-rich-text-editor-with-react-and-draft-js-part-2-2-embedding-links-d71b57d187a7

import React from "react";
import {
	RichUtils,
	KeyBindingUtil,
	EditorState,
} from "draft-js";
import Utils from '../constants/utils';

export const linkStrategy = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges(character => {
		const entityKey = character.getEntity();
		return (
			entityKey !== null &&
			contentState.getEntity(entityKey).getType() === "LINK"
		);
	}, callback);
};

export const Link = props => {
	const { contentState, entityKey } = props;
	const { url } = contentState.getEntity(entityKey).getData();
	return (
		<a
			className="link"
			onClick={() => {Utils.openInNewTab(url.includes('https://') ? url : "https://" + url)}}
			rel="noopener noreferrer"
			target="_blank"
			aria-label={url}
		>
			{props.children}
		</a>
	);
};

const linkPlugin = {
	decorators: [
		{
			strategy: linkStrategy,
			component: Link
		}
	]
};

export default linkPlugin;
