import React, { useContext, useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import { UserContext } from '../../contexts/UserContext';
export default function DonationHistory() {
	const { addToast } = useToasts();
	const { getUserInfo } = useContext(UserContext);
	const [donations, setDonations] = useState([]);

	const fetchDonations = () => {
		getUserInfo()
			.then(d => {
				setDonations(d.donor.donations_legacy);
			})
			.catch(e => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(() => {
		fetchDonations();
	}, []);
	return (
		<>
			<div id="appCapsule">
				<div className="card-body">
					{donations && donations.length > 0 ? (
						donations.map((el, i) => {
							return (
								<ul key={i} className="listview image-listview mb-2">
									<li>
										<div className="item">
											<div>
												<i
													class="fas fa-calendar-alt fa-xl mr-3"
													style={{ color: '#cf3d3c' }}
												></i>

												{moment(el).format('ll')}
											</div>
										</div>
									</li>
								</ul>
							);
						})
					) : (
						<div>No donation history available...</div>
					)}
				</div>
			</div>
		</>
	);
}
