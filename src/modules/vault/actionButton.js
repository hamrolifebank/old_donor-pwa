import React from 'react';

export default function ActionButton({ icon, btnText, imageUrl, handleClick }) {
	return (
		<>
			<div className="col-sm-3" style={{ marginTop: 15 }}>
				<img className="card-img-top" height="194" src={imageUrl} alt="My doc" />
				<div className="card text-center">
					<div className="card-body">
						<button onClick={handleClick} type="button" className="btn btn-success btn-md" id="btnMnemonic">
							{icon} {btnText}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
