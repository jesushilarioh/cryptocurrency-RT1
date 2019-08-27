pragma solidity ^0.5.0;

contract Token {
  string public name = "Radagast Token #1";
  string public symbol = "RT1";
  string public standard = "Radagast Token #1 v1.0";
  uint256 public totalSupply;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  // Used to store the balance of each account that owns tokens
  mapping (address => uint256) public balanceOf;
  mapping (address => mapping (address => uint256)) public allowance;

  constructor (uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  // Allows user to send tokens to another account
  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value, 'not enough in balance');

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  // Allows another account to spend tokens, like on a cryptocurrency exchange
  function approve(address _spender, uint256 _value) public returns (bool success) {
    // Updates the allowance mapping to see
    // how much the account is allows to spend
    allowance[msg.sender][_spender] = _value;

    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  // Allos another account to transfer tokens
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(_value <= balanceOf[_from], 'insufficient tokens in balance');
    require(_value <= allowance[_from][msg.sender], 'insufficient tokens in allowance');

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    allowance[_from][msg.sender] -= _value;

    emit Transfer(_from, _to, _value);

    return true;
  }
}