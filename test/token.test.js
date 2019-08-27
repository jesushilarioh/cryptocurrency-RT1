const Token = artifacts.require("../contracts/Token.sol")

contract('Token', accounts => {
  let tokenInstance;

  it('initializes the contract with the correct values', () => {
    return Token.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.name()
      })
      .then(name => {
        assert.equal(name, 'Radagast Token #1', 'has correct name')
        return tokenInstance.symbol()
      })
      .then(symbol => {
        assert.equal(symbol, 'RT1', 'has correct symbol')
        return tokenInstance.standard()
      })
      .then(standard => {
        assert.equal(standard, 'Radagast Token #1 v1.0')
      })
  })

  it('allocates the initial supply upon deploymet', () => {
    return Token.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.totalSupply()
      })
      .then(totalSupply => {
        // console.log(tokenInstance);
        assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
        return tokenInstance.balanceOf(accounts[0])
      })
      .then(adminBalance => {
        assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the inital supply to the admin')
      })  
  })

  it('transfers token ownership', () => {
    return Token.deployed()
      .then(instance => {
        tokenInstance = instance;
        // Test 'require' statement first by transfering something larger than the sender's balance
        return tokenInstance.transfer.call(accounts[1], 99999999999)
      })
      .then(assert.fail)
      .catch(error => {
        // console.log(error.message)
        assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
        return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] })
      })
      .then(success => {
        assert.equal(success, true, 'it returns true')
        return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0]})
      })
      .then(receipt => {
        // console.log(receipt)
        // console.log(receipt.logs)
        // console.log(receipt.logs.length)
        assert.equal(receipt.logs.length, 1, 'triggers one event')
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
        assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferd from')
        assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to')
        assert.equal(receipt.logs[0].args._value.toNumber(), 250000, 'logs the transfer amount')
        // console.log(receipt.logs[0].args._value)
        // console.log(tokenInstance)
        return tokenInstance.balanceOf(accounts[1])
      })
      .then(account2Balance => {
        // console.log(account2Balance.toNumber())
        assert.equal(account2Balance.toNumber(), 250000, 'adds the amount to receiving account')
        return tokenInstance.balanceOf(accounts[0])
      })
      .then((account1Balance, account3Balance) => {
        // console.log(account1Balance.toNumber())
        assert.equal(account1Balance.toNumber(), 750000, 'deducts the amount fom the sending account')
        return tokenInstance.balanceOf(accounts[2])
      })
      .then(account3Balance => {
        assert.equal(account3Balance.toNumber(), 0, 'account #3 has no tokens')
    })
    
  })
})

