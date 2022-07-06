import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
	layoutRoot: {},
	toolbarHeight: {
		height: '200px'
	}
});

function TermsConditions() {
	const classes = useStyles();

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot,
				toolbar: 'h-auto'
			}}
			// header={
			// 	// <div className="p-24">
			// 	// 	<h4>Header</h4>
			// 	// </div>
			// }
			contentToolbar={
				<div className="px-24 flex flex-col items-center w-full">
					<FuseAnimate animation="transition.expandIn">
						<Logo height={120} />
					</FuseAnimate>
					<Typography variant="h4" className="p-16 font-300">
						Terms &amp; Conditions
					</Typography>
				</div>
			}
			content={
				<div className="p-24 tnc-class">
					<Typography variant="subtitle1">
						<strong>TERMS OF USE</strong>
					</Typography>
					<Typography variant="subtitle1">
						This agreement is between you the [&ldquo;User&rdquo; or &ldquo;you&rdquo;] and
						<strong>&nbsp;JIWEMAN INC. </strong>(Collectively,{' '}
						<strong>
							&ldquo;JIWEMAN&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo; and &ldquo;us&rdquo;.)
						</strong>
					</Typography>
					<Typography variant="subtitle1">
						The use of <a href="http://www.jiweman.com">www.jiweman.com</a>, and its related Mobile and Web
						Applications or Software (&ldquo;IOS and Android&rdquo; inclusive) (collectively, &ldquo;the
						website or site&rdquo;) is subject to the following terms and conditions.{' '}
						<strong>JIWEMAN</strong> reserves the right to update the Terms and Conditions at any time
						without notice to the user. The most current version of the Terms and Conditions can be reviewed
						by clicking on the &lsquo;Terms of service&rsquo; hypertext link located at the bottom of our
						webpages.
					</Typography>
					<Typography variant="subtitle1">
						WHEN YOUR CREATE AN ACCOUNT ON THE SITE (your &ldquo;Account&rdquo;), OR YOU USE THE SERVICES IN
						ANY WAY, AND BY CLICKING &ldquo;I ACCEPT&rdquo; BELOW, DOWNLOADING ANY APPLICATION INTEGRATED
						WITH JIWEMAN&rsquo;S SOFTWARE, OR REGISTERING FOR OR PARTICIPATING IN ANY COMPETITIONS, YOU: (A)
						ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS OF SERVICE AND ALL OBLIGATIONS AND
						RULES THAT MAY BE INCLUDED WITHIN EACH COMPETITION IN WHICH YOU PARTICIPATE
						(&ldquo;Rules&rdquo;) (these Terms and Conditions of Service, the terms of any policy
						incorporated herein, and the Rules are collectively referred to as the &ldquo;Terms&rdquo;) IN
						THEIR ENTIRETY; (B) AGREE TO BE BOUND BY THE TERMS; AND (C) ARE AUTHORIZED AND ABLE TO ACCEPT
						THESE TERMS.
					</Typography>
					<Typography variant="subtitle1">
						If you do not agree with all of the provisions of this agreement, you cannot use the Services.
						To remove any doubt, in the event of any conflict or discrepancy between these Terms and
						conditions and any other provisions and/or terms and/or otherwise between{' '}
						<strong>JIWEMAN </strong>and you, the provisions and the terms of these Terms of Use will
						prevail. Please feel free to contact us with any questions regarding the content of this
						agreement.
					</Typography>
					<Typography variant="subtitle1">
						<strong>IMPORTANT LEGAL NOTICE</strong>.
					</Typography>
					<Typography variant="subtitle1">
						<strong>ARBITRATION</strong>. ALL DISPUTES&nbsp;ARISING UNDER THIS TERMS AND CONDITIONS SHALL BE
						GOVERNED BY AND INTERPRETED IN ACCORDANCE WITH THE LAWS OF WYOMING, WITHOUT REGARD TO PRINCIPLES
						OF CONFLICT OF LAWS. YOU AGREE TO SUBMIT ALL DISPUTES ARISING UNDER THIS TERMS AND CONDITIONS TO
						ARBITRATION IN WYOMING, WYOMING BEFORE A SINGLE ARBITRATOR OF THE AMERICAN ARBITRATION
						ASSOCIATION (&ldquo;AAA&rdquo;). THE ARBITRATOR SHALL BE SELECTED BY APPLICATION OF THE RULES OF
						THE AAA, OR BY OUR MUTUAL UNDERSTANDING, EXCEPT THAT SUCH ARBITRATOR SHALL BE AN ATTORNEY
						ADMITTED TO PRACTICE LAW WYOMING. SUCH DISPUTE ARISING MUST BE RESOLVED BY FINAL AND BINDING
						ARBITRATION IN ACCORDANCE WITH THE PROCESS FURTHER DESCRIBED IN THE RELEVANT SECTION BELOW. TO
						THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, YOU ARE GIVING UP THE RIGHT TO LITIGATE (OR
						PARTICIPATE IN AS A PARTY OR CLASS MEMBER) ALL DISPUTES IN COURT BEFORE A JUDGE OR JURY.
					</Typography>
					<Typography variant="subtitle1">
						<strong>1. USAGE</strong>
					</Typography>
					<Typography variant="subtitle1">
						You will use this site in a manner consistent with any, and all, applicable laws, legislation,
						rules and regulations. If you violate any restrictions in these terms, you agree to indemnify{' '}
						<strong>JIWEMAN </strong>for any losses, costs or damages, including reasonable legal fees,
						incurred by <strong>JIWEMAN </strong>in relation to, or arising out of, such a breach.
					</Typography>
					<Typography variant="subtitle1">
						2. <strong>ABOUT JIWEMAN </strong>
					</Typography>
					<Typography variant="subtitle1">
						<strong>JIWEMAN </strong>
						<strong>INC</strong> is a skill gaming company based in Wyoming USA. We make mobile multiplayer
						skill based games for the e-sports market where real money wagers are involved in a tournament
						style format. We are mostly targeted to the e-sports community outside of the United States
						where e-sports is relatively young and undeveloped. With data and smartphones becoming more
						affordable over the last few years, mobile multiplayer gaming is expected to experience a boom
						and we want to be able to harness such opportunity and be right in the middle of it. We verify
						all new profiles to ensure users have a smooth, safe, and enjoyable e-gaming
						environment.&nbsp;To effectively carry out its business activities, JIWEMAN has created the
						site.
					</Typography>
					<Typography variant="subtitle1">
						3. <strong> APPLICABILITY </strong>
					</Typography>
					<Typography variant="subtitle1">"These general terms and conditions (the "Conditions") apply to:</Typography>
					<Typography variant="subtitle1">
						(a) The use of any information, pictures, documents and/or other services offered by{' '}
						<strong>JIWEMAN</strong> via (our &ldquo;Website&rdquo;);&nbsp;
					</Typography>
					<Typography variant="subtitle1">(b) The subscription to any of the services or competitions provided on the website.</Typography>
					<Typography variant="subtitle1">
						<strong>
							4. CHANGES TO TERMS OF USE AND SERVICES<u>.</u>
						</strong>{' '}
					</Typography>
					<Typography variant="subtitle1">
						THESE TERMS MAY BE AMENDED OR CHANGED BY US IN OUR DISCRETION, WITH OR WITHOUT NOTICE, AT ANY
						TIME. We indicate at the top of the page when these Terms were last updated. Your continued
						access or use of the Website or any other Services following such changes will be deemed
						acceptance of such changes. In addition, we reserve the right to modify or cease providing all
						or any portion of the Services at any time, with or without notice. Be sure to return to this
						page periodically to ensure familiarity with the most current version of these Terms.
					</Typography>
					<Typography variant="subtitle1">
						<strong>5. PRIVACY POLICY.</strong>{' '}
					</Typography>
					<Typography variant="subtitle1">
						We are committed to protecting the privacy of the personal information you provide to us through
						the Website. Any personal information submitted through the Website by you is subject to
						our&nbsp;Privacy Policy, which is incorporated herein by reference. By using any feature on this
						Website, you are consenting to the use of the personal information you submit to us to provide
						the service to you.{' '}
					</Typography>
					<Typography variant="subtitle1">
						6. <strong>USER ELIGIBILITY</strong>
					</Typography>
					<Typography variant="subtitle1">
						6.1 You may not modify these Terms except in writing signed by both you and{' '}
						<strong>JIWEMAN.</strong> For purposes of these Terms, &ldquo;writing&rdquo; does not mean an
						email nor an electronic/facsimile signature.
					</Typography>
					<Typography variant="subtitle1">
						6.2 We have spelt out the eligibility criteria to use the service in the United States. To use
						the services we have provided on the site, you must: (a) be a natural person who is at least 18
						years of age or older, and who is personally assigned to the email address submitted during your
						Account registration; (b) have the power to enter into a contract with JIWEMAN and if you are
						representing a corporation, you have been authorized to contract on their behalf; (c) be
						physically located within the U.S. when accessing your Account and participating in
						Competitions; (d) be physically located within a U.S. state in which participation in the
						Competition you select is unrestricted by that state&rsquo;s laws; and (e) at all times abide by
						these Terms. If any one of these requirements is not met at any time, we, as agents for our
						developer partners, may suspend or close your Account with or without notice.
					</Typography>
					<Typography variant="subtitle1">
						6.3 We have also spelt out the User Eligibility criteria for Non-U.S nationals. To use the
						services we have provided on the site, you must: (a) be a natural person who is at least 18
						years of age or older, and who is personally assigned to the email address submitted during your
						Account registration; (b) have the power to enter into a contract with JIWEMAN and if you are
						representing a corporation, you have been authorized to contract on their behalf; ; (c) be
						physically located in a jurisdiction in which participation in the Competition you select is
						permitted and unrestricted by that state or country&rsquo;s laws; and (d) at all times abide by
						these Terms. If any one of these requirements is not met at any time, we, on behalf of our
						developer partners, may suspend or close your Account with or without notice.
					</Typography>
					<Typography variant="subtitle1">
						6.4 Our employees are not permitted to use the service by virtue of their employment contract
						with us. However, <strong>JIWEMAN</strong> employees may use the Services and/or Software for
						the purpose of testing the user experience, but they aren&rsquo;t eligible to withdraw any funds
						from the website. <strong>JIWEMAN</strong> directors, contractors, affiliates, or partners may
						use the Website, Services and/or Software without such limitation, but only if they do not have
						any access to non-public information relating to the Services and/or Software that would lead to
						any advantage in their play using the Services and/or Software.
					</Typography>
					<Typography variant="subtitle1">
						7. <strong>ACCOUNT.</strong>{' '}
					</Typography>
					<Typography variant="subtitle1">
						{' '}
						In order to participate in or receive certain Services, you will be required to create an
						account with us (&ldquo;Account&rdquo;), and you may be subject to additional contractual terms
						and conditions applicable to such Services (&ldquo;Additional Terms&rdquo;), which Additional
						Terms will be accessible to you on the Website or presented to you as Additional Terms when you
						sign up for or access such Services. Any such Additional Terms shall be incorporated into and
						form a part of these Terms. Your Account is for your individual, personal use only, and you may
						not authorize others to use your Account for any purpose. In creating your Account, you certify
						that all information you provide is complete and accurate. You agree to update your information
						when required or requested, and you further agree not to use another person&rsquo;s account
						without permission. You are responsible for maintaining the confidentiality of, and restricting
						access to, your Account and password, and you agree to accept sole responsibility for all
						activities that occur under your Account or password. You agree to contact our&nbsp;
						<strong>customer service department</strong>&nbsp;immediately of any breach of security or
						unauthorized use of your Account or any violation of these Terms by others of which you are
						aware. You agree that we shall have no liability for any losses, damages, liabilities or
						expenses you may incur due to any unauthorized use of your Account, and you agree to indemnify
						us and hold us harmless for any such unauthorized use. We reserve the right to create accounts
						for quality control and administrative purposes. Such accounts may be publicly viewable.
					</Typography>
					<Typography variant="subtitle1">
						8. <strong>SERVICES PROVIDED AND APPLICATIONS</strong>
					</Typography>
					<Typography variant="subtitle1">
						8.1 <strong>The services</strong>. JIWEMAN reserve the right to modify, suspend or terminate
						your access to this website where it is discovered that you are in breach of the material
						provisions of these terms and conditions. Please note that such exercise of right can be done
						with or without express notice to you. Also, and without limiting our other rights or remedies,
						if we believe you have violated these Terms or if you have violated these Terms, as agent for
						our developer partners, we may determine that your Winnings, if any, will be forfeited,
						disgorged or recouped.
					</Typography>
					<Typography variant="subtitle1">
						8.2. <strong>Software.</strong> We have provided different versions of our software to suit the
						needs of your devices. Therefore, use of the services and participation in any competition can
						be accessed when you download certain mobile applications from our third-party developer
						partners which have integrated <strong>JIWEMAN &rsquo;S</strong> SDK (together with the content
						included therein, any associated documentation, and any application program interfaces, license
						keys, and patches, updates, upgrades, improvements, enhancements, fixes and revised versions of
						any of the foregoing, is collectively &ldquo;Software&rdquo;). If you do not download the
						Software, you will not be able to participate in Competitions or receive relevant Services.
						Whether you download the Software directly or from a third party, such as via an app store, your
						use of the Software is subject to these Terms. We license the Software to you under Section 14.1
					</Typography>
					<Typography variant="subtitle1">
						8.3. <strong>Remote Access and Updates</strong>. Software updates and technical support shall be
						offered from time to time by We and/or our developer partners choose to offer technical support.
						Please note that this would be solely done at our discretion. To offer such support to you, this
						may require that we or our developer partners remotely access your device on which the Software
						is installed (&ldquo;Device&rdquo;). Also, if and when our developer partners update the
						Software or deploy patches, updates, and modifications to the <strong>JIWEMAN SDK</strong>{' '}
						integrated into the Software, as applicable, we may do so through remote access of your Device
						without your knowledge. You hereby consent to these activities. You acknowledge that if we or
						our developer partners cannot remotely access your Device, then the Software may no longer work,
						and this may prevent you from participating in Competitions or otherwise receiving Services. We
						and/or our developer partners&rsquo; access to your Device will be limited solely to (i)
						providing support (ii) updating the Software or (iii) determining your location for skill-gaming
						regulatory purposes only, and is governed by the terms of our Privacy Policy.
					</Typography>
					<Typography variant="subtitle1">
						8.4. <strong>Beta Releases.</strong> We and our partners/or developers may release a beta
						version of the software for the services we provide on the site. When we do, you acknowledge and
						agree that a Beta Service may contain more or fewer features than the final release of the
						Service. We and our developer partners reserve rights not to release a final release of a Beta
						Service or to alter any such Beta Services&rsquo; features, specifications, capabilities,
						functions, licensing terms, release dates, general availability or other characteristics. Beta
						Services may not be suitable for production use and may contain errors affecting proper
						operation and functionality.
					</Typography>
					<Typography variant="subtitle1">
						9. <strong>EXCLUSION OF LIABILITY FOR EXTERNAL LINKS</strong>
					</Typography>
					<Typography variant="subtitle1">
						The Website may provide links to external Internet sites. JIWEMAN hereby declares explicitly
						that it has no influence on the layout or content of the linked pages and dissociates itself
						expressly from all contents of all linked pages of third parties. <strong>JIWEMAN</strong> shall
						not be liable for the use or content of Internet sites that link to this site or which are
						linked from it. Our<strong>&nbsp;privacy&nbsp;</strong>and&nbsp;<strong>cookie notice</strong>{' '}
						do not apply to any collection and processing of your personal data on or through such external
						sites.
					</Typography>
					<Typography variant="subtitle1">
						<strong>10. COMPLIANCE WITH LAWS</strong>
					</Typography>
					<Typography variant="subtitle1">
						10.1. <strong>Prohibited US States/Countries.</strong> We provide the service to you bearing in
						mind that we have to comply with state laws and regulatory requirements. We expect that you
						follow strictly, the laws stated out explicitly in these terms and laws provided by your
						respective States/Countries with regards to e-gaming. You acknowledge that various rules,
						regulations and laws addressing sweepstakes, contests, and tournaments with entry fees and/or
						prizes govern your participation in Competitions (&ldquo;Gaming Laws&rdquo;), and that Gaming
						Laws are set up by each individual US state, country, territory, or jurisdiction. Therefore, the
						Software DOES NOT permit Cash Competitions (as defined in section 16.3) to be offered to users
						participating in Competitions in any state in which such Competition violates its Gaming Laws
						(&ldquo;Prohibited Jurisdiction&rdquo;), and if you are located in any Prohibited Jurisdiction
						then you may not participate in Cash Competitions. In the United States, Prohibited
						Jurisdictions, as of the &ldquo;Updated&rdquo; date above, include: Arizona, Arkansas,
						Connecticut, Delaware, Florida, Louisiana, Montana, South Carolina, South Dakota, and Tennessee.
						For card games, Prohibited Jurisdictions include Maine and Indiana. It is your responsibility to
						determine whether the state, country, territory or jurisdiction in which you are located is a
						Prohibited Jurisdiction. Together with our developer partners, we reserve the right (but have no
						obligation) to monitor the location from which you access Services, and on behalf of our
						developer partners, we may block access from any Prohibited Jurisdiction. Each time you log in
						to participate in a Cash Competition, you must accurately confirm the location from which you
						are playing.
					</Typography>
					<Typography variant="subtitle1">
						10.2. <strong>Additional Laws</strong>. In addition to Gaming Laws, you are also subject to all
						municipal, state and federal laws, rules and regulations of the city, state and country in which
						you reside and from which you access and use Services, including without limitation U.S. export
						laws (together with Gaming Laws, the &ldquo;Applicable Laws&rdquo;). You are solely responsible
						for your compliance with all Applicable Laws. Access to Competitions may not be legal for some
						or all residents of, or persons present in, certain jurisdictions. SERVICES AND COMPETITIONS ARE
						VOID WHERE PROHIBITED OR RESTRICTED BY APPLICABLE LAWS. Your participation in Competitions is at
						your own risk, and you agree not to hold us responsible or liable if Applicable Laws restrict or
						prohibit your access or participation.
					</Typography>
					<Typography variant="subtitle1">
						10.3. <strong>LIABILITY LIMITATION</strong>. AS WE CANNOT GUARANTEE YOU WOULD COMPLY WITH
						APPLICABLE LAWS IN THE USE OF THESE SERVICES, WE THEREFORE LIMIT OURSELVES AND PARTNERS FROM ANY
						LIABILITY AND MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, AS TO THE LAWFULNESS OF
						YOUR PARTICIPATING IN ANY COMPETITION OFFERED BY OUR DEVELOPER PARTNERS OR USE OF SERVICES, NOR
						SHALL ANY PERSON AFFILIATED, OR CLAIMING AFFILIATION, WITH US HAVE AUTHORITY TO MAKE ANY SUCH
						REPRESENTATIONS OR WARRANTIES.
					</Typography>
					<Typography variant="subtitle1">
						<strong>11. YOUR ADDITIONAL REPRESENTATIONS AND WARRANTIES.</strong>{' '}
					</Typography>
					<Typography variant="subtitle1">11.1 You further represent and warrant to us, under penalty of perjury, as follows:</Typography>
					<Typography variant="subtitle1">
						(a) You will not provide or permit access or use of the Services, or your Account, by any
						minors;
					</Typography>
					<Typography variant="subtitle1">
						(b) Your Account information is current, complete and accurate and you will promptly update all
						information to keep your Account and billing information complete and accurate upon any change
						(such as change of billing address, credit card number or expiration date);
					</Typography>
					<Typography variant="subtitle1">
						(c) You have not and will not access or use the Services from any place or jurisdiction where
						such use is prohibited or contrary to applicable laws, rules, regulations, ordinances, edicts or
						customs, and you are not a national or resident of any country which the United States has (i)
						embargoed goods; (ii) identified as a "Specially Designated National"; or (iii) placed on the
						Commerce Department's Table of Deny Orders;
					</Typography>
					<Typography variant="subtitle1">
						(d) Your use of the Services is and will be in compliance with all applicable laws, rules,
						regulations, ordinances, edicts or customs;
					</Typography>
					<Typography variant="subtitle1">
						(e) You understand that when you gain access to the Services, you will be exposed to visual
						images, verbal descriptions and audio sounds and other content of a sexually oriented, and
						explicitly erotic nature, which may include graphic visual depictions and descriptions of nudity
						and sexual activity. You are voluntarily choosing to do so, because you want to view, read
						and/or hear the various materials and content which are available, for your own personal
						enjoyment, information and/or education. Your choice is a manifestation of your interest in
						sexual matters which, you believe, is both healthy and normal and which, in your experience, is
						generally shared by average adults in your community. You further represent and warrant that you
						are familiar with the standards in your community regarding the acceptance of such
						sexually-oriented and explicit materials and the materials you expect to encounter are within
						those standards. In your judgment, the average adult in your community accepts the consumption
						of such materials by willing adults in circumstances such as this which offer reasonable
						insulation from the materials for minors and unwilling adults, and will not find such materials
						to appeal to a prurient interest or to be patently offensive;
					</Typography>
					<Typography variant="subtitle1">
						(f) You have not notified any governmental agency, including the U.S. postal service, that you
						do not wish to receive sexually oriented material; and
					</Typography>
					<Typography variant="subtitle1">
						(g) If you establish an Account, you (i) have never been convicted of a felony; and (ii) are not
						required to register as a sex offender with any government entity or agency.
					</Typography>
					<Typography variant="subtitle1">
						(h) You will not use any robot, spider, scraper or other automated measures to (i) access or use
						the Services, (ii) circumvent any technical measures we use to provide the Services, (iii) cause
						harm to us or our affiliated entities.
					</Typography>
					<Typography variant="subtitle1">
						12. <strong>INDEMNIFICATION.</strong>{' '}
					</Typography>
					<Typography variant="subtitle1">
						To the fullest extent permitted by applicable law, you agree to indemnify, defend and hold
						harmless JIWEMAN, and our respective past, present and future employees, officers, directors,
						contractors, consultants, equity holders, suppliers, vendors, service providers, parent
						companies, subsidiaries, affiliates, agents, representatives, predecessors, successors and
						assigns (individually and collectively, the &ldquo;JIWEMAN Parties&rdquo;), from and against all
						actual or alleged JIWEMAN Party or third party claims, damages, awards, judgments, losses,
						liabilities, obligations, penalties, interest, fees, expenses (including, without limitation,
						attorneys&rsquo; fees and expenses) and costs (including, without limitation, court costs, costs
						of settlement and costs of pursuing indemnification and insurance), of every kind and nature
						whatsoever, whether known or unknown, foreseen or unforeseen, matured or unmatured, or suspected
						or unsuspected, in law or equity, whether in tort, contract or otherwise (collectively,
						&ldquo;Claims&rdquo;), including, but not limited to, damages to property or personal injury,
						that are caused by, arise out of or are related to (a) your use or misuse of the Sites, Content
						or Products, (b) any Feedback you provide, (c) your violation of these Terms, (d) your violation
						of the rights of another, (e) any third party&rsquo;s use or misuse of the Sites or Products
						provided to you and (f) any User Content you create, post, share or store on or through the
						Sites or our pages or feeds on third party social media platforms. You agree to promptly notify
						JIWEMAN of any third-party Claims and cooperate with the JIWEMAN Parties in defending such
						Claims. You further agree that the JIWEMAN Parties shall have control of the defense or
						settlement of any third-party Claims. This indemnity is in addition to, and not in lieu of, any
						other indemnities set forth in a written agreement between you and JIWEMAN.
					</Typography>
					<Typography variant="subtitle1">
						13. <strong>PRIVACY POLICY</strong>
					</Typography>
					<Typography variant="subtitle1">
						<strong>13.1 Privacy Policy. </strong>We remain committed to protect the data you supply to us
						when you visit the Website, participate in Competitions, download and use the Software and
						receive Services, and its terms are made a part of these Terms by this reference. We receive,
						store and use all information that you submit to the Website and all information you submit in
						registering for and participating in Services, in accordance with the Privacy Policy. We
						therefore advise that you read this section carefully.
					</Typography>
					<Typography variant="subtitle1">
						We believe your business is no one else&rsquo;s. Your Privacy is important to you and to us. So,
						we&rsquo;ll protect the information you share with us. To protect your privacy,{' '}
						<strong>JIWEMAN </strong>follows different principles in accordance with worldwide practices for
						customer privacy and data protection.
					</Typography>
					<Typography variant="subtitle1">
						- We won&rsquo;t sell or give away your name, mail address, phone number, email address or any
						other information to anyone.
					</Typography>
					<Typography variant="subtitle1">
						- We&lsquo;ll use state &ndash; of &ndash; the &ndash; art security measures to protect your
						information from unauthorized users.
					</Typography>
					<Typography variant="subtitle1">
						Therefore, to provide you with our services we need (and sometimes are obliged by the law) to
						collect your personal data. This Privacy Policy (the &ldquo;Policy&rdquo;) informs Users (a
						"User", or "You") of our policies regarding the processing of Personal Information we receive
						from Users of the site.
					</Typography>
					<Typography variant="subtitle1">
						We also collect anonymous aggregated and/or statistical data reflecting your use of the Website
						and Services and may use such data for tracking, reporting and other activities in connection
						with our business, also all in accordance with the Privacy Policy. We will not intentionally
						disclose any personally identifying information about you (including information submitted in
						creating an Account, your social security number, your email address, phone number, or passport,
						information obtained by the Website from cookies, and information regarding your IP address) to
						third parties without your consent except (1) where expressly specified in these Terms, (2)
						where expressly specified in the Privacy Policy, and/or (3) where we, in good faith, believe
						such disclosure is necessary to comply with Applicable Laws, to enforce these Terms against you,
						or to help prevent a loss of life or physical injury or crime.
					</Typography>
					<Typography variant="subtitle1">
						13.2. <strong>Communications with You</strong>. As also detailed in the Privacy Policy, we may
						use emails, text messages, and push notifications to notify you when you win our developer
						partners&rsquo; Competitions, when a Competition you have entered has completed, and to let you
						know of special promotions, events and policy changes. We may also communicate with you via
						email, text message, push notification or chat for any other purpose relating to Services or
						Software. We or our representatives may monitor all communications made by or received by you
						while using the Website and Services. If you do not wish to receive these communications from
						us, you may opt out by emailing <a href="mailto:support@jiweman.com">support@jiweman.com</a> but
						you acknowledge that opting out may result in your inability to participate in our developer
						partners&rsquo; Competitions or receive Services.
					</Typography>
					<Typography variant="subtitle1">
						13.3. <strong>Device Information</strong>. Using the Software and Services requires an Internet
						connection to our servers, and we (on behalf of our developer partners) or our developer
						partners may need to collect certain information from you and your Internet-enabled device
						(&ldquo;Device&rdquo;) in order to make the Software and Services available to you, such as
						hardware system profile data, internet connection data and any other data related to the
						operation of the Service from any Device that logs onto the Service using your Account. We will
						use this information in accordance with the Privacy Policy.
					</Typography>
					<Typography variant="subtitle1">
						13.4. <strong>Warning</strong>. Please take care in sending us sensitive information because
						third parties can unlawfully intercept or access transmissions or private communications between
						you and us, and you acknowledge that internet transmissions are never completely private or
						secure. For your safety, you should never reveal any sensitive personal information in any
						Jiweman -enabled public forums, message boards or chat features.
					</Typography>
					<Typography variant="subtitle1">
						13.5. <strong>Promotional Activities</strong>. By registering for an Account, you allow us
						and/or our developer partners to publicly display your username and tournament records, and to
						use this information for any purpose. By using the Services, you allow us and our developer
						partners to print, publish, broadcast and use, worldwide, in any media and at any time, your
						name, picture, voice, likeness, and/or any biographical information that you submit to us or our
						developer partners (&ldquo;Biographical Information&rdquo;) for promotional, marketing or
						related business purposes, without compensation to you. However, we will never sell your
						Biographical Information without your prior written consent, and our use of your personally
						identifiable information is always governed by our Privacy Policy.
					</Typography>
					<Typography variant="subtitle1">
						13.6. <strong>Gameplay Dialogue</strong>. On behalf of our developer partners, we may use third
						party websites and technologies to record or stream gameplay or chat dialogue occurring through
						the Services, including your own dialogue (&ldquo;Recordings&rdquo;). We use Recordings to
						verify compliance with these Terms and as part of marketing and promotion of the Services.
						Please do not submit personally identifiable information in gameplay dialogue&mdash;this
						information is available for anyone to see and use. You may record and distribute your own
						recordings of gameplay dialogue for non-commercial purposes (i.e., you may not record or
						distribute Recordings for compensation) so long as your recording and distribution: (a) do not
						include other products or services that are competitive with the Services, and (b) comply with
						these Terms.
					</Typography>
					<Typography variant="subtitle1">
						13.7. <strong>Children</strong>. The Services will not knowingly accept personal information
						from anyone under 18 years old. If you believe that a child under 18 has gained access to the
						Services, please contact us at <a href="mailto:support@jiweman.com">support@jiweman.com</a> On
						behalf of ourselves and our developer partners, we have taken commercially reasonable steps to
						restrict use of Services to those who are at least 18 years old. As agent for our developer
						partners, we do not sell products or services for purchase by minors.
					</Typography>
					<Typography variant="subtitle1">
						14. <strong>ACCEPTABLE USE POLICY</strong>
					</Typography>
					<Typography variant="subtitle1">
						14.1 <strong>License.</strong> Subject to your compliance with these Terms, JIWEMAN grants you a
						limited, non-exclusive, revocable (with or without cause), non-transferable right and license to
						use the Services.
					</Typography>
					<Typography variant="subtitle1">
						14.2 <strong>Rules of Conduct.</strong> You shall use the Services in accordance with these
						Terms and shall not:
					</Typography>
					<ul type="disc">
						<li>
							Upload any Content (as defined below) that violates or infringes another party&rsquo;s
							rights of publicity, Privacy, Copyright, trademark or any other intellectual property right.{' '}
						</li>
						<li>
							Copy, decompile, reverse engineer, disassemble, attempt to derive the source code of,
							decrypt, interfere with, or disrupt the integrity or the performance of the services.
						</li>
						<li>
							Make any modification, adaptation, improvement, enhancement, translation or derivative work
							from the services.
						</li>
						<li>
							Violate any applicable laws, rules or regulations in connection with your access or use of
							the Services.
						</li>
						<li>Use the Services in violation of or to circumvent any sanctions or embargo.</li>
						<li>
							Remove, alter or obscure any proprietary notice (including any notice of copyright and
							trademark) of JIWEMAN or its affiliates, Partners, Suppliers or Licensors.
						</li>
						<li>Use the Services for any purpose for which it is not designed or intended.</li>
						<li>
							Use the Services to create or promote a product, service or software that is, directly or
							indirectly, competitive with or in any way a substitute for the Services or any services,
							product or software offered by JIWEMAN.
						</li>
						<li>
							Use any proprietary information or interfaces of JIWEMAN or any other intellectual property
							of JIWEMAN in the design, development, manufacture, licensing or distribution of any
							application, accessories or devices for use with the Services.
						</li>
						<li>
							Use the Services to send, post, or otherwise communicate any Content which is offensive,
							indecent, threatening, abusive, insulting, harassing, defamatory, libellous, deceptive,
							fraudulent, tortious, obscene, profane, invasive of another person&rsquo;s privacy, or
							racially, ethnically or otherwise objectionable.
						</li>
						<li>
							Use the Services to send automated, unsolicited or unauthorised messages, advertising or
							promotional material or any junk mail, spam or chain letters.
						</li>
						<li>
							Upload to, or transmit through the Services any data, file, software or link that contains
							or redirects to a virus, Trojan horse, worm or other harmful components.
						</li>
						<li>
							Use any scraper, robot, bot, spider, crawler or any other automated device or means to
							access, acquire, copy or monitor any portion of the Services, or any data or content found
							or access through the Services.
						</li>
						<li>Collect any information in respect of other users without their consent.</li>
						<li>Commit any act to avoid paying any applicable fees and/or charges.</li>
						<li>
							Attempt to and/or engage in any activity or act that is intended to abuse, abuses or
							inappropriately manipulates any promotion, campaign and/or discount codes offered through
							the Services. Such act and activities include but are not limited to: creating fake or
							duplicate accounts; generating fake orders; buying and reselling your own inventory.&nbsp;
						</li>
						<li>Authorise or encourage anyone to do any of the foregoing.</li>
					</ul>
					<Typography variant="subtitle1">
						14.3 JIWEMAN reserves the right to claw back any cashbacks, prizes and/or amounts paid to you
						under any event, promotion, offers, campaign and any other activities and/or terminate or
						suspend your account, if you are subsequently found or suspected to be engaged&nbsp;in any
						activity or act that is in&nbsp;breach of these Terms, our guidelines, any&nbsp;additional terms
						and conditions and policies.
					</Typography>
					<Typography variant="subtitle1">
						14.4 The intellectual property rights in all materials and content comprising the Service,
						including but not limited to images, written content and designs on each page of the JIWEMAN
						application and website, either belong to us or we have permission from the owner to use them to
						provide the Service. All such intellectual property is protected by worldwide intellectual
						property laws, including copyright and design laws. We give you permission to use the materials
						and content comprising the Service for the sole purpose of using the service in accordance with
						these terms of service.
					</Typography>
					<Typography variant="subtitle1">
						14.5 Your right to use the Service is personal to you and you are not allowed to give this right
						to another person or to sell, gift or transfer your Account to another person. Your right to use
						the Service does not stop us from giving other people the right to use the service.
					</Typography>
					<Typography variant="subtitle1">
						14.5 Other than as allowed in these Terms of Service or by us in writing, you are not given the
						right to use the &ldquo;JIWEMAN&rdquo; name, or any of the &ldquo;JIWEMAN&rdquo; trademarks,
						logos, domain names and other distinctive brand features, all of which are intellectual property
						rights that belong to JIWEMAN
					</Typography>
					<Typography variant="subtitle1">
						14.6 These Terms of Service do not grant you any rights to, or in, any such intellectual
						property rights or any other rights or licences in respect of JIWEMAN&rsquo;s materials and
						content, the Service, JIWEMAN name and/or trademarks, other than as set out in these Terms of
						Service.
					</Typography>
					<Typography variant="subtitle1">
						14.7. <strong>Cheating, Fraud, and Abuse</strong>. In accessing or participating in Services or
						using the Software, you represent and warrant to us and our developer partners that you will not
						engage in any activity that interrupts or attempts to interrupt the operation of the Services or
						Software. Anyone who engages in, participates in or displays behavior that may be interpreted,
						in the discretion of us and our developer partners only, as unfair methods in participating in
						Services or using the Software, including but not limited to, the opening and/or use of multiple
						accounts, the use of unauthorized or altered software or hardware to assist play (e.g., bots,
						bot nets, and collusion with bots), intentionally poor play in certain games to achieve
						competitive advantage, collusion with other players (e.g. intentionally losing rematches in Cash
						Competitions), deliberate transfer of money between accounts (e.g., &ldquo;money
						laundering&rdquo;), harassment of other participants, posting objectionable material, breach of
						these Terms, breach of security of your Account, or any other act (whether through the use of
						automated technology or otherwise) that unfairly alters your chance of winning or constitutes
						the commission of fraud (collectively, &ldquo;Abuse&rdquo;), you will be subject to immediate
						sanction (as determined by us and our developer partners only), which may include, without
						limitation: (1) immediate termination of your Account and blocking of your access to the Website
						and Services; (2) any Winnings that you may otherwise have been entitled to receive shall be
						void and forfeited; and (3) any Winnings received by you shall be subject to disgorgement and/or
						recoupment. In addition to the foregoing, as agent for our developer partners, we reserve the
						right to disclose or report any money laundering similar illegal activity to law enforcement and
						regulatory authorities. Without limiting our other available remedies, we, solely, or in
						conjunction with our developer partners, may institute or seek any injunctive relief, civil
						and/or criminal proceedings against you and/or any of your co-conspirators arising out of or
						related to your commission of Abuse, including without limitation recovering all of our and/or
						our developer partners&rsquo; fees and expenses (including reasonable attorneys&rsquo; fees) in
						connection with such efforts.
					</Typography>
					<Typography variant="subtitle1">
						14.8. <strong>Hacking, Tampering, or Unauthorized Access</strong>. Any attempt to gain
						unauthorized access to systems or any other user&rsquo;s account, interfere with procedures or
						performance of Services, Software or the Website or deliberately damage or undermine the
						Services or Software is subject to civil and/or criminal prosecution and will result in
						immediate termination of your Account and forfeiture of your Winnings. You acknowledge that we
						are not responsible for any damage, loss or injury resulting from hacking, tampering or other
						unauthorized access or use of the Services or your Account.
					</Typography>
					<Typography variant="subtitle1">
						15. <strong>YOUR CONTENT</strong>. You acknowledge that the Service is a passive conduit for
						user content and that: (i) neither we, nor our developer partners, pre-screen user content or
						communications or (ii) control, verify or pay for any user content or communications. We do not
						endorse, and specifically disclaim any responsibility or liability for, any publicly posted
						content. In addition, as agent for our developer partners, we may terminate your access to any
						public forums at any time, without notice, for any reason whatsoever, and/or delete, move or
						edit content submitted publicly, in whole or in part. You may only upload, send, and receive
						messages and material that is related to the subject matter of the public forums, complies with
						Applicable Laws, and conforms to any additional terms of service posted in the public forums.
						You may not upload to, distribute, or otherwise publish any content, information, or other
						material that (a) violates or infringes the copyrights, patents, trademarks, service marks,
						trade secrets, or other proprietary rights of any person; (b) is libelous, threatening,
						defamatory, obscene, indecent, pornographic, or could give rise to any civil or criminal
						liability under U.S. or international law; or (c) includes any bugs, viruses, worms, trap doors,
						Trojan horses or other harmful code or properties. Submissions or opinions expressed by users
						are that of the individual expressing such submission or opinion only. Subject to the foregoing,
						as agent for our developer partners, we may edit, refuse to post, or to remove any information
						or materials submitted, in our discretion. You may not use a false email address, pretend to be
						someone other than yourself or otherwise mislead us or third parties as to the origin of your
						submissions or content.
					</Typography>
					<Typography variant="subtitle1">
						<strong>16. WINNINGS, ACCOUNT FUNDS, AND PAYMENTS</strong>
					</Typography>
					<Typography variant="subtitle1">
						16.1. <strong>Fees</strong>. To participate in competitions and using the services on the site,
						we would charge a Fee for so doing. Fees and payments for Services that you pay to participate
						in Competitions (&ldquo;Fees&rdquo;) and billing procedures are detailed in the billing
						application. If Fees are charged to your Account, you agree to pay those Fees. All Fees are
						stated in U.S. Dollars, must be prepaid and are non-refundable. You are fully responsible and
						liable for all charges, deposits and withdrawals made under your Account, including any
						unauthorized charges, deposits or withdrawals. The price of Services may change at any time, but
						no price change will affect your past purchases.
					</Typography>
					<Typography variant="subtitle1">
						16.2. <strong>Billing</strong>. As agent for our developer partners, we may change Fees and
						billing procedures by updating the billing application with or without notice to you. By
						providing a payment method, you (i) represent that you are authorized to use the payment method
						that you provided and that any payment information you provide is true and accurate; (ii)
						authorize us, as agent for our developer partners, to charge you for the Services using your
						payment method; and (iii) authorize us, as agent for our developer partners, to charge you for
						any paid feature of the Services that you choose to sign up for. As agent for our developer
						partners, we may bill you (a) in advance; (b) at the time of purchase; or (c) shortly after
						purchase, in our sole discretion. You must tell us within 120 days after an error first appears
						on your bill for an investigation of the charge to occur promptly. After 120 days from the first
						appearance of the error, neither we nor our developer partners (i) will be liable for any losses
						resulting from the error and (ii) will be required to correct the error or provide a refund. If
						we or our developer partners identifies a billing error, it will be corrected within 90 days.
						You must pay for all reasonable costs we, as agent for our developer partners, incur to collect
						any past due amounts, including without limitation reasonable attorneys&rsquo; fees and other
						legal fees and costs.
					</Typography>
					<Typography variant="subtitle1">
						16.3. <strong>Cash Deposits</strong>. If you play games integrated in a Competition without
						depositing U.S. Dollars into your Account for that Competition, then you are a &ldquo;Non-Cash
						Player&rdquo; with respect to such Competition. However, if you play in a Competition that
						requires an entry paid in U.S. Dollars (&ldquo;Cash Competition&rdquo;), then you are a
						&ldquo;Cash Player&rdquo;, and if you establish a positive Account balance for entry fees for
						Cash Competitions, then you must submit and maintain at all times the following current and
						correct information: your full name, your permanent residential address, your phone number and
						your credit card or other payment information. Participating in Cash Competitions may require
						establishing a positive Account balance in any amount we or our developer partners determine. If
						you are a Cash Player, by submitting this information, you consent to allowing us and our
						developer partners to share your personal and payment information in confidence with third party
						service providers for the purposes of validating your identity and assessing the transaction
						risk associated with accepting your selected method of payment, and for any other purpose as
						detailed in our Privacy Policy. If you make a credit card deposit, an authorization request will
						be submitted to the issuing bank of at least Ten U.S. Dollars (US$10.00) to your credit limit,
						even if the actual amount charged may be lower. When you withdraw funds from your account, you
						may be required to submit your social security number or other identifying information. Failure
						to provide your social security number or other requested identifying information at that time
						may result in inability to process your withdrawal for any winnings.
					</Typography>
					<Typography variant="subtitle1">
						16.4. <strong>Bonus Funds</strong>. If you are a Cash Player then you may be granted bonus funds
						and/or credits (&ldquo;Bonus Funds&rdquo;). Bonus Funds can be used to enter Cash Competitions,
						but cannot be withdrawn or used for any other Service. When you enter a Cash Competition,
						US$0.01 (one U.S. cent) of Bonus Funds will be used to enter the competition for every US$0.10
						(ten U.S. cents) spent on the Cash Competition entry fee. Notwithstanding the foregoing,
						additional Bonus Funds will be used to enter Cash Competitions if Bonus Funds are the only
						currency available in your account. When you win a Cash Competition, any Bonus Funds that you
						have used to pay the entry fee will be returned to you and any additional winnings beyond your
						entry fee will be paid in U.S. Dollars. If you initiate a withdrawal of funds from your Account,
						you will forfeit all Bonus Funds currently in your Account. If you do not enter a Cash
						Competition within a continuous 60 day time period, all Bonus Funds in your account will be
						forfeited.
					</Typography>
					<Typography variant="subtitle1">
						16.5. <strong>Withdrawals</strong>. If you are a Cash Player, you may request a withdrawal of
						funds from your available Account balance at any time. Digital Assets and Bonus Funds cannot be
						withdrawn. Processing of requested funds is made by check or by refund to the payment method
						used to make your deposit and may take up to ninety (90) days; provided, however, that we, as
						agent for our developer partners, may freeze your Account and/or delay a request for withdrawal
						of funds pending completion of any investigation of reported or suspected Abuse, verification of
						eligibility or to comply with Applicable Laws. A check request processing fee of up to $2.00 for
						any withdrawal of less than $10.00 may be assessed.
					</Typography>
					<Typography variant="subtitle1">
						16.6. <strong>Closing Accounts</strong>; Forfeiture of Funds. If you close your Account, funds
						in your Account will be returned subject to the terms of Section 11.5. If your Account is
						unilaterally closed or terminated for cause as allowed in these Terms, funds in your Account may
						be forfeited and not returned to you.{' '}
					</Typography>
					<Typography variant="subtitle1">
						16.7. <strong>Account Monthly Maintenance Fee</strong>. If your Account is inactive (i.e. you
						have not entered at least one (1) tournament) for six (6) consecutive months or more, a
						maintenance fee of $2.00 per month may be charged (the &ldquo;Monthly Maintenance Fee&rdquo;).
						After five or more months of inactivity you will be notified by email that if your Account
						remains inactive for one more month, the Monthly Maintenance Fee will be deducted from your
						Account each consecutive month after that that it remains inactive. The Monthly Maintenance Fee
						will not be deducted from your Account if there are no funds in your Account. However, if your
						Account has no funds and has been inactive for twelve or more consecutive months, your Account
						may be closed.
					</Typography>
					<Typography variant="subtitle1">
						16.8. <strong>Refund Policy</strong>. Unless otherwise required by law, transactions completed
						on the site are final with no refund given.
					</Typography>
					<Typography variant="subtitle1">
						16.9. <strong>Winnings</strong>. If you are eligible to receive Winnings, in our capacity as
						agent for our developer partners, we may require that you provide proof that you are, or were at
						the time of your participation in the subject Competition, eligible to participate in accordance
						with these Terms and that your participation was in accordance with these Terms. If you do not
						provide such proof to our or our developer partners&rsquo; reasonable satisfaction, then you
						will not receive the relevant Winnings. If you receive a payment in error, we, as agent for our
						developer partners, may reverse or require return of the payment. You agree to cooperate with
						our efforts to do this, in our capacity as agent for our developer partners. We may also reduce
						payment to you without notice to adjust for any previous overpayment.
					</Typography>
					<Typography variant="subtitle1">
						16.10. <strong>Credit Card/PayPal Use</strong>. When you pay for any charges by credit card, you
						represent to us that you are the authorized user of such credit card. You must promptly notify
						us of any changes to your credit card account number, its expiration date and/or your billing
						address, or if your credit card expires or is canceled for any reason. We are not liable for any
						loss caused by any unauthorized use of your credit card or other method of payment by a third
						party (such as PayPal) in connection with the Services. Any attempt to defraud through the use
						of credit cards or other methods of payment, regardless of the outcome, or any failure by you to
						honor legitimate charges or requests for payment, will result in immediate termination of your
						Account, forfeiture of Winnings, and pursuit of civil litigation and/or criminal prosecution.
					</Typography>
					<Typography variant="subtitle1">
						16.11. <strong>Taxes.</strong> If you are a U.S. resident, we, as agent for our developer
						partners, may send you an IRS Form W-9 and 1099-MISC or other appropriate form if your Winnings
						total $600 or more in any given calendar year. Depending on the state in which you reside, we
						may also send you additional federal or state tax forms. Without limiting the foregoing, as
						agent for our developer partners, we may withhold from your existing Account balance and/or from
						future Winnings any amount required to be withheld by Applicable Laws, including amounts due in
						connection with your failure to complete relevant tax documentation, but you remain solely
						responsible for paying all federal, state and other taxes in accordance with all Applicable
						Laws.
					</Typography>
					<Typography variant="subtitle1">
						<strong>17. COPYRIGHT NOTICE</strong>&nbsp;
					</Typography>
					<Typography variant="subtitle1">
						We respect the intellectual property rights of others, and we ask you to do the same. In
						instances where we are notified of alleged infringing JIWEMAN content or Submissions, a decision
						may be made to remove or disable access to such content or Submissions, in compliance with the
						safe harbor provisions of the Digital Millennium Copyright Acr, 17 U.S.C, 512 (c).
					</Typography>
					<Typography variant="subtitle1">
						If you believe that you or someone else&rsquo;s copyright has been infringed by content or
						Submissions provided on this Site, you (or the owner or rights holder, collectively,
						&ldquo;Rights Holder&rdquo;) should send notification to us immediately. Prior to sending us
						notice, the Rights Holder may wish to consult a lawyer to determine their rights and legal
						obligations under the DMCA and any other applicable laws. Nothing here or anywhere on this Site
						is intended as a substitute for qualified legal advice. To file a Notice of Infringing Material,
						we ask that the Rights Holder provide the following information:
					</Typography>
					<ul type="disc">
						<li>
							Reasonably sufficient details about the nature of the copyrighted work in question, or, in
							the case of multiple alleged infringements, a representative list of such works. This should
							include, title(s), author(s), any U.S. Copyright Registration number(s), URL(s) etc.;
						</li>
						<li>
							Reasonably sufficient details to enable us to identify and locate the material that is
							allegedly infringing the Rights Holder&rsquo;s work(s) (for example, file name or URL of the
							page(s) that contain(s) the material);
						</li>
						<li>
							The Rights Holder&rsquo;s contact information so that we can contact them (including for
							example, the Rights Holder&rsquo;s address, telephone number, and email address);
						</li>
						<li>
							A statement that the Rights Holder has a good faith belief that the use of the material
							identified above in Part (ii) is not authorized by the copyright owner, its agent, or the
							law;
						</li>
						<li>
							A statement, under penalty of perjury, that the information in the notification is accurate
							and that the Rights Holder is authorized to act on behalf of the copyright owner; and
						</li>
						<li>The Rights Holder&rsquo;s signature or electronic signature.</li>
					</ul>
					<Typography variant="subtitle1">
						18. <strong>TERM AND TERMINATION</strong>
					</Typography>
					<Typography variant="subtitle1">
						These Terms apply to you and to us from the date that you accept them as provided above, until
						termination of your Account (whether by deactivation, cancellation, closure, expiration or
						termination by you or us). You may terminate these Terms at any time and for any reason by going
						to your Account webpage and following the account closure process. Upon termination of your
						Account, you must immediately discontinue use of the Services and the Software and your Account
						and promptly uninstall and delete all copies of the Software. Immediately upon termination of
						your Account, all license and rights granted to you under these Terms automatically terminate
						and you shall automatically forfeit the right to use Digital Assets. Your obligation to pay
						accrued Fees will survive any termination of these Terms. Any and all terms and conditions
						within these Terms which should, by their nature, survive termination of these Terms, will
						survive such termination.
					</Typography>
					<Typography variant="subtitle1">
						19. <strong>DISCLAIMERS</strong>.{' '}
					</Typography>
					<Typography variant="subtitle1">
						Your access to and use of the Services and content provided on the website or site are at YOUR
						OWN RISK. You understand and agree that the Services are provided to you on an "AS IS" and "AS
						AVAILABLE" basis. Without limiting the foregoing, to the maximum extent permitted under
						applicable law, (JIWEMAN ENTITIES are JIWEMAN founders, officers, directors, employees, agents,
						representatives, and partners) DISCLAIM ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS OR
						IMPLIED, OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
					</Typography>
					<Typography variant="subtitle1">
						JIWEMAN make no warranty and disclaim all responsibility and liability for: (i) the
						completeness, accuracy, availability, timeliness, security or reliability of the Services or any
						Content; (ii) any harm to your computer system, loss of data, or other harm that results from
						your access to or use of the Services or any Content; (iii) the deletion of, or the failure to
						store or to transmit, any Content and other communications maintained by the Services; and (iv)
						whether the Services will meet your requirements or be available on an uninterrupted, secure, or
						error-free basis. No advice or information, whether oral or written, obtained from JIWEMAN or
						through the Services, will create any warranty not expressly made herein.
					</Typography>
					<Typography variant="subtitle1">
						The Services may contain links to third-party websites or resources. You acknowledge and agree
						that the JIWEMAN is not responsible or liable for: (i) the availability or accuracy of such
						websites or resources; or (ii) the content, products, or services on or available from such
						websites or resources. Links to such websites or resources do not imply any endorsement by
						JIWEMAN of such websites or resources or the content, products, or services available from such
						websites or resources. You acknowledge sole responsibility for and assume all risk arising from
						your use of any such websites or resources.
					</Typography>
					<Typography variant="subtitle1">
						TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, JIWEMAN SHALL NOT BE LIABLE FOR ANY INDIRECT,
						INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
						WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOOD-WILL, OR OTHER
						INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
						SERVICES; (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES, INCLUDING WITHOUT
						LIMITATION, ANY DEFAMATORY, OFFENSIVE OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES; (iii)
						ANY CONTENT OBTAINED FROM THE SERVICES; OR (iv) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR
						TRANSMISSIONS OR CONTENT. IN NO EVENT SHALL THE AGGREGATE LIABILITY OF JIWEMAN EXCEED ZERO
						DOLLARS ($0.00). THE LIMITATIONS OF THIS SUBSECTION SHALL APPLY TO ANY THEORY OF LIABILITY,
						WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, AND TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, AND
						WHETHER OR NOT JIWEMAN HAVE BEEN INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE, AND EVEN IF A
						REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
					</Typography>
					<Typography variant="subtitle1">
						We reserve the right to change any and all Content and to modify, suspend or stop providing
						access to the Sites (or any features or functionality of the Sites) and the Products at any time
						without notice and without obligation or liability to you. Reference to any products, services,
						processes or other information by trade name, trademark, manufacturer, supplier, and vendor or
						otherwise does not constitute or imply endorsement, sponsorship or recommendation thereof, or
						any affiliation therewith, by us. Some jurisdictions do not allow the disclaimer of implied
						terms in contracts with consumers, so some or all of the disclaimers in this Section may not
						apply to you.
					</Typography>
					<Typography variant="subtitle1">
						<strong>20. DISPUTE RESOLUTION AND ARBITRATION</strong>
					</Typography>
					<Typography variant="subtitle1">
						20.1. <strong>General.</strong> This Section applies to any Dispute except for Disputes relating
						to the enforcement or validity of our intellectual property rights. The term
						&ldquo;Dispute&rdquo; means any dispute, action or other controversy between you and us
						concerning these Terms, the Services or any product, service or information we make available to
						you, whether in contract, warranty, tort, statute, regulation, ordinance or any other legal or
						equitable basis. &ldquo;Dispute&rdquo; will be given the broadest possible meaning allowable
						under law. In the event of a Dispute, you or we must give the other a Notice of Dispute, which
						is a written statement that sets forth the name, address and contact information of the party
						giving it, the facts giving rise to the Dispute, and the relief requested. You must send any
						Notice of Dispute by U.S. Mail to Jiweman Customer Support, Jiweman&rsquo;s Designated Agent is:
						Jiweman Inc. Attn: Legal Department,; 5830 E 2nd St, Ste. 7000 #1007 Casper Wyoming 82609 We
						will send any Notice of Dispute to you by U.S. Mail to your address if we have it, or otherwise
						to your email address. You and we will attempt to resolve any Dispute through informal
						negotiation within sixty (60) days from the date the Notice of Dispute is sent. After sixty (60)
						days, either you or we may commence arbitration. You may also litigate any Dispute in small
						claims court in your county of residence or Casper, Wyoming , if the Dispute meets all
						requirements to be heard in the small claims court. You may litigate in small claims court
						whether or not you negotiated informally first.
					</Typography>
					<Typography variant="subtitle1">
						14.2. <strong>Binding arbitration.</strong> If you and we do not resolve any Dispute by informal
						negotiation or in small claims court, any other effort to resolve the Dispute will be conducted
						exclusively by binding arbitration as described in this Section. Instead, all Disputes will be
						resolved before a neutral arbitrator, whose decision will be final except for a limited right of
						appeal under the Federal Arbitration Act. Any court with jurisdiction over the parties may
						enforce the arbitrator&rsquo;s award.
					</Typography>
					<Typography variant="subtitle1">
						14.3. <strong>Class action waiver</strong>. To the maximum extent permitted under applicable
						law, any proceedings to resolve or litigate any Dispute in any forum will be conducted solely on
						an individual basis. Neither you nor we will seek to have any Dispute heard as a class action or
						in any other proceeding in which either party acts or proposes to act in a representative
						capacity. No arbitration or proceeding will be combined with another without the prior written
						consent of all parties to all affected arbitrations or proceedings. If this waiver is found to
						be illegal or unenforceable as to all or some parts of a Dispute, then it won&rsquo;t apply to
						those parts. Instead, those parts will be severed and proceed in a court of law, with the
						remaining parts proceeding in arbitration.
					</Typography>
					<Typography variant="subtitle1">
						14.4. <strong>Arbitration procedure</strong>. If you are located within the United States,
						Canada, the United Kingdom or the European Union, or any of their territories, then any
						arbitration will be conducted by the American Arbitration Association (the &ldquo;AAA&rdquo;)
						under its Commercial Arbitration Rules. You and we each agree to commence arbitration only in
						Casper, Wyoming, USA. You may request a telephonic or in-person hearing by following the AAA
						rules. In a Dispute involving $10,000 or less, any hearing will be telephonic unless the
						arbitrator finds good cause to hold an in-person hearing instead. If you are located in a
						country other than listed above, then arbitration will be conducted by the International Court
						of Arbitration of the International Chamber of Commerce (ICC) pursuant to UNCITRAL rules, and
						the arbitration shall be conducted in English and the English version of these Terms (and not
						any translation) shall control, and both parties hereby agree to accord this arbitration
						agreement the broadest scope admissible under applicable Laws, and that it shall be interpreted
						in a non-restrictive manner. The arbitrator may award the same damages to you individually as a
						court could. The arbitrator may award declaratory or injunctive relief only to you individually,
						and only to the extent required to satisfy your individual claim. These Terms govern to the
						extent they conflict with the arbitrators&rsquo; commercial rules. The arbitrator may award
						compensatory damages, but shall NOT be authorized to award non-economic damages, such as for
						emotional distress, or pain and suffering or punitive or indirect, incidental or consequential
						damages. Each party shall bear its own attorneys&rsquo; fees, cost and disbursements arising out
						of the arbitration, and shall pay an equal share of the fees and costs of the arbitrator and
						AAA; however, the arbitrator may award to the prevailing party reimbursement of its reasonable
						attorneys&rsquo; fees and costs (including, for example, expert witness fees and travel
						expenses), and/or the fees and costs of the arbitrator. Within fifteen (15) calendar days after
						conclusion of the arbitration, the arbitrator shall issue a written award and a written
						statement of decision describing the material factual findings and conclusions on which the
						award is based, including the calculation of any damages awarded. Judgment on the award may be
						entered by any court of competent jurisdiction. The parties waive their right to commence any
						action or judicial proceeding in connection with a dispute hereunder, except for purposes of:
						(i) recognition and/or enforcement of the arbitration award or any other decision by the
						arbitral tribunal, (ii) obliging the other party to participate in the arbitration proceedings,
						(iii) requesting any type of conservative or interim measure in connection with the dispute
						prior to the constitution of the arbitral tribunal, (iv) requesting the appearance of witnesses
						and/or experts, and/or (v) requesting that any information and/or documentation discovery be
						complied with. By agreeing to this binding arbitration provision, you understand that you are
						waiving certain rights and protections which may otherwise be available if a claim or Dispute
						were determined by litigation in court, including, without limitation, the right to seek or
						obtain certain types of damages precluded by this arbitration provision, the right to a jury
						trial, certain rights of appeal, the right bring a claim as a class member in any purported
						class or representative proceeding, and the right to invoke formal rules of procedure and
						evidence.
					</Typography>
					<Typography variant="subtitle1">
						14.5. <strong>Claims or Disputes</strong>. Must be filed within one year. To the extent
						permitted by applicable law, any claim or Dispute under these Terms must be filed within one
						year from the date of the cause of action. If a claim or dispute isn&rsquo;t filed within one
						year, it&rsquo;s permanently barred.
					</Typography>
					<Typography variant="subtitle1">
						14.6. <strong>Equitable Relief</strong>. You agree that we would be irreparably damaged if these
						Terms were not specifically enforced. Therefore, in addition to any other remedy we may have at
						law, and notwithstanding our agreement to arbitrate Disputes, we are entitled without bond,
						other security, or proof of damages, to seek appropriate equitable remedies with respect to your
						violation of these Terms in any court of competent jurisdiction.
					</Typography>
					<Typography variant="subtitle1">
						14.7 <strong>Language of the Terms</strong>: If we provide a translated version of these Terms,
						the User Terms of Service, the Developer Terms and Conditions of Service, the Affiliate Program
						Terms of Service, the Jiweman Privacy Policy, or any other terms or policy, it is for
						informational purposes only. If the translated version means something different than the
						English version, then the English meaning will be the one that applies.
					</Typography>
					<Typography variant="subtitle1">
						17. <strong>CHANGES</strong>
					</Typography>
					<Typography variant="subtitle1">
						If JIWEMAN decides to change these general terms and conditions, we will post the changed terms
						and conditions on the Website. You are advised to regularly check whether they have changed.
						Existing contracts will not be affected by such changes.{' '}
					</Typography>
					<Typography variant="subtitle1">
						18. <strong>GOVERNING LAW AND JURISDICTION</strong>
					</Typography>
					<Typography variant="subtitle1">
						This general terms and conditions in relation to the use of the website is hereby governed by,
						and constructed and enforced in accordance with the laws of Wyoming. The competent courts in
						Wyoming, shall have the exclusive jurisdiction to resolve any dispute between you and JIWEMAN.
					</Typography>
				</div>
			}
		/>
	);
}

export default TermsConditions;
