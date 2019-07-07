import IZalarify from '../ethereum/abis/IZalarify.json';
import IReceiptRegistry from '../ethereum/abis/IReceiptRegistry.json';
import IZalarifyCompany from '../ethereum/abis/IZalarifyCompany.json';

// StablePay ABIs
import IStablePay from '../ethereum/abis/IStablePay.json';
import IProviderRegistry from '../ethereum/abis/IProviderRegistry.json';

const config = {};

config.ropsten = {
    network: 'ropsten',
    explorer: {
        tx: 'https://ropsten.etherscan.io/tx/',
        address: 'https://ropsten.etherscan.io/address/'
    },
    urls: {
        backend: 'http://localhost:8080/api/v1',
        // https://zalarify-api.herokuapp.com/api/v1/companies
    },
    contracts: [
        {
            name: 'IZalarify',
            abi: IZalarify, // ZalarifyBase
            address: '0x08B2fF488D807437Fad2DA3Aa7Db81a67aFF33CD'
        },
        {
            name: 'IZalarifyCompany',
            abi: IZalarifyCompany,
            address: undefined
        },
        {
            name: 'IReceiptRegistry',
            abi: IReceiptRegistry,
            address: '0xD6B5Cd4d327973D6109388DEF81f5776E98733F7'
        },
        {
            name: 'IStablePay',
            abi: IStablePay,
            address: '0xeb1366C0777383BBbbD1E4cA65003B7A6E576742'
        },
        {
            name: 'IProviderRegistry',
            abi: IProviderRegistry,
            address: '0x9E527e631b4edbef9b4b85e4EfCa7702edC96B1c'
        }
    ]
};

export function getContracts (network) {
    const networkConfig = config[network.toLowerCase()];
    if(networkConfig === undefined) {
        throw new Error(`Not configuration for network ${network}.`);
    }
    return networkConfig.contracts;
};

export function getConfig (network) {
    const networkConfig = config[network.toLowerCase()];
    if(networkConfig === undefined) {
        throw new Error(`Not configuration for network ${network}.`);
    }
    return networkConfig;
};

export function getCurrentConfig () {
    return getConfig('ropsten');
};