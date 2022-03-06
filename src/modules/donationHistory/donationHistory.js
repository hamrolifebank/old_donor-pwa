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
				setDonations(d);
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
								<div className="col-lg-4" key={i}>
									<div className="card card-margin">
										<div className="card-header no-border t">
											{el.event_name ? el.event_name : ''}
										</div>
										<div className="card-body pt-0">
											<div className="widget-49">
												<div className="widget-49-title-wrapper">
													<div className="widget-49-date-primary-large">
														{/* <span className="widget-49-date-day">
															{moment(el.date).format('D')}
														</span> */}
														<span className="widget-49-date-month">
															{moment(el.date).format('D MMM')}
														</span>
														<span className="widget-49-date-day">
															{moment(el.date).format('yyyy')}
														</span>
													</div>
													<div
														className="widget-49-meeting-info"
														style={{
															display: 'block',
															float: 'right',
															margin: '0 auto'
														}}
													>
														<ul className="widget-49-meeting-points p-0">
															<li className="widget-49-meeting-item">
																<span>
																	<b>
																		<i className="fa-solid fa-location-dot mr-2"></i>
																	</b>
																	{el.location
																		? el.location
																		: el.beneficiary.address
																		? el.beneficiary.address
																		: ''}
																</span>
															</li>
															<li className="widget-49-meeting-item">
																<span>
																	<b>
																		<i className="fa-solid fa-house-chimney-medical"></i>
																	</b>{' '}
																	{el.beneficiary ? el.beneficiary : ''}
																</span>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
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
