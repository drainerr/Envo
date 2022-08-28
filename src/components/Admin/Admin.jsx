import React, { useRef, useState, useEffect } from 'react';
import styles from './Admin.module.scss';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import Login from './Login';
import Select from './Select';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase-Config';
import { addNewExpression } from '../../store/slices/ExpressionsSlice';
import { addToDatabase, setStatus } from '../../store/slices/AdminSlice';
import { capitalize } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';

const Admin = () => {
	const formRef = useRef();
	const expressionRef = useRef();
	const definitionRef = useRef();
	const examplesRef = useRef();
	const dispatch = useDispatch();
	const { authenticated, status } = useSelector((store) => store.admin);
	const expressionType = useSelector((state) => state.expressions.expressionType);
	const [category, setCategory] = useState(null);
	const navigate = useNavigate();

	const addNewData = (e) => {
		e.preventDefault();
		const expression = capitalize(expressionRef.current.value);
		const definition = capitalize(definitionRef.current.value);
		const examples = capitalize(examplesRef.current.value);
		const obj = { expression, definition, date_added: Date.now(), examples };
		if (category) {
			dispatch(addToDatabase({ obj, category }));
			expressionType === category && dispatch(addNewExpression(obj)); //update current list of expressions
		}
	};

	useEffect(() => {
		if (status === 'added') {
			formRef.current.reset();
			setTimeout(() => {
				dispatch(setStatus('idle'));
			}, 2000);
		}
	}, [status, dispatch]);

	const handleLogout = () => {
		signOut(auth);
	};

	const notificationStyles = { color: 'green', fontSize: '1.1rem', fontWeight: '600' };
	if (!authenticated) {
		return (
			<div className={styles.Wrapper}>
				<Login />
			</div>
		);
	}

	return (
		<div className={styles.Wrapper}>
			<form onSubmit={addNewData} className={styles.Form} ref={formRef}>
				{status === 'added' && <p style={notificationStyles}>New data was added!</p>}
				<Select category={category} setCategory={setCategory} />
				<input
					type='text'
					placeholder='Expression'
					ref={expressionRef}
					className={styles.ExpressionInput}
				/>
				<textarea
					placeholder='Definition...'
					ref={definitionRef}
					className={styles.Definition}
				/>
				<textarea placeholder='Examples...' ref={examplesRef} className={styles.Examples} />
				<button>Add to Database</button>
				<button className={styles.Home} onClick={() => navigate('/')}>
					<IoHome />
				</button>
				<button className={styles.Signout} onClick={handleLogout}>
					Logout <RiLogoutCircleRLine />
				</button>
			</form>
			<p className={styles.Note}>
				In order to define multiple definitions or examples, put ,, at the end of every sentence
			</p>
		</div>
	);
};

export default Admin;
