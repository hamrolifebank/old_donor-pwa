import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import { IoCloseCircleOutline, IoCameraOutline, IoCameraReverseOutline } from 'react-icons/io5';

import { dataURLtoFile, base64ToBlob, blobToBase64 } from '../../utils';
import overlayImage from '../../assets/images/camera-doc-overlay.svg';

export default function CameraModal(props) {
	const { handleCapture, modalSize, showModal, ohHide, closeModal, webcamRef } = props;
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [imageViewModal, setImageViewModal] = useState(false);
	const [videoConstraints, setVideoConstraints] = useState({
		width: window.innerHeight,
		height: window.innerWidth,
		facingMode: 'environment'
	});
	const [imagePreviewModal, setImagePreviewModal] = useState(false);
	const [documentName, setDocumentName] = useState('');
	const [blobFile, setBlobFile] = useState('');
	const [myDocuments, setMyDocuments] = useState([]);

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

	return (
		<>
			<Modal
				size={modalSize || 'md'}
				show={showModal || false}
				onHide={ohHide}
				className="fullscreen-modal"
				style={{
					width: window.innerWidth,
					height: window.innerHeight
				}}
			>
				<Modal.Body>
					<Webcam
						audio={false}
						ref={webcamRef}
						screenshotFormat="image/jpeg"
						videoConstraints={videoConstraints}
						style={{}}
					/>
				</Modal.Body>
				<img
					src={overlayImage}
					alt="camera overlay"
					className="camera-document-overlay"
					style={{
						width: window.innerWidth,
						height: window.innerHeight
					}}
				/>
				<button
					type="button"
					className="btn btn-danger rounded me-1 camera-capture-button"
					onClick={handleCapture}
					style={{
						top: (window.innerHeight - 50) / 2,
						left: 30,
						border: '3px white solid',
						height: 50,
						opacity: 0.8
					}}
				>
					&nbsp; &nbsp;
					<IoCameraOutline className="ion-icon" />
				</button>
				<button
					type="button"
					className="btn btn-icon btn-dark rounded me-1 mb-1 camera-close-button"
					onClick={closeModal}
					style={{
						left: window.innerWidth - 60,
						top: window.innerHeight - 70
					}}
				>
					<IoCloseCircleOutline className="ion-icon" />
				</button>
			</Modal>
		</>
	);
}

CameraModal.propTypes = {
	ohHide: PropTypes.func.isRequired,
	showModal: PropTypes.bool.isRequired
};
