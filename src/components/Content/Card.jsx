import React from 'react';
import styles from './Content.module.scss';
import { capitalize } from '../../utils';

const Card = ({ showCard, setShowCard, data }) => {
	const getDefinition = () => {
		if (Array.isArray(data.definition)) {
			return (
				<ul>
					{data.definition.map((elem, i) => {
						return <li key={i}>{capitalize(elem.trim())}</li>;
					})}
				</ul>
			);
		}
		return <p>{data.definition}</p>;
	};

	if (showCard)
		return (
			<div className={styles.Overlay} onClick={() => setShowCard(false)}>
				<div className={styles.Card}>
					<h2>{data.expression}</h2>
					{getDefinition()}
				</div>
			</div>
		);
};

export default Card;
