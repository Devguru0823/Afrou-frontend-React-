import styled from 'styled-components';

export default styled.div`
	.invoice {
		padding: 30px;
	}

	.invoice h2 {
		margin-top: 0px;
		line-height: 0.8em;
	}

	.invoice .small {
		font-weight: 300;
	}

	.invoice hr {
		margin-top: 10px;
		border-color: #ddd;
	}

	.invoice .table tr.line {
		border-bottom: 1px solid #ccc;
	}

	.invoice .table td {
		border: none;
	}

	.invoice .identity {
		margin-top: 10px;
		font-size: 1.1em;
		font-weight: 300;
	}

	.invoice .identity strong {
		font-weight: 600;
	}

	.grid {
		position: relative;
		width: 100%;
		background: #fff;
		color: #666666;
		border-radius: 2px;
		margin-bottom: 25px;
		box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
	}
`;
