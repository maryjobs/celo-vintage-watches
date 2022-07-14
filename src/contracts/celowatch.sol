// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Celowatch {

    uint internal watchesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Watch {
        address payable owner;
        string name;
        string image;
        string description;
        uint price;
    }

    mapping (uint => Watch) internal watches;

    modifier onlyOwner(uint _index){
        require(msg.sender == watches[_index].owner, "Only the owner can access this function");
        _;
    }


// adding a new watch to the marketplace
    function addWatch(
        string memory _name,
        string memory _image,
        string memory _description,  
        uint _price
    ) public {
        watches[watchesLength] = Watch(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _price
        );
        watchesLength++;
    }
// getting a watch from the block-chain
    function getWatch(uint _index) public view returns (
        address payable,
        string memory, 
        string memory,  
        string memory,  
        uint
    ) {
        return (
            watches[_index].owner,
            watches[_index].name, 
            watches[_index].image, 
            watches[_index].description, 
            watches[_index].price
           
        );
    }

// updating the description of a watch
     function updateDescription(uint _index, string memory _description) external onlyOwner(_index){
        watches[_index].description = _description;
    }
// updating the price of a watch
    function updatePrice(uint _index, uint _price) external onlyOwner(_index){
         require(_price > 0, "price must be above 0");
         watches[_index].price = _price;
    }

// removing a watch from the mapping using the index
    function removeWatch(uint _index) external onlyOwner(_index){         
            watches[_index] = watches[watchesLength - 1];
            delete watches[watchesLength - 1];
            watchesLength--; 
	 }

// buying a watch and transferring the ownership to the buyer
    function buyWatch(uint _index) public payable  {
        require(msg.sender != watches[_index].owner, "You can't buy your watch");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            watches[_index].owner,
            watches[_index].price
          ),
          "Transfer failed."
        );
        watches[_index].owner = payable(msg.sender);
    }
    // the length of all watch in the marketplace
    function getWatchesLength() public view returns (uint) {
        return (watchesLength);
    }
}