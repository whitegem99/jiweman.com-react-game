export default [
    {
        name: 'Rwanda',
        currency: 'RWF',
        beyonicCountryId: 7,
        supportedNetworks: 'MTN, TIGO',
        pgCharges: 0.035,
        pgChargesType: 'percentage',
        pgPaymentCharges: 0.07,
        pgPaymentChargesType: 'fixed',
        networkCharges: [
            {
                min: 0,
                max: 1000,
                charge: 15,
            },
            {
                min: 1001,
                max: 9999999999,
                charge: 22,
            },
        ],
    },
    {
        name: 'Ghana',
        currency: 'GHS',
        beyonicCountryId: 5,
        supportedNetworks: 'MTN, Airtel, Vodafone, Expresso, Globacom, Tigo',
        pgCharges: 0.03,
        pgChargesType: 'percentage',
        pgPaymentCharges: 0.07,
        pgPaymentChargesType: 'fixed',
        networkCharges: [
            {
                min: 0,
                max: 1000,
                charge: 15,
            },
            {
                min: 1001,
                max: 9999999999,
                charge: 22,
            },
        ],
    },
    {
        name: 'Kenya',
        currency: 'KES',
        beyonicCountryId: 3,
        supportedNetworks: 'Safaricom MPESA',
        pgCharges: 0.03,
        pgChargesType: 'percentage',
        pgPaymentCharges: 0.07,
        pgPaymentChargesType: 'fixed',
        networkCharges: [
            {
                min: 0,
                max: 1000,
                charge: 15,
            },
            {
                min: 1001,
                max: 9999999999,
                charge: 22,
            },
        ],
    },
    {
        name: 'Uganda',
        currency: 'UGX',
        beyonicCountryId: 2,
        supportedNetworks: 'MTN, Airtel, UTL, Africell',
        pgCharges: 0.04,
        pgChargesType: 'percentage',
        pgPaymentCharges: 0.07,
        pgPaymentChargesType: 'fixed',
        networkCharges: [
            {
                min: 0,
                max: 1000,
                charge: 15,
            },
            {
                min: 1001,
                max: 9999999999,
                charge: 22,
            },
        ],
    },
    {
        name: 'Tanzania',
        currency: 'TZS',
        beyonicCountryId: 6,
        supportedNetworks: 'Vodacom (MPESA), Airtel, TIGO, Halotel',
        pgCharges: 0.035,
        pgChargesType: 'percentage',
        pgPaymentCharges: 0.07,
        pgPaymentChargesType: 'fixed',
        networkCharges: [
            {
                min: 0,
                max: 1000,
                charge: 15,
            },
            {
                min: 1001,
                max: 9999999999,
                charge: 22,
            },
        ],
    },
];