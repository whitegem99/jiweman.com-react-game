import { Button, Icon, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import AppAppBar from './AppAppBar';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {
		fontFamily: 'Open Sans',
		// background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
		// 	theme.palette.primary.dark,
		// 	0.5
		// )} 100%)`,
		color: theme.palette.primary.contrastText
		// backgroundImage: 'url("./assets/images/backgrounds/football-bg.webp")',
		// // backgroundColor: '#FAFAFA',
		// backgroundSize: 'auto',
		// backgroundPosition: 'bottom',
		// backgroundRepeat: 'no-repeat'
		// background: 'url("./assets/images/backgrounds/football-bg.webp")',
		// filter: 'drop-shadow(0px 29px 30px rgba(0, 0, 0, 0.25))',
		// position: 'absolute',
		// width: '1697px',
		// height: '996px',
		// left: '0px',
		// top: '0px'
		// Filter: `blur(100px)`
		// backgroundColor: '#FAFAFA',
	},
	firstSection: {
		background: 'url("./assets/images/backgrounds/football-bg.webp")',
		filter: 'drop-shadow(0px 29px 30px rgba(0, 0, 0, 0.25))',
		backgroundSize: '100% 100%',
		'background-position': 'bottom',
		'background-repeat': 'no-repeat',
		'background-size': 'cover'
		// position: 'absolute',
		// width: '1697px',
		// height: '996px',
		// left: '0px',
		// top: '0px'
	}
}));

function Homepage() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col homepage')}>
			<div className={clsx(classes.firstSection, 'flex flex-1 flex-col')}>
				<AppAppBar />
				<div className={clsx('', 'pt-64 pb-64 pl-76 w-fit-content')}>
					<div className={clsx('', 'flex flex-col')}>
						<h2 variant="h1" component="h2" style={{ fontSize: '210px' }}>
							Joga
						</h2>
						<h2 variant="h1" component="h2" style={{ fontSize: '210px' }}>
							Bonito
						</h2>

						<div className="homepage-banner-buttons flex flex-row pt-64 justify-evenly">
							<Button
								variant="contained"
								color="secondary"
								component={Link}
								onClick={() => {
									window.open(
										'https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users',
										'_blank'
									);
								}}
							>
								Download Now
							</Button>
							<Button
								variant="contained"
								color="secondary"
								component={Link}
								onClick={() => {
									window.open(
										'https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users',
										'_blank'
									);
								}}
							>
								Watch Trailer
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div
				className={clsx({}, 'flex flex-row')}
				style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.54) 100%)' }}
			>
				<div className="flex flex-col w-1/2 crazy-fun-section self-center">
					<div>Crazy Fun Physics!!</div>
					<div>Curve Shots!!</div>
					<div>Crazy Fun Shots!!</div>
				</div>
				<div className="flex w-1/2 justify-end py-64">
					<div>
						<img alt="vector18" src="./assets/images/backgrounds/Vector-18.png" />
					</div>
				</div>
			</div>
			<div style={{ background: ' #FF5722' }}>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation">Crazy Formations For Gameplay!</div>
					<div className=" define-strategy">Define Your Strategy</div>
				</div>

				<div className={clsx({}, 'flex flex-row')}>
					<div className="flex flex-col w-1/2 self-center glass-strip-section text-right">
						<div className="glass-strip left-88">Defense</div>
						<div className="glass-strip left-148">Attacking</div>
						<div className="glass-strip left-208">Balanced</div>
					</div>
					<div className="flex w-1/2 justify-end py-64">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Group-2.png" />
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					background: '#B2EBF2',
					boxShadow: ' 0px 23px 55px rgba(0, 0, 0, 0.25), 0px -22px 55px rgba(0, 0, 0, 0.25)'
				}}
			>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation" style={{ color: '#2D6E76' }}>
						Play In Crazy Live Events
					</div>
				</div>

				<div className={clsx({}, 'flex flex-col')}>
					<div className="flex flex-1 justify-start pt-32">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Vector-17.png" />
						</div>
					</div>
					<div className="flex flex-1 justify-end">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Vector-19.png" />
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					background: 'linear-gradient(180deg, #FFA5A5 0%, #FF3C3C 100%)'
				}}
			>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation" style={{ color: '#8C5454' }}>
						Play With Friends
					</div>
				</div>

				<div className={clsx({}, 'flex flex-col')}>
					<div className="flex flex-1 justify-start pt-32">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Vector-19-1.png" />
						</div>
					</div>
					<div className="flex flex-1 justify-end">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Vector-19-2.png" />
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					background: 'linear-gradient(180deg, #590995 0%, #E94560 100%)'
				}}
			>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation">Play For Social Cause</div>
				</div>

				<div className={clsx({}, 'flex flex-col')}>
					<div className="flex flex-1 justify-center py-64">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Frame-17.png" />
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					background: '#ED6663',
					'box-shadow': ' 0px -26px 40px rgba(0, 0, 0, 0.25)'
				}}
			>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation">Play With AI</div>
				</div>

				<div className={clsx({}, 'flex flex-col')}>
					<div className="flex flex-1 justify-center py-64">
						<div>
							<img alt="vector18" src="./assets/images/backgrounds/Group-1.png" />
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					background: '#0779E4',
					'box-shadow': ' 0px 30px 55px rgba(0, 0, 0, 0.25), 0px -21px 45px rgba(0, 0, 0, 0.25)'
				}}
			>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation">Play With Real Money</div>
					<div className=" define-strategy">
						Use Real Mobile Money To Play 1 vs 1, Play Against Friends, Play Leagues And Become a Pro Mobile
						Esport Player
					</div>
				</div>

				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/M-Pesa.png" />
							</div>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/MTN.png" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Glo.png" />
							</div>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Airtel-Money.png" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					background: '#7579E7',
					'box-shadow': '0px 24px 55px rgba(0, 0, 0, 0.25)'
				}}
			>
				<div className="flex flex-col pt-32 px-12  flex-1 items-center">
					<div className=" crazy-formation">Crazy Beautiful Stadiums</div>
				</div>

				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-16.png" />
							</div>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-12.png" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-13.png" />
							</div>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-11.png" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-14.png" />
							</div>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-15.png" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div style={{ padding: '3rem' }}>
				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-10.png" />
							</div>
						</div>
						<div className="contact-us-banner-buttons flex flex-row justify-evenly">
							<Button
								variant="contained"
								color="secondary"
								component={Link}
								onClick={() => {
									window.open(
										'https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users',
										'_blank'
									);
								}}
							>
								Download Now
							</Button>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/call-us-3 1.png" />
							</div>
						</div>
						<div className="contact-us-banner-buttons flex flex-row justify-evenly">
							<Button
								variant="contained"
								target="_top"
								rel="noopener noreferrer"
								href="mailto:support@jiweman.com"
							>
								<span>Contact Us</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div style={{ padding: '3rem', background: '#1B262C' }}>
				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col')}>
						<div className="flex flex-1 justify-center py-32">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Jiweman.png" />
							</div>
						</div>
					</div>
					<div className={clsx({}, 'flex flex-col self-center')}>
						<div className="contact-us-details">
							<div className="flex items-center">
								{' '}
								<Icon className="blue-icon">call</Icon> 999 234 676
							</div>
							<div className="flex items-center">
								{' '}
								<Icon className="blue-icon">mail</Icon>{' '}
								<a href="mailto:jiweman@gmail.com">jiweman@gmail.com</a>
							</div>
						</div>
						<div className="follow-us-icons">
							<div>Follow on us</div>
							<div>
								{/* <Icon className="blue-icon" filled>
									Instagram
								</Icon>
								<Icon className="blue-icon" filled>
									Facebook
								</Icon>
								<Icon className="blue-icon" filled>
									Twitter
								</Icon> */}
								<IconButton>
									<InstagramIcon />
								</IconButton>
								<IconButton>
									<FacebookIcon />
								</IconButton>
								<IconButton>
									<TwitterIcon />
								</IconButton>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div style={{ padding: '1rem', background: '#161F24' }}>
				<div className="flex justify-evenly">
					<div className={clsx({}, 'flex flex-col self-center font-bold')}>
						<div>Joga Bonito &nbsp; &nbsp; &#169; &nbsp; &nbsp; Copyrights Reserved</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Homepage;
