export default [
	{
		name: 'Rwanda',
		beyonicCountryId: 7,
		supportedNetworks: 'MTN, TIGO',
		pgCharges: 3.5,
		pgChargesType: 'percentage',
		pgPaymentCharges: 0.07,
		pgPaymentChargesType: 'fixed',
		networkCharges: [
			{
				min: 0,
				max: 1000,
				charge: 15
			},
			{
				min: 1001,
				max: 9999999999,
				charge: 22
			}
		]
	},
	{
		name: 'Ghana',
		beyonicCountryId: 5,
		supportedNetworks: 'MTN, Airtel, Vodafone, Expresso, Globacom, Tigo',
		pgCharges: 3,
		pgChargesType: 'percentage',
		pgPaymentCharges: 0.07,
		pgPaymentChargesType: 'fixed',
		networkCharges: [
			{
				min: 0,
				max: 1000,
				charge: 15
			},
			{
				min: 1001,
				max: 9999999999,
				charge: 22
			}
		]
	},
	{
		name: 'Kenya',
		beyonicCountryId: 3,
		supportedNetworks: 'Safaricom MPESA',
		pgCharges: 2.5,
		pgChargesType: 'percentage',
		pgPaymentCharges: 0.07,
		pgPaymentChargesType: 'fixed',
		networkCharges: [
			{
				min: 0,
				max: 1000,
				charge: 15
			},
			{
				min: 1001,
				max: 9999999999,
				charge: 22
			}
		]
	},
	{
		name: 'Uganda',
		beyonicCountryId: 2,
		supportedNetworks: 'MTN, Airtel, UTL, Africell',
		pgCharges: 4,
		pgChargesType: 'percentage',
		pgPaymentCharges: 0.07,
		pgPaymentChargesType: 'fixed',
		networkCharges: [
			{
				min: 0,
				max: 1000,
				charge: 15
			},
			{
				min: 1001,
				max: 9999999999,
				charge: 22
			}
		]
	},
	{
		name: 'Tanzania',
		beyonicCountryId: 6,
		supportedNetworks: 'Vodacom (MPESA), Airtel, TIGO, Halotel',
		pgCharges: 3.5,
		pgChargesType: 'percentage',
		pgPaymentCharges: 0.07,
		pgPaymentChargesType: 'fixed',
		networkCharges: [
			{
				min: 0,
				max: 1000,
				charge: 15
			},
			{
				min: 1001,
				max: 9999999999,
				charge: 22
			}
		]
	}
];
