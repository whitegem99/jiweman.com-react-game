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
		background: 'url("./assets/images/backgrounds/gradient.png")',
		filter: 'drop-shadow(0px 29px 30px rgba(0, 0, 0, 0.25))',
		backgroundSize: '100% 100%',
		'background-position': 'top',
		'background-repeat': 'no-repeat',
		'background-size': 'cover',
		paddingBottom: '10rem'
		// position: 'absolute',
		// width: '1697px',
		// height: '996px',
		// left: '0px',
		// top: '0px'
	},
	secondSection: {
		background: '#1B262C',
		boxShadow: '8px 0px 30px rgba(0, 0, 0, 0.25), 0px 10px 30px rgba(0, 0, 0, 0.4)',
		transform: 'skew(0deg, 10deg)'
	},
	secondSectionContent: {
		transform: 'skew(0deg, -10deg)'
	},
	thirdSection: {
		background: 'rgb(255, 87, 34)',
		boxShadow: '8px 0px 30px rgba(0, 0, 0, 0.25), 0px 10px 30px rgba(0, 0, 0, 0.4)',
		transform: 'skew(0deg, 10deg)'
	},
	thirdSectionContent: {
		transform: 'skew(0deg, -10deg)'
	},
	fourthSection: {
		background: '#EA5455',
		boxShadow: '10px 0px 30px rgba(0, 0, 0, 0.25), 0px 10px 30px rgba(0, 0, 0, 0.25)',
		transform: 'skew(0deg, 10deg)'
	},
	fourthSectionContent: {
		transform: 'skew(0deg, -10deg)'
	},
	fifthSection: {
		background: '#3498DB',
		boxShadow: ' 10px 0px 40px rgba(0, 0, 0, 0.25), 0px 10px 40px rgba(0, 0, 0, 0.25)',
		transform: 'skew(0deg, 10deg)'
	},
	fifthSectionContent: {
		transform: 'skew(0deg, -10deg)'
	},
	sixthSection: {
		background: '#7A08FA',
		boxShadow: ' 10px 0px 40px rgba(0, 0, 0, 0.25), 0px 10px 40px rgba(0, 0, 0, 0.25)',
		transform: 'skew(0deg, 10deg)'
	},

	sixthSectionContent: {
		transform: 'skew(0deg, -10deg)'
	},
	seventSection: {
		background: '#3D3D5B',
		boxShadow: ' 10px 0px 40px rgba(0, 0, 0, 0.25), 0px 10px 40px rgba(0, 0, 0, 0.25)',
		transform: 'skew(0deg, 10deg)'
	},

	seventSectionContent: {
		transform: 'skew(0deg, -10deg)'
	}
}));

function Homepage() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col homepage')}>
			<div className={clsx(classes.firstSection, 'flex flex-1 flex-row first-section')}>
				<AppAppBar />
				<div className={clsx('', 'flex w-1/2 pt-64 pb-64 pl-76')}>
					<div className={clsx('', 'flex flex-col')}>
						<h2
							variant="h1"
							component="h2"
							className="joga-name"
							style={{ fontSize: '17rem', padding: '9rem 9rem 5rem 9rem' }}
						>
							Joga <br /> Bonito
						</h2>

						<div>
							<div className="joga-description" style={{ padding: '0 9rem' }}>
								Jiweman is a mobile multiplayer advergaming company. We use mobile multiplayer games as
								social engagement mechanisms to help brands create their own engaging mini social
								networks around their customers
							</div>
						</div>
						<div className="homepage-banner-buttons flex flex-row pt-64" style={{ padding: '5rem 9rem' }}>
							<Button
								variant="contained"
								className="mr-12"
								color="secondary"
								component={Link}
								onClick={() => {
									window.open(
										'https://install.appcenter.ms/users/fastskill/apps/joga-bonito/distribution_groups/public',
										'_blank'
									);
								}}
							>
								Get Started
							</Button>
							<Button
								variant="contained"
								color="secondary"
								component={Link}
								onClick={() => {
									window.open(
										'https://install.appcenter.ms/users/fastskill/apps/joga-bonito/distribution_groups/public',
										'_blank'
									);
								}}
							>
								Contact Us
							</Button>
						</div>
					</div>
				</div>
				<div className="flex w-1/2 justify-end py-64">
					<div style={{ padding: '9rem 0' }}>
						<img alt="vector18" src="./assets/images/backgrounds/device.png" />
					</div>
				</div>
			</div>
			<div className={clsx(classes.secondSection, 'flex flex-col')}>
				<div className={clsx(classes.secondSectionContent, 'flex flex-col')}>
					<div className="flex flex-row px-128 pb-128">
						<div className="flex flex-col w-1/2 crazy-fun-section self-center">
							<div className="jiweman-label pb-32">Jiweman</div>
							<div className="feature-desc">
								Jiweman is a mobile multiplayer advergaming company. We use mobile multiplayer games as
								social engagement mechanisms to help brands create their own engaging mini social
								networks around their customers.
							</div>
						</div>
						<div className="flex w-1/2 justify-end ">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/JiwemanLogo.png" />
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex w-1/2 justify-start py-64">
							<img alt="vector18" src="./assets/images/backgrounds/device-1.png" />
						</div>
						<div className="flex flex-col w-1/2 p-128 crazy-fun-section self-center">
							<div className="feature-desc">
								As brands have to re-strategize to a “new normal” in these current social distancing age
								where live social events have had to be minimized, digital events have never had more
								appeal
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-col w-1/2 p-128 crazy-fun-section self-center">
							<div className="feature-desc">
								With higher ROI, cheaper set up costs and more attractive engagement metrics comparable
								to outdoor social social events, social digital events that were once overlooked as
								being untraditional have taken center stage
							</div>
						</div>
						<div className="flex w-1/2 justify-end py-64">
							<img alt="vector18" src="./assets/images/backgrounds/device-2.png" />
						</div>
					</div>

					<div className="flex flex-row">
						<div className="flex flex-col p-128 crazy-fun-section self-center">
							<div className="feature-desc">
								At Jiweman, we are privileged to be at the forefront championing live online competitive
								mobile multiplayer gaming events centered around your brand.Let us be the perfect tonic
								to lost brand affinity that once came with brand led outdoor social events
							</div>
						</div>
					</div>
					<div className="flex flex-row self-center">
						<div className="flex justify-center py-64">
							<img alt="vector18" src="./assets/images/backgrounds/Group-1.png" />
						</div>
					</div>
				</div>
			</div>

			<div className={clsx(classes.thirdSection, 'flex flex-col')}>
				<div className={clsx(classes.thirdSectionContent, 'flex flex-col')}>
					<div className={clsx({}, 'flex flex-row px-128 py-64')}>
						<div className="flex flex-col w-1/2 self-center bonito-label">
							Joga <br /> Bonito
						</div>
						<div className="flex w-1/2 justify-end py-64">
							<div>
								<img alt="vector18" src="./assets/images/logos/logo.png" />
							</div>
						</div>
					</div>
					<div />
					<div className="flex flex-row">
						<div className="flex w-1/2 justify-start py-64 relative" style={{ right: '10rem' }}>
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Frame-12.png" />
							</div>
						</div>
						<div className="flex flex-col w-1/2 p-128 crazy-fun-section self-center">
							<div className="feature-desc">
								Joga Bonito is a skill based physics oriented game meaning literally anyone can play it!
								It’s easy to learn but hard to master
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-col w-1/2 p-128 crazy-fun-section self-center">
							<div className="feature-desc">
								The game is strategy oriented:The player can pick an attacking, defensive or balanced
								approach for his gameplay as needed
							</div>
						</div>
						<div className="flex w-1/2 justify-end py-64">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Group-2.png" />
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex w-1/2 justify-start p-64">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/Mascot.png" />
							</div>
						</div>
						<div className="flex flex-col w-1/2 p-128 crazy-fun-section self-center">
							<div className="feature-desc">
								Color commentary, colorful celebration animation and wonderful disc design make the
								gameplay experience that much better
							</div>
						</div>
					</div>
					<div className="flex flex-row self-center">
						<div className="flex justify-center py-64">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/device-4.png" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={clsx(classes.fourthSection, 'flex flex-col')}>
				<div className={clsx(classes.fourthSectionContent, 'flex flex-col')}>
					<div className={clsx({}, 'flex flex-row px-128 py-64')}>
						<div className="flex flex-col w-1/2 self-center brand-label">
							Create Your Brand’s Social Network Through Customized League Sponsorship
						</div>
					</div>
					<div />
					<div className="flex flex-row mb-128">
						<div className="flex flex-col p-128 crazy-fun-section self-center">
							<div className="feature-desc-type-2">
								At Jiweman, we give you all the tools you need to create your own brand gaming
								environment within our own game. Your own customized game environment will be designed
								to function as its very own mini social network where players can play, socialize and
								team up together for great meaningful events
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={clsx(classes.fifthSection, 'flex flex-col')}>
				<div className={clsx(classes.fifthSectionContent, 'flex flex-col')}>
					<div className={clsx({}, 'flex flex-row py-64')}>
						<div className="flex flex-col w-1/2 py-128 px-64 customization-label">
							Customize Competition Rules and leaderboards
						</div>
						<div
							className="flex w-1/2 justify-end pb-128"
							style={{
								'overflow-x': 'hidden',
								overflow: 'hidden'
							}}
						>
							<div
								style={{
									transform: 'rotate(10deg)',
									position: 'relative',
									left: '10rem',
									top: ' 8rem'
								}}
							>
								<img alt="vector18" src="./assets/images/backgrounds/device-4.png" />
							</div>
						</div>
					</div>

					<div />
					<div className="flex flex-row mb-128">
						<div className="flex flex-col px-128 pb-128 crazy-fun-section self-center">
							<div className="customization-points">
								<p>
									Brand the League in your Own Name just like the Premier League does
									<br />
									Set the exact &ldquo;Number of Goals Needed To Win&rdquo; that you want scored in a
									match
									<br />
									Set the number of &ldquo;Rounds&rdquo; players can play in a league
									<br />
									Set the number of &ldquo;Legs&rdquo; players can play per round <br />
									Set the number of &ldquo;Winners&rdquo; of each league
									<br />
									Set the &ldquo;Total Prize Amount&rdquo; to be awarded in the league
									<br />
									And so much more&hellip;...
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={clsx(classes.sixthSection, 'flex flex-col')}>
				<div className={clsx(classes.sixthSectionContent, 'flex flex-col')}>
					<div className={clsx({}, 'flex flex-row py-64')}>
						<div className="flex flex-col w-1/2 py-128 px-64 customization-label">
							Customize League Mission/Agenda
						</div>
					</div>

					<div />
					<div className="flex flex-row mb-128">
						<div className="flex flex-col px-128 crazy-fun-section self-center">
							<div className="customization-points">
								<p>
									Do you want to promote a new existing product?
									<br />
									Do you want to promote a social justice message?
									<br />
									Do you want to promote any CSR causes?
									<br />
									Work with Jiweman to make this happen and get better ROI than you would on a
									billboard, on T.V or on radio
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-row self-center pb-128">
						<div className="flex justify-center px-64">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/party.png" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={clsx(classes.seventSection, 'flex flex-col ')}>
				<div className={clsx(classes.seventSectionContent, 'flex flex-col last-section')}>
					<div className="flex flex-row self-center py-128">
						<div className="flex justify-center px-64">
							<div>
								<img alt="vector18" src="./assets/images/backgrounds/new-1.png" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <div style={{ padding: '3rem', background: '#1B262C' }}>
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
			</div> */}
		</div>
	);
}

export default Homepage;
