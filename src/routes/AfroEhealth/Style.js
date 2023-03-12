import styled from 'styled-components';

export default styled.div`
	@import url('https://fonts.googleapis.com/css2?family=Yatra+One&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');

	#ehealth {
		max-width: 100%;
		width: 100%;
		margin: 0px auto;
		background-color: #cff3e0;
		padding: 40px 0px;
		font-family: 'PT Serif', serif;
	}

	#ehealth-body-wrapper {
		flex-direction: column-reverse;
	}

	#ehealth-body-wrapper .small-text {
		font-size: 11px;
		color: #ff7400;
	}

	/* .ehealth-top {
	display: flex;
	justify-content: space-between;
} */

	.ehealth-top .ehealth-logo img {
		width: 15%;
	}

	.invalid-feedback {
		display: block;
	}

	.accordion-body {
		padding: 0.5rem 0.5rem;
	}

	.ehealth-top-content {
		position: relative;
		line-height: initial;
		padding: 15px 0px;
		text-align: center;
	}

	.ehealth-top-content h1 {
		font-weight: 700;
	}

	.ehealth-top-content .highlight-text {
		color: #ff7400;
	}

	.ehealth-body {
		background-color: #fff;
		margin: 1em auto 0;
		border-radius: 8px;
		width: 98%;
	}

	.ehealth-body .ehealth-btn {
		background: #ff7400;
		color: #fff;
		border: none;
		border-radius: 4px;
		position: relative;
		bottom: 1em;
		text-transform: uppercase;
		padding: 10px;
		width: 100%;
		text-align: center;
	}

	.ehealth-body .ehealth-btn-container {
		width: 80%;
		margin: 0px auto;
	}

	.ehealth-logo {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.ehealth-logo h1 {
		font-weight: bold;
		font-size: 22px;
	}

	.placeCenter {
		width: 50%;
		margin: 0px auto;
	}

	/* #ehealth-logo {
	width: 80%;
	margin: 0px auto;
} */

	.ehealth-purchase-btn {
		text-transform: capitalize;
		color: #fff;
		background: #3bb273;
		border: none;
		border-radius: 4px;
		width: max-content;
		padding: 10px;
	}

	.counter {
		/* padding: 5px; */
		margin: 10px;
		/* width: 30px; */
		text-align: center;
		border-radius: 50%;
		background: #ff7400;
		color: #fff;
	}

	#quote {
		font-weight: 200;
		font-style: italic;
		text-align: center;
		margin-top: 1rem;
	}

	.price {
		position: absolute;
		left: calc(50%);
	}

	.MuiPaper-root {
		background: none !important;
	}

	#form-container {
		padding: 40px;
		background: #fff;
	}

	#form-container h2 {
		text-align: center;
		margin-bottom: 20px;
	}

	.centralize {
		text-align: center;
	}

	.MuiTabs-flexContainer {
		justify-content: center;
	}

	.currency-select {
		width: 30%;
		margin: 10px auto;
	}

	.MuiMenu-list {
		background-color: #fff;
	}

	label + .MuiInput-formControl {
		text-align: left;
	}

	@media screen and (max-width: 480px) {
		.ehealth-body .col-md-6:last-child {
			margin-bottom: 4em;
		}
	}
`;
