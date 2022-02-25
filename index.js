const fs = require('fs')
const Web3 = require('web3');
const ERC721 = require('./abi/ERC721.json');

async function getMinters(filename, contractAddress, startBlock) {
  fs.writeFile(filename, 'tokenId,minter\n', { flag: 'a+' }, err => {});
  console.log('Started ' + filename);

  const web3 = new Web3('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
  const contract = new web3.eth.Contract(
    ERC721,
    contractAddress.toLowerCase()
  );

  const currentBlock = await web3.eth.getBlockNumber();
  let block = startBlock;

  while (block < currentBlock) {
    let content = '';
    
    const events = await contract.getPastEvents('Transfer', {
      filter: {from: '0x0000000000000000000000000000000000000000'},
      fromBlock: block,
      toBlock: block + 5000
    });

    events.forEach(event => {
      content += event.returnValues.tokenId + ',' + event.returnValues.to + '\n';
    });

    fs.writeFile(filename, content, { flag: 'a+' }, err => {});
    console.log(block + ' - ' + (block + 5000));
    block += 5000;
  }

  console.log('Finished ' + filename);
}

getMinters('LazyLions.csv', '0x8943C7bAC1914C9A7ABa750Bf2B6B09Fd21037E0', 12969037);
getMinters('LazyLionsBungalows.csv', '0xd80eeF7484c8fab1912A43E44a97774093007ab1', 13294949);
