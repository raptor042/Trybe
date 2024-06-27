// web3Config.ts
import { Web3Modal } from '@web3modal/ethers';
import { providers } from 'ethers';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: () => import('@walletconnect/web3-provider'),
      options: {
        infuraId: 'YOUR_INFURA_ID', // Replace with your Infura ID
      },
    },
  },
});

export default web3Modal;
