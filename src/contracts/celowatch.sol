// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Celowatch {
    uint private watchesLength = 0;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address private admin;
    struct Watch {
        address payable owner;
        string name;
        string image;
        string description;
        uint price;
    }

    mapping(uint => Watch) private watches;
    mapping(uint => bool) public exist;

    /// @dev checks if watch with _index exist
    modifier exists(uint _index) {
        require(exist[_index], "Query of non existent watch");
        _;
    }

    /// @dev checks if caller is the owner of watch with _index
    modifier isOwner(uint _index) {
        require(msg.sender == watches[_index].owner, "Unauthorized user");
        _;
    }
    /// @dev checks if description is not an empty string
    modifier checkDescription(string memory _description) {
        require(bytes(_description).length > 0, "Empty description");
        _;
    }

    /// @dev checks if price is at least greater than zero
    modifier checkPrice(uint _price) {
        require(_price > 0, "price must be above 0");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @dev adding a new watch to the marketplace
    /// @param _image is the image url of the watch
    function addWatch(
        string memory _name,
        string memory _image,
        string memory _description,
        uint _price
    ) external checkDescription(_description) checkPrice(_price) {
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_image).length > 0, "Empty image url");
        watches[watchesLength] = Watch(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _price
        );
        exist[watchesLength] = true;
        watchesLength++;
    }

    /// @dev getting a watch from the block-chain
    function getWatch(uint _index)
        public
        view
        exists(_index)
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            uint
        )
    {
        return (
            watches[_index].owner,
            watches[_index].name,
            watches[_index].image,
            watches[_index].description,
            watches[_index].price
        );
    }

    /// @dev updates the description of a watch
    function updateDescription(uint _index, string memory _description)
        external
        exists(_index)
        isOwner(_index)
        checkDescription(_description)
    {
        watches[_index].description = _description;
    }

    /// @dev updates the price of a watch
    function updatePrice(uint _index, uint _price)
        external
        exists(_index)
        isOwner(_index)
        checkPrice(_price)
    {
        watches[_index].price = _price;
    }

    /// @dev removes a watch and clean up of data
    /// @notice callable only by watch owner or admin
    function removeWatch(uint _index) external exists(_index) {
        require(
            msg.sender == admin || msg.sender == watches[_index].owner,
            "Unauthorized user"
        );
        watches[_index] = watches[watchesLength - 1];
        delete watches[watchesLength - 1];
        exist[watchesLength - 1] = false;
        watchesLength--;
    }

    /// @dev buying a watch and transferring the ownership to the buyer
    function buyWatch(uint _index) external payable exists(_index) {
        require(
            msg.sender != watches[_index].owner,
            "You can't buy your own watch"
        );
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

    /// @dev returns the number of watches in marketplace
    function getWatchesLength() public view returns (uint) {
        return (watchesLength);
    }
}
