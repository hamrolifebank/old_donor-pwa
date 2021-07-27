import React, { useState, useEffect, useContext } from 'react';
import { DropdownButton, Dropdown, ButtonToolbar, SplitButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';
import {
	IoCloseCircle,
	IoAddCircleOutline,
	IoCloseOutline,
	IoPencilOutline,
	IoEllipsisHorizontal
} from 'react-icons/io5';
import IpfsHash from 'ipfs-only-hash';
import EthCrypto from 'eth-crypto';

import { AppContext } from '../../contexts/AppContext';
import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../../modules/global/ModalWrapper';
import ActionButton from './actionButton';
import ImageViewer from '../../modules/global/ImageViewer';
import CameraModal from './camera';

import { dataURLtoFile, base64ToBlob, blobToBase64 } from '../../utils';
import DataService from '../../services/db';
import docImg from '../../assets/images/doc.png';
const IPFS_CLIENT = require('ipfs-http-client');

// const IPFS_VIEW_URL = 'http://127.0.0.1:8080/ipfs';

export default function Index() {
	const { wallet } = useContext(AppContext);
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [imageViewModal, setImageViewModal] = useState(false);
	const [currentDocument, setCurrentDocument] = useState(''); // Viewing current document file base64 url
	const [currentDocumentName, setCurrentDocumentName] = useState(''); // Viewng current document name
	const [videoConstraints, setVideoConstraints] = useState({
		width: 1080,
		height: 500,
		facingMode: 'environment'
	});
	const [imagePreviewModal, setImagePreviewModal] = useState(false);
	const [documentName, setDocumentName] = useState('');
	const [blobFile, setBlobFile] = useState('');
	const [myDocuments, setMyDocuments] = useState([]);

	const publicKey = EthCrypto.publicKeyByPrivateKey(wallet.privateKey);

	const handleDocumentNameChange = e => {
		setDocumentName(e.target.value);
	};

	const toggleImageViewModal = (e, base64Url, docName) => {
		if (e) e.preventDefault();
		setCurrentDocumentName(docName);
		setCurrentDocument(base64Url);
		setImageViewModal(!imageViewModal);
	};

	const toggleCameraModal = () => {
		setCameraModal(!cameraModal);
	};

	const toggleImagePreviewModal = () => {
		setDocumentName('');
		setImagePreviewModal(!imagePreviewModal);
	};

	const webcamRef = React.useRef(null);

	const getIpfsHash = async dataurl => {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return IpfsHash.of(u8arr);
	};

	const encryptFile = async file => {
		const encryptedFile = await EthCrypto.encryptWithPublicKey(publicKey, file);
		const encryptedFileString = EthCrypto.cipher.stringify(encryptedFile);
		let hash = await IpfsHash.of(encryptedFileString);
		return { encryptedFile, encryptedFileString, hash };
	};

	const handleDocumentSubmit = async e => {
		e.preventDefault();

		//var buffer = await blobFile.arrayBuffer();
		// const img = btoa(String.fromCharCode(...new Uint8Array(await blobFile.arrayBuffer()))); //new Buffer.from(await file.arrayBuffer()).toString('ascii');
		// console.log(`data:image/png;base64,${img}`);
		console.log(previewImage);
		const file = dataURLtoFile(previewImage, documentName);
		const { hash, encryptedFileString } = await encryptFile(previewImage);

		let payload = {
			hash,
			type: 'general',
			name: documentName,
			file,
			encryptedFile: encryptedFileString,
			createdAt: Date.now(),
			inIpfs: false
		};
		await DataService.saveDocuments(payload);
		payload.file = previewImage;
		setMyDocuments([...myDocuments, payload]);

		toggleImagePreviewModal();
		setPreviewImage('');
		setDocumentName('');
	};

	const handleFaceChange = () => {
		const { facingMode } = videoConstraints;
		const face = facingMode === 'environment' ? 'user' : 'environment';
		setVideoConstraints({ ...videoConstraints, facingMode: face });
	};

	const handleCaptureAgain = e => {
		e.preventDefault();
		toggleImagePreviewModal();
		toggleCameraModal();
	};

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		base64ToBlob(imageSrc)
			.then(blob => {
				setBlobFile(blob);
				setPreviewImage(imageSrc);
				toggleCameraModal();
				toggleImagePreviewModal();
			})
			.catch(err => {
				Swal.fire('ERROR', 'Image capture failed', 'error');
			});
	};

	const handleDownloadClick = e => {
		e.preventDefault();
		return downloadFile(currentDocument);
	};

	function downloadFile(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function () {
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement('a');
			tag.href = imageUrl;
			tag.download = currentDocumentName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		};
		xhr.send();
	}

	const handleRemoveDocClick = () => {
		console.log('Not Implemented: remove from ipfs and indexedDB');
	};

	const getFileBlob = async url => {
		const response = await fetch(url);
		return response.blob();
	};

	const backupToIPFS = async () => {
		const { ipfsUrl } = await DataService.getIpfs();
		let documents = await DataService.listDocuments();
		const ipfs = IPFS_CLIENT(ipfsUrl);
		for (let doc of documents) {
			if (doc.inIpfs !== true) {
				ipfs.add(doc.encryptedFile).then(res => {
					doc.inIpfs = true;
					DataService.updateDocument(doc.hash, doc);
				});
			}
		}

		// window.wallet = wallet;
		// const test = await DataService.get('backup_passphrase');

		// const reveal = await EthCrypto.decryptWithPrivateKey(wallet.privateKey, test);

		// //console.log(wallet.privateKey);
		// //console.log(EthCrypto.publicKeyByPrivateKey(wallet.privateKey));
		// //console.log(wallet.publicKey);

		// console.log(reveal);
	};

	const GetfromIPFS = async () => {
		let { ipfsDownloadUrl } = await DataService.getIpfs();
		let documents = await DataService.listDocuments();
		for (let doc of documents) {
			if (!doc.file) {
				let encryptedFileBlob = await getFileBlob(ipfsDownloadUrl + '/' + doc.hash);
				let encryptedFile = await encryptedFileBlob.text();
				const encryptedObject = EthCrypto.cipher.parse(encryptedFile);
				const decryptedFile = await EthCrypto.decryptWithPrivateKey(wallet.privateKey, encryptedObject);
				const file = dataURLtoFile(decryptedFile, doc.name);
				await DataService.updateDocument(doc.hash, { file, encryptedFile });
				console.info('Downloaded file: ' + doc.hash);
				doc.file = await blobToBase64(file);
			} else {
				if (doc.file) doc.file = await blobToBase64(doc.file);
			}
			doc.name = doc.encryptedFile ? doc.encryptedFile.length / 1000 : doc.name;
		}
		setMyDocuments(documents);
	};

	//setTimeout(syncDocuments, 2000);

	useEffect(() => {
		(async () => {
			let documents = await DataService.listDocuments();
			let { ipfsDownloadUrl } = await DataService.getIpfs();
			for (let doc of documents) {
				if (doc.file) doc.file = await blobToBase64(doc.file);
				else doc.file = 'https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp'; // ipfsDownloadUrl + '/' + doc.hash;
			}
			setMyDocuments(documents);
			GetfromIPFS();
			backupToIPFS();
		})();
	}, []);

	return (
		<>
			<AppHeader
				ionIcon="IoDocumentLockOutline"
				currentMenu="Secure Document Vault"
				actionButton={
					<Link className="headerButton" to="#" onClick={toggleCameraModal}>
						<IoAddCircleOutline className="ion-icon" />
					</Link>
				}
			/>

			<div id="appCapsule">
				<div class="section mt-2">
					{myDocuments.length > 0 &&
						myDocuments.map(doc => {
							return (
								<div key={doc.hash} class="card-block bg-secondary mb-2">
									<div class="card-main">
										<div class="card-button dropdown">
											<Dropdown>
												<Dropdown.Toggle variant="link" bsPrefix="p-0">
													<IoEllipsisHorizontal className="ion-icon" />
												</Dropdown.Toggle>

												<Dropdown.Menu>
													<Dropdown.Item href="#/action-1">
														<IoPencilOutline className="ion-icon" />
														Edit
													</Dropdown.Item>
													<Dropdown.Item href="#/action-2">
														<IoCloseOutline className="ion-icon" />
														Remove
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<div class="balance">
											<h1 class="title">Citizenship Card</h1>
										</div>
										<div class="in">
											<div class="card-number">
												<span class="label">Number</span>
												•••• 9905
											</div>
											<div class="bottom">
												<div class="card-expiry">
													<span class="label">Expiry Date</span>
													Never
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			<ImageViewer
				handleRemoveDocClick={handleRemoveDocClick}
				handleDownloadClick={handleDownloadClick}
				showModal={imageViewModal}
				ohHide={toggleImageViewModal}
				documentName={currentDocumentName}
			>
				<div role="document">
					<div className="modal-content">
						<div className="story-image">
							<img width="100%" src={currentDocument} alt="My document" />
						</div>
					</div>
				</div>
			</ImageViewer>
			<ModalWrapper modalSize="lg" title="" showModal={imagePreviewModal} ohHide={toggleImagePreviewModal}>
				<img
					style={{ minHeight: 350, maxHeight: 450 }}
					className="card-img-top"
					src={previewImage ? previewImage : docImg}
					alt="My doc"
				/>
				<div className="section mt-4 mb-5">
					<form onSubmit={e => handleDocumentSubmit(e)}>
						<div className="form-group basic">
							<div className="input-wrapper">
								<label className="label" htmlFor="documentName">
									Document Name
								</label>
								<input
									type="text"
									className="form-control"
									name="documentName"
									id="documentName"
									onChange={handleDocumentNameChange}
									value={documentName}
									placeholder="Enter short document name"
									required
								/>
								<i className="clear-input">
									<IoCloseCircle className="ion-icon" />
								</i>
							</div>
						</div>

						<div className="form-links mt-2">
							<div>
								<a href="#capture" onClick={e => handleCaptureAgain(e)}>
									Capture another?
								</a>
							</div>
						</div>

						<div className="mt-2">
							<button type="submit" className="btn btn-primary btn-block btn-lg">
								Save
							</button>
						</div>
					</form>
				</div>
			</ModalWrapper>
			<CameraModal
				modalSize="lg"
				title=""
				showModal={cameraModal}
				closeModal={() => {
					setCameraModal(false);
				}}
				ohHide={toggleCameraModal}
				handleCapture={capture}
				webcamRef={webcamRef}
			/>
			<div id="appCapsule">
				<div className="container">
					<div className="section full mt-2">
						<form>
							<div className="content-header mb-05">
								<div className="row" style={{ marginBottom: 30 }}>
									{myDocuments.length > 0 &&
										myDocuments.map(doc => {
											return (
												<div key={doc.hash} className="col-sm-3" style={{ marginTop: 15 }}>
													<div
														className="card"
														onClick={e => toggleImageViewModal(e, doc.file, doc.name)}
													>
														<img
															style={{ borderRadius: '6px' }}
															className="card-img-top"
															src={doc.file}
															alt="My doc"
															height="282"
														/>
													</div>
												</div>
											);
										})}
									<ActionButton
										btnText="Take a picture to upload"
										imageUrl={docImg}
										icon={<IoAddCircleOutline className="ion-icon" />}
										handleClick={toggleCameraModal}
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
