import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export default function DownloadInstructions({ open, setOpen }) {
	const handleClose = () => {
		setOpen(false);
	};

	const descriptionElementRef = React.useRef(null);
	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			scroll={'paper'}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
			maxWidth="lg"
		>
			<DialogTitle id="scroll-dialog-title">Enabling Sideloading on Android 8 &amp; Higher</DialogTitle>
			<DialogContent dividers={true}>
				{/* <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}> */}
				<div>
					<div>
						<p>
							Starting with Android 8.0, the process of sideloading apps changed dramatically. No longer
							is there a system-wide "Unknown Sources" setting — instead, it's now handled on a per-app
							basis.
						</p>
						<br></br>
						<p>
							This means that when you download an APK with your browser, for instance, you'll have to
							give your browser permission to install apps. Same goes if you try to install an APK from
							your favorite file explorer — the file explorer will need explicit permission to install
							apps as well.
						</p>
						<br></br>
						<p>
							While this is a pretty big departure from the way things worked before, it's actually pretty
							simple. Just download the APK file for the app you want to sideload, then open the APK with
							any file manager. You'll then be prompted to allow the permission. Tap "Settings," then
							enable the switch next to "Allow from this source" on the following screen. From there, hit
							your back button, then you can resume installation.
						</p>
					</div>

					<div className="flex flex-row">
						<img
							src="assets/images/backgrounds/card1.png"
							alt=""
							className="w-1/4"
						/>
						<img
							src="assets/images/backgrounds/card2.png"
							alt=""
							className="w-1/4"
						/>
						<img
							src="assets/images/backgrounds/card3.png"
							alt=""
							className="w-1/4"
						/>
						<img
							src="assets/images/backgrounds/card4.png"
							alt=""
							className="w-1/4"
						/>
					</div>
				</div>
				{/* </DialogContentText> */}
			</DialogContent>
			{/* <DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleClose} color="primary">
					Subscribe
				</Button>
			</DialogActions> */}
		</Dialog>
	);
}
